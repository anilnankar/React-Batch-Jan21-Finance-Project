CREATE TABLE accounts (
  account_id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  account_number         VARCHAR(32) NOT NULL,
  customer_id            BIGINT UNSIGNED NOT NULL,
  account_type           ENUM('SAVINGS','CURRENT','LOAN_LINKED') NOT NULL,
  currency_code          CHAR(3) NOT NULL DEFAULT 'INR',
  status                 ENUM('INACTIVE','ACTIVE','CLOSED','SUSPENDED') NOT NULL DEFAULT 'INACTIVE',
  available_balance      DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ledger_balance         DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id),
  UNIQUE KEY uq_accounts_number (account_number),
  KEY idx_accounts_customer (customer_id),
  CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
