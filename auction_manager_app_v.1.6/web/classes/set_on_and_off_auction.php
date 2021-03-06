<?php
namespace classes\set_on_and_off_auction;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class set_on_and_off_auction extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$act = preg_replace('/[^a-z]/', '', $_POST['act']);
		$auction = preg_replace('/[^a-z0-9\.\-_]/', '', $_POST['auction']);
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}

		$file_path = $this->config->install_dir_auction_manager_app.'/sites.conf';
		
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
						
							$ex = explode('|', $text[$i]);
							if(str_replace('#', '', $ex[2]) == $auction){
								$text2 .= $ex[0].'|'.$ex[1].'|'.($act == 'off' ? '#' : '').str_replace('#', '', $ex[2]).'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9] . $this->php_eol;
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
		
			$f = fopen($this->config->install_dir_auction_manager_app.'/reload_admin_conf', 'w+');
			fclose($f);
		
		}else{
			exit(json_encode(array('error'=>'NO_EXISTS_SITES.CONF')));
		}
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
