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
    jObject = { ip_address : "<? echo $_GET['ip'] ?>"};
    new ajaxRequest().sendRequest("get_ap_details",
                                   Object.toJSON(jObject),
                                   winOpen);
}
window.onload = onLoadEvent;

winOpen = function(value) {
        this.data = value.ap_details;
        var contentPage = new NG_UI_page("Access Point Status");
        contentPage.style.width = "100%";

        tbl = new NG_ConfTable();
        tbl.addRow(["Access Point"], [this.data.Access_Point_Name]);
        tbl.addRow(["Model"], [this.data.Model]);
        tbl.addRow(["Group"], [this.data.Group]);
        tbl.addRow(["IP Address"], [this.data.IP_Address]);
        tbl.addRow(["Ethernet MAC Address"], [this.data.Ethernet_MAC_Address]);
        tbl.addRow(["2.4 GHz Channel"], [this.data["2.4_GHz_Channel"]]);
        tbl.addRow(["5 GHz Channel"], [this.data["5_GHz_Channel"]]);
        tbl.addRow(["Channel Management"], [this.data.Channel_Management]);
        tbl.addRow(["Load Balancing"], [this.data.Load_Balancing]);

        contentPage.add(tbl, "AccessPointDetails", "Access Point Details", "help/help_advanced_ap_status.html#ap_details");

        if(this.data.Profile_Info.length == 0) {
            cols = ["Type","Ssid","Security","Vlan"];
        } else {
            cols = Object.keys(this.data.Profile_Info[0]);
        }
        profileInfo = new NG_TableOrderer('ProfileInfo',
                                      {"data"         : this.data.Profile_Info,
                                       "columns"      : cols,
                                       "paginate"     : false});

        contentPage.add(profileInfo, "Profile Info", "ProfileInfo", "help/help_advanced_ap_status.html#ap_profile");

        if(this.data.Client_Info.length == 0) {
            cols = ["Mac","Ssid","Channel","Mode","Auth","Cipher"];
        } else {
            cols = Object.keys(this.data.Client_Info[0]);
        }
        clientInfo = new NG_TableOrderer('ClientInfo',
                                      {"data"         : this.data.Client_Info,
                                       "columns"      : cols,
                                       "paginate"     : false});
        contentPage.add(clientInfo, "ClientInfo", "Client Info", "help/help_advanced_ap_status.html#ap_clientinfo");

        var rogueAps = this.data.Rogue_Access_Points;
        rogueApsTbl = new NG_ConfTable();
        rogueApsTbl.addRow(["Rogue Access Points reported"],
                           [rogueAps[0].rogue_access_points_reported]);
        rogueApsTbl.addRow(["Rogue Access Points in same channel"],
                           [rogueAps[0].rogue_access_points_in_same_channel]);
        rogueApsTbl.addRow(["Rogue Access Points in interfering channel"],
                           [rogueAps[0].rogue_access_points_in_interfering_channel]);        
        contentPage.add(rogueApsTbl, "rogueApsBg", "Rogue Access Points("+ rogueAps[0].type +")", "help/help_advanced_ap_status.html#ap_rogueap");


        if (rogueAps.length > 1) {
            rogueApsTbl = new NG_ConfTable();
            rogueApsTbl.addRow(["Rogue Access Points reported"],
                               [rogueAps[1].rogue_access_points_reported]);
            rogueApsTbl.addRow(["Rogue Access Points in same channel"],
                               [rogueAps[1].rogue_access_points_in_same_channel]);
            rogueApsTbl.addRow(["Rogue Access Points in interfering channel"],
                               [rogueAps[1].rogue_access_points_in_interfering_channel]);        
            contentPage.add(rogueApsTbl, "rogueApsA", "Rogue Access Points("+ rogueAps[1].type +")", "help/help_advanced_ap_status.html#ap_rogueap");
        }

        var statistics = this.data.Statistics;

        if(statistics.Wired_Ethernet != undefined) {
            wiredEthernet = statistics.Wired_Ethernet;        
            wiredEthernetTbl = new NG_ConfTable();
            wiredEthernetTbl.addRow(["Unicast Packets Received"],
                                    [wiredEthernet.Unicast_Packets_Received]);
            wiredEthernetTbl.addRow(["Broadcast Packets Received"],
                                    [wiredEthernet.Broadcast_Packets_Received]);
            wiredEthernetTbl.addRow(["Multicast Packets Received"],
                                    [wiredEthernet.Multicast_Packets_Received]);
            wiredEthernetTbl.addRow(["Total Packets Received"],
                                    [wiredEthernet.Total_Packets_Received]);
            wiredEthernetTbl.addRow(["Total Bytes Received"],
                                    [wiredEthernet.Total_Bytes_Received]);
            wiredEthernetTbl.addRow(["Unicast Packets Transmitted"],
                                    [wiredEthernet.Unicast_Packets_Transmitted]);
            wiredEthernetTbl.addRow(["Broadcast Packets Transmitted"],
                                    [wiredEthernet.Broadcast_Packets_Transmitted]);
            wiredEthernetTbl.addRow(["Multicast Packets Transmitted"],
                                    [wiredEthernet.Multicast_Packets_Transmitted]);
            wiredEthernetTbl.addRow(["Total Packets Transmitted"],
                                    [wiredEthernet.Total_Packets_Transmitted]);
            wiredEthernetTbl.addRow(["Total Bytes Transmitted"],
                                    [wiredEthernet.Total_Bytes_Transmitted]);
            contentPage.add(wiredEthernetTbl, "wiredEthernet", "Statistics-Ethernet", "help/help_advanced_ap_status.html#ap_stats");
        }

        if(statistics.Wireless_11bg != undefined) {
            bg = statistics.Wireless_11bg;
            bgTbl = new NG_ConfTable();
            bgTbl.addRow(["Unicast Packets Received"],
                                    [bg.Unicast_Packets_Received]);
            bgTbl.addRow(["Broadcast Packets Received"],
                                    [bg.Broadcast_Packets_Received]);
            bgTbl.addRow(["Multicast Packets Received"],
                                    [bg.Multicast_Packets_Received]);
            bgTbl.addRow(["Total Packets Received"],
                                    [bg.Total_Packets_Received]);
            bgTbl.addRow(["Total Bytes Received"],
                                    [bg.Total_Bytes_Received]);
            bgTbl.addRow(["Unicast Packets Transmitted"],
                                    [bg.Unicast_Packets_Transmitted]);
            bgTbl.addRow(["Broadcast Packets Transmitted"],
                                    [bg.Broadcast_Packets_Transmitted]);
            bgTbl.addRow(["Multicast Packets Transmitted"],
                                    [bg.Multicast_Packets_Transmitted]);
            bgTbl.addRow(["Total Packets Transmitted"],
                                    [bg.Total_Packets_Transmitted]);
            bgTbl.addRow(["Total Bytes Transmitted"],
                                    [bg.Total_Bytes_Transmitted]);
            contentPage.add(bgTbl, "11bg", "Statistics-802.11b/bg/ng", "help/help_advanced_ap_status.html#ap_stats");
        }

        if(statistics.Wireless_11a != undefined) {
            a = statistics.Wireless_11a;
            aTbl = new NG_ConfTable();
            aTbl.addRow(["Unicast Packets Received"],
                                    [a.Unicast_Packets_Received]);
            aTbl.addRow(["Broadcast Packets Received"],
                                    [a.Broadcast_Packets_Received]);
            aTbl.addRow(["Multicast Packets Received"],
                                    [a.Multicast_Packets_Received]);
            aTbl.addRow(["Total Packets Received"],
                                    [a.Total_Packets_Received]);
            aTbl.addRow(["Total Bytes Received"],
                                    [a.Total_Bytes_Received]);
            aTbl.addRow(["Unicast Packets Transmitted"],
                                    [a.Unicast_Packets_Transmitted]);
            aTbl.addRow(["Broadcast Packets Transmitted"],
                                    [a.Broadcast_Packets_Transmitted]);
            aTbl.addRow(["Multicast Packets Transmitted"],
                                    [a.Multicast_Packets_Transmitted]);
            aTbl.addRow(["Total Packets Transmitted"],
                                    [a.Total_Packets_Transmitted]);
            aTbl.addRow(["Total Bytes Transmitted"],
            [a.Total_Bytes_Transmitted]);
            contentPage.add(aTbl, "11bg", "Statistics-802.11a/na", "help/help_advanced_ap_status.html#ap_stats");
        }

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
