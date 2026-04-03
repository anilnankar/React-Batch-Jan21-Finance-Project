CREATE TABLE transactions (
  transaction_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id        BIGINT UNSIGNED NOT NULL,
  from_account_id    BIGINT UNSIGNED NOT NULL,
  beneficiary_id     BIGINT UNSIGNED NOT NULL,
  amount             DECIMAL(18,2) NOT NULL,
  currency_code      CHAR(3) NOT NULL DEFAULT 'INR',
  transaction_type   ENUM('PAYMENT','TRANSFER') NOT NULL DEFAULT 'PAYMENT',
  status             ENUM('PENDING','COMPLETED','FAILED') NOT NULL DEFAULT 'COMPLETED',
  payment_channel    ENUM('NETBANKING','MOBILE','BRANCH') NOT NULL DEFAULT 'NETBANKING',
  remarks            VARCHAR(255) NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (transaction_id),
  KEY idx_transactions_customer (customer_id),
  KEY idx_transactions_from_account (from_account_id),
  CONSTRAINT fk_transactions_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_from_account FOREIGN KEY (from_account_id) REFERENCES accounts (account_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries (beneficiary_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
