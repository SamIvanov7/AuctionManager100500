function response__post_auth(res){
	document.getElementsByClassName('bt_post_auth')[0].innerHTML = 'Войти';
			try{
				var result = JSON.parse(res);
			}catch(e){
				alert('Ошибка\n\n'+res);
				return;
			}
			if (result.response) {
				var login = result.response[0];
				var uid = result.response[1];
				var id_auth = result.response[2];
				cookie.set('login='+encodeURIComponent(login), 365, 'd');
				cookie.set('uid='+uid, 90, 'd');
				cookie.set('id_auth='+id_auth, 365, 'd');
				setTimeout((function(){
						document.location.replace('/')
					}),1000)
			} else {
				switch (result.error) {
					case 'FAIL_PASS':
						alert('Ошибка\n\nПароль некорректен. Необходим от 6 до 50 символов, можно использовать a-zA-Z 0-9 _ .');
						break;
					case 'WRONG_PASSWORD':
						alert('Ошибка\n\nПароль не верный');
						break;
					case 'NO_EXISTS_LOGIN':
						alert('Ошибка\n\nТакой логин не найден');
						break;
				}
				document.getElementsByClassName('auth_captcha_code')[0].innerHTML = '<img src="/captcha.php?loc=1&'+Math.random()+'">';
				document.getElementsByClassName('auth_captcha')[0].value = '';
			}
}

function post_auth(){
		var elem = document.getElementsByClassName('auth_login')[0];
				var login = elem.value.replace(/  +/g, ' ').replace(/ /g, '_').replace(/^_/, '');
				var login = login.replace(/[^a-zA-Z0-9_]/g, '');
				if (login === '') {
					if (elem.value != '') {
						alert('Ошибка\n\nЛогин некорректен. Необходим от 1 до 18 символов, можно использовать a-zA-Z  0-9 и пробел');
					}
					return;
				}
				if (!~login.search(/^[a-zA-Z0-9_]{1,18}$/)) {
					alert('Ошибка\n\nЛогин некорректен. Необходим от 1 до 18 символов, можно использовать a-zA-Z 0-9 и пробел');
					return;
				}
		var elem = document.getElementsByClassName('auth_pass')[0];
				var pass = elem.value.replace(/ /g, '');
					var pass = pass.replace(/[^a-zA-Z0-9_\.]/g, '');
					if (!~pass.search(/^[a-zA-Z0-9_\.]{6,50}$/)) {
						alert('Ошибка\n\nПароль некорректен. Необходим от 6 до 50 символов, можно использовать a-zA-Z 0-9 _ .');
						return;
					}
		var captcha = document.getElementsByClassName('auth_captcha')[0].value;
		if(captcha == ''){
			alert('Ошибка\n\nНеобходимо ввести код с картинки');
			return;
		}
		document.getElementsByClassName('bt_post_auth')[0].innerHTML = show_animation_load(20, 20, '1d1d1d');
		var data = 'post_auth=&login='+encodeURIComponent(login)+'&pass='+encodeURIComponent(pass)+'&captcha='+encodeURIComponent(captcha);
		postAjax(document.location.href, 'POST', data, response__post_auth);
}

document.addEventListener('DOMContentLoaded', function(){
		
	var elem = document.getElementsByClassName('bt_post_auth')[0];
	if(elem != null){
		elem.onclick = function(){
			post_auth()
		};
	}

	var elem = document.getElementsByClassName('auth_login')[0];
	if(elem != null){
		elem.onkeydown = function(){
			if((arguments[0]||window.event).keyCode==13){
				post_auth()
			}
		};
	}
	
	var elem = document.getElementsByClassName('auth_pass')[0];
	if(elem != null){
		elem.onkeydown = function(){
			if((arguments[0]||window.event).keyCode==13){
				post_auth()
			}
		};
	}

	var elem = document.getElementsByClassName('auth_captcha')[0];
	if(elem != null){
		elem.onkeydown = function(){
			if((arguments[0]||window.event).keyCode==13){
				post_auth()
			}
		};
	}

});
