<?php include("common.php"); ?>
<?php
	session_start();

    $ret = validate_session_info(true);
    if($ret) {
    	system("/wnc/bin/json_cli ".$_POST["reqMethod"]." \"".$_POST["jsonData"]."\"", $retval);
	} else {
		echo '{"status":"failure", "error":"No session exist"}';
	}
?>
