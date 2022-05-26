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
			exit('Отсуствует файл /users/'.$this->login);
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
				
				preg_match('/filters_([a-z]{2,})_([a-z]{2})\.conf/', $files[$i], $match);
				$vehicle_type = $match[1];
				$country_code = $match[2];
				$file = parent::file_($dir.'/'.$files[$i], 'array', __FILE__, __LINE__);
				$si1 = sizeof($file) - 1;
				$value = '';
				for($a = 0; $a < $si1; $a++){
					$ex = explode(' = ', $file[$a]);
					$value .= '\''.$ex[0].'\':'.$ex[1].',';
				}
				$value = preg_replace('/,$/', '', $value);
				$arr[$country_code] .= '\''.$vehicle_type.'\':{'.$value.'},';
				
			}
			
		}
		foreach($arr as $key=>$value){
			$auction_filters .= '\''.$key.'\':{'.$value.'},';
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
					if($ex[1] == 'car'){
						
						if(!$arr[$ex[0]]){
							$arr[$ex[0]] = array($ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}else{
							array_push($arr[$ex[0]], $ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}
						
					}else if($ex[1] == 'truck'){
						
						if(!$arr[$ex[0]]){
							$arr[$ex[0]] = array($ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}else{
							array_push($arr[$ex[0]], $ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}
						
					}else if($ex[1] == 'tractor'){
						
						if(!$arr[$ex[0]]){
							$arr[$ex[0]] = array($ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}else{
							array_push($arr[$ex[0]], $ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8].'|'.$ex[9].'|'.$ex[10].'|'.$ex[11]);
						}
						
					}else if($ex[1] == 'semitrailer'){
						
						if(!$arr[$ex[0]]){
							$arr[$ex[0]] = array($ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8]);
						}else{
							array_push($arr[$ex[0]], $ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7].'|'.$ex[8]);
						}
						
					}else if($ex[1] == 'constructionmachine'){
						
						if(!$arr[$ex[0]]){
							$arr[$ex[0]] = array($ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7]);
						}else{
							array_push($arr[$ex[0]], $ex[1].'|'.$ex[2].'|'.$ex[3].'|'.$ex[4].'|'.$ex[5].'|'.$ex[6].'|'.$ex[7]);
						}
						
					}
					
				}
				
				foreach($arr as $key=>$value){
					
					$si = sizeof($value);
					$value_ = '';
					for($i = 0; $i < $si; $i++){
						
						$ex = explode('|', $value[$i]);
						if($ex[0] == 'car'){
							
							$value_ .= '{\'car\':{\'brand\':\''.$ex[1].'\', \'model\':\''.$ex[2].'\', \'type_of_fuel\':\''.$ex[3].'\', \'price\':\''.$ex[4].'\', \'years_of_release\':\''.$ex[5].'\', \'mileage\':\''.$ex[6].'\', \'engine_volume\':\''.$ex[7].'\', \'view\':\''.$ex[8].'\', \'date\':\''.$ex[9].'\', \'id\':\''.$ex[10].'\'}},';
						
						}else if($ex[0] == 'truck'){
							
							$value_ .= '{\'truck\':{\'category\':\''.$ex[1].'\', \'model\':\''.$ex[2].'\', \'price\':\''.$ex[3].'\', \'years_of_release\':\''.$ex[5].'\', \'mileage\':\''.$ex[4].'\', \'wheel_formula\':\''.$ex[6].'\', \'axles\':\''.$ex[7].'\', \'environmental_class\':\''.$ex[8].'\', \'date\':\''.$ex[9].'\', \'id\':\''.$ex[10].'\'}},';
							
						}else if($ex[0] == 'tractor'){
							
							$value_ .= '{\'tractor\':{\'category\':\''.$ex[1].'\', \'model\':\''.$ex[2].'\', \'price\':\''.$ex[3].'\', \'years_of_release\':\''.$ex[5].'\', \'mileage\':\''.$ex[4].'\', \'wheel_formula\':\''.$ex[6].'\', \'axles\':\''.$ex[7].'\', \'environmental_class\':\''.$ex[8].'\', \'date\':\''.$ex[9].'\', \'id\':\''.$ex[10].'\'}},';
							
						}else if($ex[0] == 'semitrailer'){
							
							$value_ .= '{\'semitrailer\':{\'category\':\''.$ex[1].'\', \'model\':\''.$ex[2].'\', \'price\':\''.$ex[3].'\', \'years_of_release\':\''.$ex[4].'\', \'axles\':\''.$ex[5].'\', \'date\':\''.$ex[6].'\', \'id\':\''.$ex[7].'\'}},';
							
						}else if($ex[0] == 'constructionmachine'){
							
							$value_ .= '{\'constructionmachine\':{\'category\':\''.$ex[1].'\', \'model\':\''.$ex[2].'\', \'price\':\''.$ex[3].'\', \'years_of_release\':\''.$ex[4].'\', \'date\':\''.$ex[5].'\', \'id\':\''.$ex[6].'\'}},';
							
						}
						
					}
					$user_filters .= '\''.$key.'\':['.preg_replace('/,$/', '', $value_).']';
					
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
		<div class="logo"></div>
		<div class="bt_auction_de bt_left_panel">
		<i class="flag flag-de"></i>
		<i class="icon-hammer"></i>
		</div>
		<div class="bt_auction_us bt_left_panel">
		<i class="flag flag-us"></i>
		<i class="icon-hammer"></i>
		</div>
		<div class="bt_auction_kr bt_left_panel">
		<i class="flag flag-kr"></i>
		<i class="icon-hammer"></i>
		</div>
		<?php if($status == 'admin'){
		echo '<div class="bt_get_info_bug bt_left_panel">
		<i class="bt_info_bug icon-bug"><div class="new_bug_marker" style="'.($is_new_bug_marker ? 'display:block;' : 'display:none;').'"></div></i>
		<div class="tooltip_mes_info_bug" style="display:none;">Ошибки</div>
		</div>';
		echo '<div class="bt_get_users bt_left_panel">
		<i class="bt_users icon-users"></i>
		<div class="tooltip_mes_users" style="display:none;">Пользователи</div>
		</div>';
		echo '<div class="bt_get_settings bt_left_panel">
		<i class="bt_settings icon-cog"></i>
		<div class="tooltip_mes_settings" style="display:none;">Настройки</div>
		</div>';
		} ?>
		<div class="bt_left_panel">
		<div class="tooltip_parent">
		<a href="https://t.me/ATATsupport" target="_blank"><i class="icon-telegram"></i></a>
		<div class="tooltip_mes_support" style="<?php if($_COOKIE['tooltip_info_support'] != '1'){echo 'display:block;';}else{echo 'display:none;';} ?>"><div class="relative">Техподдержка<i class="bt_close_tooltip_info_support icon-cancel" onclick="close_tooltip_info_support()"></i></div></div>
		</div>
		</div>
		</div>
		<i class="icon-off"></i>
		</div>
		<div class="right_panel"></div>
		</div>
		</body>
		</html>

<?php 
			
	}
	
}
