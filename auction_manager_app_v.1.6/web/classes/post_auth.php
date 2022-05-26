<?php
namespace classes\post_auth;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class post_auth extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		
		$login = parent::login($_POST['login'] ? $_POST['login'] : '');
		$pass = preg_replace('/[^a-zA-Z0-9_\.]/u','', $_POST['pass'] ? $_POST['pass'] : '');
		$captcha = preg_replace('/[^a-zA-Z0-9]/','',$_POST['captcha'] ? $_POST['captcha'] : '');
	
		$len = mb_strlen($pass);
		if ($len < 6 || $len > 50) {
			exit(json_encode(array('error'=>'FAIL_PASS')));
		}
		
		if($captcha === ''){
			$captcha = 1;
		}
		if ($_SESSION['captcha1'] == strtolower($captcha)) {
			$_SESSION['captcha1'] = '';
		}
		else {
			exit(json_encode(array('error'=>'CAPTCHA')));
		}
		
		$id_auth = preg_replace('/[^a-f0-9]/', '', $_COOKIE['id_auth'] ? $_COOKIE['id_auth'] : '');
		$login_md5 = md5($login . $this->config->auth_salt);
		if (!preg_match('/^[a-f0-9]{32}$/', $id_auth)) {
			$id_auth = md5($login_md5.$this->time);
		}
		$uid = $login_md5;
		
		$hash = md5($pass . $this->config->password_salt);
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$login;
		
		if(file_exists($file_path)){
			
			$f = fopen($file_path, 'a+');
				if (flock($f, LOCK_EX)) {
					
					clearstatcache(true, $file_path);
					$siz = filesize($file_path);
					if ($siz != 0) {
						
						$text = fread($f, $siz);
						$text = explode($this->php_eol, $text);
						$si = sizeof($text) - 1;
						
						if($text[1] != $hash){
							flock($f, LOCK_UN);
							fclose($f);
							exit(json_encode(array('error'=>'WRONG_PASSWORD')));
						}
						
						for ($i = 0;$i < $si;$i++) {
							
							if($i == 2){
								
								if (strpos($text[$i], $id_auth) === false) {
											$ex = explode(',', $text[$i]);
											if (sizeof($ex) < 10) {
												$text2 .= $id_auth.','.$text[$i].$this->php_eol;
											}
											else {
												$text2 .= $id_auth.','.$ex[0].','.$ex[1].','.$ex[2].','.$ex[3].','.$ex[4].','.$ex[5].','.$ex[6].','.$ex[7].','.$ex[8].$this->php_eol;
											}
										}
										else {
											$text2 .= $text[$i].$this->php_eol;
										}
										
							}	else {
								$text2 .= $text[$i].$this->php_eol;
							}
							
						}
						ftruncate($f, 0);
						stream_set_write_buffer($f, 0);
						fwrite($f, $text2);
						fflush($f);
							
					}
						
					flock($f, LOCK_UN);
					
				}
				else {
					parent::log_er_flock(__FILE__, __LINE__);
				}
				fclose($f);
				
		}else{
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		
		exit(json_encode(array('response'=>array($login, $uid, $id_auth))));

	}
	
}
