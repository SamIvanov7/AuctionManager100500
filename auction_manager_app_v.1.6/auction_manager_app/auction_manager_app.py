import os
import re
import sys
import time
import requests
from requests.auth import HTTPProxyAuth
import datetime
import traceback
import threading
import hashlib
import math
import copy
import subprocess


daemon_pid = '/var/run/auction_manager_app.pid'
install_dir = '/usr/local/auction_manager_app'
telegram_token = ''
if sys.platform == 'win32':
	python_eol = '\n'
else:
	python_eol = '\r\n'
default_http_headers = {
'Connection':'keep-alive',
'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
'Accept-Language':'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
}
edit_app = {
'requests_timeout': 30.0
}
country_code_and_unicode = {
'de':'\U0001F1E9\U0001F1EA', 
'kr':'\U0001F1F0\U0001F1F7', 
'us':'\U0001F1FA\U0001F1F8'
}
auction_numbers = {
'mobile.de':1, 
'copart.com':1, 
'iaai.com':2
}
sites_auction = {}
sites_search_vin = {}
parsing_sites_condition = {}
final_result = {}
hashes_results = {}
auction_filters = {
'de':{
1:{
'car':{
'brands':{}, 
'models':{}, 
'type_of_fuel':{}, 
'prices':[], 
'years_of_release':[], 
'mileage':[]
},
'truck':{
'categories':{},
'models':{},
'prices':[],
'mileage':[],
'years_of_release':[],
'wheel_formula':[],
'axles':{},
'environmental_class':[]
},
'tractor':{
'categories':{},
'models':{},
'prices':[],
'mileage':[],
'years_of_release':[],
'wheel_formula':[],
'axles':{},
'environmental_class':[]
},
'semitrailer':{
'categories':{},
'models':{},
'prices':[],
'years_of_release':[],
'axles':{}
},
'constructionmachine':{
'categories':{},
'models':{},
'prices':[],
'years_of_release':[]
},
},},
'us':{
1:{
'car':{
'brands':{}, 
'models':{}, 
'type_of_fuel':{}, 
'years_of_release':[], 
'damage':{}
},
},
2:{
'car':{
'brands':{}, 
'models':{}, 
'type_of_fuel':{}, 
'years_of_release':[], 
'damage':{}
},
},},
}
course = {'eur':0.0, 'usd':0.0}
browser_tabs = {'copart.com':{'tab':None, 'time':0}, 'iaai.com':{'tab':None, 'time':0}, 'autoastat.com':{'tab':None, 'time':0}, 'autoauctions.io':{'tab':None, 'time':0}}
cache_of_vin_codes = {}
user_filters = []
users_and_telegram_channel = []
telegram_channels_distribution_of_final_results = []
abort_distribution_ids = []
is_not_selenium = False
driver = None
lock_1 = threading.RLock()
lock_2 = threading.RLock()
lock_3 = threading.RLock()
lock_4 = threading.RLock()
lock_5 = threading.RLock()
lock_6 = threading.RLock()
lock_7 = threading.RLock()
lock_8 = threading.RLock()
lock_9 = threading.RLock()
lock_10 = threading.RLock()
lock_11 = threading.RLock()
lock_12 = threading.RLock()
lock_13 = threading.RLock()
lock_14 = threading.RLock()
lock_15 = threading.RLock()

class color_print:
	@staticmethod
	def print_fail(message):
		sys.stderr.write('\x1b[1;31m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_pass(message):
		sys.stdout.write('\x1b[1;32m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_warn(message):
		sys.stderr.write('\x1b[1;33m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_info(message):
		sys.stdout.write('\x1b[1;34m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_bold(message):
		sys.stdout.write('\x1b[1;37m'+message.strip()+'\x1b[0m'+'\n')

try:

	import telebot # pip3 install pytelegrambotapi
	from daemon import daemon
	
	from selenium import webdriver # pip3 install selenium

except Exception:
	color_print.print_fail(traceback.format_exc().strip())
	sys.exit(1)

def log_event1(mes):

	date = datetime.datetime.now().strftime("%d-%m-%Y %H:%M:%S")
	mes = date+' '+mes + python_eol

	with open(install_dir+'/events1.log', 'a+', encoding = 'utf-8') as f:
		f.write(mes)

def log_error(mes):

	date = datetime.datetime.now().strftime("%d-%m-%Y %H:%M:%S")
	mes = date+' '+mes + python_eol+ '----------------------------------------------------------------------------------------' + python_eol
	
	with open(install_dir+'/errors.log', 'a+', encoding = 'utf-8') as f:
		f.write(mes)
	
	with open(install_dir+'/new_errors', 'a+', encoding = 'utf-8') as f:
		f.write('errors.log'+python_eol)

def log_error_parse(mes, site):

	date = datetime.datetime.now().strftime("%d-%m-%Y %H:%M:%S")
	mes = date+' '+mes + python_eol+'----------------------------------------------------------------------------------------' + python_eol
	
	#mes = htmlspecialchars(mes)
	
	with open(install_dir+'/log_error_parse/errors_parse__['+site+'].log', 'a+', encoding = 'utf-8') as f:
		f.write(mes)
	
	with open(install_dir+'/new_errors', 'a+', encoding = 'utf-8') as f:
		f.write('errors_parse__['+site+'].log'+python_eol)

def log_error_auth(mes, site):

	date = datetime.datetime.now().strftime("%d-%m-%Y %H:%M:%S")
	mes = date+' '+mes + python_eol+ '----------------------------------------------------------------------------------------' + python_eol
	
	with open(install_dir+'/log_error_auth/errors_auth__['+site+'].log', 'a+', encoding = 'utf-8') as f:
		f.write(mes)
	
	with open(install_dir+'/new_errors', 'a+', encoding = 'utf-8') as f:
		f.write('errors_auth__['+site+'].log'+python_eol)

def check_reload_conf():
	
	global abort_distribution_ids
	
	try:
		
		while True:
			
			if os.path.isfile(install_dir+'/reload_user_conf'):
				os.remove(install_dir+'/reload_user_conf')
				parse_user_data()
				
			if os.path.isfile(install_dir+'/abort_distribution_ids'):
			
				lines = []
				listt = []
				
				with open(install_dir+'/abort_distribution_ids', 'r', encoding = 'utf-8') as f:
					lines = f.readlines()
			
				lock_8.acquire()
				try:
					for i in lines:
						item = i.strip()
						if not item in abort_distribution_ids:
							listt.append(item)
					abort_distribution_ids += listt
				finally:
					lock_8.release()
			
				os.remove(install_dir+'/abort_distribution_ids')
			
			if os.path.isfile(install_dir+'/reload_admin_conf'):
				os.remove(install_dir+'/reload_admin_conf')
				parse_sites_conf('reload')
			
			time.sleep(1)
			
	except Exception:
			
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_check_reload_conf, args = ()).start()

def restart_check_reload_conf():
	time.sleep(5)
	threading.Thread(target = check_reload_conf, args = ()).start()

def parse_user_data():
	
	global user_filters, users_and_telegram_channel
		
	try:
	
		list1 = []
		list2 = []
		
		path, dirs, files = next(os.walk(install_dir+'/user_filters'))

		for item in files:
		
			username = item
			lines = []
			with open(path+'/'+username, 'r', encoding = 'utf-8') as f:
				lines = f.readlines()
			
			if len(lines) > 0:
			
				for i in lines:
					ex = re.split(r'\|', i.strip())
					auction_number = int(ex[len(ex) - 1])
					
					if ex[0] == 'de':
					
						if ex[1] == 'car':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'brand':ex[2], 'model':ex[3], 'years_of_release':ex[6], 'price':ex[5], 'type_of_fuel':ex[4], 'mileage':ex[7], 'engine_volume':ex[8], 'view':ex[9], 'id':ex[11], 'auction_number':auction_number})
						elif ex[1] == 'truck':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'category':ex[2], 'model':ex[3], 'years_of_release':ex[6], 'mileage':ex[5], 'price':ex[4], 'wheel_formula':ex[7], 'axles':ex[8], 'environmental_class':ex[9], 'id':ex[11], 'auction_number':auction_number})
						elif ex[1] == 'tractor':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'category':ex[2], 'model':ex[3], 'years_of_release':ex[6], 'mileage':ex[5], 'price':ex[4], 'wheel_formula':ex[7], 'axles':ex[8], 'environmental_class':ex[9], 'id':ex[11], 'auction_number':auction_number})
						elif ex[1] == 'semitrailer':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'category':ex[2], 'model':ex[3], 'years_of_release':ex[5], 'price':ex[4], 'axles':ex[6], 'id':ex[8], 'auction_number':auction_number})
						elif ex[1] == 'constructionmachine':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'category':ex[2], 'model':ex[3], 'years_of_release':ex[5], 'price':ex[4], 'id':ex[7], 'auction_number':auction_number})
							
					elif ex[0] == 'us':
					
						if ex[1] == 'car':
							list1.append({'username':username, 'country_code':ex[0], 'vehicle_type':ex[1], 'brand':ex[2], 'model':ex[3], 'type_of_fuel':ex[4], 'years_of_release':ex[5], 'mileage':ex[6], 'damage':ex[7], 'buy_it_now':ex[8], 'the_date_of_the':ex[9], 'id':ex[11], 'auction_number':auction_number})

		lock_9.acquire()
		try:
			user_filters = list1
		finally:
			lock_9.release()		
		
		list1 = []

		path, dirs, files = next(os.walk(install_dir+'/users'))
		
		for item in files:
			
			username = item
			
			lines = []
			telegram_channels = []
			with open(path+'/'+username, 'r', encoding = 'utf-8') as f:
				lines = f.readlines()
			lenn = len(lines)
			
			for i in range(lenn):
				if i > 2:
					ex = re.split(r'^\|([a-z]{2})\|([^\|]+)?\|([0-9\-]+)?\|(access_denial)?\|$', lines[i].strip())
					if len(ex) > 4:
						country_code = ex[1]
						if ex[2] != None:
							telegram_channel = ex[2]
						else:
							telegram_channel = ''
						if ex[3] != None:
							id_telegram_channel = ex[3]
						else:
							id_telegram_channel = ''
						if ex[4] != None:
							is_access_denial = ex[4]
						else:
							is_access_denial = ''
						telegram_channels.append({'country_code':country_code, 'telegram_channel':telegram_channel, 'id_telegram_channel':id_telegram_channel, 'is_access_denial':is_access_denial})
			if len(telegram_channels) > 0:
				list2.append({'username':username, 'telegram_channels':telegram_channels})

		lock_10.acquire()
		try:
			users_and_telegram_channel = list2
		finally:
			lock_10.release()		
		
		list2 = []

	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def distribution_of_results_for_telegram(forward_from_chat_id):
	
	global final_result, telegram_channels_distribution_of_final_results, abort_distribution_ids
	
	try:
	
		try:
			
			bot = telebot.TeleBot(telegram_token)
			is_subscribe_telegram_channel = False
			hashes = ''
			
			while True:
				
				is_subscribe_telegram_channel = False
				users_and_telegram_channel_ = []

				lock_10.acquire()
				try:
					users_and_telegram_channel_ = copy.deepcopy(users_and_telegram_channel)
				finally:
					lock_10.release()
				
				for item in users_and_telegram_channel_:
						
					for a in item['telegram_channels']:
						if a['id_telegram_channel'] == forward_from_chat_id and a['is_access_denial'] != 'access_denial':
							is_subscribe_telegram_channel = True
							break
						
					if is_subscribe_telegram_channel:
						break
							
				if not is_subscribe_telegram_channel:
					break
				
				if len(final_result[forward_from_chat_id]) > 0:
					
					item = final_result[forward_from_chat_id][0]
					
					unicode_flag = country_code_and_unicode[item['country_code']]
					
					price = item['price']
					if price != '':
						if item['currency'] == 'eur':
							price += ' €'
						else:
							price += ' $'
					else:
						price = 'Цена по запросу'
					
					customs_clearance = ''
					
					if item['customs_clearance']:
						customs_clearance = math.trunc(float(item['customs_clearance']))
						if item['currency'] == 'eur':
							customs_clearance = ' (с растаможкой '+str(int(item['price']) + customs_clearance)+' €)'
						else:
							customs_clearance = ' (с растаможкой '+str(int(item['price']) + customs_clearance)+' $)'
					else:
						customs_clearance = ''
					
					keyboard = telebot.types.InlineKeyboardMarkup()
					keyboard.add(telebot.types.InlineKeyboardButton(text = unicode_flag+' Перейти', url = item['link_to_auction']))
					
					if item['vin_code'] != '':
						keyboard.add(telebot.types.InlineKeyboardButton(text = 'Пробить VIN код (autoastat.com)', callback_data = 'vin_code_autoastat.com_'+item['vin_code']))
						#keyboard.add(telebot.types.InlineKeyboardButton(text = 'Пробить VIN код (autoauctions.io)', callback_data = 'vin_code_autoauctions.io_'+item['vin_code']))

					is_fail_post_to_telegram = False
					
					for i in range(3):
						try:
							bot.send_photo(int(forward_from_chat_id), item['preview_img'], caption = '<u>'+price + customs_clearance+'</u>\n<b>'+item['brands_and_model']+'</b>\n'+item['params'], reply_markup = keyboard, parse_mode = 'HTML')
							is_fail_post_to_telegram = False
							break
						except telebot.apihelper.ApiException as err:
							
							is_fail_post_to_telegram = True

							if 'Error code: 403' in str(err):
								break						
							
							time.sleep(4)
						
					id = item['id']
							
					if id in abort_distribution_ids:
						
						lock_8.acquire()
						try:
							abort_distribution_ids.remove(item['id'])
						finally:
							lock_8.release()
								
						lock_2.acquire()
						try:
							lenn = len(final_result[forward_from_chat_id])
							a = 0
							for i in range(lenn):
								if final_result[forward_from_chat_id][a]['id'] == id:
									del final_result[forward_from_chat_id][a]
								else:
									a += 1
						finally:
							lock_2.release()
							
					else:
						
						if not is_fail_post_to_telegram:
							lock_12.acquire()
							try:
								with open(install_dir+'/hashes_results/'+forward_from_chat_id, 'a+', encoding = 'utf-8') as f:
									f.write(item['hash'] + python_eol)
							finally:
								lock_12.release()
						
						lock_2.acquire()
						try:
							del final_result[forward_from_chat_id][0]
						finally:
							lock_2.release()
						
				else:
					break
						
				time.sleep(4.5)
			
			bot.stop_bot()
			
			if not is_subscribe_telegram_channel:
				lock_2.acquire()
				try:
					final_result.pop(forward_from_chat_id)
				finally:
					lock_2.release()
					
			lock_7.acquire()
			try:
				telegram_channels_distribution_of_final_results.remove(forward_from_chat_id)
			finally:
				lock_7.release()
			
		except telebot.apihelper.ApiException as err:
			
			try:
				bot.stop_bot()
			finally:
				pass
			
			threading.Thread(target = restart_distribution_of_results_for_telegram, args = (forward_from_chat_id,)).start()

	except Exception:
		
		try:
			bot.stop_bot()
		finally:
			pass
			
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_distribution_of_results_for_telegram, args = (forward_from_chat_id,)).start()

def restart_distribution_of_results_for_telegram(forward_from_chat_id):
	time.sleep(5)
	threading.Thread(target = distribution_of_results_for_telegram, args = (forward_from_chat_id,)).start()

def check_complete_results():
	
	global telegram_channels_distribution_of_final_results
	
	try:
				
		while True:
			
			if len(final_result) > 0:
				lock_7.acquire()
				try:
					for item in final_result:
						if len(final_result[item]) > 0:
							if not item in telegram_channels_distribution_of_final_results:
								telegram_channels_distribution_of_final_results.append(item)
								threading.Thread(target = distribution_of_results_for_telegram, args = (item, )).start()
				finally:
					lock_7.release()
						
			time.sleep(5)
		
	except Exception:
	
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_check_complete_results, args = ()).start()

def restart_check_complete_results():
	time.sleep(5)
	threading.Thread(target = check_complete_results, args = ()).start()

def telegram_bot():
		
	try:
	
		try:
		
			bot = telebot.TeleBot(telegram_token)

			@bot.callback_query_handler(func = lambda call: True)
			def callback_worker(call):
				
				global cache_of_vin_codes, browser_tabs, driver

				ex = re.split(r'vin_code_(.+)_(.+)$', call.data)
				if len(ex) > 2:

					site = ex[1]
					vin_code = ex[2]

					ex = re.split(r'(.+)\n(.+)\n(.+)', call.message.caption)
					if len(ex) > 3:
						text = '<u>'+ex[1]+'</u>\n<b>'+ex[2]+'</b>\n'+ex[3]+'\n____________________\n'
					else:
						text = ''
					
					bot.answer_callback_query(callback_query_id = call.id, text = 'Запрос отправлен, ожидайте', show_alert = False)

					if vin_code in cache_of_vin_codes and site in cache_of_vin_codes[vin_code] and cache_of_vin_codes[vin_code][site] != '':
						bot.send_message(call.message.chat.id, text + cache_of_vin_codes[vin_code][site], parse_mode = 'HTML')
					else:

						if driver:
				
							lock_13.acquire()
							try:

								if (time.time() - browser_tabs[site]['time']) < 3:
									time.sleep(2)
								
								if vin_code in cache_of_vin_codes and site in cache_of_vin_codes[vin_code] and cache_of_vin_codes[vin_code][site] != '':
									bot.send_message(call.message.chat.id, text + cache_of_vin_codes[vin_code][site], parse_mode = 'HTML')
									return

								driver.switch_to.window(browser_tabs[site]['tab'])

								is_add_to_cache = False

								if site == 'autoastat.com':

									driver.get('https://autoastat.com/en/')
									
									if 'We\'re undergoing a bit of<br>scheduled maintenance.' in driver.page_source:
										bot.send_message(call.message.chat.id, text + 'We\'re undergoing a bit of scheduled maintenance.')
										return

									elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'search_lot_by_identifier_form_recaptcha')
									if not elem:
										bot.send_message(call.message.chat.id, text + 'Не удалось найти елемент "search_lot_by_identifier_form_recaptcha" за 30 секунд ожидания')
										return
									
									co = 0
									while True:
										if elem.get_attribute('value') != '':
											break
										co += 1
										if co == 30:
											break
										time.sleep(1)
									
									if not webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'search_lot_by_identifier_form__token'):
										bot.send_message(call.message.chat.id, text + 'Не удалось найти елемент "search_lot_by_identifier_form__token" за 30 секунд ожидания')
										return

									a = 0
									b = 0

									while True:

										if not webdriver_check_exists_element(driver, 3, 'find_element_by_id', 'response_custom_ajax_request'):
											driver.execute_script("""var elem = document.createElement('script');elem.innerHTML = "var timeout_1 = null;var elem = document.createElement('input');elem.setAttribute('id', 'response_custom_ajax_request');elem.setAttribute('type', 'text');document.body.appendChild(elem);function postAjax(loc, method, data){var elem = document.getElementById('response_custom_ajax_request');var xmlhttp = new XMLHttpRequest();xmlhttp.open(method, loc, true);xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');xmlhttp.onreadystatechange = function() {if (xmlhttp != null) {if (xmlhttp.readyState == 4) {if (xmlhttp.status == 200) {clearTimeout(timeout_1);elem.value = 'Response:'+xmlhttp.responseText;xmlhttp = null;} else {elem.value = 'Error: status code '+xmlhttp.status;}}}};xmlhttp.send(data);clearTimeout(timeout_1);timeout_1 = setTimeout((function() {elem.value = 'Error: Сервер не отвечает';}), 15000);}function get_vin_code_info(vin_code){if(vin_code){document.getElementById('response_custom_ajax_request').value = '';var recaptcha_id = document.getElementById('search_lot_by_identifier_form_recaptcha').value;var token = document.getElementById('search_lot_by_identifier_form__token').value;var data = 'search_lot_by_identifier_form[field]='+vin_code+'&search_lot_by_identifier_form[recaptcha]='+recaptcha_id+'&search_lot_by_identifier_form[_token]='+token;postAjax('https://autoastat.com/en/search', 'POST', data);}}"; document.body.appendChild(elem);""")

										driver.execute_script('get_vin_code_info(\''+vin_code+'\')')
										res = ''

										elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'response_custom_ajax_request')
										if elem:

											while True:

												if elem.get_attribute('value') != '':

													ex =  re.split(r'^(Response|Error):(.+)', elem.get_attribute('value'))
													if len(ex) > 2:

														if ex[1] == 'Response':

															ex =  re.split(r'<meta property="og:URL" content="(https://autoastat\.com/en/vehicle/[^"]+)">', ex[2])
															if len(ex) > 1:
																res = ex[1]
																is_add_to_cache = True
															else:
																ex = re.split(r'<div class="alert alert\-danger border\-secondary" role="alert">([^<]+)</div>', elem.get_attribute('value'))
																if len(ex) > 1:
																	res = ex[1]
																else:
																	res = 'Неудалось найти ссылку в ответе с сервера '+site+' (vin код '+vin_code+')'

														else:
															res = ex[1] + ':' + ex[2]

													break

												b += 1
												if b == 30:
													res = 'Сервер '+site+' неприслал ответ'
													break
												time.sleep(1)

										else:
											bot.send_message(call.message.chat.id, text + 'Не удалось найти елемент "response_custom_ajax_request" за 30 секунд ожидания')
											return

										if 'recaptcha' in res:

											if a == 2:
												break
											else:
												a += 1
												time.sleep(5)
										
										else:
											break

								if is_add_to_cache:

									if not vin_code in cache_of_vin_codes:
										cache_of_vin_codes[vin_code] = {site:res}
									else:
										cache_of_vin_codes[vin_code][site] = res

									with open(install_dir+'/cache_of_vin_codes', 'a+', encoding = 'utf-8') as f:
										f.write(vin_code+' '+site+' '+res + python_eol)

								if 'status code 404' in res:
									res = 'Данные не найдены (vin код '+vin_code+')'

								bot.send_message(call.message.chat.id, text + res, parse_mode = 'HTML')

							finally:
								lock_13.release()
								browser_tabs[site]['time'] = time.time()
							
						else:
							
							bot.send_message(call.message.chat.id, 'Неудалось получить данные, проблемы с работой selenium, см. errors.log')
						
			@bot.message_handler(content_types = ['text'])
			def get_text_messages(message):
				
				global users_and_telegram_channel
				
				command_text = message.text.lower().strip()

				if command_text == '/sub':
				
					if message.forward_from_chat != None:
						
						is_find_telegram_channel = False
						is_subscribe_telegram_channel = False

						lock_10.acquire()
						try:

							lenn = len(users_and_telegram_channel)
							
							for i in range(lenn):
								
								item = users_and_telegram_channel[i]
								for a in item['telegram_channels']:
									if a['telegram_channel'] == message.forward_from_chat.title:
										username = item['username']
										is_find_telegram_channel = True
										if a['id_telegram_channel'] == '':
											is_subscribe_telegram_channel = False
											a['id_telegram_channel'] = str(message.forward_from_chat.id)
										else:
											is_subscribe_telegram_channel = True
										break
								if is_find_telegram_channel:
									break

						finally:
							lock_10.release()

						if is_find_telegram_channel:
							
							if not is_subscribe_telegram_channel:

								lock_3.acquire()
								try:
									text = ''
									with open(install_dir+'/users/'+username, 'r+', encoding = 'utf-8') as f:
										lines = f.readlines()
										lenn = len(lines)
										for i in range(lenn):
											item = lines[i].strip()
											if i > 2:
												ex = re.split(r'\|', item)
												if len(ex) > 4:
													if ex[2] == message.forward_from_chat.title:
														text += '|'+ex[1]+'|'+ex[2]+'|'+str(message.forward_from_chat.id)+'|'+ex[4]+'|'+python_eol
													else:
														text += item + python_eol
											else:
												text += item + python_eol
										if text != '':
											f.truncate(0)
											with open(install_dir+'/users/'+username, 'a+', encoding = 'utf-8') as f:
												f.write(text)
								
								finally:
									lock_3.release()
									
								bot.send_message(message.forward_from_chat.id, '\U00002714 Ваш канал успешно подписан на рассылку аукционов из @Auction_manager_100500_bot', parse_mode = 'HTML')
							
							else:
								bot.send_message(message.forward_from_chat.id, 'Ваш канал уже был подписан ранее')

						else:
							bot.send_message(message.forward_from_chat.id, 'Невозможно подписаться. Ваш канал не найден в списке каналов ни у одного пользователя')

						bot.delete_message(message.chat.id, message.message_id)
						
					return
				
				if command_text == '/unsub':
					
					if message.forward_from_chat != None:
						
						is_find_telegram_channel = False
						is_subscribe_telegram_channel = False

						lock_10.acquire()
						try:

							lenn = len(users_and_telegram_channel)
							
							for i in range(lenn):
								
								item = users_and_telegram_channel[i]
								for a in item['telegram_channels']:
									if a['id_telegram_channel'] == str(message.forward_from_chat.id):
										username = item['username']
										is_find_telegram_channel = True
										if a['id_telegram_channel'] != '':
											a['id_telegram_channel'] = ''
											is_subscribe_telegram_channel = True
										else:
											is_subscribe_telegram_channel = False
										break
								if is_find_telegram_channel:
									break

						finally:
							lock_10.release()

						if is_find_telegram_channel:
							
							if is_subscribe_telegram_channel:
								
								lock_2.acquire()
								try:
									if str(message.forward_from_chat.id) in final_result:
										final_result.pop(str(message.forward_from_chat.id))
								finally:
									lock_2.release()
								
								lock_3.acquire()
								try:
									text = ''
									with open(install_dir+'/users/'+username, 'r+', encoding = 'utf-8') as f:
										lines = f.readlines()
										lenn = len(lines)
										for i in range(lenn):
											item = lines[i].strip()
											if i > 2:
												ex = re.split(r'\|', item)
												if len(ex) > 4:
													if ex[3] == str(message.forward_from_chat.id):
														text += '|'+ex[1]+'|'+ex[2]+'||'+ex[4]+'|'+python_eol
													else:
														text += item + python_eol
											else:
												text += item + python_eol
										if text != '':
											f.truncate(0)
											with open(install_dir+'/users/'+username, 'a+', encoding = 'utf-8') as f:
												f.write(text)
								
								finally:
									lock_3.release()
								
								bot.send_message(message.forward_from_chat.id, '\U00002714 Ваш канал отписан от рассылки аукционов из @Auction_manager_100500_bot', parse_mode = 'HTML')

							else:
								bot.send_message(message.forward_from_chat.id, 'Ваш канал уже был отписан ранее')

						else:
							bot.send_message(message.forward_from_chat.id, 'Невозможно отписаться. Ваш канал не найден в списке каналов ни у одного пользователя')

						bot.delete_message(message.chat.id, message.message_id)
						
					return
				
			bot.polling(none_stop = True, interval = 0)
			
		except telebot.apihelper.ApiException:
			
			try:
				bot.stop_bot()
			finally:
				pass

			threading.Thread(target = restart_telegram_bot, args = ()).start()

	except Exception:
		
		try:
			bot.stop_bot()
		finally:
			pass

		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_telegram_bot, args = ()).start()
		
def restart_telegram_bot():
	time.sleep(5)
	threading.Thread(target = telegram_bot, args = ()).start()

def parse__mobile_de():
	
	global parsing_sites_condition, hashes_results, final_result
	
	try:
	
		ex = re.split(r'__', sys._getframe().f_code.co_name)
		site = re.sub(r'_', '.', ex[1])
		
		if site in parsing_sites_condition:
			return
		
		auction_number = 1
		if site in auction_numbers:
			auction_number = auction_numbers[site]
		
		temp_result = []
			
		while True:
			
			lock_4.acquire()
			try:
				if not site in sites_auction:
					break
				currency = sites_auction[site]['currency']
				country_code = sites_auction[site]['country_code']
				parse_auction_interval = sites_auction[site]['parse_auction_interval']
				proxy_host = sites_auction[site]['proxy_host']
				proxy_port = sites_auction[site]['proxy_port']
				proxy_username = sites_auction[site]['proxy_username']
				proxy_password = sites_auction[site]['proxy_password']
				result_limit = sites_auction[site]['result_limit']
			finally:
				lock_4.release()

			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'parsing'
			finally:
				lock_5.release()
			
			is_failed_parse = False

			user_filters_ = []

			lock_9.acquire()
			try:
				user_filters_ = copy.deepcopy(user_filters)
			finally:
				lock_9.release()

			for item_user_filters in user_filters_:
				
				if item_user_filters['country_code'] != country_code:
					continue
				
				if item_user_filters['auction_number'] != auction_number:
					continue
				
				if not site in sites_auction:
					break
				
				result_count = 0
				is_break = False
				is_find_username = False
				is_access_denial = False
				id_telegram_channel = ''
				users_and_telegram_channel_ = []

				lock_10.acquire()
				try:
					users_and_telegram_channel_ = copy.deepcopy(users_and_telegram_channel)
				finally:
					lock_10.release()
				
				for item in users_and_telegram_channel_:
					if item['username'] == item_user_filters['username']:
						is_find_username = True
						
						for a in item['telegram_channels']:
							if a['country_code'] == country_code:
								if a['is_access_denial'] == 'access_denial':
									is_access_denial = True
								id_telegram_channel = a['id_telegram_channel']
								break

						if is_access_denial or id_telegram_channel == '':
							is_break = True
						break
				
				if not is_find_username or is_break:
					continue
				
				if is_failed_parse:
					break
				
				for page_number in range(1, 4):
				
					if is_failed_parse:
						break
					
					if not site in sites_auction:
						break
				
					engine_volume_calc = ''
					type_of_fuel_calc1 = ''
					
					url = 'https://www.mobile.de/ru/'
					
					if item_user_filters['vehicle_type'] == 'car':
					
						if item_user_filters['brand'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['brands']:
							url += 'автомобиль/'+item_user_filters['brand'].lower()
							if item_user_filters['model'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['models'] and item_user_filters['model'] in auction_filters[country_code][auction_number]['car']['models'][item_user_filters['brand']]:
								url += '-'+re.sub(r' ', '-', item_user_filters['model']).lower()
						else:
							url += 'категория/автомобиль'
						
						url += '/vhc:car,pgn:'+str(page_number)+',pgs:50,'
						if item_user_filters['brand'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['brands']:
							url += 'ms1:'+auction_filters[country_code][auction_number]['car']['brands'][item_user_filters['brand']]+'_'
							if item_user_filters['model'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['models'] and item_user_filters['model'] in auction_filters[country_code][auction_number]['car']['models'][item_user_filters['brand']]:
								url += auction_filters[country_code][auction_number]['car']['models'][item_user_filters['brand']][item_user_filters['model']]+'_,'
							else:
								url += '_,'
						
						years_of_release_calc1 = ''
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'frn:'+ex[1]+','
								if ex[2] != None:
									url += 'frx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									years_of_release_calc1 = ex[1]
						
						if item_user_filters['price'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['price'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'prn:'+ex[1]+','
								if ex[2] != None:
									url += 'prx:'+ex[2]+','
						
						if item_user_filters['type_of_fuel'] != '' and item_user_filters['type_of_fuel'] in auction_filters[country_code][auction_number]['car']['type_of_fuel']:
							url += 'ful:'+auction_filters[country_code][auction_number]['car']['type_of_fuel'][item_user_filters['type_of_fuel']].lower()+','
							type_of_fuel_calc1 = auction_filters[country_code][auction_number]['car']['type_of_fuel'][item_user_filters['type_of_fuel']].lower()
						
						if item_user_filters['mileage'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['mileage'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'mln:'+ex[1]+','
								if ex[2] != None:
									url += 'mlx:'+ex[2]+','
						
						if item_user_filters['engine_volume'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['engine_volume'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'ccn:'+ex[1]+','
								if ex[2] != None:
									url += 'ccx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									engine_volume_calc = ex[1]
						
						if item_user_filters['view'] != '':
							url += 'cnd:'+re.sub(r',', '!', item_user_filters['view'])
						
					elif item_user_filters['vehicle_type'] == 'truck':
				
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['truck']['models']:
							url += 'грузовик-свыше-75-т/'+item_user_filters['model'].lower()
						else:
							url += 'категория/грузовик-свыше-75-т'
						url += '/vhc:truckover7500,pgn:'+str(page_number)+',pgs:50,'
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['truck']['models']:
							url += 'mke:'+auction_filters[country_code][auction_number]['truck']['models'][item_user_filters['model']]+','
						
						years_of_release_calc1 = ''
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'frn:'+ex[1]+','
								if ex[2] != None:
									url += 'frx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									years_of_release_calc1 = ex[1]
						
						if item_user_filters['price'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['price'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'prn:'+ex[1]+','
								if ex[2] != None:
									url += 'prx:'+ex[2]+','
						
						if item_user_filters['mileage'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['mileage'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'mln:'+ex[1]+','
								if ex[2] != None:
									url += 'mlx:'+ex[2]+','
						
						if item_user_filters['environmental_class'] != '':
							url += 'emc:'+item_user_filters['environmental_class']+','
						
						if item_user_filters['category'] != '' and item_user_filters['category'] in auction_filters[country_code][auction_number]['truck']['categories']:
							url += 'vcg:'+auction_filters[country_code][auction_number]['truck']['categories'][item_user_filters['category']]+','
						
						if item_user_filters['axles'] != '' and item_user_filters['axles'] in auction_filters[country_code][auction_number]['truck']['axles']:
							url += 'ax:'+auction_filters[country_code][auction_number]['truck']['axles'][item_user_filters['axles']]+','
						
						if item_user_filters['wheel_formula'] != '':
							url += 'wf:wheel_drive_'+item_user_filters['wheel_formula']+','
						
					elif item_user_filters['vehicle_type'] == 'tractor':
				
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['tractor']['models']:
							url += 'седельный-тягач/'+item_user_filters['model'].lower()
						else:
							url += 'категория/седельный-тягач'
						url += '/vhc:semitrailertruck,pgn:'+str(page_number)+',pgs:50,'
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['tractor']['models']:
							url += 'mke:'+auction_filters[country_code][auction_number]['tractor']['models'][item_user_filters['model']]+','
						
						years_of_release_calc1 = ''
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'frn:'+ex[1]+','
								if ex[2] != None:
									url += 'frx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									years_of_release_calc1 = ex[1]
						
						if item_user_filters['price'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['price'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'prn:'+ex[1]+','
								if ex[2] != None:
									url += 'prx:'+ex[2]+','
						
						if item_user_filters['mileage'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['mileage'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'mln:'+ex[1]+','
								if ex[2] != None:
									url += 'mlx:'+ex[2]+','
						
						if item_user_filters['environmental_class'] != '':
							url += 'emc:'+item_user_filters['environmental_class']+','
						
						if item_user_filters['category'] != '' and item_user_filters['category'] in auction_filters[country_code][auction_number]['tractor']['categories']:
							url += 'vcg:'+auction_filters[country_code][auction_number]['tractor']['categories'][item_user_filters['category']]+','
						
						if item_user_filters['axles'] != '' and item_user_filters['axles'] in auction_filters[country_code][auction_number]['tractor']['axles']:
							url += 'ax:'+auction_filters[country_code][auction_number]['tractor']['axles'][item_user_filters['axles']]+','
						
						if item_user_filters['wheel_formula'] != '':
							url += 'wf:wheel_drive_'+item_user_filters['wheel_formula']+','
					
					elif item_user_filters['vehicle_type'] == 'semitrailer':
						
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['semitrailer']['models']:
							url += 'полуприцеп/'+item_user_filters['model'].lower()
						else:
							url += 'категория/полуприцеп'
						url += '/vhc:semitrailer,pgn:'+str(page_number)+',pgs:50,'
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['semitrailer']['models']:
							url += 'mke:'+auction_filters[country_code][auction_number]['semitrailer']['models'][item_user_filters['model']]+','
						
						years_of_release_calc1 = ''
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'frn:'+ex[1]+','
								if ex[2] != None:
									url += 'frx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									years_of_release_calc1 = ex[1]
						
						if item_user_filters['price'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['price'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'prn:'+ex[1]+','
								if ex[2] != None:
									url += 'prx:'+ex[2]+','
						
						if item_user_filters['category'] != '' and item_user_filters['category'] in auction_filters[country_code][auction_number]['semitrailer']['categories']:
							url += 'vcg:'+auction_filters[country_code][auction_number]['semitrailer']['categories'][item_user_filters['category']]+','
						
						if item_user_filters['axles'] != '' and item_user_filters['axles'] in auction_filters[country_code][auction_number]['semitrailer']['axles']:
							url += 'ax:'+auction_filters[country_code][auction_number]['semitrailer']['axles'][item_user_filters['axles']]+','
					
					elif item_user_filters['vehicle_type'] == 'constructionmachine':
						
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['constructionmachine']['models']:
							url += 'строительное-транспортное-средство/'+item_user_filters['model'].lower()
						else:
							url += 'категория/строительное-транспортное-средство'
						url += '/vhc:constructionmachine,pgn:'+str(page_number)+',pgs:50,'
						
						if item_user_filters['model'] != '' and item_user_filters['model'] in auction_filters[country_code][auction_number]['constructionmachine']['models']:
							url += 'mke:'+auction_filters[country_code][auction_number]['constructionmachine']['models'][item_user_filters['model']]+','
						
						years_of_release_calc1 = ''
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'frn:'+ex[1]+','
								if ex[2] != None:
									url += 'frx:'+ex[2]+','
								if ex[1] != None and ex[2] != None and ex[1] == ex[2]:
									years_of_release_calc1 = ex[1]
						
						if item_user_filters['price'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['price'])
							if len(ex) > 2:
								if ex[1] != None:
									url += 'prn:'+ex[1]+','
								if ex[2] != None:
									url += 'prx:'+ex[2]+','
						
						if item_user_filters['category'] != '' and item_user_filters['category'] in auction_filters[country_code][auction_number]['constructionmachine']['categories']:
							url += 'vcg:'+auction_filters[country_code][auction_number]['constructionmachine']['categories'][item_user_filters['category']]+','
							
					url = re.sub(r',$', '', url)
					
					requests_exception_err = False
					result_complete = False
					a = 0

					while True:

						try:
							
							session = requests.Session()
							if proxy_host:
								if proxy_username:
									session.proxies = {
									'http': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port
									}
									session.auth = HTTPProxyAuth(proxy_username, proxy_password)
								else:
									session.proxies = {
									'http': 'http://'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_host+':'+proxy_port
									}
						
							req = session.get(url, timeout = edit_app['requests_timeout'], headers = default_http_headers)

						except requests.exceptions.RequestException as err:
							
							is_failed_parse = True
							requests_exception_err = True
							ex = re.split(r'\): (.+)', str(err))
							if len(ex) > 1:
								err = ex[1]
							else:
								err = str(err)
							if a == 2:
								lock_1.acquire()
								try:
									log_error(err)
								except Exception:
									pass
								finally:
									lock_1.release()
							else:
								a += 1
								time.sleep(1)
								continue
						
						break

					if not is_failed_parse and not requests_exception_err:
						
						if req.status_code != 200:
							if not 'Страница не найдена' in req.text:
								lock_11.acquire()
								try:
									log_error_parse('('+url+') [status_code = '+str(req.status_code)+'] '+python_eol + req.text, site)
								finally:
									lock_11.release()
								is_failed_parse = True
						
						if not is_failed_parse and req.status_code == 200:
							
							if not 'Измените критерии поиска или начните новый' in req.text:
								if not 'Страница не найдена' in req.text:
									
									if 'class="result-list-section js-result-list-section u-clearfix"' in req.text and '<button class="btn btn--muted btn-scroll-to-top js-scroll-top u-text-normal' in req.text:
									
										raw_data_parse_content = ''
										
										ex = re.split(r'class="result-list-section js-result-list-section u-clearfix"', req.text)
										ex = re.split(r'<button class="btn btn--muted btn-scroll-to-top js-scroll-top u-text-normal', ex[1])
										raw_data_parse_content = ex[0]
											
										if raw_data_parse_content == '':
											lock_11.acquire()
											try:
												log_error_parse('('+url+') [Не удалось получить raw_data_parse_content] '+ python_eol + req.text, site)
											finally:
												lock_11.release()
										
										if raw_data_parse_content != '':
										
											ex = re.split(r'<article class="list\-entry g\-row( eyecatcher)?">', raw_data_parse_content)
											
											if len(ex) > 2:
												
												for item in ex:
													
													if item != None and not 'Реклама на первой странице' in item:
													
														if item_user_filters['vehicle_type'] == 'car':
															ex1 = re.split(r'href="(/ru/[^"]+/vhc:car,[^"]+)">(.+)', item)
														elif item_user_filters['vehicle_type'] == 'truck':
															ex1 = re.split(r'href="(/ru/[^"]+/vhc:truckover7500,[^"]+)">(.+)', item)
														elif item_user_filters['vehicle_type'] == 'tractor':
															ex1 = re.split(r'href="(/ru/[^"]+/vhc:semitrailertruck,[^"]+)">(.+)', item)
														elif item_user_filters['vehicle_type'] == 'semitrailer':
															ex1 = re.split(r'href="(/ru/[^"]+/vhc:semitrailer,[^"]+)">(.+)', item)
														elif item_user_filters['vehicle_type'] == 'constructionmachine':
															ex1 = re.split(r'href="(/ru/[^"]+/vhc:constructionmachine,[^"]+)">(.+)', item)
														
														if len(ex1) > 2:
															
															link_to_auction = 'https://www.mobile.de'+ex1[1]
															ex2 = re.split(r'<noscript><img class="img\-thumbnail" src="([^"]+)" alt="([^"]+)"', ex1[2])
															
															if len(ex2) > 2:
															
																preview_img = ex2[1]
																brands_and_model = re.sub(r'&quot;', '"', re.sub(r'&amp;', '&', ex2[2]))
																price_calc = ''
																ex2 = re.split(r'<p class="seller\-currency u\-text\-bold">([^€]+)€', ex1[2])
																if len(ex2) > 1:
																	price = re.sub(r'[^0-9]', '', ex2[1])
																	price_calc = price
																years_of_release_calc2 = ''
																params = ''
																ex2 = re.split(r'<div class="vehicle\-information g\-col\-s\-6 g\-col\-m\-8">(.+)', ex1[2])
																if len(ex2) > 1:
																	ex3 = re.split(r'<p class="u\-text\-bold">([^<]+)</p>', ex2[1])
																	if len(ex3) > 1:
																		params += ex3[1]
																		ex3 = re.split(r'^([0-9]{2}/)?([0-9]{4})', params)
																		if len(ex3) > 2:
																			years_of_release_calc2 = ex3[2]
																	ex3 = re.split(r'<p class="u\-text\-grey\-60">([^<]+)</p>', ex2[1])
																	if len(ex3) > 1:
																		params += ', '+ex3[1]
																	ex3 = re.split(r'<div class="vehicle\-techspecs hidden\-s"><p class="u\-text\-grey\-60">([^<]+)</p><p class="u\-text\-grey\-60">([^<]+)</p>', ex2[1])
																	if len(ex3) > 2:
																		params += ', '+ex3[1]
																		params += ', '+ex3[2]
																if years_of_release_calc2:
																	years_of_release_calc_ = years_of_release_calc2
																else:
																	years_of_release_calc_ = years_of_release_calc1
																type_of_fuel_calc2 = ''
																ex3 = re.split(r'(Дизель|Бензин)', params)
																if len(ex3) > 1:
																	type_of_fuel_calc2 = re.sub(r'Дизель', 'diesel', ex3[1])
																	type_of_fuel_calc2 = re.sub(r'Бензин', 'petrol', ex3[1])
																if type_of_fuel_calc2:
																	type_of_fuel_calc_ = type_of_fuel_calc2
																else:
																	type_of_fuel_calc_ = type_of_fuel_calc1
																
																if re.search(r'евро ?6|euro ?6', brands_and_model + params.lower()) != None:
																	continue
																
																hash = hashlib.md5((brands_and_model + params + price).encode('utf-8')).hexdigest()
																hash = hash[:20]
																is_find_hash = False
																
																lock_6.acquire()
																try:
																	if id_telegram_channel in hashes_results:
																		is_find_hash = hash in hashes_results[id_telegram_channel]
																		if not is_find_hash:
																			hashes_results[id_telegram_channel].append(hash)
																	else:
																		hashes_results[id_telegram_channel] = [hash]
																finally:
																	lock_6.release()
																
																if not is_find_hash:
																	result_count += 1
																	customs_clearance = calc_customs_clearance(engine_volume_calc, price_calc, years_of_release_calc_, type_of_fuel_calc_, currency)
																	temp_result.append({'id_telegram_channel':id_telegram_channel, 'link_to_auction':link_to_auction, 'preview_img':preview_img, 'brands_and_model':brands_and_model, 'params':params, 'price':price, 'customs_clearance':customs_clearance, 'hash':hash, 'id':item_user_filters['id'], 'currency':currency, 'vin_code':''})
																
																if result_count >= result_limit:
																	result_complete = True
																	break
											
											if result_complete:
												break

									else:
										lock_11.acquire()
										try:
											log_error_parse('('+url+') [Не удалось найти теги с классом "result-list-section js-result-list-section u-clearfix" и (или) "btn btn--muted btn-scroll-to-top js-scroll-top u-text-normal"] '+python_eol + req.text, site)
										finally:
											lock_11.release()
										is_failed_parse = True
									
					time.sleep(1.4)
				
				if len(temp_result) > 0:
					lock_2.acquire()
					try:
						for item in temp_result:
							if not site in sites_auction:
								break
							if item['id_telegram_channel'] in final_result:
								final_result[item['id_telegram_channel']] += [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
							else:
								final_result[item['id_telegram_channel']] = [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
					finally:
						lock_2.release()
					temp_result = []
				
				time.sleep(1.4)
			
			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'sleep'
			finally:
				lock_5.release()
			
			time.sleep(parse_auction_interval)

		if site in parsing_sites_condition:
			parsing_sites_condition.pop(site)
		
	except Exception:
			
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def parse__copart_com():
	
	global parsing_sites_condition, hashes_results, final_result
	
	try:
	
		ex = re.split(r'__', sys._getframe().f_code.co_name)
		site = re.sub(r'_', '.', ex[1])
		cookies = {}

		if site in parsing_sites_condition:
			return
		
		auction_number = 1
		if site in auction_numbers:
			auction_number = auction_numbers[site]
		
		temp_result = []
		default_http_headers_ = copy.deepcopy(default_http_headers)

		while True:
			
			if not site in sites_auction:
				break
			
			is_yet_auth = False

			if not 'time_update_cookies' in cookies or (time.time() - float(cookies['time_update_cookies'])) > 10800:
				if 'copart.com' in sites_auction and sites_auction['copart.com']['auction_auth_username'] and sites_auction['copart.com']['auction_auth_password']:

					lock_13.acquire()
					try:
						for i in range(2):
							
							if driver:
								res, comment = auth_and_get_cookies__copart_com( sites_auction['copart.com']['auction_auth_username'] , sites_auction['copart.com']['auction_auth_password'], is_yet_auth)
							else:
								break

							if res == 'ok':
								cookies = comment
								cookies['time_update_cookies'] = str(time.time())
								break
							elif res == 'yet_auth':
								is_yet_auth = True
							else:
								break

					finally:
						lock_13.release()
			
			lock_4.acquire()
			try:
				if not site in sites_auction:
					break
				currency = sites_auction[site]['currency']
				country_code = sites_auction[site]['country_code']
				parse_auction_interval = sites_auction[site]['parse_auction_interval']
				proxy_host = sites_auction[site]['proxy_host']
				proxy_port = sites_auction[site]['proxy_port']
				proxy_username = sites_auction[site]['proxy_username']
				proxy_password = sites_auction[site]['proxy_password']
				result_limit = sites_auction[site]['result_limit']
			finally:
				lock_4.release()
			
			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'parsing'
			finally:
				lock_5.release()
			
			is_failed_parse = False
			
			user_filters_ = []

			lock_9.acquire()
			try:
				user_filters_ = copy.deepcopy(user_filters)
			finally:
				lock_9.release()

			for item_user_filters in user_filters_:
				
				if item_user_filters['country_code'] != country_code:
					continue
				
				if item_user_filters['auction_number'] != auction_number:
					continue
					
				if not site in sites_auction:
					break
				
				result_count = 0
				is_break = False
				is_find_username = False
				is_access_denial = False
				id_telegram_channel = ''
				users_and_telegram_channel_ = []

				lock_10.acquire()
				try:
					users_and_telegram_channel_ = copy.deepcopy(users_and_telegram_channel)
				finally:
					lock_10.release()
				
				for item in users_and_telegram_channel_:
					if item['username'] == item_user_filters['username']:
						is_find_username = True
						
						for a in item['telegram_channels']:
							if a['country_code'] == country_code:
								if a['is_access_denial'] == 'access_denial':
									is_access_denial = True
								id_telegram_channel = a['id_telegram_channel']
								break

						if is_access_denial or id_telegram_channel == '':
							is_break = True
						break
				
				if not is_find_username or is_break:
					continue
				
				if is_failed_parse:
					break
				
				for page_number in range(3):
				
					if is_failed_parse:
						break
					
					if not site in sites_auction:
						break
					
					url = 'https://www.copart.com/public/vehicleFinder/search'
						
					if item_user_filters['vehicle_type'] == 'car':
					
						if item_user_filters['brand'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['brands']:
							brand = '#MakeCode:'+auction_filters[country_code][auction_number]['car']['brands'][item_user_filters['brand']]+' OR #MakeDesc:'+item_user_filters['brand']
							if item_user_filters['model'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['models'] and item_user_filters['model'] in auction_filters[country_code][auction_number]['car']['models'][item_user_filters['brand']]:
								model = ',#LotModel:'+item_user_filters['model']+','
							else:
								model = ','
						else:
							brand = ''
							model = ''
						
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None and ex[2] != None:
									years_of_release = ex[1]+' TO '+ex[2]
								elif ex[1] == None:
									years_of_release = '1920 TO '+ex[2]
								elif ex[2] == None:
									years_of_release = ex[1]+' TO 2021'
							else:
								years_of_release = '1920 TO 2021'
						else:
							years_of_release = '1920 TO 2021'
						
						if item_user_filters['type_of_fuel'] != '' and item_user_filters['type_of_fuel'] in auction_filters[country_code][auction_number]['car']['type_of_fuel']:
							type_of_fuel = '&filter[FUEL]=fuel_type_desc:"'+auction_filters[country_code][auction_number]['car']['type_of_fuel'][item_user_filters['type_of_fuel']]+'"'
							type_of_fuel_ = '&includeTagByField[FUEL]={!tag=FUEL}'
						else:
							type_of_fuel = ''
							type_of_fuel_ = ''
						
						if item_user_filters['mileage'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['mileage'])
							if len(ex) > 2:
								if ex[1] != None and ex[2] != None:
									mileage = '&filter[ODM]=odometer_reading_received:['+ex[1]+' TO '+ex[2]+']'
								else:
									if ex[2] == None:
										mileage = '&filter[ODM]=odometer_reading_received:['+ex[1]+' TO *]'
									else:
										mileage = '&filter[ODM]=odometer_reading_received:[* TO '+ex[2]+']'
								mileage_ = '&includeTagByField[ODM]={!tag=ODM}'
							else:
								mileage = ''
								mileage_ = ''
						else:
							mileage = ''
							mileage_ = ''
						
						if item_user_filters['damage'] != '' and item_user_filters['damage'] in auction_filters[country_code][auction_number]['car']['damage']:
							damage = '&filter[PRID]=damage_type_code:'+auction_filters[country_code][auction_number]['car']['damage'][item_user_filters['damage']]
							damage_ = '&includeTagByField[PRID]={!tag=PRID}'
						else:
							damage = ''
							damage_ = ''
						
						if item_user_filters['buy_it_now'] != '':
							buy_it_now = '&filter[FETI]=buy_it_now_code:B1'
						else:
							buy_it_now = ''
						
						if brand + model + type_of_fuel + mileage + damage + buy_it_now == '':
							continue
						
						post_fields = 'draw='+str(page_number + 2)+'&columns[0][data]=0&columns[0][name]=&columns[0][searchable]=true&columns[0][orderable]=false&columns[0][search][value]=&columns[0][search][regex]=false&columns[1][data]=1&columns[1][name]=&columns[1][searchable]=true&columns[1][orderable]=false&columns[1][search][value]=&columns[1][search][regex]=false&columns[2][data]=2&columns[2][name]=&columns[2][searchable]=true&columns[2][orderable]=true&columns[2][search][value]=&columns[2][search][regex]=false&columns[3][data]=3&columns[3][name]=&columns[3][searchable]=true&columns[3][orderable]=true&columns[3][search][value]=&columns[3][search][regex]=false&columns[4][data]=4&columns[4][name]=&columns[4][searchable]=true&columns[4][orderable]=true&columns[4][search][value]=&columns[4][search][regex]=false&columns[5][data]=5&columns[5][name]=&columns[5][searchable]=true&columns[5][orderable]=true&columns[5][search][value]=&columns[5][search][regex]=false&columns[6][data]=6&columns[6][name]=&columns[6][searchable]=true&columns[6][orderable]=true&columns[6][search][value]=&columns[6][search][regex]=false&columns[7][data]=7&columns[7][name]=&columns[7][searchable]=true&columns[7][orderable]=true&columns[7][search][value]=&columns[7][search][regex]=false&columns[8][data]=8&columns[8][name]=&columns[8][searchable]=true&columns[8][orderable]=true&columns[8][search][value]=&columns[8][search][regex]=false&columns[9][data]=9&columns[9][name]=&columns[9][searchable]=true&columns[9][orderable]=true&columns[9][search][value]=&columns[9][search][regex]=false&columns[10][data]=10&columns[10][name]=&columns[10][searchable]=true&columns[10][orderable]=true&columns[10][search][value]=&columns[10][search][regex]=false&columns[11][data]=11&columns[11][name]=&columns[11][searchable]=true&columns[11][orderable]=true&columns[11][search][value]=&columns[11][search][regex]=false&columns[12][data]=12&columns[12][name]=&columns[12][searchable]=true&columns[12][orderable]=true&columns[12][search][value]=&columns[12][search][regex]=false&columns[13][data]=13&columns[13][name]=&columns[13][searchable]=true&columns[13][orderable]=true&columns[13][search][value]=&columns[13][search][regex]=false&columns[14][data]=14&columns[14][name]=&columns[14][searchable]=true&columns[14][orderable]=false&columns[14][search][value]=&columns[14][search][regex]=false&columns[15][data]=15&columns[15][name]=&columns[15][searchable]=true&columns[15][orderable]=false&columns[15][search][value]=&columns[15][search][regex]=false&order[0][column]=1&order[0][dir]=asc&start='+str(page_number * 100)+'&length=100&search[value]=&search[regex]=false&sort=auction_date_type desc,auction_date_utc asc&defaultSort=true&filter[MISC]='+brand + model+'#VehicleTypeCode:VEHTYPE_V,#LotYear:['+years_of_release+']' + type_of_fuel + mileage + damage + buy_it_now +'&query=*&watchListOnly=false&freeFormSearch=false&page='+str(page_number)+'&size=100'+type_of_fuel_ + mileage_ + damage_
					
					requests_exception_err = False
					result_complete = False
					
					default_http_headers_['X-XSRF-TOKEN'] = 'aaa104ee-a928-4efe-b120-7c96dda23b44'
					default_http_headers_['X-Requested-With'] = 'XMLHttpRequest'
					default_http_headers_['Content-Type'] = 'application/x-www-form-urlencoded'
					a = 0

					while True:

						try:
							
							session = requests.Session()
							if proxy_host:
								if proxy_username:
									session.proxies = {
									'http': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port
									}
									session.auth = HTTPProxyAuth(proxy_username, proxy_password)
								else:
									session.proxies = {
									'http': 'http://'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_host+':'+proxy_port
									}
						
							req = session.post(url, timeout = edit_app['requests_timeout'], headers = default_http_headers_, cookies = cookies, data = post_fields)
							
						except requests.exceptions.RequestException as err:
							
							is_failed_parse = True
							requests_exception_err = True
							ex = re.split(r'\): (.+)', str(err))
							if len(ex) > 1:
								err = ex[1]
							else:
								err = str(err)
							if a == 2:
								lock_1.acquire()
								try:
									log_error(err)
								except Exception:
									pass
								finally:
									lock_1.release()
							else:
								a += 1
								time.sleep(1)
								continue
					
						break

					if not is_failed_parse and not requests_exception_err:
						
						if req.status_code != 200:
							lock_11.acquire()
							try:
								log_error_parse('('+url+') [status_code = '+str(req.status_code)+'] '+python_eol + req.text, site)
							finally:
								lock_11.release()
							is_failed_parse = True
						
						if not is_failed_parse and req.status_code == 200:
							
							if not '"totalElements":0' in req.text:
									
								if re.search(r'"totalElements":[0-9]+', req.text) and re.search(r'"facetFields"', req.text):
									
									ex = re.split(r'"facetFields"', req.text)
									ex = re.split(r'"lotNumberStr"', ex[0])
									
									if len(ex) > 1:
										
										for item in ex:
											
											ex1 = re.split(r'"ln":([0-9]+),"mkn":"([^"]+)","lm":"([^"]+)","lcy":([0-9]+),.+"la":([0-9\.]+),.+"orr":([0-9\.]+),.+"bndc":"([^"]*)","bnp":([0-9\.]+),.+"tims":"([^"]+)",.+"ldu":"([^"]+)"', item)
											
											if len(ex1) > 10:
												
												lot_id = ex1[1]
												link_to_auction = 'https://www.copart.com/ru/lot/'+ex1[1]+'/'+ex1[10]
												brands_and_model = ex1[2][:1] + ex1[2][1:].lower()+' '+ex1[3][:1] + ex1[3][1:].lower()
												preview_img = ex1[9]
												year = ex1[4]+', '
												price = re.sub(r'\.[0-9]+$', '', ex1[5])
												mileage = re.sub(r'\.[0-9]+$', '', ex1[6])
												if mileage == '0':
													mileage = ''
												else:
													mileage += ' km. '
												price_buy_it_now = re.sub(r'\.[0-9]+$', '', ex1[8])
												if price_buy_it_now != '0':
													price = 'Цена, если купить сейчас: '+price_buy_it_now
												ex1 = re.split(r'"dd":"([^"]+)",', item)
												if len(ex1) > 1:
													damage = ex1[1]
												else:
													damage = ''
												ex1 = re.split(r'"tmtp":"([^"]+)",', item)
												if len(ex1) > 1:
													gearbox = ', '+ex1[1][:1] + ex1[1][1:].lower()
												else:
													gearbox = ''
												ex1 = re.split(r'"ft":"([^"]+)",', item)
												if len(ex1) > 1:
													type_of_fuel = ex1[1]
												else:
													type_of_fuel = ''
												ex1 = re.split(r'"drv":"([^"]+)?",', item)
												if len(ex1) > 1:
													drive_unit = ', '+ex1[1]
												else:
													drive_unit = ''
												damage = damage.replace(u'ALL OVER', 'Повреждения везде').replace(u'BIOHAZARD/CHEMICAL', 'Повреждения химическим веществом').replace(u'BURN - ENGINE', 'Повреждения огнем на двигателе').replace(u'BURN - INTERIOR', 'Повреждения огнем в салоне').replace(u'BURN', 'Повреждения огнем').replace(u'DAMAGE HISTORY', 'История повреждений').replace(u'FRAME DAMAGE', 'Повреждение рамы').replace(u'FRONT END', 'Повреждение на передней части').replace(u'HAIL', 'Повреждение градом').replace(u'MECHANICAL', 'Механические повреждения').replace(u'MINOR DENT/SCRATCHES', 'Незначительные вмятины / царапины').replace(u'MISSING/ALTERED VIN', 'Повреждения отсуствуют, изменен VIN').replace(u'NORMAL WEAR', 'Нормальный износ').replace(u'PARTIAL REPAIR', 'Был частичный ремонт').replace(u'REAR END', 'Повреждения в задней части').replace(u'REJECTED REPAIR', 'Отклоненный ремонт').replace(u'REPLACED VIN', 'Заменен VIN').replace(u'ROLLOVER', 'Повреждения вокруг').replace(u'SIDE', 'Повреждения в бок').replace(u'STRIPPED', 'Осталась только рама').replace(u'TOP/ROOF', 'Повреждения на крише').replace(u'UNDERCARRIAGE', 'Повреждения ходовой части').replace(u'UNKNOWN', 'Повреждения неизвестны').replace(u'VANDALISM', 'Повреждения от вандализма').replace(u'WATER/FLOOD', 'Повреждения от воды')
												type_of_fuel = type_of_fuel.replace(u'DIESEL', 'Дизель').replace(u'PETROL', 'Бензин').replace(u'FLEXIBLE FUEL', 'Гибкое топливо').replace(u'ELECTRIC', 'Электрический двигатель').replace(u'GAS', 'Газ').replace(u'HYBRID ENGINE', 'Гибрид')
												if type_of_fuel:
													type_of_fuel = ', '+type_of_fuel
												
												ex1 = re.split(r'"fv":"([^"]+)",', item)
												if len(ex1) > 1:
													vin_code = ex1[1]
													if '*' in vin_code:
														vin_code = ''
												else:
													vin_code = ''
												
												is_show_date = False
												ex1 = re.split(r'"adt":"E",', item)
												if len(ex1) > 1:
													is_show_date = False
												else:
													ex1 = re.split(r'"ad":([^"]+),', item)
													if len(ex1) > 1 and ex1[1] != '0':
														is_show_date = True
													else:
														is_show_date = False

												if item_user_filters['the_date_of_the'] == 'only_with_date':
													if not is_show_date:
														continue
												
												if item_user_filters['the_date_of_the'] == 'only_no_date':
													if is_show_date:
														continue
												
												params = year + mileage + damage + gearbox + type_of_fuel + drive_unit
												
												hash = hashlib.md5((brands_and_model + params + price).encode('utf-8')).hexdigest()
												hash = hash[:20]
												is_find_hash = False
												
												lock_6.acquire()
												try:
													if id_telegram_channel in hashes_results:
														is_find_hash = hash in hashes_results[id_telegram_channel]
														if not is_find_hash:
															hashes_results[id_telegram_channel].append(hash)
													else:
														hashes_results[id_telegram_channel] = [hash]
												finally:
													lock_6.release()
												
												if not is_find_hash:

													result_count += 1
													temp_result.append({'id_telegram_channel':id_telegram_channel, 'link_to_auction':link_to_auction, 'preview_img':preview_img, 'brands_and_model':brands_and_model, 'params':params, 'price':price, 'customs_clearance':'', 'hash':hash, 'id':item_user_filters['id'], 'currency':currency, 'vin_code':vin_code})
												
												if result_count >= result_limit:
													result_complete = True
													break
									
									if result_complete:
										break

								else:
									lock_11.acquire()
									try:
										log_error_parse('('+url+') [Не удалось найти "totalElements" или "facetFields"] '+python_eol + req.text, site)
									finally:
										lock_11.release()
									is_failed_parse = True
									
					time.sleep(1.4)
				
				if len(temp_result) > 0:
					lock_2.acquire()
					try:
						for item in temp_result:
							if not site in sites_auction:
								break
							if item['id_telegram_channel'] in final_result:
								final_result[item['id_telegram_channel']] += [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
							else:
								final_result[item['id_telegram_channel']] = [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
					finally:
						lock_2.release()
					temp_result = []
				
				time.sleep(1.4)
			
			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'sleep'
			finally:
				lock_5.release()
			
			time.sleep(parse_auction_interval)

		if site in parsing_sites_condition:
			parsing_sites_condition.pop(site)
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def parse__iaai_com():
	
	global parsing_sites_condition, hashes_results, final_result
	
	try:
	
		ex = re.split(r'__', sys._getframe().f_code.co_name)
		site = re.sub(r'_', '.', ex[1])
		cookies = {}

		if site in parsing_sites_condition:
			return
		
		auction_number = 1
		if site in auction_numbers:
			auction_number = auction_numbers[site]
		
		temp_result = []
		default_http_headers_ = copy.deepcopy(default_http_headers)

		while True:
			
			if not site in sites_auction:
				break
			
			is_yet_auth = False

			if not 'time_update_cookies' in cookies or (time.time() - float(cookies['time_update_cookies'])) > 10800:
				if 'iaai.com' in sites_auction and sites_auction['iaai.com']['auction_auth_username'] and sites_auction['iaai.com']['auction_auth_password']:

					lock_13.acquire()
					try:
						for i in range(2):

							if driver:
								res, comment = auth_and_get_cookies__iaai_com( sites_auction['iaai.com']['auction_auth_username'] , sites_auction['iaai.com']['auction_auth_password'], is_yet_auth)
							else:
								break

							if res == 'ok':
								cookies = comment
								cookies['time_update_cookies'] = str(time.time())
								break
							elif res == 'yet_auth':
								is_yet_auth = True
							else:
								break

					finally:
						lock_13.release()

			lock_4.acquire()
			try:
				if not site in sites_auction:
					break
				currency = sites_auction[site]['currency']
				country_code = sites_auction[site]['country_code']
				parse_auction_interval = sites_auction[site]['parse_auction_interval']
				proxy_host = sites_auction[site]['proxy_host']
				proxy_port = sites_auction[site]['proxy_port']
				proxy_username = sites_auction[site]['proxy_username']
				proxy_password = sites_auction[site]['proxy_password']
				result_limit = sites_auction[site]['result_limit']
			finally:
				lock_4.release()
			
			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'parsing'
			finally:
				lock_5.release()
			
			is_failed_parse = False
			
			user_filters_ = []

			lock_9.acquire()
			try:
				user_filters_ = copy.deepcopy(user_filters)
			finally:
				lock_9.release()

			for item_user_filters in user_filters_:
				
				if item_user_filters['country_code'] != country_code:
					continue
				
				if item_user_filters['auction_number'] != auction_number:
					continue
				
				if not site in sites_auction:
					break
				
				result_count = 0
				is_break = False
				is_find_username = False
				is_access_denial = False
				id_telegram_channel = ''
				
				users_and_telegram_channel_ = []

				lock_10.acquire()
				try:
					users_and_telegram_channel_ = copy.deepcopy(users_and_telegram_channel)
				finally:
					lock_10.release()
				
				for item in users_and_telegram_channel_:
					if item['username'] == item_user_filters['username']:
						is_find_username = True
						
						for a in item['telegram_channels']:
							if a['country_code'] == country_code:
								if a['is_access_denial'] == 'access_denial':
									is_access_denial = True
								id_telegram_channel = a['id_telegram_channel']
								break

						if is_access_denial or id_telegram_channel == '':
							is_break = True
						break
				
				if not is_find_username or is_break:
					continue
				
				if is_failed_parse:
					break
				
				for page_number in range(3):
				
					if is_failed_parse:
						break
					
					if not site in sites_auction:
						break
					
					url = 'https://iaai.com/Search/GetSearchResults'
					post_fields = ''

					if item_user_filters['vehicle_type'] == 'car':
						
						if item_user_filters['brand'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['brands']:
							brand = '{"Facets":[{"Group":"Make","Value":"'+auction_filters[country_code][auction_number]['car']['brands'][item_user_filters['brand']]+'"}],"FullSearch":null,"LongRanges":null},'
							if item_user_filters['model'] != '' and item_user_filters['brand'] in auction_filters[country_code][auction_number]['car']['models'] and item_user_filters['model'] in auction_filters[country_code][auction_number]['car']['models'][item_user_filters['brand']]:
								model = '{"Facets":[{"Group":"Model","Value":"'+item_user_filters['model']+'"}],"FullSearch":null,"LongRanges":null},'
							else:
								model = ''
						else:
							brand = ''
							model = ''
						
						if item_user_filters['years_of_release'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['years_of_release'])
							if len(ex) > 2:
								if ex[1] != None and ex[2] != None:
									years_of_release = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":'+ex[1]+',"Name":"Year","To":'+ex[2]+'}]},'
								elif ex[1] == None:
									years_of_release = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":1920,"Name":"Year","To":'+ex[2]+'}]},'
								elif ex[2] == None:
									years_of_release = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":'+ex[1]+',"Name":"Year","To":2021}]},'
							else:
								years_of_release = ''
						else:
							years_of_release = ''
						
						if item_user_filters['type_of_fuel'] != '' and item_user_filters['type_of_fuel'] in auction_filters[country_code][auction_number]['car']['type_of_fuel']:
							type_of_fuel = '{"Facets":[{"Group":"FuelType","Value":"'+auction_filters[country_code][auction_number]['car']['type_of_fuel'][item_user_filters['type_of_fuel']]+'"}],"FullSearch":null,"LongRanges":null},'
						else:
							type_of_fuel = ''
						
						if item_user_filters['mileage'] != '':
							ex = re.split(r'([0-9]+)?:([0-9]+)?', item_user_filters['mileage'])
							if len(ex) > 2:
								if ex[1] != None and ex[2] != None:
									mileage = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":'+ex[1]+',"Name":"Odometer","To":'+ex[2]+'}]},'
								elif ex[1] == None:
									mileage = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":0,"Name":"Odometer","To":'+ex[2]+'}]},'
								elif ex[2] == None:
									mileage = '{"Facets":null,"FullSearch":null,"LongRanges":[{"From":'+ex[1]+',"Name":"Odometer","To":150000}]},'
							else:
								mileage = ''
						else:
							mileage = ''
						
						if item_user_filters['damage'] != '' and item_user_filters['damage'] in auction_filters[country_code][auction_number]['car']['damage']:
							damage = '{"Facets":[{"Group":"PrimaryDamage","Value":"'+auction_filters[country_code][auction_number]['car']['damage'][item_user_filters['damage']]+'"}],"FullSearch":null,"LongRanges":null}'
						else:
							damage = ''
						
						if item_user_filters['buy_it_now'] != '':
							buy_it_now = '{"Facets":[{"Group":"QuickLinkCategories","Value":"I-Buy Fast"}],"FullSearch":null,"LongRanges":null},'
						else:
							buy_it_now = ''
						
						if buy_it_now + mileage + years_of_release + brand + model + type_of_fuel + damage == '':
							continue
						
						post_fields = '{"Searches":['+re.sub(r',$', '', buy_it_now + mileage + years_of_release + brand + model + type_of_fuel + damage)+'],"miles":0,"PageSize":100,"CurrentPage":1,"Sort":[{"IsGeoSort":false,"SortField":"LiveDateTime","IsDescending":false}]}'
						
					requests_exception_err = False
					result_complete = False
					
					default_http_headers_['Content-Type'] = 'application/json'
					a = 0

					while True:

						try:
							
							session = requests.Session()
							if proxy_host:
								if proxy_username:
									session.proxies = {
									'http': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_username+':'+proxy_password+'@'+proxy_host+':'+proxy_port
									}
									session.auth = HTTPProxyAuth(proxy_username, proxy_password)
								else:
									session.proxies = {
									'http': 'http://'+proxy_host+':'+proxy_port, 
									'https': 'http://'+proxy_host+':'+proxy_port
									}
						
							req = session.post(url, timeout = edit_app['requests_timeout'], headers = default_http_headers_, cookies = cookies, data = post_fields)
							
						except requests.exceptions.RequestException as err:
							
							is_failed_parse = True
							requests_exception_err = True
							ex = re.split(r'\): (.+)', str(err))
							if len(ex) > 1:
								err = ex[1]
							else:
								err = str(err)
							if a == 2:
								lock_1.acquire()
								try:
									log_error(err)
								except Exception:
									pass
								finally:
									lock_1.release()
							else:
								a += 1
								time.sleep(1)
								continue
						
						break

					if not is_failed_parse and not requests_exception_err:
						
						if req.status_code != 200:
							lock_11.acquire()
							try:
								log_error_parse('('+url+') [status_code = '+str(req.status_code)+'] '+python_eol + req.text, site)
							finally:
								lock_11.release()
							
							log_event1(str(post_fields))

							is_failed_parse = True
						
						if not is_failed_parse and req.status_code == 200:
							
							if not '<div id="TotalVehicleAmount" class="hidden">0 </div>' in req.text:
									
								if re.search(r'<div class="table-body border-l border-r">', req.text) and re.search(r'<div class="table-row table-row-border">', req.text):
									
									ex = re.split(r'<div class="table-body border-l border-r">', req.text)
									raw_data_parse_content = re.sub(r'  +', ' ', ex[1])
									raw_data_parse_content = re.sub(r'\r\n', '', raw_data_parse_content)
									raw_data_parse_content = re.sub(r'\n', '', raw_data_parse_content)
									ex = re.split(r'<div class="table-row table-row-border">', raw_data_parse_content)
									
									if len(ex) > 1:
										
										for item in ex:
											
											ex1 = re.split(r'<img data\-src="([^"]+)" onerror="[^"]+" class="img\-responsive lazyload" data\-toggle="[^"]+" data\-html="[^"]+" data\-placement="[^"]+" data\-container="[^"]+" data\-original\-title="[^"]+">.+<a href="(/vehicledetails/[^"]+)" name="[0-9]+" id="[0-9]+">([^<]+)</a>.+title="Primary Damage: ([^"]+)".+title="Odometer: ([^"]+)".+title="Engine: ([^"]+)".+title="Fuel Type: ([^"]+)"(.+)', item)
											
											if len(ex1) > 8:
												
												link_to_auction = 'https://iaai.com'+ex1[2]
												ex2 = re.split(r'^([0-9]{4})(.+)', ex1[3])
												if len(ex2) > 2:
													year = ex2[1]+', '
													brands_and_model = ex2[2].strip()
												else:
													continue
												preview_img = re.sub(r'&amp;', '&', ex1[1])
												damage = re.sub(r'&amp;', '&', ex1[4])
												mileage = re.sub(r'[^0-9]', '', ex1[5])+' mi. '
												engine = ', '+ex1[6]
												type_of_fuel = ex1[7]
												ex2 = re.split(r'<span class="data\-list__value data\-list__value\-\-action">Buy Now ([^<]+)</span>', ex1[8])
												if len(ex2) > 1:
													if item_user_filters['buy_it_now'] == '':
														continue
													price = 'Цена, если купить сейчас: '+re.sub(r'[^0-9]', '', ex2[1])
												else:
													price = '0'
												damage = damage.replace(u'None', 'Повреждения отсуствуют').replace(u'Unknown', 'Повреждения неизвестны').replace(u'Normal Wear & Tear', 'Нормальное состояние').replace(u'All Over', 'Повреждения везде').replace(u'Bio Hazard', 'Биологическая опасность').replace(u'Cash-4-Clunker', 'Не подлежит восстановлению').replace(u'Electrical', 'Повреждения электрики').replace(u'Engine Burn', 'Повреждения огнем').replace(u'Engine Damage', 'Поломка двигателя').replace(u'Exterior Burn', 'Внешние ожоги').replace(u'Interior Burn', 'Ожоги огнем в салоне').replace(u'Flood', 'Наводнение').replace(u'Frame', 'Повреждения рамы').replace(u'Fresh Water', 'Повреждения от пресной воды').replace(u'Salt Water', 'Повреждения от соленой воды').replace(u'Front & Rear', 'Повреждения в передней и задней части').replace(u'Front End', 'Повреждения в передней части').replace(u'Hail', 'Повреждения от града').replace(u'Left & Right', 'Повреждения по бокам').replace(u'Left Front', 'Повреждения с левой стороны в передней части').replace(u'Left Rear', 'Повреждения с левой стороны в задней части').replace(u'Left Side', 'Повреждения левая сторона').replace(u'Mechanical', 'Механические повреждения').replace(u'Rear', 'Повреждения в задней части').replace(u'Repossession', 'Конфискация').replace(u'Right Front', 'Повреждения с права в передней части').replace(u'Right Rear', 'Повреждения с права в задней части').replace(u'Right Side', 'Повреждена правая сторона').replace(u'Rollover', 'Повреждения вокруг').replace(u'Roof', 'Повреждения на крыше').replace(u'Storm Damage', 'Повреждения от бури').replace(u'Strip', 'Разобран или не хватает какой-то части').replace(u'Suspension', 'Повреждения подвеска').replace(u'Theft', 'Повреждения от взлома').replace(u'Total Burn', 'Было возгорание').replace(u'Transmission', 'Повреждения трансмиссии').replace(u'Undercarriage', 'Повреждения ходовой части').replace(u'Vandalized', 'Повреждения от вандализма')
												damage = ', '+damage
												type_of_fuel = type_of_fuel.replace(u'Diesel', 'Дизель').replace(u'Flexible Fuel', 'Гибкое топливо').replace(u'Electric', 'Электрический двигатель').replace(u'Gasoline', 'Газ').replace(u'Hybrid', 'Гибридный двигатель')
												type_of_fuel = ', '+type_of_fuel
												
												ex2 = re.split(r'<span class="data\-list__label"( title="VIN: ([^"]+)")?>VIN:</span>', ex1[8])
												if len(ex2) > 2:
													if ex2[2]:
														vin_code = ex2[2]
													else:
														vin_code = ''
												else:
													vin_code = ''
												
												if item_user_filters['the_date_of_the'] == 'only_with_date':
													if re.search(r'<span class="data\-list__value data\-list__value\-\-action">[^<]+</span>', ex1[8]) == None:
														continue
												
												if item_user_filters['the_date_of_the'] == 'only_no_date':
													if re.search(r'<span class="data\-list__value data\-list__value\-\-action">[^<]+</span>', ex1[8]) != None:
														continue
														
												params = year + mileage + damage + type_of_fuel + engine
												
												hash = hashlib.md5((brands_and_model + params + price).encode('utf-8')).hexdigest()
												hash = hash[:20]
												is_find_hash = False
												
												lock_6.acquire()
												try:
													if id_telegram_channel in hashes_results:
														is_find_hash = hash in hashes_results[id_telegram_channel]
														if not is_find_hash:
															hashes_results[id_telegram_channel].append(hash)
													else:
														hashes_results[id_telegram_channel] = [hash]
												finally:
													lock_6.release()
												
												if not is_find_hash:
													result_count += 1
													temp_result.append({'id_telegram_channel':id_telegram_channel, 'link_to_auction':link_to_auction, 'preview_img':preview_img, 'brands_and_model':brands_and_model, 'params':params, 'price':price, 'customs_clearance':'', 'hash':hash, 'id':item_user_filters['id'], 'currency':currency, 'vin_code':vin_code})
												
												if result_count >= result_limit:
													result_complete = True
													break
									
									if result_complete:
										break

								else:
									lock_11.acquire()
									try:
										log_error_parse('('+url+') [Не удалось найти теги с классом "table-body border-l border-r" и "table-row table-row-border"] '+python_eol + req.text, site)
									finally:
										lock_11.release()
									is_failed_parse = True
									
					time.sleep(1.4)
				
				if len(temp_result) > 0:
					lock_2.acquire()
					try:
						for item in temp_result:
							if not site in sites_auction:
								break
							if item['id_telegram_channel'] in final_result:
								final_result[item['id_telegram_channel']] += [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
							else:
								final_result[item['id_telegram_channel']] = [{'link_to_auction':item['link_to_auction'], 'preview_img':item['preview_img'], 'brands_and_model':item['brands_and_model'], 'params':item['params'], 'price':item['price'], 'customs_clearance':item['customs_clearance'], 'hash':item['hash'], 'country_code':country_code, 'id':item['id'], 'currency':item['currency'], 'vin_code':item['vin_code']}]
					finally:
						lock_2.release()
					temp_result = []
				
				time.sleep(1.4)
			
			lock_5.acquire()
			try:
				parsing_sites_condition[site] = 'sleep'
			finally:
				lock_5.release()
			
			time.sleep(parse_auction_interval)

		if site in parsing_sites_condition:
			parsing_sites_condition.pop(site)
		
	except Exception:
			
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def webdriver_check_exists_element(driver, timeout, type, act):

	co = 0

	while True:

		try:
			
			elem = None
			if type == 'find_element_by_id':
				elem = driver.find_element_by_id(act)
			if type == 'find_element_by_class_name':
				elem = driver.find_element_by_class_name(act)
			if type == 'find_element_by_xpath':
				elem = driver.find_element_by_xpath(act)
			return elem

		except Exception:
			pass

		co += 1
		if co == timeout:
			return False

		time.sleep(1)

def auth_and_get_cookies__copart_com( login, password, is_yet_auth):

	global driver

	try:
		
		driver.switch_to.window(browser_tabs['copart.com']['tab'])
		url = 'https://www.copart.com/ru/login/'

		driver.get(url)
		time.sleep(5)

		if is_yet_auth:
			
			elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'username')
			if elem:
				elem.send_keys(login)
			else:
				lock_11.acquire()
				try:
					log_error_parse('('+url+') [Не удалось найти елемент "username" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'copart.com')
				finally:
					lock_11.release()
				return [False, 'Не удалось найти елемент "username" за 30 секунд ожидания']
			
			elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'password')
			if elem:
				elem.send_keys(password)
				elem.submit()
			else:
				lock_11.acquire()
				try:
					log_error_parse('('+url+') [Не удалось найти елемент "password" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'copart.com')
				finally:
					lock_11.release()
				return [False, 'Не удалось найти елемент "password" за 30 секунд ожидания']

			co = 0
			is_auth = False
			error_mess = 'Не удалось найти елементы "headerloggedInUserDropdown" или ng-repeat="alert in loginAlerts" за 30 секунд ожидания'

			while True:

				try:

					if driver.find_element_by_id('headerloggedInUserDropdown'):
						is_auth = True
						break

				except Exception:

					try:
						
						elem = driver.find_element_by_xpath('//div[@ng-repeat="alert in loginAlerts"]/span[1]/span[1]')
						if elem:
							error_mess = elem.text
							break

					except Exception:
						pass

				co += 1
				if co == 30:
					break

				time.sleep(1)

			if is_auth:

				time.sleep(30)
				dictt = {}
				all_cookies = driver.get_cookies()
				for item in all_cookies:
					dictt[item['name']] = item['value']

				return ['ok', copy.deepcopy(dictt)]

			else:
				
				lock_14.acquire()
				try:
					log_error_auth(error_mess, 'copart.com')
				finally:
					lock_14.release()

				return [False, error_mess]

		else:

			is_auth = False
			co = 0
			
			while True:

				try:

					if driver.find_element_by_id('headerloggedInUserDropdown'):
						is_auth = True
						break

				except Exception:

					try:

						if driver.find_element_by_xpath('//a[@data-uname="homePageSignIn"]'):
							is_auth = False
							break

					except Exception:
						pass

				co += 1
				if co == 30:
					break

				time.sleep(1)

			if is_auth:
				
				time.sleep(30)
				dictt = {}
				all_cookies = driver.get_cookies()
				for item in all_cookies:
					dictt[item['name']] = item['value']

				return ['ok', copy.deepcopy(dictt)]

			else:

				return ['yet_auth', None]

	except Exception:

		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

			return [False, 'Other error']

def auth_and_get_cookies__iaai_com( login, password, is_yet_auth):

	global driver

	try:
		
		driver.switch_to.window(browser_tabs['iaai.com']['tab'])
		url = 'https://www.iaai.com/MyDashboard/Default'

		driver.get(url)
		time.sleep(5)

		if is_yet_auth:
			
			elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'Email')
			if elem:
				elem.send_keys(login)
			else:
				lock_11.acquire()
				try:
					log_error_parse('('+url+') [Не удалось найти елемент "Email" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'iaai.com')
				finally:
					lock_11.release()
				return [False, 'Не удалось найти елемент "Email" за 30 секунд ожидания']
			
			elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', 'Password')
			if elem:
				elem.send_keys(password)
				time.sleep(10)
				elem.submit()
			else:
				lock_11.acquire()
				try:
					log_error_parse('('+url+') [Не удалось найти елемент "Password" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'iaai.com')
				finally:
					lock_11.release()
				return [False, 'Не удалось найти елемент "Password" за 30 секунд ожидания']

			co = 0
			is_auth = False
			error_mess = 'Не удалось найти елементы "profile__info" или id="lblErrorMessage" или id="lblEmailMessage" за 30 секунд ожидания'

			while True:

				try:

					if driver.find_element_by_class_name('profile__info'):
						is_auth = True
						break

				except Exception:

					try:
						
						elem = driver.find_element_by_xpath('//div[@id="lblErrorMessage"]/p[1]')
						if elem and elem.is_displayed():
							error_mess = elem.text
							break

						elem = driver.find_element_by_xpath('//div[@id="lblEmailMessage"]/p[1]')
						if elem and elem.is_displayed():
							error_mess = elem.text
							break

					except Exception:
						pass

				co += 1
				if co == 30:
					break

				time.sleep(1)

			if is_auth:

				time.sleep(30)
				dictt = {}
				all_cookies = driver.get_cookies()
				for item in all_cookies:
					dictt[item['name']] = item['value']

				return ['ok', copy.deepcopy(dictt)]

			else:
				
				lock_14.acquire()
				try:
					log_error_auth(error_mess, 'iaai.com')
				finally:
					lock_14.release()

				return [False, error_mess]

		else:

			is_auth = False
			co = 0
			
			while True:

				try:

					if driver.find_element_by_class_name('profile__info'):
						is_auth = True
						break

				except Exception:

					try:

						if driver.find_element_by_class_name('login-form'):
							is_auth = False
							break

					except Exception:
						pass

				co += 1
				if co == 30:
					break

				time.sleep(1)

			if is_auth:
				
				time.sleep(30)
				dictt = {}
				all_cookies = driver.get_cookies()
				for item in all_cookies:
					dictt[item['name']] = item['value']

				return ['ok', copy.deepcopy(dictt)]

			else:

				return ['yet_auth', None]

	except Exception:

		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

			return [False, 'Other error']

def parse_edit_app():
	
	global edit_app
	
	try:
	
		if not os.path.isfile(install_dir+'/edit_app.conf'):
			color_print.print_fail('File "'+install_dir+'/edit_app.conf" no exists')
			sys.exit(1)
			
		lines = []
		with open(install_dir+'/edit_app.conf', 'r', encoding = 'utf-8') as f:
			lines = f.readlines()
		
		if len(lines) < 1:
			color_print.print_fail('Invalid "'+install_dir+'/edit_app.conf" file')
			sys.exit(1)
			
		ex = re.split(r'^requests_timeout ?= ?([0-9\.]+)', lines[0].strip())
		if len(ex) > 1:
			edit_app['requests_timeout'] = float(ex[1])
		else:
			color_print.print_fail('requests_timeout variable set incorrectly in "'+install_dir+'/edit_app.conf" file')
			sys.exit(1)
	
		lines = []
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def parse_filters():
	
	global auction_filters
	
	try:
		
		path, dirs, files = next(os.walk(install_dir+'/filters'))
		
		for i in files:
			
			file = path+'/'+i
			lines = []
			
			ex = re.split(r'_([a-z]{2})_([0-9]{1})\.conf', i)
			if len(ex) > 2:
				country_code = ex[1]
				auction_number = int(ex[2])
			else:
				continue
			
			if not os.path.isfile(file):
				color_print.print_fail('File "'+file+'" no exists')
				sys.exit(1)
					
			with open(file, 'r', encoding = 'utf-8') as f:
				lines = f.readlines()
				
			if i == 'filters_car_de_1.conf':
				
				if len(lines) < 6:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^brands = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['brands'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('brands variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^models = \{((\'[^\']+\':\{(\'[^\']+\':\'[^\']+\',? ?)+\},? ?)+)\}', lines[1].strip())
				if len(ex) > 2:
					
					ex = re.split(r'\}', ex[1])
					for item in ex:
						value = {}
						ex1 = re.split(r'\'([^\']+)\':\{((\'[^\']+\':\'[^\']+\',? ?)+)', item)
						if len(ex1) > 2:
							ex2 = re.split(r',', ex1[2])
							for item1 in ex2:
								ex3 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item1)
								if len(ex3) > 2:
									value[ex3[1]] = ex3[2]
							auction_filters[country_code][auction_number]['car']['models'][ex1[1]] = value
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^type_of_fuel = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['type_of_fuel'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('type_of_fuel variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^prices = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['car']['prices'].append(ex1[1])
					
				else:
					color_print.print_fail('prices variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['car']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^mileage = \[((\'[^\']+\',? ?)+)\]', lines[5].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['car']['mileage'].append(ex1[1])
					
				else:
					color_print.print_fail('mileage variable set incorrectly in "'+file+'" file')
					sys.exit(1)
					
			elif i == 'filters_truck_de_1.conf':
				
				if len(lines) < 8:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^categories = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['truck']['categories'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('categories variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^models = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[1].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['truck']['models'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^prices = \[((\'[^\']+\',? ?)+)\]', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['truck']['prices'].append(ex1[1])
					
				else:
					color_print.print_fail('prices variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^mileage = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['truck']['mileage'].append(ex1[1])
					
				else:
					color_print.print_fail('mileage variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['truck']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^wheel_formula = \[((\'[^\']+\',? ?)+)\]', lines[5].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['truck']['wheel_formula'].append(ex1[1])
					
				else:
					color_print.print_fail('wheel_formula variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^axles = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[6].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['truck']['axles'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('axles variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^environmental_class = \[((\'[^\']+\',? ?)+)\]', lines[7].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['truck']['environmental_class'].append(ex1[1])
					
				else:
					color_print.print_fail('environmental_class variable set incorrectly in "'+file+'" file')
					sys.exit(1)
			
			elif i == 'filters_tractor_de_1.conf':
				
				if len(lines) < 8:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^categories = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['tractor']['categories'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('categories variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^models = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[1].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['tractor']['models'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^prices = \[((\'[^\']+\',? ?)+)\]', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['tractor']['prices'].append(ex1[1])
					
				else:
					color_print.print_fail('prices variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^mileage = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['tractor']['mileage'].append(ex1[1])
					
				else:
					color_print.print_fail('mileage variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['tractor']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^wheel_formula = \[((\'[^\']+\',? ?)+)\]', lines[5].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['tractor']['wheel_formula'].append(ex1[1])
					
				else:
					color_print.print_fail('wheel_formula variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^axles = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[6].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['tractor']['axles'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('axles variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^environmental_class = \[((\'[^\']+\',? ?)+)\]', lines[7].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['tractor']['environmental_class'].append(ex1[1])
					
				else:
					color_print.print_fail('environmental_class variable set incorrectly in "'+file+'" file')
					sys.exit(1)
			
			elif i == 'filters_semitrailer_de_1.conf':
				
				if len(lines) < 5:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^categories = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['semitrailer']['categories'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('categories variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^models = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[1].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['semitrailer']['models'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^prices = \[((\'[^\']+\',? ?)+)\]', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['semitrailer']['prices'].append(ex1[1])
					
				else:
					color_print.print_fail('prices variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['semitrailer']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^axles = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['semitrailer']['axles'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('axles variable set incorrectly in "'+file+'" file')
					sys.exit(1)
			
			elif i == 'filters_constructionmachine_de_1.conf':
				
				if len(lines) < 4:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^categories = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['constructionmachine']['categories'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('categories variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^models = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[1].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['constructionmachine']['models'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^prices = \[((\'[^\']+\',? ?)+)\]', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['constructionmachine']['prices'].append(ex1[1])
					
				else:
					color_print.print_fail('prices variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['constructionmachine']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
			elif i == 'filters_car_us_1.conf':
				
				if len(lines) < 5:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^brands = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['brands'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('brands variable set incorrectly in "'+file+'" file')
					sys.exit(1)
					
				ex = re.split(r'^models = \{((\'[^\']+\':\[(\'[^\']+\',? ?)*\],? ?)+)\}', lines[1].strip())
				if len(ex) > 2:
					
					ex = re.split(r'\]', ex[1])
					for item in ex:
						value = []
						ex1 = re.split(r'\'([^\']+)\':\[((\'[^\']+\',? ?)*)', item)
						if len(ex1) > 2:
							ex2 = re.split(r',', ex1[2])
							for item1 in ex2:
								ex3 = re.split(r'\'([^\']+)\'', item1)
								if len(ex3) > 1:
									value.append(ex3[1])
							auction_filters[country_code][auction_number]['car']['models'][ex1[1]] = value
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)	
					
				ex = re.split(r'^type_of_fuel = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['type_of_fuel'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('type_of_fuel variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['car']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^damage = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['damage'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('damage variable set incorrectly in "'+file+'" file')
					sys.exit(1)
			
			elif i == 'filters_car_us_2.conf':
				
				if len(lines) < 5:
					color_print.print_fail('Invalid "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^brands = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[0].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['brands'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('brands variable set incorrectly in "'+file+'" file')
					sys.exit(1)
					
				ex = re.split(r'^models = \{((\'[^\']+\':\[(\'[^\']+\',? ?)*\],? ?)+)\}', lines[1].strip())
				if len(ex) > 2:
					
					ex = re.split(r'\]', ex[1])
					for item in ex:
						value = []
						ex1 = re.split(r'\'([^\']+)\':\[((\'[^\']+\',? ?)*)', item)
						if len(ex1) > 2:
							ex2 = re.split(r',', ex1[2])
							for item1 in ex2:
								ex3 = re.split(r'\'([^\']+)\'', item1)
								if len(ex3) > 1:
									value.append(ex3[1])
							auction_filters[country_code][auction_number]['car']['models'][ex1[1]] = value
					
				else:
					color_print.print_fail('models variable set incorrectly in "'+file+'" file')
					sys.exit(1)	
					
				ex = re.split(r'^type_of_fuel = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[2].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['type_of_fuel'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('type_of_fuel variable set incorrectly in "'+file+'" file')
					sys.exit(1)
				
				ex = re.split(r'^years_of_release = \[((\'[^\']+\',? ?)+)\]', lines[3].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\'', item)
						if len(ex1) > 1:
							auction_filters[country_code][auction_number]['car']['years_of_release'].append(ex1[1])
					
				else:
					color_print.print_fail('years_of_release variable set incorrectly in "'+file+'" file')
					sys.exit(1)
					
				ex = re.split(r'^damage = \{((\'[^\']+\':\'[^\']+\',? ?)+)\}', lines[4].strip())
				if len(ex) > 1:
					
					ex = re.split(r',', ex[1])
					for item in ex:
						ex1 = re.split(r'\'([^\']+)\':\'([^\']+)\'', item)
						if len(ex1) > 2:
							auction_filters[country_code][auction_number]['car']['damage'][ex1[1]] = ex1[2]
					
				else:
					color_print.print_fail('damage variable set incorrectly in "'+file+'" file')
					sys.exit(1)
			
		lines = []
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def parse_sites_conf(act = ''):
	
	global sites_auction, sites_search_vin
	
	try:
		
		sites_auction = {}
		sites_search_vin = {}

		if not os.path.isfile(install_dir+'/auctions.conf'):
			color_print.print_fail('File "'+install_dir+'/auctions.conf" no exists')
			sys.exit(1)
			
		lines = []
		with open(install_dir+'/auctions.conf', 'r', encoding = 'utf-8') as f:
			lines = f.readlines()
		
		lock_4.acquire()
		try:
			for item in lines:
				ex = re.split(r'^([a-z]{2})\|(eur|usd)\|(#?[a-z0-9\.]+)\|([0-9]+)\|([0-9]+)\|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})?\|([0-9]{4,5})?\|([a-zA-Z0-9_]*?)\|([a-zA-Z0-9_]*?)\|([0-9]{1,})\|(.*?)\|(.*?)$', item.strip())
				if len(ex) > 12:
					country_code = ex[1]
					currency = ex[2]
					site = ex[3]
					parse_auction_interval = int(ex[5])
					if ex[6] != None:
						proxy_host = ex[6]
					else:
						proxy_host = ''
					if ex[7] != None:
						proxy_port = ex[7]
					else:
						proxy_port = ''
					if ex[8] != None:
						proxy_username = ex[8]
					else:
						proxy_username = ''
					if ex[9] != None:
						proxy_password = ex[9]
					else:
						proxy_password = ''
					if proxy_host == '' or proxy_port == '':
						proxy_host = ''
						proxy_port = ''
					if proxy_port == '' or proxy_username == '' or proxy_password == '':
						proxy_username = ''
						proxy_password = ''
					result_limit = int(ex[10])
					if ex[11] != None:
						auction_auth_username = ex[11]
					else:
						auction_auth_username = ''
					if ex[12] != None:
						auction_auth_password = ex[12]
					else:
						auction_auth_password = ''
					if re.search('#', site) == None:
						sites_auction[site] = {'country_code':country_code, 'currency':currency, 'parse_auction_interval':parse_auction_interval, 'proxy_host':proxy_host, 'proxy_port':proxy_port, 'proxy_username':proxy_username, 'proxy_password':proxy_password, 'result_limit':result_limit, 'auction_auth_username':auction_auth_username, 'auction_auth_password':auction_auth_password}
		finally:
			lock_4.release()

		if not os.path.isfile(install_dir+'/search_vin.conf'):
			color_print.print_fail('File "'+install_dir+'/search_vin.conf" no exists')
			sys.exit(1)
			
		lines = []
		with open(install_dir+'/search_vin.conf', 'r', encoding = 'utf-8') as f:
			lines = f.readlines()

		lock_15.acquire()
		try:
			for item in lines:
				ex = re.split(r'^(.+)\|(.*?)\|(.*?)$', item.strip())
				if len(ex) > 3:
					site = ex[1]
					if ex[2] != None:
						search_vin_username = ex[2]
					else:
						search_vin_username = ''
					if ex[3] != None:
						search_vin_password = ex[3]
					else:
						search_vin_password = ''
					sites_search_vin[site] = {'search_vin_username':search_vin_username, 'search_vin_password':search_vin_password}
		finally:
			lock_15.release()

		if act == 'reload':
			launch_auction_parsing()
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

def launch_auction_parsing():
	
	threading.Thread(target = parse__mobile_de, args = ()).start()
	threading.Thread(target = parse__copart_com, args = ()).start()
	threading.Thread(target = parse__iaai_com, args = ()).start()

def check_course():
	
	global course
	
	try:
		
		while True:
			
			for item in course:
			
				if item == 'eur':
					url = 'https://www.google.com/search?sxsrf=ALeKk01BqUpjXEKy8xM6lP9_GS_BmAL5eA%3A1613582960586&ei=cFItYJWyI4qyrgS4xqPQDA&q=%D0%B5%D0%B2%D1%80%D0%BE+%D0%BA+%D0%B3%D1%80%D0%B8%D0%B2%D0%BD%D0%B5&oq=%D0%B5%D0%B2%D1%80%D0%BE+%D0%BA+%D0%B3%D1%80%D0%B8%D0%B2%D0%BD%D0%B5&gs_lcp=Cgdnd3Mtd2l6EAwyCQgAEEMQRhCCAjIGCAAQBxAeMgYIABAHEB4yAggAMgIIADICCAAyAggAMgIIADICCAAyAggAOgcIABCwAxBDOgQIIxAnUKKsA1iirANg67cgaAJwAngAgAGoDogBhhOSAQswLjEuNC0xLjgtMZgBAKABAqABAaoBB2d3cy13aXrIAQrAAQE&sclient=gws-wiz&ved=0ahUKEwiVqrn5uPHuAhUKmYsKHTjjCMoQ4dUDCA0'
				else:
					url = 'https://www.google.com/search?biw=1223&bih=605&sxsrf=ALeKk00_Na8op5QginxmoCjf77Z0py74Vw%3A1613585272047&ei=eFstYJWlAuH0qwGk6oT4Cg&q=%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80+%D0%BA+%D0%B3%D1%80%D0%B8%D0%B2%D0%BD%D0%B5&oq=%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80+%D0%BA+%D0%B3%D1%80%D0%B8%D0%B2%D0%BD%D0%B5&gs_lcp=Cgdnd3Mtd2l6EAMyBAgjECcyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADICCAA6BwgAEEcQsANQookTWKKJE2CcmRNoAXACeACAAesRiAGPE5IBBzAuMS45LTGYAQCgAQGqAQdnd3Mtd2l6yAEIwAEB&sclient=gws-wiz&ved=0ahUKEwiVwdHHwfHuAhVh-ioKHSQ1Aa8Q4dUDCA0&uact=5'
				
				try:
					req = requests.get(url, timeout = edit_app['requests_timeout'], headers = default_http_headers)
				except requests.exceptions.RequestException:
					continue
				
				ex = re.split(r'<span class="DFlfde SwHCTb" data\-precision="2" data\-value="([0-9\.]+)">([0-9,]+)</span>', req.text)
				if len(ex) > 2:
					course[item] = float(ex[1][:5])
				
				time.sleep(10)
			
			text = ''
			for item in course:
				text += item+':'+str(course[item]) + python_eol

			with open(install_dir+'/course.log', 'r+', encoding = 'utf-8') as f:
				f.truncate(0)
				f.write(text)
			
			time.sleep(3600)
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_check_course, args = ()).start()

def restart_check_course():
	time.sleep(5)
	threading.Thread(target = check_course, args = ()).start()

def calc_customs_clearance(engine_volume, car_price, years_of_release, type_of_fuel, currency):
	
	if engine_volume and car_price and years_of_release and type_of_fuel and currency:
	
		dictt = {2021:1, 2020:1, 2019:1, 2018:2, 2017:3, 2016:4, 2015:5, 2014:6, 2013:7, 2012:8, 2011:9, 2010:10, 2009:11, 2008:12, 2007:13, 2006:14, 2005:15}
		
		engine_volume = int(engine_volume)
		car_price = int(car_price)
		years_of_release = int(years_of_release)
		
		if years_of_release < 2006:
			years_of_release = 2005
		y = dictt[years_of_release]
		
		k = 0
		c = course[currency]
		
		if type_of_fuel == 'petrol':
			
			if engine_volume <= 3000:
				k = 50
			else:
				k = 100
		
		elif type_of_fuel == 'diesel':
		
			if engine_volume <= 3500:
				k = 75
			else:
				k = 150
		
		cb = c * car_price
		
		cbo = math.trunc(float(cb) * 100) / 100
		cbo2 = math.trunc(float(cbo * 0.1) * 100) / 100
		
		n = str(k * (engine_volume/1000) * y * course['eur'])
		ex = re.split(r'\.', n)
		if len(ex) > 1:
			n1 = ex[0]
			n2 = ex[1][:2]
			if len(n2) < 2:
				n2 += '0'
			aa2o = float(n1+'.'+n2)
		else:
			aa2o = float(ex[0]+'.00')
		
		cbocbo2 = (float(cbo) + float(cbo2) + float(aa2o))
		cbocbo2 = math.trunc(float(cbocbo2) * 100) / 100
		
		cbocbo22 = math.trunc(float(cbocbo2 * 0.2) * 100) / 100
		
		sum = (float(cbo2) + float(aa2o) + float(cbocbo22))
		sum = math.trunc(float(sum) * 100) / 100
		
		sum2 = math.trunc(float(sum / c) * 100) / 100
		
		return str(sum2)
		
	else:
	
		return ''

def htmlspecialchars(text):
	return text.replace(u'&', u'&amp;').replace(u'"', u'&quot;').replace(u"'", u'&#039;').replace(u'<', u'&lt;').replace(u'>', u'&gt;')

def check_clear_cache():
	
	global hashes_results
	
	try:
		
		while True:
			
			if os.path.isfile(install_dir+'/clear_cache'):
			
				lines = []
				with open(install_dir+'/clear_cache', 'r', encoding = 'utf-8') as f:
					lines = f.readlines()
			
				lock_6.acquire()
				try:
					for item in lines:
						item = item.strip()
						if item in hashes_results:
							hashes_results.pop(item)
				finally:
					lock_6.release()
				
				lock_12.acquire()
				try:
					for item in lines:
						item = item.strip()
						if os.path.isfile(install_dir+'/hashes_results/'+item):
							os.remove(install_dir+'/hashes_results/'+item)
				finally:
					lock_12.release()
				
				os.remove(install_dir+'/clear_cache')
				
			time.sleep(1)
		
	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_check_clear_cache, args = ()).start()

def restart_check_clear_cache():
	time.sleep(5)
	threading.Thread(target = check_clear_cache, args = ()).start()

def init_selenium_and_launch_browser(act):

	if is_not_selenium:
		return False
	
	global browser_tabs

	try:
		
		if act == 'check':

			lines = []
			proc = subprocess.Popen('ps -ela | grep "firefox" 2>&1', shell = True, stdout = subprocess.PIPE)
			lines = proc.stdout.readlines()
			proc.communicate()
			
			if len(lines) > 0:

				for item in lines:

					item = re.sub(r'  +', ' ', str(item))

					if not '<defunct>' in item:
						ex = re.split(r'b\'[0-9]+ S [0-9]+ ([0-9]+) ', item)
						if len(ex) > 1:
							pid = ex[1]
							proc = subprocess.Popen('kill '+pid, shell = True, stdout = subprocess.PIPE)
							proc.communicate()

					if '<defunct>' in item:
						ex = re.split(r'b\'[0-9]+ Z [0-9]+ [0-9]+ ([0-9]+) ', item)
						if len(ex) > 1:
							pid = ex[1]
							proc = subprocess.Popen('kill '+pid, shell = True, stdout = subprocess.PIPE)
							proc.communicate()

				time.sleep(1)

			if not os.path.isfile('/usr/bin/java'):
				color_print.print_fail('The "java" interpreter is not installed on the system')
				sys.exit(1)

			if not os.path.isfile('/usr/local/bin/firefox/firefox'):
				color_print.print_fail('The "firefox" browser is not installed on the system')
				sys.exit(1)
			
			if not os.path.isfile('/usr/local/bin/geckodriver'):
				color_print.print_fail('The "geckodriver" webdriver is not installed on the system')
				sys.exit(1)

			lines = []
			proc = subprocess.Popen('find / -name "selenium-server-standalone-*.jar" 2>&1', shell = True, stdout = subprocess.PIPE)
			lines = proc.stdout.readlines()
			proc.communicate()
			
			if len(lines) == 0:
				color_print.print_fail('"selenium-server-standalone-*.jar" not found in the system')
				sys.exit(1)

			lines = []
			proc = subprocess.Popen('ps -ela | grep "java" 2>&1', shell = True, stdout = subprocess.PIPE)
			lines = proc.stdout.readlines()
			proc.communicate()
			
			if len(lines) == 0:
				color_print.print_fail('"java" is not running on the system')
				sys.exit(1)
			
			lines = []
			proc = subprocess.Popen('ps -ela | grep "Xvfb" 2>&1', shell = True, stdout = subprocess.PIPE)
			lines = proc.stdout.readlines()
			proc.communicate()
			
			if len(lines) == 0:
				color_print.print_fail('"Xvfb" is not running on the system')
				sys.exit(1)

		else:

			options = webdriver.FirefoxOptions()
			options.add_argument('--headless')
			options.add_argument('--disable-gpu')
			options.add_argument('--no-sandbox')
			options.add_argument('--incognito')
			options.binary_location = '/usr/local/bin/firefox/firefox'

			driver = webdriver.Firefox(options = options, executable_path = '/usr/local/bin/geckodriver')
			driver.set_window_size(1440, 900)
			driver.get('https://www.copart.com/ru/login/')
			time.sleep(3)
			driver.execute_script('window.open("about:blank");')
			time.sleep(3)
			browser_tabs['copart.com']['tab'] = driver.window_handles[0]
			browser_tabs['autoastat.com']['tab'] = driver.window_handles[1]
			driver.switch_to.window(browser_tabs['autoastat.com']['tab'])
			driver.get('https://autoastat.com/en/login')
			time.sleep(3)
			driver.execute_script('window.open("about:blank");')
			time.sleep(3)
			browser_tabs['iaai.com']['tab'] = driver.window_handles[2]
			driver.switch_to.window(browser_tabs['iaai.com']['tab'])
			driver.get('https://www.iaai.com/MyDashboard/Default')
			#time.sleep(3)
			#driver.execute_script('window.open("about:blank");')
			#time.sleep(3)
			#browser_tabs['autoauctions.io']['tab'] = driver.window_handles[3]
			#driver.switch_to.window(browser_tabs['autoauctions.io']['tab'])
			#driver.get('https://autoauctions.io')
			lines = []
			proc = subprocess.Popen('ps -ela | grep "firefox" 2>&1', shell = True, stdout = subprocess.PIPE)
			lines = proc.stdout.readlines()
			proc.communicate()
			
			for item in lines:

				item = re.sub(r'  +', ' ', str(item))

				if '<defunct>' in item:
					ex = re.split(r'b\'[0-9]+ Z [0-9]+ [0-9]+ ([0-9]+) ', item)
					if len(ex) > 1:
						pid = ex[1]
						proc = subprocess.Popen('kill '+pid, shell = True, stdout = subprocess.PIPE)
						proc.communicate()

			time.sleep(30)
			return driver

	except Exception:
		
		if act == 'check':

			color_print.print_fail(traceback.format_exc().strip())
			sys.exit(1)
		
		else:

			lock_1.acquire()
			try:
				log_error(traceback.format_exc().strip())
			except Exception:
				pass
			finally:
				lock_1.release()
				return False

def update_auth__autoastat_com():

	global driver

	try:
		
		cookies = {}
		is_sleep_300_sec = False

		while True:
			
			if is_sleep_300_sec:
				is_sleep_300_sec = False
				time.sleep(300)
			
			if (driver) and (not 'time_update_cookies' in cookies or (time.time() - float(cookies['time_update_cookies'])) > 10800):

				lock_13.acquire()
				try:
					
					url = 'https://autoastat.com/en/login'
					driver.switch_to.window(browser_tabs['autoastat.com']['tab'])
					driver.get(url)

					if 'We\'re undergoing a bit of<br>scheduled maintenance.' in driver.page_source:
						is_sleep_300_sec = True
						continue
					
					if len(cookies) == 0:
						
						if 'autoastat.com' in sites_search_vin and sites_search_vin['autoastat.com']['search_vin_username'] and sites_search_vin['autoastat.com']['search_vin_password']:

							elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', '_username')
							if elem:
								elem.send_keys(sites_search_vin['autoastat.com']['search_vin_username'])
							else:
								lock_11.acquire()
								try:
									log_error_parse('('+url+') [Не удалось найти елемент "_username" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'autoastat.com')
								finally:
									lock_11.release()
								is_sleep_300_sec = True
								continue

							elem = webdriver_check_exists_element(driver, 30, 'find_element_by_id', '_password')
							if elem:
								elem.send_keys(sites_search_vin['autoastat.com']['search_vin_password'])
								elem.submit()
							else:
								lock_11.acquire()
								try:
									log_error_parse('('+url+') [Не удалось найти елемент "_password" за 30 секунд ожидания] '+ python_eol + driver.page_source, 'autoastat.com')
								finally:
									lock_11.release()
								is_sleep_300_sec = True
								continue

							co = 0
							is_auth = False
							error_mess = 'Не удалось найти елементы "user-header-menu" или "alert alert-danger" за 30 секунд ожидания'

							while True:

								try:

									if driver.find_element_by_id('user-header-menu'):
										is_auth = True
										break

								except Exception:

									try:

										elem = driver.find_element_by_xpath('//div[@class="alert alert-danger"]')
										if elem:
											error_mess = elem.text
											break

									except Exception:
										pass

								co += 1
								if co == 30:
									break

								time.sleep(1)

							if is_auth:

								cookies['time_update_cookies'] = str(time.time())

							else:
								
								lock_14.acquire()
								try:
									log_error_auth(error_mess, 'autoastat.com')
								finally:
									lock_14.release()
							
					else:

						is_auth = False

						while True:

							try:

								if driver.find_element_by_class_name('user-header-menu'):
									is_auth = True
									break

							except Exception:

								try:

									if driver.find_element_by_xpath('//a[@href="https://autoastat.com/en/login"]'):
										is_auth = False
										break

								except Exception:
									pass

							co += 1
							if co == 30:
								break

							time.sleep(1)

						if is_auth:
							
							cookies['time_update_cookies'] = str(time.time())

						else:

							cookies = {}
							continue

				finally:
					lock_13.release()

			time.sleep(300)

	except Exception:

		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()
			threading.Thread(target = restart_update_auth__autoastat_com, args = ()).start()

def restart_update_auth__autoastat_com():
	time.sleep(5)
	threading.Thread(target = update_auth__autoastat_com, args = ()).start()

def preparing_and_checking_files():
	
	global hashes_results, course, telegram_token, cache_of_vin_codes

	try:
		
		user_run = os.getenv('USER')
		if user_run and user_run != 'root':
			color_print.print_fail('Run application only with root privileges')
			sys.exit(1)
		
		lenn = len(sys.argv)
		if lenn < 2:
			color_print.print_fail('Not enough arguments passed ('+str(lenn)+'). Usage: '+sys.argv[0]+' start|stop|status|restart')
			sys.exit(1)
		
		parse_edit_app()
		parse_filters()
		parse_sites_conf()
		
		if not os.path.isfile(install_dir+'/errors.log'):
			with open(install_dir+'/errors.log', 'w+'):
				pass

		if not os.path.exists(install_dir+'/users'):
			os.mkdir(install_dir+'/users')
				
		if not os.path.exists(install_dir+'/log_error_parse'):
			os.mkdir(install_dir+'/log_error_parse')
		
		if not os.path.exists(install_dir+'/log_error_auth'):
			os.mkdir(install_dir+'/log_error_auth')

		if not os.path.exists(install_dir+'/user_filters'):
			os.mkdir(install_dir+'/user_filters')
			
		if not os.path.exists(install_dir+'/hashes_results'):
			os.mkdir(install_dir+'/hashes_results')
		
		if not os.path.isfile(install_dir+'/cache_of_vin_codes'):
			with open(install_dir+'/cache_of_vin_codes', 'w+'):
				pass

		if not os.path.isfile(install_dir+'/telegram_token'):
			with open(install_dir+'/telegram_token', 'w+'):
				pass
		
		with open(install_dir+'/telegram_token', 'r', encoding = 'utf-8') as f:
			telegram_token = f.read().strip()
		
		if len(telegram_token) == 0:
			color_print.print_fail('File "'+install_dir+'/telegram_token" is empty')
			sys.exit(1)

		path, dirs, files = next(os.walk(install_dir+'/hashes_results'))
			
		for item in files:
			forward_from_chat_id = item
			lines = []
			listt = []
			with open(path+'/'+forward_from_chat_id, 'r', encoding = 'utf-8') as f:
				lines = f.readlines()
			for i in lines:
				listt.append(i.strip())
			hashes_results[forward_from_chat_id] = listt
		
		lines = []
		with open(install_dir+'/course.log', 'r', encoding = 'utf-8') as f:
			lines = f.readlines()
		for item in lines:
			ex = re.split(r':', item.strip())
			if len(ex) > 1:
				course[ex[0]] = float(ex[1])

		lines = []
		with open(install_dir+'/cache_of_vin_codes', 'r', encoding = 'utf-8') as f:
			lines = f.readlines()
		for item in lines:
			ex = re.split(r' ', item.strip())
			if len(ex) > 2:
				cache_of_vin_codes[ex[0]] = {ex[1]:ex[2]}

		if os.path.isfile(install_dir+'/reload_user_conf'):
			os.remove(install_dir+'/reload_user_conf')
			
		if os.path.isfile(install_dir+'/reload_admin_conf'):
			os.remove(install_dir+'/reload_admin_conf')
		
		if os.path.isfile(install_dir+'/abort_distribution_ids'):
			os.remove(install_dir+'/abort_distribution_ids')

	except Exception:
		
		lock_1.acquire()
		try:
			log_error(traceback.format_exc().strip())
		except Exception:
			pass
		finally:
			lock_1.release()

class MyDaemon(daemon):

	def run(self):
		
		global driver

		try:
			
			parse_user_data()
			
			threading.Thread(target = check_reload_conf, args = ()).start()
			threading.Thread(target = check_complete_results, args = ()).start()
			threading.Thread(target = check_course, args = ()).start()
			threading.Thread(target = check_clear_cache, args = ()).start()
			
			driver = init_selenium_and_launch_browser('init')
			launch_auction_parsing()

			threading.Thread(target = telegram_bot, args = ()).start()
			threading.Thread(target = update_auth__autoastat_com, args = ()).start()
			#threading.Thread(target = update_auth__autoauctions_io, args = ()).start()

		except Exception:
		
			lock_1.acquire()
			try:
				log_error(traceback.format_exc().strip())
			except Exception:
				pass
			finally:
				lock_1.release()


if __name__ == '__main__':

	lenn = len(sys.argv)
	if lenn < 2:
		color_print.print_fail('Not enough arguments passed ('+str(lenn)+'). Usage: '+sys.argv[0]+' start|stop|status|restart')
		sys.exit(1)
		
	d = MyDaemon(daemon_pid)		
	
	if len(sys.argv) > 2 and sys.argv[2] == '--not_selenium':
		is_not_selenium = True
	else:
		is_not_selenium = False

	if sys.argv[1] == 'start':

		preparing_and_checking_files()
		init_selenium_and_launch_browser('check')
		d.start()

	elif sys.argv[1] == 'stop':
		d.stop()
	elif sys.argv[1] == 'restart':

		preparing_and_checking_files()
		init_selenium_and_launch_browser('check')
		d.restart()

	elif sys.argv[1] == 'status':
		d.status()
	else:
		color_print.print_fail('Unknown command')
		sys.exit(1)
