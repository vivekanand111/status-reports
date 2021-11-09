-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 06, 2021 at 06:22 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `star`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer_reports`
--

CREATE TABLE `customer_reports` (
  `id` int(11) NOT NULL,
  `Week_start` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `Approver_id` int(11) NOT NULL,
  `Created_date` date DEFAULT NULL,
  `Modified_date` date DEFAULT NULL,
  `Sprint` int(11) NOT NULL,
  `Task_id` int(11) NOT NULL,
  `Task_description` varchar(500) NOT NULL,
  `Delete_flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer_reports`
--

INSERT INTO `customer_reports` (`id`, `Week_start`, `user_id`, `Status`, `Approver_id`, `Created_date`, `Modified_date`, `Sprint`, `Task_id`, `Task_description`, `Delete_flag`) VALUES
(1, '2021-08-04', 1, 'Saved', 1, '2021-08-04', '2021-08-05', 9, 1, 'This is star task.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `starn`
--

CREATE TABLE `starn` (
  `ID` int(11) NOT NULL,
  `star_id` int(11) DEFAULT NULL,
  `Report_id` int(11) NOT NULL,
  `Task_desc` varchar(500) NOT NULL,
  `Task_date` date NOT NULL,
  `Project_id` int(11) NOT NULL,
  `Module_id` int(11) NOT NULL,
  `Created_date` date DEFAULT NULL,
  `Modified_date` date DEFAULT NULL,
  `Sprint` int(11) NOT NULL,
  `Delete_flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `starn`
--

INSERT INTO `starn` (`ID`, `star_id`, `Report_id`, `Task_desc`, `Task_date`, `Project_id`, `Module_id`, `Created_date`, `Modified_date`, `Sprint`, `Delete_flag`) VALUES
(1, 1, 1, 'Welcome Java', '0000-00-00', 1, 2, '0000-00-00', '0000-00-00', 10, 0),
(2, 2, 2, 'Hey Siri', '2021-08-04', 2, 2, '2021-08-04', '2021-08-04', 7, 0),
(3, 3, 3, 'Hey Google', '2021-08-06', 3, 2, '2021-08-06', '2021-08-06', 9, 0);

-- --------------------------------------------------------

--
-- Table structure for table `star_common_codes`
--

CREATE TABLE `star_common_codes` (
  `code_type` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL,
  `code_desc` varchar(256) DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `delete_flag` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `star_projects`
--

CREATE TABLE `star_projects` (
  `project_code` varchar(256) DEFAULT NULL,
  `project_desc` varchar(256) NOT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `modified_date` date DEFAULT NULL,
  `created_by` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_projects`
--

INSERT INTO `star_projects` (`project_code`, `project_desc`, `manager_id`, `created_date`, `modified_date`, `created_by`) VALUES
('eZAuto', 'eZAuto', NULL, '2021-08-25 12:32:12', NULL, NULL),
('eZTravel', 'eZTravel', NULL, '2021-08-25 12:32:12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `star_project_modules`
--

CREATE TABLE `star_project_modules` (
  `project_code` varchar(20) NOT NULL,
  `module_code` varchar(20) NOT NULL,
  `module_desc` varchar(256) NOT NULL,
  `creation_date` datetime NOT NULL,
  `delete_flag` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_project_modules`
--

INSERT INTO `star_project_modules` (`project_code`, `module_code`, `module_desc`, `creation_date`, `delete_flag`) VALUES
('eZAuto', 'VendorSearch', 'VendorSearch', '2021-08-25 12:43:02', 'N'),
('eZAuto', 'Customer', 'Customer', '2021-08-25 12:43:02', 'N'),
('eZTravel', 'CaseCreation', 'Case Creation', '2021-08-25 12:43:49', 'N'),
('eZAuto', 'Dealer ', 'Dealer', '2021-08-26 18:17:17', 'N'),
('eZAuto', 'Genesis module', 'Saving of genesis logs ', '2021-08-27 07:36:33', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `star_reports`
--

CREATE TABLE `star_reports` (
  `id` int(11) NOT NULL,
  `week_start` datetime DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `approver_id` int(11) DEFAULT NULL,
  `created_dt` datetime NOT NULL,
  `modified_dt` datetime NOT NULL,
  `Delete_flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_reports`
--

INSERT INTO `star_reports` (`id`, `week_start`, `user_id`, `status`, `approver_id`, `created_dt`, `modified_dt`, `Delete_flag`) VALUES
(1, '2021-08-11 00:00:00', '1', 'Open', 1, '2021-08-11 00:00:00', '2021-08-11 00:00:00', 0),
(2, '2021-08-11 00:00:00', 'vaishnavi', 'Open', 1, '2021-08-11 00:00:00', '2021-08-11 00:00:00', 0),
(3, '2021-08-17 00:00:00', '3', 'Open', 1, '2021-08-17 00:00:00', '2021-08-17 00:00:00', 0),
(4, '2021-08-19 00:00:00', 'admin', 'Open', 1, '2021-08-19 00:00:00', '2021-08-19 00:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `star_roles`
--

CREATE TABLE `star_roles` (
  `role_id` int(11) NOT NULL,
  `role_desc` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_roles`
--

INSERT INTO `star_roles` (`role_id`, `role_desc`) VALUES
(1, 'Employee'),
(2, 'Admin'),
(3, 'Project Manager');

-- --------------------------------------------------------

--
-- Table structure for table `star_tasks`
--

CREATE TABLE `star_tasks` (
  `id` int(11) NOT NULL,
  `star_id` int(11) NOT NULL,
  `task_date` date NOT NULL,
  `task_desc` varchar(500) NOT NULL,
  `project` varchar(250) NOT NULL,
  `module` varchar(250) NOT NULL,
  `sprint` varchar(100) NOT NULL,
  `hours` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `modified_date` datetime NOT NULL,
  `delete_flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_tasks`
--

INSERT INTO `star_tasks` (`id`, `star_id`, `task_date`, `task_desc`, `project`, `module`, `sprint`, `hours`, `created_date`, `modified_date`, `delete_flag`) VALUES
(283, 7, '2021-08-24', 'Changed search API', 'eZAuto', 'vendorSearch', 'Sprint 14', 0, '2021-08-25 15:57:20', '2021-08-25 15:57:20', 1),
(286, 2, '0001-01-01', 'Task-3', 'cyberior', 'custcreate', 'Sprint-3', 5, '2021-08-26 10:24:42', '2021-08-26 12:12:01', 1),
(287, 2, '2021-09-24', 'Task-4', 'homecare', 'custcreate', 'Sprint-4', 5, '2021-08-26 10:26:35', '2021-09-01 12:33:56', 1),
(289, 6, '2001-01-01', 'task-2', 'eZAuto', 'Customer', 'Sprint-2', 8, '2021-08-26 10:38:41', '2021-08-30 14:43:18', 1),
(305, 6, '2021-08-27', 'Task-4', 'eZAuto', 'Customer', 'Sprint-4', 7, '2021-08-27 10:51:20', '2021-08-27 10:51:20', 1),
(310, 6, '2021-08-24', 'Task-7', 'eZTravel', '', 'Sprint-7', 2, '2021-08-27 15:28:29', '2021-08-30 14:42:56', 1),
(316, 7, '2021-08-25', 'Modified Vendor Search UI', 'eZAuto', 'Customer', 'S234', 6, '2021-08-27 16:55:16', '2021-08-27 16:55:16', 1),
(324, 2, '2021-08-30', 'Task-5', 'eZAuto', 'Dealer', 'Sprint-5', 5, '2021-08-30 14:41:36', '2021-08-30 14:41:36', 1),
(326, 2, '2021-08-13', 'sprint hr', 'report', '1', 'hello', 12, '2021-09-01 16:58:11', '2021-09-03 19:09:10', 1),
(327, 2, '2021-09-03', 'developed ', 'eZTravel', '', 'sprint-48', 6, '2021-09-03 19:24:02', '2021-09-03 19:24:02', 1);

-- --------------------------------------------------------

--
-- Table structure for table `star_users`
--

CREATE TABLE `star_users` (
  `id` int(11) NOT NULL,
  `User_Name` varchar(225) NOT NULL,
  `Supervisor_id` int(11) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `Mobile_Number` varchar(12) NOT NULL,
  `Role_id` int(11) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Created_date` datetime NOT NULL,
  `Modified_date` datetime NOT NULL,
  `Delete_flag` varchar(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `star_users`
--

INSERT INTO `star_users` (`id`, `User_Name`, `Supervisor_id`, `Email`, `Mobile_Number`, `Role_id`, `Password`, `Created_date`, `Modified_date`, `Delete_flag`) VALUES
(1, '1', 1, 'venkatesh@gmail.com', '8801214666', 1, '$2y$10$qh3SsEKiAWciSsTzB2BnruvKmPzgaV99.6.jAfO5xkBXWJbLpOv02', '2021-08-17 11:56:56', '2021-08-17 11:56:56', '0'),
(2, 'vaishnavi', 1, 'test@gmail.com', '8801214444', 1, '$2y$10$gPqS1sOkkD2uP0QskIEOgOZihL2U1uA2c3wUwwKBrapDqk/9TIlPa', '2021-08-17 11:59:10', '2021-08-17 11:59:10', '0'),
(3, '3', 1, 'chinna@gmail.com', '8801214655', 1, '$2y$10$gPqS1sOkkD2uP0QskIEOgOZihL2U1uA2c3wUwwKBrapDqk/9TIlPa', '2021-08-16 16:12:52', '2021-08-16 16:12:52', '0'),
(4, 'admin', 2, 'admin@gmail.com', '8801217777', 1, '$2y$10$gPqS1sOkkD2uP0QskIEOgOZihL2U1uA2c3wUwwKBrapDqk/9TIlPa', '2021-08-17 17:54:27', '2021-08-17 17:54:27', '0'),
(8, 'vijay', 2, 'vijaysaip@yahoo.com', '9866683894', 1, '$2y$10$N6kRZMDVlgiDotD1XM0z3ed.k1fJxaSelYaiXZXI6iOX6dgDMOZD2', '2021-08-25 10:53:12', '2021-08-25 10:53:12', '0');

-- --------------------------------------------------------

--
-- Table structure for table `star_user_projects`
--

CREATE TABLE `star_user_projects` (
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer_reports`
--
ALTER TABLE `customer_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `starn`
--
ALTER TABLE `starn`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`);

--
-- Indexes for table `star_reports`
--
ALTER TABLE `star_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `star_roles`
--
ALTER TABLE `star_roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `star_tasks`
--
ALTER TABLE `star_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `star_users`
--
ALTER TABLE `star_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_id` (`User_Name`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `User_Name` (`User_Name`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `star_user_projects`
--
ALTER TABLE `star_user_projects`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer_reports`
--
ALTER TABLE `customer_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `star_reports`
--
ALTER TABLE `star_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `star_roles`
--
ALTER TABLE `star_roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `star_tasks`
--
ALTER TABLE `star_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=328;

--
-- AUTO_INCREMENT for table `star_users`
--
ALTER TABLE `star_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `star_user_projects`
--
ALTER TABLE `star_user_projects`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
