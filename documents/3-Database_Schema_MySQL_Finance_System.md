# Database Schema Design (MySQL)
## Finance System - Relational Model

**Database Engine:** MySQL 8.0+ (InnoDB)  
**Character Set:** `utf8mb4`  
**Collation:** `utf8mb4_unicode_ci`  
**Timezone Practice:** Store all timestamps in UTC

---

## 1. Design Notes

- All tables use `InnoDB` for ACID transactions and FK support.
- Monetary values use `DECIMAL(18,2)`; can be increased for higher precision products.
- IDs are `BIGINT UNSIGNED AUTO_INCREMENT` for operational simplicity.
- `ENUM` is used for constrained states; can be replaced with lookup tables in large enterprises.
- Soft-delete is avoided for financial records; use status/state transitions and audit logs.

---

## 2. SQL DDL (Tables, PK/FK, Constraints)

```sql
CREATE DATABASE IF NOT EXISTS finance_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finance_system;

-- 1) customers
CREATE TABLE customers (
  customer_id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_code          VARCHAR(32) NOT NULL,
  customer_type          ENUM('INDIVIDUAL','BUSINESS') NOT NULL,
  full_name              VARCHAR(150) NOT NULL,
  date_of_birth_or_incorp DATE NULL,
  mobile_number          VARCHAR(15) NOT NULL,
  email                  VARCHAR(150) NULL,
  pan_number             VARCHAR(10) NOT NULL,
  kyc_status             ENUM('PENDING','VERIFIED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  risk_category          ENUM('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  status                 ENUM('ACTIVE','SUSPENDED','CLOSED','RESTRICTED') NOT NULL DEFAULT 'ACTIVE',
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customers_code (customer_code),
  UNIQUE KEY uq_customers_pan (pan_number),
  UNIQUE KEY uq_customers_mobile (mobile_number),
  KEY idx_customers_status (status),
  KEY idx_customers_kyc_status (kyc_status)
) ENGINE=InnoDB;

-- 2) accounts
CREATE TABLE accounts (
  account_id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  account_number         VARCHAR(24) NOT NULL,
  customer_id            BIGINT UNSIGNED NOT NULL,
  account_type           ENUM('SAVINGS','CURRENT','LOAN_LINKED') NOT NULL,
  currency_code          CHAR(3) NOT NULL DEFAULT 'INR',
  status                 ENUM('ACTIVE','DEBIT_BLOCK','CREDIT_BLOCK','FROZEN','DORMANT','CLOSED') NOT NULL DEFAULT 'ACTIVE',
  available_balance      DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ledger_balance         DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  opened_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at              DATETIME NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id),
  UNIQUE KEY uq_accounts_number (account_number),
  KEY idx_accounts_customer_id (customer_id),
  KEY idx_accounts_status (status),
  CONSTRAINT fk_accounts_customer
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3) transactions
CREATE TABLE transactions (
  transaction_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  transaction_ref        VARCHAR(50) NOT NULL,
  transaction_type       ENUM('DEPOSIT','WITHDRAWAL','TRANSFER','ADJUSTMENT','REVERSAL') NOT NULL,
  from_account_id        BIGINT UNSIGNED NULL,
  to_account_id          BIGINT UNSIGNED NULL,
  amount                 DECIMAL(18,2) NOT NULL,
  currency_code          CHAR(3) NOT NULL DEFAULT 'INR',
  status                 ENUM('INITIATED','PENDING','POSTED','FAILED','REVERSED') NOT NULL DEFAULT 'INITIATED',
  idempotency_key        VARCHAR(80) NULL,
  remarks                VARCHAR(255) NULL,
  transaction_time       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (transaction_id),
  UNIQUE KEY uq_transactions_ref (transaction_ref),
  UNIQUE KEY uq_transactions_idempotency (idempotency_key),
  KEY idx_transactions_from_account (from_account_id),
  KEY idx_transactions_to_account (to_account_id),
  KEY idx_transactions_time (transaction_time),
  KEY idx_transactions_status (status),
  CONSTRAINT fk_transactions_from_account
    FOREIGN KEY (from_account_id) REFERENCES accounts (account_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_transactions_to_account
    FOREIGN KEY (to_account_id) REFERENCES accounts (account_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT chk_transactions_amount
    CHECK (amount > 0)
) ENGINE=InnoDB;

-- 4) loans
CREATE TABLE loans (
  loan_id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  loan_account_number    VARCHAR(30) NOT NULL,
  customer_id            BIGINT UNSIGNED NOT NULL,
  linked_account_id      BIGINT UNSIGNED NULL,
  principal_amount       DECIMAL(18,2) NOT NULL,
  disbursed_amount       DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  interest_rate_annual   DECIMAL(7,4) NOT NULL,
  tenure_months          INT UNSIGNED NOT NULL,
  start_date             DATE NULL,
  end_date               DATE NULL,
  loan_status            ENUM('APPLIED','APPROVED','DISBURSED','ACTIVE','CLOSED','NPA','WRITTEN_OFF') NOT NULL DEFAULT 'APPLIED',
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (loan_id),
  UNIQUE KEY uq_loans_account_number (loan_account_number),
  KEY idx_loans_customer_id (customer_id),
  KEY idx_loans_status (loan_status),
  CONSTRAINT fk_loans_customer
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_loans_linked_account
    FOREIGN KEY (linked_account_id) REFERENCES accounts (account_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT chk_loans_principal
    CHECK (principal_amount > 0),
  CONSTRAINT chk_loans_tenure
    CHECK (tenure_months > 0)
) ENGINE=InnoDB;

-- 5) emi_schedule
CREATE TABLE emi_schedule (
  emi_id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  loan_id                BIGINT UNSIGNED NOT NULL,
  installment_no         INT UNSIGNED NOT NULL,
  due_date               DATE NOT NULL,
  principal_due          DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  interest_due           DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  charges_due            DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  total_due              DECIMAL(18,2) NOT NULL,
  amount_paid            DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  payment_status         ENUM('DUE','PARTIAL','PAID','OVERDUE') NOT NULL DEFAULT 'DUE',
  paid_on                DATETIME NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (emi_id),
  UNIQUE KEY uq_emi_loan_installment (loan_id, installment_no),
  KEY idx_emi_due_date (due_date),
  KEY idx_emi_payment_status (payment_status),
  CONSTRAINT fk_emi_loan
    FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
    ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6) ledger_entries
CREATE TABLE ledger_entries (
  ledger_entry_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  transaction_id         BIGINT UNSIGNED NULL,
  loan_id                BIGINT UNSIGNED NULL,
  account_id             BIGINT UNSIGNED NULL,
  entry_date             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gl_code                VARCHAR(20) NOT NULL,
  dr_cr                  ENUM('DR','CR') NOT NULL,
  amount                 DECIMAL(18,2) NOT NULL,
  narration              VARCHAR(255) NULL,
  reference_type         ENUM('TRANSACTION','LOAN','CHARGE','INTEREST','MANUAL') NOT NULL,
  reference_id           VARCHAR(64) NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ledger_entry_id),
  KEY idx_ledger_transaction_id (transaction_id),
  KEY idx_ledger_loan_id (loan_id),
  KEY idx_ledger_account_id (account_id),
  KEY idx_ledger_entry_date (entry_date),
  KEY idx_ledger_gl_code (gl_code),
  CONSTRAINT fk_ledger_transaction
    FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT fk_ledger_loan
    FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT fk_ledger_account
    FOREIGN KEY (account_id) REFERENCES accounts (account_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT chk_ledger_amount
    CHECK (amount > 0)
) ENGINE=InnoDB;

-- 7) audit_logs
CREATE TABLE audit_logs (
  audit_id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id          VARCHAR(64) NOT NULL,
  actor_role             VARCHAR(64) NULL,
  action                 VARCHAR(100) NOT NULL,
  entity_type            VARCHAR(50) NOT NULL,
  entity_id              VARCHAR(64) NOT NULL,
  before_data            JSON NULL,
  after_data             JSON NULL,
  ip_address             VARCHAR(45) NULL,
  user_agent             VARCHAR(255) NULL,
  correlation_id         VARCHAR(64) NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (audit_id),
  KEY idx_audit_entity (entity_type, entity_id),
  KEY idx_audit_actor (actor_user_id),
  KEY idx_audit_created_at (created_at),
  KEY idx_audit_action (action)
) ENGINE=InnoDB;
```

---

## 3. Relationships (Cardinality)

- `customers (1) -> (N) accounts`
- `customers (1) -> (N) loans`
- `accounts (1) -> (N) transactions` (as source or destination)
- `loans (1) -> (N) emi_schedule`
- `transactions (1) -> (N) ledger_entries`
- `loans (1) -> (N) ledger_entries`
- `accounts (1) -> (N) ledger_entries`
- `audit_logs` is cross-cutting and references entities logically by `entity_type + entity_id`

---

## 4. Indexing Suggestions (Operational)

### 4.1 High-Value Indexes
- `transactions(transaction_time, status)` for timeline and processing queues.
- `transactions(from_account_id, transaction_time)` and `transactions(to_account_id, transaction_time)` for account statements.
- `emi_schedule(loan_id, payment_status, due_date)` for overdue and collection jobs.
- `ledger_entries(account_id, entry_date)` and `ledger_entries(gl_code, entry_date)` for reconciliation and reporting.
- `audit_logs(entity_type, entity_id, created_at)` for investigations.

### 4.2 Unique and Integrity Indexes
- `customers(pan_number)`, `accounts(account_number)`, `transactions(transaction_ref)`, `loans(loan_account_number)`.
- `emi_schedule(loan_id, installment_no)` to prevent duplicate installment rows.
- `transactions(idempotency_key)` to guarantee safe retries.

### 4.3 Optional Partitioning (Large Scale)
- Monthly partitioning for `transactions`, `ledger_entries`, `audit_logs` by date field.
- Keep global secondary indexes minimal for write-heavy workloads.

---

## 5. Practical Notes

- Use DB transaction boundaries for posting financial events and ledger entries atomically.
- Consider a separate `gl_accounts` master if accounting grows beyond basic `gl_code`.
- For strict double-entry enforcement, introduce `journals` + `journal_lines` abstraction over `ledger_entries`.
- Add archival strategy for `audit_logs` and old `transactions` while preserving compliance retention.

