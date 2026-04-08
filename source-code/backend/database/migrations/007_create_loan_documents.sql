CREATE TABLE `loan_documents` (
  `document_id` bigint(20) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `document_file` varchar(255) NOT NULL,
  `verified_datetime` datetime DEFAULT current_timestamp(),
  `created_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Verified','Pending','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;