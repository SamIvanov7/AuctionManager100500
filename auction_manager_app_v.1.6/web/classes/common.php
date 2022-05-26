<?php
namespace classes\common;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class common {
	
	protected $config;
	protected $ip = '';
	protected $time = '';
	protected $document_root = '';
	protected $date = '';
	protected $user_agent = '';
	protected $rnd = '';
	protected $encoding = 'UTF-8';
	protected $charset = 'utf-8';
	protected $login = '';
	protected $myid = '';
	protected $uid = '';
	protected $php_eol = "\r\n";
	public $is_auto_auth = false;
	public $is_auth = false;
	
	public function __construct(){
		
		global $config;
		
		date_default_timezone_set('UTC');
		
		$this->config = $config;
		$this->ip = $_SERVER['REMOTE_ADDR'];
		$this->time = $_SERVER['REQUEST_TIME'];
		$this->document_root = $_SERVER['DOCUMENT_ROOT'];
		$this->date = date('H i s d m Y');
		$this->user_agent = mb_substr(htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ? $_SERVER['HTTP_USER_AGENT'] : '', ENT_QUOTES, $this->encoding), 0, 250);
		$this->rnd = mt_rand(100000,999000).mt_rand(100000,999000);
		
	}
	
	public function __get($name){
		return $this->$name;
	}
	
	public function getheaders() {
		
		header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
		header('Pragma: no-cache'); // HTTP/1.0
		header('Content-type: text/html; charset='.$this->charset);
		
	}

	public function remove_bad_symbol($str, $vertical_bar = true) {
		
		$str = str_replace('`', '&#96;',
		str_replace('\\', '&#092;',
		str_replace("\r\n", '',
		str_replace("\r", '',
		str_replace("\n", '',
		str_replace("\t", '',
		str_replace("\0", '',
		str_replace("\00", '',
		str_replace("\f", '',
		str_replace("\b", '',
		str_replace('­', '-', htmlspecialchars($str, ENT_QUOTES, $this->encoding))))))))))));
		if($vertical_bar){
			$str = str_replace('|', '&#124;', $str);
		}
		return $str;
		
	}
	
	public function check_auth(){
		
		$this->login = preg_replace('/[^a-zA-Zа-яА-Я0-9_]/','', $_COOKIE['login'] ? $_COOKIE['login'] : '');
		$this->uid = preg_replace('/[^a-f0-9 ]/','', $_COOKIE['uid'] ? $_COOKIE['uid'] : '');
		$this->is_auth = true;
		
		$ex = explode(' ',$this->uid);
		$login_md5 = md5($this->login . $this->config->auth_salt);
		if($login_md5 != $ex[0]){
			$this->is_auth = false;
		}
		
		if(!$this->is_auth){
			$this->login = '';
			$this->uid = '';
		}
	
	}
	
	public function file_($url, $type , $script_filename, $line){
		
		if(!file_exists($url)){
			exit('FILE_NO_EXISTS: '.$url);
		}
		$f = fopen($url, 'a+');
		if(flock($f,LOCK_EX)){
			
			clearstatcache(true,$url);
			$siz = filesize($url);
			if($siz != 0){
				
				$res = fread($f,$siz);
				if($type == 'array'){
					$res = explode($this->php_eol, $res);
				}
				
			}else{
				
				$res = '';
				if($type == 'array'){
					$res = array();
				}
				
			}
			flock ($f,LOCK_UN);
			
		}else{
			$this->log_er_flock($script_filename, $line);
		}
		fclose($f);
		
		return $res;
	
	}
	
	public function convert_format_date($d ){
		
		$ex=explode(' ',$d);
		$m=$ex[4];
		if($m=='01'){$m='янв';}
		else if($m=='02'){$m='фев';}
		else if($m=='03'){$m='мар';}
		else if($m=='04'){$m='апр';}
		else if($m=='05'){$m='май';}
		else if($m=='06'){$m='июн';}
		else if($m=='07'){$m='июл';}
		else if($m=='08'){$m='авг';}
		else if($m=='09'){$m='сен';}
		else if($m=='10'){$m='окт';}
		else if($m=='11'){$m='ноя';}
		else if($m=='12'){$m='дек';}
		$d=preg_replace('/^0/','',$ex[3]);
		$y=$ex[5];
		$h=$ex[0];
		if($h=='0'){$h='00';}
		$i=$ex[1];
		$s=$ex[2];
		$date=$d.' '.$m.' '.$y.' в '.$h.':'.$i.':'.$s;
		return $date;
		
	}
	
	public function log_er_js(){

		$mes = htmlspecialchars($_GET['m'], ENT_COMPAT, $this->encoding);
		$page = htmlspecialchars($_GET['p'], ENT_COMPAT, $this->encoding);
		$file = htmlspecialchars($_GET['f'], ENT_COMPAT, $this->encoding);
		$line = htmlspecialchars($_GET['l'], ENT_COMPAT, $this->encoding);
		$date = $this->convert_format_date($this->date);
		
		$a = (strpos($this->config->ignor_error_mes, '|'.$mes.'|') !== false);
		$b = false;
		$ex = explode('|', $this->config->ignor_error_mes);
		$si = sizeof($ex) - 1;
		for ($i = 0;$i < $si;$i++) {
			
			if ($ex[$i]) {
				
				if (strpos($this->user_agent, $ex[$i]) !== false) {
					$b = true;
					break;
				}
				
			}
			
		}
		if (!$a && !$b) {
			
			$file_path = $this->document_root.'/data/js_errors.log';
			$text = '|'.$date.'|'.$this->ip.'|'.$mes.'|'.$page.' ('.$file.')|'.$line.'|'.$this->user_agent.'|'.$this->php_eol;
			
			if (file_exists($file_path)) {
				
				$f = fopen($file_path, 'a+');
				if (flock($f, LOCK_EX)) {
					
					clearstatcache(true, $file_path);
					$siz = filesize($file_path);
					if ($siz != 0) {

						$data = fread($f, $siz);
						$ex = explode($this->php_eol, $data);
						$si = sizeof($ex) - 1;
						if($si > 9900){
							ftruncate($f, 0);
						}
						
					}
			
					stream_set_write_buffer($f, 0);
					fwrite($f, $text);
					fflush($f);
					flock($f, LOCK_UN);
					
				}
				else {
					$this->log_er_flock(__FILE__, __LINE__);
				}
				fclose($f);
				
			}
			
		}
	
	}
	
	public function log_er_flock($script_filename, $line){

		$date = $this->convert_format_date($this->date);
		$text = '|'.$date.'|'.$this->ip.'|'.$script_filename.'|'.$line.'|'.$this->php_eol;
		$f = @fopen($this->document_root.'/data/log_flock_errors.txt', 'a+'); 
		if(@flock($f,LOCK_EX)){
			@stream_set_write_buffer($f,0);
			@fwrite($f,$text);
			@fflush($f);
			@flock($f,LOCK_UN);
		}
		@fclose($f);
		
	}
	
	public function smart_caching($file_path){
		
		if($file_path){
			return $file_path.'?'.filemtime(realpath(null) . ($file_path{0} != '/' ? '/'.$file_path : $file_path));
		}
		
	}
	
	protected function login($login){
		
		$login = trim($login);
		$login = str_replace(' ','_',$login);
		$login = str_replace('­','',$login);
		$login = preg_replace('/__+/','_',$login);
		$login = mb_substr($login, 0, 18);
		$login = preg_replace('/[^a-zA-Z0-9_]/u','',$login);
		if(preg_match('/^_(.+)$/',$login)){
			$login = mb_substr($login,1);
		}
		if(preg_match('/^(.+)_$/',$login)){
			$login = mb_substr($login,0,-1);
		}
		return $login;
		
	}
	
	public function get_meta_tags_(){
		
		$result = '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="MobileOptimized" content="230">
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="address=no">
<meta http-equiv="x-rim-auto-match" content="none">
<link rel="shortcut icon" href="favicon.png?3" type="image/png">';
		return $result;
		
	}
	
	public function get_js_scripts_and_css_styles($loc){
		
		$result = '<script type="text/javascript" src="'.$this->smart_caching('js/shared_resources.js').'"></script>
<script type="text/javascript" src="'.$this->smart_caching('js/'.$loc.'.js').'"></script>
<link rel="stylesheet" href="'.$this->smart_caching('css/'.$loc.'.css').'" type="text/css">';
		return $result;
		
	}

}
