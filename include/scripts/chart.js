drawChart = function(frame, dataArray, options) {

    _DiagramTarget=frame;
    if(browserName != "msie") {
        _DiagramTarget.document == _DiagramTarget.contentDocument;
    }

    _DiagramTarget.document.open();

   this.options = Object.extend({
        XOffset         : 100,
        YOffset         : 50,
        width           : 650,
        height          : 250,
        XScale          : "x",
        YScale          : "y",
        title           : "",
        lineColor       : ["#46008f", "#666f74"],
        bgColor         : "#cccccc",
        gridColor       : "#cccccc",
        fontColor       : "#663300"
 	}, options || {});


    var maxArray = new Array();
    var minArray = new Array();
    for(var i = 0; i < dataArray.length; i++) {
        maxArray[i] = dataArray[i].max();
        minArray[i] = dataArray[i].min();
    }

    var max = maxArray.max(); max = max + 1 + max/10;
    var min = minArray.min(); min = min - 1 - min/10;

    if(min < 0) { min = 0 };

    var D=new Diagram();
    D.SetFrame(this.options.XOffset, this.options.YOffset, this.options.width, this.options.height);
    D.SetBorder(0, 24, min, max);
    D.SetText("","", this.options.title);

    D.XScale=this.options.XScale;
    D.YScale=this.options.YScale;

    D.SetGridColor(this.options.gridColor);
    D.Draw(this.options.bgColor, this.options.fontColor, false);

    D.GetYGrid();
    _BFont="font-family:Verdana;font-size:10pt;line-height:13pt;";

    for(var i = 0; i < 2; i++) {
        var data = dataArray[i];
    	for (var j = 0; j < data.length - 1; j++)
	    {
	       var factor = data.length / 24;
	       x1=(j / factor), y1=data[j], x2 = (j + 1) / factor, y2=data[j + 1];
	       new Line(D.ScreenX(x1),
	  	       D.ScreenY(y1),
	  		   D.ScreenX(x2),
	  		   D.ScreenY(y2),
	  		   this.options.lineColor[i],
	  		   2,
	  		   "Usage = " + y1 + "->" + y2);
	   }
	   
	}
    _DiagramTarget.document.close();
}
