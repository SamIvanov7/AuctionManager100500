<?php
namespace classes\start_and_restart_service;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class start_and_restart_service extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$act = preg_replace('/[^a-z]/', '', $_POST['act']);
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		if($file[0] != 'admin'){
			exit(json_encode(array('error'=>'ACCESS_IS_DENIED')));
		}
		
		if($act == 'start'){
			
			$f = fopen($this->config->install_dir_auction_manager_app.'/start_service', 'w+');
			fclose($f);
			
		}else{
			
			$f = fopen($this->config->install_dir_auction_manager_app.'/restart_service', 'w+');
			fclose($f);
			
		}
		
		$i = 0;
			
		while($i < 3){
				
			$i++;
			sleep(1);
				
			exec('ps -efL | grep \'auction_manager_app.py\' 2>&1', $arr);
			$count_process_service = 0;
			$si = sizeof($arr);
			for($a = 0; $a < $si; $a++){
				if(preg_match('/(python3 auction_manager_app\.py (restart|start)|\/usr\/bin\/python3\.[0-9]+ \/usr\/local\/auction_manager_app\/auction_manager_app\.py (restart|start))$/', $arr[$a])){
					$count_process_service++;
				}
			}
			if($count_process_service > 0){
				break;
			}
			
		}
			
		exit(json_encode(array('response'=>array('ok', array('act'=>$act, 'count_process_service'=>$count_process_service)))));
		
	}
	
}
