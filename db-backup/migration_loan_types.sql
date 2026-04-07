-- `loan_types` per project schema + seed rows. Run on `finance_system`.
-- If an older `loan_types` table exists, drop FK from `loans` first, then DROP TABLE `loan_types`, then run this file.
-- If `loans.loan_type_id` already exists as int, it still references `loan_type_id`; widen with:
--   ALTER TABLE loans MODIFY loan_type_id BIGINT(20) NOT NULL;

USE finance_system;

CREATE TABLE IF NOT EXISTS `loan_types` (
  `loan_type_id` bigint(20) NOT NULL,
  `loan_type` enum('Personal','Home','Gold','Property','Car') NOT NULL DEFAULT 'Personal',
  `roi` float NOT NULL,
  `min_tenure` int(11) NOT NULL,
  `max_tenure` int(11) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`loan_type_id`),
  KEY `idx_loan_types_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `loan_types` (`loan_type_id`, `loan_type`, `roi`, `min_tenure`, `max_tenure`, `status`) VALUES
(1, 'Personal', 14.5, 12, 60, 'ACTIVE'),
(2, 'Home', 9.25, 60, 360, 'ACTIVE'),
(3, 'Gold', 11, 6, 36, 'ACTIVE'),
(4, 'Property', 10.5, 60, 240, 'ACTIVE'),
(5, 'Car', 8.99, 12, 84, 'ACTIVE')
ON DUPLICATE KEY UPDATE
  `loan_type` = VALUES(`loan_type`),
  `roi` = VALUES(`roi`),
  `min_tenure` = VALUES(`min_tenure`),
  `max_tenure` = VALUES(`max_tenure`),
  `status` = VALUES(`status`);

-- Add `loan_type_id` to `loans` when missing (skip if column already exists).
ALTER TABLE `loans`
  ADD COLUMN `loan_type_id` bigint(20) NOT NULL AFTER `loan_account_number`,
  ADD KEY `idx_loans_loan_type` (`loan_type_id`),
  ADD CONSTRAINT `fk_loans_loan_type` FOREIGN KEY (`loan_type_id`) REFERENCES `loan_types` (`loan_type_id`);
