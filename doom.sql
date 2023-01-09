-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 16 2022 г., 12:09
-- Версия сервера: 5.7.29
-- Версия PHP: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `esgnode_evstats`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admin_btc`
--

CREATE TABLE `admin_btc` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `private` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `admin_eth`
--

CREATE TABLE `admin_eth` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `private` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `admin_ever`
--

CREATE TABLE `admin_ever` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `seed` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `authdetails`
--

CREATE TABLE `authdetails` (
  `id` int(11) NOT NULL,
  `nonce` varchar(255) NOT NULL,
  `timestamp` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `user` varchar(70) NOT NULL,
  `blocked_user` varchar(70) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `deposit_history_bnb`
--

CREATE TABLE `deposit_history_bnb` (
  `id` int(11) NOT NULL,
  `deposit_address` varchar(70) NOT NULL,
  `amount` decimal(12,8) NOT NULL,
  `deposit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token_rate` decimal(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `deposit_history_btc`
--

CREATE TABLE `deposit_history_btc` (
  `id` int(11) NOT NULL,
  `deposit_address` varchar(70) NOT NULL,
  `amount` decimal(12,8) NOT NULL,
  `deposit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token_rate` decimal(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `deposit_history_eth`
--

CREATE TABLE `deposit_history_eth` (
  `id` int(11) NOT NULL,
  `deposit_address` varchar(70) NOT NULL,
  `amount` decimal(12,8) NOT NULL,
  `deposit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token_rate` decimal(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `deposit_history_ever`
--

CREATE TABLE `deposit_history_ever` (
  `id` int(11) NOT NULL,
  `deposit_address` varchar(70) NOT NULL,
  `amount` decimal(12,8) NOT NULL,
  `deposit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token_rate` decimal(10,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `address_from` varchar(100) NOT NULL,
  `address_to` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `address` varchar(70) NOT NULL,
  `nick` varchar(255) DEFAULT NULL,
  `pubkey` varchar(70) DEFAULT NULL,
  `connected` tinyint(1) DEFAULT NULL,
  `nonce` int(6) DEFAULT NULL,
  `authdetails_id_fk` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `user_keys`
--

CREATE TABLE `user_keys` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `seed` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `user_wallets`
--

CREATE TABLE `user_wallets` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `ever` varchar(255) DEFAULT NULL,
  `btc` varchar(255) DEFAULT NULL,
  `eth` varchar(255) DEFAULT NULL,
  `bnb` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `withdrawal_history`
--

CREATE TABLE `withdrawal_history` (
  `id` int(11) NOT NULL,
  `user_address` varchar(70) NOT NULL,
  `withdrawal_address` varchar(70) NOT NULL,
  `amount` decimal(20,8) NOT NULL,
  `amount_token` decimal(20,8) NOT NULL,
  `withdrawal_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token_name` varchar(15) NOT NULL,
  `token_rate` decimal(20,8) NOT NULL,
  `tx_hash` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admin_btc`
--
ALTER TABLE `admin_btc`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `admin_eth`
--
ALTER TABLE `admin_eth`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `admin_ever`
--
ALTER TABLE `admin_ever`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `authdetails`
--
ALTER TABLE `authdetails`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `deposit_history_bnb`
--
ALTER TABLE `deposit_history_bnb`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `deposit_history_btc`
--
ALTER TABLE `deposit_history_btc`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `deposit_history_eth`
--
ALTER TABLE `deposit_history_eth`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `deposit_history_ever`
--
ALTER TABLE `deposit_history_ever`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `address` (`address`),
  ADD KEY `authdetails_id_fk` (`authdetails_id_fk`) USING BTREE;

--
-- Индексы таблицы `user_keys`
--
ALTER TABLE `user_keys`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `user_wallets`
--
ALTER TABLE `user_wallets`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `withdrawal_history`
--
ALTER TABLE `withdrawal_history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admin_btc`
--
ALTER TABLE `admin_btc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `admin_eth`
--
ALTER TABLE `admin_eth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `admin_ever`
--
ALTER TABLE `admin_ever`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `authdetails`
--
ALTER TABLE `authdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `deposit_history_bnb`
--
ALTER TABLE `deposit_history_bnb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `deposit_history_btc`
--
ALTER TABLE `deposit_history_btc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `deposit_history_eth`
--
ALTER TABLE `deposit_history_eth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `deposit_history_ever`
--
ALTER TABLE `deposit_history_ever`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `user_keys`
--
ALTER TABLE `user_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `user_wallets`
--
ALTER TABLE `user_wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `withdrawal_history`
--
ALTER TABLE `withdrawal_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
