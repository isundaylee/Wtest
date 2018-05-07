<?php include("common.php"); ?>
<?session_start();?>
<?
$ret = validate_session_info(true);
if($ret)
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<script type="text/javascript" src="include/scripts/prototype.js"></script>
<script type="text/javascript" src="include/scripts/validation.js"></script>
<script type="text/javascript" src="include/scripts/prototype-ext.js"></script>
<script type="text/javascript" src="include/scripts/utils.js"></script>
<script type="text/javascript" src="include/scripts/browser-ext.js"></script>
<script type="text/javascript" src="include/scripts/table_orderer.js"></script>
<script type="text/javascript" src="include/scripts/menu.js"></script>
<script type="text/javascript" src="include/scripts/ui_components.js"></script>
<script type="text/javascript" src="include/scripts/ng.js"></script>
<script type="text/javascript" src="include/scripts/defines.js"></script>

<script type="text/javascript" src="include/scripts/ajax.js"></script>
<script type="text/javascript">
onLoadEvent = function() {
    h = document.viewport.getHeight();
    $("popupContents").style.height = h+"px";
    w = document.viewport.getWidth();    
    $("popupContents").style.width = w+"px";
    jObject = { "MAC" : "<? echo $_GET['mac'] ?>"};
    new ajaxRequest().sendRequest("get_client_details",
                                   Object.toJSON(jObject),
                                   winOpen);
}
window.onload = onLoadEvent;

winOpen = function(value) {

        this.data = value.client_details;
        var contentPage = new NG_UI_page("Client Status");
        contentPage.style.width = "100%";

        tbl = new NG_ConfTable();
        keys = Object.keys(this.data);
        for(var i = 0; i < keys.length; i++) {
            tbl.addRow([keys[i].gsub('_', ' ')], [this.data[keys[i]]]);
        }

        contentPage.add(tbl, "ClientDetails", "Client Details", "");

        $("popupContents").insert({top : contentPage});

        $("standardButtons").update();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    function() { location.reload(); });
        $("standardButtons").insert(refreshBtn);
        closeBtn = new NG_UI_button("btn_close",
                                    "close",
                                    "off",
                                    function() { window.close(); });
        $("standardButtons").insert( closeBtn);
}
</script>

<link rel="stylesheet" href="include/css/layout.css" type="text/css">
<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<title>Netgear</title>
</head>
<body style="background-color:#FFFFFF;" >
    <div id="popupContents" style="background-color:#FFFFFF; overflow:scroll;">
	<div><table width="100%"><tr><td id="standardButtons" align="right"></td></tr></table></div>
    </div>
    <div id="bodyLock" class="InstructionalText"></div>
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
