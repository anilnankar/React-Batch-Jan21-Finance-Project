# Module-Wise Design Document
## Finance System (Clean Architecture)

**Document Version:** 1.0  
**Date:** 20-Mar-2026  
**Related Document:** `documents/SRS_Finance_Management_System.md`

---

## 1. Architecture Approach (Clean Architecture)

### 1.1 Layering Standard (Applied to All Modules)
- **Domain Layer:** Entities, Value Objects, Domain Services, Domain Events, Business Invariants
- **Application Layer:** Use Cases, DTOs, Validators, Orchestration, Authorization checks
- **Interface Layer:** REST Controllers, Request/Response Models, Exception Mapping
- **Infrastructure Layer:** Repositories, ORM mappings, External provider adapters, Message bus, Cache, Audit sink

### 1.2 Dependency Rule
- Inner layers do not depend on outer layers.
- Domain remains framework-agnostic.
- Application depends on Domain interfaces.
- Infrastructure implements repository/provider interfaces.

### 1.3 Cross-Cutting Standards
- Correlation ID for every request
- Idempotency key for write APIs
- Maker-checker for sensitive operations
- Structured audit logging for every state mutation
- UTC timestamps and monetary precision using decimal(18,2) or finer where required

---

## 2. Module 1: Customer Management

### 2.1 Purpose
Manage customer onboarding, KYC lifecycle, risk profiling, and customer master data used by all downstream modules.

### 2.2 Key Features
- Customer profile creation (individual/entity)
- KYC document capture and verification
- Risk categorization (Low/Medium/High)
- PEP/sanctions screening status tracking
- Periodic KYC refresh and expiry alerts

### 2.3 Database Tables (with fields)

#### `customers`
- `customer_id` (PK, UUID)
- `customer_type` (INDIVIDUAL/BUSINESS)
- `full_name`
- `date_of_birth_or_incorp`
- `mobile_number`
- `email`
- `pan_number`
- `aadhaar_ref` (tokenized/masked reference, nullable)
- `status` (DRAFT/PENDING_KYC/ACTIVE/RESTRICTED/SUSPENDED/CLOSED)
- `risk_category` (LOW/MEDIUM/HIGH)
- `kyc_status` (PENDING/VERIFIED/REJECTED/EXPIRED)
- `created_at`, `updated_at`

#### `customer_addresses`
- `address_id` (PK, UUID)
- `customer_id` (FK -> customers.customer_id)
- `address_type` (CURRENT/PERMANENT/BUSINESS)
- `line1`, `line2`, `city`, `state`, `postal_code`, `country`
- `is_primary`
- `created_at`, `updated_at`

#### `kyc_documents`
- `document_id` (PK, UUID)
- `customer_id` (FK)
- `document_type` (PAN/AADHAAR/PASSPORT/DRIVING_LICENSE/INCORP_CERT/OTHER)
- `document_number_masked`
- `storage_uri`
- `verification_status` (PENDING/VERIFIED/REJECTED)
- `verified_by`, `verified_at`
- `expiry_date` (nullable)
- `created_at`, `updated_at`

#### `customer_screening`
- `screening_id` (PK, UUID)
- `customer_id` (FK)
- `screening_type` (PEP/SANCTIONS/ADVERSE_MEDIA)
- `provider_ref`
- `result` (CLEAR/POTENTIAL_MATCH/CONFIRMED_MATCH)
- `review_status` (OPEN/UNDER_REVIEW/CLOSED)
- `review_notes`
- `created_at`, `updated_at`

### 2.4 APIs (request/response)

#### POST `/api/v1/customers`
**Request**
```json
{
  "customerType": "INDIVIDUAL",
  "fullName": "Rahul Sharma",
  "dateOfBirthOrIncorp": "1994-02-11",
  "mobileNumber": "9876543210",
  "email": "rahul@example.com",
  "panNumber": "ABCDE1234F"
}
```
**Response (201)**
```json
{
  "customerId": "cst_4f2f8a2e",
  "status": "PENDING_KYC",
  "kycStatus": "PENDING",
  "createdAt": "2026-03-20T10:15:22Z"
}
```

#### POST `/api/v1/customers/{customerId}/kyc-documents`
**Request**
```json
{
  "documentType": "PAN",
  "documentNumber": "ABCDE1234F",
  "fileToken": "tmp_upload_9898"
}
```
**Response (200)**
```json
{
  "documentId": "doc_7b1d",
  "verificationStatus": "PENDING"
}
```

#### GET `/api/v1/customers/{customerId}`
**Response (200)**
```json
{
  "customerId": "cst_4f2f8a2e",
  "fullName": "Rahul Sharma",
  "status": "ACTIVE",
  "riskCategory": "LOW",
  "kycStatus": "VERIFIED"
}
```

### 2.5 Business Logic
- Customer cannot move to `ACTIVE` unless mandatory KYC documents are verified.
- Risk category auto-derived from rules (residency, occupation, transaction profile, screening hits).
- Any confirmed sanctions/PEP match forces status to `RESTRICTED`.
- KYC expiry triggers account operation restrictions until refresh completion.

### 2.6 Edge Cases
- Duplicate PAN attempt across active customers.
- Name mismatch between profile and KYC record.
- Document verification timeout or provider downtime.
- Partial onboarding saved as draft and resumed later.
- Minor customer or restricted legal entity onboarding rules.

---

## 3. Module 2: Account Management

### 3.1 Purpose
Handle account lifecycle including creation, operational state control, balance metadata, and closure.

### 3.2 Key Features
- Account opening (Savings/Current/Loan-linked/Internal)
- Account status transitions (Active/Freeze/Dormant/Closed)
- Joint/authorized operations model
- Account limits and operational controls
- Account closure with settlement validation

### 3.3 Database Tables (with fields)

#### `accounts`
- `account_id` (PK, UUID)
- `account_number` (unique)
- `customer_id` (FK -> customers.customer_id)
- `account_type` (SAVINGS/CURRENT/LOAN_LINKED/INTERNAL)
- `currency_code`
- `status` (ACTIVE/FROZEN/DEBIT_BLOCK/CREDIT_BLOCK/DORMANT/CLOSED)
- `opening_date`
- `closing_date` (nullable)
- `available_balance` (decimal)
- `ledger_balance` (decimal)
- `created_at`, `updated_at`

#### `account_controls`
- `control_id` (PK, UUID)
- `account_id` (FK)
- `control_type` (TXN_LIMIT/DEBIT_BLOCK/CREDIT_BLOCK/KYC_RESTRICTION)
- `control_value` (json/text)
- `effective_from`, `effective_to`
- `created_by`
- `created_at`

#### `account_signatories`
- `signatory_id` (PK, UUID)
- `account_id` (FK)
- `customer_id` (FK)
- `role` (PRIMARY/JOINT/AUTHORIZED)
- `permission_scope` (VIEW/DEBIT/CREDIT/FULL)
- `status` (ACTIVE/REVOKED)
- `created_at`, `updated_at`

### 3.4 APIs (request/response)

#### POST `/api/v1/accounts`
**Request**
```json
{
  "customerId": "cst_4f2f8a2e",
  "accountType": "SAVINGS",
  "currencyCode": "INR"
}
```
**Response (201)**
```json
{
  "accountId": "acc_92817",
  "accountNumber": "100012345678",
  "status": "ACTIVE"
}
```

#### PATCH `/api/v1/accounts/{accountId}/status`
**Request**
```json
{
  "status": "DEBIT_BLOCK",
  "reasonCode": "KYC_EXPIRED"
}
```
**Response (200)**
```json
{
  "accountId": "acc_92817",
  "oldStatus": "ACTIVE",
  "newStatus": "DEBIT_BLOCK"
}
```

#### GET `/api/v1/accounts/{accountId}/balance`
**Response (200)**
```json
{
  "accountId": "acc_92817",
  "availableBalance": 15320.75,
  "ledgerBalance": 15320.75,
  "currencyCode": "INR"
}
```

### 3.5 Business Logic
- Account creation requires customer status = `ACTIVE` and KYC status = `VERIFIED`.
- Available balance = ledger balance - holds/blocks.
- Debits denied if account is `DEBIT_BLOCK`, `FROZEN`, `DORMANT`, or `CLOSED`.
- Dormancy is auto-evaluated based on inactivity period; reactivation requires approval.

### 3.6 Edge Cases
- Same customer requests duplicate account type within cooling window.
- Concurrent freeze and closure requests.
- Backdated status correction after compliance override.
- Joint account signatory revoked during pending transaction.

---

## 4. Module 3: Transactions

### 4.1 Purpose
Execute and track financial transactions with validation, idempotency, posting orchestration, and reconciliation support.

### 4.2 Key Features
- Deposit, withdrawal, transfer, adjustment
- Transaction validation engine
- Idempotent processing
- Reversal and correction workflows
- End-of-day reconciliation support

### 4.3 Database Tables (with fields)

#### `transactions`
- `txn_id` (PK, UUID)
- `txn_reference` (unique)
- `txn_type` (DEPOSIT/WITHDRAWAL/TRANSFER/ADJUSTMENT)
- `channel` (BRANCH/API/BATCH/SYSTEM)
- `from_account_id` (nullable FK)
- `to_account_id` (nullable FK)
- `amount` (decimal)
- `currency_code`
- `status` (INITIATED/PENDING/POSTED/FAILED/REVERSED)
- `idempotency_key`
- `remarks`
- `created_at`, `updated_at`

#### `transaction_events`
- `event_id` (PK, UUID)
- `txn_id` (FK)
- `event_type` (VALIDATED/POSTED/REVERSED/FAILED/NOTIFIED)
- `event_payload` (json/text)
- `created_at`

#### `reconciliation_items`
- `recon_id` (PK, UUID)
- `business_date`
- `txn_id` (FK)
- `source_amount`, `ledger_amount`
- `status` (MATCHED/UNMATCHED/RESOLVED)
- `resolution_notes`
- `resolved_by`, `resolved_at`

### 4.4 APIs (request/response)

#### POST `/api/v1/transactions/transfer`
**Request**
```json
{
  "fromAccountId": "acc_1001",
  "toAccountId": "acc_1002",
  "amount": 2500.00,
  "currencyCode": "INR",
  "idempotencyKey": "idem-20260320-0001"
}
```
**Response (201)**
```json
{
  "transactionId": "txn_90ac",
  "status": "POSTED",
  "postedAt": "2026-03-20T12:31:20Z"
}
```

#### POST `/api/v1/transactions/{txnId}/reverse`
**Request**
```json
{
  "reasonCode": "WRONG_BENEFICIARY",
  "requestedBy": "ops.user1"
}
```
**Response (202)**
```json
{
  "transactionId": "txn_90ac",
  "status": "PENDING",
  "workflow": "MAKER_CHECKER"
}
```

#### GET `/api/v1/transactions/{txnId}`
**Response (200)**
```json
{
  "transactionId": "txn_90ac",
  "txnType": "TRANSFER",
  "amount": 2500.0,
  "status": "POSTED"
}
```

### 4.5 Business Logic
- Validate account states, limits, compliance rules, and sufficient available balance.
- Acquire account-level lock ordering (`min(accountId) -> max(accountId)`) for transfer consistency.
- Persist transaction in `INITIATED`, then post ledger entries atomically.
- Idempotency key returns existing result for retries within retention window.
- Reversal only allowed on eligible posted transactions and within policy window.

### 4.6 Edge Cases
- Duplicate API retry due to timeout.
- Partial failure between debit and credit (must rollback or compensate deterministically).
- Self-transfer where source and destination are same account.
- Currency mismatch in same transaction.
- Reversal requested after period closure.

---

## 5. Module 4: Loans

### 5.1 Purpose
Manage loan product setup, origination, disbursement, repayment, delinquency tracking, and lifecycle controls.

### 5.2 Key Features
- Loan product configuration
- Application intake and underwriting
- EMI schedule generation
- Repayment allocation waterfall
- Delinquency, DPD, and NPA classification

### 5.3 Database Tables (with fields)

#### `loan_products`
- `product_id` (PK, UUID)
- `product_code` (unique)
- `name`
- `interest_model` (FLAT/REDUCING)
- `min_tenure_months`, `max_tenure_months`
- `min_rate`, `max_rate`
- `processing_fee_rule` (json/text)
- `late_fee_rule` (json/text)
- `is_active`
- `created_at`, `updated_at`

#### `loan_accounts`
- `loan_id` (PK, UUID)
- `customer_id` (FK)
- `product_id` (FK)
- `principal_amount` (decimal)
- `sanctioned_rate` (decimal)
- `tenure_months`
- `disbursed_amount` (decimal)
- `loan_status` (APPLIED/APPROVED/DISBURSED/ACTIVE/CLOSED/WRITTEN_OFF)
- `disbursed_at` (nullable)
- `created_at`, `updated_at`

#### `loan_schedules`
- `schedule_id` (PK, UUID)
- `loan_id` (FK)
- `installment_no`
- `due_date`
- `principal_due` (decimal)
- `interest_due` (decimal)
- `charges_due` (decimal)
- `status` (DUE/PAID/PARTIAL/OVERDUE)
- `created_at`, `updated_at`

#### `loan_repayments`
- `repayment_id` (PK, UUID)
- `loan_id` (FK)
- `txn_id` (FK -> transactions.txn_id)
- `amount_paid` (decimal)
- `alloc_charges` (decimal)
- `alloc_interest` (decimal)
- `alloc_principal` (decimal)
- `paid_at`
- `created_at`

### 5.4 APIs (request/response)

#### POST `/api/v1/loans/applications`
**Request**
```json
{
  "customerId": "cst_4f2f8a2e",
  "productCode": "PL_STD",
  "principalAmount": 300000,
  "tenureMonths": 24
}
```
**Response (201)**
```json
{
  "loanId": "loan_8812",
  "loanStatus": "APPLIED"
}
```

#### POST `/api/v1/loans/{loanId}/disburse`
**Request**
```json
{
  "disbursedAmount": 295000,
  "disbursementAccountId": "acc_loan_pool_1"
}
```
**Response (200)**
```json
{
  "loanId": "loan_8812",
  "loanStatus": "DISBURSED",
  "disbursedAt": "2026-03-20T13:00:00Z"
}
```

#### POST `/api/v1/loans/{loanId}/repayments`
**Request**
```json
{
  "amount": 15000,
  "paymentAccountId": "acc_1001"
}
```
**Response (200)**
```json
{
  "loanId": "loan_8812",
  "repaymentId": "rep_9821",
  "allocation": {
    "charges": 500,
    "interest": 4000,
    "principal": 10500
  }
}
```

### 5.5 Business Logic
- Underwriting verifies eligibility, KYC, risk score, and policy caps.
- Schedule generation formula chosen by product interest model.
- Repayment waterfall: charges -> interest -> principal.
- DPD recalculated daily from unpaid installment due dates.
- NPA tagging triggered by policy thresholds and logged for compliance.

### 5.6 Edge Cases
- Part-payment less than overdue charges.
- Backdated disbursement correction after schedule generation.
- Pre-closure with foreclosure charges and interest rebate.
- Restructure after multiple missed installments.
- Loan write-off then recovery event handling.

---

## 6. Module 5: Ledger

### 6.1 Purpose
Provide immutable financial postings and accounting control through double-entry bookkeeping.

### 6.2 Key Features
- Journal creation with debit/credit balancing
- Chart of Accounts (CoA) mapping by event
- Period close controls
- Trial balance and accounting extracts
- Adjustment entries with approval workflow

### 6.3 Database Tables (with fields)

#### `chart_of_accounts`
- `gl_code` (PK)
- `gl_name`
- `gl_type` (ASSET/LIABILITY/INCOME/EXPENSE/EQUITY)
- `parent_gl_code` (nullable)
- `is_postable`
- `status` (ACTIVE/INACTIVE)
- `created_at`, `updated_at`

#### `journal_entries`
- `journal_id` (PK, UUID)
- `entry_date`
- `source_module` (TRANSACTIONS/LOANS/CHARGES/MANUAL)
- `source_ref_id`
- `description`
- `status` (DRAFT/POSTED/REVERSED)
- `created_by`, `approved_by` (nullable)
- `created_at`, `updated_at`

#### `journal_lines`
- `line_id` (PK, UUID)
- `journal_id` (FK)
- `gl_code` (FK -> chart_of_accounts.gl_code)
- `debit_amount` (decimal)
- `credit_amount` (decimal)
- `currency_code`
- `line_narration`

#### `accounting_periods`
- `period_id` (PK, UUID)
- `period_month`
- `period_year`
- `status` (OPEN/CLOSING/CLOSED)
- `closed_at` (nullable)
- `closed_by` (nullable)

### 6.4 APIs (request/response)

#### POST `/api/v1/ledger/journals`
**Request**
```json
{
  "sourceModule": "MANUAL",
  "description": "Interest income correction",
  "lines": [
    { "glCode": "100100", "debitAmount": 1200, "creditAmount": 0 },
    { "glCode": "400200", "debitAmount": 0, "creditAmount": 1200 }
  ]
}
```
**Response (201)**
```json
{
  "journalId": "jr_7878",
  "status": "DRAFT"
}
```

#### POST `/api/v1/ledger/journals/{journalId}/post`
**Response (200)**
```json
{
  "journalId": "jr_7878",
  "status": "POSTED"
}
```

#### GET `/api/v1/ledger/trial-balance?asOfDate=2026-03-31`
**Response (200)**
```json
{
  "asOfDate": "2026-03-31",
  "totals": { "debit": 9850000.5, "credit": 9850000.5 },
  "balanced": true
}
```

### 6.5 Business Logic
- Sum of debit must equal sum of credit per journal.
- No postings allowed to non-postable or inactive GL.
- Posting denied for closed accounting period unless authorized back-post workflow exists.
- Reversal generates contra journal linked to original entry.
- Every financial module event maps to preconfigured posting template.

### 6.6 Edge Cases
- Currency precision rounding leading to 0.01 imbalance.
- Backdated entry in already closed month.
- Missing GL mapping for new transaction type.
- Duplicate journal post request (idempotency required).

---

## 7. Module 6: Compliance

### 7.1 Purpose
Enforce regulatory policy controls, monitor suspicious activity, and manage compliance exceptions and evidence.

### 7.2 Key Features
- Versioned compliance rule engine
- AML transaction monitoring
- KYC refresh policy enforcement
- Alert and case management
- Regulatory report data extraction

### 7.3 Database Tables (with fields)

#### `compliance_rules`
- `rule_id` (PK, UUID)
- `rule_code` (unique)
- `rule_name`
- `rule_type` (KYC/AML/LENDING/REPORTING)
- `rule_expression` (json/text)
- `severity` (LOW/MEDIUM/HIGH/CRITICAL)
- `effective_from`, `effective_to` (nullable)
- `status` (ACTIVE/INACTIVE)
- `version_no`
- `created_at`

#### `compliance_alerts`
- `alert_id` (PK, UUID)
- `rule_id` (FK)
- `entity_type` (CUSTOMER/ACCOUNT/TRANSACTION/LOAN)
- `entity_id`
- `alert_status` (OPEN/IN_REVIEW/ESCALATED/CLOSED)
- `priority`
- `trigger_payload` (json/text)
- `created_at`, `updated_at`

#### `compliance_cases`
- `case_id` (PK, UUID)
- `alert_id` (FK)
- `assigned_to`
- `sla_due_at`
- `disposition` (TRUE_POSITIVE/FALSE_POSITIVE/REPORTED/CLOSED_NO_ACTION)
- `closure_notes`
- `closed_at`
- `created_at`, `updated_at`

#### `regulatory_extract_runs`
- `run_id` (PK, UUID)
- `report_code`
- `from_date`, `to_date`
- `record_count`
- `file_uri`
- `generated_by`
- `generated_at`

### 7.4 APIs (request/response)

#### POST `/api/v1/compliance/rules`
**Request**
```json
{
  "ruleCode": "AML_TXN_VELOCITY_01",
  "ruleName": "High velocity debit activity",
  "ruleType": "AML",
  "severity": "HIGH",
  "ruleExpression": {
    "windowMinutes": 30,
    "debitCountThreshold": 10
  },
  "effectiveFrom": "2026-04-01"
}
```
**Response (201)**
```json
{
  "ruleId": "rul_9901",
  "versionNo": 1,
  "status": "ACTIVE"
}
```

#### GET `/api/v1/compliance/alerts?status=OPEN`
**Response (200)**
```json
{
  "items": [
    {
      "alertId": "al_1122",
      "ruleCode": "AML_TXN_VELOCITY_01",
      "entityType": "ACCOUNT",
      "entityId": "acc_92817",
      "priority": "HIGH"
    }
  ],
  "count": 1
}
```

#### POST `/api/v1/compliance/cases/{caseId}/close`
**Request**
```json
{
  "disposition": "TRUE_POSITIVE",
  "closureNotes": "Escalated and filed as per internal policy."
}
```
**Response (200)**
```json
{
  "caseId": "cs_7171",
  "status": "CLOSED",
  "closedAt": "2026-03-20T15:05:20Z"
}
```

### 7.5 Business Logic
- Rule evaluation runs in near real-time for transactions and scheduled batches for periodic checks.
- Alerts are deduplicated by entity+rule+time window.
- SLA breach escalates case priority and notifies compliance manager.
- Rule updates are versioned; historical evaluations remain reproducible.
- Sensitive decisions require dual authorization and immutable evidence log.

### 7.6 Edge Cases
- False-positive flood due to overly broad rule definition.
- Retroactive rule activation affecting historical periods.
- Alert generated for entity already closed/inactive.
- Missing evidence attachment at case closure.

---

## 8. Shared API and Error Contract

### 8.1 Standard Headers
- `Authorization: Bearer <token>`
- `X-Correlation-Id: <uuid>`
- `Idempotency-Key: <string>` (required for POST/PUT financial writes)

### 8.2 Standard Error Response
```json
{
  "errorCode": "TXN_INSUFFICIENT_FUNDS",
  "message": "Available balance is insufficient.",
  "correlationId": "3d9a0f2f-11de-4e8a-a3ec-09f57d8f07ce",
  "details": [
    { "field": "amount", "issue": "exceeds_available_balance" }
  ]
}
```

---

## 9. Clean Architecture Mapping by Example

- **Domain (`Transaction` aggregate):** validates invariant "posted txn cannot be modified directly."
- **Application (`CreateTransferUseCase`):** orchestrates validation, lock strategy, repository save, and ledger post.
- **Interface (`TransactionController`):** maps HTTP DTO to use case input and formats output.
- **Infrastructure (`SqlTransactionRepository`, `LedgerApiAdapter`):** persistence and external posting integration.

This pattern shall be reused for all six modules to keep business logic isolated, testable, and regulation-ready.

