<html>
<head>
<script type="text/javascript" src="include/scripts/prototype.js"></script>
<script type="text/javascript" src="include/scripts/validation.js"></script>
<script type="text/javascript" src="include/scripts/prototype-ext.js"></script>

<script type="text/javascript" src="include/scripts/scriptaculous.js"></script>

<script type="text/javascript" src="include/scripts/utils.js"></script>
<script type="text/javascript" src="include/scripts/browser-ext.js"></script>



<script type="text/javascript" src="include/scripts/ng.js"></script>


<script type="text/javascript" src="include/scripts/chart.js"></script>
<script type="text/javascript" src="include/scripts/ajax.js"></script>


<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<script type="text/javascript">
var refresh = function(color, image) {
    window.location.reload();
}

manufDataLayout = function() {
    var height = document.viewport.getHeight();
    var width = document.viewport.getWidth();

    var top = 10;
    var left = 10;
    if (height > 600) {
        top = (height - 600) / 2;
    }
    if (width > 250) {
        left = (width - 250) / 2;
    }

    $('manufData').style.height = '600px';
    $('manufData').style.width = '250px';
    $('manufData').style.left = left + 'px';
    $('manufData').style.top = top + 'px';
    $('manufData').style.position = 'absolute';
}

onLoadEvent = function() {
    manufDataLayout();
    new ajaxRequest().sendRequest("get_wnc_manfdata",
                                  "",
                                  handleGetConfig);
}

handleGetConfig = function(value) {
    $("manufData").update();
    contentPage = new NG_UI_page("Manufacturing Data");
    $("manufData").update(contentPage);
    form = Element.wrap(getManufDataTable(value),
                        "form", {"id" : "formManufData"});
    contentPage.add(form, "ManufData", "Manufacturing Data", "");
    $("manufData").show();
}

getManufDataTable = function(value) {
    tbl = NG_ConfTable();
    tbl.addRow(["Product ID"], [value.Product_ID]);
    tbl.addRow(["Hardware Version"], [value.HW_Version]);
    tbl.addRow(["Reg. Info"], [value.Reg_Info]); 
    tbl.addRow(["Number of Image"], [value.Num_of_image]);
    tbl.addRow(["Current Image"], [value.Current_image]);
    tbl.addRow(["Image Checksum 1"], [value.Image_checksum_1]);
    tbl.addRow(["Image Checksum 2"], [value.Image_checksum_2]);
    tbl.addRow(["Image Size 1"], [value.Image_size_1]);
    tbl.addRow(["Image Size 2"], [value.Image_size_2]);
    tbl.addRow(["Image Firmware Version 1"], [value.Image_firmware_version_1]);
    tbl.addRow(["Image Firmware Version 2"], [value.Image_firmware_version_2]);
    tbl.addRow(["Image Status 1"], [value.Image_status_1]);
    tbl.addRow(["Image Status 2"], [value.Image_status_2]);
    tbl.addRow(["Base MAC Address"], [value.Base_MAC_Address]); 
    tbl.addRow(["MAC Count 1"], [value.MAC_Count_1]); 
    tbl.addRow(["MAC Count 2"], [value.MAC_Count_2]); 
    tbl.addRow(["MAC Count 3"], [value.MAC_Count_3]); 
    tbl.addRow(["MAC Count 4"], [value.MAC_Count_4]); 
    tbl.addRow(["Serial Number"], [value.Serial_Number]);
    tbl.addRow(["Current Firmware Version"], [value.Firmware_Version]);
    return tbl;
}
window.onload = onLoadEvent;
window.onresize = manufDataLayout;
</script>
<link rel="stylesheet" href="include/css/layout.css" type="text/css">
<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<title>Netgear</title>
</head>
<body>
    <div id="manufData"></div>
    <div id="bodyLock" class="InstructionalText"></div>
    <div id="guiLock"></div>
</body>
</html>

