<?php include("common.php"); ?>
<?php
    session_cache_limiter('public');
	session_start();
	header('content-type: application/download');
    header("Content-Disposition: attachment; filename=\"backup.tar.gz\"");
    $ret = validate_session_info(true);
    if($ret) {
    	system("/wnc/bin/json_cli backup_cfg", $retval);
	} else {
		echo '{"status":"failure", "error":"No session exist"}';
	}
?>
