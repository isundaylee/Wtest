<?php
$uploadfile = '/tmp/wnc.bin';
move_uploaded_file($_FILES['upgrade_file']['tmp_name'], $uploadfile);
?>
