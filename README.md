# AuctionManager100500
Automobile trading administration tool - парсер автомобильных аукционов copart, iaai, mobile.de
адрес сайта atat.com.ua

Инструкция:
Папка auction_manager_app содержит все файлы необходимые для работы сервиса. Все ее содержимое размещается в директории /usr/local на vds сервере. Т.е. в директории  /usr/local/auction_manager_app должно находится все что находится в папке auction_manager_app.
Только после выгрузки всего содержимого необходимо изменить владельца на папку /usr/local/auction_manager_app потому что там скорее всего владельцем будет root. Вводим в консоли linux "sudo chown USER:www-data -R /usr/local/auction_manager_app" - где "USER" это пользователь от имени которого работают python скрипты сервиса, веб-сервер nginx и FTP сервер, этот пользователь должен быть в системе, так же он должен присутствовать в группе www-data 

Установим владельца для папки /usr/local/auction_manager_app "sudo chown USER:www-data -R /usr/local/auction_manager_app" где: USER - пользователь созданный в linux (не root). Если такого пользователя еще нет то необходимо создать его.

Папка web содержит все необходимое для веб-интерфейcа управления сервисом. Все ее содержимое размещается в директории /var/www/site.com/public на vds сервере, где "site.com" домен вашего сайта, так же может быть "default" если у вас нет домена а просто ip адрес. Директория /var/www обычно используется для размещения файлов сайтов.

Файл auction_manager_app_ размещается в директории /etc/network/if-up.d он необходим для автозапуска python скриптов сервиса в случае перезагрузки vds сервера linux. После переноса файла в эту директорию необходимо изменить права, "sudo chmod +x /etc/network/if-up.d/auction_manager_app_"

Запуск сервиса осуществляется командой "sudo python3 /usr/local/auction_manager_app/auction_manager_app.py start", остановка "sudo python3 /usr/local/auction_manager_app/auction_manager_app.py stop", перезапуск "sudo python3 /usr/local/auction_manager_app/auction_manager_app.py restart", проверка состояния "sudo python3 /usr/local/auction_manager_app/auction_manager_app.py status"

Так же необходимо запустить контролирующий скрипт для рестарта "sudo python3 /usr/local/auction_manager_app/start_and_restart_auction_manager_app.py start" он все время смотрит нужно ли рестартануть сервис, отправлена ли соответствующая команда

В папке nginx расположен файл конфигурации сервера nginx , этот файл размещается в директории /etc/nginx/sites-available на сервере, обязательно отредактируйте содержимое файла, там есть некоторые значения требующие редактирования. Файл можно переименовать в site.com адрес вашего сайта если хотите, но тогда нужно будет после настройки nginx-а создать симлинк "sudo ln -s /etc/nginx/sites-available/site.com /etc/nginx/sites-enabled/" или "sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/" - если решили файл default не переименовывать
