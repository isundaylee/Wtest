<?php include("common.php"); ?>
<?php
	session_start();
	header('content-type: application/json');

    $ret = validate_session_info(true);
	if($ret) {
	    echo '{"status" : "success", "value" : '.read_session_timeout_conf().'}';
	} else {
		echo '{"status" : "failure", "error" : "No session exist"}';
	}
?>
