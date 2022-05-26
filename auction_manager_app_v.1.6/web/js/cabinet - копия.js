function set_active_bt_and_set_default_variable(elem){
	if(selected_bt_central_panel != null){
		selected_bt_central_panel.style.border = '1px solid transparent';
	}
	selected_bt_central_panel = elem
	selected_bt_central_panel.style.border = '1px solid #33caff';
	ids_delete_filter_auction = [];
	last_id_edit_filter_auction = '';
	id_edit_filter_auction = '';
	user_mode_filter_auction = 'add';
}

function get_auction_options_window(act){
	var elem = document.getElementsByClassName('auction_options_window')[0];
	if(act == 'open'){
		if(elem.style.display != 'block'){
			elem.style.display = 'block';
			if(selected_bt_auction){
				document.getElementsByClassName('selected_auction_'+selected_bt_auction)[0].style.display = 'inline';
			}
		}else{
			elem.style.display = 'none';
		}
		set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_select_auction')[0]);
	}else{
		elem.style.display = 'none';
	}
}

function show_edit_auction(country){
	if(selected_bt_auction){
		document.getElementsByClassName('selected_auction_'+selected_bt_auction)[0].style.display = 'none';
	}
	selected_bt_auction = country;
	document.getElementsByClassName('selected_auction_'+selected_bt_auction)[0].style.display = 'inline';
	document.getElementsByClassName('selected_country_flag')[0].setAttribute('class', 'selected_country_flag flag-'+selected_bt_auction);
	setTimeout((function(){
		get_auction_options_window('close')
	}), 500);
	var country_name;
	var telegram_channel = '';
	var id_telegram_channel = '';
	switch(country){
		case 'de': country_name = 'Германии'; break;
		case 'us': country_name = 'США'; break;
		case 'kr': country_name = 'Кореи'; break;
	}
	if(country_and_telegram_channels[country]){
		telegram_channel = country_and_telegram_channels[country]['telegram_channel'];
		id_telegram_channel = country_and_telegram_channels[country]['id_telegram_channel'];
	}
	if(!auction_filters[selected_bt_auction]){
		document.getElementsByClassName('central_panel')[0].innerHTML = '';
		return;
	}
	var tab = cookie.get('opened_tab_'+country);
	if(tab != null){
		selected_tab = tab;
	}
	if(selected_tab == 'car'){
		if(!auction_filters[selected_bt_auction]['car']){
			document.getElementsByClassName('central_panel')[0].innerHTML = '';
			return;
		}
		var options_brand = '<div class="option option_brand" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['brands'];
		for (var item in obj) {
			options_brand += '<div class="option option_brand" data="'+item+'">'+item+'</div>';
		}
		var options_type_of_fuel = '<div class="option option_type_of_fuel" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['type_of_fuel'];
		for (var item in obj) {
			options_type_of_fuel += '<div class="option option_type_of_fuel" data="'+item+'">'+item+'</div>';
		}
		var options_price_from = '<div class="option option_price_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_from += '<div class="option option_price_from" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_price_up_to = '<div class="option option_price_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_up_to += '<div class="option option_price_up_to" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_year_since = '<div class="option option_year_since" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_since += '<div class="option option_year_since" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_year_of_release_by = '<div class="option option_year_of_release_by" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_of_release_by += '<div class="option option_year_of_release_by" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_mileage_from = '<div class="option option_mileage_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_from += '<div class="option option_mileage_from" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_mileage_to = '<div class="option option_mileage_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_to += '<div class="option option_mileage_to" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_engine_displacement_up_to = '<div class="option option_engine_displacement_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['car']['engine_volume'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_engine_displacement_up_to += '<div class="option option_engine_displacement_up_to" data="'+obj[i]+'">'+obj[i]+' cm³</div>';
		}
		var fragment = null;
		if(user_filters[selected_bt_auction]){
			if(user_filters[selected_bt_auction].length > 0){
				var len = user_filters[selected_bt_auction].length - 1;
				var fragment = document.createDocumentFragment();
				for(var i = len; i >= 0; i--){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i]['car']){
						var brand = user_filters[selected_bt_auction][i]['car']['brand'];
						var model = user_filters[selected_bt_auction][i]['car']['model'];
						var price = user_filters[selected_bt_auction][i]['car']['price'];
						if(price){
							price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var engine_volume = user_filters[selected_bt_auction][i]['car']['engine_volume'];
						if(engine_volume){
							engine_volume = engine_volume.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var mileage = user_filters[selected_bt_auction][i]['car']['mileage'];
						if(mileage){
							mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var type_of_fuel = user_filters[selected_bt_auction][i]['car']['type_of_fuel'];
						var years_of_release = user_filters[selected_bt_auction][i]['car']['years_of_release'];
						if(years_of_release){
							years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
						}
						var view = user_filters[selected_bt_auction][i]['car']['view'];
						view = view.replace(',', '<br>').replace('new', 'новый').replace('used', 'подержанный');
						var date = user_filters[selected_bt_auction][i]['car']['date'];
						var id = user_filters[selected_bt_auction][i]['car']['id'];
						var elem = document.createElement('div');
						elem.setAttribute('id', 'group_item_filter_auction_'+id);
						elem.setAttribute('class', 'group_item_filter_auction');
						if (device == 'comp') {
							elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						} else {
							elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						}
						elem.innerHTML = '<div class="item_filter_auction_date">Дата<div class="center_middle">'+date+'</div></div><div class="item_filter_auction_brand">Марка авто<div id="item_brand_'+id+'" class="center_middle">'+brand+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'" class="center_middle">'+model+'</div></div><div class="item_filter_auction_type_of_fuel">Вид топлива<div id="item_type_of_fuel_'+id+'" class="center_middle">'+type_of_fuel+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'" class="center_middle">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'" class="center_middle">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'" class="center_middle">'+mileage+'</div></div><div class="item_filter_auction_engine_volume">Обьем дви. (cm³)<div id="item_engine_volume_'+id+'" class="center_middle">'+engine_volume+'</div></div><div class="item_filter_auction_view">Вид авто<div id="item_view_'+id+'" class="center_middle">'+view+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
						fragment.appendChild(elem);
					}
				}
			}
		}
		document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text_and_telegram_input"><div class="header_window_central_panel_content_text">Настройка рассылки аукционов из '+country_name+'</div><div class="telegram_channel_input"><input type="text" class="input_telegram_channel input" placeholder="Ваш телеграм" onkeydown="if((arguments[0]||window.event).keyCode==13){save_telegram_channel()}" maxlength="512" data-telegram_channel="'+telegram_channel+'" value="'+telegram_channel+'"><div class="tooltip_mes_info_no_subscribe"'+(telegram_channel !== '' && id_telegram_channel == '' ? '' : ' style="display:none;"')+'>Не подписан <span class="link_info_no_subscribe" onclick="show_info_to_subscribe()">(<i>подробнее..</i>)</span></div><div class="bt_save_telegram_channel"><i class="icon_save_telegram_channel icon-ok-1" onclick="save_telegram_channel()"></i><span class="load_save_telegram_channel" style="display:none;"></span></div></div></div><div class="tabs_blok"><div class="tab tab_active" onclick="select_tab(\''+selected_bt_auction+'\',\'car\')"><div>Автомобили</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'truck\')"><div>Грузовики 7,5 т</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'tractor\')"><div>Седельные тягачи</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'semitrailer\')"><div>Полуприцепы</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'constructionmachine\')"><div>Строительные машины</div></div></div><div class="edit_mode_blok_filter" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="edit_filter_auction(\'cancel\')"></i></div><div class="group_selected_blok"><div align="center" class="selected_blok"><div class="text">Марка авто</div><div class="relative"><div class="select_ select_brand" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_brand layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this, check_options_car_model())" style="width:140px;z-index:3;">'+options_brand+'</div></div></div><div align="center" class="selected_blok"><div class="text">Модель</div><div class="relative"><div class="select_ select_model" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_model layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:2;"><div class="option option_model" data="none">Не выбрано</div></div></div></div><div align="center" class="selected_blok"><div class="text">Вид топлива</div><div class="relative"><div class="select_ select_type_of_fuel" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_type_of_fuel layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_type_of_fuel+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена от</div><div class="relative"><div class="select_ select_price_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена до</div><div class="relative"><div class="select_ select_price_up_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_up_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_up_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска с</div><div class="relative"><div class="select_ select_year_since" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_since layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_since+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска по</div><div class="relative"><div class="select_ select_year_of_release_by" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_of_release_by layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_of_release_by+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег от</div><div class="relative"><div class="select_ select_mileage_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег до</div><div class="relative"><div class="select_ select_mileage_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_to+'</div></div></div><div class="tooltip_mes_info_customs_clearance" style="'+(cookie.get('tooltip_info_customs_clearance') == null ? 'display:block;' : 'display:none;')+'"><div class="relative">Укажите точный обьем двигателя если<br>хотите увидеть цену с учетом растаможки. Например от 1200 до 1200 cm³<i class="bt_close_tooltip_info_customs_clearance icon-cancel" onclick="close_tooltip_info_customs_clearance()"></i></div></div><div align="center" class="selected_blok"><div class="text">Объем дви. от</div><div class="input" style="width:140px;margin-top:10px;"><input type="text" class="input_engine_displacement_from input" maxlength="6" value=""></div></div><div align="center" class="selected_blok"><div class="text">Объем дви. до</div><div class="input" style="width:140px;margin-top:10px;"><input type="text" class="input_engine_displacement_up_to input" maxlength="6" value=""></div></div></div><div style="margin: 7px 5px 7px 5px;"><div class="text">Состояние</div><div class="middle"><div style="margin: 10px 10px 0px 0px;"><input type="checkbox" id="checkbox_new_only" class="checkbox_new_only checkbox"><label for="checkbox_new_only" class="text" style="color:#bfbfbf;">новый</label></div><div style="margin-top:10px;"><input type="checkbox" id="checkbox_used_only" class="checkbox_used_only checkbox"><label for="checkbox_used_only" class="text" style="color:#bfbfbf;">подержанный</label></div></div></div><div class="bt_edit_filters_auction_blok"><button class="bt_add_filter send" onclick="add_or_edit_auction_filter()">Добавить</button><div class="tooltip_parent"><i class="icon_show_and_hide_checkbox icon-th-list" data="0" onclick="stop_propagation(event);get_select_filter_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_select_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="opacity:0.5;"></i><div class="tooltip_mes_select_delete_auction_filter" style="display:none;">Выбрать</div></div><div class="tooltip_parent"><i class="icon_delete_filters_auction icon-trash" onclick="stop_propagation(event);delete_filters_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="display:none;"></i><span class="load_delete_filters_auction" style="display:none;"></span><div class="tooltip_mes_delete_auction_filter" style="display:none;">Удалить</div></div></div><div class="list_filters_auction"></div></div></div>';
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		if(fragment && fragment.childNodes.length > 0){
			elem.innerHTML = '';
			elem.appendChild(fragment);
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
		}else{
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
		}
	}
	else if(selected_tab == 'truck'){
		if(!auction_filters[selected_bt_auction]['truck']){
			document.getElementsByClassName('central_panel')[0].innerHTML = '';
			return;
		}
		var options_category = '<div class="option option_category" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['categories'];
		for (var item in obj) {
			options_category += '<div class="option option_category" data="'+item+'">'+item+'</div>';
		}
		var options_model = '<div class="option option_model" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['models'];
		for (var item in obj) {
			options_model += '<div class="option option_model" data="'+item+'">'+item+'</div>';
		}
		var options_price_from = '<div class="option option_price_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_from += '<div class="option option_price_from" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_price_up_to = '<div class="option option_price_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_up_to += '<div class="option option_price_up_to" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_mileage_from = '<div class="option option_mileage_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_from += '<div class="option option_mileage_from" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_mileage_to = '<div class="option option_mileage_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_to += '<div class="option option_mileage_to" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_year_since = '<div class="option option_year_since" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_since += '<div class="option option_year_since" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_year_of_release_by = '<div class="option option_year_of_release_by" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_of_release_by += '<div class="option option_year_of_release_by" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_wheel_formula = '<div class="option option_wheel_formula" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['wheel_formula'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_wheel_formula += '<div class="option option_wheel_formula" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_axles = '<div class="option option_axles" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['axles'];
		for (var item in obj) {
			options_axles += '<div class="option option_axles" data="'+item+'">'+item+'</div>';
		}
		var options_environmental_class = '<div class="option option_environmental_class" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['truck']['environmental_class'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_environmental_class += '<div class="option option_environmental_class" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var fragment = null;
		if(user_filters[selected_bt_auction]){
			if(user_filters[selected_bt_auction].length > 0){
				var len = user_filters[selected_bt_auction].length - 1;
				var fragment = document.createDocumentFragment();
				for(var i = len; i >= 0; i--){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i]['truck']){
						var category = user_filters[selected_bt_auction][i]['truck']['category'];
						var model = user_filters[selected_bt_auction][i]['truck']['model'];
						var price = user_filters[selected_bt_auction][i]['truck']['price'];
						if(price){
							price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var years_of_release = user_filters[selected_bt_auction][i]['truck']['years_of_release'];
						if(years_of_release){
							years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
						}
						var mileage = user_filters[selected_bt_auction][i]['truck']['mileage'];
						if(mileage){
							mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var wheel_formula = user_filters[selected_bt_auction][i]['truck']['wheel_formula'];
						var axles = user_filters[selected_bt_auction][i]['truck']['axles'];
						var environmental_class = user_filters[selected_bt_auction][i]['truck']['environmental_class'];
						var date = user_filters[selected_bt_auction][i]['truck']['date'];
						var id = user_filters[selected_bt_auction][i]['truck']['id'];
						var elem = document.createElement('div');
						elem.setAttribute('id', 'group_item_filter_auction_'+id);
						elem.setAttribute('class', 'group_item_filter_auction');
						if (device == 'comp') {
							elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						} else {
							elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						}
						elem.innerHTML = '<div class="item_filter_auction_date">Дата<div class="center_middle">'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'" class="center_middle">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'" class="center_middle">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'" class="center_middle">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'" class="center_middle">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'" class="center_middle">'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div id="item_wheel_formula_'+id+'" class="center_middle">'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'" class="center_middle">'+axles+'</div></div><div class="item_filter_auction_environmental_class">Эколог. класс<div id="item_environmental_class_'+id+'" class="center_middle">'+environmental_class+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
						fragment.appendChild(elem);
					}
				}
			}
		}
		document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text_and_telegram_input"><div class="header_window_central_panel_content_text">Настройка рассылки аукционов из '+country_name+'</div><div class="telegram_channel_input"><input type="text" class="input_telegram_channel input" placeholder="Ваш телеграм" onkeydown="if((arguments[0]||window.event).keyCode==13){save_telegram_channel()}" maxlength="512" data-telegram_channel="'+telegram_channel+'" value="'+telegram_channel+'"><div class="tooltip_mes_info_no_subscribe"'+(telegram_channel !== '' && id_telegram_channel == '' ? '' : ' style="display:none;"')+'>Не подписан <span class="link_info_no_subscribe" onclick="show_info_to_subscribe()">(<i>подробнее..</i>)</span></div><div class="bt_save_telegram_channel"><i class="icon_save_telegram_channel icon-ok-1" onclick="save_telegram_channel()"></i><span class="load_save_telegram_channel" style="display:none;"></span></div></div></div><div class="tabs_blok"><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\',\'car\')"><div>Автомобили</div></div><div class="tab tab_active" onclick="select_tab(\''+selected_bt_auction+'\', \'truck\')"><div>Грузовики 7,5 т</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'tractor\')"><div>Седельные тягачи</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'semitrailer\')"><div>Полуприцепы</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'constructionmachine\')"><div>Строительные машины</div></div></div><div class="edit_mode_blok_filter" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="edit_filter_auction(\'cancel\')"></i></div><div class="group_selected_blok"><div align="center" class="selected_blok"><div class="text">Категория:</div><div class="relative"><div class="select_ select_category" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_category layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_category+'</div></div></div><div align="center" class="selected_blok"><div class="text">Модель:</div><div class="relative"><div class="select_ select_model" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_model layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_model+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена от:</div><div class="relative"><div class="select_ select_price_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена до:</div><div class="relative"><div class="select_ select_price_up_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_up_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_up_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска с:</div><div class="relative"><div class="select_ select_year_since" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_since layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_since+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска по:</div><div class="relative"><div class="select_ select_year_of_release_by" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_of_release_by layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_of_release_by+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег от:</div><div class="relative"><div class="select_ select_mileage_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег до:</div><div class="relative"><div class="select_ select_mileage_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Колес. формула:</div><div class="relative"><div class="select_ select_wheel_formula" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_wheel_formula layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_wheel_formula+'</div></div></div><div align="center" class="selected_blok"><div class="text">Оси:</div><div class="relative"><div class="select_ select_axles" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_axles layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_axles+'</div></div></div><div align="center" class="selected_blok"><div class="text">Эколог. класс:</div><div class="relative"><div class="select_ select_environmental_class" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_environmental_class layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_environmental_class+'</div></div></div></div><div class="bt_edit_filters_auction_blok"><button class="bt_add_filter send" onclick="add_or_edit_auction_filter()">Добавить</button><div class="tooltip_parent"><i class="icon_show_and_hide_checkbox icon-th-list" data="0" onclick="stop_propagation(event);get_select_filter_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_select_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="opacity:0.5;"></i><div class="tooltip_mes_select_delete_auction_filter" style="display:none;">Выбрать</div></div><div class="tooltip_parent"><i class="icon_delete_filters_auction icon-trash" onclick="stop_propagation(event);delete_filters_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="display:none;"></i><span class="load_delete_filters_auction" style="display:none;"></span><div class="tooltip_mes_delete_auction_filter" style="display:none;">Удалить</div></div></div><div class="list_filters_auction"></div></div></div>';
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		if(fragment && fragment.childNodes.length > 0){
			elem.innerHTML = '';
			elem.appendChild(fragment);
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
		}else{
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
		}
	}
	else if(selected_tab == 'tractor'){
		if(!auction_filters[selected_bt_auction]['tractor']){
			document.getElementsByClassName('central_panel')[0].innerHTML = '';
			return;
		}
		var options_category = '<div class="option option_category" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['categories'];
		for (var item in obj) {
			options_category += '<div class="option option_category" data="'+item+'">'+item+'</div>';
		}
		var options_model = '<div class="option option_model" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['models'];
		for (var item in obj) {
			options_model += '<div class="option option_model" data="'+item+'">'+item+'</div>';
		}
		var options_price_from = '<div class="option option_price_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_from += '<div class="option option_price_from" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_price_up_to = '<div class="option option_price_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_up_to += '<div class="option option_price_up_to" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_mileage_from = '<div class="option option_mileage_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_from += '<div class="option option_mileage_from" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_mileage_to = '<div class="option option_mileage_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['mileage'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_mileage_to += '<div class="option option_mileage_to" data="'+obj[i]+'">'+obj[i]+' km.</div>';
		}
		var options_year_since = '<div class="option option_year_since" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_since += '<div class="option option_year_since" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_year_of_release_by = '<div class="option option_year_of_release_by" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_of_release_by += '<div class="option option_year_of_release_by" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_wheel_formula = '<div class="option option_wheel_formula" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['wheel_formula'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_wheel_formula += '<div class="option option_wheel_formula" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_axles = '<div class="option option_axles" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['axles'];
		for (var item in obj) {
			options_axles += '<div class="option option_axles" data="'+item+'">'+item+'</div>';
		}
		var options_environmental_class = '<div class="option option_environmental_class" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['tractor']['environmental_class'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_environmental_class += '<div class="option option_environmental_class" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var fragment = null;
		if(user_filters[selected_bt_auction]){
			if(user_filters[selected_bt_auction].length > 0){
				var len = user_filters[selected_bt_auction].length - 1;
				var fragment = document.createDocumentFragment();
				for(var i = len; i >= 0; i--){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i]['tractor']){
						var category = user_filters[selected_bt_auction][i]['tractor']['category'];
						var model = user_filters[selected_bt_auction][i]['tractor']['model'];
						var price = user_filters[selected_bt_auction][i]['tractor']['price'];
						if(price){
							price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var years_of_release = user_filters[selected_bt_auction][i]['tractor']['years_of_release'];
						if(years_of_release){
							years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
						}
						var mileage = user_filters[selected_bt_auction][i]['tractor']['mileage'];
						if(mileage){
							mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var wheel_formula = user_filters[selected_bt_auction][i]['tractor']['wheel_formula'];
						var axles = user_filters[selected_bt_auction][i]['tractor']['axles'];
						var environmental_class = user_filters[selected_bt_auction][i]['tractor']['environmental_class'];
						var date = user_filters[selected_bt_auction][i]['tractor']['date'];
						var id = user_filters[selected_bt_auction][i]['tractor']['id'];
						var elem = document.createElement('div');
						elem.setAttribute('id', 'group_item_filter_auction_'+id);
						elem.setAttribute('class', 'group_item_filter_auction');
						if (device == 'comp') {
							elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						} else {
							elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						}
						elem.innerHTML = '<div class="item_filter_auction_date">Дата<div class="center_middle">'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'" class="center_middle">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'" class="center_middle">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'" class="center_middle">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'" class="center_middle">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'" class="center_middle">'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div id="item_wheel_formula_'+id+'" class="center_middle">'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'" class="center_middle">'+axles+'</div></div><div class="item_filter_auction_environmental_class">Эколог. класс<div id="item_environmental_class_'+id+'" class="center_middle">'+environmental_class+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
						fragment.appendChild(elem);
					}
				}
			}
		}
		document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text_and_telegram_input"><div class="header_window_central_panel_content_text">Настройка рассылки аукционов из '+country_name+'</div><div class="telegram_channel_input"><input type="text" class="input_telegram_channel input" placeholder="Ваш телеграм" onkeydown="if((arguments[0]||window.event).keyCode==13){save_telegram_channel()}" maxlength="512" data-telegram_channel="'+telegram_channel+'" value="'+telegram_channel+'"><div class="tooltip_mes_info_no_subscribe"'+(telegram_channel !== '' && id_telegram_channel == '' ? '' : ' style="display:none;"')+'>Не подписан <span class="link_info_no_subscribe" onclick="show_info_to_subscribe()">(<i>подробнее..</i>)</span></div><div class="bt_save_telegram_channel"><i class="icon_save_telegram_channel icon-ok-1" onclick="save_telegram_channel()"></i><span class="load_save_telegram_channel" style="display:none;"></span></div></div></div><div class="tabs_blok"><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\',\'car\')"><div>Автомобили</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'truck\')"><div>Грузовики 7,5 т</div></div><div class="tab tab_active" onclick="select_tab(\''+selected_bt_auction+'\', \'tractor\')"><div>Седельные тягачи</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'semitrailer\')"><div>Полуприцепы</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'constructionmachine\')"><div>Строительные машины</div></div></div><div class="edit_mode_blok_filter" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="edit_filter_auction(\'cancel\')"></i></div><div class="group_selected_blok"><div align="center" class="selected_blok"><div class="text">Категория:</div><div class="relative"><div class="select_ select_category" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_category layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_category+'</div></div></div><div align="center" class="selected_blok"><div class="text">Модель:</div><div class="relative"><div class="select_ select_model" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_model layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_model+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена от:</div><div class="relative"><div class="select_ select_price_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена до:</div><div class="relative"><div class="select_ select_price_up_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_up_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_up_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска с:</div><div class="relative"><div class="select_ select_year_since" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_since layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_since+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска по:</div><div class="relative"><div class="select_ select_year_of_release_by" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_of_release_by layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_of_release_by+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег от:</div><div class="relative"><div class="select_ select_mileage_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Пробег до:</div><div class="relative"><div class="select_ select_mileage_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_mileage_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_mileage_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Колес. формула:</div><div class="relative"><div class="select_ select_wheel_formula" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_wheel_formula layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_wheel_formula+'</div></div></div><div align="center" class="selected_blok"><div class="text">Оси:</div><div class="relative"><div class="select_ select_axles" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_axles layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_axles+'</div></div></div><div align="center" class="selected_blok"><div class="text">Эколог. класс:</div><div class="relative"><div class="select_ select_environmental_class" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_environmental_class layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_environmental_class+'</div></div></div></div><div class="bt_edit_filters_auction_blok"><button class="bt_add_filter send" onclick="add_or_edit_auction_filter()">Добавить</button><div class="tooltip_parent"><i class="icon_show_and_hide_checkbox icon-th-list" data="0" onclick="stop_propagation(event);get_select_filter_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_select_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="opacity:0.5;"></i><div class="tooltip_mes_select_delete_auction_filter" style="display:none;">Выбрать</div></div><div class="tooltip_parent"><i class="icon_delete_filters_auction icon-trash" onclick="stop_propagation(event);delete_filters_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="display:none;"></i><span class="load_delete_filters_auction" style="display:none;"></span><div class="tooltip_mes_delete_auction_filter" style="display:none;">Удалить</div></div></div><div class="list_filters_auction"></div></div></div>';
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		if(fragment && fragment.childNodes.length > 0){
			elem.innerHTML = '';
			elem.appendChild(fragment);
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
		}else{
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
		}
	}
	else if(selected_tab == 'semitrailer'){
		if(!auction_filters[selected_bt_auction]['semitrailer']){
			document.getElementsByClassName('central_panel')[0].innerHTML = '';
			return;
		}
		var options_category = '<div class="option option_category" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['categories'];
		for (var item in obj) {
			options_category += '<div class="option option_category" data="'+item+'">'+item+'</div>';
		}
		var options_model = '<div class="option option_model" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['models'];
		for (var item in obj) {
			options_model += '<div class="option option_model" data="'+item+'">'+item+'</div>';
		}
		var options_price_from = '<div class="option option_price_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_from += '<div class="option option_price_from" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_price_up_to = '<div class="option option_price_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_up_to += '<div class="option option_price_up_to" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_year_since = '<div class="option option_year_since" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_since += '<div class="option option_year_since" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_year_of_release_by = '<div class="option option_year_of_release_by" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_of_release_by += '<div class="option option_year_of_release_by" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_axles = '<div class="option option_axles" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['semitrailer']['axles'];
		for (var item in obj) {
			options_axles += '<div class="option option_axles" data="'+item+'">'+item+'</div>';
		}
		var fragment = null;
		if(user_filters[selected_bt_auction]){
			if(user_filters[selected_bt_auction].length > 0){
				var len = user_filters[selected_bt_auction].length - 1;
				var fragment = document.createDocumentFragment();
				for(var i = len; i >= 0; i--){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i]['semitrailer']){
						var category = user_filters[selected_bt_auction][i]['semitrailer']['category'];
						var model = user_filters[selected_bt_auction][i]['semitrailer']['model'];
						var price = user_filters[selected_bt_auction][i]['semitrailer']['price'];
						if(price){
							price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var years_of_release = user_filters[selected_bt_auction][i]['semitrailer']['years_of_release'];
						if(years_of_release){
							years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
						}
						var axles = user_filters[selected_bt_auction][i]['semitrailer']['axles'];
						var date = user_filters[selected_bt_auction][i]['semitrailer']['date'];
						var id = user_filters[selected_bt_auction][i]['semitrailer']['id'];
						var elem = document.createElement('div');
						elem.setAttribute('id', 'group_item_filter_auction_'+id);
						elem.setAttribute('class', 'group_item_filter_auction');
						if (device == 'comp') {
							elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						} else {
							elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						}
						elem.innerHTML = '<div class="item_filter_auction_date">Дата<div class="center_middle">'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'" class="center_middle">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'" class="center_middle">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'" class="center_middle">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'" class="center_middle">'+years_of_release+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'" class="center_middle">'+axles+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
						fragment.appendChild(elem);
					}
				}
			}
		}
		document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text_and_telegram_input"><div class="header_window_central_panel_content_text">Настройка рассылки аукционов из '+country_name+'</div><div class="telegram_channel_input"><input type="text" class="input_telegram_channel input" placeholder="Ваш телеграм" onkeydown="if((arguments[0]||window.event).keyCode==13){save_telegram_channel()}" maxlength="512" data-telegram_channel="'+telegram_channel+'" value="'+telegram_channel+'"><div class="tooltip_mes_info_no_subscribe"'+(telegram_channel !== '' && id_telegram_channel == '' ? '' : ' style="display:none;"')+'>Не подписан <span class="link_info_no_subscribe" onclick="show_info_to_subscribe()">(<i>подробнее..</i>)</span></div><div class="bt_save_telegram_channel"><i class="icon_save_telegram_channel icon-ok-1" onclick="save_telegram_channel()"></i><span class="load_save_telegram_channel" style="display:none;"></span></div></div></div><div class="tabs_blok"><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\',\'car\')"><div>Автомобили</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'truck\')"><div>Грузовики 7,5 т</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'tractor\')"><div>Седельные тягачи</div></div><div class="tab tab_active" onclick="select_tab(\''+selected_bt_auction+'\', \'semitrailer\')"><div>Полуприцепы</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'constructionmachine\')"><div>Строительные машины</div></div></div><div class="edit_mode_blok_filter" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="edit_filter_auction(\'cancel\')"></i></div><div class="group_selected_blok"><div align="center" class="selected_blok"><div class="text">Категория:</div><div class="relative"><div class="select_ select_category" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_category layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_category+'</div></div></div><div align="center" class="selected_blok"><div class="text">Модель:</div><div class="relative"><div class="select_ select_model" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_model layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_model+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена от:</div><div class="relative"><div class="select_ select_price_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена до:</div><div class="relative"><div class="select_ select_price_up_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_up_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_up_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска с:</div><div class="relative"><div class="select_ select_year_since" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_since layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_since+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска по:</div><div class="relative"><div class="select_ select_year_of_release_by" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_of_release_by layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_of_release_by+'</div></div></div><div align="center" class="selected_blok"><div class="text">Оси:</div><div class="relative"><div class="select_ select_axles" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_axles layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_axles+'</div></div></div></div><div class="bt_edit_filters_auction_blok"><button class="bt_add_filter send" onclick="add_or_edit_auction_filter()">Добавить</button><div class="tooltip_parent"><i class="icon_show_and_hide_checkbox icon-th-list" data="0" onclick="stop_propagation(event);get_select_filter_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_select_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="opacity:0.5;"></i><div class="tooltip_mes_select_delete_auction_filter" style="display:none;">Выбрать</div></div><div class="tooltip_parent"><i class="icon_delete_filters_auction icon-trash" onclick="stop_propagation(event);delete_filters_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="display:none;"></i><span class="load_delete_filters_auction" style="display:none;"></span><div class="tooltip_mes_delete_auction_filter" style="display:none;">Удалить</div></div></div><div class="list_filters_auction"></div></div></div>';
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		if(fragment && fragment.childNodes.length > 0){
			elem.innerHTML = '';
			elem.appendChild(fragment);
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
		}else{
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
		}
	}
	else if(selected_tab == 'constructionmachine'){
		if(!auction_filters[selected_bt_auction]['constructionmachine']){
			document.getElementsByClassName('central_panel')[0].innerHTML = '';
			return;
		}
		var options_category = '<div class="option option_category" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['categories'];
		for (var item in obj) {
			options_category += '<div class="option option_category" data="'+item+'">'+item+'</div>';
		}
		var options_model = '<div class="option option_model" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['models'];
		for (var item in obj) {
			options_model += '<div class="option option_model" data="'+item+'">'+item+'</div>';
		}
		var options_price_from = '<div class="option option_price_from" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_from += '<div class="option option_price_from" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_price_up_to = '<div class="option option_price_up_to" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['prices'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_price_up_to += '<div class="option option_price_up_to" data="'+obj[i]+'">'+obj[i]+' €</div>';
		}
		var options_year_since = '<div class="option option_year_since" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_since += '<div class="option option_year_since" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var options_year_of_release_by = '<div class="option option_year_of_release_by" data="none">Не выбрано</div>';
		var obj = auction_filters[selected_bt_auction]['constructionmachine']['years_of_release'];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			options_year_of_release_by += '<div class="option option_year_of_release_by" data="'+obj[i]+'">'+obj[i]+'</div>';
		}
		var fragment = null;
		if(user_filters[selected_bt_auction]){
			if(user_filters[selected_bt_auction].length > 0){
				var len = user_filters[selected_bt_auction].length - 1;
				var fragment = document.createDocumentFragment();
				for(var i = len; i >= 0; i--){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i]['constructionmachine']){
						var category = user_filters[selected_bt_auction][i]['constructionmachine']['category'];
						var model = user_filters[selected_bt_auction][i]['constructionmachine']['model'];
						var price = user_filters[selected_bt_auction][i]['constructionmachine']['price'];
						if(price){
							price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
						}
						var years_of_release = user_filters[selected_bt_auction][i]['constructionmachine']['years_of_release'];
						if(years_of_release){
							years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
						}
						var date = user_filters[selected_bt_auction][i]['constructionmachine']['date'];
						var id = user_filters[selected_bt_auction][i]['constructionmachine']['id'];
						var elem = document.createElement('div');
						elem.setAttribute('id', 'group_item_filter_auction_'+id);
						elem.setAttribute('class', 'group_item_filter_auction');
						if (device == 'comp') {
							elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						} else {
							elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
							elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
						}
						elem.innerHTML = '<div class="item_filter_auction_date">Дата<div class="center_middle">'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'" class="center_middle">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'" class="center_middle">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'" class="center_middle">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'" class="center_middle">'+years_of_release+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
						fragment.appendChild(elem);
					}
				}
			}
		}
		document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text_and_telegram_input"><div class="header_window_central_panel_content_text">Настройка рассылки аукционов из '+country_name+'</div><div class="telegram_channel_input"><input type="text" class="input_telegram_channel input" placeholder="Ваш телеграм" onkeydown="if((arguments[0]||window.event).keyCode==13){save_telegram_channel()}" maxlength="512" data-telegram_channel="'+telegram_channel+'" value="'+telegram_channel+'"><div class="tooltip_mes_info_no_subscribe"'+(telegram_channel !== '' && id_telegram_channel == '' ? '' : ' style="display:none;"')+'>Не подписан <span class="link_info_no_subscribe" onclick="show_info_to_subscribe()">(<i>подробнее..</i>)</span></div><div class="bt_save_telegram_channel"><i class="icon_save_telegram_channel icon-ok-1" onclick="save_telegram_channel()"></i><span class="load_save_telegram_channel" style="display:none;"></span></div></div></div><div class="tabs_blok"><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\',\'car\')"><div>Автомобили</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'truck\')"><div>Грузовики 7,5 т</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'tractor\')"><div>Седельные тягачи</div></div><div class="tab" onclick="select_tab(\''+selected_bt_auction+'\', \'semitrailer\')"><div>Полуприцепы</div></div><div class="tab tab_active" onclick="select_tab(\''+selected_bt_auction+'\', \'constructionmachine\')"><div>Строительные машины</div></div></div><div class="edit_mode_blok_filter" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="edit_filter_auction(\'cancel\')"></i></div><div class="group_selected_blok"><div align="center" class="selected_blok"><div class="text">Категория:</div><div class="relative"><div class="select_ select_category" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_category layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_category+'</div></div></div><div align="center" class="selected_blok"><div class="text">Модель:</div><div class="relative"><div class="select_ select_model" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_model layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:3;">'+options_model+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена от:</div><div class="relative"><div class="select_ select_price_from" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_from layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_from+'</div></div></div><div align="center" class="selected_blok"><div class="text">Цена до:</div><div class="relative"><div class="select_ select_price_up_to" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_price_up_to layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_price_up_to+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска с:</div><div class="relative"><div class="select_ select_year_since" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_since layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_since+'</div></div></div><div align="center" class="selected_blok"><div class="text">Год выпуска по:</div><div class="relative"><div class="select_ select_year_of_release_by" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:140px;" data="none"><div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_year_of_release_by layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:140px;z-index:1;">'+options_year_of_release_by+'</div></div></div></div><div class="bt_edit_filters_auction_blok"><button class="bt_add_filter send" onclick="add_or_edit_auction_filter()">Добавить</button><div class="tooltip_parent"><i class="icon_show_and_hide_checkbox icon-th-list" data="0" onclick="stop_propagation(event);get_select_filter_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_select_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="opacity:0.5;"></i><div class="tooltip_mes_select_delete_auction_filter" style="display:none;">Выбрать</div></div><div class="tooltip_parent"><i class="icon_delete_filters_auction icon-trash" onclick="stop_propagation(event);delete_filters_auction()" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_delete_auction_filter\')" onmouseout="get_tooltip(\'close\')" style="display:none;"></i><span class="load_delete_filters_auction" style="display:none;"></span><div class="tooltip_mes_delete_auction_filter" style="display:none;">Удалить</div></div></div><div class="list_filters_auction"></div></div></div>';
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		if(fragment && fragment.childNodes.length > 0){
			elem.innerHTML = '';
			elem.appendChild(fragment);
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
		}else{
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
		}
	}
}

function select_tab(country, tab){
	if(auction_filters[selected_bt_auction][tab]){
		cookie.set('opened_tab_'+country+'='+tab, 365, 'd');
	}
	show_edit_auction(country)
}

function close_tooltip_info_customs_clearance(){
	document.getElementsByClassName('tooltip_mes_info_customs_clearance')[0].style.display = 'none';
	cookie.set('tooltip_info_customs_clearance=1', 365, 'd');
}

function response__delete_filters_auction(res){
	user_mode_filter_auction = 'add';
	var elem = document.getElementsByClassName('load_delete_filters_auction')[0]
	elem.style.display = 'none';
	elem.innerHTML = '';
	document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
	try{
				var result = JSON.parse(res);
			}catch(e){
				alert('Ошибка\n\n'+res);
				return;
			}
	if (result.response) {
		var len = ids_delete_filter_auction.length;
			for (var i = 0; i < len; i++) {
				var elem = document.getElementById('group_item_filter_auction_' + ids_delete_filter_auction[i]);
				if (elem != null) {
					elem.parentNode.removeChild(elem);
					elem = null;
				}
			}
		for (var a = 0; a < len; a++) {
			var len1 = user_filters[selected_bt_auction].length;
						for(var i = 0; i < len1; i++){
							if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i][selected_tab] && user_filters[selected_bt_auction][i][selected_tab]['id'] == ids_delete_filter_auction[a]){
								delete user_filters[selected_bt_auction][i];
								break;
							}
						}
			}
		var len = user_filters[selected_bt_auction].length;
			for(var i = 0; i < len; i++){
				if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i][selected_tab] && user_filters[selected_bt_auction][i][selected_tab]['id']){
					var id = user_filters[selected_bt_auction][i][selected_tab]['id'];
					var elem = document.getElementById('prepare_delete_filter_auction_'+id);
					if (elem != null) {
						elem.style.display = 'none';
						elem.setAttribute('class', 'icon-check-empty');
						elem.setAttribute('data-checked', '0');
					}
				}
			}
		ids_delete_filter_auction = [];
		var elem = document.getElementsByClassName('list_filters_auction')[0];
		var e = document.getElementsByClassName('icon_show_and_hide_checkbox')[0];
		if(elem.innerHTML == ''){
			elem.innerHTML = 'Список фильтров пуст. Выберите необходимые параметры и нажмите "добавить"';
			e.style.opacity = '0.5';
		}
		e.setAttribute('data', '0');
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_USER_FILTERS':
						alert('Ошибка\n\nФайл с установлеными фильтрами не найден');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function delete_filters_auction() {
	if (ids_delete_filter_auction.length > 0) {
		var elem = document.getElementsByClassName('load_delete_filters_auction')[0]
		elem.style.display = 'block';
		elem.innerHTML = show_animation_load(20, 20, '33caff');
		document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
		var data = 'delete_filters_auction=&vehicle_type='+encodeURIComponent(selected_tab)+'&data=' + encodeURIComponent(ids_delete_filter_auction);
		postAjax(document.location.href, 'POST', data, response__delete_filters_auction)
	}
}

function prepare_delete_filter_auction(id){
	var elem = document.getElementById('prepare_delete_filter_auction_'+id);
	if (elem.getAttribute('data-checked') == '0') {
		elem.setAttribute('data-checked', '1');
		elem.setAttribute('class', 'icon-check');
		if (ids_delete_filter_auction.length == 0) {
			var elem = document.getElementsByClassName('icon_delete_filters_auction')[0];
			elem.style.display = 'block';
			setTimeout((function(elem){
				elem.style.display = 'none';
				setTimeout((function(elem){
					elem.style.display = 'block';
				}), 200, elem)
			}), 200, elem);
		}
		ids_delete_filter_auction.push(id);
	}else{
		var len = ids_delete_filter_auction.length;
		for (var i = 0; i < len; i++) {
			if (ids_delete_filter_auction[i] == id) {
				if (i + 1 == len) {
					ids_delete_filter_auction.pop()
				} else {
					ids_delete_filter_auction.splice(i, 1)
				}
				break;
			}
		}
		elem.setAttribute('data-checked', '0');
		elem.setAttribute('class', 'icon-check-empty');
		if (ids_delete_filter_auction.length == 0) {
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
		}
	}
}

function get_select_filter_auction(){
	var elem = document.getElementsByClassName('icon_show_and_hide_checkbox')[0];
	if (elem.getAttribute('data') == '0') {
		if(user_filters[selected_bt_auction]){
			var len = user_filters[selected_bt_auction].length;
			if (len > 0) {
				elem.setAttribute('data', '1');
				for(var i = 0; i < len; i++){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i][selected_tab]){
						var id = user_filters[selected_bt_auction][i][selected_tab]['id'];
						var elem = document.getElementById('prepare_delete_filter_auction_'+id);
						if (elem != null) {
							elem.style.display = 'block';
						}
					}
				}
			}
			user_mode_filter_auction = 'delete';
		}
	}
	else{
		user_mode_filter_auction = 'add';
		ids_delete_filter_auction = [];
		elem.setAttribute('data', '0');
		var elem = document.getElementsByClassName('load_delete_filters_auction')[0];
		elem.style.display = 'none';
		elem.innerHTML = '';
		document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
		if(user_filters[selected_bt_auction]){
		var len = user_filters[selected_bt_auction].length;
			if (len > 0) {
				for(var i = 0; i < len; i++){
					if(user_filters[selected_bt_auction][i] && user_filters[selected_bt_auction][i][selected_tab]){
						var id = user_filters[selected_bt_auction][i][selected_tab]['id'];
						var elem = document.getElementById('prepare_delete_filter_auction_'+id);
						if (elem != null) {
							elem.style.display = 'none';
							elem.setAttribute('class', 'icon-check-empty');
							elem.setAttribute('data-checked', '0');
						}
					}
				}
			}
		}
	}
}

function get_bt_edit_filter_auction(act, id){
	if(user_mode_filter_auction != 'delete'){
		var elem = document.getElementById('item_edit_filter_auction_'+id);
		if(act == 'open'){
			if(last_id_edit_filter_auction != '' && last_id_edit_filter_auction != id){
				var e = document.getElementById('item_edit_filter_auction_'+last_id_edit_filter_auction);
				if(e != null){
					e.style.display = 'none';
				}
			}
			if(elem != null){
				elem.style.display = 'block';
			}
			last_id_edit_filter_auction = id;
		}else{
			if(device == 'no comp'){
				if(!is_windows_phone){
					elem.style.display = 'none';
					last_id_edit_filter_auction = '';
				}
			}else{
				if(elem != null){
					elem.style.display = 'none';
					last_id_edit_filter_auction = '';
				}
			}
		}
	}
}

function edit_filter_auction(act, id){
	if(act == 'edit'){
		if(selected_tab == 'car'){
			var item_brand = document.getElementById('item_brand_'+id).innerHTML;
			var item_model = document.getElementById('item_model_'+id).innerHTML;
			var item_type_of_fuel = document.getElementById('item_type_of_fuel_'+id).innerHTML;
			var item_price = document.getElementById('item_price_'+id).innerHTML;
			var item_years_of_release = document.getElementById('item_years_of_release_'+id).innerHTML;
			var item_mileage = document.getElementById('item_mileage_'+id).innerHTML;
			var item_engine_volume = document.getElementById('item_engine_volume_'+id).innerHTML;
			var elem = document.getElementsByClassName('select_brand')[0];
			if(item_brand){
				elem.setAttribute('data', item_brand);
				elem.innerHTML = '<div class="select">'+item_brand+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
				check_options_car_model()
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_model')[0];
			if(item_model){
				setTimeout((function(elem){
				elem.setAttribute('data', item_model);
				elem.innerHTML = '<div class="select">'+item_model+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
				}), 20, elem)
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_type_of_fuel')[0];	
			if(item_type_of_fuel){
				elem.setAttribute('data', item_type_of_fuel);
				elem.innerHTML = '<div class="select">'+item_type_of_fuel+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				item_price.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_price_from')[0];
					var elem2 = document.getElementsByClassName('select_price_up_to')[0];
					if(a){
						item_price = item_price.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_price = item_price.replace(/(от|с) /, '')+':';
					}else if(e){
						item_price = item_price.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_price.split(':');
					var select_price_from = ex[0];
					var select_price_up_to = ex[1];
					if(select_price_from){
						elem1.setAttribute('data', select_price_from);
						elem1.innerHTML = '<div class="select">'+select_price_from+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_price_up_to){
						elem2.setAttribute('data', select_price_up_to);
						elem2.innerHTML = '<div class="select">'+select_price_up_to+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_years_of_release.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_year_since')[0];
					var elem2 = document.getElementsByClassName('select_year_of_release_by')[0];
					if(a){
						item_years_of_release = item_years_of_release.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_years_of_release = item_years_of_release.replace(/(от|с) /, '')+':';
					}else if(e){
						item_years_of_release = item_years_of_release.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_years_of_release.split(':');
					var select_year_since = ex[0];
					var select_year_of_release_by = ex[1];
					if(select_year_since){
						elem1.setAttribute('data', select_year_since);
						elem1.innerHTML = '<div class="select">'+select_year_since+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_year_of_release_by){
						elem2.setAttribute('data', select_year_of_release_by);
						elem2.innerHTML = '<div class="select">'+select_year_of_release_by+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_mileage.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_mileage_from')[0];
					var elem2 = document.getElementsByClassName('select_mileage_to')[0];
					if(a){
						item_mileage = item_mileage.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_mileage = item_mileage.replace(/(от|с) /, '')+':';
					}else if(e){
						item_mileage = item_mileage.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_mileage.split(':');
					var select_mileage_from = ex[0];
					var select_mileage_to = ex[1];
					if(select_mileage_from){
						elem1.setAttribute('data', select_mileage_from);
						elem1.innerHTML = '<div class="select">'+select_mileage_from+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_mileage_to){
						elem2.setAttribute('data', select_mileage_to);
						elem2.innerHTML = '<div class="select">'+select_mileage_to+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_engine_volume.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('input_engine_displacement_from')[0];
					var elem2 = document.getElementsByClassName('input_engine_displacement_up_to')[0];
					if(a){
						item_engine_volume = item_engine_volume.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_engine_volume = item_engine_volume.replace(/(от|с) /, '')+':';
					}else if(e){
						item_engine_volume = item_engine_volume.replace(/<br>(до|по) /, ':');
					}else{
						elem1.value = '';
						elem2.value = '';
						return;
					}
					ex = item_engine_volume.split(':');
					var select_engine_displacement_from = ex[0];
					var select_engine_displacement_up_to = ex[1];
					if(select_engine_displacement_from){
						elem1.value = select_engine_displacement_from;
					}else{
						elem1.value = '';
					}
					if(select_engine_displacement_up_to){
						elem2.value = select_engine_displacement_up_to;
					}else{
						elem2.value = '';
					}
				});
			var elem = document.getElementById('item_view_'+id);
			var e1 = document.getElementsByClassName('checkbox_new_only')[0];
			var e2 = document.getElementsByClassName('checkbox_used_only')[0];
			e1.checked = false;
			e2.checked = false;
			if(elem.innerHTML != ''){
				if(~elem.innerHTML.indexOf('новый')){
					e1.checked = true;
				}
				if(~elem.innerHTML.indexOf('подержанный')){
					e2.checked = true;
				}
			}
			user_mode_filter_auction = 'edit';
			document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Готово';
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'none';
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
			document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
			var elem = document.getElementById('group_item_filter_auction_'+id_edit_filter_auction);
			if(elem != null){
			elem.style.backgroundColor = '';
			}
			id_edit_filter_auction = id;
			document.getElementById('group_item_filter_auction_'+id).style.backgroundColor = '#292f40';
			setTimeout((function(){
			document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = ''; 
			}), 500);
		}
		else if(selected_tab == 'truck'){
			var item_category = document.getElementById('item_category_'+id).innerHTML;
			var item_model = document.getElementById('item_model_'+id).innerHTML;
			var item_price = document.getElementById('item_price_'+id).innerHTML;
			var item_years_of_release = document.getElementById('item_years_of_release_'+id).innerHTML;
			var item_mileage = document.getElementById('item_mileage_'+id).innerHTML;
			var item_wheel_formula = document.getElementById('item_wheel_formula_'+id).innerHTML;
			var item_axles = document.getElementById('item_axles_'+id).innerHTML;
			var item_environmental_class = document.getElementById('item_environmental_class_'+id).innerHTML;
			var elem = document.getElementsByClassName('select_category')[0];
			if(item_category){
				elem.setAttribute('data', item_category);
				elem.innerHTML = '<div class="select">'+item_category+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_model')[0];
			if(item_model){
				elem.setAttribute('data', item_model);
				elem.innerHTML = '<div class="select">'+item_model+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				item_price.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_price_from')[0];
					var elem2 = document.getElementsByClassName('select_price_up_to')[0];
					if(a){
						item_price = item_price.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_price = item_price.replace(/(от|с) /, '')+':';
					}else if(e){
						item_price = item_price.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_price.split(':');
					var select_price_from = ex[0];
					var select_price_up_to = ex[1];
					if(select_price_from){
						elem1.setAttribute('data', select_price_from);
						elem1.innerHTML = '<div class="select">'+select_price_from+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_price_up_to){
						elem2.setAttribute('data', select_price_up_to);
						elem2.innerHTML = '<div class="select">'+select_price_up_to+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_years_of_release.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_year_since')[0];
					var elem2 = document.getElementsByClassName('select_year_of_release_by')[0];
					if(a){
						item_years_of_release = item_years_of_release.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_years_of_release = item_years_of_release.replace(/(от|с) /, '')+':';
					}else if(e){
						item_years_of_release = item_years_of_release.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_years_of_release.split(':');
					var select_year_since = ex[0];
					var select_year_of_release_by = ex[1];
					if(select_year_since){
						elem1.setAttribute('data', select_year_since);
						elem1.innerHTML = '<div class="select">'+select_year_since+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_year_of_release_by){
						elem2.setAttribute('data', select_year_of_release_by);
						elem2.innerHTML = '<div class="select">'+select_year_of_release_by+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_mileage.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_mileage_from')[0];
					var elem2 = document.getElementsByClassName('select_mileage_to')[0];
					if(a){
						item_mileage = item_mileage.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_mileage = item_mileage.replace(/(от|с) /, '')+':';
					}else if(e){
						item_mileage = item_mileage.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_mileage.split(':');
					var select_mileage_from = ex[0];
					var select_mileage_to = ex[1];
					if(select_mileage_from){
						elem1.setAttribute('data', select_mileage_from);
						elem1.innerHTML = '<div class="select">'+select_mileage_from+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_mileage_to){
						elem2.setAttribute('data', select_mileage_to);
						elem2.innerHTML = '<div class="select">'+select_mileage_to+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
			var elem = document.getElementsByClassName('select_wheel_formula')[0];	
			if(item_wheel_formula){
				elem.setAttribute('data', item_wheel_formula);
				elem.innerHTML = '<div class="select">'+item_wheel_formula+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_axles')[0];	
			if(item_axles){
				elem.setAttribute('data', item_axles);
				elem.innerHTML = '<div class="select">'+item_axles+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_environmental_class')[0];	
			if(item_environmental_class){
				elem.setAttribute('data', item_environmental_class);
				elem.innerHTML = '<div class="select">'+item_environmental_class+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			user_mode_filter_auction = 'edit';
			document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Готово';
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'none';
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
			document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
			var elem = document.getElementById('group_item_filter_auction_'+id_edit_filter_auction);
			if(elem != null){
			elem.style.backgroundColor = '';
			}
			id_edit_filter_auction = id;
			document.getElementById('group_item_filter_auction_'+id).style.backgroundColor = '#292f40';
			setTimeout((function(){
			document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = ''; 
			}), 500);
		}
		else if(selected_tab == 'tractor'){
			var item_category = document.getElementById('item_category_'+id).innerHTML;
			var item_model = document.getElementById('item_model_'+id).innerHTML;
			var item_price = document.getElementById('item_price_'+id).innerHTML;
			var item_years_of_release = document.getElementById('item_years_of_release_'+id).innerHTML;
			var item_mileage = document.getElementById('item_mileage_'+id).innerHTML;
			var item_wheel_formula = document.getElementById('item_wheel_formula_'+id).innerHTML;
			var item_axles = document.getElementById('item_axles_'+id).innerHTML;
			var item_environmental_class = document.getElementById('item_environmental_class_'+id).innerHTML;
			var elem = document.getElementsByClassName('select_category')[0];
			if(item_category){
				elem.setAttribute('data', item_category);
				elem.innerHTML = '<div class="select">'+item_category+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_model')[0];
			if(item_model){
				elem.setAttribute('data', item_model);
				elem.innerHTML = '<div class="select">'+item_model+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				item_price.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_price_from')[0];
					var elem2 = document.getElementsByClassName('select_price_up_to')[0];
					if(a){
						item_price = item_price.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_price = item_price.replace(/(от|с) /, '')+':';
					}else if(e){
						item_price = item_price.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_price.split(':');
					var select_price_from = ex[0];
					var select_price_up_to = ex[1];
					if(select_price_from){
						elem1.setAttribute('data', select_price_from);
						elem1.innerHTML = '<div class="select">'+select_price_from+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_price_up_to){
						elem2.setAttribute('data', select_price_up_to);
						elem2.innerHTML = '<div class="select">'+select_price_up_to+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_years_of_release.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_year_since')[0];
					var elem2 = document.getElementsByClassName('select_year_of_release_by')[0];
					if(a){
						item_years_of_release = item_years_of_release.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_years_of_release = item_years_of_release.replace(/(от|с) /, '')+':';
					}else if(e){
						item_years_of_release = item_years_of_release.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_years_of_release.split(':');
					var select_year_since = ex[0];
					var select_year_of_release_by = ex[1];
					if(select_year_since){
						elem1.setAttribute('data', select_year_since);
						elem1.innerHTML = '<div class="select">'+select_year_since+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_year_of_release_by){
						elem2.setAttribute('data', select_year_of_release_by);
						elem2.innerHTML = '<div class="select">'+select_year_of_release_by+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_mileage.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_mileage_from')[0];
					var elem2 = document.getElementsByClassName('select_mileage_to')[0];
					if(a){
						item_mileage = item_mileage.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_mileage = item_mileage.replace(/(от|с) /, '')+':';
					}else if(e){
						item_mileage = item_mileage.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_mileage.split(':');
					var select_mileage_from = ex[0];
					var select_mileage_to = ex[1];
					if(select_mileage_from){
						elem1.setAttribute('data', select_mileage_from);
						elem1.innerHTML = '<div class="select">'+select_mileage_from+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_mileage_to){
						elem2.setAttribute('data', select_mileage_to);
						elem2.innerHTML = '<div class="select">'+select_mileage_to+' km.</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
			var elem = document.getElementsByClassName('select_wheel_formula')[0];	
			if(item_wheel_formula){
				elem.setAttribute('data', item_wheel_formula);
				elem.innerHTML = '<div class="select">'+item_wheel_formula+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_axles')[0];	
			if(item_axles){
				elem.setAttribute('data', item_axles);
				elem.innerHTML = '<div class="select">'+item_axles+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_environmental_class')[0];	
			if(item_environmental_class){
				elem.setAttribute('data', item_environmental_class);
				elem.innerHTML = '<div class="select">'+item_environmental_class+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			user_mode_filter_auction = 'edit';
			document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Готово';
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'none';
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
			document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
			var elem = document.getElementById('group_item_filter_auction_'+id_edit_filter_auction);
			if(elem != null){
			elem.style.backgroundColor = '';
			}
			id_edit_filter_auction = id;
			document.getElementById('group_item_filter_auction_'+id).style.backgroundColor = '#292f40';
			setTimeout((function(){
			document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = ''; 
			}), 500);
		}
		else if(selected_tab == 'semitrailer'){
			var item_category = document.getElementById('item_category_'+id).innerHTML;
			var item_model = document.getElementById('item_model_'+id).innerHTML;
			var item_price = document.getElementById('item_price_'+id).innerHTML;
			var item_years_of_release = document.getElementById('item_years_of_release_'+id).innerHTML;
			var item_axles = document.getElementById('item_axles_'+id).innerHTML;
			var elem = document.getElementsByClassName('select_category')[0];
			if(item_category){
				elem.setAttribute('data', item_category);
				elem.innerHTML = '<div class="select">'+item_category+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_model')[0];
			if(item_model){
				elem.setAttribute('data', item_model);
				elem.innerHTML = '<div class="select">'+item_model+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				item_price.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_price_from')[0];
					var elem2 = document.getElementsByClassName('select_price_up_to')[0];
					if(a){
						item_price = item_price.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_price = item_price.replace(/(от|с) /, '')+':';
					}else if(e){
						item_price = item_price.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_price.split(':');
					var select_price_from = ex[0];
					var select_price_up_to = ex[1];
					if(select_price_from){
						elem1.setAttribute('data', select_price_from);
						elem1.innerHTML = '<div class="select">'+select_price_from+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_price_up_to){
						elem2.setAttribute('data', select_price_up_to);
						elem2.innerHTML = '<div class="select">'+select_price_up_to+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_years_of_release.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_year_since')[0];
					var elem2 = document.getElementsByClassName('select_year_of_release_by')[0];
					if(a){
						item_years_of_release = item_years_of_release.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_years_of_release = item_years_of_release.replace(/(от|с) /, '')+':';
					}else if(e){
						item_years_of_release = item_years_of_release.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_years_of_release.split(':');
					var select_year_since = ex[0];
					var select_year_of_release_by = ex[1];
					if(select_year_since){
						elem1.setAttribute('data', select_year_since);
						elem1.innerHTML = '<div class="select">'+select_year_since+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_year_of_release_by){
						elem2.setAttribute('data', select_year_of_release_by);
						elem2.innerHTML = '<div class="select">'+select_year_of_release_by+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
			var elem = document.getElementsByClassName('select_axles')[0];	
			if(item_axles){
				elem.setAttribute('data', item_axles);
				elem.innerHTML = '<div class="select">'+item_axles+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			user_mode_filter_auction = 'edit';
			document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Готово';
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'none';
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
			document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
			var elem = document.getElementById('group_item_filter_auction_'+id_edit_filter_auction);
			if(elem != null){
			elem.style.backgroundColor = '';
			}
			id_edit_filter_auction = id;
			document.getElementById('group_item_filter_auction_'+id).style.backgroundColor = '#292f40';
			setTimeout((function(){
			document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = ''; 
			}), 500);
		}
		else if(selected_tab == 'constructionmachine'){
			var item_category = document.getElementById('item_category_'+id).innerHTML;
			var item_model = document.getElementById('item_model_'+id).innerHTML;
			var item_price = document.getElementById('item_price_'+id).innerHTML;
			var item_years_of_release = document.getElementById('item_years_of_release_'+id).innerHTML;
			var elem = document.getElementsByClassName('select_category')[0];
			if(item_category){
				elem.setAttribute('data', item_category);
				elem.innerHTML = '<div class="select">'+item_category+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			var elem = document.getElementsByClassName('select_model')[0];
			if(item_model){
				elem.setAttribute('data', item_model);
				elem.innerHTML = '<div class="select">'+item_model+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}else{
				elem.setAttribute('data', 'none');
				elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				item_price.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_price_from')[0];
					var elem2 = document.getElementsByClassName('select_price_up_to')[0];
					if(a){
						item_price = item_price.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_price = item_price.replace(/(от|с) /, '')+':';
					}else if(e){
						item_price = item_price.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_price.split(':');
					var select_price_from = ex[0];
					var select_price_up_to = ex[1];
					if(select_price_from){
						elem1.setAttribute('data', select_price_from);
						elem1.innerHTML = '<div class="select">'+select_price_from+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_price_up_to){
						elem2.setAttribute('data', select_price_up_to);
						elem2.innerHTML = '<div class="select">'+select_price_up_to+' €</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
				item_years_of_release.replace(/((от|с) ([0-9]+))?(<br>(до|по) ([0-9]+))?/, function(a, b, c, d, e){
					var elem1 = document.getElementsByClassName('select_year_since')[0];
					var elem2 = document.getElementsByClassName('select_year_of_release_by')[0];
					if(a){
						item_years_of_release = item_years_of_release.replace(/<br>/, ':').replace(/[^0-9:]/g, '');
					}else if(b){
						item_years_of_release = item_years_of_release.replace(/(от|с) /, '')+':';
					}else if(e){
						item_years_of_release = item_years_of_release.replace(/<br>(до|по) /, ':');
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
						return;
					}
					ex = item_years_of_release.split(':');
					var select_year_since = ex[0];
					var select_year_of_release_by = ex[1];
					if(select_year_since){
						elem1.setAttribute('data', select_year_since);
						elem1.innerHTML = '<div class="select">'+select_year_since+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem1.setAttribute('data', 'none');
						elem1.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
					if(select_year_of_release_by){
						elem2.setAttribute('data', select_year_of_release_by);
						elem2.innerHTML = '<div class="select">'+select_year_of_release_by+'</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}else{
						elem2.setAttribute('data', 'none');
						elem2.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
					}
				});
			user_mode_filter_auction = 'edit';
			document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Готово';
			document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'none';
			document.getElementsByClassName('icon_delete_filters_auction')[0].style.display = 'none';
			document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
			var elem = document.getElementById('group_item_filter_auction_'+id_edit_filter_auction);
			if(elem != null){
			elem.style.backgroundColor = '';
			}
			id_edit_filter_auction = id;
			document.getElementById('group_item_filter_auction_'+id).style.backgroundColor = '#292f40';
			setTimeout((function(){
			document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = ''; 
			}), 500);
		}
	}else{
		show_edit_auction(selected_bt_auction) 
	}
}

function check_options_car_model(){
	setTimeout((function(){
		var elem = document.getElementsByClassName('select_brand')[0];
		var data;
		elem.innerHTML.replace(/<div class="select">([^<]+)<\/div>/, function(a, b){
			data = b;
		});
		var obj = auction_filters[selected_bt_auction][selected_tab]['models'];
		if(obj[data]){
			obj = obj[data];
			var options_model = '<div class="option option_model" data="none">Не выбрано</div>';
			for (var item in obj) {
				options_model += '<div class="option option_model" data="'+item+'">'+item+'</div>';
			}
			document.getElementsByClassName('options_model')[0].innerHTML = options_model;
		}else{
			document.getElementsByClassName('options_model')[0].innerHTML = '<div class="option option_model" data="none">Не выбрано</div>';
		}
		var elem = document.getElementsByClassName('select_model')[0];
		elem.setAttribute('data', 'none');
		elem.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
	}), 10)
}

function response__add_or_edit_auction_filter(res){
	user_mode_filter_auction = 'add';
	document.getElementsByClassName('bt_add_filter')[0].innerHTML = 'Добавить';
	try{
				var result = JSON.parse(res);
			}catch(e){
				alert('Ошибка\n\n'+res);
				return;
			}
	if (result.response) {
		var act = result.response[1];
		var data = result.response[2];
		if(data == null){
			document.location.reload();
			return
		}
		var ex = data.split('|');
		var country_code = ex[0];
		var vehicle_type = ex[1];
			if(vehicle_type == 'car'){
				var brand = ex[2];
				var model = ex[3];
				var type_of_fuel = ex[4];
				var price = ex[5];
				var price_ = ex[5];
				var years_of_release = ex[6];
				var years_of_release_ = ex[6];
				var mileage = ex[7];
				var mileage_ = ex[7];
				var engine_volume = ex[8];
				var engine_volume_ = ex[8];
				var view = ex[9];
				var view_ = ex[9];
				var date = ex[10];
				var id = ex[11];
				if(price){
					price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(engine_volume){
					engine_volume = engine_volume.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(mileage){
					mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(years_of_release){
					years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
				}
				view = view.replace(',', '<br>').replace('new', 'новый').replace('used', 'подержанный');
				var elem = document.createElement('div');
				elem.setAttribute('id', 'group_item_filter_auction_'+id);
				elem.setAttribute('class', 'group_item_filter_auction');
				if (device == 'comp') {
					elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				} else {
					elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				}
				elem.innerHTML = '<div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_brand">Марка авто<div id="item_brand_'+id+'">'+brand+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'">'+model+'</div></div><div class="item_filter_auction_type_of_fuel">Вид топлива<div id="item_type_of_fuel_'+id+'">'+type_of_fuel+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'">'+mileage+'</div></div><div class="item_filter_auction_engine_volume">Обьем дви. (cm³)<div id="item_engine_volume_'+id+'">'+engine_volume+'</div></div><div class="item_filter_auction_view">Вид авто<div id="item_view_'+id+'">'+view+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
			}
			else if(vehicle_type == 'truck'){
				var category = ex[2];
				var model = ex[3];
				var price = ex[4];
				var price_ = ex[4];
				var mileage = ex[5];
				var mileage_ = ex[5];
				var years_of_release = ex[6];
				var years_of_release_ = ex[6];
				var wheel_formula = ex[7];
				var axles = ex[8];
				var axles_ = ex[8];
				var environmental_class = ex[9];
				var date = ex[10];
				var id = ex[11];
				if(price){
					price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(mileage){
					mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(years_of_release){
					years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
				}
				var elem = document.createElement('div');
				elem.setAttribute('id', 'group_item_filter_auction_'+id);
				elem.setAttribute('class', 'group_item_filter_auction');
				if (device == 'comp') {
					elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				} else {
					elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				}
				elem.innerHTML = '<div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'">'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div id="item_wheel_formula_'+id+'">'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'">'+axles+'</div></div><div class="item_filter_auction_environmental_class">Эколог. класс<div id="item_environmental_class_'+id+'">'+environmental_class+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
			}
			else if(vehicle_type == 'tractor'){
				var category = ex[2];
				var model = ex[3];
				var price = ex[4];
				var price_ = ex[4];
				var mileage = ex[5];
				var mileage_ = ex[5];
				var years_of_release = ex[6];
				var years_of_release_ = ex[6];
				var wheel_formula = ex[7];
				var axles = ex[8];
				var axles_ = ex[8];
				var environmental_class = ex[9];
				var date = ex[10];
				var id = ex[11];
				if(price){
					price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(mileage){
					mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(years_of_release){
					years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
				}
				var elem = document.createElement('div');
				elem.setAttribute('id', 'group_item_filter_auction_'+id);
				elem.setAttribute('class', 'group_item_filter_auction');
				if (device == 'comp') {
					elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				} else {
					elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				}
				elem.innerHTML = '<div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'">'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div id="item_mileage_'+id+'">'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div id="item_wheel_formula_'+id+'">'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'">'+axles+'</div></div><div class="item_filter_auction_environmental_class">Эколог. класс<div id="item_environmental_class_'+id+'">'+environmental_class+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
			}
			else if(vehicle_type == 'semitrailer'){
				var category = ex[2];
				var model = ex[3];
				var price = ex[4];
				var price_ = ex[4];
				var years_of_release = ex[5];
				var years_of_release_ = ex[5];
				var axles = ex[6];
				var axles_ = ex[6];
				var date = ex[7];
				var id = ex[8];
				if(price){
					price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(years_of_release){
					years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
				}
				var elem = document.createElement('div');
				elem.setAttribute('id', 'group_item_filter_auction_'+id);
				elem.setAttribute('class', 'group_item_filter_auction');
				if (device == 'comp') {
					elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				} else {
					elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				}
				elem.innerHTML = '<div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'">'+years_of_release+'</div></div><div class="item_filter_auction_axles">Оси<div id="item_axles_'+id+'">'+axles+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
			}
			else if(vehicle_type == 'constructionmachine'){
				var category = ex[2];
				var model = ex[3];
				var price = ex[4];
				var price_ = ex[4];
				var years_of_release = ex[5];
				var years_of_release_ = ex[5];
				var date = ex[6];
				var id = ex[7];
				if(price){
					price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
				}
				if(years_of_release){
					years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
				}
				var elem = document.createElement('div');
				elem.setAttribute('id', 'group_item_filter_auction_'+id);
				elem.setAttribute('class', 'group_item_filter_auction');
				if (device == 'comp') {
					elem.setAttribute('onmouseenter', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseleave', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				} else {
					elem.setAttribute('onmouseover', 'get_bt_edit_filter_auction(\'open\', \''+id+'\')');
					elem.setAttribute('onmouseout', 'get_bt_edit_filter_auction(\'close\', \''+id+'\')');
				}
				elem.innerHTML = '<div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div id="item_category_'+id+'">'+category+'</div></div><div class="item_filter_auction_model">Модель<div id="item_model_'+id+'">'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div id="item_price_'+id+'">'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div id="item_years_of_release_'+id+'">'+years_of_release+'</div></div><div class="item_filter_auction_edit"><i id="item_edit_filter_auction_'+id+'" style="display:none;" class="icon-pencil" onclick="edit_filter_auction(\'edit\', \''+id+'\')"></i><i id="prepare_delete_filter_auction_'+id+'" class="icon-check-empty" data-checked="0" style="display:none;" onclick="prepare_delete_filter_auction(\''+id+'\')"></i></div>';
			}
			if(vehicle_type == 'car'){
				var e = document.getElementsByClassName('select_brand')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_model')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				document.getElementsByClassName('options_model')[0].innerHTML = '<div class="option option_model" data="none">Не выбрано</div>';
				var e = document.getElementsByClassName('select_type_of_fuel')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_up_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_since')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_of_release_by')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				document.getElementsByClassName('input_engine_displacement_from')[0].value = '';
				document.getElementsByClassName('input_engine_displacement_up_to')[0].value = '';
				document.getElementsByClassName('checkbox_new_only')[0].checked = false;
				document.getElementsByClassName('checkbox_used_only')[0].checked = false;
			}
			else if(vehicle_type == 'truck'){
				var e = document.getElementsByClassName('select_category')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_model')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_up_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_since')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_of_release_by')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_wheel_formula')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_axles')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_environmental_class')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			else if(vehicle_type == 'tractor'){
				var e = document.getElementsByClassName('select_category')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_model')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_up_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_since')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_of_release_by')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_mileage_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_wheel_formula')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_axles')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_environmental_class')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			else if(vehicle_type == 'semitrailer'){
				var e = document.getElementsByClassName('select_category')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_model')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_up_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_since')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_of_release_by')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_axles')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
			else if(vehicle_type == 'constructionmachine'){
				var e = document.getElementsByClassName('select_category')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_model')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_from')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_price_up_to')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_since')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
				var e = document.getElementsByClassName('select_year_of_release_by')[0];
				e.setAttribute('data', 'none');
				e.innerHTML = '<div class="select">Не выбрано</div><i class="icon_flag_select icon-down-open-mini"></i>';
			}
				if(act == 'add'){
					if(country_code == selected_bt_auction && vehicle_type == selected_tab){
						var e = document.getElementsByClassName('list_filters_auction')[0];
						if(~e.innerHTML.indexOf('Список фильтров пуст.')){
							e.innerHTML = '';
						}
						e.insertBefore(elem, e.childNodes[0]);
						document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.opacity = '';
					}
					if(vehicle_type == 'car'){
						if(user_filters[country_code]){
							user_filters[country_code].push({'car':{'brand':brand, 'model':model, 'type_of_fuel':type_of_fuel, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'engine_volume':engine_volume_, 'view':view_, 'date':date, 'id':id}});
						}else{
							user_filters[country_code] = [{'car':{'brand':brand, 'model':model, 'type_of_fuel':type_of_fuel, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'engine_volume':engine_volume_, 'view':view_, 'date':date, 'id':id}}];
						}
					}else if(vehicle_type == 'truck'){
						if(user_filters[country_code]){
							user_filters[country_code].push({'truck':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'wheel_formula':wheel_formula, 'axles':axles_, 'environmental_class':environmental_class, 'date':date, 'id':id}});
						}else{
							user_filters[country_code] = [{'truck':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'wheel_formula':wheel_formula, 'axles':axles_, 'environmental_class':environmental_class, 'date':date, 'id':id}}];
						}
					}else if(vehicle_type == 'tractor'){
						if(user_filters[country_code]){
							user_filters[country_code].push({'tractor':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'wheel_formula':wheel_formula, 'axles':axles_, 'environmental_class':environmental_class, 'date':date, 'id':id}});
						}else{
							user_filters[country_code] = [{'tractor':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'mileage':mileage_, 'wheel_formula':wheel_formula, 'axles':axles_, 'environmental_class':environmental_class, 'date':date, 'id':id}}];
						}
					}else if(vehicle_type == 'semitrailer'){
						if(user_filters[country_code]){
							user_filters[country_code].push({'semitrailer':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'axles':axles_, 'date':date, 'id':id}});
						}else{
							user_filters[country_code] = [{'semitrailer':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'axles':axles_, 'date':date, 'id':id}}];
						}
					}else if(vehicle_type == 'constructionmachine'){
						if(user_filters[country_code]){
							user_filters[country_code].push({'constructionmachine':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'date':date, 'id':id}});
						}else{
							user_filters[country_code] = [{'constructionmachine':{'category':category, 'model':model, 'price':price_, 'years_of_release':years_of_release_, 'date':date, 'id':id}}];
						}
					}
				}else{
					if(country_code == selected_bt_auction && vehicle_type == selected_tab){
						document.getElementsByClassName('edit_mode_blok_filter')[0].style.display = 'none';
						var e1 = document.getElementById('group_item_filter_auction_'+id);
						if(e1 != null){
							e1.setAttribute('id', 'group_item_filter_auction_remove');
							var e = document.getElementsByClassName('list_filters_auction')[0];
							e.insertBefore(elem, e1);
							e1.parentNode.removeChild(e1);
							e1 = null;
						}
						document.getElementsByClassName('icon_show_and_hide_checkbox')[0].style.display = 'block';
					}
					if(vehicle_type == 'car'){
						var len = user_filters[country_code].length;
						for(var i = 0; i < len; i++){
							if(user_filters[country_code][i] && user_filters[country_code][i]['car'] && user_filters[country_code][i]['car']['id'] == id){
								user_filters[country_code][i]['car']['brand'] = brand;
								user_filters[country_code][i]['car']['model'] = model;
								user_filters[country_code][i]['car']['type_of_fuel'] = type_of_fuel;
								user_filters[country_code][i]['car']['price'] = price_;
								user_filters[country_code][i]['car']['years_of_release'] = years_of_release_;
								user_filters[country_code][i]['car']['mileage'] = mileage_;
								user_filters[country_code][i]['car']['engine_volume'] = engine_volume_;
								user_filters[country_code][i]['car']['view'] = view_;
								break;
							}
						}
					}
					else if(vehicle_type == 'truck'){
						var len = user_filters[country_code].length;
						for(var i = 0; i < len; i++){
							if(user_filters[country_code][i] && user_filters[country_code][i]['truck'] && user_filters[country_code][i]['truck']['id'] == id){
								user_filters[country_code][i]['truck']['category'] = category;
								user_filters[country_code][i]['truck']['model'] = model;
								user_filters[country_code][i]['truck']['price'] = price_;
								user_filters[country_code][i]['truck']['years_of_release'] = years_of_release_;
								user_filters[country_code][i]['truck']['mileage'] = mileage_;
								user_filters[country_code][i]['truck']['wheel_formula'] = wheel_formula;
								user_filters[country_code][i]['truck']['axles'] = axles_;
								user_filters[country_code][i]['truck']['environmental_class'] = environmental_class;
								break;
							}
						}
					}
					else if(vehicle_type == 'tractor'){
						var len = user_filters[country_code].length;
						for(var i = 0; i < len; i++){
							if(user_filters[country_code][i] && user_filters[country_code][i]['tractor'] && user_filters[country_code][i]['tractor']['id'] == id){
								user_filters[country_code][i]['tractor']['category'] = category;
								user_filters[country_code][i]['tractor']['model'] = model;
								user_filters[country_code][i]['tractor']['price'] = price_;
								user_filters[country_code][i]['tractor']['years_of_release'] = years_of_release_;
								user_filters[country_code][i]['tractor']['mileage'] = mileage_;
								user_filters[country_code][i]['tractor']['wheel_formula'] = wheel_formula;
								user_filters[country_code][i]['tractor']['axles'] = axles_;
								user_filters[country_code][i]['tractor']['environmental_class'] = environmental_class;
								break;
							}
						}
					}
					else if(vehicle_type == 'semitrailer'){
						var len = user_filters[country_code].length;
						for(var i = 0; i < len; i++){
							if(user_filters[country_code][i] && user_filters[country_code][i]['semitrailer'] && user_filters[country_code][i]['semitrailer']['id'] == id){
								user_filters[country_code][i]['semitrailer']['category'] = category;
								user_filters[country_code][i]['semitrailer']['model'] = model;
								user_filters[country_code][i]['semitrailer']['price'] = price_;
								user_filters[country_code][i]['semitrailer']['years_of_release'] = years_of_release_;
								user_filters[country_code][i]['semitrailer']['axles'] = axles_;
								break;
							}
						}
					}
					else if(vehicle_type == 'constructionmachine'){
						var len = user_filters[country_code].length;
						for(var i = 0; i < len; i++){
							if(user_filters[country_code][i] && user_filters[country_code][i]['constructionmachine'] && user_filters[country_code][i]['constructionmachine']['id'] == id){
								user_filters[country_code][i]['constructionmachine']['category'] = category;
								user_filters[country_code][i]['constructionmachine']['model'] = model;
								user_filters[country_code][i]['constructionmachine']['price'] = price_;
								user_filters[country_code][i]['constructionmachine']['years_of_release'] = years_of_release_;
								break;
							}
						}
					}
				}
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'FILTER_IS_EXISTS':
						alert('Ошибка\n\nТакие параметры фильтра уже есть в вашем списке');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function add_or_edit_auction_filter(){
	var f = false;
	if(selected_tab == 'car'){
		var brand = document.getElementsByClassName('select_brand')[0].getAttribute('data');
		if(brand != 'none'){f = true;}
		var model = document.getElementsByClassName('select_model')[0].getAttribute('data');
		if(model != 'none'){f = true;}
		var type_of_fuel = document.getElementsByClassName('select_type_of_fuel')[0].getAttribute('data');
		if(type_of_fuel != 'none'){f = true;}
		var price_from = document.getElementsByClassName('select_price_from')[0].getAttribute('data');
		if(price_from != 'none'){f = true;}
		var price_up_to = document.getElementsByClassName('select_price_up_to')[0].getAttribute('data');
		if(price_up_to != 'none'){f = true;}
		var year_since = document.getElementsByClassName('select_year_since')[0].getAttribute('data');
		if(year_since != 'none'){f = true;}
		var year_of_release_by = document.getElementsByClassName('select_year_of_release_by')[0].getAttribute('data');
		if(year_of_release_by != 'none'){f = true;}
		var mileage_from = document.getElementsByClassName('select_mileage_from')[0].getAttribute('data');
		if(mileage_from != 'none'){f = true;}
		var mileage_to = document.getElementsByClassName('select_mileage_to')[0].getAttribute('data');
		if(mileage_to != 'none'){f = true;}
		var engine_displacement_from = document.getElementsByClassName('input_engine_displacement_from')[0].value;
		if(engine_displacement_from != ''){f = true;}
		var engine_displacement_up_to = document.getElementsByClassName('input_engine_displacement_up_to')[0].value;
		if(engine_displacement_up_to != ''){f = true;}
		var view = '';
		if(document.getElementsByClassName('checkbox_new_only')[0].checked){
			view += 'new,';
		}
		if(document.getElementsByClassName('checkbox_used_only')[0].checked){
			view += 'used';
		}
		view = view.replace(/,$/, '');
		if(view != ''){f = true;}
		var data = 'add_or_edit_auction_filter=&act='+user_mode_filter_auction+'&id='+id_edit_filter_auction+'&country_code='+selected_bt_auction+'&filter='+encodeURIComponent(selected_tab+'|'+brand+'|'+model+'|'+type_of_fuel+'|'+price_from+'|'+price_up_to+'|'+year_since+'|'+year_of_release_by+'|'+mileage_from+'|'+mileage_to+'|'+engine_displacement_from+'|'+engine_displacement_up_to+'|'+view);
	}
	else if(selected_tab == 'truck'){
		var category = document.getElementsByClassName('select_category')[0].getAttribute('data');
		if(category != 'none'){f = true;}
		var model = document.getElementsByClassName('select_model')[0].getAttribute('data');
		if(model != 'none'){f = true;}
		var price_from = document.getElementsByClassName('select_price_from')[0].getAttribute('data');
		if(price_from != 'none'){f = true;}
		var price_up_to = document.getElementsByClassName('select_price_up_to')[0].getAttribute('data');
		if(price_up_to != 'none'){f = true;}
		var mileage_from = document.getElementsByClassName('select_mileage_from')[0].getAttribute('data');
		if(mileage_from != 'none'){f = true;}
		var mileage_to = document.getElementsByClassName('select_mileage_to')[0].getAttribute('data');
		if(mileage_to != 'none'){f = true;}
		var year_since = document.getElementsByClassName('select_year_since')[0].getAttribute('data');
		if(year_since != 'none'){f = true;}
		var year_of_release_by = document.getElementsByClassName('select_year_of_release_by')[0].getAttribute('data');
		if(year_of_release_by != 'none'){f = true;}
		var wheel_formula = document.getElementsByClassName('select_wheel_formula')[0].getAttribute('data');
		if(wheel_formula != 'none'){f = true;}
		var axles = document.getElementsByClassName('select_axles')[0].getAttribute('data');
		if(axles != 'none'){f = true;}
		var environmental_class = document.getElementsByClassName('select_environmental_class')[0].getAttribute('data');
		if(environmental_class != 'none'){f = true;}
		var data = 'add_or_edit_auction_filter=&act='+user_mode_filter_auction+'&id='+id_edit_filter_auction+'&country_code='+selected_bt_auction+'&filter='+encodeURIComponent(selected_tab+'|'+category+'|'+model+'|'+price_from+'|'+price_up_to+'|'+year_since+'|'+year_of_release_by+'|'+mileage_from+'|'+mileage_to+'|'+wheel_formula+'|'+axles+'|'+environmental_class);
	}
	else if(selected_tab == 'tractor'){
		var category = document.getElementsByClassName('select_category')[0].getAttribute('data');
		if(category != 'none'){f = true;}
		var model = document.getElementsByClassName('select_model')[0].getAttribute('data');
		if(model != 'none'){f = true;}
		var price_from = document.getElementsByClassName('select_price_from')[0].getAttribute('data');
		if(price_from != 'none'){f = true;}
		var price_up_to = document.getElementsByClassName('select_price_up_to')[0].getAttribute('data');
		if(price_up_to != 'none'){f = true;}
		var mileage_from = document.getElementsByClassName('select_mileage_from')[0].getAttribute('data');
		if(mileage_from != 'none'){f = true;}
		var mileage_to = document.getElementsByClassName('select_mileage_to')[0].getAttribute('data');
		if(mileage_to != 'none'){f = true;}
		var year_since = document.getElementsByClassName('select_year_since')[0].getAttribute('data');
		if(year_since != 'none'){f = true;}
		var year_of_release_by = document.getElementsByClassName('select_year_of_release_by')[0].getAttribute('data');
		if(year_of_release_by != 'none'){f = true;}
		var wheel_formula = document.getElementsByClassName('select_wheel_formula')[0].getAttribute('data');
		if(wheel_formula != 'none'){f = true;}
		var axles = document.getElementsByClassName('select_axles')[0].getAttribute('data');
		if(axles != 'none'){f = true;}
		var environmental_class = document.getElementsByClassName('select_environmental_class')[0].getAttribute('data');
		if(environmental_class != 'none'){f = true;}
		var data = 'add_or_edit_auction_filter=&act='+user_mode_filter_auction+'&id='+id_edit_filter_auction+'&country_code='+selected_bt_auction+'&filter='+encodeURIComponent(selected_tab+'|'+category+'|'+model+'|'+price_from+'|'+price_up_to+'|'+year_since+'|'+year_of_release_by+'|'+mileage_from+'|'+mileage_to+'|'+wheel_formula+'|'+axles+'|'+environmental_class);
	}
	else if(selected_tab == 'semitrailer'){
		var category = document.getElementsByClassName('select_category')[0].getAttribute('data');
		if(category != 'none'){f = true;}
		var model = document.getElementsByClassName('select_model')[0].getAttribute('data');
		if(model != 'none'){f = true;}
		var price_from = document.getElementsByClassName('select_price_from')[0].getAttribute('data');
		if(price_from != 'none'){f = true;}
		var price_up_to = document.getElementsByClassName('select_price_up_to')[0].getAttribute('data');
		if(price_up_to != 'none'){f = true;}
		var year_since = document.getElementsByClassName('select_year_since')[0].getAttribute('data');
		if(year_since != 'none'){f = true;}
		var year_of_release_by = document.getElementsByClassName('select_year_of_release_by')[0].getAttribute('data');
		if(year_of_release_by != 'none'){f = true;}
		var axles = document.getElementsByClassName('select_axles')[0].getAttribute('data');
		if(axles != 'none'){f = true;}
		var data = 'add_or_edit_auction_filter=&act='+user_mode_filter_auction+'&id='+id_edit_filter_auction+'&country_code='+selected_bt_auction+'&filter='+encodeURIComponent(selected_tab+'|'+category+'|'+model+'|'+price_from+'|'+price_up_to+'|'+year_since+'|'+year_of_release_by+'|'+axles);
	}
	else if(selected_tab == 'constructionmachine'){
		var category = document.getElementsByClassName('select_category')[0].getAttribute('data');
		if(category != 'none'){f = true;}
		var model = document.getElementsByClassName('select_model')[0].getAttribute('data');
		if(model != 'none'){f = true;}
		var price_from = document.getElementsByClassName('select_price_from')[0].getAttribute('data');
		if(price_from != 'none'){f = true;}
		var price_up_to = document.getElementsByClassName('select_price_up_to')[0].getAttribute('data');
		if(price_up_to != 'none'){f = true;}
		var year_since = document.getElementsByClassName('select_year_since')[0].getAttribute('data');
		if(year_since != 'none'){f = true;}
		var year_of_release_by = document.getElementsByClassName('select_year_of_release_by')[0].getAttribute('data');
		if(year_of_release_by != 'none'){f = true;}
		var data = 'add_or_edit_auction_filter=&act='+user_mode_filter_auction+'&id='+id_edit_filter_auction+'&country_code='+selected_bt_auction+'&filter='+encodeURIComponent(selected_tab+'|'+category+'|'+model+'|'+price_from+'|'+price_up_to+'|'+year_since+'|'+year_of_release_by);
	}
	if(f){
		if(user_mode_filter_auction == 'delete'){
			get_select_filter_auction()
		}
		document.getElementsByClassName('bt_add_filter')[0].innerHTML = show_animation_load(20, 20, '1d1d1d');
		postAjax(document.location.href, 'POST', data, response__add_or_edit_auction_filter);
	}
}

function show_info_to_subscribe(){
	document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel"><div class="logo"></div><div class="header_window_text">Automobile Traiding Administration Tool</div></div><div class="window_central_panel_content"><div class="header_window_central_panel_content_text">Как подписаться для рассылку</div><div class="text" style="color:#5a5a5a;">Вы можете на каждый аукцион подписать отдельный телеграм канал, а можете один и тот же.<br>Первым делом перейдите в свой телеграм канал, откройте управление каналом и найдите "Администраторы"<img src="/img/04d40e2a11569ccd2a95a2fc9d274ff7.png" class="preview_img_info_to_subscribe">Перейдите туда, затем нажмите "Добавить администратора"<img src="/img/a7136fde8731381428855e4517515534.png" class="preview_img_info_to_subscribe">Далее в поиске введите "auction manager 100500", будет найден телеграм бот отвечающий за рассылку<img src="/img/5ea3365e84fbc9481cc344176227067e.png" class="preview_img_info_to_subscribe">Выберите его, затем нажмите галочку сохранения, обратите внимание на выставленые галочки возможностей администратора, обязательно должна стоять "Публиковать сообщения", остальные не важны<img src="/img/28dc760edcf2974e1064d13c9ee0d194.png" class="preview_img_info_to_subscribe">Затем в разделе "Администраторы" у вас должен появится телеграм бот "auction manager 100500"<img src="/img/a803aa2b0b89f89332dd41d120598ee7.png" class="preview_img_info_to_subscribe">Последний этап, отправьте себе в канал команду "/sub" (это сокращенное от subscribe), после чего вам необходимо переслать это сообщение боту "auction manager 100500", который ответит вам в ваш же канал сообщением о успешной подписке<img src="/img/ad1929d48ee397f605aeb4ba3f9554cf.png" class="preview_img_info_to_subscribe">Чтобы отписатся отправте в канал команду "/unsub" и аналогично перешлите это сообщение телеграм боту, на что так же придет ответное сообщение о отписке от рассылки</div></div></div>';
}

function response__save_telegram_channel(res){
	var elem = document.getElementsByClassName('load_save_telegram_channel')[0];
	elem.style.display = 'none';
	elem.innerHTML = '';
	document.getElementsByClassName('icon_save_telegram_channel')[0].style.display = 'block';
	try{
				var result = JSON.parse(res);
			}catch(e){
				alert('Ошибка\n\n'+res);
				return;
			}
	if (result.response) {
		var telegram_channel = result.response[1];
		var id_telegram_channel = result.response[2];
		var elem = document.getElementsByClassName('tooltip_mes_info_no_subscribe')[0];
		if(telegram_channel != '' && id_telegram_channel == ''){
			elem.style.display = 'block';
		}else{
			elem.style.display = 'none';
		}
		var elem = document.getElementsByClassName('input_telegram_channel')[0];
		elem.value = telegram_channel
		elem.setAttribute('data-telegram_channel', telegram_channel);
		country_and_telegram_channels[selected_bt_auction] = {'telegram_channel':telegram_channel, 'id_telegram_channel':id_telegram_channel};
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'FAIL_NAME_TELEGRAM_CHANNEL':
						alert('Ошибка\n\nНазвание телеграм канала некорректно');
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'TELEGRAM_CHANNEL_EXISTS':
						alert('Ошибка\n\nТакой телеграм канал уже существует у другого пользователя сервиса.\nПереименуйте свой телеграм канал, затем сохраните новое название здесь, затем подпишитесь на рассылку, после чего можете вернуть старое название');
						break;
					case 'CANNOT_BE_RENAMED_TELEGRAM_CHANNEL':
						alert('Ошибка\n\nВы не можете сменить название канала неотписавшись от рассылки. Сначало отпишите текущий канал от рассылки, затем меняйте название канала на новое');
					break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function save_telegram_channel(){
	var elem = document.getElementsByClassName('input_telegram_channel')[0];
	var telegram_channel = elem.value;
	if(elem.getAttribute('data-telegram_channel') != telegram_channel && telegram_channel != ' '){
			document.getElementsByClassName('icon_save_telegram_channel')[0].style.display = 'none';
			var elem = document.getElementsByClassName('load_save_telegram_channel')[0];
			elem.style.display = 'block';
			elem.innerHTML = show_animation_load(18, 18, '1d1d1d');
			var data = 'save_telegram_channel=&country_code='+encodeURIComponent(selected_bt_auction)+'&telegram_channel='+encodeURIComponent(telegram_channel);
			postAjax(document.location.href, 'POST', data, response__save_telegram_channel);
	}
}

function logout(){
	set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_logout')[0]);
	cookie.delete('id_auth=');
	var data = 'logout=';
	postAjax(document.location.href, 'POST', data);
	setTimeout((function(){
	document.location.reload();
	}), 200)
}

function response__check_data_online(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		return;
	}
	if (result.response) {
		var ex = result.response[0];
		var telegram_channel = ex[0];
		var id_telegram_channel = ex[1];
		var country_code = ex[2];
		var elem = document.getElementsByClassName('tooltip_mes_info_no_subscribe')[0];
		if(elem != null){
			if(country_code && country_code == selected_bt_auction){
				if(telegram_channel && telegram_channel != ''){
					if(id_telegram_channel && id_telegram_channel != ''){
						elem.style.display = 'none';
					}else{
						elem.style.display = 'block';
					}
				}
			}
		}
		var arr = [];
		var elem = document.getElementsByClassName('new_bug_marker')[0];
		var len = result.response[1][0]['logs_new_bug'].length;
		if(result.response[1][0] && len > 0){
			for(var i = 0; i < len; i++){
				var e = document.getElementById('new_bug_marker_'+result.response[1][0]['logs_new_bug'][i]);
				if(e != null){
					e.style.display = '';
				}
				arr.push(result.response[1][0]['logs_new_bug'][i]);
			}
			/* if((elem != null) && (!selected_bt_central_panel || !~selected_bt_central_panel.className.indexOf('bt_get_info_bug'))){
				elem.style.display = 'block';
			} */
		}else{
			if(elem != null){
				elem.style.display = 'none';
			}
		}
		if(result.response[1][1]){
			for(var item in result.response[1][1]){
				if(item == 'errors.log'){
					var elem = document.getElementsByClassName('service_errors_list')[0];
					if(elem != null){
						if(document.getElementById('item_errors_list_'+item)){
							var e = document.getElementById('size_service_errors_list_'+item);
							if(+e.getAttribute('data') != result.response[1][1][item]){
								e.setAttribute('data', result.response[1][1][item]);
								e.innerHTML = (result.response[1][1][item] / 1000)+' kb';
							}
						}else{
							var e = document.createElement('div');
							e.setAttribute('id', 'item_errors_list_'+item);
							e.setAttribute('class', 'item_errors_list');
							e.innerHTML = '<span><a target="_blank" href="/service_errors/'+item+'" style="color:#946c34">'+item+'</a>&nbsp;&nbsp;<span id="size_service_errors_list_'+item+'" class="size_service_errors_list" data="'+result.response[1][1][item]+'">'+(result.response[1][1][item] / 1000)+' kb</span>&nbsp;&nbsp;<span id="new_bug_marker_'+item+'" class="new_bug_marker1"'+(!~arr.indexOf(item) ? ' style="display:none;"' : '')+'></span></span><i class="clear_service_errors_list icon-trash" onclick="clear_service_errors_list(\''+item+'\')"></i>';
							elem.appendChild(e);
						}
					}
				}else{
					var elem = document.getElementsByClassName('parsing_errors_list')[0];
					if(elem != null){
						if(document.getElementById('item_errors_list_'+item)){
							var e = document.getElementById('size_parsing_errors_list_'+item);
							if(+e.getAttribute('data') != result.response[1][1][item]){
								e.setAttribute('data', result.response[1][1][item]);
								e.innerHTML = (result.response[1][1][item] / 1000)+' kb';
							}
						}else{
							var e = document.createElement('div');
							e.setAttribute('id', 'item_errors_list_'+item);
							e.setAttribute('class', 'item_errors_list');
							e.innerHTML = '<span><a target="_blank" href="/parsing_errors/'+item+'" style="color:#946c34">'+item+'</a>&nbsp;&nbsp;<span id="size_parsing_errors_list_'+item+'" class="size_parsing_errors_list" data="'+result.response[1][1][item]+'">'+(result.response[1][1][item] / 1000)+' kb</span>&nbsp;&nbsp;<span id="new_bug_marker_'+item+'" class="new_bug_marker1"'+(!~arr.indexOf(item) ? ' style="display:none;"' : '')+'></span></span><i class="delete_parsing_errors_list icon-cancel" onclick="delete_parsing_errors_list(\''+item+'\')"></i>';
							elem.appendChild(e);
						}
					}
				}
			}
		}
		if(result.response[2][0]){
			var count_process_service = result.response[2][0]['count_process_service'];
			var elem = document.getElementsByClassName('state_service_blok')[0];
			if(elem != null){
				if(count_process_service > 0){
					if(document.getElementsByClassName('icon_state_service_is_work')[0] == null || document.getElementsByClassName('count_process_service')[0].getAttribute('data') != String(count_process_service)){
						elem.innerHTML = '<i class="icon_state_service_is_work icon-ok-1"></i><span class="state_service_is_work">Сервис работает</span><div class="tooltip_parent"><span class="count_process_service" onclick="stop_propagation(event)" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_count_process_service\')" onmouseout="get_tooltip(\'close\')" data="'+count_process_service+'">('+count_process_service+')</span><div class="tooltip_mes_count_process_service" style="display:none;">'+count_process_service+' потоков</div></div><div class="tooltip_parent"><i class="bt_restart_service icon-arrows-cw" onclick="stop_propagation(event);start_and_restart_service(\'restart\')" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_restart_service\')" onmouseout="get_tooltip(\'close\')"></i><span class="load_start_and_restart_service" style="display:none;"></span><div class="tooltip_mes_restart_service" style="display:none;">Перезапустить</div></div>';
					}
				}else{
					if(document.getElementsByClassName('icon_state_service_is_no_work')[0] == null){
						elem.innerHTML = '<i class="icon_state_service_is_no_work icon-attention"></i><span class="state_service_is_no_work">Сервис не работает</span><div class="tooltip_parent"><i class="bt_start_service icon-play" onclick="stop_propagation(event);start_and_restart_service(\'start\')" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_start_service\')" onmouseout="get_tooltip(\'close\')"></i><span class="load_start_and_restart_service" style="display:none;"></span><div class="tooltip_mes_start_service" style="display:none;">Запустить</div></div>';
					}
				}
			}
		}
	}else{
		switch (result.error) {
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						document.location.reload();
						break;
				}
	}
}

function response__start_and_restart_service(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.response){
		var act = result.response[1]['act'];
		var count_process_service = result.response[1]['count_process_service'];
			var elem = document.getElementsByClassName('state_service_blok')[0];
			if(elem != null){
				if(count_process_service > 0){
						elem.innerHTML = '<i class="icon_state_service_is_work icon-ok-1"></i><span class="state_service_is_work">Сервис работает</span><div class="tooltip_parent"><span class="count_process_service" onclick="stop_propagation(event)" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_count_process_service\')" onmouseout="get_tooltip(\'close\')" data="'+count_process_service+'">('+count_process_service+')</span><div class="tooltip_mes_count_process_service" style="display:none;">'+count_process_service+' потоков</div></div><div class="tooltip_parent"><i class="bt_restart_service icon-arrows-cw" onclick="stop_propagation(event);start_and_restart_service(\'restart\')" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_restart_service\')" onmouseout="get_tooltip(\'close\')"></i><span class="load_start_and_restart_service" style="display:none;"></span><div class="tooltip_mes_restart_service" style="display:none;">Перезапустить</div></div>';
				}else{
					elem.innerHTML = '<i class="icon_state_service_is_no_work icon-attention"></i><span class="state_service_is_no_work">Сервис не работает</span><div class="tooltip_parent"><i class="bt_start_service icon-play" onclick="stop_propagation(event);start_and_restart_service(\'start\')" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_start_service\')" onmouseout="get_tooltip(\'close\')"></i><span class="load_start_and_restart_service" style="display:none;"></span><div class="tooltip_mes_start_service" style="display:none;">Запустить</div></div>';
					if(act == 'start'){
						alert('Ошибка\n\nНеудалось запустить сервис');
					}else{
						alert('Ошибка\n\nНеудалось перезапустить сервис');
					}
				}
			}
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function start_and_restart_service(act){
	if(act == 'start'){
		document.getElementsByClassName('bt_start_service')[0].style.display = 'none';
	}else{
		document.getElementsByClassName('bt_restart_service')[0].style.display = 'none';
	}
	var elem = document.getElementsByClassName('load_start_and_restart_service')[0];
	elem.style.display = 'block';
	elem.innerHTML = show_animation_load(16, 16, '946c34');
	var data = 'start_and_restart_service=&act='+act;
	postAjax(document.location.href, 'POST', data, response__start_and_restart_service);
}

function response__clear_service_errors_list(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.error){
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function clear_service_errors_list(id){
	if(confirm('Вы действитель хотите очистить лог ошибок errors.log?')){
		var elem = document.getElementById('size_service_errors_list_'+id);
		elem.setAttribute('data', '0');
		elem.innerHTML = '0 kb';
		var data = 'clear_service_errors_list=';
		postAjax(document.location.href, 'POST', data, response__clear_service_errors_list);
	}
}

function response__delete_parsing_errors_list(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.error){
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function delete_parsing_errors_list(id){
	if(confirm('Вы действитель хотите удалить лог ошибок '+id+'?')){
		var elem = document.getElementById('item_errors_list_'+id);
		elem.parentNode.removeChild(elem);
		elem = null;
		var data = 'delete_parsing_errors_list=&id='+id;
		postAjax(document.location.href, 'POST', data, response__delete_parsing_errors_list);
	}
}

function check_data_online(){
	var get_info_bug = 'no';
	/* if(selected_bt_central_panel && ~selected_bt_central_panel.className.indexOf('bt_get_info_bug')){
		get_info_bug = 'yes';
	} */
	var data = 'check_data_online=&data='+encodeURIComponent(selected_bt_auction+'|'+get_info_bug);
	postAjax(document.location.href, 'POST', data, response__check_data_online);
}

function init_check_data_online(){
	if (interval_1 == null) {
		interval_1 = setInterval((function() {
			check_data_online()
		}), 5000);
	}
}

function get_info_bug(){
	set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_get_info_bug')[0]);
	document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel">Ошибки</div><div class="text">Ошибки сервиса:</div><div class="service_errors_list"></div><div class="text">Ошибки парсинга:</div><div class="parsing_errors_list"></div></div>';
	check_data_online()
}

function get_users(){
	set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_get_users')[0]);
	document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel">Пользователи</div><div class="edit_mode_blok_users" style="display:none;"><div class="header_mode_blok">Режим редактирования</div><i class="bt_close_edit_mode_blok icon-cancel" onclick="get_add_user_form(\'close\')"></i></div><div class="add_user_blok"><div class="bt_add_user" onclick="get_add_user_form(\'open\')" style="display:block;"><i class="icon-plus"></i> добавить</div><div class="form_add_user" style="display:none;"><div style="padding-right:10px;"><div class="text">Логин</div><div class="tooltip_parent" style="margin:10px 0px;"><div class="input" style="width:130px;"><input type="text" class="input_add_user_login input" onclick="stop_propagation(event);" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_add_user_login_form\')" onmouseout="get_tooltip(\'close\')" onkeydown="if((arguments[0]||window.event).keyCode==13){add_or_edit_user()}" maxlength="18"></div><div class="tooltip_mes_add_user_login_form" style="display:none;">2 - 18 символов <span style="color:#88867e;">a-zA-Z&nbsp;&nbsp;0-9 _</span></div></div></div><div><div class="text">Пароль</div><div class="tooltip_parent" style="margin:10px 0px;"><div class="input" style="width:130px;"><input type="password" class="input_add_user_password input" onclick="stop_propagation(event);" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_add_user_password_form\')" onmouseout="get_tooltip(\'close\')" onkeydown="if((arguments[0]||window.event).keyCode==13){add_or_edit_user()}" maxlength="50"></div><div class="tooltip_mes_add_user_password_form" style="display:none;">6 - 50 символов <span style="color:#88867e;">a-zA-Z&nbsp;&nbsp;0-9 . _</span></div></div></div><div class="bt_add_and_cancel_user"><i class="bt_save_new_user icon-ok-1" onclick="add_or_edit_user()"></i><span class="load_add_user" style="display:none;margin-bottom:7px;"></span><i class="bt_cancel_add_user icon-cancel" onclick="get_add_user_form(\'close\')"></i></div></div></div><div class="admins_list"></div><div class="users_list"></div></div>';
	get_all_users()
}

function response__get_all_settings(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.response){
		var fragment = document.createDocumentFragment();
		var len = result.response.length;
		for(var i = 0; i < len; i++){
			var country_code = result.response[i]['country_code'];
			var currency = result.response[i]['currency'];
			var auction = result.response[i]['auction'].replace('#', '');
			var is_on_auction = false;
			if(!~result.response[i]['auction'].indexOf('#')){
				is_on_auction = true;
			}
			var time_interval = +result.response[i]['time_interval'];
			var proxy_host = result.response[i]['proxy_host'];
			var proxy_port = result.response[i]['proxy_port'];
			var proxy_username = result.response[i]['proxy_username'];
			var proxy_password = result.response[i]['proxy_password'];
			var proxy = proxy_host+' '+proxy_port+' '+proxy_username+' '+proxy_password;
			if( proxy_host == '' || proxy_port == ''){
				proxy = '';
			}
			var time_interval_text = '';
			switch(time_interval){
				case 300: time_interval_text = '5 минут'; break;
				case 900: time_interval_text = '15 минут'; break;
				case 1800: time_interval_text = '30 минут'; break;
				case 3600: time_interval_text = '1 час'; break;
				case 10800: time_interval_text = '3 часа'; break;
				case 21600: time_interval_text = '6 часов'; break;
				case 43200: time_interval_text = '12 часов'; break;
				case 86400: time_interval_text = '24 часа'; break;
			}
			var result_limit = result.response[i]['result_limit'];
			var elem = document.createElement('div');
			elem.setAttribute('class', 'item_settings');
			elem.innerHTML = '<div class="selected_blok"><div class="text">Аукцион</div><div class="item_settings_auction"><i class="flag-'+country_code+'"></i><span class="item_settings_auction">'+auction+'</span><div class="tooltip_parent"><span class="item_settings_currency" onclick="stop_propagation(event)" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_currency_settings_'+auction+'\')" onmouseout="get_tooltip(\'close\')">'+currency+'</span><div class="tooltip_mes_currency_settings_'+auction+' tooltip_mes_currency_settings" style="display:none;">Валюта</div></div><div class="tooltip_parent"><i id="icon_toggle_on_and_off_'+auction+'" class="'+(!is_on_auction ? 'icon-toggle-off' : 'icon-toggle-on')+'" onclick="stop_propagation(event);set_on_and_off_auction(\''+(!is_on_auction ? 'on' : 'off')+'\', \''+auction+'\')" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_toggle_on_and_off_settings_'+auction+'\')" onmouseout="get_tooltip(\'close\')"></i><div class="tooltip_mes_toggle_on_and_off_settings_'+auction+' tooltip_mes_toggle_on_and_off_settings" style="display:none;">Отключение / включение аукциона</div></div></div></div><div class="selected_blok"><div class="text">Интервал</div><div class="relative"><div class="select_ select_time_interval" onclick="stop_propagation(event);get_drop_down_menu(this);" style="width:120px;" data="'+time_interval+'"><div class="select">'+time_interval_text+'</div><i class="icon_flag_select icon-down-open-mini"></i></div><div class="select_options_overflow options_time_interval layout-cell layout-scrollbar" onclick="insert_data_for_menu(event, this)" style="width:120px;z-index:3;"><div class="option option_time_interval" data="300">5 минут</div><div class="option option_time_interval" data="900">15 минут</div><div class="option option_time_interval" data="1800">30 минут</div><div class="option option_time_interval" data="3600">1 час</div><div class="option option_time_interval" data="10800">3 часа</div><div class="option option_time_interval" data="21600">6 часов</div><div class="option option_time_interval" data="43200">12 часов</div><div class="option option_time_interval" data="86400">24 часа</div></div></div></div><div class="selected_blok"><div class="text">Прокси</div><div class="tooltip_parent"><div class="input" style="width:200px;margin-top:10px;"><input type="text" class="input_auction_proxy_data input" maxlength="50" onclick="stop_propagation(event);" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_proxy_settings_'+auction+'\')" onmouseout="get_tooltip(\'close\')" value="'+proxy+'"></div><div class="tooltip_mes_proxy_settings_'+auction+' tooltip_mes_proxy_settings" style="display:none;">Формат:<br><span style="color:#af8686;">x.x.x.x</span> <span style="color:#ccc3a2;">8888</span> <span style="color:#98d298;">username</span> <span style="color:#88d4c6;">password</span><br><br><span style="color:#af8686;">x.x.x.x</span> - прокси<br><span style="color:#ccc3a2;">8888</span> - порт<br><span style="color:#98d298;">username</span> - логин от прокси<br><span style="color:#88d4c6;">password</span> - пароль от прокси<br><br>username и password - могут отсуствовать если прокси без авторизации<span style="color:#88867e;"></span></div></div></div><div class="selected_blok" style="margin-right:0;"><div class="text">Лимит</div><div class="tooltip_parent"><div class="input" style="width:50px;margin-top:10px;"><input type="text" class="input_auction_result_limit input" maxlength="3" onclick="stop_propagation(event);" onmouseover="stop_propagation(event);get_tooltip(\'open\',\'tooltip_mes_result_limit_'+auction+'\')" onmouseout="get_tooltip(\'close\')" value="'+result_limit+'"></div><div class="tooltip_mes_result_limit_'+auction+' tooltip_mes_result_limit_settings" style="display:none;">Максимальное количество результатов парсинга для этого аукциона за один заход</div></div></div><i class="bt_save_settings icon-ok-1" onclick="save_settings(\''+auction+'\')"></i><span class="load_save_settings" style="display:none;"></span>';
			fragment.appendChild(elem);
		}
		var e = document.getElementsByClassName('auction_settings_list')[0];
		if(e != null){
			e.appendChild(fragment);
		}
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function get_all_settings(){
	var data = 'get_all_settings=';
	postAjax(document.location.href, 'POST', data, response__get_all_settings);
}

function response__set_on_and_off_auction(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.response){
		
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function set_on_and_off_auction(act, auction){
	if(act == 'off'){
		if(confirm('Вы действительно хотите отключить аукцион '+auction+' от парсинга?')){
			var elem = document.getElementById('icon_toggle_on_and_off_'+auction);
			elem.setAttribute('onclick', 'stop_propagation(event);set_on_and_off_auction(\'on\', \''+auction+'\')');
			elem.setAttribute('class', 'icon-toggle-off');
			var data = 'set_on_and_off_auction=&act='+act+'&auction='+encodeURIComponent(auction);
			postAjax(document.location.href, 'POST', data, response__set_on_and_off_auction);
		}
	}else{
		var elem = document.getElementById('icon_toggle_on_and_off_'+auction);
			elem.setAttribute('onclick', 'stop_propagation(event);set_on_and_off_auction(\'off\', \''+auction+'\')');
			elem.setAttribute('class', 'icon-toggle-on');
		var data = 'set_on_and_off_auction=&act='+act+'&auction='+encodeURIComponent(auction);
		postAjax(document.location.href, 'POST', data, response__set_on_and_off_auction);
	}
}

function response__save_settings(res){
	var elem = document.getElementsByClassName('load_save_settings')[0];
	elem.style.display = 'none';
	elem.innerHTML = '';
	document.getElementsByClassName('bt_save_settings')[0].style.display = 'block';
	try{
				var result = JSON.parse(res);
			}catch(e){
				alert('Ошибка\n\n'+res);
				return;
			}
	if (result.error) {
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					case 'FAIL_TIME_INTERVAL':
						alert('Ошибка\n\nИнтервал некорректен');
						break;
					case 'FAIL_PROXY':
						alert('Ошибка\n\nПрокси введен некорректно');
						break;
					case 'FAIL_RESULT_LIMIT':
						alert('Ошибка\n\nЛимит введен некорректно, необходимо целое число от 1 до 999');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function save_settings(auction){
	var time_interval = document.getElementsByClassName('select_time_interval')[0].getAttribute('data');
	var proxy = document.getElementsByClassName('input_auction_proxy_data')[0].value;
	if(proxy !== '' && !~proxy.search(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3} [0-9]{4,5}( [a-zA-Z0-9]{2,} [a-zA-Z0-9]{2,})?$/)){
		alert('Ошибка\n\nПрокси введен некорректно');
		return;
	}
	var result_limit = document.getElementsByClassName('input_auction_result_limit')[0].value;
	result_limit = result_limit.replace(/[^0-9]/g, '');
	if(result_limit){
		result_limit = +result_limit;
	}
	if(result_limit > 999 || result_limit < 1){
		alert('Ошибка\n\nЛимит введен некорректно, необходимо целое число от 1 до 999');
		return;
	}
	document.getElementsByClassName('bt_save_settings')[0].style.display = 'none';
	var elem = document.getElementsByClassName('load_save_settings')[0];
	elem.style.display = 'block';
	elem.innerHTML = show_animation_load(20, 20, '946c34');
	var data = time_interval+'|'+proxy+'|'+result_limit;
	var data = 'save_settings=&data='+encodeURIComponent(data)+'&auction='+encodeURIComponent(auction);
	postAjax(document.location.href, 'POST', data, response__save_settings);
}

function get_settings(){
	set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_get_settings')[0]);
	document.getElementsByClassName('central_panel')[0].innerHTML = '<div class="window_central_panel layout-cell layout-scrollbar"><div class="header_window_central_panel">Настройки</div><div class="state_service_blok middle"></div><div class="group_selected_blok"><div class="auction_settings_list"></div></div>';
	get_all_settings()
}

function get_add_user_form(act){
	var elem = document.getElementsByClassName('bt_add_user')[0];
	var e = document.getElementsByClassName('form_add_user')[0];
	if(act == 'open'){
		elem.style.display = 'none';
		e.style.display = '';
		user_mode_users = 'add';
		document.getElementsByClassName('input_add_user_login')[0].removeAttribute('disabled');
	}else{
		elem.style.display = 'block';
		e.style.display = 'none';
		document.getElementsByClassName('edit_mode_blok_users')[0].style.display = 'none';
		document.getElementsByClassName('input_add_user_login')[0].value = '';
		document.getElementsByClassName('input_add_user_password')[0].value = '';
		document.getElementsByClassName('bt_save_new_user')[0].style.display = 'block';
			var elem = document.getElementsByClassName('load_add_user')[0];
			elem.style.display = 'none';
			elem.innerHTML = '';
	}
}

function response__add_or_edit_user(res){
	document.getElementsByClassName('bt_save_new_user')[0].style.display = 'block';
	var elem = document.getElementsByClassName('load_add_user')[0];
	elem.style.display = 'none';
	elem.innerHTML = '';
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.response){
		get_add_user_form('close');
		var act = result.response['act'];
		var user = result.response['user'];
		if(act == 'add'){
			setTimeout((function(){
				var elem = document.createElement('div');
				elem.setAttribute('id', 'item_users_'+user);
				elem.setAttribute('class', 'item_users_');
				elem.setAttribute('style', 'background:rgba(255, 255, 255, 0.1);');
				elem.innerHTML = '<div class="item_users"><div class="center_middle"><i class="icon-user"></i><span id="item_users_user_'+user+'" class="item_users_user">'+user+'</span><div id="bt_telegram_channels_user_list_'+user+'" class="bt_telegram_channels_user_list" onclick="get_telegram_channels_user_list(\''+user+'\')" style="display:none;"></div><div id="bt_auction_filters_user_list_'+user+'" class="bt_auction_filters_user_list" onclick="get_auction_filters_user_list(\''+user+'\')" style="display:none;"></div></div><span><i class="icon-pencil" onclick="edit_user(\''+user+'\')"></i>&nbsp;&nbsp;&nbsp;<i class="delete_user icon-cancel" onclick="delete_user(\''+user+'\')"></i></span></div><div id="telegram_channels_user_list_'+user+'" class="telegram_channels_user_list" style="display:none;"></div><div id="auction_filters_user_list_'+user+'" class="auction_filters_user_list" style="display:none;"></div>';
				var e = document.getElementsByClassName('users_list')[0];
				e.insertBefore(elem, e.childNodes[0]);
				setTimeout((function(){
					document.getElementById('item_users_'+user).style.background = 'unset';
				}), 2000);
			}), 500)
		}else{
			setTimeout((function(){
				document.getElementById('item_users_user_'+user).innerHTML = user;
				document.getElementById('item_users_'+user).style.background = 'rgba(255, 255, 255, 0.1)';
				setTimeout((function(){
					document.getElementById('item_users_'+user).style.background = 'unset';
				}), 2000);
			}), 500)
		}
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					case 'EXISTS_LOGIN':
						alert('Ошибка\n\nТакой пользователь уже существует');
						break;
					case 'FAIL_PASS':
						alert('Ошибка\n\nПароль некорректен. Необходим от 6 до 50 символов, можно использовать a-zA-Z 0-9 _ .');
						break;
					case 'FAIL_LOGIN':
						alert('Ошибка\n\nЛогин некорректен. Необходим от 2 до 18 символов, можно использовать a-zA-Z 0-9 _');
						break;
					case 'FAIL_LOGIN2':
						alert('Ошибка\n\nНельзя чтобы логин состоял только из знаков подчеркивания');
						break;
					case 'NO_EXISTS_USER':
						alert('Ошибка\n\nПользователь не найден');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function add_or_edit_user(){
	var elem = document.getElementsByClassName('input_add_user_login')[0];
				var user = elem.value.replace(/  +/g, ' ').replace(/ /g, '_').replace(/^_/, '');
				var user = user.replace(/[^a-zA-Z0-9_]/g, '');
				if (user === '') {
					if (elem.value != '') {
						alert('Ошибка\n\nЛогин некорректен. Необходим от 2 до 18 символов, можно использовать a-zA-Z 0-9 _');
					}
					return;
				}
				if (!~user.search(/^[a-zA-Z0-9_]{2,18}$/)) {
					alert('Ошибка\n\nЛогин некорректен. Необходим от 2 до 18 символов, можно использовать a-zA-Z 0-9 _');
					return;
				}
	var elem = document.getElementsByClassName('input_add_user_password')[0];
				var pass = elem.value.replace(/ /g, '');
				var pass = pass.replace(/[^a-zA-Z0-9_\.]/g, '');
				if (!~pass.search(/^[a-zA-Z0-9_\.]{6,50}$/)) {
					alert('Ошибка\n\nПароль некорректен. Необходим от 6 до 50 символов, можно использовать a-zA-Z 0-9 _ .');
					return;
				}
	document.getElementsByClassName('bt_save_new_user')[0].style.display = 'none';
			var elem = document.getElementsByClassName('load_add_user')[0];
			elem.style.display = 'block';
			elem.innerHTML = show_animation_load(20, 20, '946c34');
	var data = 'add_or_edit_user=&act='+user_mode_users+'&user='+encodeURIComponent(user)+'&pass='+encodeURIComponent(pass);
	postAjax(document.location.href, 'POST', data, response__add_or_edit_user);
}

function response__get_all_users(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.response){
		var arr_admins = result.response[0];
		var arr_users = result.response[1];
		for(var item in arr_admins){
			var user = item;
			var elem = document.createElement('div');
			elem.setAttribute('id', 'item_users_'+user);
			elem.setAttribute('class', 'item_users_');
			elem.innerHTML = '<div class="item_users"><div class="center_middle"><i class="icon-crown"></i><span id="item_users_user_'+user+'" class="item_users_user">'+user+'</span><div id="bt_telegram_channels_user_list_'+user+'" class="bt_telegram_channels_user_list" onclick="get_telegram_channels_user_list(\''+user+'\')" style="display:none;"></div><div id="bt_auction_filters_user_list_'+user+'" class="bt_auction_filters_user_list" onclick="get_auction_filters_user_list(\''+user+'\')" style="display:none;"></div></div><span><i class="icon-pencil" onclick="edit_user(\''+user+'\')"></i>&nbsp;&nbsp;&nbsp;<i class="delete_user icon-cancel" onclick="delete_user(\''+user+'\')"></i></span></div><div id="telegram_channels_user_list_'+user+'" class="telegram_channels_user_list" style="display:none;"></div><div id="auction_filters_user_list_'+user+'" class="auction_filters_user_list" style="display:none;"></div>';
			var e = document.getElementsByClassName('admins_list')[0];
			if(e == null){
				return
			}
			e.appendChild(elem);
			if(arr_admins[user]['data'].length == undefined){
				var c = 0;
				var fragment = document.createDocumentFragment();
				for(var i in arr_admins[user]['data']){
					var country_code = i;
					var telegram_channel = arr_admins[user]['data'][i]['telegram_channel'];
					var id_telegram_channel = arr_admins[user]['data'][i]['id_telegram_channel'];
					var access_denial = arr_admins[user]['data'][i]['access_denial'];
					var e = document.createElement('div');
					e.setAttribute('class', 'auction_filters_user_list_');
					e.innerHTML = '<i class="flag-'+country_code+'"></i><span style="padding-left:10px;">'+telegram_channel+'</span>'+(id_telegram_channel == '' ? '<span style="padding-left:10px;color:#3c3c3c;">(не подписан)</span>' : '')+'<i id="access_denial_auction_'+user+'_'+country_code+'" class="'+(access_denial == 'access_denial' ? 'icon-lock-1' : 'icon-lock-open-alt')+'" onclick="lock_and_unlock_auction(\''+(access_denial == 'access_denial' ? 'unlock' : 'lock')+'\', \''+user+'\', \''+country_code+'\')"></i>';
					fragment.appendChild(e);
					c++;
				}
				document.getElementById('telegram_channels_user_list_'+user).appendChild(fragment);
				var elem = document.getElementById('bt_telegram_channels_user_list_'+user);
				elem.style.display = 'block';
				elem.innerHTML = 'телеграм ('+c+')';
			}
			var c = 0;
			var len = arr_admins[user]['auction_filters'].length;
			if(len > 0){
				for(var i = 0; i < len; i++){
					for(var a in arr_admins[user]['auction_filters'][i]){
						var country_code = a;
						var vehicle_type = arr_admins[user]['auction_filters'][i][a]['vehicle_type'];
						if(vehicle_type == 'car'){
							var brand = arr_admins[user]['auction_filters'][i][a]['brand'];
							var model = arr_admins[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_admins[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_admins[user]['auction_filters'][i][a]['price'];
							var type_of_fuel = arr_admins[user]['auction_filters'][i][a]['type_of_fuel'];
							var mileage = arr_admins[user]['auction_filters'][i][a]['mileage'];
							var engine_volume = arr_admins[user]['auction_filters'][i][a]['engine_volume'];
							var view = arr_admins[user]['auction_filters'][i][a]['view'];
							var date = arr_admins[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(engine_volume){
								engine_volume = engine_volume.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							view = view.replace(',', '<br>').replace('new', 'новый').replace('used', 'подержанный');
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_brand">Марка авто<div>'+brand+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_type_of_fuel">Вид топлива<div>'+type_of_fuel+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_engine_volume">Обьем дви. (cm³)<div>'+engine_volume+'</div></div><div class="item_filter_auction_view1">Вид авто<div>'+view+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'truck'){
							var category = arr_admins[user]['auction_filters'][i][a]['category'];
							var model = arr_admins[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_admins[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_admins[user]['auction_filters'][i][a]['price'];
							var mileage = arr_admins[user]['auction_filters'][i][a]['mileage'];
							var wheel_formula = arr_admins[user]['auction_filters'][i][a]['wheel_formula'];
							var axles = arr_admins[user]['auction_filters'][i][a]['axles'];
							var environmental_class = arr_admins[user]['auction_filters'][i][a]['environmental_class'];
							var date = arr_admins[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div>'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div><div class="item_filter_auction_environmental_class1">Эколог. класс<div>'+environmental_class+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'tractor'){
							var category = arr_admins[user]['auction_filters'][i][a]['category'];
							var model = arr_admins[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_admins[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_admins[user]['auction_filters'][i][a]['price'];
							var mileage = arr_admins[user]['auction_filters'][i][a]['mileage'];
							var wheel_formula = arr_admins[user]['auction_filters'][i][a]['wheel_formula'];
							var axles = arr_admins[user]['auction_filters'][i][a]['axles'];
							var environmental_class = arr_admins[user]['auction_filters'][i][a]['environmental_class'];
							var date = arr_admins[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div>'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div><div class="item_filter_auction_environmental_class1">Эколог. класс<div>'+environmental_class+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'semitrailer'){
							var category = arr_admins[user]['auction_filters'][i][a]['category'];
							var model = arr_admins[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_admins[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_admins[user]['auction_filters'][i][a]['price'];
							var axles = arr_admins[user]['auction_filters'][i][a]['axles'];
							var date = arr_admins[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'constructionmachine'){
							var category = arr_admins[user]['auction_filters'][i][a]['category'];
							var model = arr_admins[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_admins[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_admins[user]['auction_filters'][i][a]['price'];
							var date = arr_admins[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div>';
							fragment.appendChild(e);
						}
						c++;
					}
				}
				document.getElementById('auction_filters_user_list_'+user).appendChild(fragment);
				var elem = document.getElementById('bt_auction_filters_user_list_'+user);
				elem.style.display = 'block';
				elem.innerHTML = 'профили ('+c+')';
			}
		}
		for(var item in arr_users){
			var user = item;
			var elem = document.createElement('div');
			elem.setAttribute('id', 'item_users_'+user);
			elem.setAttribute('class', 'item_users_');
			elem.innerHTML = '<div class="item_users"><div class="center_middle"><i class="icon-user"></i><span id="item_users_user_'+user+'" class="item_users_user">'+user+'</span><div id="bt_telegram_channels_user_list_'+user+'" class="bt_telegram_channels_user_list" onclick="get_telegram_channels_user_list(\''+user+'\')" style="display:none;"></div><div id="bt_auction_filters_user_list_'+user+'" class="bt_auction_filters_user_list" onclick="get_auction_filters_user_list(\''+user+'\')" style="display:none;"></div></div><span><i class="icon-pencil" onclick="edit_user(\''+user+'\')"></i>&nbsp;&nbsp;&nbsp;<i class="delete_user icon-cancel" onclick="delete_user(\''+user+'\')"></i></span></div><div id="telegram_channels_user_list_'+user+'" class="telegram_channels_user_list" style="display:none;"></div><div id="auction_filters_user_list_'+user+'" class="auction_filters_user_list" style="display:none;"></div>';
			var e  = document.getElementsByClassName('users_list')[0];
			if(e == null){
				return
			}
			e.appendChild(elem);
			if(arr_users[user]['data'].length == undefined){
				var c = 0;
				var fragment = document.createDocumentFragment();
				for(var i in arr_users[user]['data']){
					var country_code = i;
					var telegram_channel = arr_users[user]['data'][i]['telegram_channel'];
					var id_telegram_channel = arr_users[user]['data'][i]['id_telegram_channel'];
					var access_denial = arr_users[user]['data'][i]['access_denial'];
					var e = document.createElement('div');
					e.setAttribute('class', 'auction_filters_user_list_');
					e.innerHTML = '<i class="flag-'+country_code+'"></i><span style="padding-left:10px;">'+telegram_channel+'</span>'+(id_telegram_channel == '' ? '<span style="padding-left:10px;color:#3c3c3c;">(не подписан)</span>' : '')+'<i id="access_denial_auction_'+user+'_'+country_code+'" class="'+(access_denial == 'access_denial' ? 'icon-lock-1' : 'icon-lock-open-alt')+'" onclick="lock_and_unlock_auction(\''+(access_denial == 'access_denial' ? 'unlock' : 'lock')+'\', \''+user+'\', \''+country_code+'\')"></i>';
					fragment.appendChild(e);
					c++;
				}
				document.getElementById('telegram_channels_user_list_'+user).appendChild(fragment);
				var elem = document.getElementById('bt_telegram_channels_user_list_'+user);
				elem.style.display = 'block';
				elem.innerHTML = 'телеграм ('+c+')';
			}
			var c = 0;
			var len = arr_users[user]['auction_filters'].length;
			if(len > 0){
				for(var i = 0; i < len; i++){
					for(var a in arr_users[user]['auction_filters'][i]){
						var country_code = a;
						var vehicle_type = arr_users[user]['auction_filters'][i][a]['vehicle_type'];
						if(vehicle_type == 'car'){
							var brand = arr_users[user]['auction_filters'][i][a]['brand'];
							var model = arr_users[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_users[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_users[user]['auction_filters'][i][a]['price'];
							var type_of_fuel = arr_users[user]['auction_filters'][i][a]['type_of_fuel'];
							var mileage = arr_users[user]['auction_filters'][i][a]['mileage'];
							var engine_volume = arr_users[user]['auction_filters'][i][a]['engine_volume'];
							var view = arr_users[user]['auction_filters'][i][a]['view'];
							var date = arr_users[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(engine_volume){
								engine_volume = engine_volume.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							view = view.replace(',', '<br>').replace('new', 'новый').replace('used', 'подержанный');
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_brand">Марка авто<div>'+brand+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_type_of_fuel">Вид топлива<div>'+type_of_fuel+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_engine_volume">Обьем дви. (cm³)<div>'+engine_volume+'</div></div><div class="item_filter_auction_view1">Вид авто<div>'+view+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'truck'){
							var category = arr_users[user]['auction_filters'][i][a]['category'];
							var model = arr_users[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_users[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_users[user]['auction_filters'][i][a]['price'];
							var mileage = arr_users[user]['auction_filters'][i][a]['mileage'];
							var wheel_formula = arr_users[user]['auction_filters'][i][a]['wheel_formula'];
							var axles = arr_users[user]['auction_filters'][i][a]['axles'];
							var environmental_class = arr_users[user]['auction_filters'][i][a]['environmental_class'];
							var date = arr_users[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div>'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div><div class="item_filter_auction_environmental_class1">Эколог. класс<div>'+environmental_class+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'tractor'){
							var category = arr_users[user]['auction_filters'][i][a]['category'];
							var model = arr_users[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_users[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_users[user]['auction_filters'][i][a]['price'];
							var mileage = arr_users[user]['auction_filters'][i][a]['mileage'];
							var wheel_formula = arr_users[user]['auction_filters'][i][a]['wheel_formula'];
							var axles = arr_users[user]['auction_filters'][i][a]['axles'];
							var environmental_class = arr_users[user]['auction_filters'][i][a]['environmental_class'];
							var date = arr_users[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(mileage){
								mileage = mileage.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_mileage">Пробег (km.)<div>'+mileage+'</div></div><div class="item_filter_auction_wheel_formula">Колес. формула<div>'+wheel_formula+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div><div class="item_filter_auction_environmental_class1">Эколог. класс<div>'+environmental_class+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'semitrailer'){
							var category = arr_users[user]['auction_filters'][i][a]['category'];
							var model = arr_users[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_users[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_users[user]['auction_filters'][i][a]['price'];
							var axles = arr_users[user]['auction_filters'][i][a]['axles'];
							var date = arr_users[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div><div class="item_filter_auction_axles">Оси<div>'+axles+'</div></div>';
							fragment.appendChild(e);
						}
						else if(vehicle_type == 'constructionmachine'){
							var category = arr_users[user]['auction_filters'][i][a]['category'];
							var model = arr_users[user]['auction_filters'][i][a]['model'];
							var years_of_release = arr_users[user]['auction_filters'][i][a]['years_of_release'];
							var price = arr_users[user]['auction_filters'][i][a]['price'];
							var date = arr_users[user]['auction_filters'][i][a]['date'];
							if(price){
								price = price.replace(/^([0-9]+)/, 'от $1').replace(/:([0-9]+)/, '<br>до $1').replace(/:$/ ,'');
							}
							if(years_of_release){
								years_of_release = years_of_release.replace(/^([0-9]+)/, 'с $1').replace(/:([0-9]+)/, '<br>по $1').replace(/:$/ ,'');
							}
							var e = document.createElement('div');
							e.setAttribute('class', 'group_item_filter_auction');
							e.innerHTML = '<div class="item_filter_auction_country_code"><i class="flag-'+country_code+'"></i></div><div class="item_filter_auction_date">Дата<div>'+date+'</div></div><div class="item_filter_auction_category">Категория<div>'+category+'</div></div><div class="item_filter_auction_model">Модель<div>'+model+'</div></div><div class="item_filter_auction_price">Цена (€)<div>'+price+'</div></div><div class="item_filter_auction_years_of_release">Год выпуска<div>'+years_of_release+'</div></div>';
							fragment.appendChild(e);
						}
						c++;
					}
				}
				document.getElementById('auction_filters_user_list_'+user).appendChild(fragment);
				var elem = document.getElementById('bt_auction_filters_user_list_'+user);
				elem.style.display = 'block';
				elem.innerHTML = 'профили ('+c+')';
			}
		}
	}else{
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function get_telegram_channels_user_list(user){
	var elem = document.getElementById('telegram_channels_user_list_'+user);
	if(elem.style.display != 'block'){
		elem.style.display = 'block';
		document.getElementById('auction_filters_user_list_'+user).style.display = 'none';
	}else{
		elem.style.display = 'none';
	}
}

function get_auction_filters_user_list(user){
	var elem = document.getElementById('auction_filters_user_list_'+user);
	if(elem.style.display != 'block'){
		elem.style.display = 'block';
		document.getElementById('telegram_channels_user_list_'+user).style.display = 'none';
	}else{
		elem.style.display = 'none';
	}
}

function response__delete_user(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.error){
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					case 'NO_EXISTS_USER':
						alert('Ошибка\n\nПользователь не найден');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function delete_user(user){
	if(confirm('Вы действительно хотите удалить '+user+'?')){
		var elem = document.getElementById('item_users_'+user);
		if(elem != null){
			elem.parentNode.removeChild(elem);
			elem = null;
		}
		var data = 'delete_user=&user='+encodeURIComponent(user);
		postAjax(document.location.href, 'POST', data, response__delete_user);
	}
}

function edit_user(user){
	get_add_user_form('open');
	var elem = document.getElementsByClassName('input_add_user_login')[0];
	elem.setAttribute('disabled', 'true');
	elem.value = user;
	user_mode_users = 'edit';
	document.getElementsByClassName('window_central_panel')[0].scrollTop = 0;
	setTimeout((function(){
		document.getElementsByClassName('edit_mode_blok_users')[0].style.display = ''; 
	}), 500);
}

function response__lock_and_unlock_auction(res){
	try{
		var result = JSON.parse(res);
	}catch(e){
		alert('Ошибка\n\n'+res);
		return;
	}
	if(result.error){
		switch (result.error) {
					case 'FAIL_AUTH':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nНекорректная авторизация, перезаходим...');
						document.location.reload();
						break;
					case 'NO_EXISTS_LOGIN':
						cookie.delete('id_auth=');
						alert('Ошибка\n\nВаш аккаунт не найден, перезаходим...');
						document.location.reload();
						break;
					case 'ACCESS_IS_DENIED':
						alert('Ошибка\n\nДоступ запрещен. Вы неможете выполнять это действие');
						break;
					case 'NO_EXISTS_USER':
						alert('Ошибка\n\nПользователь не найден');
						break;
					default:
						if(result.error){
							alert('Ошибка\n\n'+result.error);
						}
					break;
				}
	}
}

function lock_and_unlock_auction(act, user, country_code){
	var country_name;
	switch(country_code){
		case 'de': country_name = 'Германии'; break;
		case 'us': country_name = 'США'; break;
		case 'kr': country_name = 'Кореи'; break;
	}
	if(act == 'lock'){
		if(confirm('Вы действительно хотите заблокировать доступ пользователя '+user+' для аукционов из '+country_name+'?')){
			var elem = document.getElementById('access_denial_auction_'+user+'_'+country_code);
			elem.setAttribute('onclick', 'lock_and_unlock_auction(\'unlock\', \''+user+'\', \''+country_code+'\')');
			elem.setAttribute('class', 'icon-lock-1');
			var data = 'lock_and_unlock_auction=&act='+act+'&user='+encodeURIComponent(user)+'&country_code='+country_code;
			postAjax(document.location.href, 'POST', data, response__lock_and_unlock_auction);
		}
	}else{
		var elem = document.getElementById('access_denial_auction_'+user+'_'+country_code);
		elem.setAttribute('onclick', 'lock_and_unlock_auction(\'lock\', \''+user+'\', \''+country_code+'\')');
		elem.setAttribute('class', 'icon-lock-open-alt');
		var data = 'lock_and_unlock_auction=&act='+act+'&user='+encodeURIComponent(user)+'&country_code='+country_code;
		postAjax(document.location.href, 'POST', data, response__lock_and_unlock_auction);
	}
}

function get_all_users(){
	var data = 'get_all_users=';
	postAjax(document.location.href, 'POST', data, response__get_all_users);
}

function onclick_to_page(){
	get_auction_options_window('close');
	if (class_open_tooltip) {
		var elem = document.getElementsByClassName(class_open_tooltip)[0];
		if (elem != null) {
			elem.style.display = 'none';
		}
	}
	var elems = document.getElementsByClassName('icon_flag_select');
	var len = elems.length;
	for (var i = 0; i < len; i++) {
		elems[i].classList.remove('icon-up-open-mini');
		elems[i].classList.add('icon-down-open-mini');
	}
	var elems = document.getElementsByClassName('select_options_overflow');
	var len = elems.length;
	for (var i = 0; i < len; i++) {
		elems[i].classList.remove('elem_visible');
	}
}

document.addEventListener('DOMContentLoaded', function(){
	
	var root = document.documentElement;
	if(!!root.style.setProperty){
		if(window.innerHeight > 580){
			var h  = window.innerHeight;
		}else{
			var h = 580;
		}
		root.style.setProperty('--window_height', h + 'px');
		root.style.setProperty('--window_height_edit_filters', (h - 20) + 'px');
		window.addEventListener('scroll', function () {
			if(window.innerHeight > 580){
			var h  = window.innerHeight;
			}else{
				var h = 580;
			}
			root.style.setProperty('--window_height', h + 'px');
			root.style.setProperty('--window_height_edit_filters', (h - 20) + 'px');
		});
		window.addEventListener('resize', function () {
			if(window.innerHeight > 580){
			var h  = window.innerHeight;
			}else{
				var h = 580;
			}
			root.style.setProperty('--window_height', h + 'px');
			root.style.setProperty('--window_height_edit_filters', (h - 20) + 'px');
		});
	}
	
	var elem = document.getElementsByClassName('main_blok')[0];
	if(elem != null){
		elem.onclick = function(){
			onclick_to_page()
		};
	}
	
	var elem = document.getElementsByClassName('bt_select_auction')[0];
	if(elem != null){
		elem.onclick = function(){
			stop_propagation(event);
			get_auction_options_window('open')
		};
	}
	
	var elem = document.getElementsByClassName('bt_auction_de')[0];
	if(elem != null){
		elem.onclick = function(){
			stop_propagation(event);
			show_edit_auction('de')
		};
	}
	
	var elem = document.getElementsByClassName('bt_auction_us')[0];
	if(elem != null){
		elem.onclick = function(){
			stop_propagation(event);
			show_edit_auction('us')
		};
	}
	
	var elem = document.getElementsByClassName('bt_auction_kr')[0];
	if(elem != null){
		elem.onclick = function(){
			stop_propagation(event);
			show_edit_auction('kr')
		};
	}
	
	var elem = document.getElementsByClassName('bt_get_info_bug')[0];
	if(elem != null){
		elem.onclick = function(event){
			get_info_bug()
		};
	}
	
	var elem = document.getElementsByClassName('bt_get_users')[0];
	if(elem != null){
		elem.onclick = function(event){
			get_users();
		};
	}
	
	var elem = document.getElementsByClassName('bt_get_settings')[0];
	if(elem != null){
		elem.onclick = function(event){
			get_settings();
			check_data_online()
		};
	}
	
	var elem = document.getElementsByClassName('bt_logout')[0];
	if(elem != null){
		elem.onclick = function(){
			logout()
		};
	}
	
	var elem = document.getElementsByClassName('bt_select_support')[0];
	if(elem != null){
		elem.onclick = function(){
			setTimeout((function(){
				document.location.href = 'https://t.me/ATATsupport';
			}), 200)
			set_active_bt_and_set_default_variable(document.getElementsByClassName('bt_select_support')[0]);
		};
	}
	
	if(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
			device = 'no comp';
		}
	
	init_check_data_online();
	
});
