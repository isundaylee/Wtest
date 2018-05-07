<?session_start();?>
<?php include("common.php"); ?>
<?php
	header('content-type: application/json');

    if(validate_session_info(false)) {
  		print '{"status":"success", "value":"1"}';
    } else {
  		print '{"status":"success", "value":"0"}';
    }
?>
