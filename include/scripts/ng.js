var NG_ProgressBar = function(options) {

    this.base = new Element("DIV", {"class":"progressBarBase"});
    this.base.options = Object.extend({
        xOffset         : document.viewport.getWidth()/2 - 22,
        yOffset         : document.viewport.getHeight()/2 - 22,
        width           : 44,
        height          : 44,
        title           : "",
        showProgressBar : false,
        progress        : 0
    }, options || {});

    this.options = this.base.options;
    this.base.style.left = this.options.xOffset+"px";
    this.base.style.top = this.options.yOffset+"px";
    this.base.style.height = this.options.height+"px";
    this.base.style.width = this.options.width+"px";
    this.base.style.textAlign = "center";

    if(this.options.showProgressBar) {
        this.base.update("");
    }

    $(document.body).insert(this.base);

    this.base.updateProgress = function(progress) {
        if(!Object.isNumber(progress)) return;
        if( progress > 100 ) progress = 100;
        this.update(progress + "%");
    };

    return this.base;
};

NG_ProgressMonitor = function(req, reqArg, eOnComplete, options) {
    this.options = Object.extend({
        req           : req,
        reqArg        : reqArg,
        eOnComplete   : eOnComplete,
        eIntermediate : function() {},
        type          : "%"
    }, options || {});
    lockGui();
    lockBody();
    this.progressRequest = function(req, reqArg, eOnComplete) {
        new ajaxRequest().sendRequest(req,
                                      reqArg,
                                      this.progressRespHandler,
                                      {showBusyBar : false,
                                       onFailure   : this.onFailure});
    }
    this.progressRespHandler = function(value) {
        progress = "";
        descr = "";
        if(this.options.type == "%") {
            var progress = parseInt(value)
            done = (progress >= 100 ? true : false);
        } else {
            descr = new NG_TableOrderer("desctbl",
                                        {"data"      : value.list,
                                         "pageCount" : 16});
            var page = new NG_UI_page("Status");
            page.add(descr, "Status", "Status", "");
            descr = page;
            done = (parseInt(value.done) == 1 ? true : false);
            progress = parseInt(value.progress);
        }

        if(!done) {
            this.options.eIntermediate(value);
            this.progressBar.updateProgress(progress);
            c = function(pe) {
                this.progressRequest(this.options.req,
                         this.options.reqArg,
                         this.options.eOnComplete);
                pe.stop();
            }.bind(this);
            new PeriodicalExecuter(c, 2);

            $('bodyLock').update(descr);
        } else {
            this.progressBar.hide();
            $('bodyLock').update();
            unlockGui();
            unlockBody();
            this.options.eOnComplete(value);
            if ($('errorBlock')) {
                if (value.failed == "1") {
                    if (value.descr != null && value.descr != undefined) {
                        $('errorBlock').set(value.descr);
                    }
                }
            }
        }
    }.bind(this);

    this.onFailure = function() {
        this.discoveryProgressBar.hide();
        unlockGui();
        unlockBody();
    }.bind(this);

    this.progressBar = new NG_ProgressBar({showProgressBar : true});
    this.progressRequest(this.options.req,
                         this.options.reqArg,
                         this.options.eOnComplete);
}

//var NG_UI_IPBox 
NG_Title_Wrapper = function(component, title, helpUrl) {

    component.wrapper = new Element("TABLE", {"style" : "width:100%;"});


    t = new Element("TABLE", { "class" : 'tableStyle'});
    b = new Element("TBODY"); t.update(b);
    r = new Element("TR"); b.insert(r);
    c1 = new Element("TD", { "class" : "subSectionTabTopLeft spacer80Percent font12BoldBlue" })
            .update(title);

    c2 = new Element("TD", { "class" : "subSectionTabTopRight spacer20Percent" }); 

    helpImg = new Element("IMG", { src : './images/help_icon.gif', width : '12', height : '12'});
    Event.observe(helpImg, "mouseover", function(e) { 
        Event.element(e).addClassName('on');
    });
    Event.observe(helpImg, "mouseout", function(e) { 
        Event.element(e).removeClassName('on');
    });

    helpImg.helpUrl = helpUrl;
    
    if ("" != helpUrl)
    {
        c2.update(helpImg);
    }

    r.insert(c1).insert(c2);

    r = new Element("TR"); b.insert(r);
    c1 = new Element("TD", { "class" : "subSectionTabTopShadow", colspan : 3 });
    r.insert(c1);

    Event.observe(helpImg, "click", function(event) {
        var top = (screen.availHeight-336)/2;
        var left = (screen.availWidth-448)/2;
        e = Event.element(event);
        window.open(e.helpUrl,"helpWindow","width=448,height=336,"+
                              "titlebar=no,scrollbars=yes,resizable=no,"+
                              "menubar=no,status=no,location=no,toolbar=no,"+
                              "left="+left+",top="+top);        
    });

    component.wrapper.insert(new Element("THEAD").
    update(new Element("TR")
            .update(new Element("TD", {'colspan': '3'})
                     .update(t))));

    tbody =    new Element("TBODY");     component.wrapper.insert(tbody);
    row = new Element("TR").insert(new Element("TD", {"class":"subSectionBodyDot"}).update("&nbsp;"))
                             .insert(new Element("TD").update(component))
                             .insert(new Element("TD", {"class":"subSectionBodyDotRight"}).update("&nbsp;"));
    tbody.insert(row);

    row = new Element("TR").insert(new Element("TD", {"colspan":"3", "class":"subSectionBottom"}));
    tbody.insert(row);

    return component;
};

NG_Popup_Title_Wrapper = function(component, title) {

    component.wrapper = new Element("TABLE", {"style" : "width:100%;"});
 
    tbody =  new Element("TBODY");     component.wrapper.insert(tbody);

    row = new Element("TR").insert(new Element("TD", {"colspan":"3", "class":"subSectionBottom"}));
    tbody.insert(row);

    tbody.insert(row);
    titleCell = new Element("TD", {"class" : "font12BoldBlue", "style" : "padding-left : 10px"})
                    .update(title);

    row = new Element("TR").insert(new Element("TD", {"class":"subSectionBodyDot"}).update("&nbsp;"))
                           .insert(titleCell)
                           .insert(new Element("TD", {"class":"subSectionBodyDotRight"}).update("&nbsp;"));
    tbody.insert(row);
    row = new Element("TR").insert(new Element("TD", {"class":"subSectionBodyDot"}).update("&nbsp;"))
                           .insert(new Element("TD").update(component))
                           .insert(new Element("TD", {"class":"subSectionBodyDotRight"}).update("&nbsp;"));
    tbody.insert(row);

    row = new Element("TR").insert(new Element("TD", {"colspan":"3", "class":"subSectionBottom"}));
    tbody.insert(row);

    return component;
};

NG_Error_Block = function() {
    errorBlock = this.table = new Element("TABLE", {"id" : "errorBlock", "class" : "errorMessageBlock", "width" : "100%"});
    errorBlock.update(new Element("TBODY"));
    var tbody = $(errorBlock.tBodies[0]);
    errorBlock.errorCount = 0;

    errorBlock.defaultHeading = "<B>Please address the fields highlighted!</B>";
    errorBlock.headingCell = new Element("TD", {"style" : "padding:5px 5px 5px 0px"}).update(errorBlock.defaultHeading);
    tbody.insert(new Element("TR")
                  .insert(
                    new Element("TD", {"style" : "padding:5px"}).
                      update(new Element("IMG", {"src" : "images/alert.gif"})))
                  .insert(errorBlock.headingCell));
    errorBlock.addError = function(errStr) {
        this.show();
        var tbody = $(this.tBodies[0]);
        row = new Element("TR");
        row.insert(new Element("TD"));
        row.insert(new Element("TD", {"style" : "padding:2px"})
                                .update(++this.errorCount + " " + errStr))
        tbody.insert(row);
        return this;
    }
    errorBlock.reset = function() {
        tbody = $(this.tBodies[0]);
        if(tbody.firstDescendant() == null) {
            return;
        }
        
        tbody.firstDescendant().nextSiblings().each(function(element) {
            element.remove();
        });
        this.headingCell.update(this.defaultHeading);
        this.errorCount = 0;
        this.hide();
        return this;
    }
    errorBlock.set = function(errStr) {
        this.headingCell.update("<B>" + errStr + "</B>");
        this.show();
        
        return this;
    }
    errorBlock.hide();
    return errorBlock;
}
var NG_UI_popup = function(title, attributes) {
    // init
    this.attributes = Object.extend({
    }, attributes || {});

    this.page = $("popup");

    this.page.errorBlock = new NG_Error_Block();

    borderTbl = new Element("TABLE", {style : "background : #FFFFFF;"});
    this.page.update(borderTbl);
    var wBody = new Element("TBODY"); borderTbl.update(wBody);

    row = new Element("TR"); wBody.insert(row);
    cell = new Element("TD", { "class" : "popUpBorderLeftTopCorner" }); row.insert(cell);
    cell = new Element("TD", { "class" : "popUpBorderTopFill" }); row.insert(cell);
    cell = new Element("TD", { "class" : "popUpBorderRightTopCorner" }); row.insert(cell);

    row = new Element("TR"); wBody.insert(row);
    cell = new Element("TD", { "class" : "popUpBorderLeftFill" }); row.insert(cell);
    var contentCell = new Element("TD"); row.insert(contentCell);
    cell = new Element("TD", { "class" : "popUpBorderRightFill" }); row.insert(cell);

    row = new Element("TR"); wBody.insert(row);
    cell = new Element("TD", { "class" : "popUpBorderLeftBottomCorner" }); row.insert(cell);
    cell = new Element("TD", { "class" : "popUpBorderBottomFill" }); row.insert(cell);
    cell = new Element("TD", { "class" : "popUpBorderRightBottomCorner" }); row.insert(cell);

    this.componentList = new Hash();

    this.contentTbl = new Element("TABLE", { width : "100%" }); contentCell.update(this.contentTbl);
    var tBody = new Element("TBODY"); this.contentTbl.update(tBody);
    
    titleRow = new Element("TR"); tBody.insert(titleRow);
    domCell = new Element("TD", { 'class': 'font15Bold' }).update(title);
    titleRow.update(domCell);

    domRow = new Element("TR"); tBody.insert(domRow);
    domRow.update(new Element("TD")).setStyle({'height': '5px'}); 

    this.buttonDiv = new Element("DIV");
    buttonRow = new Element("TR"); tBody.insert(buttonRow);
    buttonRow.update(new Element("TD", { "class" : "rightHAlign"})
            .update(this.buttonDiv)); 

    this.add = function(component, id, title, helpUrl) {
        var body = $(this.contentTbl.tBodies[0]);

        var c;
        if(Object.isArray(component)) {
            c = new NG_Table();
            for(var i = 0; i < component.length; i++) {
                c.addCaptionRow(component[i].comp);
                this.componentList.set(component[i].id, component[i].comp);
                if(i != component.length - 1) {c.addCaptionRow("&nbsp;");}
            }
        } else {
            c = component;
            this.componentList.set(id, component);
        }

        domRow = new Element("TR", {'id' : "r_" + id}); this.buttonDiv.up(1).insert({"before" : domRow});
        domCell = new Element("TD").update(new NG_Popup_Title_Wrapper(c, title, helpUrl).wrapper);
        domRow.insert(domCell);

        domRow = new Element("TR"); this.buttonDiv.up(1).insert({"before" : domRow});
        domRow.update(new Element("TD", {"style" : "font-size: 1px;"}).update("&nbsp;")).setStyle({'height': '5px'}); 

        return this;
    };

    this.remove = function(id) {
        if($("r_" + id) == null) return;
        $("r_" + id).next().remove();
        $("r_" + id).remove();
        page.componentList.unset(id);
        return this;
    };

    this.get = function(id) {
        return page.componentList.get(id);
    }
    
    this.addButton = function(id, comp) {
        this.buttonDiv.insert(comp);
    }
    $("popupContainer").show();
    lockGui();
    return this;
};
var NG_UI_page = function(title, attributes) {
    // init
    this.attributes = Object.extend({
    }, attributes || {});
    this.page = new Element("TABLE", this.attributes).update(new Element("TBODY"));
    this.errorBlock = new NG_Error_Block();
    var page = this.page;
    
    page.componentList = new Hash();
    domTitleRow = new Element("TR"); $(page.tBodies[0]).update(domTitleRow);

    domCell = new Element("TD", { 'class': 'font15Bold' }).update(title);
    domTitleRow.update(domCell);

    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD")).setStyle({'height': '5px'}); 

    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD").update(this.errorBlock)); 
    
    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD")).setStyle({'height': '10px'}); 

    page.add = function(component, id, title, helpUrl) {

        var body = $(this.tBodies[0]);

        var c;
        if(Object.isArray(component)) {
            c = new NG_Table();
            for(var i = 0; i < component.length; i++) {
                c.addCaptionRow(component[i].comp);
                page.componentList.set(component[i].id, component[i].comp);
                if(i != component.length - 1) {c.addCaptionRow("&nbsp;");}
            }
        } else {
            c = component;
            page.componentList.set(id, component);
        }

        domRow = new Element("TR", {'id' : "r_" + id}); body.insert(domRow);
        domCell = new Element("TD").update(new NG_Title_Wrapper(c, title, helpUrl).wrapper);
        domRow.insert(domCell);

        domRow = new Element("TR"); body.insert(domRow);
        domRow.update(new Element("TD").update("&nbsp;")).setStyle({'height': '22px'}); 
        
        return this;
    };

    page.remove = function(id) {
        if($("r_" + id) == null) return;
        $("r_" + id).next().remove();
        $("r_" + id).remove();
        page.componentList.unset(id);
        return this;
    };

    page.get = function(id) {
        return page.componentList.get(id);
    }
    return this.page;
};

var NG_UI_GridPage = function(title, componentsPerRow) {
    // init
    this.page = new Element("TABLE").update(new Element("TBODY"));
    this.errorBlock = new NG_Error_Block();
    var page = this.page;

    page.componentCount = 0;
    page.componentList = new Hash();
    domTitleRow = new Element("TR"); $(page.tBodies[0]).update(domTitleRow);

    domCell = new Element("TD", { 'class': 'font15Bold' }).update(title);
    domTitleRow.update(domCell);

    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD")).setStyle({'height': '5px'}); 

    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD").update(this.errorBlock)); 
    
    domRow = new Element("TR"); $(page.tBodies[0]).insert(domRow);
    domRow.update(new Element("TD")).setStyle({'height': '10px'}); 

    page.add = function(component, id, title, helpUrl) {

        var body = $(this.tBodies[0]);

        domRow = new Element("TR", {'id' : "r_" + id}); body.insert(domRow);
        domCell = new Element("TD").update(new NG_Title_Wrapper(component, title, helpUrl).wrapper);
        domRow.insert(domCell);

        domRow = new Element("TR"); body.insert(domRow);
        domRow.update(new Element("TD").update("&nbsp;")).setStyle({'height': '22px'}); 
        
        page.componentList.set(id, component);
        page.componentCount++;

        return this;
    };

    page.remove = function(id) {
        if($("r_" + id) == null) return;
        $("r_" + id).next().remove();
        $("r_" + id).remove();
        page.componentList.unset(id);
        return this;
    };
    
    page.get = function(id) {
        return page.componentList.get(id);
    }
    return this.page;
};


 
var NG_UI_tabbedPan = function(id, options) {

    // init
    pan = this.table = new Element("TABLE",
                                   {'id' : id,
                                    "style" : "table-layout:auto; width:100%;"});
    pan.options = Object.extend({
        onTabClicked : function(){ return true; }
    }, options || {});



    domRow = pan.insertRow(pan.rows.length);
    $(domRow).update("<TD style='background-color:#FFFFFF; padding-top: 10px; white-space: nowrap;'><UL class='inlineTabs' id = 'ul_" + id + "'></UL></TD>");
    pan.componentPanel = new Element("TD", {'class': 'tabbedPanContents'});
    $(pan.insertRow(pan.rows.length)).update(pan.componentPanel);
    pan.tabComponentMapping = new Hash();
    pan.tabCount = 0;

    pan.addTab = function(id, title, component) {
    component.style.width = "100%";
        pan = this;
        var domA = new Element("A", {'href':'#'}).update(title);

        var tabKey = pan.id + "_" + id;
        var domLi = new Element("LI", {'id' : tabKey});
        $(pan.rows[0].cells[0]).descendants()[0].appendChild(domLi.update(domA));

        if(pan.tabComponentMapping.keys().length == 0) {
            domLi.className = 'Active';
            pan.componentPanel.update(component);
        }
        pan.tabComponentMapping.set(tabKey, component);

        // event handler for tab clicked event
        tabClicked = function(e) {
            var tabComponentMapping = arguments[1].tabComponentMapping;

            for(i = 0; i < tabComponentMapping.keys().length; i++) {
                $(tabComponentMapping.keys()[i]).className = '';
            }
            this.className = 'Active';
            var currentComp = arguments[1].getSelectedTab();
            var newComp = tabComponentMapping.get(this.id);
            ret = arguments[1].options.onTabClicked(currentComp, newComp);
            if(ret) {
                arguments[1].componentPanel.update(newComp);
            }
        };

        Event.observe(domLi, 'click', tabClicked.bindAsEventListener(domLi, pan));
        pan.tabCount++;
        return pan;
    },
    pan.selectTabByIndex = function(index) {
        var tabComponentMapping = this.tabComponentMapping;
        var keys = tabComponentMapping.keys();
        for(i = 0; i < keys.length; i++) {
            if(i == index) {
                $(keys[i]).className = 'Active';                
            } else {
                $(keys[i]).className = '';
            }
        }
        var newComp = tabComponentMapping.get(keys[index]);
        this.componentPanel.update(newComp);
    }.bind(pan);

    pan.getSelectedTab = function() {
        pan = this;
        for(i = 0; i < pan.tabComponentMapping.keys().length; i++) {
            if($(pan.tabComponentMapping.keys()[i]).className == "Active") {
                return pan.tabComponentMapping
                    .get(pan.tabComponentMapping.keys()[i]);
            }
        }
        return null;
    };

    pan.getSelectedTabIndex = function() {
        pan = this;
        for(i = 0; i < pan.tabComponentMapping.keys().length; i++) {
            if($(pan.tabComponentMapping.keys()[i]).className == "Active") {
                return i
            }
        }

        return 0;
    };
    
    pan.getAllTabs = function() {
        return this.tabComponentMapping.values();
    };
    return pan;
};

NG_MoveList = function(id, options) {
    
    var tbl = this.table = new Element("TABLE", {bgcolor : "#FFFFFF"});
    var tbody = new Element("TBODY"); tbl.update(tbody);

    tbl.options = Object.extend({
        leftLabel          : "",
        rightLabel         : "",
        leftData           : false,
        rightData          : false,
        leftManualAdd      : false,
        rightManualAdd     : false,
        onLeftAddAction    : function() { return true; },
        onRightAddAction    : function() { return true; },
        columns            : [],
        disabled           : false,
        width              : "100%",
        multiSelectAction : function() {}
    }, options || {});
    tbl.setStyle({width : tbl.options.width})

    tbl.options.leftData.each( function (e) { e["to_move"] = false });
    tbl.options.rightData.each( function (e) { e["to_move"] = false });

    tbl.lTable = new NG_TableOrderer("l_" + id,
                                    { "data"        : tbl.options.leftData,
                                      "paginate"    : false,
                                      "multiSelect" : "to_move",
                                      "columns"     : tbl.options.columns,
                                      "multiSelectAction" : tbl.options.multiSelectAction,
                                      "inputRow"     : tbl.options.leftManualAdd,
                                      "disabled"     : tbl.options.disabled } );
    tbl.rTable = new NG_TableOrderer("r_" + id,
                                    { "data"        : tbl.options.rightData,
                                      "paginate"    : false,
                                      "multiSelect" : "to_move",
                                      "columns"     : tbl.options.columns,
                                      "inputRow"    : tbl.options.rightManualAdd,
                                      "multiSelectAction" : tbl.options.multiSelectAction,
                                      "disabled"     : tbl.options.disabled } );
    tbl.lTable.width = "100%";
    tbl.rTable.width = "100%";

    tbl.deleteLeftData = function(tbl) {
        this.deleteData(this.lTable);
    }.bind(tbl);

    tbl.deleteRightData = function(tbl) {
        this.deleteData(this.rTable);
    }.bind(tbl);

    tbl.deleteData = function(tbl) {
        tbl.deleteSelectedData();
    }
    
    
    tbl.addLeftData = function(tbl) {
        this.addData(this.lTable);
    }.bind(tbl);

    tbl.addRightData = function(tbl) {
        this.addData(this.rTable);
    }.bind(tbl);

    tbl.addData = function(tbl) {
        d = tbl.getInputRow();
        if(this.options.onLeftAddAction(d, tbl.getData())) {
            tbl.addData([d]);
        }
    }

    delBtn = new NG_UI_button("btn_delete_small", "delete_small", "on", tbl.deleteLeftData);
    delBtn.writeAttribute({ "align" : "right"});

    addBtn = new NG_UI_button("btn_delete_small", "add_small", "on", tbl.addLeftData);
    addBtn.writeAttribute({ "align" : "right"});

    labelRow = new Element("TR");
    
    t = new Element("TABLE", { width : "100%" });
    b = new Element("TBODY");
    r = new Element("TR")
            .insert(new Element("TD", { "class" : "font12BoldBlue" }).update(tbl.options.leftLabel))
            .insert(new Element("TD", { "style" : "width:57px" }).insert(delBtn))
            .insert(new Element("TD", { "style" : "width:45px" }).insert(addBtn));
            
    b.update(r); t.update(b);
    lLabelCol = new Element("TD", { "class" : "font12BoldBlue" }).update(t);

    mLabelCol = new Element("TD");

    rLabelCol = new Element("TD", { "class" : "font12BoldBlue" })
                    .insert(tbl.options.rightLabel);
    labelRow.insert(lLabelCol).insert(mLabelCol).insert(rLabelCol);
    tbody.insert(labelRow);

    topRow = new Element("TR");
    tbl.lTopCol = new Element("TD", { "align" : "right" });
    tbl.mTopCol = new Element("TD");
    tbl.rTopCol = new Element("TD", { "align" : "right" });

    
//    tbl.lTopCol.update(new NG_UI_button("btn_search", "delete_small", "on", tbl.deleteLeftData));
//    topRow.insert(tbl.lTopCol).insert(tbl.mTopCol).insert(tbl.rTopCol);
//    tbody.insert(topRow);

    listRow = new Element("TR");
    tbl.lListCol = new Element("TD");
    tbl.mButtonCol = new Element("TD");
    tbl.rListCol = new Element("TD");
    style = "height : 140px; width : 100%; overflow-y: auto;overflow-x: scroll;";
    tbl.lListCol.update(new Element("DIV", { style : style }).update(tbl.lTable));
    tbl.rListCol.update(new Element("DIV", { style : style }).update(tbl.rTable));

    tbl.moveRightToLeft = function() {
        this.moveData(this.lTable, this.rTable);
    }.bind(tbl);

    tbl.moveLeftToRight = function() {
        this.moveData(this.rTable, this.lTable);
    }.bind(tbl);

    tbl.moveData = function(destTbl, srcTbl) {
        var srcSelectedData = srcTbl.getSelectedData();
        srcSelectedData.each( function (e) { e["to_move"] = false });

        destTbl.addData(srcSelectedData);

        srcTbl.deleteSelectedData();
    }

    tbl.getLeftData = function() {
        return this.lTable.getData();
    }
    
    tbl.getRightData = function() {
        return this.rTable.getData();
    }

    tbl.updateLeft = function(data) {
        tbl.lTable.setData(data);
    }

    tbl.updateRight = function(data) {
        tbl.rTable.setData(data);
    }

    tbl.mButtonCol.update(new NG_UI_button("btn_search", "move", "on", tbl.moveRightToLeft));
    listRow.insert(tbl.lListCol).insert(tbl.mButtonCol).insert(tbl.rListCol);
    tbody.insert(listRow);

    return tbl;
}

NG_Legend = function(legendAry) {
    var tbl = new Element("TABLE", {width : "100px"});
    var tBody = new Element("TBODY"); tbl.insert(tBody);
    this.count = 0;

    for(var i = 0; i < legendAry.length; i++) {
        var row = new Element("TR");   tBody.insert(row);

        colorCell = new Element("TD", { style : "background-color:" + legendAry[i].color});
        row.insert(colorCell);
        colorCell.update("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")

        labelCell = new Element("TD", { "class" : "DatablockLabel"}).update(legendAry[i].label);
        row.insert(labelCell);

        var row = new Element("TR").update(new Element("TD").update("&nbsp;"));   tBody.insert(row);
    }

    return tbl;
}
