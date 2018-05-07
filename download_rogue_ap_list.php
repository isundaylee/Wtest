<?php include("common.php"); ?>
<?php
    session_cache_limiter('public');
	session_start();
	header('content-type: application/download');
    header("Content-Disposition: attachment; filename=\"macList.txt\"");

	echo $_POST["string"];
?>
