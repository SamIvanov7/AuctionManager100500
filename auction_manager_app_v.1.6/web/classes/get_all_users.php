<?php
namespace classes\get_all_users;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class get_all_users extends \classes\common\common {
	
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
		
		$arr_admins = array();
		$arr_users = array();
		$dir = $this->config->install_dir_auction_manager_app.'/users';
		
		$files = scandir($dir);
		$si = sizeof($files);
		for($i = 0; $i < $si; $i++){
			
			if($files[$i] != '.' && $files[$i] != '..'){
				
					$file = parent::file_($dir.'/'.$files[$i], 'array', __FILE__, __LINE__);
					$si1 = sizeof($file) - 1;
					$status = $file[0];
					$arr1 = array();
					$arr2 = array();
					
					for($a = 3; $a < $si1; $a++){
						$ex = explode('|', $file[$a]);
						if($ex[1] && $ex[2]){
							$arr1[$ex[1]] = array('telegram_channel'=>$ex[2], 'id_telegram_channel'=>$ex[3], 'access_denial'=>$ex[4]);
						}
					}
					
					$file_path = $this->config->install_dir_auction_manager_app.'/user_filters/'.$files[$i];
					
					if(file_exists($file_path)){
						$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
						$si1 = sizeof($file) - 1;
						for($a = $si1; $a >= 0; $a--){
							
							$ex = explode('|', $file[$a]);
							$auction_number = $ex[sizeof($ex) - 1];
							
							switch($ex[0]){
								
								case 'de':
									
									if($auction_number == 1){
											
										if($ex[1] == 'car'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'brand'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[6], 'price'=>$ex[5], 'type_of_fuel'=>$ex[4], 'mileage'=>$ex[7], 'engine_volume'=>$ex[8], 'view'=>$ex[9], 'id'=>$ex[11], 'date'=>$ex[10], 'auction_number'=>$ex[12]);
											
										}else if($ex[1] == 'truck'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'category'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[6], 'price'=>$ex[4], 'mileage'=>$ex[5], 'wheel_formula'=>$ex[7], 'axles'=>$ex[8], 'environmental_class'=>$ex[9], 'id'=>$ex[11], 'date'=>$ex[10], 'auction_number'=>$ex[12]);
											
										}else if($ex[1] == 'tractor'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'category'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[6], 'price'=>$ex[4], 'mileage'=>$ex[5], 'wheel_formula'=>$ex[7], 'axles'=>$ex[8], 'environmental_class'=>$ex[9], 'id'=>$ex[11], 'date'=>$ex[10], 'auction_number'=>$ex[12]);
											
										}else if($ex[1] == 'semitrailer'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'category'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[5], 'price'=>$ex[4], 'axles'=>$ex[6], 'id'=>$ex[8], 'date'=>$ex[7], 'auction_number'=>$ex[9]);
											
										}else if($ex[1] == 'constructionmachine'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'category'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[5], 'price'=>$ex[4], 'id'=>$ex[7], 'date'=>$ex[6], 'auction_number'=>$ex[8]);
											
										}
									
									}
								
								break;
								case 'us':
									
									if($auction_number == 1){
									
										if($ex[1] == 'car'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'brand'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[5], 'type_of_fuel'=>$ex[4], 'mileage'=>$ex[6], 'damage'=>$ex[7], 'buy_it_now'=>$ex[8], 'the_date_of_the'=>$ex[9], 'id'=>$ex[11], 'date'=>$ex[10], 'auction_number'=>$ex[12]);
											
										}
									
									}else if($auction_number == 2){
										
										if($ex[1] == 'car'){
											
											$arr2[][$ex[0]] = array('vehicle_type'=>$ex[1], 'brand'=>$ex[2], 'model'=>$ex[3], 'years_of_release'=>$ex[5], 'type_of_fuel'=>$ex[4], 'mileage'=>$ex[6], 'damage'=>$ex[7], 'buy_it_now'=>$ex[8], 'the_date_of_the'=>$ex[9], 'id'=>$ex[11], 'date'=>$ex[10], 'auction_number'=>$ex[12]);
											
										}
										
									}
									
								break;
								
							}
							
						}
					}
					
					if($status == 'admin'){
						$arr_admins[$files[$i]] = array('status'=>$status, 'data'=>$arr1, 'auction_filters'=>$arr2);
					}else{
						$arr_users[$files[$i]] = array('status'=>$status, 'data'=>$arr1, 'auction_filters'=>$arr2);
					}
					
			}
			
		}
		
		exit(json_encode(array('response'=>array($arr_admins, $arr_users))));
		
	}
	
}
