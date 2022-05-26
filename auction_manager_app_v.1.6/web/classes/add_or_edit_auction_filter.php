<?php
namespace classes\add_or_edit_auction_filter;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class add_or_edit_auction_filter extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$filter = parent::remove_bad_symbol($_POST['filter'], false);
		$act = preg_replace('/[^a-z]/', '', $_POST['act']);
		$id = preg_replace('/[^0-9]/', '', $_POST['id']);
		$country_code = preg_replace('/[^a-z]/', '', $_POST['country_code']);
		$auction_number = preg_replace('/[^0-9]/', '', $_POST['auction_number']);
		
		$ex = explode('|', $filter);
		$f = false;
		$vehicle_type = $ex[0];
		
		switch($country_code){
			
			case 'de':
				
				if($auction_number == 1){
					
					switch($vehicle_type){
						
						case 'car':
						
							$brand = preg_replace('/^none$/', '', $ex[1]);
							if($brand != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$type_of_fuel = preg_replace('/^none$/', '', $ex[3]);
							if($type_of_fuel != ''){$f = true;}
							$price_from = preg_replace('/^none$/', '', $ex[4]);
							if($price_from != ''){$f = true;}
							$price_up_to = preg_replace('/^none$/', '', $ex[5]);
							if($price_up_to != ''){$f = true;}
							$year_since = preg_replace('/^none$/', '', $ex[6]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/^none$/', '', $ex[7]);
							if($year_of_release_by != ''){$f = true;}
							$mileage_from = preg_replace('/^none$/', '', $ex[8]);
							if($mileage_from != ''){$f = true;}
							$mileage_to = preg_replace('/^none$/', '', $ex[9]);
							if($mileage_to != ''){$f = true;}
							$engine_displacement_from = preg_replace('/[^0-9]/', '', $ex[10]);
							if($engine_displacement_from != ''){$f = true;}
							$engine_displacement_up_to = preg_replace('/[^0-9]/', '', $ex[11]);
							if($engine_displacement_up_to != ''){$f = true;}
							$view = $ex[12];
							if($view != ''){$f = true;}
							
						break;
						case 'truck':
						
							$category = preg_replace('/^none$/', '', $ex[1]);
							if($category != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$price_from = preg_replace('/^none$/', '', $ex[3]);
							if($price_from != ''){$f = true;}
							$price_up_to = preg_replace('/^none$/', '', $ex[4]);
							if($price_up_to != ''){$f = true;}
							$year_since = preg_replace('/^none$/', '', $ex[5]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/^none$/', '', $ex[6]);
							if($year_of_release_by != ''){$f = true;}
							$mileage_from = preg_replace('/^none$/', '', $ex[7]);
							if($mileage_from != ''){$f = true;}
							$mileage_to = preg_replace('/^none$/', '', $ex[8]);
							if($mileage_to != ''){$f = true;}
							$wheel_formula = preg_replace('/^none$/', '', $ex[9]);
							if($wheel_formula != ''){$f = true;}
							$axles = preg_replace('/^none$/', '', $ex[10]);
							if($axles != ''){$f = true;}
							$environmental_class = preg_replace('/^none$/', '', $ex[11]);
							if($environmental_class != ''){$f = true;}
						
						break;
						case 'tractor':
						
							$category = preg_replace('/^none$/', '', $ex[1]);
							if($category != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$price_from = preg_replace('/^none$/', '', $ex[3]);
							if($price_from != ''){$f = true;}
							$price_up_to = preg_replace('/^none$/', '', $ex[4]);
							if($price_up_to != ''){$f = true;}
							$year_since = preg_replace('/^none$/', '', $ex[5]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/^none$/', '', $ex[6]);
							if($year_of_release_by != ''){$f = true;}
							$mileage_from = preg_replace('/^none$/', '', $ex[7]);
							if($mileage_from != ''){$f = true;}
							$mileage_to = preg_replace('/^none$/', '', $ex[8]);
							if($mileage_to != ''){$f = true;}
							$wheel_formula = preg_replace('/^none$/', '', $ex[9]);
							if($wheel_formula != ''){$f = true;}
							$axles = preg_replace('/^none$/', '', $ex[10]);
							if($axles != ''){$f = true;}
							$environmental_class = preg_replace('/^none$/', '', $ex[11]);
							if($environmental_class != ''){$f = true;}
						
						break;
						case 'semitrailer':
						
							$category = preg_replace('/^none$/', '', $ex[1]);
							if($category != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$price_from = preg_replace('/^none$/', '', $ex[3]);
							if($price_from != ''){$f = true;}
							$price_up_to = preg_replace('/^none$/', '', $ex[4]);
							if($price_up_to != ''){$f = true;}
							$year_since = preg_replace('/^none$/', '', $ex[5]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/^none$/', '', $ex[6]);
							if($year_of_release_by != ''){$f = true;}
							$axles = preg_replace('/^none$/', '', $ex[7]);
							if($axles != ''){$f = true;}
						
						break;
						case 'constructionmachine':
						
							$category = preg_replace('/^none$/', '', $ex[1]);
							if($category != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$price_from = preg_replace('/^none$/', '', $ex[3]);
							if($price_from != ''){$f = true;}
							$price_up_to = preg_replace('/^none$/', '', $ex[4]);
							if($price_up_to != ''){$f = true;}
							$year_since = preg_replace('/^none$/', '', $ex[5]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/^none$/', '', $ex[6]);
							if($year_of_release_by != ''){$f = true;}
						
						break;
						
					}
					
				}
			
			break;
			case 'us':
				
				if($auction_number == 1){
					
					switch($vehicle_type){
						
						case 'car':
						
							$brand = preg_replace('/^none$/', '', $ex[1]);
							if($brand != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$type_of_fuel = preg_replace('/^none$/', '', $ex[3]);
							if($type_of_fuel != ''){$f = true;}
							$year_since = preg_replace('/[^0-9]/', '', $ex[4]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/[^0-9]/', '', $ex[5]);
							if($year_of_release_by != ''){$f = true;}
							$mileage_from = preg_replace('/[^0-9]/', '', $ex[6]);
							if($mileage_from != ''){$f = true;}
							$mileage_up_to = preg_replace('/[^0-9]/', '', $ex[7]);
							if($mileage_up_to != ''){$f = true;}
							$damage = preg_replace('/^none$/', '', $ex[8]);
							if($damage != ''){$f = true;}
							$the_date_of_the = preg_replace('/^none$/', '', $ex[10]);
							if($the_date_of_the != ''){$f = true;}
							$buy_it_now = $ex[9];
							if($buy_it_now != ''){$f = true;}
							
						break;
						
					}
					
				}else if($auction_number == 2){
					
					switch($vehicle_type){
						
						case 'car':
						
							$brand = preg_replace('/^none$/', '', $ex[1]);
							if($brand != ''){$f = true;}
							$model = preg_replace('/^none$/', '', $ex[2]);
							if($model != ''){$f = true;}
							$type_of_fuel = preg_replace('/^none$/', '', $ex[3]);
							if($type_of_fuel != ''){$f = true;}
							$year_since = preg_replace('/[^0-9]/', '', $ex[4]);
							if($year_since != ''){$f = true;}
							$year_of_release_by = preg_replace('/[^0-9]/', '', $ex[5]);
							if($year_of_release_by != ''){$f = true;}
							$mileage_from = preg_replace('/[^0-9]/', '', $ex[6]);
							if($mileage_from != ''){$f = true;}
							$mileage_up_to = preg_replace('/[^0-9]/', '', $ex[7]);
							if($mileage_up_to != ''){$f = true;}
							$damage = preg_replace('/^none$/', '', $ex[8]);
							if($damage != ''){$f = true;}
							$the_date_of_the = preg_replace('/^none$/', '', $ex[10]);
							if($the_date_of_the != ''){$f = true;}
							$buy_it_now = $ex[9];
							if($buy_it_now != ''){$f = true;}
							
						break;
						
					}
					
				}
				
			break;
			
		}
		
		if(!in_array($vehicle_type, array('car', 'truck', 'tractor', 'semitrailer', 'constructionmachine'))){
			exit(json_encode(array('error'=>'FAIL_VEHICLE_TYPE')));
		}
		
		if(!$f){
			exit(json_encode(array('error'=>'FAIL_FILTER')));
		}
		
		if(!in_array($country_code, array('de', 'us', 'kr'))){
			exit(json_encode(array('error'=>'FAIL_COUNTRY_CODE')));
		}
		
		if(!file_exists($this->config->install_dir_auction_manager_app.'/users/'.$this->login)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		
		if($auction_number == 0 || $auction_number{0} == 0){
			$auction_number = 1;
		}
		
		$date = parent::convert_format_date($this->date);
		
		$file_path = $this->config->install_dir_auction_manager_app.'/filters/filters_'.$vehicle_type.'_'.$country_code.'_'.$auction_number.'.conf';
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_filters_'.$vehicle_type.'_'.$country_code.'_'.$auction_number.'.conf')));
		}
		$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
		
		switch($country_code){
			
			case 'de':
				
				if($auction_number == 1){
					
					switch($vehicle_type){
						
						case 'car':
						
							$brands_ = $file[0];
							$models_ = $file[1];
							$type_of_fuel_ = $file[2];
							$prices_ = $file[3];
							$years_of_release_ = $file[4];
							$mileage_ = $file[5];
							
							if($brand && strpos($brands_, '\''.$brand.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__BRAND')));
							}
							
							if($model && strpos($models_, '\''.$model.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($type_of_fuel && strpos($type_of_fuel_, '\''.$type_of_fuel.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__TYPE_OF_FUEL')));
							}
							
							if($price_from && strpos($prices_, '\''.$price_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_FROM')));
							}
							
							if($price_up_to && strpos($prices_, '\''.$price_up_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_TO')));
							}
							
							if($price_from && $price_up_to && $price_from > $price_up_to){
								$price_from = $price_up_to;
							}
							$prices = (!$price_from && !$price_up_to ? '' : $price_from.':'.$price_up_to);
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
							if($mileage_from && strpos($mileage_, '\''.$mileage_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_FROM')));
							}
							
							if($mileage_to && strpos($mileage_, '\''.$mileage_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_TO')));
							}
							
							if($mileage_from && $mileage_to && $mileage_from > $mileage_to){
								$mileage_from = $mileage_to;
							}
							
							$mileage = (!$mileage_from && !$mileage_to ? '' : $mileage_from.':'.$mileage_to);
							
							if($engine_displacement_from && $engine_displacement_from{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__ENGINE_DISPLACEMENT_FROM')));
							}
							
							if($engine_displacement_up_to && $engine_displacement_up_to{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__ENGINE_DISPLACEMENT_UP_TO')));
							}
			
							if($engine_displacement_from && $engine_displacement_up_to && $engine_displacement_from > $engine_displacement_up_to){
								$engine_displacement_from = $engine_displacement_up_to;
							}
							
							$engine_volume = (!$engine_displacement_from && !$engine_displacement_up_to ? '' : $engine_displacement_from.':'.$engine_displacement_up_to);
							
							if($view && !in_array($view, array('new', 'used', 'new,used'))){
								exit(json_encode(array('error'=>'FAIL_PARAM__VIEW')));
							}
						
						break;
						case 'truck':
							
							$categories_ = $file[0];
							$models_ = $file[1];
							$prices_ = $file[2];
							$mileage_ = $file[3];
							$years_of_release_ = $file[4];
							$wheel_formula_ = $file[5];
							$axles_ = $file[6];
							$environmental_class_ = $file[7];
								
							if($category && strpos($categories_, '\''.$category.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__CATEGORY')));
							}
							
							if($model && strpos($models_, '\''.$model.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($price_from && strpos($prices_, '\''.$price_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_FROM')));
							}
							
							if($price_up_to && strpos($prices_, '\''.$price_up_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_TO')));
							}
							
							if($price_from && $price_up_to && $price_from > $price_up_to){
								$price_from = $price_up_to;
							}
							$prices = (!$price_from && !$price_up_to ? '' : $price_from.':'.$price_up_to);
							
							if($mileage_from && strpos($mileage_, '\''.$mileage_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_FROM')));
							}
							
							if($mileage_to && strpos($mileage_, '\''.$mileage_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_TO')));
							}
							
							if($mileage_from && $mileage_to && $mileage_from > $mileage_to){
								$mileage_from = $mileage_to;
							}
							
							$mileage = (!$mileage_from && !$mileage_to ? '' : $mileage_from.':'.$mileage_to);
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
							if($wheel_formula && strpos($wheel_formula_, '\''.$wheel_formula.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__WHEEL_FORMULA')));
							}
							
							if($axles && strpos($axles_, '\''.$axles.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__AXLES')));
							}
							
							if($environmental_class && strpos($environmental_class_, '\''.$environmental_class.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__AXLES')));
							}
								
						break;
						case 'tractor':
							
							$categories_ = $file[0];
							$models_ = $file[1];
							$prices_ = $file[2];
							$mileage_ = $file[3];
							$years_of_release_ = $file[4];
							$wheel_formula_ = $file[5];
							$axles_ = $file[6];
							$environmental_class_ = $file[7];
								
							if($category && strpos($categories_, '\''.$category.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__CATEGORY')));
							}
							
							if($model && strpos($models_, '\''.$model.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($price_from && strpos($prices_, '\''.$price_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_FROM')));
							}
							
							if($price_up_to && strpos($prices_, '\''.$price_up_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_TO')));
							}
							
							if($price_from && $price_up_to && $price_from > $price_up_to){
								$price_from = $price_up_to;
							}
							$prices = (!$price_from && !$price_up_to ? '' : $price_from.':'.$price_up_to);
							
							if($mileage_from && strpos($mileage_, '\''.$mileage_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_FROM')));
							}
							
							if($mileage_to && strpos($mileage_, '\''.$mileage_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_TO')));
							}
							
							if($mileage_from && $mileage_to && $mileage_from > $mileage_to){
								$mileage_from = $mileage_to;
							}
							
							$mileage = (!$mileage_from && !$mileage_to ? '' : $mileage_from.':'.$mileage_to);
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
							if($wheel_formula && strpos($wheel_formula_, '\''.$wheel_formula.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__WHEEL_FORMULA')));
							}
							
							if($axles && strpos($axles_, '\''.$axles.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__AXLES')));
							}
							
							if($environmental_class && strpos($environmental_class_, '\''.$environmental_class.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__AXLES')));
							}
								
						break;
						case 'semitrailer':
							
							$categories_ = $file[0];
							$models_ = $file[1];
							$prices_ = $file[2];
							$years_of_release_ = $file[3];
							$axles_ = $file[4];
								
							if($category && strpos($categories_, '\''.$category.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__CATEGORY')));
							}
							
							if($model && strpos($models_, '\''.$model.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($price_from && strpos($prices_, '\''.$price_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_FROM')));
							}
							
							if($price_up_to && strpos($prices_, '\''.$price_up_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_TO')));
							}
							
							if($price_from && $price_up_to && $price_from > $price_up_to){
								$price_from = $price_up_to;
							}
							$prices = (!$price_from && !$price_up_to ? '' : $price_from.':'.$price_up_to);
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
							if($axles && strpos($axles_, '\''.$axles.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__AXLES')));
							}
							
						break;
						case 'constructionmachine':
							
							$categories_ = $file[0];
							$models_ = $file[1];
							$prices_ = $file[2];
							$years_of_release_ = $file[3];
								
							if($category && strpos($categories_, '\''.$category.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__CATEGORY')));
							}
							
							if($model && strpos($models_, '\''.$model.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($price_from && strpos($prices_, '\''.$price_from.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_FROM')));
							}
							
							if($price_up_to && strpos($prices_, '\''.$price_up_to.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__PRICE_TO')));
							}
							
							if($price_from && $price_up_to && $price_from > $price_up_to){
								$price_from = $price_up_to;
							}
							$prices = (!$price_from && !$price_up_to ? '' : $price_from.':'.$price_up_to);
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
						break;
						
					}
				
				}
		
			break;
			case 'us':
				
				if($auction_number == 1){
				
					switch($vehicle_type){
						
						case 'car':
						
							$brands_ = $file[0];
							$models_ = $file[1];
							$type_of_fuel_ = $file[2];
							$years_of_release_ = $file[3];
							$damage_ = $file[4];
							
							if($brand && strpos($brands_, '\''.$brand.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__BRAND')));
							}
							
							if($model && strpos($models_, '\''.$model.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($type_of_fuel && strpos($type_of_fuel_, '\''.$type_of_fuel.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__TYPE_OF_FUEL')));
							}
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
							
							if($mileage_from && $mileage_from{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_FROM')));
							}
							
							if($mileage_up_to && $mileage_up_to{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_UP_TO')));
							}
			
							if($mileage_from && $mileage_up_to && $mileage_from > $mileage_up_to){
								$mileage_from = $mileage_up_to;
							}
							
							$mileage = (!$mileage_from && !$mileage_up_to ? '' : $mileage_from.':'.$mileage_up_to);
							
							if($damage && strpos($damage_, '\''.$damage.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__DAMAGE')));
							}
							
							if($buy_it_now && $buy_it_now != 'buy_it_now'){
								exit(json_encode(array('error'=>'FAIL_PARAM__BUY_IT_NOW')));
							}
							
							if($the_date_of_the && $the_date_of_the != 'only_with_date' && $the_date_of_the != 'only_no_date'){
								exit(json_encode(array('error'=>'FAIL_PARAM__THE_DATE_OF_THE')));
							}
						
						break;
					
					}
				
				}else if($auction_number == 2){
					
					switch($vehicle_type){
						
						case 'car':
						
							$brands_ = $file[0];
							$models_ = $file[1];
							$type_of_fuel_ = $file[2];
							$years_of_release_ = $file[3];
							$damage_ = $file[4];
							
							if($brand && strpos($brands_, '\''.$brand.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__BRAND')));
							}
							
							if($model && strpos($models_, '\''.$model.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__MODEL')));
							}
							
							if($type_of_fuel && strpos($type_of_fuel_, '\''.$type_of_fuel.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__TYPE_OF_FUEL')));
							}
							
							if($year_since && strpos($years_of_release_, '\''.$year_since.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_SINCE')));
							}
							
							if($year_of_release_by && strpos($years_of_release_, '\''.$year_of_release_by.'\'') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__YEAR_OF_RELEASE_BY')));
							}
							
							if($year_since && $year_of_release_by && $year_since > $year_of_release_by){
								$year_since = $year_of_release_by;
							}
							
							$years_of_release = (!$year_since  && !$year_of_release_by ? '' : $year_since.':'.$year_of_release_by);
								
							if($mileage_from && $mileage_from{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_FROM')));
							}
							
							if($mileage_up_to && $mileage_up_to{0} === '0'){
								exit(json_encode(array('error'=>'FAIL_PARAM__MILEAGE_UP_TO')));
							}
			
							if($mileage_from && $mileage_up_to && $mileage_from > $mileage_up_to){
								$mileage_from = $mileage_up_to;
							}
							
							$mileage = (!$mileage_from && !$mileage_up_to ? '' : $mileage_from.':'.$mileage_up_to);
							
							if($damage && strpos($damage_, '\''.$damage.'\':') === false){
								exit(json_encode(array('error'=>'FAIL_PARAM__DAMAGE')));
							}
							
							if($buy_it_now && $buy_it_now != 'buy_it_now'){
								exit(json_encode(array('error'=>'FAIL_PARAM__BUY_IT_NOW')));
							}
							
							if($the_date_of_the && $the_date_of_the != 'only_with_date' && $the_date_of_the != 'only_no_date'){
								exit(json_encode(array('error'=>'FAIL_PARAM__THE_DATE_OF_THE')));
							}
						
						break;
					
					}
					
				}
				
			break;
			
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/user_filters/'.$this->login;
					
		$f = fopen($file_path, 'a+');
		if (flock($f, LOCK_EX)) {
			
			clearstatcache(true, $file_path);
			$siz = filesize($file_path);
			if ($siz != 0) {
				
				$text = fread($f, $siz);
				
				if($act == 'add'){
					
					switch($country_code){
						
						case 'de':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
									
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$brand.'\|'.$model.'\|'.$type_of_fuel.'\|'.$prices.'\|'.$years_of_release.'\|'.$mileage.'\|'.$engine_volume.'\|'.$view.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
									case 'truck':
								
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$category.'\|'.$model.'\|'.$prices.'\|'.$mileage.'\|'.$years_of_release.'\|'.$wheel_formula.'\|'.$axles.'\|'.$environmental_class.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
									case 'tractor':
								
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$category.'\|'.$model.'\|'.$prices.'\|'.$mileage.'\|'.$years_of_release.'\|'.$wheel_formula.'\|'.$axles.'\|'.$environmental_class.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
									case 'semitrailer':
										
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$category.'\|'.$model.'\|'.$prices.'\|'.$years_of_release.'\|'.$axles.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
									case 'constructionmachine':
										
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$category.'\|'.$model.'\|'.$prices.'\|'.$years_of_release.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
									
								}
							
							}
						
						break;
						case 'us':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
									
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$brand.'\|'.$model.'\|'.$type_of_fuel.'\|'.$years_of_release.'\|'.$mileage.'\|'.$damage.'\|'.$buy_it_now.'\|'.$the_date_of_the.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
								
								}
							
							}else if($auction_number == 2){
								
								switch($vehicle_type){
									
									case 'car':
									
										if(mb_ereg($country_code.'\|'.$vehicle_type.'\|'.$brand.'\|'.$model.'\|'.$type_of_fuel.'\|'.$years_of_release.'\|'.$mileage.'\|'.$damage.'\|'.$buy_it_now.'\|'.$the_date_of_the.'\|[^\|]+\|[0-9]{12}\|'.$auction_number.'', $text)){
											flock($f, LOCK_UN);
											fclose($f);
											exit(json_encode(array('error'=>'FILTER_IS_EXISTS')));
										}
										
									break;
								
								}
								
							}
							
						break;
						
					}
					
				}
				
				$text = explode($this->php_eol, $text);
				$si = sizeof($text) - 1;
				
				if($act == 'add'){
					
					switch($country_code){
						
						case 'de':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$prices.'|'.$years_of_release.'|'.$mileage.'|'.$engine_volume.'|'.$view.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'truck':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'tractor':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'semitrailer':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$axles.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'constructionmachine':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									
								}
							
							}
						
						break;
						case 'us':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
								
								}
							
							}else if($auction_number == 2){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
								
								}
								
							}
							
						break;
						
					}
				
				}
				
				if($act == 'edit'){
					
					for($i = 0; $i < $si; $i++){
						
						$ex = explode('|', $text[$i]);
						
						switch($country_code){
							
							case 'de':
								
								if($auction_number == 1){

									switch($vehicle_type){
										
										case 'car':
										
											if($ex[11] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$prices.'|'.$years_of_release.'|'.$mileage.'|'.$engine_volume.'|'.$view.'|'.$date.'|'.$ex[11].'|'.$ex[12];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
										case 'truck':
										
											if($ex[11] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$ex[11].'|'.$ex[12];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
										case 'tractor':
											
											if($ex[11] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$ex[11].'|'.$ex[12];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
										case 'semitrailer':
											
											if($ex[8] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$axles.'|'.$date.'|'.$ex[8].'|'.$ex[9];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
										case 'constructionmachine':
											
											if($ex[7] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$date.'|'.$ex[7].'|'.$ex[8];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
										
									}
								
								}else{
									$text2 .= $text[$i] . $this->php_eol;
								}
							
							break;
							case 'us':
								
								if($auction_number == 1){
									
									switch($vehicle_type){
										
										case 'car':
										
											if($ex[11] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$ex[11].'|'.$ex[12];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
									
									}
								
								}else if($auction_number == 2){
									
									switch($vehicle_type){
										
										case 'car':
										
											if($ex[11] == $id){
												$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$ex[11].'|'.$ex[12];
												$text2 .= $result . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
											}
											
										break;
									
									}
									
								}else{
									$text2 .= $text[$i] . $this->php_eol;
								}
								
							break;
						
						}
						
					}
					
					ftruncate($f, 0);
					stream_set_write_buffer($f, 0);
					
				}
				fwrite($f, $text2);
				fflush($f);
					
			}else{
				
				if($act == 'add'){
					
					switch($country_code){
						
						case 'de':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$prices.'|'.$years_of_release.'|'.$mileage.'|'.$engine_volume.'|'.$view.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'truck':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'tractor':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$mileage.'|'.$years_of_release.'|'.$wheel_formula.'|'.$axles.'|'.$environmental_class.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'semitrailer':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$axles.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									case 'constructionmachine':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$category.'|'.$model.'|'.$prices.'|'.$years_of_release.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
									
								}
							
							}
							
						break;
						case 'us':
							
							if($auction_number == 1){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
								
								}
							
							}else if($auction_number == 2){
								
								switch($vehicle_type){
									
									case 'car':
										
										$result = $country_code.'|'.$vehicle_type.'|'.$brand.'|'.$model.'|'.$type_of_fuel.'|'.$years_of_release.'|'.$mileage.'|'.$damage.'|'.$buy_it_now.'|'.$the_date_of_the.'|'.$date.'|'.$this->rnd.'|'.$auction_number;
										$text2 = $result . $this->php_eol;
										
									break;
								
								}
								
							}
							
						break;
					
					}
					
				}
				
				fwrite($f, $text2);
				fflush($f);
				
			}
				
			flock($f, LOCK_UN);
			
		}
		else {
			parent::log_er_flock(__FILE__, __LINE__);
		}
		fclose($f);
		
		$f = fopen($this->config->install_dir_auction_manager_app.'/reload_user_conf', 'w+');
		fclose($f);
		
		if($act == 'edit'){
			$f = fopen($this->config->install_dir_auction_manager_app.'/abort_distribution_ids', 'a+');
			if (flock($f, LOCK_EX)) {
				fwrite($f, $id.$this->php_eol);
			}else {
				parent::log_er_flock(__FILE__, __LINE__);
			}
			fclose($f);
		}
		
		exit(json_encode(array('response'=>array('ok', $act, $result))));
		
	}
	
}
