<?php
namespace classes\add_or_edit_user;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class add_or_edit_user extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$user = parent::login($_POST['user'] ? $_POST['user'] : '');
		$pass = preg_replace('/[^a-zA-Z0-9_\.]/u','', $_POST['pass'] ? $_POST['pass'] : '');
		$act = preg_replace('/[^a-z]/','', $_POST['act'] ? $_POST['act'] : '');
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
		if ($user === '') {
			exit(json_encode(array('error'=>'FAIL_LOGIN')));
		}

		if ($user === '_') {
			exit(json_encode(array('error'=>'FAIL_LOGIN2')));
		}
		
		$len = mb_strlen($pass);
		if ($len < 6 || $len > 50) {
			exit(json_encode(array('error'=>'FAIL_PASS')));
		}
		
		$hash = md5($pass . $this->config->password_salt);
		
		if($act == 'add'){
		
			$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$user;
			
			if(file_exists($file_path)){
				exit(json_encode(array('error'=>'EXISTS_LOGIN')));
			}
			
			$text = 'user' . $this->php_eol . $hash . $this->php_eol . $this->php_eol . $this->php_eol;
			
			$f = fopen($file_path, 'a+');
			fwrite($f, $text);
			fclose($f);
		
		}else{
			
			$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$user;
			
			if(file_exists($file_path)){
						
						$f = fopen($file_path, 'a+');
							if (flock($f, LOCK_EX)) {
								
								clearstatcache(true, $file_path);
								$siz = filesize($file_path);
								if ($siz != 0) {
									
									$text = fread($f, $siz);
									$text = explode($this->php_eol, $text);
									$si = sizeof($text) - 1;
									
										for($i = 0; $i < $si; $i++){
											
											if($i == 1){
												$text2 .= $hash . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
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
				exit(json_encode(array('error'=>'NO_EXISTS_USER')));
			}
			
		}
		
		exit(json_encode(array('response'=>array('act'=>$act, 'user'=>$user))));
		
	}
	
}
