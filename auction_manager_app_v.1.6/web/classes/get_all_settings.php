<?php
namespace classes\get_all_settings;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class get_all_settings extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
				
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
		$arr = array();
		$file_path = $this->config->install_dir_auction_manager_app.'/auctions.conf';
		
		if(file_exists($file_path)){
			
			$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
			$si = sizeof($file) - 1;
			for($i = 0; $i < $si; $i++){
				$ex = explode('|', $file[$i]);
				$arr[] = array('auction'=>array('country_code'=>$ex[0], 'currency'=>$ex[1], 'auction'=>$ex[2], 'time_interval'=>$ex[4], 'proxy_host'=>$ex[5], 'proxy_port'=>$ex[6], 'proxy_username'=>$ex[7], 'proxy_password'=>$ex[8], 'result_limit'=>$ex[9], 'auction_auth_username'=>$ex[10], 'auction_auth_password'=>$ex[11]));
			}
			
		}else{
			exit(json_encode(array('error'=>'NO_EXISTS_AUCTIONS.CONF')));
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/search_vin.conf';
		
		if(file_exists($file_path)){
			
			$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
			$si = sizeof($file) - 1;
			for($i = 0; $i < $si; $i++){
				$ex = explode('|', $file[$i]);
				$arr[] = array('search_vin'=>array('site'=>$ex[0], 'username'=>$ex[1], 'password'=>$ex[2]));
			}
			
		}else{
			exit(json_encode(array('error'=>'NO_EXISTS_SEARCH_VIN.CONF')));
		}
		
		exit(json_encode(array('response'=>$arr)));
		
	}
	
}
