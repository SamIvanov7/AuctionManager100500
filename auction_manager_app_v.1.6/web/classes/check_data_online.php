<?php
namespace classes\check_data_online;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class check_data_online extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$data = preg_replace('/[^a-z\|]/', '', $_POST['data']);
		
		$ex = explode('|', $data);
		
		$country_code = $ex[0];
		$get_info_bug = $ex[1];
		
		$arr1 = array();
		$arr2 = array();
		$arr3 = array();
		
		if($country_code && !in_array($country_code, array('de', 'us', 'kr'))){
			exit(json_encode(array('error'=>'FAIL_COUNTRY_CODE')));
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
					
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		$si = sizeof($file) - 1;
		for($i = 3; $i < $si; $i++){
			$ex = explode('|', $file[$i]);
			if($ex[1] == $country_code){
				$arr1[0] = $ex[2];
				$arr1[1] = $ex[3];
				$arr1[2] = $country_code;
				break;
			}
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/new_errors';
		
		if(file_exists($file_path)){
			
			$arr = array();
			
			$file = file($file_path);
			$si = sizeof($file);
			for($i = 0; $i < $si; $i++){
				$arr[] = $file[$i];
			}
	
			$arr2[0]['logs_new_bug'] = $arr;
			
			if($get_info_bug == 'yes'){
				unlink($file_path);
			}
			
		}else{
			$arr2[0]['logs_new_bug'] = array();
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/errors.log';
		if(file_exists($file_path)){
			$siz = filesize($file_path);
			$arr2[1]['errors.log'] = $siz;
		}
			
		$dir = $this->config->install_dir_auction_manager_app.'/log_error_parse';
		$files = scandir($dir);
		$si = sizeof($files);
		for($i = 0; $i < $si; $i++){
			if($files[$i] != '.' && $files[$i] != '..'){
				$siz = filesize($dir.'/'.$files[$i]);
				$arr2[1][$files[$i]] = $siz;
			}
		}
		
		$dir = $this->config->install_dir_auction_manager_app.'/log_error_auth';
		$files = scandir($dir);
		$si = sizeof($files);
		for($i = 0; $i < $si; $i++){
			if($files[$i] != '.' && $files[$i] != '..'){
				$siz = filesize($dir.'/'.$files[$i]);
				$arr2[1][$files[$i]] = $siz;
			}
		}
		
		exec('ps -efL | grep \'auction_manager_app.py\' 2>&1', $arr);
		$count_process_service = 0;
		$si = sizeof($arr);
		for($i = 0; $i < $si; $i++){
			if(preg_match('/(python3 auction_manager_app\.py (restart|start)|\/usr\/bin\/python3\.[0-9]+ \/usr\/local\/auction_manager_app\/auction_manager_app\.py (restart|start))$/', $arr[$i])){
				$count_process_service++;
			}
		}
		$arr3[]['count_process_service'] = $count_process_service;
		
		exit(json_encode(array('response'=>array($arr1, $arr2, $arr3))));
		
	}
	
}
