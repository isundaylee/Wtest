<?php

function do_login() {
    if($user_type = validate_session_info(true)) {
       return 0; 
    }

    $retval = 0;
	$session_file_name = "/tmp/session.bin";
    system("/wnc/bin/json_cli ".$_POST["reqMethod"]." \"".$_POST["jsonData"]."\"", $retval);
    if($retval == 0) {
        return 1;
    }

    $existing_write_user = is_any_write_user_logged_in();
    if($retval == 2 && $existing_write_user) {
        if($_POST["reqMethod"] == "force_auth_user") {
            do_logout($existing_write_user);
            # echo $existing_write_user;
        } else {
            return 2;
        }
    }

    $fp = fopen($session_file_name, 'a');
    fwrite($fp, $retval.":".session_id().":".time()."\n");
    fclose($fp);

    return 0;
}

function do_logout($session_id) {
    $retval = 0;
	$session_file_name = "/tmp/session.bin";

    $ary = file($session_file_name);
    if($ary == false) {
        return;
    }

    $fp = fopen($session_file_name, 'w');
    for($i = 0; $i < sizeof($ary); $i++) {
 		list($user_type, $session_id, $time) = split(":", $ary[$i]);

        if(trim($session_id) != trim($session_id)) {
            fwrite($fp, $user_type.":".$session_id.":".time()."\n");
        }
    }
    fclose($fp);
}

function validate_session_info($update_time) {
	$session_file_name = "/tmp/session.bin";

    if(!file_exists($session_file_name)) {
        return false;
    }

    update_session_info(true, $update_time);

    $ary = file($session_file_name);

    for($i = 0; $i < sizeof($ary); $i++) {
 		list($user_type, $session_id) = split(":", $ary[$i]);
        if(session_id() == trim($session_id)) {
            return $user_type;
        }
    }

	return false;
}

function is_any_write_user_logged_in() {
	$session_file_name = "/tmp/session.bin";

    if(!file_exists($session_file_name)) {
        return false;
    }

    $ary = file($session_file_name);

    for($i = 0; $i < sizeof($ary); $i++) {
 		list($user_type, $session_id) = split(":", $ary[$i]);
        if(trim($user_type) == "2") {
            return $session_id;
        }
    }

	return false;
}

function update_session_info($remove_timeout_session, $update_time_stamp) {
    $retval = 0;
	$session_file_name = "/tmp/session.bin";

    $ary = file($session_file_name);
    if($ary == false) {
        return;
    }

    $fp = fopen($session_file_name, 'w');

    for($i = 0; $i < sizeof($ary); $i++) {
 	    list($user_type, $session_id, $time) = split(":", $ary[$i]);

        if(((time() - $time) > read_session_timeout_conf() * 60) && $remove_timeout_session) {

 		} else { 
 		    if(trim($session_id) == session_id() && $update_time_stamp) {
                fwrite($fp, $user_type.":".$session_id.":".time()."\n");
            } else {
                fwrite($fp, $user_type.":".$session_id.":".$time."\n");
            }
        }
    }

    fclose($fp);
}

function read_session_timeout_conf() {
	$session_timeout_file = "/WNC_CONF/timeout.bin";

    if(!file_exists($session_timeout_file)) {
        return 5; //default session timout 5 mins
    } else {
        $ary = file($session_timeout_file);
        return $ary[0];
    }
    
}

function write_session_timeout_conf($timeout) {
	$session_timeout_file = "/WNC_CONF/timeout.bin";
	
    $fp = fopen($session_timeout_file, 'w');

    fwrite($fp, $timeout);

    fclose($fp);
}
?>
