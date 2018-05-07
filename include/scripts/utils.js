getBrowserName = function() {

    var ua = navigator.userAgent.toLowerCase();
    var browserName;
    if(ua.indexOf("chrome") != -1) {
        browserName = "chrome";
    } else if (ua.indexOf("opera") != -1 ) {
        browserName = "opera";
    } else if (ua.indexOf("msie") != -1 ) {
        browserName = "msie";
    } else if (ua.indexOf( "safari") != -1 ) {
        browserName = "safari";
    } else if (ua.indexOf( "mozilla") != -1 ) {
        if (ua.indexOf( "firefox" ) != -1) {
            browserName = "firefox";
        } else {
            browserName = "mozilla";
        }
    }

    return browserName;
};

lockGui = function() {
    if($('guiLock'))$('guiLock').show();
}
unlockGui = function() {
    if($('guiLock'))$('guiLock').hide();
}
lockBody = function() {
    if($('bodyLock'))$('bodyLock').show();
    if ($('contents')) $('contents').hide();
}
unlockBody = function() {
    if ($('contents')) $('contents').show();
    if($('bodyLock'))$('bodyLock').hide();
}

iFrameLoad = function(iframe, func) {
    if (iframe.attachEvent){
        iframe.attachEvent("onload", func);
    } else {
        iframe.onload = func;
    }
}

checkLogin = function() {
    new ajaxRequest().sendRequest("", "", handleCheckLogin,
                                  {"url"           : "check_login.php",
                                   "showBusyBar"   : false,
                                   "backgroundReq" : true});
}
handleCheckLogin = function(value) {
    if(value == 1) {
        c = function(pe) {
            checkLogin();
            pe.stop();
        }
        new PeriodicalExecuter(c, 30);
    } else {
        window.open("login.php", "_self");
    }
}
valueTolabel = function(array, value) {
    for(i = 0; i < array.length; i++) {
        if(value == array[i].value) {
            return array[i].label;
        }
    }
    return null;
}

getComboSelectedValue = function(combo) {
    return combo.options[combo.selectedIndex].value;
}

NG_CheckBox = function(id, value) {
    var chkBox = new Element("INPUT", { "type" : "checkbox", "name" : id, "id" : id});
    chkBox.style.width = "13px";
    chkBox.style.height = "13px";
    if(value == 1) {
        chkBox.checked = value;
        chkBox.defaultChecked = value;
    }

    chkBox.data = new Hash();
    return chkBox;
}

NG_RadioBox = function(id, value, checked) {
    var radioBox = new Element("INPUT", { "type" : "radio", "name" : id, "id" : id, "value" : value});
    radioBox.style.width = "13px";
    radioBox.style.height = "13px";
    
    if(checked == "1") {
        radioBox.checked = checked;
        radioBox.defaultChecked = checked;
    }

    return radioBox;
}

NG_TextArea = function(id, value, properties) {
    var properties = properties || {};
    Object.extend(properties,
                  {"name"  : id,
                   "id"    : id});
    textArea = new Element("TEXTAREA", properties);
    textArea.value = value;
    return textArea;
}

NG_FileBox = function(id, value, properties) {
    var properties = properties || {};
    Object.extend(properties,
                  { "type"  : "file",
                    "name"  : id,
                    "id"    : id,
                    "value" : value });
    return new Element("INPUT", properties);
}

NG_TextBox = function(id, value, properties) {
    var properties = properties || {};
    Object.extend(properties,
                  { "type"  : "text",
                    "name"  : id,
                    "id"    : id,
                    "value" : value });
    return new Element("INPUT", properties);
}

NG_PasswordBox = function(id, value, properties) {
    var properties = properties || {};
    Object.extend(properties,
                  { "type"  : "password",
                    "name"  : id,
                    "id"    : id,
                    "value" : value });
    return new Element("INPUT", properties);
}

NG_HiddenBox = function(id, value, properties) {
    var properties = properties || {};
    Object.extend(properties,
                  { "type"  : "hidden",
                    "name"  : id,
                    "id"    : id,
                    "value" : value });
    return new Element("INPUT", properties);
}

NG_Combo = function(id, array,  value) {
    var combo = this.combo = new Element("SELECT", {"class" : "select",
                                   "id"    : id,
                                   "name"  : id});

    if(array != null && array != undefined) {
        var valHash = new Hash();
        
        for(i = 0; i < array.length; i++) {
            if(valHash.get(array[i].value) != null) {
                continue;
            } else {
                valHash.set(array[i].value, array[i].value);
            }

            combo.insert(new Element("OPTION", {"value" : array[i].value}
                                    ).update(array[i].label));
            if(value != undefined && array[i].value == value) {
                combo.selectedIndex = combo.options.length - 1;
            }
        }
    }

    combo.data = new Hash();
    combo.update = function(array, value) {
        var combo = this;

        combo.immediateDescendants().each( function(e) { e.remove(); } );

        if(array != null && array != undefined) {
            for(i = 0; i < array.length; i++) {
                combo.insert(new Element("OPTION", {"value" : array[i].value}
                                        ).update(array[i].label));
                if(value != undefined && array[i].value == value) {
                    combo.selectedIndex = i;        
                }
            }
         }
    }

    return combo;
}

NG_RangeCombo = function(id, start, end,  value) {
    var combo = new Element("SELECT", {"class" : "select",
                                   "id"    : id,
                                   "name"  : id});
    for(var i = start; i <= end; i++) {
        combo.insert(new Element("OPTION", {"value" : i}
                                ).update(i));
        if(value != undefined && i == value) {
            combo.selectedIndex = (i - start);        
        }
    }
    return combo;
}


NG_EnableDisableCombo = function(name, changeAction) {
    var combo = new NG_Combo(name, [{"label" : "Disable", "value" : "0"}, {"label" : "Enable", "value" : "1"}]);
    if(changeAction != null && changeAction != undefined) {
        Event.observe(combo, "change", changeAction);
    }

    return combo;
}

NG_RadioGroup = function(id, data, value, options) {

    var tbl = new Element("TABLE");
    tbl.options = Object.extend({
        direction : "x-axis",
        onChange  : function() {}
    }, options || {});


    var tBody = new Element("TBODY"); tbl.insert(tBody); 

    if(tbl.options.direction == "x-axis") {
        var row = new Element("TR"); tBody.insert(row);
        for(var i = 0; i < data.length; i++) {
            radioBtn = new NG_RadioBox(id, data[i].value, (data[i].value == value)) 
            Event.observe(radioBtn, "click", tbl.options.onChange);
            row.insert(new Element("TD").insert(radioBtn)
                                        .insert("&nbsp;"+ data[i].label +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
        }
    } else {
        //TBD
    }

    return tbl;
}

NG_YesNoRadio = function(id, value) {
    
    var yes = new NG_RadioBox(id, "1", value);
    var no = new NG_RadioBox(id, "0", (value == "1" ? "0" : "1"));

    return [yes,"&nbsp;Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", no, "&nbsp;No"];
}

NG_EnableDisableRadio = function(id, value, changeAction) {
    var enable = new NG_RadioBox(id, "1", value);
    var disable = new NG_RadioBox(id, "0", (value == "1" ? "0" : "1"));

    if(changeAction != null && changeAction != undefined) {
        Event.observe(enable, "click", changeAction);
        Event.observe(disable, "click", changeAction);
    }

    return [enable, "&nbsp;enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", disable, "&nbsp;disable"];
}

NG_AutoLongRadio = function(id, value) {
    var auto = new NG_RadioBox(id, "0", (value == "1" ? "0" : "1"));
    var long = new NG_RadioBox(id, "1", value);

    return [auto,"&nbsp;Auto&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", long, "&nbsp;Long"];
}

NG_LocalExternalRadio = function(id, value, changeAction) {
    var local = new NG_RadioBox(id, "0", (value == "1" ? "0" : "1"));
    var external = new NG_RadioBox(id, "1", value);

    if(changeAction != null && changeAction != undefined) {
        Event.observe(local, "click", changeAction);
        Event.observe(external, "click", changeAction);
    }

    return [local,"&nbsp;Local&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", external, "&nbsp;External"];
}

NG_ConfTable = function(options) {

    options = Object.extend({
        "tblClass"   : "tableStyle BlockContent Trans",
        "leftColWidth"   : "50%",
        "rightColWidth"  : "50%"
    }, options || {});

    tbl = this.table = new Element("TABLE", {"class" : options.tblClass});
    tbl.insert(new Element("TBODY"));

    tbl.options = options;

    tbl.addRow = function(labelAry, elementAry) {
        row = new Element("TR");
    
        cell = new Element("TD", {"class" : "DatablockLabel", "width" : this.options.leftColWidth});
        for(i = 0; i < labelAry.length; i++) {
            cell.insert(labelAry[i]);
        }
        row.insert(cell);

        cell = new Element("TD", {"class" : "DatablockContent", "width" : this.options.rightColWidth});
        for(i = 0; i < elementAry.length; i++) {
            cell.insert(elementAry[i]);
        }
        row.insert(cell);

        this.firstDescendant().insert(row);

        return row;
    }

    tbl.addCaptionRow = function(element) {
        row = new Element("TR");
        cell = new Element("TD", {"class" : "DatablockLabel", "width" : "50%", "colspan" : "2" });

        row.insert(cell.update(element));

        this.firstDescendant().insert(row);

        return row;
    }

    return tbl;
}

NG_Table = function(options) {

    options = Object.extend({
        "leftColWidth"   : "50%",
        "rightColWidth"  : "50%"
    }, options || {});

    var tbl = this.table = new Element("TABLE", {"width" :  "100%"});
    tbl.insert(new Element("TBODY"));

    tbl.options = options;

    tbl.addRow = function(labelAry, elementAry) {
        row = new Element("TR");
    
        cell = new Element("TD", {"width" : this.options.leftColWidth});
        for(i = 0; i < labelAry.length; i++) {
            cell.insert(labelAry[i]);
        }
        row.insert(cell);

        cell = new Element("TD", {"width" : this.options.rightColWidth});
        for(i = 0; i < elementAry.length; i++) {
            cell.insert(elementAry[i]);
        }
        row.insert(cell);

        this.firstDescendant().insert(row);

        return row;
    }

    tbl.addCaptionRow = function(element) {
        row = new Element("TR");
        cell = new Element("TD", {"width" : "50%", "colspan" : "2" });

        row.insert(cell.update(element));

        this.firstDescendant().insert(row);

        return row;
    }

    return tbl;
}
NG_IPBox = function(id, value) {
    return new Element("INPUT", { "type"      : "text",
                                  "name"      : id,
                                  "maxlength" : "15",
                                  "size"      : "15",
                                  "value"     : value })
}

NG_GridConfTable = function(id, cols) {
    tbl = this.table = new Element("TABLE", { "class" : "GridConfTable" });
    tbody = new Element("TBODY"); tbl.insert(tbody);
    thead = new Element("TR"); tbody.insert(thead);
    thead.insert(new Element("TH"));

    tbl.rowCount = 0;
    tbl.numOfCols = cols.length;
    for(var i = 0; i < cols.length; i++) {
            col = new Element("TH").insert(cols[i]);
            col.addClassName("Alternate");
            thead.insert(col);
    }

    tbl.addRow = function(label, cols) {
        if(cols.length != this.numOfCols) return;

        className = ( this.rowCount % 2 == 0 ? "Alternate" : "" );

        row = new Element("TR"); tbody.insert(row);
        row.addClassName(className);
        row.insert(new Element("TH").update(label));
        for(var i = 0; i < cols.length; i++) {
            className = (tbl.rowCount % 2 == 0 ? "Alternate" : "");
            col = new Element("TD").insert(cols[i]);
            col.addClassName(className);
            row.insert(col);
        }

        this.rowCount++;
    }

    return tbl;
}

NG_UI_button = function(id, name, type, action) {

    btn = new Element("IMG", {"id"    : id,
                              "class" : "actionImg",
                              "src"   : "images/" + name + "_" + "on" + ".gif"});
    btn.onClick = action;
    btn.name = name;
    btn.type = type;
    btn.state = "enabled";

    Event.observe(btn, "click", btn.onClick);

    btn.mouseOver = function(e) { 
        Event.element(e).addClassName('on');
    }
    btn.mouseOut = function(e) { 
        Event.element(e).removeClassName('on');
    };

    Event.observe(btn, "mouseover", btn.mouseOver);
    Event.observe(btn, "mouseout", btn.mouseOut);

    btn.style.marginLeft = "3px";
    btn.style.marginRight = "3px";

    btn.enable = function(flag) {
        if(this.state == "inActive") return;
        
        if(flag) {
            Event.observe(this, "click", this.onClick);
            this.src = "images/" + name + "_" + "on" + ".gif"
            Event.observe(this, "mouseover", this.mouseOver);
            Event.observe(this, "mouseout", this.mouseOut);
            this.state = "enabled";
         } else {
            Event.stopObserving(this, "click", this.onClick);
            this.src = "images/" + name + "_" + "off" + ".gif"
            Event.stopObserving(this, "mouseover", this.mouseOver);
            Event.stopObserving(this, "mouseout", this.mouseOut);
            this.state = "disabled";
         }
    }

    btn.inActivate = function() {
        Event.stopObserving(this, "click", this.onClick);
        this.src = "images/" + name + "_" + "disable" + ".gif";
        Event.stopObserving(this, "mouseover", this.mouseOver);
        Event.stopObserving(this, "mouseout", this.mouseOut);
        this.state = "inActive";
    }

    return btn;
};

NG_ButtonPanel = function() {
    this.btnHash = new Hash();
    this.reset = function() {
        $("standardButtons").update();
    }
    this.add = function(id, btn) {
        $("standardButtons").insert(btn);
        this.btnHash.set(id, btn);
    }
    this.remove = function(id) {
        this.btnHash.get(id).remove();
    }
    this.get = function(id) {
        return this.btnHash.get(id);
    }
}

postData = function(url, target, data) {
    form = new Element("FORM", {"method" : "post", "action" : url, "target" : target});
    for(var i = 0; i < data.length; i++) {
        form.insert(new NG_HiddenBox(data[i].name, data[i].value));
    }

    $("contents").insert(form);
    form.submit();
}

formChangeAction = function(formObj, actionCallback) {
    elements = Form.getElements(formObj);
    for(var i = 0; i < elements.length; i++) {
        Event.observe(elements[i], "change", actionCallback);
        Event.observe(elements[i], "keydown", actionCallback);
    }
}

jalert = function(obj) {
    alert(Object.toJSON(obj));
}
