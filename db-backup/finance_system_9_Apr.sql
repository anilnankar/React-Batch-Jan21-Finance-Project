-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 07:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `finance_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `account_number` varchar(24) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `account_type` enum('SAVINGS','CURRENT','LOAN_LINKED') NOT NULL,
  `currency_code` char(3) NOT NULL DEFAULT 'INR',
  `status` enum('ACTIVE','INACTIVE','DEBIT_BLOCK','CREDIT_BLOCK','FROZEN','DORMANT','CLOSED') NOT NULL DEFAULT 'INACTIVE',
  `available_balance` decimal(18,2) NOT NULL DEFAULT 0.00,
  `ledger_balance` decimal(18,2) NOT NULL DEFAULT 0.00,
  `opened_at` datetime NOT NULL DEFAULT current_timestamp(),
  `closed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `account_number`, `customer_id`, `account_type`, `currency_code`, `status`, `available_balance`, `ledger_balance`, `opened_at`, `closed_at`, `created_at`, `updated_at`) VALUES
(1, 'ACC17750590792617', 3, 'SAVINGS', 'INR', 'ACTIVE', 6000.00, 0.00, '2026-04-01 21:27:59', NULL, '2026-04-01 21:27:59', '2026-04-03 21:58:54'),
(2, 'ACC1775230041420752', 6, 'SAVINGS', 'INR', 'ACTIVE', 104000.00, 0.00, '2026-04-03 20:57:21', NULL, '2026-04-03 20:57:21', '2026-04-09 22:21:05'),
(1111111111, '000000000001', 7, 'SAVINGS', 'INR', 'ACTIVE', 1000000.00, 0.00, '2026-04-09 22:04:34', NULL, '2026-04-09 22:04:34', '2026-04-09 22:07:28');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `audit_id` bigint(20) UNSIGNED NOT NULL,
  `actor_user_id` varchar(64) NOT NULL,
  `actor_role` varchar(64) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(64) NOT NULL,
  `before_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before_data`)),
  `after_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after_data`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `correlation_id` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `beneficiaries`
--

CREATE TABLE `beneficiaries` (
  `beneficiary_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `beneficiary_name` varchar(150) NOT NULL,
  `beneficiary_account_number` varchar(32) NOT NULL,
  `ifsc_code` varchar(11) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `nickname` varchar(80) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `beneficiaries`
--

INSERT INTO `beneficiaries` (`beneficiary_id`, `account_id`, `beneficiary_name`, `beneficiary_account_number`, `ifsc_code`, `bank_name`, `nickname`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Anil Nankar', 'ACC17750590792617', 'HDFC0001123', 'NB', 'anil', 'ACTIVE', '2026-04-03 21:18:09', '2026-04-03 21:18:09'),
(2, 1111111111, 'Prany', 'ACC1775230041420752', 'ICIC010010', 'ICICI', 'Prany', 'ACTIVE', '2026-04-09 22:13:37', '2026-04-09 22:13:37');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `customer_code` varchar(32) NOT NULL,
  `customer_type` enum('INDIVIDUAL','BUSINESS') NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `date_of_birth_or_incorp` date DEFAULT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `pan_number` varchar(10) NOT NULL,
  `kyc_status` enum('PENDING','VERIFIED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `risk_category` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  `status` enum('ACTIVE','SUSPENDED','CLOSED','RESTRICTED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `customer_code`, `customer_type`, `full_name`, `date_of_birth_or_incorp`, `mobile_number`, `email`, `password`, `pan_number`, `kyc_status`, `risk_category`, `status`, `created_at`, `updated_at`) VALUES
(3, 'CUST1775059079235896', 'INDIVIDUAL', 'Anil Nankar', '2026-02-05', '09096480616', 'anildnankar@gmail.com', '40be4e59b9a2a2b5dffb918c0e86b3d7', 'ASDSD0123D', 'VERIFIED', 'LOW', 'ACTIVE', '2026-04-01 21:27:59', '2026-04-03 21:01:04'),
(6, 'CUST1775230041282864', 'INDIVIDUAL', 'Pranay Patole', '1996-04-18', '90966666666', 'pranya@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'ASSSF2123D', 'VERIFIED', 'LOW', 'ACTIVE', '2026-04-03 20:57:21', '2026-04-03 21:01:10'),
(7, 'CUST1775230041287788', 'BUSINESS', 'ICICI BANK', '2026-04-01', '', NULL, '', '', 'VERIFIED', 'LOW', 'ACTIVE', '2026-04-09 22:06:34', '2026-04-09 22:07:17');

-- --------------------------------------------------------

--
-- Table structure for table `emi_schedule`
--

CREATE TABLE `emi_schedule` (
  `emi_id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `installment_no` int(10) UNSIGNED NOT NULL,
  `due_date` date NOT NULL,
  `principal_due` decimal(18,2) NOT NULL DEFAULT 0.00,
  `interest_due` decimal(18,2) NOT NULL DEFAULT 0.00,
  `charges_due` decimal(18,2) NOT NULL DEFAULT 0.00,
  `total_due` decimal(18,2) NOT NULL,
  `amount_paid` decimal(18,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('DUE','PARTIAL','PAID','OVERDUE') NOT NULL DEFAULT 'DUE',
  `paid_on` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `ledger_entry_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `loan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `entry_date` datetime NOT NULL DEFAULT current_timestamp(),
  `gl_code` varchar(20) NOT NULL,
  `dr_cr` enum('DR','CR') NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `narration` varchar(255) DEFAULT NULL,
  `reference_type` enum('TRANSACTION','LOAN','CHARGE','INTEREST','MANUAL') NOT NULL,
  `reference_id` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `loan_account_number` varchar(30) NOT NULL,
  `loan_type_id` int(11) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `linked_account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `principal_amount` decimal(18,2) NOT NULL,
  `disbursed_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `interest_rate_annual` decimal(7,4) NOT NULL,
  `tenure_months` int(10) UNSIGNED NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `loan_status` enum('APPLIED','APPROVED','DISBURSED','ACTIVE','CLOSED','NPA','WRITTEN_OFF') NOT NULL DEFAULT 'APPLIED',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`loan_id`, `loan_account_number`, `loan_type_id`, `customer_id`, `linked_account_id`, `principal_amount`, `disbursed_amount`, `interest_rate_annual`, `tenure_months`, `start_date`, `end_date`, `loan_status`, `created_at`, `updated_at`) VALUES
(1, 'LOAN17755816612611942', 1, 6, 2, 100000.00, 0.00, 11.0000, 12, '2026-05-01', '2027-05-01', 'DISBURSED', '2026-04-07 22:37:41', '2026-04-09 21:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `loan_documents`
--

CREATE TABLE `loan_documents` (
  `document_id` bigint(20) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `document_file` varchar(255) NOT NULL,
  `verified_datetime` datetime DEFAULT current_timestamp(),
  `created_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Verified','Pending','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan_documents`
--

INSERT INTO `loan_documents` (`document_id`, `loan_id`, `document_type`, `document_file`, `verified_datetime`, `created_datetime`, `status`) VALUES
(1, 1, 'rent_agrreement', 'UI Lead - Angular 11 Years (1) (1).pdf', '2026-04-08 23:00:47', '2026-04-08 23:00:47', 'Verified'),
(2, 1, 'adhhar', 'Ramayana_R1.pdf', '2026-04-08 23:01:19', '2026-04-08 23:01:19', 'Verified'),
(3, 1, 'adhhar', 'Ramayana.png', '2026-04-08 23:01:50', '2026-04-08 23:01:50', 'Verified'),
(4, 1, 'photo', '14.png', '2026-04-09 21:55:01', '2026-04-09 21:55:01', 'Verified');

-- --------------------------------------------------------

--
-- Table structure for table `loan_emi`
--

CREATE TABLE `loan_emi` (
  `loan_id` int(11) NOT NULL,
  `emi_amount` float NOT NULL,
  `emi_due_date` date NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `roi` float NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Paid','Unpaid','Bounce') NOT NULL DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loan_types`
--

CREATE TABLE `loan_types` (
  `loan_type_id` bigint(20) NOT NULL,
  `loan_type` enum('Personal','Home','Gold','Property','Car') NOT NULL DEFAULT 'Personal',
  `roi` float NOT NULL,
  `min_tenure` int(11) NOT NULL,
  `max_tenure` int(11) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan_types`
--

INSERT INTO `loan_types` (`loan_type_id`, `loan_type`, `roi`, `min_tenure`, `max_tenure`, `status`, `created_date`, `updated_date`) VALUES
(1, 'Personal', 11, 12, 60, 'ACTIVE', '2026-04-07 22:01:24', '2026-04-07 22:01:24'),
(2, 'Home', 8, 120, 360, 'ACTIVE', '2026-04-07 22:02:01', '2026-04-07 22:02:01'),
(3, 'Gold', 9, 6, 12, 'ACTIVE', '2026-04-07 22:02:17', '2026-04-07 22:02:17'),
(4, 'Property', 12, 12, 60, 'ACTIVE', '2026-04-07 22:02:43', '2026-04-07 22:02:43'),
(5, 'Car', 10, 12, 60, 'ACTIVE', '2026-04-07 22:03:01', '2026-04-07 22:03:01');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `from_account_id` bigint(20) UNSIGNED NOT NULL,
  `beneficiary_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `currency_code` char(3) NOT NULL DEFAULT 'INR',
  `transaction_type` enum('Credit','Debit') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') NOT NULL DEFAULT 'COMPLETED',
  `payment_channel` enum('NETBANKING','MOBILE','BRANCH') NOT NULL DEFAULT 'NETBANKING',
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `customer_id`, `from_account_id`, `beneficiary_id`, `amount`, `currency_code`, `transaction_type`, `status`, `payment_channel`, `remarks`, `created_at`, `updated_at`) VALUES
(3, 6, 2, 1, 1000.00, 'INR', 'Debit', 'COMPLETED', 'NETBANKING', 'test', '2026-04-03 21:58:54', '2026-04-09 22:19:43'),
(4, 7, 1111111111, 2, 100000.00, 'INR', 'Credit', 'COMPLETED', 'NETBANKING', NULL, '2026-04-09 22:19:52', '2026-04-09 22:20:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `uq_accounts_number` (`account_number`),
  ADD KEY `idx_accounts_customer_id` (`customer_id`),
  ADD KEY `idx_accounts_status` (`status`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `idx_audit_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_audit_actor` (`actor_user_id`),
  ADD KEY `idx_audit_created_at` (`created_at`),
  ADD KEY `idx_audit_action` (`action`);

--
-- Indexes for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  ADD PRIMARY KEY (`beneficiary_id`),
  ADD KEY `idx_beneficiaries_account` (`account_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `uq_customers_code` (`customer_code`),
  ADD UNIQUE KEY `uq_customers_pan` (`pan_number`),
  ADD UNIQUE KEY `uq_customers_mobile` (`mobile_number`),
  ADD KEY `idx_customers_status` (`status`),
  ADD KEY `idx_customers_kyc_status` (`kyc_status`);

--
-- Indexes for table `emi_schedule`
--
ALTER TABLE `emi_schedule`
  ADD PRIMARY KEY (`emi_id`),
  ADD UNIQUE KEY `uq_emi_loan_installment` (`loan_id`,`installment_no`),
  ADD KEY `idx_emi_due_date` (`due_date`),
  ADD KEY `idx_emi_payment_status` (`payment_status`);

--
-- Indexes for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD PRIMARY KEY (`ledger_entry_id`),
  ADD KEY `idx_ledger_transaction_id` (`transaction_id`),
  ADD KEY `idx_ledger_loan_id` (`loan_id`),
  ADD KEY `idx_ledger_account_id` (`account_id`),
  ADD KEY `idx_ledger_entry_date` (`entry_date`),
  ADD KEY `idx_ledger_gl_code` (`gl_code`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`loan_id`),
  ADD UNIQUE KEY `uq_loans_account_number` (`loan_account_number`),
  ADD KEY `idx_loans_customer_id` (`customer_id`),
  ADD KEY `idx_loans_status` (`loan_status`),
  ADD KEY `fk_loans_linked_account` (`linked_account_id`);

--
-- Indexes for table `loan_documents`
--
ALTER TABLE `loan_documents`
  ADD PRIMARY KEY (`document_id`);

--
-- Indexes for table `loan_types`
--
ALTER TABLE `loan_types`
  ADD PRIMARY KEY (`loan_type_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `idx_transactions_customer` (`customer_id`),
  ADD KEY `idx_transactions_from_account` (`from_account_id`),
  ADD KEY `fk_transactions_beneficiary` (`beneficiary_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1111111112;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `audit_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  MODIFY `beneficiary_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `emi_schedule`
--
ALTER TABLE `emi_schedule`
  MODIFY `emi_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  MODIFY `ledger_entry_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `loan_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loan_documents`
--
ALTER TABLE `loan_documents`
  MODIFY `document_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `loan_types`
--
ALTER TABLE `loan_types`
  MODIFY `loan_type_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `fk_accounts_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `beneficiaries`
--
ALTER TABLE `beneficiaries`
  ADD CONSTRAINT `fk_beneficiaries_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON UPDATE CASCADE;

--
-- Constraints for table `emi_schedule`
--
ALTER TABLE `emi_schedule`
  ADD CONSTRAINT `fk_emi_loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`loan_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD CONSTRAINT `fk_ledger_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ledger_loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`loan_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ledger_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE SET NULL;

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `fk_loans_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `fk_loans_linked_account` FOREIGN KEY (`linked_account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_beneficiary` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries` (`beneficiary_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transactions_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transactions_from_account` FOREIGN KEY (`from_account_id`) REFERENCES `accounts` (`account_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
