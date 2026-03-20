# RBI Compliance Rules for Finance System
## Simple Explanation Guide

**Purpose:** This document lists key RBI-aligned compliance rules a finance system should support, explained in simple terms.

> Note: RBI circulars and master directions are updated periodically. Compliance teams should regularly review and update these rules in the system.

---

## 1. KYC Norms (Know Your Customer)

### 1.1 Customer Identification
- **Rule:** Verify who the customer is before allowing full account operations.
- **Simple meaning:** Do not allow unknown people to open/use accounts without identity proof.
- **System requirement:** Capture and verify PAN, Aadhaar/allowed ID, address proof, and customer photo/details.

### 1.2 Customer Due Diligence (CDD)
- **Rule:** Collect enough information to understand customer profile and risk.
- **Simple meaning:** Know the customer’s background and expected financial behavior.
- **System requirement:** Store occupation/business details, expected transaction volume, location, and risk category.

### 1.3 Enhanced Due Diligence (EDD) for High-Risk Customers
- **Rule:** High-risk customers need stronger checks.
- **Simple meaning:** Risky customers get extra verification and closer monitoring.
- **System requirement:** Additional approvals, tighter limits, and frequent KYC updates.

### 1.4 Periodic KYC Update
- **Rule:** KYC is not one-time; refresh based on risk category.
- **Simple meaning:** Customer documents and profile must be rechecked regularly.
- **System requirement:** Auto reminders, expiry alerts, and account restrictions when KYC becomes overdue.

### 1.5 PEP and Sanctions Screening
- **Rule:** Screen customers against PEP/sanctions lists.
- **Simple meaning:** Check if customer is politically exposed or appears in restricted/watch lists.
- **System requirement:** Integrate screening checks and block/review suspicious matches.

---

## 2. AML Rules (Anti-Money Laundering)

### 2.1 Ongoing Transaction Monitoring
- **Rule:** Monitor transactions for unusual behavior.
- **Simple meaning:** Detect suspicious money movement patterns.
- **System requirement:** Alert rules for high-value, high-frequency, round-amount, rapid in-out transactions.

### 2.2 Suspicious Transaction Reporting (STR) Readiness
- **Rule:** Suspicious cases must be investigated and reportable.
- **Simple meaning:** If something looks like money laundering, track and report properly.
- **System requirement:** Case management workflow with evidence, reviewer comments, and closure outcome.

### 2.3 Record of Cash and Large Transactions
- **Rule:** Maintain clear records for large/cash-like transactions as required.
- **Simple meaning:** Big transactions should always be traceable.
- **System requirement:** Tag threshold transactions, keep full metadata, and make reports extractable.

### 2.4 Beneficial Ownership Checks (for Business Customers)
- **Rule:** Identify real owners/controllers of entities.
- **Simple meaning:** Know who actually controls the company/account.
- **System requirement:** Store ownership structure and verification proof for entity onboarding.

### 2.5 Sanctions Hit Handling
- **Rule:** Confirmed sanctions matches must be blocked and escalated.
- **Simple meaning:** Do not process accounts/transactions for prohibited persons/entities.
- **System requirement:** Immediate restriction, alert escalation, compliance approval path.

---

## 3. Transaction Limits and Controls

### 3.1 Per-Transaction and Daily Limits
- **Rule:** Apply limits by product, channel, and risk level.
- **Simple meaning:** Customers cannot transact unlimited amounts.
- **System requirement:** Configurable caps for per-transaction, daily, and monthly usage.

### 3.2 Channel-Based Limits
- **Rule:** Different channels can have different limits.
- **Simple meaning:** Mobile, branch, and API may allow different max amounts.
- **System requirement:** Maintain limits by channel and enforce at runtime.

### 3.3 Velocity Controls
- **Rule:** Restrict too many transactions in a short period.
- **Simple meaning:** Prevent burst activity used in fraud/layering.
- **System requirement:** Rule engine for count/time-window thresholds.

### 3.4 High-Risk Account Restrictions
- **Rule:** Impose stricter limits or additional approval for high-risk accounts.
- **Simple meaning:** Risky customers need tighter control.
- **System requirement:** Dynamic controls tied to risk category and compliance flags.

### 3.5 Exception and Override Governance
- **Rule:** Overrides must be approved and fully logged.
- **Simple meaning:** No silent bypass of limits.
- **System requirement:** Maker-checker approval and mandatory reason code for every override.

---

## 4. Data Retention Policy

### 4.1 KYC and Customer Records Retention
- **Rule:** Keep KYC/customer records for the legally required period, including after account closure.
- **Simple meaning:** Do not delete important customer data too early.
- **System requirement:** Retention schedules, legal-hold support, and secure archival.

### 4.2 Transaction and Ledger Data Retention
- **Rule:** Keep financial transaction and accounting history for statutory/audit periods.
- **Simple meaning:** Every financial movement should remain available for audits.
- **System requirement:** Long-term storage with search and retrieval capability.

### 4.3 AML/Compliance Case Retention
- **Rule:** Preserve alerts, investigations, and outcomes for required duration.
- **Simple meaning:** Compliance decisions must be provable years later.
- **System requirement:** Store case evidence, review trail, and disposition details.

### 4.4 Secure Storage and Access Control
- **Rule:** Retained data must remain secure and access-controlled.
- **Simple meaning:** Old data is still sensitive and must stay protected.
- **System requirement:** Encryption, access logs, and role-based permissions.

### 4.5 Controlled Data Disposal
- **Rule:** After retention period ends, data disposal must be controlled and auditable.
- **Simple meaning:** Delete data safely and keep proof of deletion.
- **System requirement:** Policy-driven purge jobs with audit entries.

---

## 5. Audit Requirements

### 5.1 Immutable Audit Trail
- **Rule:** All critical actions must be logged and tamper-resistant.
- **Simple meaning:** No one should be able to secretly change history.
- **System requirement:** Write-once audit logs for create/update/delete/approval events.

### 5.2 User and Access Audit
- **Rule:** Log sign-in attempts, role changes, permission changes, and sensitive access.
- **Simple meaning:** Track who accessed what and when.
- **System requirement:** Security logs with user ID, IP, device/user-agent, timestamp.

### 5.3 Financial Posting Traceability
- **Rule:** Every transaction must trace to ledger effect and source event.
- **Simple meaning:** You should be able to follow money flow end-to-end.
- **System requirement:** Correlation IDs linking API request, transaction, ledger entries, and reports.

### 5.4 Maker-Checker Evidence
- **Rule:** Sensitive operations require dual control and proof.
- **Simple meaning:** One person creates, another approves.
- **System requirement:** Store maker, checker, timestamps, and reason for approval/rejection.

### 5.5 Audit Report Readiness
- **Rule:** Internal/external audit reports must be generated quickly and accurately.
- **Simple meaning:** Be audit-ready at all times.
- **System requirement:** Searchable logs, export tools, and reproducible report datasets.

---

## 6. Implementation Checklist (Practical)

- KYC onboarding + periodic refresh workflow
- PEP/sanctions integration and hit management
- AML transaction monitoring rules and case management
- Product/channel/risk-based transaction limit engine
- Data retention and archival/purge policy automation
- Immutable audit log and maker-checker support
- Compliance dashboard for open alerts, SLA breaches, and pending reviews

