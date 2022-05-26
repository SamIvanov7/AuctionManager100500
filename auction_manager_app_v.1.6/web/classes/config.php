<?php
namespace classes\config;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class config {
	
	public $install_dir_auction_manager_app = 'C:/Users/user/Documents/Python Projects/auction_manager_app';
	public $ignor_error_mes = '|Script error.|Script error|[object Event]|UnknownError|InvalidStateError|Uncaught ArgumentError: Error |Uncaught TypeError: Object |UNTRUSTED/1.0|nokia 6233|Dalvik/2.|UCBrowser/9.|Firefox/3.|';
	public $auth_salt = 'loli';
	public $password_salt = 'jooooiu';
	
}
