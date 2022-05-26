<?php
namespace classes\clear_service_errors_list;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class clear_service_errors_list extends \classes\common\common {
	
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
		
		$f = fopen($this->config->install_dir_auction_manager_app.'/errors.log', 'w+');
		fclose($f);
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
