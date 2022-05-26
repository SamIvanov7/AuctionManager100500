<?php
namespace classes\delete_parsing_errors_list;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class delete_parsing_errors_list extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$id = htmlspecialchars($_POST['id'], ENT_QUOTES, $this->encoding);
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/log_error_parse/'.$id;
		if(file_exists($file_path)){
			unlink($file_path);
		}
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
