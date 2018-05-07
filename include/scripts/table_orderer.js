NG_TableOrderer = function(id, options) {
    tbl = this.table = new Element("TABLE", {"id": this.id,
                                          "cellspacing":"0",
                                          "cellpadding":"0",
                                          "width":"100%",
                                          "class":"BlockContentTable"});
    tbl.clearCache = function() {
        this.isCached = false;
        this.cache = this.data;

        if(this.orderField) {
            this.orderData(this.orderField);
            if (this.order == 'desc') { this.cache = this.cache.reverse(); }
        } 
    };    
    tbl.perform = function() {
        this.tools.pages = Math.ceil(this.cache.size() / this.options.pageCount);
        this.setColumnsName();
        this.clearCache();
        this.createTable();
    };
    tbl.initData = function(){
        this.data = this.options.data ? this.options.data : false;
        if(this.data) { this.perform(); }
    };
    tbl.orderRule = function (s){
        var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4}|\d{2})/;
        var exp=new RegExp(dateRE);
        if ( exp.test(s) ){
            s = this.options.dateFormat == 'd' ? s.replace(dateRE,"$3$2$1") : s.replace(dateRE,"$3$1$2");
        }
        return s;
    };
    tbl.defineOrderField = function(e){
        this.previousOrderField = this.orderField; 
        this.orderField = Event.element(e).id.replace(this.id+'-','');
    };
    tbl.defineOrder = function(){ 
        if (this.previousOrderField == this.orderField){ this.order = this.order == 'desc' ? 'asc' : 'desc'; }
        else { this.order = 'asc'; }
    };
    tbl.orderData = function(order){
        this.cache = this.cache.sortBy(function(s){
            var v = Object.values(s)[Object.keys(s).indexOf(order)];
            return this.orderRule(v);
        }.bind(this));
    };
    tbl.thClick = function(e) {
        this.defineOrderField(e);
        this.defineOrder();
        this.orderData(this.orderField);

        if (this.order == 'desc') { this.cache = this.cache.reverse(); }
        
        this.updateTable();
    }.bind(tbl);
    tbl.thOver = function(e){
        Event.element(e).addClassName('on');
    }.bind(tbl);
    tbl.thOut = function(e){
        Event.element(e).removeClassName('on');
    }.bind(tbl);
    tbl.thMultiSelect = function(event){
        e = Event.element(event);
        this.multiSelectState = e.checked;
        for(i = 0; i < this.data.size(); i++) {
            if(!this.data[i][this.options.disabledKeyCol]) {
                this.data[i][this.options.multiSelect].checked = e.checked;
            }
        }
        var s = (e.checked ? this.data.size() : 0);
        this.options.multiSelectAction(e.checked, s);
    }.bind(tbl);
    tbl.addTableObserver = function() {
        this.headRow.immediateDescendants().each( function(element, i) {
            if(element.id == this.id+"-"+this.options.multiSelect) {
                Event.observe(element, 'click', this.thMultiSelectbfx);
                element.setStyle({'backgroundImage' : 'none'});
            } else if(element.id == this.id+"-singleSelect") {
                element.setStyle({'backgroundImage' : 'none'});
            } else {
                Event.observe(element, 'click', this.thClickbfx);
            }
        }.bind(this));
        
        this.headRow.immediateDescendants().invoke('observe','mouseover',this.thOverbfx);
        this.headRow.immediateDescendants().invoke('observe','mouseout',this.thOutbfx);
    };
    tbl.pagerData = function(e) {
        var tid = this.id;
        var caller = Event.element(e);

        switch(caller.id) {
            case tid+'-page-next':
                this.tools.page = ((++this.tools.page) > this.tools.pages) ? --this.tools.page : this.tools.page;
            break;
            case tid+'-page-prev':
                this.tools.page = ((--this.tools.page) > this.tools.pages) ? ++this.tools.page : this.tools.page;
            break;
            case tid+'-page-last':
                this.tools.page = this.tools.pages;
            break;
            default:
                this.tools.page = 1;
        }
        this.updateTable();
    };
    tbl.makeColumnUnsortable = function(col){
        col.setStyle({'backgroundImage' : 'none'});
        Event.stopObserving(col, 'click', this.thClickbfx);
    };
    tbl.makeUnsort = function() {
        hCols = this.headRow.descendants().toArray();
        for(i = 0; i < hCols.length; i++) { 
            for(j = 0; j < this.options.unsortedColumn.length; j++) {
                if(hCols[i].id.replace(this.id + "-", '')
                    == this.options.unsortedColumn[j]) {
                    this.makeColumnUnsortable(hCols[i]);
                }
            }
        }
    };
    tbl.createTable = function(){

        this.update(new Element("TBODY"));
        this.setMultiSelect(); this.setSingleSelect();
        this.createRows();
        this.addTableObserver();
        this.makeUnsort();
    };
    tbl.setMultiSelect = function() {
        if(!this.options.multiSelect) return;
        this.data.each( function (e) {
            chkbox = new Element("INPUT", {"type" : "checkbox"});

            if(e[this.options.multiSelect] == true) {
                chkbox.checked = true;
                chkbox.defaultChecked = true;
            }

            Event.observe(chkbox, "click", function(event) {
                count = 0;
                for(i = 0; i < this.data.length; i++) {
                    if(this.data[i][this.options.multiSelect].checked) count++;
                }

                e = Event.element(event);
                this.options.multiSelectAction(e.checked, count);
            }.bind(this));

            chkbox.disabled = this.options.disabled;
            e[this.options.multiSelect] = chkbox;
        }.bind(this));
    };
    tbl.setSingleSelect = function() {
        if(this.options.singleSelectKeyField != "") {
            this.data.each(function(e, index) {
            element = new Element("INPUT", {"type" : "radio",
                                         "name" : this.id + "-"+ this.options.singleSelectKeyField,
                                         "value" : e[this.options.singleSelectKeyField]});

            if(index == 0) {
                element.checked = true;
                element.defaultChecked = true;
            }
            element.disabled = this.options.disabled;

            e["singleSelect"] = element;
            }.bind(this));
            this.tableColumnsName[this.tableColumnsName.size()] = "singleSelect";
        }
    };
    tbl.getSelectedData = function() {
        selectedData = new Array();
        
        this.data.each( function (e) {
            keys = Object.keys(e);
            obj = new Object();
            if(e[this.options.multiSelect].checked) {
                for(i = 0; i < keys.length; i++) {
                    if(this.options.multiSelect != keys[i]) {
                        obj[keys[i]] = (Object.isString(e[keys[i]]) ? e[keys[i]] : e[keys[i]].value);
                    }
                }
                selectedData[selectedData.length] = obj;
            }
        }.bind(this));

        return selectedData;
    };
    tbl.getSelectedDataCount = function() {
        var count = 0;
        
        for(var i = 0; i < this.data.length; i++) {
            if(this.data[i][this.options.multiSelect].checked) {
                count++;
            }
        }

        return count;
    };
    tbl.deleteSelectedData = function() {
        selectedData = new Array();
        
        this.options.data.each( function (e) {
            if(e[this.options.multiSelect].checked) {
                selectedData[selectedData.length] = e;
            }
        }.bind(this));
        for(var i = 0; i < selectedData.length; i++) {
            this.options.data = this.options.data.without(selectedData[i]);
        }
        this.initData();
    };

    tbl.getSingleSelectData = function() {
        obj = null;
        this.data.each( function (e) {
            if(e["singleSelect"].checked) {
                obj = new Object();
                keys = Object.keys(e);
                for(i = 0; i < keys.length; i++) {
                    if(this.options.multiSelect != keys[i]) {
                        obj[keys[i]] = e[keys[i]];
                    }
                }
            }
        }.bind(this));

        return obj;
    };
    tbl.updateTable = function() {
        this.update(new Element("TBODY"));
        this.createRows();
        this.addTableObserver();
        this.makeUnsort();
    };
    tbl.createRow = function(obj,index){
        var line = index % 2;
        className = line == 1 ? "Alternate" : "";
        className += " cell ";
        var row = new Element("TR", {"class" : className, "id":this.id+'-'+index});
        var values = Object.values(obj);
        var keys = Object.keys(obj);
        this.tableColumnsName.each(function(s, index) {
            cell = new Element("TD", {"class":this.id+"-column-"+s+' ' + className}).update(obj[s]);
            
            if(this.options.multiSelect && s.toLowerCase() == this.options.multiSelect.toLowerCase()) {
                
            } else if(s.toLowerCase() == "singleselect") {
                row.insert({top : cell});
            } else if(this.options.noColDataFields.indexOf(s.toLowerCase()) == -1) {
                
                row.insert(cell);
            }
        }.bind(this));

        if(this.options.multiSelect) {
            cell = new Element("TD", {"class":this.id+"-column-"+this.options.multiSelect+' ' + className})
                       .update(obj[this.options.multiSelect]);

            if(obj[this.options.disabledKeyCol] == true) {
                obj[this.options.multiSelect].disable();
            }
            
            if(this.options.singleSelectKeyField == "") {
                row.insert({top : cell});
            } else {
                row.insert(cell);
            }
        }
        return row;
    };
    tbl.createFirstRow = function(obj){
        var row = new Element("TR");
        this.tableColumnsName.each(function(i) {
            cell = new Element("TH", { "class" : "BlockContentTableUnSorted",
                                       id : this.id+'-'+i});
            if((this.options.multiSelect && i == this.options.multiSelect) ||
               i == this.options.disabledKeyCol) {

            } else if(i.toLowerCase() == "singleselect") {
                                if( this.options.multiSelect == "") {
                                    cell.update("");
                                } else {
                                    cell.update("Edit");
                                }
                                row.insert({top : cell});
            } else if (this.options.noColDataFields.indexOf(i.toLowerCase()) == -1) {
                cell.update(i.gsub('_', ' ').capitalize());
                row.insert(cell);
                if(i == this.orderField) {
                    cell.addClassName(this.order);
                }
            }
        }.bind(this));

        if(this.options.multiSelect) {
            cell = new Element("TH", {id : this.id+'-'+this.options.multiSelect});
            chkBox = new Element("INPUT", {type:"checkbox"});
            chkBox.disabled = this.options.disabled;
            chkBox.checked = this.multiSelectState;

            cell.update(chkBox);
            if(this.options.singleSelectKeyField == "") {
                row.insert({top : cell});
            } else {
                row.insert(cell);
            }
        }

        return row;
    };

    tbl.createInputRow = function() {
        var row = new Element("TR");
        this.tableColumnsName.each(function(i) {
            cell = new Element("TH");
            if((this.options.multiSelect && i == this.options.multiSelect) ||
               i == this.options.disabledKeyCol) {

            } else if(i.toLowerCase() == "singleselect") {
                                cell.update("");
                                row.insert({top : cell});
            } else if (this.options.noColDataFields.indexOf(i.toLowerCase()) == -1) {
                cell.update(new NG_TextBox(i, ""));
                row.insert(cell);
            }
        }.bind(this));

        if(this.options.multiSelect) {
            var cell = new Element("TH").update("")
            if(this.options.singleSelectKeyField == "") {
                row.insert({top : cell});
            } else {
                row.insert(cell);
            }
        }

        return row;
    };

    tbl.setColumnsName = function(){
        if(this.options.columns.length > 0) {
            this.tableColumnsName = this.options.columns;
        } else {
            this.tableColumnsName = Object.keys(this.data[0]);
        }
    };
    tbl.createPager = function () {
        paginateRow = new Element("TR");
        tbody = new Element("TBODY").update();
        paginateCell = new Element("TD",
                                   {"colspan" : this.tableColumnsName.size(),
                                    "class"   : "tablePrevNextHeader"});

        paginateRow.insert(paginateCell);
        ePageFirst = new Element('A', {'id' : this.id+'-page-first',
                                   'href' : '#',
                                   'class' : 'tablePrevNextHeader'})
                     .update(this.msgs.paginationFirst);

        ePagePrevious = new Element('A', {'id' : this.id+'-page-prev',
                                      'href' : '#',
                                      'class' : 'tablePrevNextHeader'})
                     .update(this.msgs.paginationPrev);

        ePageNext = new Element('A', {'id' : this.id+'-page-next',
                          'href' : '#',
                                  'class' : 'tablePrevNextHeader'})
                    .update(this.msgs.paginationNext);
        ePageLast = new Element('A',{'id' : this.id+'-page-last',
                         'href' : '#',
                                 'class' : 'tablePrevNextHeader'})
                     .update(this.msgs.paginationLast);

        var pagerDatabfx = this.pagerData.bindAsEventListener(this);
        Event.observe(ePageFirst, 'click', pagerDatabfx);
        Event.observe(ePagePrevious, 'click', pagerDatabfx);
        Event.observe(ePageNext, 'click', pagerDatabfx);
        Event.observe(ePageLast, 'click', pagerDatabfx);

        paginateCell
            .insert(ePagePrevious).insert("&nbsp;|&nbsp;")
            .insert(ePageNext);

        this.firstDescendant().insert({bottom : paginateRow});
    };
    tbl.createRows = function(){
        var line = 1;
        var display, enddisplay, startdisplay, dataView, dat, col, searchStr,row, s;
        this.headRow = this.createFirstRow();

        this.firstDescendant().insert({ top: this.headRow});    
        
        if(this.options.inputRow) {
            this.inputRow = this.createInputRow();
            this.firstDescendant().insert(this.inputRow);
        }

        if(this.options.hideData) return;

        dataView = this.cache;
        display = dataView;

        if(this.options.paginate && this.options.pageCount < this.data.size()) {

            this.tools.pages = Math.ceil(dataView.size() / this.options.pageCount);
            if(this.tools.page > this.tools.pages) { this.tools.page = this.tools.pages; }
            if(this.tools.page < 1) { this.tools.page = 1; }
            if(this.tools.pages === 0) { this.tools.page = 0; }

            startdisplay = this.options.pageCount * (this.tools.page - 1);
            enddisplay = this.options.pageCount * this.tools.page;
            display = dataView.slice(startdisplay, enddisplay);
        }
        display.each(function(i,index) {
            this.firstDescendant().insert({ bottom: this.createRow(i,index) });
        }.bind(this));
        
        if(this.options.paginate && this.options.pageCount < this.data.size()) {
            this.createPager();
        }
        if(!this.isCached) {
            this.isCached = true;
            this.cache = dataView;
        }
    }

    tbl.getInputRow = function() {
        if(this.inputRow != undefined) {
            var elements = this.inputRow.immediateDescendants();
            var obj = {};
            for(var i = 0; i < elements.length; i++) {
                if((e = elements[i].down("INPUT")) != undefined) {
                    obj[e.name] = e.value.strip();
                }
            }
            return obj;
        }
        
        return null;
    }
    tbl.setData = function(data) {
        this.options.data = data;
        this.initData();
    }
    tbl.getData = function() {
        return this.options.data;
    };
    tbl.addData = function(data) {
        if(this.options.data == false) {
            this.options.data = data;
        } else {
            for(var i = 0; i < data.length; i++) {
                this.options.data[this.options.data.length] = data[i];
            }
        }
        this.initData();
    }.bind(tbl);

    tbl.id = id;
    tbl.options = Object.extend({
        data                 : false,
        url                  : false,
        allowMultiselect     : true,
        columns              : [],
        unsortedColumn       : [],
        noColDataFields      : [],
        orderField           : false,
        dateFormat           : 'd',
        pageCount            : 8,
        paginate             : true,
        multiSelect          : false,
        hideData             : false,
        singleSelectKeyField : "",
        multiSelectAction    : function() {},
        disabledKeyCol       : "",
        disabled             : false,
        inputRow             : false
    }, options || {});
    tbl.tools = {
        page: 1,
        pages: 1
    };
    tbl.msgs = {
        errorData: 'no data',
        paginationPages: ' pages ',
        paginationFirst: 'FIRST',
        paginationPrev: 'PREVIOUS',
        paginationNext: 'NEXT',
        paginationLast: 'LAST'
    };

    tbl.cache = [];
    tbl.isCached = false;
    tbl.multiSelectState = false;
    tbl.orderField = tbl.orderField;
    tbl.order = 'asc';    
    tbl.headRow;
    tbl.thClickbfx = tbl.thClick.bindAsEventListener(this);
    tbl.thOverbfx = tbl.thOver.bindAsEventListener(this);
    tbl.thOutbfx = tbl.thOut.bindAsEventListener(this);
    tbl.thMultiSelectbfx = tbl.thMultiSelect.bindAsEventListener(this);
    tbl.data = null;
    tbl.initData();

    return tbl;
};
