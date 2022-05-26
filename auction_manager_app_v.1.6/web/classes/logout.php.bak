<?php
namespace classes\logout;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class logout extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		parent::check_auth();
		
		if(!$this->is_auth){
			exit;
		}
		
		$file_path = $this->config->install_dir_auction_manager_app.'/users/'.$this->login;
		
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
											
											if($i == 2){
												$text2 .= '' . $this->php_eol;
											}else{
												$text2 .= $text[$i] . $this->php_eol;
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
			
		}
		
		exit(json_encode(array('response'=>'ok')));
		
	}
	
}
