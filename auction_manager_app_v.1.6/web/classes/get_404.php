<?php
$charset = 'utf-8';

header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
header('Pragma: no-cache'); // HTTP/1.0
header('Content-type: text/html; charset='.$charset);
header('HTTP/1.0 404 Not Found');
header('HTTP/1.1 404 Not Found');
header('Status: 404');
exit('<html>
<head><title>404 Not Found</title></head>
<body bgcolor="white">
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>');
