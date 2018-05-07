<?php include("common.php"); ?>
<?php
	session_start();

    $ret = validate_session_info(true);
    if($ret)
    {
		if($_POST["reqMethod"] == "logout")
		{
			session_start();
			write_session_info("inactive:".$my_session_id.":".session_id());
			session_destroy();
			echo '{"status":"success", "value":""}';
		}
		else
		{
            system("ping -c ".$_POST["reqMethod"]." \"".$_POST["jsonData"]."\"", $retval);
		}
	} else {
		echo '{"status":"failure", "error":"No session exist"}';
	}
?>
