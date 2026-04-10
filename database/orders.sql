-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2025 at 09:56 AM
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
-- Database: `coffee_master`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `coffee_count` int(11) NOT NULL DEFAULT 0,
  `bread_count` int(11) NOT NULL DEFAULT 0,
  `pastry_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `username`, `items`, `subtotal`, `total`, `coffee_count`, `bread_count`, `pastry_count`, `created_at`) VALUES
(5, 'ORD1757443979397', '123456', '[{\"code\":\"R3\",\"name\":\"Matcha Latte\",\"category\":\"coffee\",\"price\":99,\"description\":\"Smooth espresso with steamed milk and light foam\",\"image\":\"assets/img/coffe/menu3.jpg\",\"quantity\":3}]', 273.24, 297.00, 3, 0, 0, '2025-09-09 18:54:54'),
(6, 'ORD1757444232793', '123', '[{\"code\":\"R3\",\"name\":\"Matcha Latte\",\"category\":\"coffee\",\"price\":99,\"description\":\"Smooth espresso with steamed milk and light foam\",\"image\":\"assets/img/coffe/menu3.jpg\",\"quantity\":3}]', 273.24, 297.00, 3, 0, 0, '2025-09-09 18:57:13'),
(7, 'ORD1757453278640', '123456', '[{\"code\":\"R3\",\"name\":\"Matcha Latte\",\"category\":\"coffee\",\"price\":99,\"description\":\"Smooth espresso with steamed milk and light foam\",\"image\":\"assets/img/coffe/menu3.jpg\",\"quantity\":3}]', 273.24, 297.00, 3, 0, 0, '2025-09-09 21:27:59'),
(8, 'ORD1757453278640', '123456', '[{\"code\":\"R3\",\"name\":\"Matcha Latte\",\"category\":\"coffee\",\"price\":99,\"description\":\"Smooth espresso with steamed milk and light foam\",\"image\":\"assets/img/coffe/menu3.jpg\",\"quantity\":3}]', 273.24, 297.00, 3, 0, 0, '2025-09-10 00:32:41'),
(9, 'ORD1757464449965', '123456', '[{\"code\":\"R3\",\"name\":\"Matcha Latte\",\"category\":\"coffee\",\"price\":99,\"description\":\"Smooth espresso with steamed milk and light foam\",\"image\":\"assets/img/coffe/menu3.jpg\",\"quantity\":1},{\"code\":\"R1\",\"name\":\"Black Americano\",\"category\":\"coffee\",\"price\":99,\"description\":\"Rich espresso shots with hot water for a smooth, bold flavor\",\"image\":\"assets/img/coffe/menu5.jpg\",\"quantity\":2},{\"code\":\"R2\",\"name\":\"Cappuccino\",\"category\":\"coffee\",\"price\":99,\"description\":\"Espresso with steamed milk and a thick layer of milk foam\",\"image\":\"assets/img/coffe/menu4.jpg\",\"quantity\":1}]', 364.32, 396.00, 4, 0, 0, '2025-09-10 00:34:10'),
(10, 'ORD1757464681577', '123456', '[{\"code\":\"N1\",\"name\":\"Mocha Frappuccino\",\"category\":\"beverages\",\"price\":99,\"description\":\"Blend dark cocoa with milk, ice and coffee\",\"image\":\"assets/img/coffe/menu.jpg\",\"quantity\":1},{\"code\":\"P2\",\"name\":\"Ube Cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake2.jpg\",\"quantity\":1},{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake4.jpg\",\"quantity\":1},{\"code\":\"B2\",\"name\":\"Sugar Butter Toast\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread2.jpg\",\"quantity\":1},{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread3.jpg\",\"quantity\":1}]', 236.44, 257.00, 1, 2, 2, '2025-09-10 00:38:01'),
(11, 'ORD1757464681577', '123456', '[{\"code\":\"N1\",\"name\":\"Mocha Frappuccino\",\"category\":\"beverages\",\"price\":99,\"description\":\"Blend dark cocoa with milk, ice and coffee\",\"image\":\"assets/img/coffe/menu.jpg\",\"quantity\":1},{\"code\":\"P2\",\"name\":\"Ube Cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake2.jpg\",\"quantity\":1},{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake4.jpg\",\"quantity\":1},{\"code\":\"B2\",\"name\":\"Sugar Butter Toast\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread2.jpg\",\"quantity\":1},{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread3.jpg\",\"quantity\":1}]', 236.44, 257.00, 1, 2, 2, '2025-09-10 02:29:56'),
(12, 'ORD1757471410437', '123456', '[{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake4.jpg\",\"quantity\":1},{\"code\":\"P4\",\"name\":\"Black forest cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake3.jpg\",\"quantity\":1},{\"code\":\"B2\",\"name\":\"Sugar Butter Toast\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread2.jpg\",\"quantity\":1},{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread3.jpg\",\"quantity\":1}]', 145.36, 158.00, 0, 2, 2, '2025-09-10 02:30:11'),
(13, 'ORD1757471817762', '123456', '[{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake4.jpg\",\"quantity\":1},{\"code\":\"B4\",\"name\":\"Pan de coco\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread4.jpg\",\"quantity\":1}]', 72.68, 79.00, 0, 0, 0, '2025-09-10 02:36:58'),
(14, 'ORD1757472508827', '123456', '[{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets/img/coffe/cake4.jpg\",\"quantity\":2},{\"code\":\"B2\",\"name\":\"Sugar Butter Toast\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread2.jpg\",\"quantity\":2}]', 145.36, 158.00, 0, 0, 0, '2025-09-10 02:48:29'),
(15, 'ORD1757472577439', '123456', '[{\"code\":\"B1\",\"name\":\"Cheesy Ensaimada\",\"category\":\"breads\",\"price\":39,\"image\":\"assets/img/coffe/bread1.jpg\",\"quantity\":3}]', 107.64, 117.00, 0, 0, 0, '2025-09-10 02:49:37'),
(16, 'ORD1757472748363', '123456', '[{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets\\/img\\/coffe\\/bread3.jpg\",\"quantity\":3},{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets\\/img\\/coffe\\/cake4.jpg\",\"quantity\":2}]', 163.76, 178.00, 0, 3, 0, '2025-09-10 02:52:29'),
(17, 'ORD1757473234631', '123456', '[{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets\\/img\\/coffe\\/bread3.jpg\",\"quantity\":3}]', 55.20, 60.00, 0, 3, 0, '2025-09-10 03:00:35'),
(18, 'ORD1757473247406', '123456', '[{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets\\/img\\/coffe\\/bread3.jpg\",\"quantity\":2}]', 36.80, 40.00, 0, 2, 0, '2025-09-10 03:00:47'),
(19, 'ORD1757473730523', '123456', '[{\"code\":\"P3\",\"name\":\"Dark chocolate cake\",\"category\":\"pastries\",\"price\":59,\"image\":\"assets\\/img\\/coffe\\/cake4.jpg\",\"quantity\":3}]', 162.84, 177.00, 0, 0, 3, '2025-09-10 03:08:51'),
(20, 'ORD1757474406779', '123456', '[{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets\\/img\\/coffe\\/bread3.jpg\",\"quantity\":2}]', 36.80, 40.00, 0, 0, 0, '2025-09-10 03:20:07'),
(21, 'ORD1757474488560', '123456', '[{\"code\":\"B3\",\"name\":\"Spanish Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread3.jpg\",\"quantity\":3},{\"code\":\"B4\",\"name\":\"Pan de coco\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread4.jpg\",\"quantity\":2}]', 92.00, 100.00, 0, 3, 0, '2025-09-10 03:21:29'),
(22, 'ORD1757474615273', '123456', '[{\"code\":\"B5\",\"name\":\"Cheese Bread\",\"category\":\"breads\",\"price\":20,\"image\":\"assets/img/coffe/bread5.jpg\",\"quantity\":3}]', 55.20, 60.00, 0, 3, 0, '2025-09-10 03:23:35'),
(23, 'ORD1757474979613', '123456', '[{\"code\":\"R4\",\"name\":\"Caffu00e8 mocha\",\"category\":\"coffee\",\"price\":99,\"description\":\"Espresso with chocolate syrup, steamed milk, and whipped cream\",\"image\":\"assets/img/coffe/menu4.jpg\",\"quantity\":3}]', 273.24, 297.00, 0, 0, 0, '2025-09-10 03:29:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
