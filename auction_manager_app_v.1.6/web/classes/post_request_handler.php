<?php
namespace classes\post_request_handler;

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

class post_request_handler extends \classes\common\common {
	
	public function __construct(){
		
		parent::__construct();
		
		$is_require = true;
		
		if(isset($_POST['post_auth'])){
			
			require_once 'classes/post_auth.php';
			new \classes\post_auth\post_auth();
			exit;
			
		}
		
		if(isset($_POST['save_telegram_channel'])){
			
			require_once 'classes/save_telegram_channel.php';
			new \classes\save_telegram_channel\save_telegram_channel();
			exit;
			
		}
		
		if(isset($_POST['add_or_edit_auction_filter'])){
			
			require_once 'classes/add_or_edit_auction_filter.php';
			new \classes\add_or_edit_auction_filter\add_or_edit_auction_filter();
			exit;
			
		}
		
		if(isset($_POST['delete_filters_auction'])){
			
			require_once 'classes/delete_filters_auction.php';
			new \classes\delete_filters_auction\delete_filters_auction();
			exit;
			
		}
		
		if(isset($_POST['logout'])){
			
			require_once 'classes/logout.php';
			new \classes\logout\logout();
			exit;
			
		}
		
		if(isset($_POST['check_data_online'])){
			
			require_once 'classes/check_data_online.php';
			new \classes\check_data_online\check_data_online();
			exit;
			
		}
		
		if(isset($_POST['clear_service_errors_list'])){
			
			require_once 'classes/clear_service_errors_list.php';
			new \classes\clear_service_errors_list\clear_service_errors_list();
			exit;
			
		}
		
		if(isset($_POST['delete_parsing_errors_list'])){
			
			require_once 'classes/delete_parsing_errors_list.php';
			new \classes\delete_parsing_errors_list\delete_parsing_errors_list();
			exit;
			
		}
		
		if(isset($_POST['delete_auth_errors_list'])){
			
			require_once 'classes/delete_auth_errors_list.php';
			new \classes\delete_auth_errors_list\delete_auth_errors_list();
			exit;
			
		}
		
		if(isset($_POST['get_all_users'])){
			
			require_once 'classes/get_all_users.php';
			new \classes\get_all_users\get_all_users();
			exit;
			
		}
		
		if(isset($_POST['add_or_edit_user'])){
			
			require_once 'classes/add_or_edit_user.php';
			new \classes\add_or_edit_user\add_or_edit_user();
			exit;
			
		}
		
		if(isset($_POST['delete_user'])){
			
			require_once 'classes/delete_user.php';
			new \classes\delete_user\delete_user();
			exit;
			
		}
		
		if(isset($_POST['lock_and_unlock_auction'])){
			
			require_once 'classes/lock_and_unlock_auction.php';
			new \classes\lock_and_unlock_auction\lock_and_unlock_auction();
			exit;
			
		}
		
		if(isset($_POST['get_all_settings'])){
			
			require_once 'classes/get_all_settings.php';
			new \classes\get_all_settings\get_all_settings();
			exit;
			
		}
		
		if(isset($_POST['set_on_and_off_auction'])){
			
			require_once 'classes/set_on_and_off_auction.php';
			new \classes\set_on_and_off_auction\set_on_and_off_auction();
			exit;
			
		}
		
		if(isset($_POST['save_settings'])){
			
			require_once 'classes/save_settings.php';
			new \classes\save_settings\save_settings();
			exit;
			
		}
		
		if(isset($_POST['start_and_restart_service'])){
			
			require_once 'classes/start_and_restart_service.php';
			new \classes\start_and_restart_service\start_and_restart_service();
			exit;
			
		}
		
		if(isset($_POST['clear_cache'])){
			
			require_once 'classes/clear_cache.php';
			new \classes\clear_cache\clear_cache();
			exit;
			
		}
		
	}
	
}