/* Remove later start*/

function tblDiscoveryList()
{
	var models = new Array();
	models[0] = "WNAP210";
	models[1] = "WNDAP350";
	models[2] = "WN802Tv2";
	models[3] = "WG602v4";
	models[4] = "WAG302v2";
	models[5] = "WG102v2";

	tblHeader = new Array();
	tblHeader[0] = "#";
	tblHeader[1] = "IP";
	tblHeader[2] = "MAC";
	tblHeader[3] = "Model";
	tblHeader[4] = "Access Point Name";
	tblHeader[5] = "User Name";
	tblHeader[6] = "Password";
	
	tbl = construct2Darray(64);
	for(var i = 0; i < 64; i++)
	{
		tbl[i][0] = i;
		tbl[i][1] = getRandomIp();
		tbl[i][2] = getRandomMAC();
		tbl[i][3] = models[Math.floor(Math.random()*6)];
		tbl[i][4] = "<input size='15'  type='text'></input>";
		tbl[i][5] = "<input size='10'  type='text'></input>";
		tbl[i][6] = "<input size='10' type='password'></input>";
	}
	for(var i = 0; i < 6; i++)
	{
		tbl[i][3] = models[0];
	}
	for(var i = 6; i < 17; i++)
	{
		tbl[i][3] = models[3];
	}
	for(var i = 17; i < 64; i++)
	{
		tbl[i][3] = models[2];
	}
	domTable = tableHtml("AccessPointDiscovery", tbl, tblHeader);

	tableHtmlDecorate(domTable, "BlockContentTable", null, "Alternate", "Alternate", true);
	domTable.tBodies[0].rows[3].style.background = '#FFFF66';
	domTable.tBodies[0].rows[3].cells[4].update("<input type='text' size='15' value='Netgear-82' disabled='disabled'/>");
	domTable.tBodies[0].rows[3].cells[5].update("<input type='text' size='10' value='admin' disabled='disabled'/>");
	domTable.tBodies[0].rows[3].cells[6].update("<input type='password' size='10' value='*********' disabled='disabled'/>");
	domTable.tBodies[0].rows[3].cells[7].update("<input id='AccessPointDiscovery_cb3' type='checkbox' checked='checked' disabled='disabled'/>");

	domTable.tBodies[0].rows[6].style.background = '#FFFF66';
	domTable.tBodies[0].rows[6].cells[4].update("<input type='text' size='15' value='Netgear-87' disabled='disabled'/>");
	domTable.tBodies[0].rows[6].cells[5].update("<input type='text' size='10' value='admin' disabled='disabled'/>");
	domTable.tBodies[0].rows[6].cells[6].update("<input type='password' size='10' value='*********' disabled='disabled'/>");
	domTable.tBodies[0].rows[6].cells[7].update("<input id='AccessPointDiscovery_cb6' type='checkbox' checked='checked' disabled='disabled'/>");

	tableSplit(domTable, 8);
	
	return domTable;
}

function tblManagedApList()
{
	var models = new Array();
	models[0] = "WNAP210";
	models[1] = "WNDAP350";
	models[2] = "WN802Tv2";
	models[3] = "WG602v4";
	models[4] = "WAG302v2";
	models[5] = "WG102v2";

	tblHeader = new Array();
	tblHeader[0] = "";
	tblHeader[1] = "#";
	tblHeader[2] = "Access Point Name";
	tblHeader[3] = "IP";
	tblHeader[4] = "Model";
	tblHeader[5] = "Group Name";
	tblHeader[6] = "Synchronized";
	tblHeader[7] = "Connected";

	tbl = construct2Darray(7);
	for(var i = 0; i < 7; i++)
	{
		tbl[i][0] = "<input name ='ManagedApListRadio' type='radio' value=ManagedApListRadio_" + i + "></input>";
		tbl[i][1] = i;
		tbl[i][2] = "Netgear AP-" + i;
		tbl[i][3] = getRandomIp();
		tbl[i][6] = "Yes";
		tbl[i][7] = "Yes";
	}

	/* to group APs */
	for(var i = 0; i <= 1; i++)
	{
		tbl[i][4] = models[0];
		tbl[i][5] = "Group-1";
	}
	for(var i = 2; i <= 4; i++)
	{
		tbl[i][4] = models[3];
		tbl[i][5] = "Group-4";
	}
	for(var i = 5; i <= 6; i++)
	{
		tbl[i][4] = models[2];
		tbl[i][5] = "Group-7";
	}

	tbl[2][7] = "No";
	tbl[6][7] = "No";
	tbl[3][6] = "No";

	domTable = tableHtml("ManagedApList", tbl, tblHeader);
	tableHtmlDecorate(domTable, "BlockContentTable", null, "Alternate", "Alternate", true);

	tableSplit(domTable, 8);
	return domTable;
}

function tblApGroups()
{
	var models = new Array();
	models[0] = "WNAP210";
	models[1] = "WNDAP350";
	models[2] = "WN802Tv2";
	models[3] = "WG602v4";
	models[4] = "WAG302v2";
	models[5] = "WG102v2";

	tblHeader = new Array();
	tblHeader[0] = "#";
	tblHeader[1] = "Group Name";
	tblHeader[2] = "Model";
	tblHeader[3] = "Access Point Count";

	tbl = construct2Darray(5);
	for(var i = 0; i < 5; i++)
	{
		tbl[i][0] = i;
		tbl[i][1] = "AP Group-" + i;
		tbl[i][2] = models[Math.floor(Math.random()*6)];
		tbl[i][3] = 1 + Math.floor(Math.random()*3)
	}

	domTable = tableHtml("ApGroups", tbl, tblHeader);
	tableHtmlDecorate(domTable, "BlockContentTable", "", "Alternate", "Alternate", true);

	domTable.align = "center";
	tableSplit(domTable, 8);
	return domTable;
}

function tblAutoChannelAllocation()
{
	tblHeader = new Array();
	tblHeader[0] = "#";
	tblHeader[1] = "Access Point";

	tbl = construct2Darray(10);
	for(var i = 0; i < 10; i++)
	{
		var ap = i+82;
		tbl[i][0] = i;
		tbl[i][1] = "NetGear-" + ap;
	}

	domTable = tableHtml("AutoChannelAllocation", tbl, tblHeader);
	tableHtmlDecorate(domTable, "BlockContentTable", "", "Alternate", "Alternate", true);

	domTable.align = "center";
	tableSplit(domTable, 8);
	return domTable;
}

function getRandomIp()
{
	return "" + Math.floor(Math.random()*255) + "." +
	Math.floor(Math.random()*255) + "." +
	Math.floor(Math.random()*255) + "." +
	Math.floor(Math.random()*255);
}

function getRandomMAC()
{
	macStr = "";
	for(var i = 0; i < 6; i++)
	{
		var num = Math.floor(Math.random()*16);
		macStr += num.toString(16).toUpperCase();
		num = Math.floor(Math.random()*16);
		macStr += num.toString(16).toUpperCase();
		if(i < 5) macStr += ":";
	}
	return macStr;
}
function construct2Darray(rows)
{
	tbl = new Array();
	for(i = 0; i < rows; i++)
	{
		tbl[i] = new Array();
	}
	return tbl;
}