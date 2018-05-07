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
var dataArray = null;
var apHash = null;
var refresh = function(color, image) {
    window.location.reload();
}
var setBackground = function(color, image) {
    var background = color;
    if(image != undefined) {
        background = background + " url('" + image + "') no-repeat fixed center";
    }
    document.body.background =  image;
}

topoLayout = function() {
    $('guiLock').style.width = '800px';
    $('guiLock').style.height = '600px';
    $('guiLock').style.left = '0px';
    $('guiLock').style.top = '0px';

    $('bodyLock').style.height = '600px';
    $('bodyLock').style.width = '800px';
    $('bodyLock').style.left = '0px';
    $('bodyLock').style.top = '0px';

    $('topoContents').style.height = '600px';
    $('topoContents').style.width = '800px';
    $('topoContents').style.left = '0px';
    $('topoContents').style.top = '0px';
}

onLoadEvent = function() {
    setBackground("#CCCCCC", "./images/topology_bg.gif");
    topoLayout();
    new ajaxRequest().sendRequest("get_topology_map",
                                  "",
                                  handleGetConfig);
}

handleGetConfig = function(value) {
    dataArray = value.topology;
    apHash = new Hash();
    var apArray = createApArray(dataArray);
    for(var i = 0; i < dataArray.length; i++) {
        apHash.set(dataArray[i].ip_address, apArray[i]);
    }
    $("topoContents").update();
    drawTopology();
}

drawTopology = function(options) {
    $("topoContents").hide();
    this.options = Object.extend({
        XOffset         : 0,
        YOffset         : 0,
        width           : 800,
        height          : 600,
        title           : "",
        lineColor       : ["#46008f", "#666f74"],
        bgColor         : "#CCCCCC",
        gridColor       : "#CCCCCC",
        fontColor       : "#663300"
 	}, options || {});

    for(var i = 0; i < dataArray.length; i++) {
        m = apHash.get(dataArray[i].ip_address);
        for(var j = 0; j < dataArray[i].neighbours.length; j++) {
            n = apHash.get(dataArray[i].neighbours[j].ip_address);
            var line = n.drawn.get(dataArray[i].ip_address);
            if (line == null) {
                line = m.drawn.get(dataArray[i].neighbours[j].ip_address);
                if (line == null) {
                    line = new NG_Line(m.x_location, n.x_location,
                                       m.y_location, n.y_location,
                                       this.options.lineColor[0], 1);
                    m.drawn.set(dataArray[i].neighbours[j].ip_address, line);
                    $("topoContents").insert(line);
                }
            }
        }
        e = new NG_Dot(m.id, m.x_location - 10,
                       m.y_location - 15, m.comp, 2);
        new Draggable(e, {"ghosting":true, "onEnd" : function(){
            e = arguments[0].handle;
            m = apHash.get(arguments[0].handle.id);
            x = arguments[0].handle.viewportOffset().left + 10;
            y = arguments[0].handle.viewportOffset().top + 15;
            for(var j = 0; j < dataArray.length; j++) {
                if(dataArray[j].ip_address == arguments[0].handle.id) {
                    m.x_location = x;
                    m.y_location = y;
                    dataArray[j].x_location = x;
                    dataArray[j].y_location = y;
                    for (k = 0; k < dataArray[j].neighbours.length; k++) {
                        line = m.drawn.get(dataArray[j].neighbours[k].ip_address);
                        if (line != null) {
                            m.drawn.unset(dataArray[j].neighbours[k].ip_address);
                            line.remove();
                        }
                    }
                }
                else {
                    n = apHash.get(dataArray[j].ip_address);
                    line = n.drawn.get(arguments[0].handle.id);
                    if (line != null) {
                        n.drawn.unset(arguments[0].handle.id);
                        line.remove();
                    }
                }
            }
            drawTopology();
        }});
        $("topoContents").insert(e);
    }
    $("topoContents").show();
}

NG_Dot = function(id, x, y, component, zIndex) {
    stl = "position : absolute; "+
          "left:" + x + "px; " +
          "top:" + y + "px; " +
          "z-index : " + zIndex + ";";

    var d = new Element("DIV", {"id" : id, "style" : stl});
    d.insert(component);

    return d;
}

createApArray = function(dataArray) {
    ary =  Array();

    cellStyle =     "font-family: Verdana, Arial, Helvetica, sans-serif;" +
                    "font-size: 10px; font-weight: normal; text-align: left;" +
                    "color: #000000; background-color: #CCCCCC;";
    for(var i = 0; i < dataArray.length; i++) {
        var apImg = new Element("IMG", {"src" : "./images/ap.gif"});

        var tbl = new Element("TABLE");
        var tBody = new Element("TBODY"); tbl.update(tBody);
        row = new Element("TR"); tBody.insert(row);
        cell = new Element("TD", { align : "left" }).update(apImg);
        row.update(cell);

        row = new Element("TR"); tBody.insert(row);
        cell = new Element("TD", { "style" : cellStyle })
                .update(dataArray[i].ip_address);
        row.update(cell);

        row = new Element("TR"); tBody.insert(row);
        cell = new Element("TD", { "style" : cellStyle })
                .update(dataArray[i].Access_Point);
        row.update(cell);
        ary[ary.length] = {
            id         : dataArray[i].ip_address,
            x_location : dataArray[i].x_location,
            y_location : dataArray[i].y_location,
            neighbours : dataArray[i].neighbours,
            drawn      : new Hash(),
            comp       : tbl
        }
    }
    return ary;
}


NG_Line = function(x0, x1, y0, y1, color, zIndex){

    var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0)

    if (steep) {
        var tmp=x0;x0=y0;y0=tmp
        tmp=x1;x1=y1;y1=tmp
    }
    if (x0 > x1){
        var tmp=x0;x0=x1;x1=tmp;
        tmp=y0;y0=y1;y1=tmp;
    }

    var w = x1 - x0;
    var h = 0;
    var ystep = 0;
    if (y1 > y0) {
        h = y1 - y0;
        ystart = y0;
        ystep = 1;
    }
    else {
        h = y0 - y1;
        ystart = y1;
        ystep = -1;
    }

    if(steep) {
        stl = "position : absolute; "+
              "width:" + w + "px; " +
              "height:" + h + "px; " +
              "left:" + ystart + "px; " +
              "top:" + x0 + "px; " +
              "z-index : " + zIndex + ";";
    } else {
        stl = "position : absolute; "+
              "width:" + w + "px; " +
              "height:" + h + "px; " +
              "left:" + x0 + "px; " +
              "top:" + ystart + "px; " +
              "z-index : " + zIndex + ";";
    }
    var lineDiv = new Element("DIV", { "style" : stl});

    var error = 0
    var y = y0 - ystart
    var xstep = 0

    for (var x = 0; x <= w; x++) {
        error = error + h;
        xstep++
        if (2*error >= w || x == w) {
            if (steep) {
                stl = "position : absolute; "+
                      "width:2px;" +
                      "height:" + xstep + "px; " +
                      "left:" + y + "px; " +
                      "top:" + (x - xstep) + "px; " +
                      "font-size:1pt;" +
                      "line-height:1pt;"+
                      "background-color:" + color + ";" +
                      "z-index : " + 1 + ";";
            } else {
                stl = "position : absolute; "+
                      "width:" + xstep + "px; " +
                      "height:2px; " +
                      "left:" + (x - xstep) + "px; " +
                      "top:" + y + "px; " + 
                      "font-size:1pt;" +
                      "line-height:1pt;"+
                      "background-color:" + color + ";" +
                      "z-index : " + 1 + ";";
            }
            lineDiv.insert(new Element("DIV", {"style" : stl}).update("&nbsp"));
            y = y + ystep;
            error = error - w;
            xstep = 0;
        }
    }

    return lineDiv;
}
window.onload = onLoadEvent;
</script>
<link rel="stylesheet" href="include/css/layout.css" type="text/css">
<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<title>Netgear</title>
</head>
<body>
    <div id="topoContents"></div>
    <div id="bodyLock" class="InstructionalText"></div>
    <div id="guiLock"></div>
</body>
</html>

