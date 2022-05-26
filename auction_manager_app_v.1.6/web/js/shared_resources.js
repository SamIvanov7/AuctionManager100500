var selected_bt_auction = '',
last_id_edit_filter_auction = '',
id_edit_filter_auction = '',
user_mode_filter_auction = 'add',
user_mode_users = 'add',
class_open_tooltip = '',
selected_tab = 'car',
device = 'comp',
auction_number = 1,
is_windows_phone = ~navigator.userAgent.indexOf('Windows Phone'),
is_ios = !window.MSStream && ~navigator.userAgent.search(/iPad|iPhone|iPod/i),
timeout_1 = null,
interval_1 = null,
selected_bt_left_panel = null,
ids_delete_filter_auction = [],
auction_numbers = {
'de':{
1:'mobile.de'
},
'us':{
1:'copart.com',
2:'iaai.com'
}
},
cookie = {
	get: function(cookie_name) {
		var result = document.cookie.match('(^|;) ?'+cookie_name+'=([^;]*)(;|$)');
		if (result) {
			return (unescape(result[2]));
		} else {
			return null;
		}
	},
	set: function(data, time, i) {
		var dt = new Date();
		switch (i) {
			case 's':
				dt.setSeconds(time+dt.getSeconds());
				break;
			case 'h':
				dt.setHours(time+dt.getHours());
				break;
			case 'd':
				dt.setDate(time+dt.getDate());
				break;
		}
		document.cookie = data+'; path=/;'+(time ? ' expires='+dt.toGMTString() : '');
	},
	delete: function(data) {
		document.cookie = data+'; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
	}
};

function postAjax(loc, method, data, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open(method, loc, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp != null) {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					clearTimeout(timeout_1);
					if(callback){
						callback(xmlhttp.responseText);
					}
					xmlhttp = null;
				} else if (xmlhttp.status == 403) {
					document.location.reload();
				} else if (xmlhttp.status == 404) {
					alert('Ошибка\n\n404');
				}
			}
		}
	};
	xmlhttp.send(data);
	clearTimeout(timeout_1);
	timeout_1 = setTimeout((function() {
		alert('Ошибка\n\nСервер не отвечает');
	}), 15000);
}

function show_animation_load(width, height, color){
	return '<svg style="display:block;" width="'+width+'px" height="'+height+'px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><circle cx="50" cy="50" r="40" stroke="#'+color+'" fill="none" stroke-width="12" stroke-linecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate><animate attributeName="stroke-dashoffset" dur="1.5s" repeatCount="indefinite" from="502" to="0"></animate></circle></svg>';
}

function get_drop_down_menu(elem, act){
	function a(act, elem){
		var len = elem.childNodes.length;
		for(var i = 0; i < len; i++){
			if(elem.childNodes[i].nodeName != '#text' && ~elem.childNodes[i].getAttribute('class').indexOf('icon_flag_select')){
				if(act == 'open'){
					elem.childNodes[i].classList.remove('icon-down-open-mini');
					elem.childNodes[i].classList.add('icon-up-open-mini');
				}else{
					elem.childNodes[i].classList.remove('icon-up-open-mini');
					elem.childNodes[i].classList.add('icon-down-open-mini');
				}
				break;
			}
		}
	}
	if(!act && !~elem.nextElementSibling.getAttribute('class').indexOf('elem_visible')){
		elem.nextElementSibling.classList.add('elem_visible');
		a('open', elem)
	}else{
		elem.nextElementSibling.classList.remove('elem_visible');
		a('close', elem)
	}
}

function insert_data_for_menu(event, elem, callback){
	var e = event.target;
	var elem = elem.previousElementSibling;
	elem.setAttribute('data', e.getAttribute('data'));
	var len = elem.childNodes.length;
	for(var i = 0; i < len; i++){
		if(elem.childNodes[i].nodeName != '#text' && ~elem.childNodes[i].getAttribute('class').indexOf('select')){
			elem.childNodes[i].innerHTML = e.innerHTML;
			if(callback){
				callback()
			}
			break;
		}
	}
}

function stop_propagation(event){
	if(event && event.stopPropagation) event.stopPropagation();
}

function prevent_default(event){
	if(event && event.preventDefault) event.preventDefault();
}

function get_tooltip(act, elem){
	if (act == 'open') {
		if (class_open_tooltip) {
			var e = document.getElementsByClassName(class_open_tooltip)[0];
			if (class_open_tooltip != elem && e != null) {
				e.style.display = 'none';
			}
		}
		var e = document.getElementsByClassName(elem)[0];
		if (e != null ) {
			e.style.display = 'block';
		}
		class_open_tooltip = elem;
	} else {
		if (!is_windows_phone) {
			var e = document.getElementsByClassName(class_open_tooltip)[0];
			if (e != null) {
				e.style.display = 'none';
			}
		}
	}
}
