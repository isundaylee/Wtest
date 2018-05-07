<?php include("common.php"); ?>
<?php
	session_start();
	header('content-type: application/json');

    $ret = validate_session_info(true);
	if($ret) {
        write_session_timeout_conf($_POST["jsonData"]);
		echo '{"status" : "success", "value" : ""}';
	} else {
		echo '{"status" : "failure", "error" : "No session exist"}';
	}
?>
