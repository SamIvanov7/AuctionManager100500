<?php
namespace classes\save_telegram_channel;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class save_telegram_channel extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$country_code = preg_replace('/[^a-z]/', '', $_POST['country_code']);
		$telegram_channel = $_POST['telegram_channel'];
		
		if(!in_array($country_code, array('de', 'us', 'kr'))){
			exit(json_encode(array('error'=>'FAIL_COUNTRY_CODE')));
		}
		
		$telegram_channel = substr($telegram_channel, 0, 512);
		
		if(strpos($telegram_channel, '|') !== false){
			if(str_replace('|', '', $telegram_channel) == ''){
				exit(json_encode(array('error'=>'FAIL_NAME_TELEGRAM_CHANNEL')));
			}
		}
		
		$telegram_channel = str_replace('|', '', $telegram_channel);
		
		if($telegram_channel == ' '){
			exit(json_encode(array('error'=>'FAIL_NAME_TELEGRAM_CHANNEL')));
		}
		
		if($telegram_channel != ''){
			
			$dir = $this->config->install_dir_auction_manager_app.'/users';
			
			$files = scandir($dir);
			$si = sizeof($files);
			for($i = 0; $i < $si; $i++){
				if($files[$i] != '.' && $files[$i] != '..' && $files[$i] != $this->login){
					$file = parent::file_($dir.'/'.$files[$i], 'array', __FILE__, __LINE__);
					$si1 = sizeof($file) - 1;
					for($a = 3; $a < $si1; $a++){
						$ex = explode('|', $file[$a]);
						if($ex[2] === $telegram_channel){
							exit(json_encode(array('error'=>'TELEGRAM_CHANNEL_EXISTS')));
						}
					}
				}
			}
		
		}
		
		$s = false;
		$id_telegram_channel = '';
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(file_exists($file_path)){
			
			$f = fopen($file_path, 'a+');
				if (flock($f, LOCK_EX)) {
					
					clearstatcache(true, $file_path);
					$siz = filesize($file_path);
					if ($siz != 0) {
						
						$text = fread($f, $siz);
						$text = explode($this->php_eol, $text);
						$si = sizeof($text) - 1;
						
						for ($i = 0;$i < $si;$i++) {
							
							if($i > 2){
								
								if($text[$i] == ''){
									if($telegram_channel != ''){
										$text2 .= '|'.$country_code.'|'.$telegram_channel.'|||'.$this->php_eol;
									}else{
										$text2 .= $text[$i].$this->php_eol;
									}
									$s = true;
								}else{
									$ex = explode('|', $text[$i]);
									if($ex[1] == $country_code){
										
										if($ex[3] !== '' && $ex[2] != $telegram_channel){
											$text2 .= '|'.$ex[1].'|'.$telegram_channel.'||'.$ex[4].'|'.$this->php_eol;
											$id_telegram_channel = '';
										}else{
											$text2 .= '|'.$ex[1].'|'.$telegram_channel.'|'.$ex[3].'|'.$ex[4].'|'.$this->php_eol;
											$id_telegram_channel = $ex[3];
										}
										$s = true;
										
									}else{
										$text2 .= $text[$i].$this->php_eol;
									}
								}
		
							}	else {
								$text2 .= $text[$i].$this->php_eol;
							}
							
						}
						
						if(!$s){
							$text2 .= '|'.$country_code.'|'.$telegram_channel.'|||'.$this->php_eol;
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
		
		if($telegram_channel != ''){
			$f = fopen($this->config->install_dir_auction_manager_app.'/reload_user_conf', 'w+');
			fclose($f);
		}
		
		exit(json_encode(array('response'=>array('ok', $telegram_channel, $id_telegram_channel))));

	}
	
}
