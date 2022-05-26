<?php

if(!$is_require) {
	require $_SERVER['DOCUMENT_ROOT'].'/classes/get_404.php';
}

?>
<script type="text/javascript">
var last_message_error = '';
window.onerror = function(message, source, lineno){
  if(last_message_error != message){
    last_message_error = message;
    (new Image).src='?js_error&m='+message+'&p='+document.location.host+document.location.pathname+'&f='+source+'&l='+lineno+'&'+Math.random();
  }
};
</script>
