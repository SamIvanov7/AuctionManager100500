<?php
session_start();

$is_require = true;

require_once 'classes/config.php';
require_once 'classes/common.php';

$config = new \classes\config\config();
$common = new \classes\common\common();

if(getenv('REQUEST_METHOD') == 'GET'){
	$common->getheaders();
}

if(getenv('REQUEST_METHOD') == 'GET'){
	
	$id_auth = preg_replace('/[^a-f0-9]/','', $_COOKIE['id_auth'] ? $_COOKIE['id_auth'] : '');
	if($id_auth){
		
		$common->check_auth();
		if($common->is_auth){
			
			$file_path = $config->install_dir_auction_manager_app.'/users/'.$common->login;
			if(file_exists($file_path)){
				$file = $common->file_($file_path, 'array', __FILE__, __LINE__);
				if(strpos($file[2], $id_auth) !== false){
					$common->is_auto_auth = true;
				}else{
					$common->is_auth = false;
				}
			}
			
		}
		
	}
	
}

if(getenv('REQUEST_METHOD') == 'POST'){
	$common->check_auth();
}

if(getenv('REQUEST_METHOD') == 'GET'){
		
	if(isset($_GET['js_error'])){
		$common->log_er_js();
	}
	$login = preg_replace('/[^a-zA-Zа-яА-Я0-9_]/','', $_COOKIE['login'] ? $_COOKIE['login'] : '');
	
}

if($common->is_auto_auth || $common->is_auth){

	require_once 'classes/cabinet.php';
	new \classes\cabinet\cabinet();

}else{
	
	if(getenv('REQUEST_METHOD') == 'POST'){
			
		require_once 'classes/post_request_handler.php';
		new \classes\post_request_handler\post_request_handler();
		exit;
			
	}
	
?>
<!DOCTYPE html>
<html class="layout-cell layout-scrollbar">
<head>
<title>Automobile Traiding Administration Tool | Home</title>
<?php echo $common->get_meta_tags_(); ?>
<?php include 'classes/other_javascripts.php'; ?>
<?php echo $common->get_js_scripts_and_css_styles('home'); ?>
</head>
<body>
<div class="main_blok">
<div align="center" class="auth_blok_">
<div class="buffer_left_blok">Авторизация</div>
<div align="center" class="auth_blok">
<div class="logo"></div>
<div class="header_auth_blok">Automobile Traiding Administration Tool</div>
<input style="display:none"><input type="password" style="display:none">
<div class="input_auth_group">
<div class="text">ЛОГИН</div>
<div class="input auth_input">
<input type="text" class="auth_login input" maxlength="18" autocomplete="off" value="<?php echo str_replace('_', ' ', $login); ?>">
</div>
</div>
<div class="input_auth_group">
<div class="text">ПАРОЛЬ</div>
<div class="input auth_input">
<input type="password" class="auth_pass input" maxlength="50">
</div>
</div>
<div class="input_auth_group">
<div class="text">КОД С КАРТИНКИ</div>
<div class="auth_captcha_code captcha_code">
<img src="/captcha.php?loc=1&<?php echo $common->rnd; ?>">
</div>
<div class="input auth_input_captcha">
<input type="text" class="auth_captcha input" maxlength="5" autocomplete="off">
</div>
</div>
<div align="right" style="padding:10px 0px;">
<button class="bt_post_auth send auth_bt">Войти</button>
</div>
</div>
<div class="buffer_right_blok"></div>
</div>
</div>
<div class="footer">
<span class="text">&copy; 2021 ATAT All rights reserved</span>
<a href="https://t.me/ATATsupport" target="_blank"><i class="icon-telegram"></i></a>
</div>
</body>
</html>
<?php } ?>
