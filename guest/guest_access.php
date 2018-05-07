<?php
		header( 'Location: index.html' ) ;
        $str = '"{ \"ip\" : \"'.$_SERVER['REMOTE_ADDR'].'\", \"email\" : \"'. $_POST["email"] . '\"}"';
    	system("/wnc/bin/json_cli add_guest ".$str, $retval);
?>
