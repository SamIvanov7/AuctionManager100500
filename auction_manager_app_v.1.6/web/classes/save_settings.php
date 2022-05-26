<?php
namespace classes\save_settings;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class save_settings extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$act = preg_replace('/[^a-z_]/', '', $_POST['act']);
		$data = parent::remove_bad_symbol($_POST['data'], false);
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
		if($act == 'auction'){
			
			$ex = explode('|', $data);
			$site = $ex[0];
			$time_interval = $ex[1];
			$proxy = $ex[2];
			$result_limit = $ex[3];
			$auction_auth = $ex[4];
			
			if(!in_array($time_interval, array(300, 900, 1800, 3600, 10800, 21600, 43200, 86400))){
				exit(json_encode(array('error'=>'FAIL_TIME_INTERVAL')));
			}
			
			if($proxy && !preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3} [0-9]{4,5}( [a-zA-Z0-9]{2,} [a-zA-Z0-9]{2,})?$/', $proxy)){
				exit(json_encode(array('error'=>'FAIL_PROXY')));
			}
			
			if($proxy){
				
				$ex = explode(' ', $proxy);
				$proxy_host = $ex[0];
				$proxy_port = $ex[1];
				$proxy_username = $ex[2];
				$proxy_password = $ex[3];
				
			}else{
				
				$proxy_host = '';
				$proxy_port = '';
				$proxy_username = '';
				$proxy_password = '';
				
			}
			
			if($result_limit{0} === '0' || !preg_match('/^[0-9]{1,}$/', $result_limit) || $result_limit > 999 || $result_limit < 1){
				exit(json_encode(array('error'=>'FAIL_RESULT_LIMIT')));
			}
			
			if($auction_auth && !preg_match('/^.+ .+$/', $auction_auth)){
				exit(json_encode(array('error'=>'FAIL_AUCTION_AUTH')));
			}
			
			if($auction_auth){
				
				$ex = explode(' ', $auction_auth);
				$auction_auth_username = $ex[0];
				$auction_auth_password = $ex[1];
				
			}else{
		
				$auction_auth_username = '';
				$auction_auth_password = '';
				
			}
			
			$file_path = $this->config->install_dir_auction_manager_app.'/auctions.conf';
			
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
								if(str_replace('#', '', $ex[2]) == $site){
									$text2 .= $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$time_interval.'|'.$proxy_host.'|'.$proxy_port.'|'.$proxy_username.'|'.$proxy_password.'|'.$result_limit.'|'.$auction_auth_username.'|'.$auction_auth_password . $this->php_eol;
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
				exit(json_encode(array('error'=>'NO_EXISTS_AUCTIONS.CONF')));
			}
		
		}else if($act == 'search_vin'){
			
			$ex = explode('|', $data);
			$site = $ex[0];
			$search_vin_auth = $ex[1];

			if($search_vin_auth && !preg_match('/^.+ .+$/', $search_vin_auth)){
				exit(json_encode(array('error'=>'FAIL_SEARCH_VIN_AUTH')));
			}
			
			if($search_vin_auth){
				
				$ex = explode(' ', $search_vin_auth);
				$search_vin_username = $ex[0];
				$search_vin_password = $ex[1];
				
			}else{
		
				$search_vin_username = '';
				$search_vin_password = '';
				
			}
			
			$file_path = $this->config->install_dir_auction_manager_app.'/search_vin.conf';
			
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
								if($ex[0] == $site){
									$text2 .= $ex[0].'|'.$search_vin_username.'|'.$search_vin_password . $this->php_eol;
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
				exit(json_encode(array('error'=>'NO_EXISTS_SEARCH_VIN.CONF')));
			}
			
		}
		
		exit(json_encode(array('response'=>array('act'=>$act, 'site'=>$site))));
		
	}
	
}
