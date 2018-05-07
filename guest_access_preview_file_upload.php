<?php
$uploadfile = '/wnc/var/www/htdocs/images/guest_bg_preview.gif';
move_uploaded_file($_FILES['upgrade_file']['tmp_name'], $uploadfile);
?>
