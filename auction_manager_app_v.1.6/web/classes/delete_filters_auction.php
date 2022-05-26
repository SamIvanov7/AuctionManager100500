<?php
namespace classes\delete_filters_auction;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class delete_filters_auction extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$vehicle_type = preg_replace('/[^a-z]/', '', $_POST['vehicle_type']);
		$data = preg_replace('/[^0-9,]/', '', $_POST['data']);
		$country_code = preg_replace('/[^a-z]/', '', $_POST['country_code']);
		$auction_number = preg_replace('/[^0-9]/', '', $_POST['auction_number']);
		
		if(!preg_match('/^([0-9]{12},?)+$/', $data)){
			exit(json_encode(array('error'=>'FAIL_DATA')));
		}
		
		if(!file_exists($this->config->install_dir_auction_manager_app.'/users/'.$this->login)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		
		if(!in_array($vehicle_type, array('car', 'truck', 'tractor', 'semitrailer', 'constructionmachine'))){
			exit(json_encode(array('error'=>'FAIL_VEHICLE_TYPE')));
		}
		
		if($auction_number == 0 || $auction_number{0} == 0){
			$auction_number = 1;
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/user_filters/'.$this->login;
						
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
											
											switch($country_code){
												
												case 'de':
													
													if($auction_number == 1){
														
														if($ex[1] == $vehicle_type && $vehicle_type == 'car'){
															
															if(strpos($data, $ex[11]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}else if($ex[1] == $vehicle_type && $vehicle_type == 'truck'){
															
															if(strpos($data, $ex[11]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}else if($ex[1] == $vehicle_type && $vehicle_type == 'tractor'){
															
															if(strpos($data, $ex[11]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}else if($ex[1] == $vehicle_type && $vehicle_type == 'semitrailer'){
															
															if(strpos($data, $ex[8]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}else if($ex[1] == $vehicle_type && $vehicle_type == 'constructionmachine'){
															
															if(strpos($data, $ex[7]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}else{
															$text2 .= $text[$i] . $this->php_eol;
														}
														
													}else{
														$text2 .= $text[$i] . $this->php_eol;
													}
													
												break;
												case 'us':
													
													if($auction_number == 1){
														
														if($ex[1] == $vehicle_type && $vehicle_type == 'car'){
															
															if(strpos($data, $ex[11]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}
														
													}else if($auction_number == 2){
														
														if($ex[1] == $vehicle_type && $vehicle_type == 'car'){
															
															if(strpos($data, $ex[11]) !== false){
																$text2 .= '';
															}else{
																$text2 .= $text[$i] . $this->php_eol;
															}
															
														}
														
													}else{
														$text2 .= $text[$i] . $this->php_eol;
													}
													
												break;
												
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
							
				}else{
					exit(json_encode(array('error'=>'NO_EXISTS_USER_FILTERS')));
				}
				
		$f = fopen($this->config->install_dir_auction_manager_app.'/reload_user_conf', 'w+');
		fclose($f);
		
		$ids = str_replace(',', $this->php_eol, $data);
		$f = fopen($this->config->install_dir_auction_manager_app.'/abort_distribution_ids', 'a+');
		if (flock($f, LOCK_EX)) {
			fwrite($f, $ids . $this->php_eol);
		}else {
			parent::log_er_flock(__FILE__, __LINE__);
		}
		fclose($f);
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
