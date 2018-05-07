setRowVisible = function(domRow, flag)
{
	if (browserName == "msie") {
		if(flag == true) {
			domRow.style.display = "inline";
		} else {
			domRow.style.display = "none";
		}
	} else {
		if(flag == true) {
			domRow.style.visibility = "visible";
		} else {
			domRow.style.visibility = "collapse";
		}
	}
}

isRowVisible = function(domRow, flag) {
	return browserName == "msie" ? 
			(domRow.style.display == "inline" ? true : false) :
			(domRow.style.visibility == "visible" ? true : false);
}

prev = function(tblId, max)
{
	var rows = $(tblId).tBodies[0].rows;
	firstVisibleElementIndex = 0;

	// get first visible row
	for(i = 0; i < rows.length ; i++) {
		if(isRowVisible(rows[i])) {
			firstVisibleElementIndex = i;
			break;
		}
	}
	if(firstVisibleElementIndex == 0) {
		return;
	}

	for(i = firstVisibleElementIndex; i < firstVisibleElementIndex + max; i++) {
		setRowVisible(rows[i], false);
	}

	for(i = firstVisibleElementIndex - 1;
		(i >= 0) && (i > firstVisibleElementIndex - parseInt(max) - 1);
		i--) {
		setRowVisible(rows[i], true);
	}

	return false;
}

nxt = function(tblId, max) {
	var rows = $(tblId).tBodies[0].rows;
	lastVisibleElementIndex = 0;

	// get last visible element
	for(i = rows.length - 1; i > 0 ; i--) {
		if(isRowVisible(rows[i])) {
			lastVisibleElementIndex = i;
			break;
		}
	}
	if(lastVisibleElementIndex == rows.length - 1) {
		return;
	}

	for(i = lastVisibleElementIndex; i > lastVisibleElementIndex - max; i--) {
		setRowVisible(rows[i], false);
	}

	for(i = lastVisibleElementIndex + 1;
		(i < rows.length) && (i < lastVisibleElementIndex + parseInt(max) + 1);
		i++) {
		setRowVisible(rows[i], true);
	}
	return false;
}

selectAllCheckBoxs = function(event) {
	var eSrc = Event.element(event);
	if(eSrc.checked) {
		// checkbox<-cell<-row<-tbody<-table
		domTable = eSrc.parentNode.parentNode.parentNode.parentNode;
		for(i = 0; i < domTable.tBodies[0].rows.length; i++) {
			if(!$(domTable.id + "_cb" + i).disabled) {
				$(domTable.id + "_cb" + i).checked = true;
			}
		}
	} else {
		for(i = 0; i < domTable.tBodies[0].rows.length; i++) {
			if(!$(domTable.id + "_cb" + i).disabled) {
				$(domTable.id + "_cb" + i).checked = false;
			}
		}
	}
}

tableHtml = function(tblId, tblArray, tblHeaderArray) {
	var domTbl = new Element("TABLE");
	domTbl.cellSpacing = 0;
	domTbl.id = tblId;

	if(tblHeaderArray != null) {
		domTbl.appendChild(new Element("THEAD"));

		var domRow = domTbl.tHead.insertRow(0);

		for(var i = 0; i < tblHeaderArray.length; i++) {
			var domCell = new Element("TH");
			domCell.id = "tableColHeader";
			domCell.update(tblHeaderArray[i]);
			domRow.appendChild(domCell);
		}
	}

	domTbl.appendChild(document.createElement("TBODY"));

	if(tblArray == null || tblArray == undefined) {
		return domTbl;
	}
	
	for(var i = 0; i < tblArray.length; i++) {
		domRow = domTbl.tBodies[0].insertRow(domTbl.tBodies[0].rows.length);
		for(j = 0; j < tblArray[i].length; j++) {
			domCell = new Element("TD");
			domCell.update(tblArray[i][j]);
			domCell.align ="center";
			domRow.appendChild(domCell);
		}
	}
	return domTbl;
}

tableHtmlDecorate = function(domTbl, tblClass, cellClass,
	alternateRowClass, alternateCellClass, checkBoxCol) {

	domTbl.className = tblClass;
	var domHeaderRow 
	if(domTbl.tHead != undefined && domTbl.tHead.rows != domTbl.tHead) {
		domHeaderRow = domTbl.tHead.rows[domTbl.tHead.rows.length - 1];
	}

	//add checkbox to table head
	if(checkBoxCol == true) {
		var domCell = new Element("TH");
		var domCheckBox = new Element("INPUT",  { 'type': 'checkbox'}); 
		Event.observe(domCheckBox, 'click', selectAllCheckBoxs);
		domCell.update(domCheckBox)
		domHeaderRow.appendChild(domCell);
	}

	// decorate header
	if((domTbl.tHead != undefined) && (domHeaderRow != undefined)) {
		for(var i = 0; i < domHeaderRow.cells.length; i++) {
			domHeaderRow.cells[i].className ="tableColHeader";
		}
	}

	if(domTbl.tBodies[0] == null || domTbl.tBodies[0] == undefined) {
		return;
	}
	
	for(i = 0; i < domTbl.tBodies[0].rows.length; i++) {
		var cellsLength = domTbl.tBodies[0].rows[i].cells.length;
		var domRow;
		for(var j = 0; j < cellsLength; j++) {
			domRow = domTbl.tBodies[0].rows[i];
			if(cellClass != null) {
				domRow.cells[j].className = cellClass;
			}
		}

		if(checkBoxCol == true) {
			domCell = new Element("TD");
			domCheckBox = new Element("INPUT", { 'type': 'checkbox', 'id' : domTbl.id + "_cb" + i});

			domCell.update(domCheckBox)
			domRow.appendChild(domCell);
		}

		if(i % 2 == 0) {
			if(alternateRowClass != null) {
				domTbl.tBodies[0].rows[i].className = alternateRowClass;
			}
			for(var j = 0; j < domTbl.tBodies[0].rows[i].cells.length; j++) {
				if(alternateCellClass != null) {
					domTbl.tBodies[0].rows[i].cells[j].className = alternateCellClass;
				}
			}
		}
	}
}

tableSplit = function(domTable, maxVisible, tableWidth) {

	if(browserName == 'chrome') return;
	
	for(i = 0; i < domTable.tBodies[0].rows.length; i++) {
		domRow = domTable.tBodies[0].rows[i];
		if(i < maxVisible) {
			setRowVisible(domRow, true);
		} else {
			setRowVisible(domRow, false);
		}
	}

	if(domTable.rows.length > maxVisible) {
		domRow = domTable.tHead.insertRow(0);
		var domCell = new Element("TH");
		domCell.colSpan = domTable.rows[1].cells.length;
		domCell.className = "tablePrevNextHeader";
		domCell.update("<a class='tablePrevNextHeader' href='#' onclick=\"prev('" +
			domTable.id +
			"', " +
			maxVisible +
			");\">PREVIOUS</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a class='tablePrevNextHeader' href='#' onclick=\"return nxt('"+
			domTable.id + "', " +
			maxVisible +
			");\">NEXT</a>&nbsp;");

		domRow.appendChild(domCell);
	}
}