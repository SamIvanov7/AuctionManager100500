<?php
namespace classes\clear_cache;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class clear_cache extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit(json_encode(array('error'=>'FAIL_AUTH')));
		}
		
		$country_code = preg_replace('/[^a-z]/','', $_POST['country_code'] ? $_POST['country_code'] : '');
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
		if(!file_exists($file_path)){
			exit(json_encode(array('error'=>'NO_EXISTS_LOGIN')));
		}
		
		$file = parent::file_($file_path, 'string', __FILE__, __LINE__);
		
		preg_match('/\|'.$country_code.'\|[^\|]+\|([0-9\-]+)\|(access_denial)?\|/', $file, $match);
		if($match[1]){
			
			$telegram_channel = $match[1];
			
			$f = fopen($this->config->install_dir_auction_manager_app.'/clear_cache', 'a+');
			if (flock($f, LOCK_EX)) {
				fwrite($f, $telegram_channel . $this->php_eol);
				flock ($f,LOCK_UN);
			}else {
				parent::log_er_flock(__FILE__, __LINE__);
			}
			fclose($f);
			
		}else{
			exit(json_encode(array('error'=>'TELEGRAM_CHANNEL_NO_SUBSCRIBE')));
		}
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
