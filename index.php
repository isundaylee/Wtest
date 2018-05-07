<?php
include("common.php"); 
session_start();
$ret = validate_session_info(true);
if($ret)
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<script type="text/javascript">
    var userType = <?php echo ($ret == 2 ? '"admin"' : '"guest"'); ?>;
    var currentUserName = <?php echo '"'.$_GET["user_name"].'"'?>;
</script>
<script type="text/javascript" src="include/scripts/prototype.js"></script>
<script type="text/javascript" src="include/scripts/validation.js"></script>
<script type="text/javascript" src="include/scripts/prototype-ext.js"></script>
<script type="text/javascript" src="include/scripts/diagram.js"></script>

<script type="text/javascript" src="include/scripts/scriptaculous.js"></script>

<script type="text/javascript" src="include/scripts/utils.js"></script>
<script type="text/javascript" src="include/scripts/browser-ext.js"></script>
<script type="text/javascript" src="include/scripts/table_orderer.js"></script>
<script type="text/javascript" src="include/scripts/menu.js"></script>
<script type="text/javascript" src="include/scripts/ui_components.js"></script>
<script type="text/javascript" src="include/scripts/ng.js"></script>
<script type="text/javascript" src="include/scripts/defines.js"></script>
<script type="text/javascript" src="include/scripts/globals.js"></script>
<script type="text/javascript" src="include/scripts/chart.js"></script>
<script type="text/javascript" src="include/scripts/ajax.js"></script>

<link rel="stylesheet" href="include/css/layout.css" type="text/css">
<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<title>Netgear</title>
</head>
<body>
<div id="layoutContainer">
	<div id="headerMain"><?php include("header.php"); ?></div>
	<div id="contentLeftEdge"></div>
	<div id="contentMenu"><?php include("contents_menu.php"); ?></div>
	<div id="contents" class="bodyblock"></div>
  <div id="contentRightEdge"></div>
	<div id="footerMain"><?php include("footer.php"); ?></div>
    <div id="bodyLock" class="InstructionalText"></div>
</div>

<div id="popupContainer"><div id="popup"></div></div>
<div id="guiLock"></div>
</body>
</html>
<?
	}
	else
	{
		header( 'Location: login.php' ) ;
	}
?>
