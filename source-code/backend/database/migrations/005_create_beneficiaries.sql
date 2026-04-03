CREATE TABLE beneficiaries (
  beneficiary_id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  account_id                 BIGINT UNSIGNED NOT NULL,
  beneficiary_name           VARCHAR(150) NOT NULL,
  beneficiary_account_number VARCHAR(32) NOT NULL,
  ifsc_code                  VARCHAR(11) NULL,
  bank_name                  VARCHAR(150) NULL,
  nickname                   VARCHAR(80) NULL,
  status                     ENUM('ACTIVE','INACTIVE','PENDING') NOT NULL DEFAULT 'ACTIVE',
  created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (beneficiary_id),
  KEY idx_beneficiaries_account (account_id),
  CONSTRAINT fk_beneficiaries_account FOREIGN KEY (account_id) REFERENCES accounts (account_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
