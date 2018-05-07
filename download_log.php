<?php include("common.php"); ?>
<?php
    session_cache_limiter('public');
	session_start();

    $ret = validate_session_info(true);
    if($ret) {
    	system("/wnc/bin/json_cli save_logs", $retval);

        $file = '/tmp/wnc_logs.tar.gz';
        if (file_exists($file)) {
            header('Content-Type: application/download');
            header('Content-Disposition: attachment; filename=log.tar.gz');
            header('Content-Length: ' . filesize($file));
            ob_clean();
            flush();
            readfile($file);
            exit;
        }
    }
?>
