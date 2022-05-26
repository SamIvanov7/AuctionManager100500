<?php
namespace classes\cabinet;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class cabinet extends \classes\common\common {

	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		$is_require = true;
		
		if(getenv('REQUEST_METHOD') == 'POST'){
			
			require_once 'classes/post_request_handler.php';
			new \classes\post_request_handler\post_request_handler();
			exit;
				
		}
			
		if(!file_exists($this->config->install_dir_auction_manager_app.'/users/'.$this->login)){
			exit('
			<script>
			document.cookie = \'id_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT\';
			document.location.reload();
			</script>
			');
		}
		$file = parent::file_($this->config->install_dir_auction_manager_app.'/users/'.$this->login, 'array', __FILE__, __LINE__);
		$si = sizeof($file);
		$status = $file[0];
		$country_and_telegram_channels = '';
		
		for($i = 3; $i < $si; $i++){
			$ex = explode('|', $file[$i]);
			if($ex[1]){
				$country_and_telegram_channels .= '\''.$ex[1].'\':{\'telegram_channel\':\''.$ex[2].'\', \'id_telegram_channel\':\''.$ex[3].'\'},';
			}
		}
		
		$country_and_telegram_channels = preg_replace('/,$/', '', $country_and_telegram_channels);
		
		$auction_filters = '';
		$dir = $this->config->install_dir_auction_manager_app.'/filters';
		
		$files = scandir($dir);
		$si = sizeof($files);
		$arr = array();
		for($i = 0; $i < $si; $i++){
			
			if($files[$i] != '.' && $files[$i] != '..'){
				
				preg_match('/filters_([a-z]{2,})_([a-z]{2})_([0-9]{1})\.conf/', $files[$i], $match);
				if($match[0]){
					$vehicle_type = $match[1];
					$country_code = $match[2];
					$index_site = $match[3];
					$file = parent::file_($dir.'/'.$files[$i], 'array', __FILE__, __LINE__);
					$si1 = sizeof($file) - 1;
					$value = '';
					for($a = 0; $a < $si1; $a++){
						$ex = explode(' = ', $file[$a]);
						$value .= '\''.$ex[0].'\':'.$ex[1].',';
					}
					$value = preg_replace('/,$/', '', $value);
					$arr[$country_code][$index_site] .= '\''.$vehicle_type.'\':{'.$value.'},index_site:'.$index_site;
				}
			
			}
			
		}
		
		foreach($arr as $key=>$value){
			$value_ = '';
			foreach($value as $key1=>$value1){
				preg_match('/index_site:([0-9]{1})/', $value1, $match);
				$index_site = $match[1];
				$value1 = preg_replace('/index_site:[0-9]{1}/', '', $value1);
				$value_ .= $index_site.':{'.$value1.'}, ';
			}
			$auction_filters .= '\''.$key.'\':{'.$value_.'},';
		}
		$auction_filters = preg_replace('/,$/', '', $auction_filters);
		
		$user_filters = '';
		$file_path = $this->config->install_dir_auction_manager_app.'/user_filters/'.$this->login;
		
		if(file_exists($file_path)){
			
			$file = parent::file_($file_path, 'array', __FILE__, __LINE__);
			$si = sizeof($file) - 1;
			$arr = array();
			
			if($si > 0){
				for($i = 0; $i < $si; $i++){
					
					$ex = explode('|', $file[$i]);
					
					switch($ex[0]){
						
						case 'de':
						
							switch($ex[1]){
								
								case 'car':
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}
									
								break;
								case 'truck':
								
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}
								
								break;
								case 'tractor':
								
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}
								
								break;
								case 'semitrailer':
								
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9]);
									}
								
								break;
								case 'constructionmachine':
								
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8]);
									}
								
								break;
								
							}
						
						break;
						case 'us':
							
							switch($ex[1]){
								
								case 'car':
								
									if(!$arr[$ex[0]]){
										$arr[$ex[0]] = array($ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}else{
										array_push($arr[$ex[0]], $ex[0].'|'.$ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11].'|'.$ex[12]);
									}
									
								break;
							
							}
							
						break;
						
					}
					
				}
				
				foreach($arr as $key=>$value){
					
					$si = sizeof($value);
					$value_ = '';
					for($i = 0; $i < $si; $i++){
						
						$ex = explode('|', $value[$i]);
						$auction_number = $ex[sizeof($ex) - 1];
						
						switch($ex[0]){
							
							case 'de':
							
								switch($ex[1]){
									
									case 'car':
									
										$value_ .= '{\'car\':{\'brand\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'type_of_fuel\':\''.$ex[4].'\', \'price\':\''.$ex[5].'\', \'years_of_release\':\''.$ex[6].'\', \'mileage\':\''.$ex[7].'\', \'engine_volume\':\''.$ex[8].'\', \'view\':\''.$ex[9].'\', \'date\':\''.$ex[10].'\', \'id\':\''.$ex[11].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
									case 'truck':
									
										$value_ .= '{\'truck\':{\'category\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'price\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[6].'\', \'mileage\':\''.$ex[5].'\', \'wheel_formula\':\''.$ex[7].'\', \'axles\':\''.$ex[8].'\', \'environmental_class\':\''.$ex[9].'\', \'date\':\''.$ex[10].'\', \'id\':\''.$ex[11].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
									case 'tractor':
									
										$value_ .= '{\'tractor\':{\'category\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'price\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[6].'\', \'mileage\':\''.$ex[5].'\', \'wheel_formula\':\''.$ex[7].'\', \'axles\':\''.$ex[8].'\', \'environmental_class\':\''.$ex[9].'\', \'date\':\''.$ex[10].'\', \'id\':\''.$ex[11].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
									case 'semitrailer':
									
										$value_ .= '{\'semitrailer\':{\'category\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'price\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[5].'\', \'axles\':\''.$ex[6].'\', \'date\':\''.$ex[7].'\', \'id\':\''.$ex[8].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
									case 'constructionmachine':
									
										$value_ .= '{\'constructionmachine\':{\'category\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'price\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[5].'\', \'date\':\''.$ex[6].'\', \'id\':\''.$ex[7].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
								
								}
							
							break;
							case 'us':
								
								switch($ex[1]){
									
									case 'car':
									
										$value_ .= '{\'car\':{\'brand\':\''.$ex[2].'\', \'model\':\''.$ex[3].'\', \'type_of_fuel\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[5].'\', \'mileage\':\''.$ex[6].'\', \'damage\':\''.$ex[7].'\', \'buy_it_now\':\''.$ex[8].'\', \'the_date_of_the\':\''.$ex[9].'\', \'date\':\''.$ex[10].'\', \'id\':\''.$ex[11].'\', \'auction_number\':\''.$auction_number.'\'}},';
									
									break;
								
								}
								
							break;
							
						}
					}
					$user_filters .= '\''.$key.'\':['.preg_replace('/,$/', '', $value_).'],';
					
				}
			}
		}
		
		if(file_exists($this->config->install_dir_auction_manager_app.'/new_errors')){
			$is_new_bug_marker = true;
		}
		
		?>
		<!DOCTYPE html>
		<html class="layout-cell layout-scrollbar">
		<head>
		<title>Кабинет</title>
		<?php echo parent::get_meta_tags_(); ?>
		<?php include 'classes/other_javascripts.php'; ?>
		<?php echo parent::get_js_scripts_and_css_styles('cabinet'); ?>
		<script type="text/javascript">
		var country_and_telegram_channels = {<?php echo $country_and_telegram_channels; ?>},
		auction_filters = {<?php echo $auction_filters; ?>},
		user_filters = {<?php echo $user_filters; ?>};
		</script>
		</head>
		<body>
		<div class="main_blok">
		<div align="center" class="left_panel">
		<div>
		<div class="bt_select_auction center_middle bt_left_panel">
		<i class="selected_country_flag"></i>
		<i class="icon-hammer"></i>
		</div>
		<?php if($status == 'admin'){
		echo '<div class="bt_get_info_bug center_middle bt_left_panel">
		<i class="icon-bug"><div class="new_bug_marker" style="'.($is_new_bug_marker ? 'display:block;' : 'display:none;').'"></div></i>
		</div>';
		echo '<div class="bt_get_users center_middle bt_left_panel">
		<i class="icon-users"></i>
		</div>';
		echo '<div class="bt_get_settings center_middle bt_left_panel">
		<i class="icon-cog"></i>
		</div>';
		} ?>
		<div class="bt_select_support center_middle bt_left_panel">
		<i class="icon-telegram"></i>
		</div>
		</div>
		<div>
		<div class="bt_logout center_middle bt_left_panel">
		<i class="icon-off"></i>
		</div>
		</div>
		</div>
		<div class="central_panel">
		<div class="window_central_panel" style="height:150px;">
		<div class="header_window_central_panel">
		<div class="logo"></div>
		<div class="header_window_text">Automobile Traiding Administration Tool</div>
		</div></div>
		</div>
		<div class="right_panel"></div>
		<div align="left" class="auction_options_window window" style="display:none;">
		<div class="header_text_window">Выберите аукцион</div>
		<div class="auction_options_window_content layout-cell layout-scrollbar">
		<div class="option_auction bt_auction_de">Аукцион Германии (mobile.de)
		<i class="selected_auction_ok selected_auction_de_1 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_us_1">Аукцион США (copart.com)
		<i class="selected_auction_ok selected_auction_us_1 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_us_2">Аукцион США (iaai.com)
		<i class="selected_auction_ok selected_auction_us_2 icon-ok-1" style="display:none;"></i>
		</div>
		<!--		
		<div class="option_auction bt_auction_us_3" style="opacity:0.35;">Аукцион США 3
		<i class="selected_auction_ok selected_auction_us_3 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_kr_1" style="opacity:0.35;">Аукцион Кореи 1
		<i class="selected_auction_ok selected_auction_kr_1 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_kr_2" style="opacity:0.35;">Аукцион Кореи 2
		<i class="selected_auction_ok selected_auction_kr_2 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_kr_3" style="opacity:0.35;">Аукцион Кореи 3
		<i class="selected_auction_ok selected_auction_kr_3 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_kr_4" style="opacity:0.35;">Аукцион Кореи 4
		<i class="selected_auction_ok selected_auction_kr_4 icon-ok-1" style="display:none;"></i>
		</div>
		<div class="option_auction bt_auction_kr_5" style="opacity:0.35;">Аукцион Кореи 5
		<i class="selected_auction_ok selected_auction_kr_5 icon-ok-1" style="display:none;"></i>
		</div>
		-->
		</div>
		</div>
		<div align="left" class="notice_window window" style="display:none;">
		<div class="header_text_window">Уведомление<i class="close_window icon-cancel" onclick="get_notice_window('close')"></i></div>
		<div class="notice_window_content layout-cell layout-scrollbar"></div>
		</div>
		</div>
		</body>
		</html>

<?php 
			
	}
	
}
