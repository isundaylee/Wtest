<?session_start();?>
<?php include("timer.php"); ?>
<?php include("common.php"); ?>
<?php
    $ret = do_login();
    switch($ret) {
        case 0:
    		print '{"status":"success", "value":{"err" : "false"}}';
        break;

        case 1:
    		print "{'status':'failure', 'error':'Invalid User Name or Password'}";
        break;

        case 2:
    		print "{'status':'success', 'value': { 'err' : 'true' }}";
        break;
        
    }
?>
