<?php
namespace classes\delete_user;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class delete_user extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$user = parent::login($_POST['user'] ? $_POST['user'] : '');
		
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
			
			unlink($file_path);
			
			$file_path = $this->config->install_dir_auction_manager_app.'/user_filters/'.$user;
			if(file_exists($file_path)){
				unlink($file_path);
			}
			
		}else{
			exit(json_encode(array('error'=>'NO_EXISTS_USER')));
		}

		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
