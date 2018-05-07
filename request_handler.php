<?php include("common.php"); ?>
<?php
	session_start();
	header('content-type: application/json');

    $ret = validate_session_info(true);
	if($ret) {
		if($_POST["reqMethod"] == "logout") {
            do_logout(session_id());
		} else {
			system("/wnc/bin/json_cli ".$_POST["reqMethod"]." \"".$_POST["jsonData"]."\" ".$ret, $retval);
		}
	} else {
		echo '{"status" : "failure", "error" : "No session exist"}';
	}
?>
