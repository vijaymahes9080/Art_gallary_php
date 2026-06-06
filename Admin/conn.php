<?php
	// Check environment variables first (for cloud hosting like Clever Cloud, Railway, Render, etc.)
	$host = getenv('MYSQL_ADDON_HOST') ?: getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: 'localhost';
	$user = getenv('MYSQL_ADDON_USER') ?: getenv('MYSQLUSER') ?: getenv('DB_USER') ?: 'root';
	$pass = getenv('MYSQL_ADDON_PASSWORD') ?: getenv('MYSQLPASSWORD') ?: getenv('DB_PASS') ?: '';
	$db   = getenv('MYSQL_ADDON_DB') ?: getenv('MYSQLDATABASE') ?: getenv('DB_NAME') ?: 'art_gallery';
	$port = getenv('MYSQL_ADDON_PORT') ?: getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: '3306';

	$link = mysqli_connect($host, $user, $pass, $db, $port);
	if(mysqli_connect_error())
	{
		echo "Connection error: ".mysqli_connect_error();
		exit;
	}
?>