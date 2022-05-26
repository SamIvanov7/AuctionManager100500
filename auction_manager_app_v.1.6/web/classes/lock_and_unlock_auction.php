<?php
namespace classes\lock_and_unlock_auction;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class lock_and_unlock_auction extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$user = parent::login($_POST['user'] ? $_POST['user'] : '');
		$country_code = preg_replace('/[^a-z]/','', $_POST['country_code'] ? $_POST['country_code'] : '');
		$act = preg_replace('/[^a-z]/','', $_POST['act'] ? $_POST['act'] : '');
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
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
											
											if($i > 2){
												$ex = explode('|', $text[$i]);
												if($ex[1] == $country_code){
													$text2 .= '|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.($act == 'lock' ? 'access_denial' : '').'|' . $this->php_eol;
												}else{
													$text2 .= $text[$i] . $this->php_eol;
												}
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
		
		$f = fopen($this->config->install_dir_auction_manager_app.'/reload_user_conf', 'w+');
		fclose($f);
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
