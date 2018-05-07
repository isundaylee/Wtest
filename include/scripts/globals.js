var browserName = getBrowserName();
var contentPage;
var popupPage;
var menuObject = new menuClass();
var busyBar;
var buttonPanel = new NG_ButtonPanel();
var fileUploadFrame = new Element("IFRAME", 
                                  {"id"           : "file_upload_frame",
                                   "name"         : "file_upload_frame",
                                   "src"          : "blank.php",
                                   "height"       : "0px",
                                   "width"        : "0px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});
                                   
/* Move to layout specific file later */
function layout()
{
    var footerHeight = 64;
    var headerHeight = 123;
    var rightEdgeWidth = 11;
    var leftEdgeWidth = 11;
    var leftMenuWidth = 155;
    var scrollBarWidth = 12;

    var contentHeight = document.viewport.getHeight() - (footerHeight + headerHeight);
    var contentBodyHeight = contentHeight;
    var contentWidth = document.viewport.getWidth() - (leftEdgeWidth + leftMenuWidth + rightEdgeWidth) - 10;
    var contentBodyWidth = contentWidth - 10;
    var footerPosition = document.viewport.getHeight() - footerHeight;
    var rightEdgePosition = document.viewport.getWidth() - rightEdgeWidth;
    var guiLockWidth = document.viewport.getWidth() - rightEdgeWidth - scrollBarWidth;

    $('headerMain').style.width          = document.viewport.getWidth() + 'px';
    $('footerMain').style.width          = document.viewport.getWidth() + 'px';

    $('contentRightEdge').style.left     = rightEdgePosition + 'px';
    $('contentMenu').style.height        = contentHeight + 'px';
    $('contentRightEdge').style.height   = contentHeight + 'px';
    $('contentLeftEdge').style.height    = contentHeight + 'px';

    $('contents').style.height           = contentBodyHeight + 'px';
    $('contents').style.width            = contentWidth + 'px';

    $('footerMain').style.top            = footerPosition + 'px';
    $('footerMain').style.bottomMargin   = '0px';



    $('guiLock').style.width = guiLockWidth + 'px';
    $('guiLock').style.height = document.viewport.getHeight() + 'px';
    $('guiLock').style.left = '0px';
    $('guiLock').style.top = '0px';

    $('popupContainer').style.width = document.viewport.getWidth() + 'px';
    $('popupContainer').style.height = document.viewport.getHeight() + 'px';
    $('popupContainer').style.left = '0px';
    $('popupContainer').style.top = '0px';

    blHeight = contentBodyHeight - 3;
    $('bodyLock').style.height           = blHeight + 'px';
    $('bodyLock').style.width            = contentWidth + 'px';

    busyBar = new NG_ProgressBar().hide();
    Event.observe($('logout_btn'), "click", logout);

}

Event.onDOMReady ( function() {
    layout();
    unlockGui();
    unlockBody();
    $('popupContainer').hide();
    window.onresize = layout;
    $(window.document.body).insert(fileUploadFrame);
    menuObject.updateMenu('first', 0, true);
    checkLogin();
});

Discovery = function() {
    this.addApProgressBar = new NG_ProgressBar ( { "showProgressBar" : false } ).hide();
    this.discoveryResultAuto = null;
    this.discoveryResultManual = null;
    this.apList = null;
    var resTblL2 = null;
    var resTblL3 = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("Access Point Discovery", { "width" : "426px" });

        $("contents").update(contentPage);

        this.getApList();
        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        srchBtn = new NG_UI_button("btn_search", "search", "on", this.startDiscovery);
        buttonPanel.add("search", srchBtn);
        addBtn = new NG_UI_button("btn_add", "add", "off", this.getPassword);
        buttonPanel.add("add", addBtn);

        cancelBtn.enable(false);
        if(userType != "admin") {
            addBtn.inActivate();
        }
    };
    this.cancelAction = function() {
        new Discovery().openPage();
    }.bind(this);
    this.getApList = function() {
        new ajaxRequest().sendRequest("get_ap_list",
                                      null,
                                      this.handleGetApList);
    }.bind(this);

    this.handleGetApList = function(value) {
        this.apList = value;
        this.getDiscoveryResultAuto();
    }.bind(this);

    this.getDiscoveryResultAuto = function() {
        new ajaxRequest().sendRequest("get_discovery_result_auto",
                                      null,
                                      this.handleGetDiscoveryResultAuto);
    }.bind(this);
    this.handleGetDiscoveryResultAuto = function(value) {
            this.discoveryResultAuto = value;
            this.getDiscoveryResultManual();
    }.bind(this);

    this.getDiscoveryResultManual = function() {
            new ajaxRequest().sendRequest("get_discovery_result_manual",
                                          null,
                                          this.handleGetDiscoveryResultManual);
    }.bind(this);
    this.handleGetDiscoveryResultManual = function(value) {
        buttonPanel.get("add").enable(false);
        this.discoveryResultManual = value;
        var isReplace = !(this.resTblL2 == null);
        if(isReplace) {
            curResTblL2 = this.resTblL2;
            curResTblL3 = this.resTblL3;

            this.resTblL2 = this.V_APDisoveryResult(this.discoveryResultAuto);
            this.resTblL3 = this.V_APDisoveryResult(this.discoveryResultManual);
            p = curResTblL2.up();
            curResTblL2.remove();
            p.insert(this.resTblL2);
            if ( !(p.up("form") == undefined) ) {
                p.up("form").resultsTable = this.resTblL2;
            }
            p = curResTblL3.up();
            curResTblL3.remove();
            p.insert(this.resTblL3);
            if ( !(p.up("form") == undefined)) {
                p.up("form").resultsTable = this.resTblL3;
            }
        } else {
            contentPage.remove("Discovery");
            contentPage.add(this.V_APDisoveryInput(), "Discovery",
                            "Access Point Discovery", "help/help_discovery.html");
        }
        buttonPanel.get("cancel").enable(false);
    }.bind(this);


    this.startDiscovery = function() {
        selectedComp = contentPage.get("Discovery").getSelectedTab();
        jsonStr = "";
        if(selectedComp.id == "discovery_l3") {
            h = $H(selectedComp.serialize(true));
            var startIp = h.get("start_ip1") + "." + h.get("start_ip2") + "." + 
                      h.get("start_ip3") + "." + h.get("start_ip4");
            var endIp   = h.get("end_ip1") + "." + h.get("end_ip2") + "." + 
                      h.get("end_ip3") + "." + h.get("end_ip4");

            $('errorBlock').reset();
            if(startIp == "" || !Validation.get('validate-ip').test(startIp)) {
                $('errorBlock').addError("Invalid Start IP");
                return;
            }
            if(endIp == "" || !Validation.get('validate-ip').test(endIp)) {
                $('errorBlock').addError("Invalid End IP");
                return;
            }
            
            jsonStr = Object.toJSON({"start_ip" : startIp, "end_ip" : endIp});
            
        }

        new ajaxRequest().sendRequest(selectedComp.id,
                                      jsonStr,
                                      this.handleStartDiscovery,
                                      { showBusyBar : false});
    }.bind(this);

    this.handleStartDiscovery = function(value) {
        new NG_ProgressMonitor("get_discovery_progress",
                               "",
                               this.handleDiscoveryProgress);
    }.bind(this);

    this.handleDiscoveryProgress = function(value) {
        this.getDiscoveryResultAuto();
    }.bind(this);

    this.getPassword = function() {
        this.popup = new NG_UI_popup("Password");
        tblPassword = new NG_ConfTable();
        passwordTextBox = new NG_PasswordBox("password", "");
        tblPassword.addRow(["Password"], [passwordTextBox]);
        tblPassword.addCaptionRow("If the password field is blank, the default");
        tblPassword.addCaptionRow("password will be used to login to all APs.");
        this.popup.passwordTextBox = passwordTextBox;
        this.popup.add(tblPassword, "password", "Enter access point password", "");
        
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.hidePopup);
        this.popup.buttonDiv.insert(cancelBtn);

        addBtn = new NG_UI_button("btn_add", "add", "off", this.addAps);
        this.popup.buttonDiv.insert(addBtn);

        var tbl = $("popup").down();
        tbl.style.width = "400px";
        paddingLeft = (document.viewport.getWidth() - 400)/2;
        $("popup").style.left = paddingLeft + "px";
        $("popup").style.top = "200px";
    }.bind(this);

    this.hidePopup = function() {
        $("popupContainer").hide();
        unlockGui();
    }.bind(this);

    this.addAps = function() {
        this.hidePopup();
        unlockGui();
        var form = contentPage.get("Discovery").getSelectedTab();
        var tbl = form.resultsTable;

        var password = this.popup.passwordTextBox.value;
        
        if (password != "") {
            for(var i = 0; i < tbl.options.data.length; i++) {
                tbl.options.data[i].password = password;
            }
        }

        data = tbl.getSelectedData();
        new ajaxRequest().sendRequest("add_ap",
                                      data.toJSON(),
                                      this.handleAddAps,
                                      { showBusyBar : false });
    }.bind(this);

    this.handleAddAps = function(value) {
        var tbl = contentPage.get("Discovery").getSelectedTab().resultsTable;
        new NG_ProgressMonitor("get_add_ap_progress",
                               tbl.getSelectedData().toJSON(),
                               this.handleAddApProgress,
                               { "type" : "#" });
    }.bind(this);
    this.handleAddApProgress = function(value) {
        menuObject.updateMenu("second", 2);
    }.bind(this);

    this.V_APDisoveryInput = function() {

        sIp1 = new NG_TextBox('start_ip1', "", {"size" : "3", "maxlength" : "3"});
        sIp2 = new NG_TextBox('start_ip2', "", {"size" : "3", "maxlength" : "3"});
        sIp3 = new NG_TextBox('start_ip3', "", {"size" : "3", "maxlength" : "3"});
        sIp4 = new NG_TextBox('start_ip4', "", {"size" : "3", "maxlength" : "3"});
        eIp1 = new NG_TextBox('end_ip1', "", {"size" : "3", "maxlength" : "3",
                                              "disabled" : "disabled"});
        eIp2 = new NG_TextBox('end_ip2', "", {"size" : "3", "maxlength" : "3",
                                              "disabled" : "disabled"});
        eIp3 = new NG_TextBox('end_ip3', "", {"size" : "3", "maxlength" : "3",
                                              "disabled" : "disabled"});
        eIp4 = new NG_TextBox('end_ip4', "", {"size" : "3", "maxlength" : "3"});
        sIp1.sync = eIp1;
        sIp2.sync = eIp2;
        sIp3.sync = eIp3;
        sIp4.sync = eIp4;

        IpSync = function(event) {
            e = Event.element(event);
            e.sync.value = e.value;
        }

        Event.observe(sIp1, "change", IpSync);
        Event.observe(sIp2, "change", IpSync);
        Event.observe(sIp3, "change", IpSync);
        Event.observe(sIp4, "change", IpSync);

        tblL3 = new NG_ConfTable();
        tblL3.addRow(["Start IP"], [sIp1, ".", sIp2, ".", sIp3, ".", sIp4]);
        tblL3.addRow(["End IP"], [eIp1, ".", eIp2, ".", eIp3, ".", eIp4]);
        tblL3.addCaptionRow("<font class='warningNote'>Note: Access Point IP addresses should be reachable from WMS5316.</font>");

        this.resTblL3 = this.V_APDisoveryResult(this.discoveryResultManual);
        tblL3.addCaptionRow(this.resTblL3);
        formTblL3 = Element.wrap(tblL3, "form", {"id":"discovery_l3"});
        formTblL3.resultsTable = this.resTblL3;
        
        tblL2 = new NG_ConfTable();
        tblL2.addCaptionRow("Search Unmanaged Access Points in local network");
        tblL2.addCaptionRow("");

        this.resTblL2 = this.V_APDisoveryResult(this.discoveryResultAuto);
        tblL2.addCaptionRow(this.resTblL2);
        formTblL2 = Element.wrap(tblL2, "form", {"id":"discovery_mac"});
        formTblL2.resultsTable = this.resTblL2;

        formChangeAction(formTblL2, function(){
            buttonPanel.get("cancel").enable(true);
        });
        formChangeAction(formTblL3, function(){
            buttonPanel.get("cancel").enable(true);
        });

        onTabChange = function(currentComp, newComp) {
            if(newComp.resultsTable.getSelectedDataCount() > 0) {
                buttonPanel.get("add").enable(true);
            } else {
                buttonPanel.get("add").enable(false);
            }
            
            return true;
        }

        tabbedPanDiscovery = new NG_UI_tabbedPan("discovery",
                                                 {"onTabClicked" : onTabChange})
            .addTab("tab_l2_discovery", "Auto Discovery", formTblL2)
            .addTab("tab_l3_discovery", "IP Discovery", formTblL3);
            
        return tabbedPanDiscovery;
    };
    this.V_APDisoveryResult = function(results) {
        if(results.length == 0) {
            cols = ["Model", "Ip", "Mac"];
        } else {
            cols = Object.keys(results[0]);
        }

        apHash = new Hash();
        for(i = 0; i < this.apList.length; i++) {
            apHash.set(this.apList[i].ip, this.apList[i].model);
        }
        resultsToShow = new Array();
        for(i = 0; i < results.length; i++) {
            if(apHash.get(results[i].ip) == null ||
               apHash.get(results[i].ip) != results[i].model) {
                resultsToShow[resultsToShow.length] = results[i];
            }
        }
        for(i = 0; i < resultsToShow.length; i++) {
            resultsToShow[i].disabledKeyCol = (resultsToShow[i].model == "UNKNOWN");
        }

        multiSelectAction = function(cheked, count) {
                buttonPanel.get("add").enable(count > 0);
        }.bind(this);

        for(var i = 0; i < resultsToShow.length; i++) {
            link = new Element("A", { href : "http://" + resultsToShow[i].ip + "/",
                                      target : "_blank"})
                       .update(resultsToShow[i].ip);
            link.value = resultsToShow[i].ip;
            resultsToShow[i].ip = link;
        }

        disResultTable = new NG_TableOrderer('AccessPointDiscovery',
                               {"data"              : resultsToShow,
                                "orderField"        : "model",
                                "multiSelect"       : "added",
                                "multiSelectAction" : multiSelectAction,
                                "pageCount"         : 16,
                                "columns"           : cols,
                                "disabledKeyCol"    : "disabledKeyCol",
                                "noColDataFields"   : ["user_name", "password"]});
        return disResultTable;
    }
};

GroupList = function(currentGroupIndex) {
    this.managedApsTable;
    this.groupList = null;
    this.currentGroupIndex = currentGroupIndex;
    if(this.currentGroupIndex == undefined) {
        this.currentGroupIndex = 1;
    }
    this.openPage = function(){
        contentPage = new NG_UI_page("Groups");
        $("contents").update(contentPage);

        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        addBtn = new NG_UI_button("btn_add", "add", "off", this.addAp);
        buttonPanel.add("add", addBtn);

        removeBtn = new NG_UI_button("btn_remove", "remove", "off", this.removeAp);
        buttonPanel.add("remove", removeBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
            addBtn.inActivate();
            removeBtn.inActivate();
        }
        removeBtn.enable(false);
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getManagedAps();
    }.bind(this);

    this.getManagedAps = function() {
        new ajaxRequest().sendRequest("get_ap_list",
                                      null,
                                      this.handleGetManagedAps);
    }.bind(this);

    this.handleGetManagedAps = function(value) {
        this.apList = value;
        contentPage.remove("Groups");
        grpHash = new Hash();
        value.each(function(e) {
            apList = grpHash.get(e.group_name);
            if(apList == undefined) { apList = new Array(); grpHash.set(e.group_name, apList);};
            apList[apList.length] = e;
        });

        keyList = grpHash.keys();

        onTabClicked = function(oldComp, newComp) {
            buttonPanel.get("remove").enable(newComp.apTable.getSelectedData().length > 0);
            return true
        }.bind(this);
        tabbedPan = new NG_UI_tabbedPan("groups", { "onTabClicked" : onTabClicked });
        
        for(var i = 1; i < this.groupList.length; i++) {
            //if(this.groupList[i].label == "default") { continue; }

            var tbl = new NG_ConfTable({"leftColWidth"   : "20%",
                                        "rightColWidth"  : "80%"});

            if((data = grpHash.get(this.groupList[i].label)) != null) {
                for(var j = 0; j < data.length; j++) {
                    data[j].to_remove = false;
                }

                multiSelectAction = function(cheked, count) {
                    buttonPanel.get("remove").enable(count > 0);
                    this.enableCancel();
                }.bind(this);

                element =  new NG_TableOrderer('AccessPointDiscovery',
                               {"data"              : data,
                                "multiSelectAction" : multiSelectAction,
                                "multiSelect"       : "to_remove",
                                "noColDataFields"   : ["group_name", "user_name", "password"]}
                );
            } else {
	            cols = ["Ip", "Model", "Name", "Synchronized", "Status", "to_remove"];
                element = new NG_TableOrderer('AccessPointDiscovery',
                                              {"data"            : [],
                                               "multiSelect"     : "to_remove",
                                               "columns"         : cols});
            }

            tbl.id = this.groupList[i].value;

            var grpNameTextBox = new NG_TextBox("group_name",
                                         this.groupList[i].label,
                                         {maxlength : 32});
            Event.observe(grpNameTextBox, "keydown", function() {
                buttonPanel.get("cancel").enable(true);
            });
            tbl.addRow(["Group Name"], [grpNameTextBox]);
            tbl.grpNameTextBox = grpNameTextBox;
            tbl.addCaptionRow("&nbsp");
            
            tbl.addRow(["Access Points in Group"], [""]);
            tbl.addCaptionRow(element);
            tbl.apTable = element;

            tabbedPan.addTab(this.groupList[i].value,
                             this.groupList[i].label,
                             tbl); 
        }
        contentPage.add(tabbedPan, "Groups", "Groups", "help/help_managed_ap_group.html");
        tabbedPan.selectTabByIndex(this.currentGroupIndex - 1);
    }.bind(this);

    this.applyConfig = function() {
        this.currentGroupIndex = contentPage.get("Groups").getSelectedTabIndex() + 1;
        var grpTbl = contentPage.get("Groups").getSelectedTab();
        jObject = { group_name : grpTbl.grpNameTextBox.value,
                    group_idx : grpTbl.id};
        new ajaxRequest().sendRequest("set_group_name",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);
    
    this.handleApplyConfig = function(value) {
        this.getGroupList();
    }.bind(this);
    
    this.removeAp = function() {
        this.currentGroupIndex = contentPage.get("Groups").getSelectedTabIndex() + 1;
        var dataAdd = contentPage.get("Groups").getSelectedTab().apTable.getSelectedData();
        for(var i = 0; i < dataAdd.length; i++) {
            dataAdd[i].group_idx = 0;
        }
        new ajaxRequest().sendRequest("edit_group_list",
                                      dataAdd.toJSON(),
                                      this.handleRemoveAp);
    }.bind(this);

    this.handleRemoveAp = function(value) {
        var dataAdd = contentPage.get("Groups").getSelectedTab().apTable.getSelectedData();
        for(var i = 0; i < dataAdd.length; i++) {
            dataAdd[i].group_idx = this.groupIdx;
        }

        new NG_ProgressMonitor("get_add_ap_progress",
                               dataAdd.toJSON(),
                               this.handleRemoveApProgress,
                               { "type" : "#" });
    }.bind(this);

    this.handleRemoveApProgress = function(value) {
        this.getGroupList();
    }.bind(this);

    this.addAp = function() {        
        var grpTbl = contentPage.get("Groups").getSelectedTab();
        new EditGroupList(grpTbl.id,
                          valueTolabel(this.groupList, grpTbl.id),
                          this.apList).openPage();
    }.bind(this);
}

EditGroupList = function(groupIdx, groupName, apList) {
    this.groupIdx = groupIdx;
    this.groupName = groupName;
    this.apList = apList;

    this.openPage = function() {
        contentPage = new NG_UI_page("Add Access Points(" + this.groupName + ")", { "width" : "426px" });
        $("contents").update(contentPage);

        contentPage.add(this.V_AddApList(), "AddGroupList", "Add Access Points to " + this.groupName, "help/help_managed_ap_group_edit.html");

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        backBtn = new NG_UI_button("btn_back", "back", "off", this.backAction);
        buttonPanel.add("back", backBtn);

        addBtn = new NG_UI_button("btn_apply", "add", "off", this.addAp);
        buttonPanel.add("add", addBtn);
        addBtn.enable(false);
        if(userType != "admin") {
            addBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.enableCancel = function(cheked, count) {
        buttonPanel.get("cancel").enable(true);
    }.bind(this);

    this.V_AddApList = function() {
        var otherGroupAp = new Array();
        for(var i = 0; i < this.apList.length; i++) {
            if(this.apList[i].group_name != this.groupName) {
                var apData = this.apList[i];
                apData["to_add"] = false;
                otherGroupAp[otherGroupAp.length] = apData;
            }
        }

        if(otherGroupAp.length != 0) {
            multiSelectAction = function(cheked, count) {
                buttonPanel.get("add").enable(count > 0);
                this.enableCancel();
            }.bind(this);

            cols = Object.keys(otherGroupAp[0]);
            otherGroupApTbl =  new NG_TableOrderer('OtherGroupAp',
                                                  {"data"              : otherGroupAp,
                                                   "multiSelect"       : "to_add",
                                                   "multiSelectAction" : multiSelectAction,
                                                   "columns"           : cols,
                                                   "noColDataFields"   : ["user_name", "password", "to_remove"]});
        } else {
            cols = ["Ip", "Model", "Name", "group_name", "Synchronized", "Status", "to_add"];
            otherGroupApTbl = new NG_TableOrderer('OtherGroupAp',
                                                  {"data"     : [],
                                                   "multiSelect"     : "to_add",
                                                   "columns" : cols});
        }
        return otherGroupApTbl;
    };

    this.addAp = function() {
        var dataAdd = contentPage.get("AddGroupList").getSelectedData();
        for(var i = 0; i < dataAdd.length; i++) {
            dataAdd[i].group_idx = this.groupIdx;
        }
        new ajaxRequest().sendRequest("edit_group_list",
                                      dataAdd.toJSON(),
                                      this.handleAddAp);
    }.bind(this);

    this.handleAddAp = function(value) {
        var dataAdd = contentPage.get("AddGroupList").getSelectedData();
        for(var i = 0; i < dataAdd.length; i++) {
            dataAdd[i].group_idx = this.groupIdx;
        }

        new NG_ProgressMonitor("get_add_ap_progress",
                               dataAdd.toJSON(),
                               this.handleAddApProgress,
                               { "type" : "#" });
    }.bind(this);

    this.handleAddApProgress = function(value) {
        new GroupList(this.groupIdx).openPage();
    }.bind(this);

    this.backAction = function() {
        new GroupList(this.groupIdx).openPage();
    }.bind(this);
}

ManagedApList = function() {
    this.managedApsTable;
    this.openPage = function() {
        contentPage = new NG_UI_page("Managed Access Point List", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getManagedAps();

        buttonPanel.reset();

        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        editBtn = new NG_UI_button("btn_edit", "edit", "off", this.editAp);
        buttonPanel.add("edit", editBtn);

        removeBtn = new NG_UI_button("btn_delete", "remove", "off", this.deleteAps);
        buttonPanel.add("remove", removeBtn);

        if(userType != "admin") {
            editBtn.inActivate();
            removeBtn.inActivate();
        }
        removeBtn.enable(false);
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getManagedAps = function() {
        new ajaxRequest().sendRequest("get_ap_list",
                                      null,
                                      this.handleGetManagedAps);
    }.bind(this);

    this.handleGetManagedAps = function(value) {
        contentPage.remove("ManagedAPs");
        if(value == null || value.size() == 0) {
            value = [{"Ip":"", "Model":"", "Name":"",
                      "Group_name":"", "Synchronised":"", "Status":""}];
            this.managedApsTable = new NG_TableOrderer('ManagedAPs',
                                                      {"data"                   : value,
                                                       "singleSelectKeyField"   : "ip",
                                                       "hideData"               : true,
                                                       "multiSelect"            : "to_delete"});

        } else {
            multiSelectAction = function(cheked, count) {
                buttonPanel.get("remove").enable(count > 0);
                buttonPanel.get("cancel").enable(true);
            }.bind(this);

            value.each(function(e) { e["to_delete"] = false;  });
            this.managedApsTable = new NG_TableOrderer('ManagedAPs',
                                                       {"data"                : value,
                                                       "singleSelectKeyField" : "ip",
                                                       "pageCount"            : 16,
                                                       "multiSelect"          : "to_delete",
                                                       "multiSelectAction"    : multiSelectAction,
                                                       "noColDataFields"      : ["user_name", "password"]});
        }

        contentPage.add(this.managedApsTable, "ManagedAPs", "Managed Access Points List", "help/help_managed_ap_list.html");
        buttonPanel.get("cancel").enable(false);
    }.bind(this);

    this.editAp = function() {
        jObject = {ip : this.managedApsTable.getSingleSelectData().ip};
                new ajaxRequest().sendRequest("get_ap",
                                              Object.toJSON(jObject),
                                              this.handleEditAp);
    }.bind(this);

    this.handleEditAp = function(value) {
        new EditAP(value, this.afterApEdit).openPage();
    }.bind(this);

    this.afterApEdit = function() {
        this.openPage();
    }.bind(this);

    this.deleteAps = function() {
                new ajaxRequest().sendRequest("del_ap",
                                              this.managedApsTable.getSelectedData().toJSON(),
                                              this.handleDeleteAps);
    }.bind(this);

    this.handleDeleteAps = function(value) {
        //this.getManagedAps();
        this.openPage();
    }.bind(this);
}

BasicWireless = function(apInfo) { // RF Manager
    this.apInfo = apInfo;
    this.groupList = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Wireless Settings", { "width" : "426px" });

        $("contents").update(contentPage);

        this.getBasicWireless();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };
    this.cancelAction = function() {
        this.openPage();
    }.bind(this);
    this.getBasicWireless = function() {
        new ajaxRequest().sendRequest("get_basic_wireless",
                                       null,
                                       this.handleGetBasicWireless);
    }

    this.handleGetBasicWireless = function(value) {
        this.config = value;
        contentPage.remove("CentralizedRFMgmt");
        contentPage.remove("CustomRFSettings");

        formCentralizedRFMgmt = Element.wrap(this.V_CentralizedRFMgmt(value),
                                "form",
                                {"id" : "formCentralizedRFMgmt"});
        contentPage.add(formCentralizedRFMgmt,
                        "CentralizedRFMgmt",
                        "Centralized RF Management",
                        "help/help_basic_wireless.html");

        formCustomRFSettings = Element.wrap(this.V_CustomRFSettings(value),
                                            "form",
                                            {"id" : "formCustomRFSettings"});
                                            
        formChangeAction(formCentralizedRFMgmt, function() {
            buttonPanel.get("cancel").enable(true);
        });
        formChangeAction(formCustomRFSettings, function() {
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.add(formCustomRFSettings,
                        "CustomRFSettings",
                        "Custom RF Settings",
                        "help/help_basic_wireless.html");
        this.centralizedRfMgmtSet(value.centralized_rf_mgmt);
        buttonPanel.get("cancel").enable(false);
    }.bind(this);

    this.V_CustomRFSettings = function(config) {
        customRFSettingsTbl = new NG_ConfTable();

        wnsCombo = new NG_Combo("wireless_n_settings",
                                [{"label" : "Select n/g/b mode when supported", "value" : "0"},
                                 {"label" : "Select g/b mode only", "value" : "1"},
                                 {"label" : "Select b mode only", "value" : "2"}],
                                config.wireless_n_settings);
        freqCombo = new NG_Combo("freq_band",
                                [{"label" : "Select 2.4Ghz only", "value" : "0"},
                                 {"label" : "Select 5Ghz only", "value" : "1"}],
                                config.freq_band);

        customRFSettingsTbl.addRow(["Mode Setting"], [wnsCombo]);
        customRFSettingsTbl.addRow(["2.4Ghz or 5Ghz band selection"], [freqCombo]);

        return customRFSettingsTbl;
    };
    this.centralizedRfMgmtChange = function(event) {
        var e = Event.element(event);
        this.centralizedRfMgmtSet(e.value);
     }.bind(this);

    this.centralizedRfMgmtSet = function(value) {
        if(value == "1") {
            contentPage.get("CentralizedRFMgmt").enable();
            contentPage.get("CustomRFSettings").enable();
        } else {
            contentPage.get("CentralizedRFMgmt").disable();
            contentPage.get("CustomRFSettings").disable();
        }
        
        if(value == "1" && this.config.centralized_rf_mgmt == "1") {
            runNowButton.enable(true);
        } else {
            runNowButton.enable(false);
        }

        this.enableDisableRfMgmt[0].enable();
        this.enableDisableRfMgmt[2].enable();
    }.bind(this);

    this.V_CentralizedRFMgmt = function(config) {
        centralizedRfMgmtTbl = new NG_ConfTable();

        this.enableDisableRfMgmt = new NG_EnableDisableRadio("centralized_rf_mgmt",
                                                        config.centralized_rf_mgmt,
                                                        this.centralizedRfMgmtChange);
        centralizedRfMgmtTbl.addRow(["Centralized RF Managment"],
                                    this.enableDisableRfMgmt);

        hrCombo = new NG_RangeCombo("run_chnl_alc_hr", 0, 23, config.run_chnl_alc_hr);
        minCombo = new NG_RangeCombo("run_chnl_alc_min", 0, 59, config.run_chnl_alc_min);

        st = "padding: 3px 15px 3px 0px;";
        daysTbl = new Element("TABLE", {"class" : "tableStyle"});
        daysTbody = new Element("TBODY"); daysTbl.update(daysTbody);
        daysTbody.insert(new Element("TR")
                            .insert(new Element("TD").update("m"))
                            .insert(new Element("TD").update("t"))
                            .insert(new Element("TD").update("w"))
                            .insert(new Element("TD").update("t"))
                            .insert(new Element("TD").update("f"))
                            .insert(new Element("TD").update("s"))
                            .insert(new Element("TD").update("s"))
                        );
        daysTbody.insert(new Element("TR")
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_m", config.repeat_on_m)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_t", config.repeat_on_t)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_w", config.repeat_on_w)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_th", config.repeat_on_th)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_f", config.repeat_on_f)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_st", config.repeat_on_st)))
                            .insert(new Element("TD", {"style": st}).update(new NG_CheckBox("repeat_on_su", config.repeat_on_su)))
                        );

        runNowButton = new NG_UI_button("run_now", "run_now", "on", this.runCA);
        if(config.centralized_rf_mgmt == "1") {
            runNowButton.enable(false);
        }

        centralizedRfMgmtTbl.addRow(["Client aware RF Management"],
                               new NG_EnableDisableRadio("client_aw_rf_mgmt", config.client_aw_rf_mgmt));
        centralizedRfMgmtTbl.addRow(["Usage aware RF Management"],
                               new NG_EnableDisableRadio("usage_aw_rf_mgmt", config.usage_aw_rf_mgmt));
        centralizedRfMgmtTbl.addRow(["Run channel allocation at"],
                               ["hr : ", hrCombo, "&nbsp&nbsp&nbsp min : ", minCombo]);
        centralizedRfMgmtTbl.addRow(["Run channel allocation every"],
                               [daysTbl]);
        centralizedRfMgmtTbl.addRow(["Run channel allocation now"],
                               [runNowButton]);
        return centralizedRfMgmtTbl;
    };

    this.applyConfig = function() {

        formCentralizedRFMgmt = contentPage.get("CentralizedRFMgmt");
        formCustomRFSettings = contentPage.get("CustomRFSettings");

        jHash = $H(formCentralizedRFMgmt.serialize(true))
                    .merge($H(formCustomRFSettings.serialize(true)));

        new ajaxRequest().sendRequest("set_basic_wireless",
                                      jHash.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        //alert("Basic wireless settings saved successfully");
        this.getBasicWireless();
    }.bind(this);


    this.runCA = function() {
        new ajaxRequest().sendRequest("json_cli_get_rfmgr_run",
                                      null,
                                      this.handleRunCA);
    }.bind(this);
    this.handleStartDiscovery = function(value) {

                               
    }.bind(this);
    this.handleRunCA = function(value) {
        new NG_ProgressMonitor("progress_chnl_alc",
                               "",
                               this.handleRunCAProgress);
    }.bind(this);

    this.handleRunCAProgress = function(value) {
    }.bind(this);
}

AdvancedWireless = function() {
    this.managedApsTable;
    this.groupList = null;
    this.radioBounds = null;

    this.chnlWidthAry = [{ "label" : "20 MHz",            "value" : "1" },
                         { "label" : "40 MHz",            "value" : "2" }];

    this.guardIntervalAry = [{ "label" : "Auto",           "value" : "1" },
                             { "label" : "long - 800 ns",  "value" : "2" }];

    this.tPowerAry = [{ "label" : "Full",    "value" : "0" },
                      { "label" : "Half",    "value" : "1" },
                      { "label" : "Quarter", "value" : "2" },
                      { "label" : "Eighth",  "value" : "3" },
                      { "label" : "Minimum", "value" : "4" }];

    this.bgModeArray = [{ "label" : "802.11b",  "value" : "0" },
                        { "label" : "802.11bg", "value" : "1" },
                        { "label" : "802.11ng", "value" : "2" }];
    this.aModeArray = [{ "label" : "802.11a",  "value" : "3" },
                       { "label" : "802.11na", "value" : "4" }];
    this.modeArray = this.bgModeArray.concat(this.aModeArray);

    this.openPage = function() {
        new ajaxRequest().sendRequest("get_basic_wireless",
                                       null,
                                       this.handleGetBasicWireless);
    };
    this.handleGetBasicWireless = function(config) {
        this.basicWirelessConfig = config;
        contentPage = new NG_UI_page("Wireless Settings");
        $("contents").update(contentPage);

        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        applyBtn.enable(this.basicWirelessConfig.centralized_rf_mgmt == "0");
        cancelBtn.enable(false);
    }.bind(this);

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.validate = function() {
        grpTab = contentPage.get("WirelessSettings").getSelectedTab();
        radioTabs = grpTab.getAllTabs();
       
        this.validationBG = new Validation(radioTabs[0], {onSubmit:false,
                                                useTitles : true});
        this.validationBG.reset();
        if(!this.validationBG.validate()) {
            grpTab.selectTabByIndex(0);
            return false;
        }

        this.validationA = new Validation(radioTabs[1], {onSubmit:false,
                                                useTitles : true});
        this.validationA.reset();
        if(!this.validationA.validate()) {
            grpTab.selectTabByIndex(1);
            return false;
        }

        return true;
    }
    
    this.applyConfig = function() {
        if (!this.validate())
            return;
        grpTab = contentPage.get("WirelessSettings").getSelectedTab();
        radioTabs = grpTab.getAllTabs();

        bgHash = $H(radioTabs[0].serialize(true));

        keys = bgHash.keys();
        channels = new Array();
        for(var i = keys.indexOf("preamble_type") + 1; i < keys.length; i++) {
            channels[channels.length] = { "ip" : keys[i], "channel" : bgHash.get(keys[i]) };
            bgHash.unset(keys[i]);
        }
        bgHash.set("ap_channels", channels);
        bgHash.set("type", radioTabs[0].id);
        if(bgHash.get("wireless_mode") != "2") {
            bgHash.set("channel_width", 0);
            bgHash.set("guard_interval", 0);
        }

        aHash = $H(radioTabs[1].serialize(true));
        keys = aHash.keys();
        channels = new Array();
        for(var i = keys.indexOf("preamble_type") + 1; i < keys.length; i++) {
        
            channels[channels.length] = { "ip" : keys[i], "channel" : aHash.get(keys[i]) };
            aHash.unset(keys[i]);
        }
        aHash.set("ap_channels", channels);
        aHash.set("type", radioTabs[1].id);
        if(aHash.get("wireless_mode") != "4") {
            aHash.set("channel_width", 0);
            aHash.set("guard_interval", 0);
        }

        jObject = { "group_idx" : grpTab.id, "group_cfg" : [bgHash, aHash]};
        new ajaxRequest().sendRequest("set_wireless",
                                       Object.toJSON(jObject),
                                       this.handleApplyConfig);
        
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Applied Successfully");
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getRadioBounds();
    }.bind(this);

    this.getRadioBounds = function() {
        new ajaxRequest().sendRequest("get_radio_bounds",
                                      null,
                                      this.handleGetRadioBounds);
    }.bind(this);

    this.handleGetRadioBounds = function(value) {
        this.radioBounds = value;
        this.getConfig();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_wireless_groups",
                                      null,
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        value = value.groups;

        var groupTabbedPan = new NG_UI_tabbedPan("groups");

        for(var i = 0; i < value.length; i++) {
            isAnyBgAp = true;

            radioTabbedPan =  new NG_UI_tabbedPan(value[i].group_idx);

            tBg = this.V_RadioTab(value[i].group_cfg[0]);
            if(value[i].group_cfg[0].turn_radio_on == "0") {
                var e = tBg.findFirstElement();
                tBg.disable();   
                e.enable();
            }
            if(value[i].group_cfg[0].ap_channels.length == 0 ||
                this.basicWirelessConfig.centralized_rf_mgmt == "1") {
                tBg.disable();                
            }

            tA = this.V_RadioTab(value[i].group_cfg[1]);
            if(value[i].group_cfg[1].turn_radio_on == "0") {
                var e = tA.findFirstElement();
                tA.disable();   
                e.enable();
            }
            if(value[i].group_cfg[1].ap_channels.length == 0 ||
                this.basicWirelessConfig.centralized_rf_mgmt == "1") {
                tA.disable();               
            }


            radioTabbedPan.addTab(value[i].group_cfg[0].type,
                                  value[i].group_cfg[0].type,
                                  tBg);
            radioTabbedPan.addTab(value[i].group_cfg[1].type,
                                  value[i].group_cfg[1].type,
                                  tA);

            groupTabbedPan.addTab(value[i].group_idx,
                                  valueTolabel(this.groupList, value[i].group_idx),
                                  radioTabbedPan);
            if(this.basicWirelessConfig.centralized_rf_mgmt == "1") {
                groupTabbedPan.title =
                "Advanced wireless settings are not allowed when RF Management is enabled";
                $('errorBlock').reset();
                $('errorBlock').set("Note: To configure advanced wireless parameters of the APs, you should disable Centralized RF Management <br>from Basic page. For more details see Help on this page.");
            }
        }

        contentPage.remove("WirelessSettings");
        contentPage.add(groupTabbedPan,
                        "WirelessSettings",
                        "Advanced Wireless Settings", "help/help_advanced_wireless.html");
    }.bind(this);

    this.V_RadioTab = function(config) {

            var tbl = new Element("TABLE", { "class" : "tableStyle" });
            var tbody = new Element("TBODY"); tbl.insert(tbody);

            apChannelTblObj = this.V_ApChannelTable(config);

            var row = new Element("TR"); tbody.insert(row); 
            var cell = new Element("TD"); row.insert(cell);
            cell.update(this.V_AdvancedWireless(config,
                                                apChannelTblObj.apChnlComboArray,
                                                apChannelTblObj.apModeArray));

            var row = new Element("TR"); tbody.insert(row); 
            var cell = new Element("TD"); row.insert(cell);
            cell.update("&nbsp;");

            var row = new Element("TR"); tbody.insert(row); 
            var cell = new Element("TD"); row.insert(cell);
            cell.update(apChannelTblObj.tbl);

            var form = Element.wrap(tbl, "form", {"id" : config.type});
            formChangeAction(form, function(){
                buttonPanel.get("cancel").enable(true);
            });
            return form;
    }

    this.V_ApChannelTable = function(config) {
        apChannelTbl = new NG_GridConfTable("ap_channels",
                                            ["Access Point Channel",
                                             "Access Point Wireless Mode"]);
        var chnls = config.ap_channels;
        apChnlComboArray = new Array();
        apModeArray = new Array();
        for(var i = 0; i < chnls.length; i++) {
            modeAndChnlArray = this.getFinalModeAndChannelArray(config.wireless_mode,
                                                         config.channel_width,
                                                         chnls[i].ip);
            chnlCombo = new NG_Combo(chnls[i].ip, modeAndChnlArray.chnlArray, chnls[i].channel);
            chnlCombo.style.width = "100px";

            modeTextBox = new NG_TextBox("",
                                         valueTolabel(this.modeArray, modeAndChnlArray.mode));
            modeTextBox.style.width = "70px";
            modeTextBox.disable();

            apChannelTbl.addRow(chnls[i].ip, [chnlCombo, modeTextBox]);
            apChnlComboArray[apChnlComboArray.length] = chnlCombo;
            apModeArray[apModeArray.length] = modeTextBox;
        }

        return {"tbl"              : apChannelTbl,
                "apChnlComboArray" : apChnlComboArray,
                "apModeArray"      : apModeArray};
    }

    this.V_AdvancedWireless = function(config, apChnlComboArray, apModeArray) {
        tbl = new NG_ConfTable();
        modeArray = (config.type == "802.11b/bg/ng" ? this.bgModeArray : this.aModeArray);

        wModeCombo = new NG_Combo("wireless_mode", modeArray, config.wireless_mode);
        config.wireless_mode = getComboSelectedValue(wModeCombo);

        dRateCombo = new NG_Combo("data_rate",
                                 this.getDataRateArray(config.wireless_mode,
                                                       config.channel_width,
                                                       config.guard_interval),
                                 config.data_rate);
        chWidthCombo = new NG_Combo("channel_width",
                                    this.chnlWidthAry,
                                    config.channel_width);
        gIntervalCombo = new NG_Combo("guard_interval",
                                      this.guardIntervalAry,
                                      config.guard_interval);

        config.channel_width = getComboSelectedValue(chWidthCombo);
        config.guard_interval = getComboSelectedValue(gIntervalCombo);

        
        Event.observe(wModeCombo, "change", this.wModeComboChange);
        Event.observe(chWidthCombo, "change", this.chWidthComboChange);
        Event.observe(gIntervalCombo, "change", this.gIntervalComboChange);

        wModeCombo.data.set("gIntervalCombo",   gIntervalCombo);
        wModeCombo.data.set("chWidthCombo",     chWidthCombo);
        wModeCombo.data.set("dRateCombo",       dRateCombo);
        wModeCombo.data.set("apChnlComboArray", apChnlComboArray);
        wModeCombo.data.set("apModeArray",      apModeArray);

        chWidthCombo.data.set("gIntervalCombo", gIntervalCombo);
        chWidthCombo.data.set("wModeCombo",     wModeCombo);
        chWidthCombo.data.set("dRateCombo",     dRateCombo);

        gIntervalCombo.data.set("chWidthCombo", chWidthCombo);
        gIntervalCombo.data.set("wModeCombo",   wModeCombo);
        gIntervalCombo.data.set("dRateCombo",   dRateCombo);

        turnOnRadioCheckBox = new NG_CheckBox("turn_radio_on", config.turn_radio_on);
        Event.observe(turnOnRadioCheckBox, "click", function(event) {
            e = Event.element(event);
            if(e.checked) {
                e.up("form").enable();
            } else {
                e.up("form").disable();
                e.enable();
            }
        });

        tbl.addRow(["Turn Radio On"], [turnOnRadioCheckBox]);
        tbl.addRow(["Wireless Mode"], [wModeCombo]);
        tbl.addRow(["Data Rate"], [dRateCombo]);
        chWidthRow = tbl.addRow(["Channel Width"], [chWidthCombo]);
        gIntervalRow = tbl.addRow(["Guard Interval"], [gIntervalCombo]);

        tPowerCombo = new NG_Combo("transmit_power", this.tPowerAry, config.transmit_power);
        tbl.addRow(["Output Power"], [tPowerCombo]);


        tbl.addRow(["RTS Threshold (0-2347)"],
                   [new NG_TextBox("rts_threshold",
                                   config.rts_threshold,
                                   { "class" : "required validate-digits",
                                     "title" : "Please enter a valid RTS Threshold"})]);
        tbl.addRow(["Fragmentation Length (256-2346)"],
                   [new NG_TextBox("fragmentation_threshold",
                                   config.fragmentation_threshold,
                                   { "class" : "required validate-digits",
                                     "title" : "Please enter a valid Fragmentation Length"})]);
        tbl.addRow(["Beacon Interval (100-1000)"],
                   [new NG_TextBox("beacon_interval",
                                   config.beacon_interval,
                                   { "class" : "required validate-digits",
                                     "title" : "Please enter a valid Beacon Interval"})]);

        agrLengthTextBox = new NG_TextBox("aggregation_length",
                                          config.aggregation_length,
                                          { "class" : "required validate-digits",
                                            "title" : "Please enter a valid Aggregation Length"});
        ampduEnableDisableRadio = new NG_EnableDisableRadio("AMPDU", config.AMPDU);
        rifsEnableDisableRadio = new NG_EnableDisableRadio("RIFS_transmission", config.RIFS_transmission);

        agrRow = tbl.addRow(["Aggregation Length (1024-65535)"], [agrLengthTextBox]);
        ampduRow = tbl.addRow(["AMPDU"], ampduEnableDisableRadio);
        rifsRow = tbl.addRow(["RIFS Transmission"], rifsEnableDisableRadio);

        tbl.addRow(["DTIM Interval (1-255)"],
                   [new NG_TextBox("dtim_interval",
                                   config.dtim_interval,
                                   { "class" : "required validate-digits",
                                     "title" : "Please enter a valid DTIM Interval"})]);
        tbl.addRow(["Preamble Type"],
                   new NG_AutoLongRadio("preamble_type", config.preamble_type));


        if((config.wireless_mode != "2") && (config.wireless_mode != "4")) {
            gIntervalRow.hide();
            chWidthRow.hide();
            agrRow.hide();
            ampduRow.hide();
            rifsRow.hide();
        }

        wModeCombo.data.set("gIntervalRow",    gIntervalRow);
        wModeCombo.data.set("chWidthRow", chWidthRow);
        wModeCombo.data.set("agrRow",          agrRow);
        wModeCombo.data.set("ampduRow",        ampduRow);
        wModeCombo.data.set("rifsRow",         rifsRow);
        return tbl;
    }.bind(this);

    this.getDataRateArray = function(wMode, chWidth, gInterval) {
        if(wMode != "2" && wMode != "4") {
            chWidth = gInterval = 0;
        }

        for(var i = 0; i < this.radioBounds.rates.length; i++) {
            if((wMode == this.radioBounds.rates[i].wireless_mode) &&
               (chWidth == this.radioBounds.rates[i].channel_width) &&
               (gInterval == this.radioBounds.rates[i].guard_interval)) {
                return this.radioBounds.rates[i].list;
            }
        }
        return null;
    }.bind(this);

    this.getFinalModeAndChannelArray = function(wMode, chWidth, ip) {
        var chnlArray = this.getChannelArray(wMode, chWidth, ip);
        if(chnlArray.length == 0 || (chnlArray.length == 1 && chnlArray[0].label == "Auto")) {
            switch(wMode) {
                case "0" :
                case "3" :
                    return { mode : wMode, chnlArray : chnlArray};
                break;

                case "2" :  // ng => bg
                    wMode = "1";
                break;
                case "1" :  // bg => b
                    wMode = "0";
                break;
                case "4" :  // na => a
                    wMode = "3";
                break;
            }

            return this.getFinalModeAndChannelArray(wMode, chWidth, ip);
        } else {

            return { mode : wMode, chnlArray : chnlArray};
        }
    }

    this.getChannelArray = function(wMode, chWidth, ip) {
        if(wMode != "2" && wMode != "4") {
            chWidth = 0;
        }

        chnls = this.radioBounds.channels; 
        for(var i = 0; i < chnls.length; i++) {
            if((wMode == chnls[i].wireless_mode) && (chWidth == chnls[i].channel_width) &&
               (ip == chnls[i].ip)) {
                return this.radioBounds.channels[i].list;
            }
        }

        return [{"label" : "Auto", "value" : "0"}];
    }

    this.wModeComboChange = function(event) {
        var wModeCombo = Event.element(event);

        chWidthCombo     = wModeCombo.data.get("chWidthCombo");
        gIntervalCombo   = wModeCombo.data.get("gIntervalCombo");
        dRateCombo       = wModeCombo.data.get("dRateCombo");
        apChnlComboArray = wModeCombo.data.get("apChnlComboArray");
        apModeArray      = wModeCombo.data.get("apModeArray");

        gInterval = getComboSelectedValue(gIntervalCombo);
        chWidth   = getComboSelectedValue(chWidthCombo);
        wMode     = getComboSelectedValue(wModeCombo);

        dRateCombo.update(this.getDataRateArray(wMode, chWidth, gInterval), getComboSelectedValue(dRateCombo));

        for(var i = 0; i < apChnlComboArray.length; i++) {
            var modeAndChnlArray = this.getFinalModeAndChannelArray(wMode,
                                                            chWidth,
                                                            apChnlComboArray[i].id);
            apChnlComboArray[i].update(modeAndChnlArray.chnlArray,
                                       getComboSelectedValue(apChnlComboArray[i]));
            apModeArray[i].value = valueTolabel(this.modeArray, modeAndChnlArray.mode)

        }

        var gIntervalRow  = wModeCombo.data.get("gIntervalRow");
        var chWidthRow  = wModeCombo.data.get("chWidthRow");
        var agrRow  = wModeCombo.data.get("agrRow");
        var ampduRow  = wModeCombo.data.get("ampduRow");
        var rifsRow  = wModeCombo.data.get("rifsRow");
        if(wMode == "2" || wMode == "4") {
            gIntervalRow.show();
            chWidthRow.show();
            agrRow.show();
            ampduRow.show();
            rifsRow.show();
        } else {
            gIntervalRow.hide();
            chWidthRow.hide();
            agrRow.hide();
            ampduRow.hide();
            rifsRow.hide();
        }
    }.bind(this);

    this.chWidthComboChange = function(event) {
        chWidthCombo   = Event.element(event);

        gIntervalCombo = chWidthCombo.data.get("gIntervalCombo");
        wModeCombo     = chWidthCombo.data.get("wModeCombo");
        dRateCombo     = chWidthCombo.data.get("dRateCombo");

        chWidth   = getComboSelectedValue(chWidthCombo);
        gInterval = getComboSelectedValue(gIntervalCombo);
        wMode     = getComboSelectedValue(wModeCombo);

        dRateCombo.update(this.getDataRateArray(wMode, chWidth, gInterval), getComboSelectedValue(dRateCombo));
    }.bind(this);

    this.gIntervalComboChange = function(event) {
        gIntervalCombo = Event.element(event);

        chWidthCombo   = gIntervalCombo.data.get("chWidthCombo");
        wModeCombo     = gIntervalCombo.data.get("wModeCombo");
        dRateCombo     = gIntervalCombo.data.get("dRateCombo");

        gInterval = getComboSelectedValue(gIntervalCombo);
        chWidth   = getComboSelectedValue(chWidthCombo);
        wMode     = getComboSelectedValue(wModeCombo);

        dRateCombo.update(this.getDataRateArray(wMode, chWidth, gInterval), getComboSelectedValue(dRateCombo));
    }.bind(this);
}

LoadBalancing = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Load Balancing", { "width" : "426px" });

        $("contents").update(contentPage);

        this.getLoadBalance();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getLoadBalance = function() {
        new ajaxRequest().sendRequest("get_load_cfg",
                                      Object.toJSON({"group_idx" : "0"}),
                                      this.handleGetLoadBalance);
    }
    this.handleGetLoadBalance = function(value) {
        form = Element.wrap(this.V_LoadBalance(value), "form", {"id" : "formLoadBalance"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form, "LoadBalance", "Load Balancing", "help/help_basic_load_balancing.html");
        form.focusFirstElement();
    }.bind(this);

    this.V_ApplyToAll = function() {
        applyToAllTbl = new NG_ConfTable();

        applyToAllTbl.addRow(["Apply QoS settings to all groups"],
                             [new NG_CheckBox("master")]);
        return applyToAllTbl;
    };

    this.V_LoadBalance = function(config) {
        loadBalanceTbl = new NG_ConfTable();

        loadBalanceTbl.addRow(["Apply to all groups"],
                             [new NG_CheckBox("master")]);

        enableDisableCheckBox = new NG_CheckBox("state", config.state);
        loadBalanceTbl.addRow(["Enable Load Balancing"],
                              [enableDisableCheckBox],
                              new NG_HiddenBox("group_idx", "0"));
        maxClientPerAp = new NG_RangeCombo("max_client_per_ap", 2, 128, config.max_client_per_ap);
        maxClientPerAp.options[maxClientPerAp.options.length - 1].update("MAX");
        loadBalanceTbl.addRow(["Max clients per Access Point"],
                               [maxClientPerAp]);

        maxClientPerRadio = new NG_RangeCombo("max_client_per_radio", 2, 64, config.max_client_per_radio);
        maxClientPerRadio.options[maxClientPerRadio.options.length - 1].update("MAX");
        loadBalanceTbl.addRow(["Max clients per Radio"],
                              [maxClientPerRadio]);

        enableDisableCheckBox.maxClientPerAp = maxClientPerAp;
        enableDisableCheckBox.maxClientPerRadio = maxClientPerRadio;

        Event.observe(enableDisableCheckBox, "click", function(event) {
            e = Event.element(event);
            enableDisableCheckBox.maxClientPerAp.disabled = !e.checked;
            enableDisableCheckBox.maxClientPerRadio.disabled = !e.checked;
        });
        enableDisableCheckBox.maxClientPerAp.disabled = !enableDisableCheckBox.checked;
        enableDisableCheckBox.maxClientPerRadio.disabled = !enableDisableCheckBox.checked;
        return loadBalanceTbl;
    };

    this.applyConfig = function() {
        jHash = $H(contentPage.get("LoadBalance").serialize(true));
        new ajaxRequest().sendRequest("set_load_cfg",
                                      jHash.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Load balancing settings saved successfully");
    }.bind(this);
}

AdvancedLoadBalancing = function() {
    this.groupList = null;

    this.openPage = function(){
        contentPage = new NG_UI_page("Load Balancing");
        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getConfig();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_load_cfg_groups",
                                      null,
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        value = value.groups;
        var groupTabbepPan = new NG_UI_tabbedPan("groups");
        for(var i = 0; i < value.length; i++) {
            var capb = value[i].group_capability;
            var form = Element.wrap(this.V_LoadBalance(value[i]),
                                    "form",
                                    {"id" : value[i].group_idx});
            formChangeAction(form, function(){
                buttonPanel.get("cancel").enable(true);
            });
            if(value[i].group_capability.basic == "0") {
                form.disable();
            }
            
            groupTabbepPan.addTab(value[i].group_idx,
                                  valueTolabel(this.groupList,
                                               value[i].group_idx),
                                  form);
        }

        contentPage.remove("LoadBalancing");
        contentPage.add(groupTabbepPan,
                        "LoadBalancing",
                        "Load Balancing", "help/help_advanced_load_balancing.html");
    }.bind(this);

    this.V_LoadBalance = function(config) {
        loadBalanceTbl = new NG_ConfTable();

        var enableDisableCheckBox = new NG_CheckBox("state", config.state);
        loadBalanceTbl.addRow(["Enable Load Balancing"],
                              [enableDisableCheckBox],
                              new NG_HiddenBox("group_idx", "0"));
        maxClientPerAp = new NG_RangeCombo("max_client_per_ap", 2, 128, config.max_client_per_ap);
        maxClientPerAp.options[maxClientPerAp.options.length - 1].update("MAX");
        loadBalanceTbl.addRow(["Max clients per Access Point"],
                               [maxClientPerAp]);

        maxClientPerRadio = new NG_RangeCombo("max_client_per_radio", 2, 64, config.max_client_per_radio);
        maxClientPerRadio.options[maxClientPerRadio.options.length - 1].update("MAX");
        loadBalanceTbl.addRow(["Max clients per Radio"],
                              [maxClientPerRadio]);

        enableDisableCheckBox.maxClientPerAp = maxClientPerAp;
        enableDisableCheckBox.maxClientPerRadio = maxClientPerRadio;

        Event.observe(enableDisableCheckBox, "click", function(event) {
            e = Event.element(event);
            enableDisableCheckBox.maxClientPerAp.disabled = !e.checked;
            enableDisableCheckBox.maxClientPerRadio.disabled = !e.checked;
        });
        enableDisableCheckBox.maxClientPerAp.disabled = !enableDisableCheckBox.checked;
        enableDisableCheckBox.maxClientPerRadio.disabled = !enableDisableCheckBox.checked;
        return loadBalanceTbl;
    };

    this.applyConfig = function() {
        var groupTabbedPan = contentPage.get("LoadBalancing");
        var form = groupTabbedPan.getSelectedTab();
        h = $H(form.serialize(true));
        h.set("group_idx", form.id)
        new ajaxRequest().sendRequest("set_load_cfg",
                                      h.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Load balancing settings saved successfully");
    }.bind(this);
}

EditAP = function(apInfo, onClose) {
    this.apInfo = apInfo;
    this.onClose = onClose;
    this.groupList = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Edit Access Point Info",{ "width" : "426px" });
        $("contents").update(contentPage);

        this.getGroupList();

        buttonPanel.reset();

        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        backBtn = new NG_UI_button("btn_back", "back", "off", this.backAction);
        buttonPanel.add("back", backBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }
    this.handleGetGroupList = function(value) {
        this.groupList = value;

        formApLoginInfo = Element.wrap(this.V_APLoginInfo(), "form", {"id" : "formApLoginInfo"});
        contentPage.add(formApLoginInfo, "APLoginInfo", "Access Point Info", "help/help_managed_ap_edit.html");

        formApInfo = Element.wrap(this.V_APInfo(), "form", {"id" : "formApInfo"});
        contentPage.add(formApInfo, "APInfo", "IP Settings", "help/help_managed_ap_edit.html");

        formApVlan = Element.wrap(this.V_APVlan(), "form", {"id" : "formApVlan"});
        contentPage.add(formApVlan, "APVlan", "Vlan Settings", "help/help_managed_ap_edit.html");

        formChangeAction(formApLoginInfo, function(){
            buttonPanel.get("cancel").enable(true);
        });
        formChangeAction(formApInfo, function(){
            buttonPanel.get("cancel").enable(true);
        });
        formChangeAction(formApVlan, function(){
            buttonPanel.get("cancel").enable(true);
        });
    }.bind(this);

    this.V_APInfo = function() {
        apInfoTbl = new NG_ConfTable();

        apInfoTbl.addRow(["DHCP Client"],
                          new NG_EnableDisableRadio("dhcpc", this.apInfo.dhcpc));
        apInfoTbl.addRow(["IP Address"],
                         [new NG_TextBox("ip",
                                         this.apInfo.ip,
                                         { "class" : "required validate-ip",
                                            "title" : "Please enter a valid IP Address"} ),
                          new NG_HiddenBox("old_ip", this.apInfo.ip)]);
        apInfoTbl.addRow(["Subnet Mask"],
                         [new NG_TextBox("ip_subnet_mask",
                                         this.apInfo.ip_subnet_mask,
                                         { "class" : "required validate-ip",
                                           "title" : "Please enter a valid Subnet Mask"})]);
        apInfoTbl.addRow(["Default Gateway"],
                         [new NG_TextBox("default_gateway",
                                         this.apInfo.default_gateway,
                                         { "class" : "validate-ip",
                                           "title" : "Please enter a valid Default Gateway"})]);
        return apInfoTbl;
    };

    this.V_APVlan = function(config) {

        vlanTbl = new NG_ConfTable();

        enableVlanCheckBox = new NG_CheckBox("vlan_enable", this.apInfo.vlan_enable);
        Event.observe(enableVlanCheckBox, "click", function(event) {
            e = Event.element(event);
            this.untaggedVlanTextBox.disabled = !e.checked;
        }.bind(this));

        untaggedVlanValue = this.apInfo.untagged_vlan;
        mgmtVlanValue = this.apInfo.management_vlan;
        
        if(this.apInfo.vlan_capability == "0")
        {
           this.untaggedVlanTextBox = new NG_TextBox("untagged_vlan",
                                                "",  
                                                { "class" : "required validate-digits",
                                                  "title" : "Please enter a valid Untagged VLAN number"});
            this.mgmtVlanTextBox = new NG_TextBox("management_vlan",
                                           "", 
                                           { "class" : "required validate-digits",
                                             "title" : "Please enter a valid Management VLAN number"}); 
           //disabling all vlan settings interactable components
           enableVlanCheckBox.disabled = true;
           this.untaggedVlanTextBox.disabled = true;
           this.mgmtVlanTextBox.disabled = true;
        }
        else
        {
        
            this.untaggedVlanTextBox = new NG_TextBox("untagged_vlan",
                                                    this.apInfo.untagged_vlan,
                                                    { "class" : "required validate-digits",
                                                      "title" : "Please enter a valid Untagged VLAN number"});
            this.mgmtVlanTextBox = new NG_TextBox("management_vlan",
                                           this.apInfo.management_vlan,
                                           { "class" : "required validate-digits",
                                             "title" : "Please enter a valid Management VLAN number"});                   
        }                       
        vlanTbl.addRow([enableVlanCheckBox,
                        "&nbsp;&nbsp;Untagged VLAN"],
                       [this.untaggedVlanTextBox]);
        vlanTbl.addRow(["Management VLAN"],
                       [this.mgmtVlanTextBox]);
        return vlanTbl;
    };

    this.V_APLoginInfo = function() {
        apLoginInfoTbl = new NG_ConfTable();

        apLoginInfoTbl.addRow(["Name"],
                              [new NG_TextBox("name", this.apInfo.name,
                                              {"maxlength" : "31" })]);
        apLoginInfoTbl.addRow(["Model"],
                              [new NG_TextBox("model", this.apInfo.model, { "disabled" : "true" })]);
        apLoginInfoTbl.addRow(["User Name"],
                              [new NG_TextBox("user_name", this.apInfo.user_name, { "disabled" : "true" })]);
        apLoginInfoTbl.addRow(["Password"],
                              [new NG_PasswordBox("password",
                               this.apInfo.password,
                               { "maxlength" : "31" })]);
        apLoginInfoTbl.addRow(["Group"],
                              [new NG_Combo("group_idx", this.groupList, this.apInfo.group_idx)]);
        return apLoginInfoTbl;
    };

    this.validate = function() {
        formApInfo = contentPage.get("APInfo");
        this.validationApInfo = new Validation(formApInfo, {onSubmit:false,
                                                useTitles : true});
        this.validationApInfo.reset();

        formApVlan = contentPage.get("APVlan");
        this.validationApVlan = new Validation(formApVlan, {onSubmit:false,
                                                useTitles : true});
        this.validationApVlan.reset();
        return this.validationApInfo.validate() &&
               this.validationApVlan.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;
        this.entryRemoved = false;

        formAPInfo = contentPage.get("APInfo");
        formLoginInfo = contentPage.get("APLoginInfo");
        formVlan = contentPage.get("APVlan");
        if(this.apInfo.dhcpc == "0" && formAPInfo["dhcpc"][0].checked) {
            this.entryRemoved = confirm("Enabling DHCP Client in Access Point will result in changing its IP Address.\nYou will need to discover it again to add it back to the Managed Access Points List");
            if (!this.entryRemoved) return;
        }
        jHash = $H(formAPInfo.serialize(true))
			.merge($H(formLoginInfo.serialize(true)))
			.merge($H(formVlan.serialize(true)));
        //before sending, send 1 as vlan value for vlan not capable APs to avoid error info.
        if(this.apInfo.vlan_capability == "0")
            jHash.update({management_vlan: "1", untagged_vlan: "1"});
        new ajaxRequest().sendRequest("edit_ap",
                                      jHash.toJSON(),
                                     this.handleApplyConfig);
    }.bind(this);
    
    this.handleApplyConfig = function(value) {
        formAPInfo = contentPage.get("APInfo");
        jHash = $H(formAPInfo.serialize(true));
        new NG_ProgressMonitor("get_edit_ap_progress",
                               jHash.toJSON(),
                               this.handleAddApProgress,
                               {type : "#"});
        buttonPanel.get("cancel").enable(false);
    }.bind(this);
    this.handleAddApProgress = function(value) {
        buttonPanel.get("cancel").enable(false);
        if (this.entryRemoved) {
            this.backAction();
        }
        else {
            formAPInfo = contentPage.get("APInfo");
            formApInfo["old_ip"].value = formApInfo["ip"].value;
        }
//        new ManagedApList().openPage();
    }.bind(this);
    this.backAction = function() {
        menuObject.updateMenu("second", 2);
    }.bind(this);
}

SecurityProfileList = function() {
    this.profilesTabbedPan;

    this.openPage = function(){
        contentPage = new NG_UI_page("Security Profiles List", { "width" : "426px" });
        $("contents").update(contentPage);
        this.getSecurityProfiles();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        editBtn = new NG_UI_button("btn_edit", "edit", "off", this.editSecurityProfile);
        buttonPanel.add("edit", editBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.enableSecurityProfiles);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            editBtn.inActivate();
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getSecurityProfiles = function() {
        new ajaxRequest().sendRequest("get_profile_list",
                                      Object.toJSON({"group_idx"  : "0"}),
                                      this.handleGetSecurityProfiles);
    }.bind(this);

    this.handleGetSecurityProfiles = function(value) {
        contentPage.remove("SecurityProfiles");
        var tblBg = this.makeProfileTable(value[0].type, value[0].list);
        var tblA = this.makeProfileTable(value[1].type, value[1].list);

        this.profilesTabbedPan =
            new NG_UI_tabbedPan("SecurityProfiles")
                .addTab("11g", value[0].type, tblBg)
                .addTab("11a", value[1].type, tblA);

        contentPage.add(this.profilesTabbedPan,
                        "SecurityProfiles",
                        "Basic Security Profiles", "help/help_basic_profile.html");
        buttonPanel.get("cancel").enable(false);

    }.bind(this);

    this.makeProfileTable = function(type, data) {
        data.each(function(e) { e["Security_Type"] = getAuthTypeLabelByValue(e["security"]);  });

        var multiSelectAction = function(chked, count) {
            buttonPanel.get("cancel").enable(true);
        }.bind(this);

        return new NG_TableOrderer(type,
                                {"data"                 : data,
                                 "singleSelectKeyField" : "name",
                                 "noColDataFields"      : "security",
                                 "multiSelectAction"    : multiSelectAction,
                                 "multiSelect"          : "enable"});
    }

    this.enableSecurityProfiles = function() {
        jObject = {"group_idx"  : "0",
                   type         : this.profilesTabbedPan.getSelectedTab().id,
                   list         : this.profilesTabbedPan.getSelectedTab().getSelectedData()};
        new ajaxRequest().sendRequest("enadis_profile",
                                      Object.toJSON(jObject),
                                      this.handleEnableSecurityProfiles);
    }.bind(this);

    this.handleEnableSecurityProfiles = function(value) {
        this.getSecurityProfiles();
    }.bind(this);

    this.editSecurityProfile = function() {
        jObject = {"group_idx"  : "0",
                   type         : this.profilesTabbedPan.getSelectedTab().id,
                   name         : this.profilesTabbedPan.getSelectedTab().getSingleSelectData().name,
                   "#"          : this.profilesTabbedPan.getSelectedTab().getSingleSelectData()["#"]};

                new ajaxRequest().sendRequest("get_profile",
                                              Object.toJSON(jObject),
                                              this.handleEditSecurityProfiles);
    }.bind(this);

    this.handleEditSecurityProfiles = function(value) {
        new EditSecurityProfile(value, "basic").openPage();
    }.bind(this);
}

AdvancedSecurityProfileList = function() {
    this.groupTabbedPan;
    this.groupList;
    this.selectedGroupIdx = 1;


    this.openPage = function(){
        contentPage = new NG_UI_page("Advanced Security Profiles List");
        $("contents").update(contentPage);

        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        editBtn = new NG_UI_button("btn_edit", "edit", "off", this.editSecurityProfile);
        buttonPanel.add("edit", editBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.enableSecurityProfiles);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            editBtn.inActivate();
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getSecurityProfiles();
    }.bind(this);

    this.getSecurityProfiles = function() {
        new ajaxRequest().sendRequest("get_group_profile_list",
                                      null,
                                      this.handleGetSecurityProfiles);
    }.bind(this);

    this.handleGetSecurityProfiles = function(value) {
        contentPage.remove("SecurityProfiles");
        this.groupTabbedPan = new NG_UI_tabbedPan("Groups");

        for(var i = 0; i < value.length; i++) {
            var profileList = value[i].group_cfg;
            var capb = value[i].group_capability;
            profilesTabbedPan = new NG_UI_tabbedPan(value[i].group_idx)
                .addTab(profileList[0].type,
                        profileList[0].type,
                        this.makeProfileTable(profileList[0].type,
                                              profileList[0].list,
                                              capb))
                .addTab(profileList[1].type,
                        profileList[1].type,
                        this.makeProfileTable(profileList[1].type,
                                              profileList[1].list,
                                              capb));
            this.groupTabbedPan.addTab(value[i].group_idx,
                                       valueTolabel(this.groupList,
                                                    value[i].group_idx),
                                       profilesTabbedPan);
        }

        contentPage.add(this.groupTabbedPan,
                        "SecurityProfiles",
                        "Advanced Security Profiles", "help/help_advanced_profile.html");
        this.groupTabbedPan.selectTabByIndex(this.selectedGroupIdx - 1);
        buttonPanel.get("cancel").enable(false);
    }.bind(this);

    this.makeProfileTable = function(type, data, capb) {
        disabled = (capb.basic == "0");
        data.each(function(e) { e["Security_Type"] = getAuthTypeLabelByValue(e["security"]);  });

        var multiSelectAction = function(chked, count) {
            buttonPanel.get("cancel").enable(true);
        }.bind(this);

        return new NG_TableOrderer(type,
                                {"data"                 : data,
                                 "singleSelectKeyField" : "name",
                                 "noColDataFields"      : "security",
                                 "multiSelectAction"    : multiSelectAction,
                                 "multiSelect"          : "enable"});
    }
    this.enableSecurityProfiles = function() {
        if(this.groupTabbedPan.getSelectedTab().getSelectedTab().options.disabled) {
            return;
        }
        this.selectedGroupIdx = this.groupTabbedPan.getSelectedTab().id;        
        jObject = {"group_idx"  : this.groupTabbedPan.getSelectedTab().id,
                   type         : this.groupTabbedPan.getSelectedTab().getSelectedTab().id,
                   list         : this.groupTabbedPan.getSelectedTab().getSelectedTab().getSelectedData()};
        new ajaxRequest().sendRequest("enadis_profile",
                                      Object.toJSON(jObject),
                                      this.handleEnableSecurityProfiles);
    }.bind(this);
    this.handleEnableSecurityProfiles = function(value) {
        this.getSecurityProfiles();
    }.bind(this);

    this.editSecurityProfile = function() {
        if(this.groupTabbedPan.getSelectedTab().getSelectedTab().options.disabled) {
            return;
        }

        jObject = {"group_idx"  : this.groupTabbedPan.getSelectedTab().id,
                   type         : this.groupTabbedPan.getSelectedTab().getSelectedTab().id,
                   name         : this.groupTabbedPan.getSelectedTab().getSelectedTab().getSingleSelectData().name,
                   "#"          : this.groupTabbedPan.getSelectedTab().getSelectedTab().getSingleSelectData()["#"]};
                new ajaxRequest().sendRequest("get_profile",
                                              Object.toJSON(jObject),
                                              this.handleEditSecurityProfiles);
    }.bind(this);
    this.handleEditSecurityProfiles = function(value) {
        new EditSecurityProfile(value, "advanced").openPage();
    }.bind(this);
}

EditSecurityProfile = function(securitySettings, caller) {
    this.securitySettings = securitySettings;
    this.dataEncViewArray = getDataEncViewArray();
    this.caller = caller;
    this.openPage = function() {
        contentPage = new NG_UI_page("Edit Security Profile", { "width" : "520px" });
        formProfileDef = Element.wrap(this.V_ProfileDef(), "form", {"id" : "formProfileDef"});
        contentPage.add(formProfileDef, "ProfileDef", "Profile Definition", "help/help_profile_edit.html");

        formAuthSettings = Element.wrap(this.V_AuthSettings(), "form", {"id" : "formAuthSettings"});
        contentPage.add(formAuthSettings, "AuthSettings", "Authentication Settings", "help/help_profile_edit.html");

        formChangeAction(formProfileDef, function(){
            buttonPanel.get("cancel").enable(true);
        });
        formChangeAction(formAuthSettings, function(){
            buttonPanel.get("cancel").enable(true);
        });

        $("contents").update(contentPage);

        formProfileDef.focusFirstElement();

        buttonPanel.reset();

        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        backBtn = new NG_UI_button("btn_back", "back", "off", this.backAction);
        buttonPanel.add("back", backBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage(this.securitySetting, this.caller);
    }.bind(this);

    this.backAction = function() {
        if(this.caller == "basic") {
            menuObject.updateMenu("third", 0);
        } else {
            menuObject.updateMenu("third", 1);
        }
    }.bind(this);

    this.V_ProfileDef = function() {
        profileDefTbl = new NG_ConfTable();

        profileDefTbl.addRow(["Name"],
                             [new Element("INPUT", { "type" : "hidden",
                                                     "name" : "group_idx",
                                                     "value" : this.securitySettings.group_idx }),
                              new Element("INPUT", { "type" : "hidden",
                                                     "name" : "type",
                                                     "value" : this.securitySettings.type }),
                              new Element("INPUT", { "type"      : "text",
                                                     "name"      : "name",
                                                     "maxlength" : "31",
                                                     "value"     : this.securitySettings.name }),
                              new Element("INPUT", { "type" : "hidden",
                                                     "name" : "#",
                                                     "value" : this.securitySettings["#"] })
                             ]);
        profileDefTbl.addRow(["Wireless Network Name (SSID)"],
                             [new Element("INPUT", { "type"      : "text",
                                                     "name"      : "ssid",
                                                     "maxlength" : "31",
                                                     "value"     : this.securitySettings.ssid })]);
        profileDefTbl.addRow(["Broadcast Wireless Network Name (SSID)"],
                              new NG_YesNoRadio("bcast_ssid", this.securitySettings.bcast_ssid));
        return profileDefTbl;
    };

    this.V_AuthSettings = function() {
        authSettingsTbl = new NG_ConfTable({"leftColWidth"   : "50%",
                                            "rightColWidth"   : "50%"});

        authTypeCombo = new NG_Combo("auth", NetworkAuthTypeList);
        Event.observe(authTypeCombo, "change", this.authTypeComboChange);

        authSettingsTbl.addRow(["Network Authentication"], [authTypeCombo]);

        authTypeCombo.selectedIndex = getAuthTypeIndex(this.securitySettings.auth);
        DataEncSetFunctionArray[authTypeCombo.selectedIndex](
            this.dataEncViewArray[authTypeCombo.selectedIndex],
            this.securitySettings);

        this.setAuthView(authTypeCombo);
        
        authSettingsTbl.addRow(["VLAN"],
                               [new NG_TextBox("vlan",
                                               this.securitySettings.vlan, 
                                               { "class" : "required validate-digits",
                                                 "title" : "Please enter a valid VLAN number"})]);

        return authSettingsTbl;
    };

    this.authTypeComboChange = function(e) {
        authCombo = Event.element(e);
        this.setAuthView(authCombo);
    }.bind(this);

    this.setAuthView = function(authCombo) {
        authCombo.parentNode.parentNode.nextSiblings().each(function(element, i) {
             if(i == 0) element.remove();
        });

        row = new Element("TR"); 
        authCombo.parentNode.parentNode.insert({after : row});

        row.update(new Element("TD", {"colspan" : "2"})
            .update(this.dataEncViewArray[authCombo.selectedIndex]));
    }

    this.validate = function() {
        form = contentPage.get("AuthSettings");
        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;
        
        formAuthSettings = contentPage.get("AuthSettings");
        formProfileDef = contentPage.get("ProfileDef");
       
        jHash = $H(formAuthSettings.serialize(true)).merge($H(formProfileDef.serialize(true)));

        new ajaxRequest().sendRequest("edit_profile",
                                      jHash.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        //alert("Security Profile settings saved successfully");
        buttonPanel.get("cancel").enable(false);
    }.bind(this);
}

RadiusServer = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Radius Server Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_ApplyToAll = function(config) {
        applyToAllTbl = new NG_ConfTable();

        applyToAllTbl.addRow(["Apply Radius settings to all groups"],
                             [new NG_CheckBox("master", config.master)]);
        return applyToAllTbl;
    };

    this.V_RadiusSettings = function(config) {
        radiusSettingsTbl = new NG_GridConfTable("radius_settings", ["IP Address", "Port", "Shared Secret"]);
        radiusSettingsTbl.addRow("Primary Authentication Server",
                                 [new NG_TextBox("pri_auth_ip",
                                                 config.pri_auth_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Primary Authentication Server-IP Address"}),
                                  new NG_TextBox("pri_auth_port",
                                                 config.pri_auth_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Primary Authentication Server-Port"}),
                                  new NG_PasswordBox("pri_auth_secret",
                                                     config.pri_auth_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Primary Authentication Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Secondary Authentication Server",
                                 [new NG_TextBox("sec_auth_ip",
                                                 config.sec_auth_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Secondary Authentication Server-IP Address"}),
                                  new NG_TextBox("sec_auth_port",
                                                 config.sec_auth_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Secondary Authentication Server-Port"}),
                                  new NG_PasswordBox("sec_auth_secret",
                                                     config.sec_auth_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Secondary Authentication Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Primary Accounting Server",
                                 [new NG_TextBox("pri_acct_ip",
                                                 config.pri_acct_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Primary Accounting Server-IP Address"}),
                                  new NG_TextBox("pri_acct_port",
                                                 config.pri_acct_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Primary Accounting Server-Port"}),
                                  new NG_PasswordBox("pri_acct_secret",
                                                     config.pri_acct_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Primary Accounting Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Secondary Accounting Server",
                                 [new NG_TextBox("sec_acct_ip",
                                                 config.sec_acct_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Secondary Accounting Server-IP Address"}),
                                  new NG_TextBox("sec_acct_port",
                                                 config.sec_acct_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Secondary Accounting Server-Port"}),
                                  new NG_PasswordBox("sec_acct_secret",
                                                     config.sec_acct_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Secondary Accounting Server-Shared Secret"})]);

        return radiusSettingsTbl;
    };

    this.V_AuthenticationSettings = function(config) {
        authSettingsTbl = new NG_ConfTable();

        authSettingsTbl.addRow(["Reauthentication Time (Seconds)"],
                               [new NG_TextBox("reauth_time",
                                               config.reauth_time,
                                                 { "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Reauthentication Time"})]);
        authSettingsTbl.addRow([new NG_CheckBox("rekey_enable", config.rekey_enable), "   Update Global Key Every (Seconds)"],
                               [new NG_TextBox("rekey_time",
                                               config.rekey_time,
                                               { "class" : "required validate-digits",
                                                 "title" : "Please enter a valid Global Key Update Time"})]);
        return authSettingsTbl;
    }

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_radius",
                                      Object.toJSON({ "group_idx" : "0" }),
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {

        form = Element.wrap(this.V_ApplyToAll(value),
                            "form",
                            {"id":"apply_to_all"});
        contentPage.remove("ApplyToAll");
        contentPage.add(form,
                        "ApplyToAll",
                        "Apply to all groups", "help/help_basic_radius.html");
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        form.focusFirstElement();

        form = Element.wrap(this.V_RadiusSettings(value),
                            "form",
                            {"id":"radius_server_settings"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.remove("RadiusServerSettings");
        contentPage.add(form,
                        "RadiusServerSettings",
                        "Radius Server Settings", "help/help_basic_radius.html");

        form = Element.wrap(this.V_AuthenticationSettings(value),
                            "form",
                            {"id" : "authentication_settings"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.remove("AuthenticationSettings");
        contentPage.add(form,
                        "AuthenticationSettings",
                        "Authentication Settings", "help/help_basic_radius.html");
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("RadiusServerSettings");
        validationRadiusServerSettings = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        validationRadiusServerSettings.reset();

        form = contentPage.get("AuthenticationSettings");
        validationAuthenticationSettings = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        validationAuthenticationSettings.reset();

        return (validationRadiusServerSettings.validate() && validationAuthenticationSettings.validate());
    }
    
    this.applyConfig = function() {
        if(!this.validate()) return;

        formApplyToAll = contentPage.get("ApplyToAll");
        formRadiusSettings = contentPage.get("RadiusServerSettings");
        formAuthSettings = contentPage.get("AuthenticationSettings");

        jHash = $H(formApplyToAll.serialize(true))
                    .merge($H(formRadiusSettings.serialize(true)))
                    .merge($H(formAuthSettings.serialize(true)));

        new ajaxRequest().sendRequest("set_radius",
                                      jHash.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Radius server settings saved successfully.");
    }.bind(this);

}

AdvancedRadiusServer = function() {
    this.groupList;
    this.openPage = function() {
        contentPage = new NG_UI_page("Radius Server Settings");

        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getRadiusList();
    }.bind(this);

    this.getRadiusList = function() {
        new ajaxRequest().sendRequest("get_radius_groups",
                                      null,
                                      this.handleGetRadiusList);
    }.bind(this);

    this.handleGetRadiusList = function(value) {
        contentPage.remove("Groups");

        tabbedPan = new NG_UI_tabbedPan("groups");
        value = value.groups;

        for(var i = 0; i < value.length; i++) {
            var tbl = new Element("TABLE");
            var tbody = new Element("TBODY"); tbl.insert(tbody);

            var row = new Element("TR"); tbody.insert(row); 
            var cell = new Element("TD"); row.insert(cell);
            cell.update(this.V_RadiusSettings(value[i]));

            var row = new Element("TR"); tbody.insert(row); 
            var cell = new Element("TD"); row.insert(cell);
            cell.update("&nbsp;");

            var row = new Element("TR"); tbody.insert(row);
            var cell = new Element("TD"); row.insert(cell);
            cell.insert(this.V_AuthenticationSettings(value[i]))
                .insert(new NG_HiddenBox("group_idx", value[i].group_idx));

            var form = Element.wrap(tbl, "form", {"id" : value[i].group_idx});
            formChangeAction(form, function(){
                buttonPanel.get("cancel").enable(true);
            });
            form.focusFirstElement();

            if(value[i].group_capability.basic == "0") {
                form.disable();
            }
            tabbedPan.addTab(value[i].group_idx, valueTolabel(this.groupList, value[i].group_idx), form);
        }

        contentPage.add(tabbedPan, "Groups", "Groups", "help/help_advanced_radius.html");
    }.bind(this);

    this.V_RadiusSettings = function(config) {
        radiusSettingsTbl = new NG_GridConfTable("radius_settings", ["IP Address", "Port", "Shared Secret"]);
        radiusSettingsTbl.addRow("Primary Authentication Server",
                                 [new NG_TextBox("pri_auth_ip",
                                                 config.pri_auth_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Primary Authentication Server-IP Address"}),
                                  new NG_TextBox("pri_auth_port",
                                                 config.pri_auth_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Primary Authentication Server-Port"}),
                                  new NG_PasswordBox("pri_auth_secret",
                                                     config.pri_auth_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Primary Authentication Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Secondary Authentication Server",
                                 [new NG_TextBox("sec_auth_ip",
                                                 config.sec_auth_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Secondary Authentication Server-IP Address"}),
                                  new NG_TextBox("sec_auth_port",
                                                 config.sec_auth_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Secondary Authentication Server-Port"}),
                                  new NG_PasswordBox("sec_auth_secret",
                                                     config.sec_auth_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Secondary Authentication Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Primary Accounting Server",
                                 [new NG_TextBox("pri_acct_ip",
                                                 config.pri_acct_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Primary Accounting Server-IP Address"}),
                                  new NG_TextBox("pri_acct_port",
                                                 config.pri_acct_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Primary Accounting Server-Port"}),
                                  new NG_PasswordBox("pri_acct_secret",
                                                     config.pri_acct_secret,
                                                     { "class"     : "required", 
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Primary Accounting Server-Shared Secret"})]);
        radiusSettingsTbl.addRow("Secondary Accounting Server",
                                 [new NG_TextBox("sec_acct_ip",
                                                 config.sec_acct_ip,
                                                 { "class" : "validate-ip",
                                                   "title" : "Please enter a valid Secondary Accounting Server-IP Address"}),
                                  new NG_TextBox("sec_acct_port",
                                                 config.sec_acct_port,
                                                 { "maxlength" : "5", "size" : "5",
                                                   "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Secondary Accounting Server-Port"}),
                                  new NG_PasswordBox("sec_acct_secret",
                                                     config.sec_acct_secret,
                                                     { "class"     : "required",
                                                       "maxlength" : "63", 
                                                       "title"     : "Please enter a Secondary Accounting Server-Shared Secret"})]);

        return radiusSettingsTbl;
    };

    this.V_AuthenticationSettings = function(config) {
        authSettingsTbl = new NG_ConfTable();

        authSettingsTbl.addRow(["Reauthentication Time (Seconds)"],
                               [new NG_TextBox("reauth_time",
                                               config.reauth_time,
                                                 { "class" : "required validate-digits",
                                                   "title" : "Please enter a valid Reauthentication Time"})]);
        authSettingsTbl.addRow([new NG_CheckBox("rekey_enable", config.rekey_enable), "   Update Global Key Every (Seconds)"],
                               [new NG_TextBox("rekey_time",
                                               config.rekey_time,
                                               { "class" : "required validate-digits",
                                                 "title" : "Global Key Update Time"})]);
        return authSettingsTbl;
    }

    this.validate = function() {
        form = contentPage.get("Groups").getSelectedTab();
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        jHash = $H(contentPage.get("Groups").getSelectedTab().serialize(true));
        new ajaxRequest().sendRequest("set_radius",
                                      jHash.toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Radius server settings saved successfully.");
    }.bind(this);
}

QosSettings = function() {
    this.validation = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("QoS Settings", { "width" : "426px" });
        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_ApplyToAll = function() {
        applyToAllTbl = new NG_ConfTable();

        applyToAllTbl.addRow(["Apply to all groups"],
                             [new NG_CheckBox("master")]);
        return applyToAllTbl;
    };

    this.V_QosSettings = function(config) {
        qosSettingsTbl = new NG_ConfTable();

        qosSettingsTbl.addRow(["Enable Wi-Fi Multimedia (WMM)", 
                                new NG_HiddenBox("type", config.type)],
                                new NG_EnableDisableRadio("wmm_enable", config.wmm_enable));
        qosSettingsTbl.addRow(["WMM Powersave"],
                               new NG_EnableDisableRadio("wmm_powersave", config.wmm_powersave));
        return qosSettingsTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_qos",
                                      Object.toJSON({ "group_idx" : 0 }),
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        formQos11G = Element.wrap(this.V_QosSettings(value.qos_cfg[0]),
                            "form",
                            {"id" : value.qos_cfg[0].type});
        formQos11A = Element.wrap(this.V_QosSettings(value.qos_cfg[1]),
                            "form",
                            {"id" : value.qos_cfg[1].type});
        formApplyToAll = Element.wrap(this.V_ApplyToAll(),
                            "form",
                            {"id" : value.qos_cfg[1].type});

        formChangeAction(formQos11G, function(){
            buttonPanel.get("cancel").enable(true);
        });

        formChangeAction(formQos11A, function(){
            buttonPanel.get("cancel").enable(true);
        });

        formChangeAction(formApplyToAll, function(){
            buttonPanel.get("cancel").enable(true);
        });

        qosSettingsPan = new NG_UI_tabbedPan("QosSettings")
                .addTab(value.qos_cfg[0].type, value.qos_cfg[0].type, formQos11G)
                .addTab(value.qos_cfg[1].type, value.qos_cfg[1].type, formQos11A);

        var tbl = new NG_Table();
        tbl.addCaptionRow(formApplyToAll);
        tbl.addCaptionRow("");
        tbl.addCaptionRow(qosSettingsPan);

        tbl.qosSettingsPan = qosSettingsPan;
        tbl.formApplyToAll = formApplyToAll;

        contentPage.add(tbl,
                        "QosSettings",
                        "QoS Settings", "help/help_basic_qos.html");
                        
        formApplyToAll.focusFirstElement();
    }.bind(this);

    this.applyConfig = function() {
        var ary = contentPage.get("QosSettings").qosSettingsPan.getAllTabs();
        var formApplyToAll = contentPage.get("QosSettings").formApplyToAll;
        var master = $H(formApplyToAll.serialize(true)).get("master");
        
        jObject = { "group_idx" : "0",
                "master"    : master,
                "qos_cfg"   : [$H(ary[0].serialize(true)), $H(ary[1].serialize(true))]};

        new ajaxRequest().sendRequest("set_qos",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("QoS settings saved successfully");
    }.bind(this);
}

AdvancedQosSettings = function() {
    this.groupList = null;

    this.openPage = function(){
        contentPage = new NG_UI_page("QoS Settings");
        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getConfig();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_qos_groups",
                                      null,
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        value = value.groups;
        var groupTabbepPan = new NG_UI_tabbedPan("groups");
        for(var i = 0; i < value.length; i++) {
            var capb = value[i].group_capability;
            var formQos11G = Element.wrap(this.V_QosSettings(value[i].group_cfg[0]),
                                          "form",
                                          {"id" : value[i].group_cfg[0].type});
            var formQos11A = Element.wrap(this.V_QosSettings(value[i].group_cfg[1]),
                                         "form",
                                         {"id" : value[i].group_cfg[1].type});
            if(value[i].group_cfg[0].radio_on == "0") formQos11G.disable();
            if(value[i].group_cfg[1].radio_on == "0") formQos11A.disable();

            if(value[i].group_capability.basic == "0") {
                formQos11G.disable();
                formQos11A.disable();
            }
            formChangeAction(formQos11G, function(){
                buttonPanel.get("cancel").enable(true);
            });
            formChangeAction(formQos11A, function(){
                buttonPanel.get("cancel").enable(true);
            });

            var qosSettingsPan = new NG_UI_tabbedPan(value[i].group_idx)
                    .addTab(value[i].group_cfg[0].type, value[i].group_cfg[0].type, formQos11G)
                    .addTab(value[i].group_cfg[1].type, value[i].group_cfg[1].type, formQos11A);

            groupTabbepPan.addTab(value[i].group_idx,
                                  valueTolabel(this.groupList,
                                               value[i].group_idx),
                                  qosSettingsPan);
        }

        contentPage.remove("QosSettings");
        contentPage.add(groupTabbepPan,
                        "QosSettings",
                        "QoS Settings", "help/help_advanced_qos.html");
    }.bind(this);

    this.V_QosSettings = function(config) {
            qosSettingsTbl = new NG_ConfTable();

            qosSettingsTbl.addRow(["Enable Wi-Fi Multimedia (WMM)", 
                                    new NG_HiddenBox("type", config.type)],
                                   new NG_EnableDisableRadio("wmm_enable", config.wmm_enable));
            qosSettingsTbl.addRow(["WMM Powersave"],
                                   new NG_EnableDisableRadio("wmm_powersave", config.wmm_powersave));
        return qosSettingsTbl;
    };

    this.applyConfig = function() {
        var groupTabbedPan = contentPage.get("QosSettings");
        var ary = groupTabbedPan.getSelectedTab().getAllTabs();
        jObject = { "group_idx"     : groupTabbedPan.getSelectedTab().id,
                    "qos_cfg"       : [$H(ary[0].serialize(true)), $H(ary[1].serialize(true))]};
        new ajaxRequest().sendRequest("set_qos",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("QoS settings saved successfully");
    }.bind(this);
}

MacAcl = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("MAC Authentication", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getMacAcl();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getMacAcl = function() {
        new ajaxRequest().sendRequest("get_mac_auth",
                                      null,
                                      this.handleGetMacAcl);
    }.bind(this);

    this.handleGetMacAcl = function(value) {
        contentPage.remove("MacAcl");

        value = value.mac_auth;
        macAclTabbedPan = new NG_UI_tabbedPan("MacAcl")
            .addTab(value[0].type,
                    value[0].type,
                    this.makeMacAclTable(value[0]))
            .addTab(value[1].type,
                    value[1].type,
                    this.makeMacAclTable(value[1]));

        formApplyToAll = Element.wrap(this.V_ApplyToAll(value), "form");
        formChangeAction(formApplyToAll, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add([{"comp" : formApplyToAll, "id" : "ApplyToAll"},
                         {"comp" : macAclTabbedPan, "id" : "MacAcl"}],
                        "MacAcl",
                        "MAC Authentication", "help/help_basic_mac_authentication.html");
    }.bind(this);

    this.V_ApplyToAll = function(config) {
        applyToAllTbl = new NG_ConfTable();

        applyToAllTbl.addRow(["Apply to all groups"],
                             [new NG_CheckBox("master", config.master)]);
        return applyToAllTbl;
    };

    this.makeMacAclTable = function(data) {
        accessCheckBox = new NG_CheckBox("enable", data.enable);
        locationCombo = new NG_Combo("location",
                                     [{"label" : "Local MAC Address Database",
                                       "value" : "0"},
                                     {"label"  : "Remote MAC Address Database",
                                      "value" : "1"}],
                                     data.location);
        hiddenType = new NG_HiddenBox("type", data.type);
        locationCombo.disabled = !accessCheckBox.checked;
        accessCheckBox.data.set("locationCombo", locationCombo);

        Event.observe(accessCheckBox, "click", function(event) {
            e = Event.element(event);
            var locationCombo = e.data.get("locationCombo");
            locationCombo.disabled = !e.checked;
        }.bind(this));

        confTbl = new NG_ConfTable();
        confTbl.addRow(["Turn Access Control On"], [accessCheckBox]);
        confTbl.addRow(["Location"], [locationCombo, hiddenType]);
        confForm = Element.wrap(confTbl, "form");
        formChangeAction(confForm, function(){
            buttonPanel.get("cancel").enable(true);
        });

        var multiSelectAction = function(){
            buttonPanel.get("cancel").enable(true);
        }

        var macAddAction = function(newRow, tblData) {
            $("errorBlock").reset();
            if(!Validation.get("validate-mac").test(newRow.mac_address)) {
                $("errorBlock").addError("Invalid MAC address");
                return false;
            }

            for(var i = 0; i < tblData.length; i++) {
                if(tblData[i].mac_address.toLowerCase() == newRow.mac_address.toLowerCase()) {
                    $("errorBlock").addError("Mac address already in the list");
                    return false;
                }
            }

            return true;
        }

        aclListTable =  new NG_MoveList(data.type,
                               { leftLabel   : "Trusted Wireless Stations",
                                 rightLabel  : "Available Wireless Stations",
                                 leftData    : data.trusted_stations,
                                 rightData   : data.available_stations,
                                 leftManualAdd :  true,
                                 onLeftAddAction : macAddAction,
                                 width       : "700px",
                                 multiSelectAction : multiSelectAction,
                                 columns     : ["mac_address"] });
        tbl = new Element("TABLE");
        tbody = new Element("TBODY"); tbl.update(tbody);
        tbl.confTbl = confTbl;

        tRow = new Element("TR").update(new Element("TD").update(confForm));
        tbody.insert(tRow);
        tbl.confForm = confForm;

        tRow = new Element("TR").update(new Element("TD").update("&nbsp;"));
        tbody.insert(tRow);

        tRow = new Element("TR").update(new Element("TD").update(aclListTable));
        tbody.insert(tRow);
        tbl.aclListTable = aclListTable;
        
        return tbl;
    }
    this.applyConfig = function() {
        formApplyToAll = contentPage.get("ApplyToAll");
        macAcl = contentPage.get("MacAcl");
        
        var typeTabs = macAcl.getAllTabs();
        var grpIdx = 0;
        bg = $H(typeTabs[0].confForm.serialize(true));
        bg.set("trusted_stations", typeTabs[0].aclListTable.getLeftData());
        a = $H(typeTabs[1].confForm.serialize(true));
        a.set("trusted_stations", typeTabs[1].aclListTable.getLeftData());
        master = $H(formApplyToAll.serialize(true)).get("master");

        jObject = {"group_idx" : 0,
                   "master"    : master,
                   "mac_auth"  : [bg, a]};
        new ajaxRequest().sendRequest("set_mac_auth",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function() {
        buttonPanel.get("cancel").enable(false);
        //alert("Trusted MAC authentication list saved successfully");
    }
}

AdvancedMacAcl = function() {
    this.groupTabbedPan;

    this.openPage = function(){
        contentPage = new NG_UI_page("MAC Authentication");
        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getMacAcl();
    }.bind(this);

    this.getMacAcl = function() {
        new ajaxRequest().sendRequest("get_mac_auth_groups",
                                      null,
                                      this.handleGetMacAcl);
    }.bind(this);

    this.handleGetMacAcl = function(value) {
        value = value.groups;
        contentPage.remove("MacAcl");
        this.groupTabbedPan = new NG_UI_tabbedPan("Groups");

        for(var i = 0; i < value.length; i++) {
            var macAclList = value[i].group_info;
            var capb = value[i].group_capability;
            macAclTabbedPan = new NG_UI_tabbedPan(value[i].group_idx)
                .addTab(macAclList[0].type,
                        macAclList[0].type,
                        this.makeMacAclTable(macAclList[0], capb))
                .addTab(macAclList[1].type,
                        macAclList[1].type,
                        this.makeMacAclTable(macAclList[1], capb));
            this.groupTabbedPan.addTab(value[i].group_idx,
                                       valueTolabel(this.groupList, value[i].group_idx),
                                       macAclTabbedPan);
        }

        contentPage.add(this.groupTabbedPan,
                        "MacAcl",
                        "MAC Authentication", "help/help_advanced_mac_authentication.html");
    }.bind(this);

    this.makeMacAclTable = function(data, capb) {
        disabled = (capb.basic == 0);
        accessCheckBox = new NG_CheckBox("enable", data.enable);
        locationCombo = new NG_Combo("location",
                                     [{"label" : "Local MAC Address Database",
                                       "value" : "0"},
                                     {"label"  : "Remote MAC Address Database",
                                      "value" : "1"}],
                                     data.location);
        hiddenType = new NG_HiddenBox("type", data.type);
        locationCombo.disabled = !accessCheckBox.checked;
        accessCheckBox.data.set("locationCombo", locationCombo);

        Event.observe(accessCheckBox, "click", function(event) {
            e = Event.element(event);
            var locationCombo = e.data.get("locationCombo");
            locationCombo.disabled = !e.checked;
        }.bind(this));

        confTbl = new NG_ConfTable();
        confTbl.addRow(["Turn Access Control On"], [accessCheckBox]);
        confTbl.addRow(["Location"], [locationCombo, hiddenType]);
        confForm = Element.wrap(confTbl, "form");
        formChangeAction(confForm, function(){
            buttonPanel.get("cancel").enable(true);
        });
        if(disabled) {
            confForm.disable();
        }

        var multiSelectAction = function(){
            buttonPanel.get("cancel").enable(true);
        }
        var macAddAction = function(newRow, tblData) {
            $("errorBlock").reset();
            if(!Validation.get("validate-mac").test(newRow.mac_address)) {
                $("errorBlock").addError("Invalid MAC address");
                return false;
            }

            for(var i = 0; i < tblData.length; i++) {
                if(tblData[i].mac_address.toLowerCase() == newRow.mac_address.toLowerCase()) {
                    $("errorBlock").addError("Mac address already in the list");
                    return false;
                }
            }

            return true;
        }

        aclListTable =  new NG_MoveList(data.type,
                               { leftLabel   : "Trusted Wireless Stations",
                                 rightLabel  : "Available Wireless Stations",
                                 leftData    : data.trusted_stations,
                                 rightData   : data.available_stations,
                                 leftManualAdd :  true,
                                 onLeftAddAction : macAddAction,
                                 width       : "700px",
                                 multiSelectAction : multiSelectAction,
                                 columns     : ["mac_address"] });

        tbl = new Element("TABLE");
        tbody = new Element("TBODY"); tbl.update(tbody);
        tbl.confTbl = confTbl;

        tRow = new Element("TR").update(new Element("TD").update(confForm));
        tbody.insert(tRow);
        tbl.confForm = confForm;

        tRow = new Element("TR").update(new Element("TD").update("&nbsp;"));
        tbody.insert(tRow);

        tRow = new Element("TR").update(new Element("TD").update(aclListTable));
        tbody.insert(tRow);
        tbl.aclListTable = aclListTable;
        
        return tbl;
    }
    this.applyConfig = function() {
        var groupTabbedPan = contentPage.get("MacAcl");
        var grpTab = groupTabbedPan.getSelectedTab();
        var typeTabs = grpTab.getAllTabs();
        var grpIdx = grpTab.id;
        bg = $H(typeTabs[0].confForm.serialize(true));
        bg.set("trusted_stations", typeTabs[0].aclListTable.getLeftData());
        a = $H(typeTabs[1].confForm.serialize(true));
        a.set("trusted_stations", typeTabs[1].aclListTable.getLeftData());

        jObject = {"group_idx" : grpIdx,
                   "master"    : "0",
                   "mac_auth"  : [bg, a]};
        new ajaxRequest().sendRequest("set_mac_auth",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function() {
        buttonPanel.get("cancel").enable(false);
        //alert("Trusted MAC authentication list saved successfully");
    }
}

RogueAP = function() {
    this.dummyFrame = new Element("IFRAME", 
                                  {"id"           : "upgrade_frame",
                                   "name"         : "upgrade_frame",
                                   "src"          : "blank.php",
                                   "height"       : "0px",
                                   "width"        : "0px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});

    this.openPage = function() {
        contentPage = new NG_UI_page("Rogue Access Point", { "width" : "426px" });
        $("contents").update(contentPage);
        $("contents").insert(this.dummyFrame);

        this.getRap();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        importBtn = new NG_UI_button("import_apply", "import", "off", this.uploadFile);
        buttonPanel.add("import", importBtn);

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getRap = function() {
        new ajaxRequest().sendRequest("get_rap",
                                      null,
                                      this.handleGetRap);
    }.bind(this);

    this.handleGetRap = function(value) {
        contentPage.remove("Rap");
        contentPage.remove("ApplyToAll");
        
        value = value.rogue_ap;
        rapTabbedPan = new NG_UI_tabbedPan("Rap")
            .addTab(value[0].type,
                    value[0].type,
                    this.makeRapTable(value[0]))
            .addTab(value[1].type,
                    value[1].type,
                    this.makeRapTable(value[1]));

        contentPage.add(rapTabbedPan,
                        "Rap",
                        "Rogue Access Point", "help/help_security_rogue_ap.html");
    }.bind(this);

    this.makeRapTable = function(data) {
        mergeCombo = new NG_Combo("merge",
                                     [{"label" : "Merge",
                                       "value" : "1"},
                                     {"label"  : "Replace",
                                      "value" : "0"}]);
        hiddenType = new NG_HiddenBox("type", data.type);
        selectFile = new NG_FileBox("upgrade_file");

        confTbl = new NG_ConfTable({"tblClass"   : "tableStyle BlockContent"});

        confTbl.addRow(["Import AP List from a file"], [mergeCombo]);
        confTbl.addRow([""],
                       [selectFile, hiddenType]);
        confForm = Element.wrap(confTbl, "form",
                                {"method"   : "post",
                                 "action"   : "file_upload.php",
                                 "target"   : this.dummyFrame.id,
                                 "encoding" : "multipart/form-data",
                                 "enctype"  : "multipart/form-data"});
        formChangeAction(confForm, function(){
            buttonPanel.get("cancel").enable(true);
        });

        var multiSelectAction = function(){
            buttonPanel.get("cancel").enable(true);
        };
        rapTable =  new NG_MoveList(data.type,
                               { leftLabel   : "Known AP List",
                                 rightLabel  : "Unknown AP List",
                                 leftData    : data.known_access_points,
                                 rightData   : data.unknown_access_points,
                                 width       : "700px",
                                 multiSelectAction : multiSelectAction,
                                 columns     : ["mac_address", "SSID", "Channel"] });

        tbl = new Element("TABLE", { "id" : data.type });
        tbody = new Element("TBODY"); tbl.update(tbody);
        tbl.confTbl = confTbl;

        tRow = new Element("TR").update(new Element("TD").update(confForm));
        tbody.insert(tRow);
        tbl.confForm = confForm;

        tRow = new Element("TR").update(new Element("TD").update(rapTable));
        tbody.insert(tRow);
        tbl.rapTable = rapTable;
        
        return tbl;
    }
    this.applyConfig = function() {
        rap = contentPage.get("Rap");
        
        var typeTabs = rap.getAllTabs();
        var grpIdx = 0;
        bg = $H(typeTabs[0].confForm.serialize(true));
        bg.set("known_access_points", typeTabs[0].rapTable.getLeftData());
        a = $H(typeTabs[1].confForm.serialize(true));
        a.set("known_access_points", typeTabs[1].rapTable.getLeftData());

        jObject = {"group_idx" : 0,
                   "rogue_ap"  : [bg, a]};

        new ajaxRequest().sendRequest("set_rap",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function() {
        buttonPanel.get("cancel").enable(false);
        //alert("Known Access Point List list saved successfully");
    }.bind(this);

    this.uploadFile = function() {
        iFrameLoad(this.dummyFrame, this.uploadFileComplete);
 
        var typeTab = contentPage.get("Rap").getSelectedTab();

        busyBar.show();
        form = typeTab.confForm.submit();
    }.bind(this);

    this.uploadFileComplete = function() {
        busyBar.hide();
        this.importKnown();
    }.bind(this);

    this.importKnown = function() {


        var typeTab = contentPage.get("Rap").getSelectedTab();
        var merge = $H(typeTab.confForm.serialize(true)).get("merge");

        jObject = {"group_idx" : "0",
                   "type"      : typeTab.id,
                   "merge"     : merge,
                   "location"  : "/tmp/wnc.bin"};
        new ajaxRequest().sendRequest("import_known",
                                      Object.toJSON(jObject),
                                      this.handleImportKnown);
    }.bind(this);
    this.handleImportKnown = function() {
        buttonPanel.get("cancel").enable(false);
        this.getRap()
    }.bind(this);
}

WncUserMgmt = function() {

    this.userTypeArray = [{ "label" : "Read Only",         "value" : "1"},
                          { "label" : "Administrative",    "value" : "2"}];

    this.openPage = function() {
        contentPage = new NG_UI_page("User Management", { "width" : "426px" });
        
        var form = Element.wrap(this.V_UserAdd(),
                                     "form",
                                     {"id":"tbl_wnc_user_add_form"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form,
                        "WncUserAdd",
                        "Add New User", "help/help_user_mgmt.html");
        this.getUserList();
        $("contents").update(contentPage);

        buttonPanel.reset();

        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        addBtn = new NG_UI_button("btn_add", "add", "off", this.applyConfig);
        buttonPanel.add("add", addBtn);

        removeBtn = new NG_UI_button("remove_apply", "remove", "off", this.deleteUser);
        buttonPanel.add("remove", removeBtn);
        if(userType != "admin") {
            addBtn.inActivate();
            removeBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_UserAdd = function() {

        userAddTbl = new NG_ConfTable();

        userAddTbl.addRow(["User Name"],
                               [new NG_TextBox("user_name",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'User Name' can not be blank",
                                                       "maxlength" : "31" })]);
        userAddTbl.addRow(["Password"],
                               [new NG_PasswordBox("password",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'Password' can not be blank",
                                                       "maxlength" : "31" })]);
        userAddTbl.addRow(["Retype Password"],
                               [new NG_PasswordBox("re_password",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'Retype New Password' can not be blank",
                                                       "maxlength" : "31" })]);
        userAddTbl.addRow(["User Access"],
                          [new NG_Combo("type",
                                        this.userTypeArray, 
                                        "0")]);

        return userAddTbl;
    };

    this.validate = function() {
        form = contentPage.get("WncUserAdd");

        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();

        if(!this.validation.validate()) {
            return false;
        }

        if(form["password"].value != form["re_password"].value) {
            $('errorBlock').addError("'New Password' and 'Retype New Password' should be same.");
            return false;
        }

        return true;
    }

    this.applyConfig = function() {

        if(!this.validate()) return;

        new ajaxRequest().sendRequest("add_user",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        this.getUserList();
        //alert("User added successfully");
    }.bind(this);

    this.getUserList = function() {
        new ajaxRequest().sendRequest("get_user_list",
                                      null,
                                      this.handleGetUserList);
    }.bind(this);

    this.handleGetUserList = function(value) {
        contentPage.remove("WncUserList");

        value.each(function(e) {
            e.user_type = valueTolabel(this.userTypeArray, e.type); 
            e.to_delete = false;
            e.disabledKeyCol = (e.user_name == "admin");
        }.bind(this));

        var multiSelectAction = function() {
            buttonPanel.get("cancel").enable(true);
        }.bind(this);

        this.userListTable = new NG_TableOrderer('ManagedAPs',
                                                   {"data"                 : value,
                                                    "columns"              : ["user_name", "user_type"],
                                                    "multiSelect"          : "to_delete",
                                                    "disabledKeyCol"       : "disabledKeyCol",
                                                    "multiSelectAction"     : multiSelectAction});
      contentPage.add(this.userListTable, "WncUserList", "User List", "help/help_user_mgmt.html");
      buttonPanel.get("cancel").enable(false);
    }.bind(this);

    this.deleteUser = function() {
        new ajaxRequest().sendRequest("del_user",
                                      Object.toJSON(this.userListTable.getSelectedData()),
                                      this.handleDeleteUser);
    }.bind(this);

    this.handleDeleteUser = function(value) {
        this.getUserList();
    }.bind(this);
}

WncConsoleSettings = function() {
    this.validation = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("Remote Console", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_wnc_console_cfg",
                                      "",
                                      this.handleGetConfig);
    }

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_ConsoleSettings(value),
                            "form");
    
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.add(form,
                        "WncConsoleSettings",
                        "Remote Console", "help/help_remote_console.html");

    }.bind(this);

    this.V_ConsoleSettings = function(config) {

        var consoleSettingsTbl = new NG_ConfTable();

        consoleSettingsTbl.addRow(["Secure Shell (SSH)"],
                             new NG_EnableDisableRadio("ssh_status", config.ssh_status));
        consoleSettingsTbl.addRow(["Telnet"],
                             new NG_EnableDisableRadio("telnet_status", config.telnet_status));

        return consoleSettingsTbl;
    };

    this.applyConfig = function() {
        form = contentPage.get("WncConsoleSettings");
        jData = $H(form.serialize(true));

        new ajaxRequest().sendRequest("set_wnc_console_cfg",
                                      Object.toJSON(jData),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Remote console Settings saved successfully");
    }.bind(this);
}

WncSessionTimeout = function() {
    this.validation = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("Session Timeout", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("",
                                      "",
                                      this.handleGetConfig,
                                      { url : "get_session_timeout.php"});
    }

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_SessionTimeout(value), "form");
    
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.add(form,
                        "WncSessionTimeout",
                        "Session Timeout", "help/help_idle_timeout.html");

    }.bind(this);

    this.V_SessionTimeout = function(config) {
        var tbl = new NG_ConfTable();
        var timeTextBox = new NG_TextBox("time", config,
                                            { "class"     : "required validate-digits",
                                              "maxlength" : "4",
                                              "title"     : "Please enter a valid number for Timeout"});
        tbl.addRow(["Timeout (minutes)"], [timeTextBox]);

        return tbl;
    };

    this.validate = function() {
        form = contentPage.get("WncSessionTimeout");
        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        form = contentPage.get("WncSessionTimeout");
        new ajaxRequest().sendRequest("",
                                      form["time"].value,
                                      this.handleApplyConfig,
                                      { url : "set_session_timeout.php"});
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
    }.bind(this);
}


WncSnmpSettings = function() {
    this.validation = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("SNMP", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);
    
    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_wnc_snmp_cfg",
                                      "",
                                      this.handleGetConfig);
    }

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_SnmpSettings(value),
                            "form");
        if(value.snmp == "0") {
            var e = form.findFirstElement();
            form.disable();
            e.enable();
        }

        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.add(form,
                        "WncSnmpSettings",
                        "SNMP", "help/help_snmp.html");

    }.bind(this);

    this.V_SnmpSettings = function(config) {

        var snmpSettingsTbl = new NG_ConfTable();

        snmpCheckBox = new NG_CheckBox("snmp", config.snmp);
        Event.observe(snmpCheckBox, "click", function(event) {
            e = Event.element(event);
            if(e.checked) {
                e.up("form").enable();
            } else {
                e.up("form").disable();
                e.enable();
            }
        });
        snmpSettingsTbl.addRow(["SNMP"], [snmpCheckBox]);
        snmpSettingsTbl.addRow(["Read-Only Community Name"],
                             [new NG_TextBox("read-only_community_name",
                                            config["read-only_community_name"],
                                            { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["Read-Write Community Name"],
                             [new NG_TextBox("read-write_community_name",
                                            config["read-write_community_name"],
                                            { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["Trap Community Name"],
                             [new NG_TextBox("trap_community_name",
                                             config.trap_community_name,
                                             { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["IP Address to Receive Traps"],
                             [new NG_TextBox("ip_address_to_receive_traps",
                                            config.ip_address_to_receive_traps,
                                            { "class" : "validate-ip",
                                              "title" : "Please enter a valid IP Address to Receive Traps"})]);
        snmpSettingsTbl.addRow(["Trap Port"],
                             [new NG_TextBox("trap_port",
                                            config.trap_port,
                                            { "class" : "required validate-digits",
                                              "title" : "Please enter a valid Trap Port"})]);
        snmpSettingsTbl.addRow(["SNMP Manager IP"],
                             [new NG_TextBox("snmp_manager_ip",
                                            config.snmp_manager_ip,
                                            { "class" : "validate-ip",
                                              "title" : "Please enter a valid SNMP Manager IP"})]);

        return snmpSettingsTbl;
    };

    this.validate = function() {
        form = contentPage.get("WncSnmpSettings");
        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        form = contentPage.get("WncSnmpSettings");
        jData = $H(form.serialize(true));

        new ajaxRequest().sendRequest("set_wnc_snmp_cfg",
                                      Object.toJSON(jData),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        //alert("SNMP Settings saved successfully");
        buttonPanel.get("cancel").enable(false);
    }.bind(this);
}

GroupConsoleSettings = function() {
    this.groupList = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Remote Console");

        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getConfig();
    }.bind(this);

    this.V_ConsoleSettings = function(config) {

        consoleSettingsTbl = new NG_ConfTable();

        consoleSettingsTbl.addRow(["Secure Shell (SSH)"],
                             new NG_EnableDisableRadio("ssh_status", config.ssh_status));
        consoleSettingsTbl.addRow(["Telnet"],
                             new NG_EnableDisableRadio("telnet_status", config.telnet_status));

        return consoleSettingsTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_ap_console_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        var groupTabbedPan = new NG_UI_tabbedPan("groups");
        for(var i = 0; i < value.length; i++) {
            form = Element.wrap(this.V_ConsoleSettings(value[i]),
                            "form", {"id" : value[i].group_idx});
            formChangeAction(form, function(){
                buttonPanel.get("cancel").enable(true);
            });
            groupTabbedPan.addTab(value[i].group_idx,
                                  valueTolabel(this.groupList, value[i].group_idx),
                                  form);
        }     

        contentPage.add(groupTabbedPan,
                        "GroupConsoleSettings",
                        "Remote Console", "help/help_remote_console_accesspoints.html");

    }.bind(this);

    this.applyConfig = function() {
        groupTabbedPan = contentPage.get("GroupConsoleSettings");
        form = groupTabbedPan.getSelectedTab();

        jData = $H(form.serialize(true));
        jData.set("group_idx", form.id);

        new ajaxRequest().sendRequest("set_ap_console_cfg",
                                      Object.toJSON(jData),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Remote console Settings saved successfully");
    }.bind(this);
}
GroupSnmpSettings = function() {
    this.groupList = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("SNMP");

        $("contents").update(contentPage);
        this.getGroupList();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getConfig();
    }.bind(this);

    this.V_SnmpSettings = function(config) {

        var snmpSettingsTbl = new NG_ConfTable();

        snmpCheckBox = new NG_CheckBox("snmp", config.snmp);
        Event.observe(snmpCheckBox, "click", function(event) {
            e = Event.element(event);
            if(e.checked) {
                e.up("form").enable();
            } else {
                e.up("form").disable();
                e.enable();
            }
        });
        snmpSettingsTbl.addRow(["SNMP"], [snmpCheckBox]);
        snmpSettingsTbl.addRow(["Read-Only Community Name"],
                             [new NG_TextBox("read-only_community_name",
                                            config["read-only_community_name"],
                                            { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["Read-Write Community Name"],
                             [new NG_TextBox("read-write_community_name",
                                            config["read-write_community_name"],
                                            { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["Trap Community Name"],
                             [new NG_TextBox("trap_community_name",
                                             config.trap_community_name,
                                             { "maxlength" : "31" })]);
        snmpSettingsTbl.addRow(["IP Address to Receive Traps"],
                             [new NG_TextBox("ip_address_to_receive_traps",
                                            config.ip_address_to_receive_traps,
                                            { "class" : "validate-ip",
                                              "title" : "Please enter a valid IP Address to Receive Traps"})]);
        snmpSettingsTbl.addRow(["Trap Port"],
                             [new NG_TextBox("trap_port",
                                            config.trap_port,
                                            { "class" : "required validate-digits",
                                              "title" : "Please enter a valid Trap Port"})]);
        snmpSettingsTbl.addRow(["SNMP Manager IP"],
                             [new NG_TextBox("snmp_manager_ip",
                                            config.snmp_manager_ip,
                                            { "class" : "validate-ip",
                                              "title" : "Please enter a valid SNMP Manager IP"})]);

        return snmpSettingsTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_ap_snmp_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        var groupTabbedPan = new NG_UI_tabbedPan("groups");
        for(var i = 0; i < value.length; i++) {
            form = Element.wrap(this.V_SnmpSettings(value[i]),
                            "form", {"id" : value[i].group_idx});
            if(value[i].snmp == "0") {
                var e = form.findFirstElement();
                form.disable();
                e.enable();
            }

            formChangeAction(form, function(){
                buttonPanel.get("cancel").enable(true);
            });
            groupTabbedPan.addTab(value[i].group_idx,
                                  valueTolabel(this.groupList, value[i].group_idx),
                                  form);
        }     

        contentPage.add(groupTabbedPan,
                        "GroupSnmpSettings",
                        "SNMP", "help/help_access_point_snmp.html");

    }.bind(this);

    this.validate = function() {
        groupTabbedPan = contentPage.get("GroupSnmpSettings");
        form = groupTabbedPan.getSelectedTab();
        
        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        groupTabbedPan = contentPage.get("GroupSnmpSettings");
        form = groupTabbedPan.getSelectedTab();

        jData = $H(form.serialize(true));
        jData.set("group_idx", form.id);

        new ajaxRequest().sendRequest("set_ap_snmp_cfg",
                                      Object.toJSON(jData),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("SNMP Settings saved successfully");
    }.bind(this);
}
WncUserPassword = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Change Password", { "width" : "426px" });

        $("contents").update(contentPage);
        var form = Element.wrap(this.V_ChangePassword(), "form");
        contentPage.add(form, "WncUserPasswordChange", "Change Password", "help/help_change_password.html");
        buttonPanel.reset();
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
    };

    this.V_ChangePassword = function(config) {

        changePasswordTbl = new NG_ConfTable();
        changePasswordTbl.addRow(["User Name"], [currentUserName, new NG_HiddenBox("user_name", currentUserName)]);
        changePasswordTbl.addRow(["Current Password"],
                                 [new NG_PasswordBox("old_password",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'Current Password' can not be blank",
                                                       "maxlength" : "31" })]);
        changePasswordTbl.addRow(["New Password"],
                                 [new NG_PasswordBox("password",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'New Password' can not be blank",
                                                       "maxlength" : "31" })]);
        changePasswordTbl.addRow(["Retype New Password"],
                                 [new NG_PasswordBox("retype_password",
                                                     "",
                                                     { "class" : "required",
                                                       "title" : "'Retype New Password' can not be blank",
                                                       "maxlength" : "31" })]);
        return changePasswordTbl;
    };

    this.validate = function() {
        form = contentPage.get("WncUserPasswordChange");

        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();

        if(!this.validation.validate()) {
            return false;
        }

        if(form["password"].value != form["retype_password"].value) {
            $('errorBlock').addError("'New Password' and 'Retype New Password' should be same.");
            return false;
        }

        return true;
    }

    this.applyConfig = function() {

        if(!this.validate()) return;

        form = contentPage.get("WncUserPasswordChange");
        new ajaxRequest().sendRequest("edit_user",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
    }.bind(this);
}
WncConfIpSettings = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("IP Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_IpSettingsInput = function(config) {

        ipSettingsTbl = new NG_ConfTable();

        ipSettingsTbl.addRow(["IP Address", new NG_HiddenBox("current_ip_address", config.ip_address)],
                             [new NG_TextBox("ip_address", config.ip_address,
                                 { "class" : "required validate-ip",
                                   "title" : "Please enter a valid IP Address."})]);
        ipSettingsTbl.addRow(["IP Subnet Mask"],
                             [new NG_TextBox("ip_subnet_mask", config.ip_subnet_mask,
                                 { "class" : "required validate-ip",
                                   "title" : "Please enter a valid Subnet Mask."})]);
        ipSettingsTbl.addRow(["Default Gateway"],
                             [new NG_TextBox("default_gateway", config.default_gateway, 
                                 { "class" : "validate-ip",
                                   "title" : "Please enter a valid Default Gateway."})]);
        ipSettingsTbl.addRow(["Primary DNS Server"],
                             [new NG_TextBox("primary_dns_server", config.primary_dns_server, 
                                 { "class" : "validate-ip",
                                   "title" : "Please enter a valid Primary DNS Server."})]);
        ipSettingsTbl.addRow(["Secondary DNS Server"],
                             [new NG_TextBox("secondary_dns_server", config.secondary_dns_server,
                                 { "class" : "validate-ip",
                                   "title" : "Please enter a valid Secondary DNS Server."})]);
        return ipSettingsTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_wnc_ip_settings",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_IpSettingsInput(value),
                            "form",
                            {"id":"wnc_ip_settings"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form,
                        "WncIpSettingsInput",
                        "IP Settings", "help/help_ip.html");
        form.focusFirstElement();
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("WncIpSettingsInput");
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {

        if(!this.validate()) return;

        redirect = "", redirectTime = 5;
        form = contentPage.get("WncIpSettingsInput");
        if(form["ip_address"].value != form["current_ip_address"].value) {
            redirect = "http://" + form["ip_address"].value + "/login.php"
        }
        new ajaxRequest().sendRequest("set_wnc_ip_settings",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig,
                                      { redirectTime : redirectTime,
                                        redirect     : redirect});
    }.bind(this);

    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("IP Settings saved successfully");
    }.bind(this);
}

WncGeneralSettings = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("General Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_GeneralSettings = function(config) {
        generalSettingsTbl = new NG_ConfTable();

        var nameInput = new NG_TextBox("name",
                                       config.name,
                                       { title : "Please enter a valid name.",
                                         "maxlength" : "31" });
        generalSettingsTbl.addRow(["Name"],
                                  [nameInput]);
        generalSettingsTbl.addRow(["Country / Region"],
                                  [new NG_Combo("country", config.list, config.country)]);

        nameInput.addClassName("required");
        return generalSettingsTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_general_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_GeneralSettings(value),
                            "form",
                            {"id":"wnc_general_settings"});

        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form,
                        "WncGeneralSettings",
                        "General Settings", "help/help_general.html");
        form.focusFirstElement();
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("WncGeneralSettings");
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }
    
    this.applyConfig = function() {

        if(!this.validate()) return;

        form = contentPage.get("WncGeneralSettings");
        new ajaxRequest().sendRequest("set_general_cfg",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("General settings saved successfully");
    }.bind(this);
}

WncTimeSettings = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Time Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_TimeSettings = function(config) {

        timeSettingsTbl = new NG_ConfTable();
        this.timezoneCombo = new NG_Combo("timezone", config.list, config.timezone);
        Event.observe(this.timezoneCombo, "change", this.timezoneChange);

        timeSettingsTbl.addRow(["Time Zone"], [this.timezoneCombo]);
        timeSettingsTbl.addRow(["Current Time"], [config.current_time]);


        this.enableDisableNtpClient = new NG_EnableDisableRadio("ntp_client",
                                                                config.ntp_client,
                                                                this.enableDisableNtpClientChange);

        timeSettingsTbl.addRow(["NTP Client"],
                               this.enableDisableNtpClient);

        this.useCustomNtpServerCB = new NG_CheckBox("use_custom_ntp_server", config.use_custom_ntp_server);
        Event.observe(this.useCustomNtpServerCB, "click", this.useCustomNtpServerChange);

        timeSettingsTbl.addRow(["Use Custom NTP Server"], [this.useCustomNtpServerCB]);

        this.hostNameTextBox = new NG_TextBox("ntp_server_url",
                                              config.ntp_server_url,
                                              { "class" : "required",
                                                title : "Hostname/IP Address is required." });

        this.default_ntp_server_urls = new Hash();
        for(var i = 0; i < config.list.length; i++) {
            this.default_ntp_server_urls.set(config.list[i].value,
                                             config.list[i].default_ntps);
        }
        if(config.ntp_client == "0") {
            this.useCustomNtpServerCB.disabled = true;
            this.hostNameTextBox.disabled = true;
            this.hostNameTextBox.value = this.default_ntp_server_urls.get(config.timezone);
        }
        else if(config.use_custom_ntp_server == "0") {
            this.hostNameTextBox.disabled = true;
            this.hostNameTextBox.value = this.default_ntp_server_urls.get(config.timezone);
        }

        timeSettingsTbl.addRow(["Hostname / IP Address"], [this.hostNameTextBox]);
 
       return timeSettingsTbl;
    };

    this.timezoneChange = function(event) {
        if (!this.useCustomNtpServerCB.checked) {
            this.hostNameTextBox.value = this.default_ntp_server_urls.get(getComboSelectedValue(this.timezoneCombo));
        }
    }.bind(this);
    this.useCustomNtpServerChange = function(event) {
        e = Event.element(event);
        if (e.checked) {
            this.hostNameTextBox.disabled = false;
        }
        else {
            this.hostNameTextBox.disabled = true;
            this.hostNameTextBox.value = this.default_ntp_server_urls.get(getComboSelectedValue(this.timezoneCombo));
        }
    }.bind(this);
    this.enableDisableNtpClientChange = function(event) {
        e = Event.element(event);
        if (e.value == "1") {
            this.useCustomNtpServerCB.disabled = false;
            this.hostNameTextBox.disabled = !this.useCustomNtpServerCB.checked;
        }
        else {
            this.useCustomNtpServerCB.disabled = true;
            this.hostNameTextBox.disabled = true;
            this.hostNameTextBox.value = this.default_ntp_server_urls.get(getComboSelectedValue(this.timezoneCombo));
        }

    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_time_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_TimeSettings(value),
                            "form",
                            {"id":"wnc_time_settings"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form,
                        "WncTimeSettings",
                        "Time Settings", "help/help_time.html");
        form.focusFirstElement();
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("WncTimeSettings");
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        form = contentPage.get("WncTimeSettings");
        new ajaxRequest().sendRequest("set_time_cfg",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);

    }.bind(this);
    this.handleApplyConfig = function(value) {
        this.openPage();
        buttonPanel.get("cancel").enable(false);
        //alert("Time settings saved successfully");
    }.bind(this);
}

WncVlan = function() {
    this.validation = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("VLAN Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }

        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_VlanSettings = function(config) {

        vlanTbl = new NG_ConfTable();

        enableVlanCheckBox = new NG_CheckBox("vlan_enable", config.vlan_enable);
        Event.observe(enableVlanCheckBox, "click", function(event) {
            e = Event.element(event);
            this.enableVlanTextBox.disabled = !e.checked;
        }.bind(this));

        this.enableVlanTextBox = new NG_TextBox("untagged_vlan",
                                                config.untagged_vlan,
                                                { "class" : "required validate-digits",
                                                  "title" : "Please enter a valid Untagged VLAN number"});
        vlanTbl.addRow([enableVlanCheckBox,
                        "&nbsp;&nbsp;Untagged VLAN"],
                       [this.enableVlanTextBox]);
        vlanTbl.addRow(["Management VLAN"],
                       [new NG_TextBox("management_vlan",
                                       config.management_vlan,
                                       { "class" : "required validate-digits",
                                         "title" : "Please enter a valid Management VLAN number"})]);
        return vlanTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_vlan_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_VlanSettings(value),
                            "form");
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.remove("WncVlanSettings");
        contentPage.add(form,
                        "WncVlanSettings",
                        "VLAN Settings", "help/help_vlan.html");
        form.focusFirstElement();                        
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("WncVlanSettings");
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {

        if(!this.validate()) return;

        form = contentPage.get("WncVlanSettings");
        new ajaxRequest().sendRequest("set_vlan_cfg",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("VLAN Settings saved successfully");
    }.bind(this);
}

WncSyslogSettings = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Syslog Settings", { "width" : "426px" });

        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_SyslogSettings = function(config) {

        syslogSettingsTbl = new NG_ConfTable();

        enableSyslogCB = new NG_CheckBox("state", config.state);
        Event.observe(enableSyslogCB, "click", this.enableSyslogChange);
        syslogSettingsTbl.addRow(["Enable Syslog"], [enableSyslogCB]);

        this.ipAddressTextBox = new NG_TextBox("ip_address",
                                               config.ip_address,
                                               { "class" : "validate-ip",
                                                 "title" : "Please enter a valid Syslog Server IP Address"});
        this.portTextBox = new NG_TextBox("port",
                                          config.port,
                                          { "maxlength" : "5",
                                            "size"  : "5",
                                            "class" : "required validate-digits",
                                            "title" : "Please enter a valid Server Port Number"});
        if(config.state == "0") {
            this.ipAddressTextBox.disabled = true;
            this.portTextBox.disabled = true;
        }

        syslogSettingsTbl.addRow(["Syslog Server IP Address"], [this.ipAddressTextBox]);
        syslogSettingsTbl.addRow(["Server Port Number"], [this.portTextBox]);

        return syslogSettingsTbl;
    };
    this.enableSyslogChange = function(event) {
        e = Event.element(event);
        this.ipAddressTextBox.disabled = !e.checked;
        this.portTextBox.disabled = !e.checked;
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_syslog_settings",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        form = Element.wrap(this.V_SyslogSettings(value),
                            "form",
                            {"id":"wnc_syslog_settings"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form,
                        "WncSyslogSettings",
                        "Syslog Settings", "help/help_syslog.html");
        form.focusFirstElement();
    }.bind(this);

    this.validate = function() {
        form = contentPage.get("WncSyslogSettings");
        this.validation = new Validation(form);
        this.validation.reset();
        return this.validation.validate();
    }

    this.applyConfig = function() {
        if(!this.validate()) return;

        form = contentPage.get("WncSyslogSettings");
        new ajaxRequest().sendRequest("set_syslog_settings",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
    this.handleApplyConfig = function(value) {
        buttonPanel.get("cancel").enable(false);
        //alert("Syslog settings saved successfully");
    }.bind(this);
}

WncConfAddDhcp = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("DHCP Settings", { "width" : "426px" });
        form = Element.wrap(this.V_DhcpSettingsInput(),
                                     "form",
                                     {"id":"tbl_wnc_dhcp_add_form"});
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        contentPage.add(form, "WncDhcptingsInput", "DHCP Settings", "help/help_dhcp_server.html");
        this.getDhcpServerList();
        $("contents").update(contentPage);
        form.focusFirstElement();

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);
        addBtn = new NG_UI_button("btn_add", "add", "off", this.applyConfig);
        buttonPanel.add("add", addBtn);
        removeBtn = new NG_UI_button("remove_apply", "remove", "off", this.deleteDhcpServer);
        buttonPanel.add("remove", removeBtn);
        if(userType != "admin") {
            addBtn.inActivate();
            removeBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.V_DhcpSettingsInput = function() {

        dhcpSettingsTbl = new NG_ConfTable();

        this.vlan = new NG_TextBox("VLAN",
                                   "",
                                   { "class" : "required validate-digits",
                                     "title" : "Please enter a valid VLAN"});
        this.ip = new NG_TextBox("IP_Network",
                                 "",
                                 { "class" : "required validate-ip",
                                   "title" : "Please enter a valid IP Network"})
        this.mask = new NG_TextBox("Subnet_Mask",
                                   "",
                                   { "class" : "required validate-ip",
                                     "title" : "Please enter a valid Subnet Mask"});
        this.gw = new NG_TextBox("Default_Gateway",
                                 "",
                                 { "class" : "validate-ip",
                                   "title" : "Please enter a valid Default Gateway"});

        this.useDefaultDns = new NG_CheckBox("use_default_dns", 1);
        this.dns1 = new NG_TextBox("Primary_DNS_Server",
                                   "",
                                   { "class" : "validate-ip",
                                     "title" : "Please enter a valid Default Gateway"});
        this.dns2 = new NG_TextBox("Secondary_DNS_Server",
                                   "",
                                   { "class" : "validate-ip",
                                     "title" : "Please enter a valid Default Gateway"});
        this.useVlanIf = new NG_CheckBox("use_vlan_interface", 1);
        this.config = null;

        Event.observe(this.useVlanIf, "click", function(event) {
            e = Event.element(event);
            this.vlan.disabled = !e.checked;
            this.ip.disabled = !e.checked;
            this.mask.disabled = !e.checked;
            this.gw.disabled = !e.checked;
            if (!e.checked) {
                this.ip.value = this.config.nw_cfg.ip_network;
                this.mask.value = this.config.nw_cfg.ip_subnet_mask;
                this.gw.value = this.config.nw_cfg.default_gateway;
            }
        }.bind(this));

        Event.observe(this.useDefaultDns, "click", function(event) {
            e = Event.element(event);
            this.dns1.disabled = e.checked;
            this.dns2.disabled = e.checked;
            if (e.checked) {
                this.dns1.value = this.config.nw_cfg.primary_dns_server;
                this.dns2.value = this.config.nw_cfg.secondary_dns_server;
            }
        }.bind(this));

        dhcpSettingsTbl.addRow(["Use VLAN Interface"], [this.useVlanIf]);
        dhcpSettingsTbl.addRow(["VLAN"], [this.vlan]);
        dhcpSettingsTbl.addRow(["IP Network"], [this.ip]);

        dhcpSettingsTbl.addRow(["Subnet Mask"], [this.mask]);
        dhcpSettingsTbl.addRow(["Default Gateway"], [this.gw]);
        dhcpSettingsTbl.addRow(["Start IP"],
                               [new NG_TextBox("Start_IP", "",
                                               { "class" : "required validate-ip",
                                                 "title" : "Please enter a valid Start IP"})]);
        dhcpSettingsTbl.addRow(["End IP"],
                               [new NG_TextBox("End_IP", "",
                                               { "class" : "required validate-ip",
                                                 "title" : "Please enter a valid End IP"})]);
        dhcpSettingsTbl.addRow(["Use Default DNS Server"],
                               [this.useDefaultDns]);
        dhcpSettingsTbl.addRow(["Primary DNS Server"], [this.dns1]);
        dhcpSettingsTbl.addRow(["Secondary DNS Server"], [this.dns2]);

        return dhcpSettingsTbl;
    };

    this.applyConfig = function() {
        form = contentPage.get("WncDhcptingsInput");
        new ajaxRequest().sendRequest("add_dhcpd",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
        this.getDhcpServerList();
        //alert("DHCP server added successfully");
    }.bind(this);

    this.getDhcpServerList = function() {
        new ajaxRequest().sendRequest("get_dhcpd_list",
                                      null,
                                      this.handleGetDhcpServerList);
    }.bind(this);

    this.handleGetDhcpServerList = function(value) {
        this.config = value;
        list = this.config.dhcpd_cfg;
        contentPage.remove("dhcpServerList");
        if(list.size() == 0) {
            cols = ["Use_VLAN_Interface","VLAN","IP_Network",
                    "Default_Gateway","Start_IP","End_IP",
                    "Primary_DNS_Server","Secondary_DNS_Server"];
            this.dhcpServerTable = new NG_TableOrderer('DhcpServers',
                                                      {"data"                 : list,
                                                       "columns"              : cols,
                                                       hideData               : true,
                                                       "singleSelectKeyField" : "Start_IP"});
            buttonPanel.get("remove").enable(false);
        } else {
            this.dhcpServerTable = new NG_TableOrderer('ManagedAPs',
                                                      {"data"                 : list,
                                                       "singleSelectKeyField" : "Start_IP"});
            buttonPanel.get("remove").enable(true);
        }

        contentPage.add(this.dhcpServerTable, "dhcpServerList", "DHCP Server List", "help/help_dhcp_server.html");
        buttonPanel.get("cancel").enable(false);
        this.dns1.value = this.config.nw_cfg.primary_dns_server;
        this.dns2.value = this.config.nw_cfg.secondary_dns_server;
        this.dns1.disabled = true;
        this.dns2.disabled = true;
    }.bind(this);

    this.deleteDhcpServer = function() {
                new ajaxRequest().sendRequest("del_dhcpd",
                                              Object.toJSON(this.dhcpServerTable.getSingleSelectData()),
                                              this.handleDeleteDhcpServer);
    }.bind(this);
    this.handleDeleteDhcpServer = function(value) {
        this.getDhcpServerList();
    }.bind(this);
}

WncUpgrade = function() {
        this.dummyFrame = new Element("IFRAME", 
                                      {"id"           : "upgrade_frame",
                                       "name"         : "upgrade_frame",
                                       "src"          : "",
                                       "height"       : "0px",
                                       "width"        : "0px",
                                       "marginheight" : "0px",
                                       "marginwidth"  : "0px",
                                       "scrolling"    : "no",
                                       "frameborder"  : "0",
                                       "vspace"       : "0",
                                       "hspace"       : "0"});

        this.openPage = function() {
                contentPage = new NG_UI_page("Upgrade", { "width" : "426px" });
                $("contents").update(contentPage);

                this.getWncVersion();

                $("standardButtons").update();
                applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.uploadFile);
                $("standardButtons").insert(applyBtn);
                if(userType != "admin") {
                    applyBtn.inActivate();
                }
        };

        this.getWncVersion = function() {
            new ajaxRequest().sendRequest("get_wnc_version",
                                           null,
                                           this.handleGetWncVersion);
        }

        this.handleGetWncVersion = function(value) {
            upgradeForm = Element.wrap(this.V_upgrade(value),
                                       "form",
                                       {"method"  : "post",
                                        "action"  : "file_upload.php",
                                        "target"  : this.dummyFrame.id,
                                        "encoding" : "multipart/form-data",
                                        "enctype" : "multipart/form-data"});

            contentPage.add(upgradeForm, "UpgradeInput", "Upgrade", "help/help_upgrade_system.html");
            
        }.bind(this);

        this.V_upgrade = function(versionInfo) {
                upgradeTbl = new NG_ConfTable();

                upgradeTbl.addRow(["Current release version"],
                                  [versionInfo.version]);
                upgradeTbl.addRow(["Current build version"],
                                  [versionInfo.build]);
                upgradeTbl.addRow(["Select upgrade file"],
                                  [new NG_FileBox("upgrade_file",
                                                  "",
                                                  {"class" : "required",
                                                   "Title" : "Select upgrade file to upgrade WMS5316"}),
                                   this.dummyFrame]);
                return upgradeTbl;
        };

        this.validate = function() {
            form = contentPage.get("UpgradeInput");
            this.validation = new Validation(form, {onSubmit:false,
                                                    useTitles : true});
            this.validation.reset();
            return this.validation.validate();
        }
                             
        this.uploadFile = function() {
            if(!this.validate()) return;

            iFrameLoad(this.dummyFrame, this.uploadFileComplete);
            busyBar.show();
            contentPage.get("UpgradeInput").submit();
        }.bind(this);
        this.uploadFileComplete = function() {
            busyBar.hide();
            this.upgrade();
        }.bind(this);
        this.upgrade = function() {
            form = contentPage.get("UpgradeInput");
            jObject = { "loc" : "/tmp/wnc.bin" };
            new ajaxRequest({redirect : "login.php"}).sendRequest("upgrade_wnc",
                                          Object.toJSON(jObject),
                                          this.handleUpgrade,
                                          { redirect : "login.php" });
        }.bind(this);
        this.handleUpgrade = function(value) {
            alert("WMS5316 Rebooting");
        }.bind(this);
}

ApUpgrade = function() {
    this.apToModelHash = null;
    this.apListTable;
    this.groupList = null;

    this.dummyFrame = new Element("IFRAME", 
                                  {"id"           : "upgrade_frame",
                                   "name"         : "upgrade_frame",
                                   "src"          : "",
                                   "height"       : "0px",
                                   "width"        : "0px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});

    this.openPage = function() {
        contentPage = new NG_UI_page("Upgrade", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getGroupList();

        $("standardButtons").update();
        applyBtn = new NG_UI_button("btn_apply",
                                    "apply",
                                    "off",
                                    this.uploadFile);
        $("standardButtons").insert(applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
    };

    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                      null,
                                      this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        this.getApList();
    }.bind(this);

    this.getApList = function() {
        new ajaxRequest().sendRequest("get_ap_fw_list",
                                      null,
                                      this.handleGetApList);
    }

    this.handleGetApList = function(value) {
        this.apToModelHash = new Hash();
        for(var i = 0; i < value.length; i++) {
            var apArray = this.apToModelHash.get(value[i].model);
            if(apArray == null) {
                apArray = new Array();
                this.apToModelHash.set(value[i].model, apArray);
            }
            apArray[apArray.length] = value[i];
        }

        upgradeForm = Element.wrap(this.V_upgrade(value),
                                   "form",
                                   {"method"  : "post",
                                    "action"  : "file_upload.php",
                                    "target"  : this.dummyFrame.id,
                                    "encoding" : "multipart/form-data",
                                    "enctype" : "multipart/form-data"});

        contentPage.add(upgradeForm, "UpgradeInput", "Upgrade", "help/help_upgrade_ap.html");
    }.bind(this);

    this.V_upgrade = function(versionInfo) {
        upgradeTbl = new NG_ConfTable();
        models = this.apToModelHash.keys();
        modelAry = new Array();
        modelAry[0] = { "label" : "---Select AP Model---",
                        "value" : "0" };
        for(var i = 0; i < models.length; i++) {
            modelAry[modelAry.length] = { "label" : models[i],
                                              "value" : models[i] };
        }
        modelCombo = new NG_Combo("model", modelAry);
        Event.observe(modelCombo, "change", this.modelComboChange);

        upgradeTbl.addRow(["Model"], [modelCombo]);
        upgradeTbl.addRow(["Select upgrade file"],
                          [new NG_FileBox("upgrade_file",
                                          "",
                                          {"class" : "required",
                                          "Title" : "Select upgrade file to upgrade Access Point"}),
                           this.dummyFrame]);
        return upgradeTbl;
    };

    this.modelComboChange = function(event) {
        e = Event.element(event);
        selectedModel = getComboSelectedValue(e);
        contentPage.remove("ApList");
        contentPage.add(this.V_ApTable(selectedModel),
                        "ApList",
                        "AP List",
                        "");
    }.bind(this);

    this.V_ApTable = function(model) {
        var apArray = this.apToModelHash.get(model);
        apArray.each(
             function(e) {
                         e.to_upgrade = true;
                         e.Group = valueTolabel(this.groupList, e.group_idx);
             }.bind(this) );

        return new NG_TableOrderer('ApList',
                                   {"data"                 : apArray,
                                    "pageCount"            : 16,
                                    "noColDataFields"      : ["group_idx"],
                                    "multiSelect"          : "to_upgrade"});
    }
        
    this.validate = function() {
        form = contentPage.get("UpgradeInput");
        this.validation = new Validation(form, {onSubmit:false,
                                                    useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }
                             
    this.uploadFile = function() {
        if(!this.validate()) return;

        iFrameLoad(this.dummyFrame, this.uploadFileComplete);
        busyBar.show();
        contentPage.get("UpgradeInput").submit();
    }.bind(this);

    this.uploadFileComplete = function() {
        busyBar.hide();
        this.upgrade();
    }.bind(this);

    this.upgrade = function() {
        jObject = {"loc" : "/tmp/wnc.bin",
                   "ap_list" : contentPage.get("ApList").getSelectedData()};
        new ajaxRequest().sendRequest("upgrade_ap",
                                      Object.toJSON(jObject),
                                      this.handleUpgrade);
    }.bind(this);

    this.handleUpgrade = function(value) {
        //alert("Selected Access Points upgrade done successfully\n" + 
        //      "Access Points will take approximately 5 mins to reboot");
    }.bind(this);
}

WncRestoreDefault = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Restore Defaults", { "width" : "426px" });

        form = Element.wrap(this.V_RestoreDefault(), "form")
        contentPage.add(form, "WncRestoreDefault", "Restore Defaults", "help/help_restore_defaults.html");
        $("contents").update(contentPage);

        $("standardButtons").update();
        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        $("standardButtons").insert(applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
    };

    this.V_RestoreDefault = function() {

        restoreDefaultTbl = new NG_ConfTable();

        restoreDefaultTbl.addRow(["Restore to factory default settings"],
                                 new NG_YesNoRadio("set_facdef", "0"));

        return restoreDefaultTbl;
    };

    this.applyConfig = function() {
        form = contentPage.get("WncRestoreDefault");

        if($H(form.serialize(true)).get("set_facdef") == 1) {
            new ajaxRequest().sendRequest("set_facdef",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig,
                                      { redirect : "login.php" });
        }
    }.bind(this);
    this.handleApplyConfig = function(value) {
        alert("WMS5316 Rebooting");
    }.bind(this);
}

WncReboot = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Reboot WMS5316", { "width" : "426px" });

        form = Element.wrap(this.V_Reboot(), "form")
        contentPage.add(form, "WncReboot", "Reboot WMS5316", "help/help_reboot_controller.html");
        $("contents").update(contentPage);

        $("standardButtons").update();
        applyBtn = new NG_UI_button("btn_apply",
                                    "apply",
                                    "off",
                                    this.applyConfig);
        $("standardButtons").insert(applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
    };

    this.V_Reboot = function() {

        rebootTbl = new NG_ConfTable();

        rebootTbl.addRow(["Reboot WMS5316"],
                          new NG_YesNoRadio("reboot", "0"));

        return rebootTbl;
    };

    this.applyConfig = function() {
        form = contentPage.get("WncReboot");

        if($H(form.serialize(true)).get("reboot") == 1) {
            new ajaxRequest().sendRequest("reboot",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig,
                                      {redirect : "login.php"});
        }
    }.bind(this);
    this.handleApplyConfig = function(value) {
        alert("WMS5316 Rebooting");
    }.bind(this);
}

GroupReboot = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Reboot Access Points");
        $("contents").update(contentPage);

        this.getGroupList();

        $("standardButtons").update();
        applyBtn = new NG_UI_button("btn_apply",
                                    "apply",
                                    "off",
                                    this.applyConfig);
        $("standardButtons").insert(applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
    };
    this.getGroupList = function() {
        new ajaxRequest().sendRequest("get_group_list",
                                       null,
                                       this.handleGetGroupList);
    }

    this.handleGetGroupList = function(value) {
        this.groupList = value;
        var groupTabbedPan = new NG_UI_tabbedPan("groups");
        
        for(var i = 0; i < value.length; i++) {
            form = Element.wrap(this.V_Reboot(), "form", {"id" : value[i].value})
            groupTabbedPan.addTab(value[i].value, value[i].label, form);
        }

        contentPage.add(groupTabbedPan, "Reboot", "Reboot All Access Points in Group", "help/help_reboot_aps.html");
    }.bind(this);
    
    this.V_Reboot = function() {

        rebootTbl = new NG_ConfTable();

        rebootTbl.addRow(["Reboot all access points in this group"],
                                 new NG_YesNoRadio("reboot", "0"));

        return rebootTbl;
    };

    this.applyConfig = function() {
        groupTabbedPan = contentPage.get("Reboot");

        var form = groupTabbedPan.getSelectedTab();
        var jObject = {"group_idx" : groupTabbedPan.getSelectedTab().id};

        if($H(form.serialize(true)).get("reboot") == 1) {
            new ajaxRequest().sendRequest("ap_reboot",
                                          Object.toJSON(jObject),
                                          this.handleApplyConfig);
        }
    }.bind(this);

    this.handleApplyConfig = function(value) {
        alert("Rebooting all access points in this group");
    }.bind(this);
}

WncSyslog = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("System Log", { "width" : "426px" });

        this.getConfig();
        $("contents").update(contentPage);
        $("standardButtons").update();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    this.refreshConfig);
        $("standardButtons").insert(refreshBtn);
        clearBtn = new NG_UI_button("btn_clear",
                                    "clear",
                                    "off",
                                    this.clearConfig);
        $("standardButtons").insert(clearBtn);
        if(userType != "admin") {
            clearBtn.inActivate();
        }
    };

    this.refreshConfig = function() {
        this.getConfig();
    }.bind(this);

    this.clearConfig = function() {
        new ajaxRequest().sendRequest("clear_log",
                                      "",
                                      this.handleClearConfig);
    }.bind(this);
    this.handleClearConfig = function(value) {
        this.getConfig();
    }.bind(this);

    this.V_Syslog = function(log) {
        syslogTbl = new NG_Table();
        function repl(text) { text = text.replace(/(\r\n|\r|\n)/g, '\n');
                   return text.replace(/([^\n])\n([^\n])/g, "$1\n$2");} 
        log = repl(log);
        syslogTbl.addCaptionRow(new NG_TextArea("syslog",
                                                log,
                                                {"cols"     : "65",
                                                 "rows"     : "12",
                                                 "readonly" : "readonly"}));

        return syslogTbl;
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_log",
                                      "",
                                      this.handleGetConfig,
                                      {"url" : "nonjson_request_handler.php"});
    }.bind(this);

    this.handleGetConfig = function(value) {
        contentPage.remove("WncSyslog");

        if (value.substr(0,7) == "success") {
            contentPage.add(this.V_Syslog(value.substr(8)),
                            "WncSyslog",
                            "System Log", "help/help_logs_diagnostics.html");
        }
        else {
            $('errorBlock').set(value.substr(6));
            contentPage.add(this.V_Syslog(""),
                            "WncSyslog",
                            "System Log", "help/help_logs_diagnostics.html");
        }

    }.bind(this);

}

logout = function() {
    new ajaxRequest().sendRequest("logout",
                                  "",
                                  handleLogout,
                                  {showBusyBar : false});
}

handleLogout = function(value){
    window.open("login.php", "_self");
}

MonitoringSummary = function() {

    this.config = null;
    this.chartDiv;
    this.openPage = function() {
        contentPage = new NG_UI_page("System Log", { "width" : "426px" });

        this.getConfig();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh",
                                      "refresh",
                                      "off",
                                      this.refresh);
        buttonPanel.add("refresh", refreshBtn);
    };
    this.refresh = function() {
        this.openPage();
    }.bind(this);
    this.V_MonitoringSummary = function(apStatusTbl,
                                        rogueAPTbl,
                                        wirelessStationsTbl,
                                        networkInfoTbl) {
        helpUrl="";
      	tbl = new Element("TABLE");
        tBody = new Element("TBODY"); tbl.update(tBody);

        domTitleRow = new Element("TR"); tBody.update(domTitleRow);

        domCell = new Element("TD", { 'class': 'font15Bold' }).update("Monitoring Summary");
        domTitleRow.update(domCell);

        domRow = new Element("TR"); tBody.insert(domRow);
        domRow.update(new Element("TD")).setStyle({'height': '5px'}); 

        errorBlock = new NG_Error_Block();
        domRow = new Element("TR"); tBody.insert(domRow);
        domRow.update(new Element("TD").update(errorBlock)); 
        domRow = new Element("TR"); tBody.insert(domRow);
        domRow.update(new Element("TD")).setStyle({'height': '10px'}); 

		domRow = new Element("TR"); tBody.insert(domRow);
		domCell = new Element("TD", {valign : "top"})
            .update(new NG_Title_Wrapper(apStatusTbl, "Access Point Status", "help/help_monitoring_summary_basic.html#mon_basic_ap_status").wrapper);
		domRow.insert(domCell);
		domCell = new Element("TD", {'width': '22px'}).update("&nbsp;");
		domRow.insert(domCell);
		domCell = new Element("TD", {valign : "top"})
            .update(new NG_Title_Wrapper(rogueAPTbl, "Rogue Access Point", "help/help_monitoring_summary_basic.html#mon_basic_rogue_aps").wrapper);
		domRow.insert(domCell);
		domRow = new Element("TR"); tBody.insert(domRow);
		domRow.update(new Element("TD").update("&nbsp;")).setStyle({'height': '22px'}); 

		domRow = new Element("TR"); tBody.insert(domRow);
		domCell = new Element("TD", {valign : "top"})
            .update(new NG_Title_Wrapper(wirelessStationsTbl, "Wireless Stations", "help/help_monitoring_summary_basic.html#mon_basic_wireless_stations").wrapper);
		domRow.insert(domCell);
		domCell = new Element("TD").update("&nbsp;");
		domRow.insert(domCell);
		domCell = new Element("TD", {valign : "top"})
            .update(new NG_Title_Wrapper(networkInfoTbl, "Network Info", "help/help_monitoring_summary_basic.html#mon_basic_network_info").wrapper);
		domRow.insert(domCell);
		domRow = new Element("TR"); tBody.insert(domRow);
		domRow.update(new Element("TD").update("&nbsp;")).setStyle({'height': '22px'});

        this.chartDiv = new Element("DIV");

		domRow = new Element("TR"); tBody.insert(domRow);
		domCell = new Element("TD", {valign : "top", colspan : 3})
            .update(this.chartDiv);
		domRow.insert(domCell);

        legendTbl = new NG_Legend([{color : "#46008f", "label" : "Average Receive Rate / Access Point"},
                                   {color : "#666f74", "label" : "Average Transmit Rate / Access Point"}]);
        legendTbl.writeAttribute({"align" : "center"});
		domRow = new Element("TR"); tBody.insert(domRow);
		domCell = new Element("TD", {align : "center", valign : "top", colspan : 3})
            .update(legendTbl);
		domRow.insert(domCell);

		return tbl;
	};

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_mon_summary",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);
    this.handleGetConfig = function(value) {
        this.config = value;
        this.getWncVersion();
    }.bind(this);
    this.getApStatus = function() {
        new ajaxRequest().sendRequest("get_mon_ap_summary",
                                      "",
                                      this.handleGetApStatus);
    }.bind(this);
    this.handleGetApStatus = function(value) {
        apStatusTbl = this.V_ApStatus(value);
        rogueAPTbl = this.V_RogueAP(this.config);
        wirelessStationsTbl = this.V_WirelessStations(this.config);
        networkInfoTbl = this.V_NetworkInfo(this.config);

        contentPage = this.V_MonitoringSummary(apStatusTbl,
                                               rogueAPTbl,
                                               wirelessStationsTbl,
                                               networkInfoTbl);
        $("contents").update(contentPage);

        this.getUsage();
    }.bind(this);
    this.getWncVersion = function() {
        new ajaxRequest().sendRequest("get_wnc_version",
                                       null,
                                       this.handleGetWncVersion);
    }

    this.handleGetWncVersion = function(value) {
        this.firmwareVersion = value.version; 
        this.getApStatus();           
    }.bind(this);

    this.getUsage = function() {
        new ajaxRequest().sendRequest("get_usage",
                                      "",
                                      this.handleGetUsage);
    }.bind(this);

    this.handleGetUsage = function(value) {
        var id = "chart_frame" + Math.random();
        chartFrame = new Element("IFRAME", 
                                  {"id"           : id,
                                   "name"         : id,
                                   "src"          : "blank.php",
                                   "height"       : "300px",
                                   "width"        : "700px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});
        this.chartDiv.update(chartFrame);

        drawChart(window.frames[id],
                  [value.rx_total, value.tx_total],
                  {"YScale"   : " Kbps",
                                 "XScale"   : " Hrs",
                                 "title"    : "<b>Network Usage</b>",
                                  bgColor   : "#EEEEEE",
                                  gridColor : "#cccccc",
                                  fontColor : "#000000"});

    }.bind(this);

    this.V_ApStatus = function(value) {
        tbl = NG_ConfTable();
        tbl.addRow(["Total Configured"], [value.total]);
        tbl.addRow(["Down"], [value.down]);
        tbl.addRow(["Critical"], [value.critical]);
        tbl.addRow(["Major"], [value.major]);
        tbl.addRow(["Healthy"], [value.healty]);

        return tbl;
    }

    this.V_RogueAP = function(value) {
        tbl = NG_ConfTable();
        tbl.addRow(["Rogue AP current"], [value.rogue_ap_current]);
        tbl.addRow(["Rogue AP count 24hrs"], [value.rogue_ap_last_24_hrs]);

        return tbl;
    }


    this.V_WirelessStations = function(value) {
        tbl = NG_ConfTable();
        var wireless_stations = value.wireless_stations;
        for(var i = 0; i < wireless_stations.length; i++) {
            tbl.addRow([wireless_stations[i].type], [wireless_stations[i].count]);            
        }
        return tbl;
    }
    
    this.V_NetworkInfo = function(value) {
        tbl = NG_ConfTable();
        tbl.addRow(["Last Channel Allocation Run"], [value.last_autochan_alloc]);
        tbl.addRow(["Last Configuration Change"], [value.last_config_change]);
        tbl.addRow(["Last WMS5316 Reboot"], [value.bootup_time]);
        tbl.addRow(["Last Admin Login"], [value.last_admin_login]);
        tbl.addRow(["WMS5316 Firmware Version"], [this.firmwareVersion]);

        return tbl;
    }
}

MonitoringApStatus = function() {
    this.config = null;
    this.data = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Access Point Status", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getConfig();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    this.refresh);
        buttonPanel.add("refresh", refreshBtn);
        detailsBtn = new NG_UI_button("btn_details",
                                    "details",
                                    "off",
                                    this.details);
        buttonPanel.add("details", detailsBtn);
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_ap_status",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        if(value.ap_status.length == 0) {
	        cols = ["Status","Group","Access point","Ip address","Model","Bg channel","A channel","Bg clients","A clients"];
	        buttonPanel.get("details").enable(false);
        } else {
            cols = Object.keys(value.ap_status[0]);
	        buttonPanel.get("details").enable(true);
        }

        apStatus = new NG_TableOrderer('ApStatus',
                                      {"data"                 : value.ap_status,
                                       "paginate"             : false,
                                       "columns"              : cols,
                                       "singleSelectKeyField" : "access_point_name"});
        contentPage.remove("ApStatus");
        contentPage.add(apStatus, "ApStatus", "Access Point Status", "help/help_advanced_ap_status.html");
    }.bind(this);
    this.refresh = function() {
        this.getConfig();
    }.bind(this);
    
    this.details = function() {
        jObject = contentPage.get("ApStatus").getSingleSelectData();
        h = screen.availHeight - 100;
        t = 50;
        w = screen.availWidth/2;  
        l = screen.availWidth/4;
        
        win = window.open("ap_status.php?ip="+jObject.ip_address,
                          jObject.access_point.gsub('-','_'),
                          "width="+w+",height="+h+",top="+t+",left="+l+ 
                          ",scrollbars=no" +
                          ",location=no,menubar=no,toolbar=no");
    }.bind(this);
}

MonitoringClientStatus = function() {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Client Status", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getConfig();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    this.refresh);
        buttonPanel.add("refresh", refreshBtn);
        detailsBtn = new NG_UI_button("btn_details",
                                    "details",
                                    "off",
                                    this.details);
        buttonPanel.add("details", detailsBtn);
    };

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_client_status",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        if(value.client_status.length == 0) {
            cols = ["Access point","Model","Mac","Ssid","Bssid","Channel","Rate","State","Type","Aid","Mode","Bytes","received","Bytes sent"];
	        buttonPanel.get("details").enable(false);
        } else {
            cols = Object.keys(value.client_status[0]);
	        buttonPanel.get("details").enable(true);
        }
        clientStatus = new NG_TableOrderer('ClientStatus',
                                      {"data"                    : value.client_status,
                                       "paginate"                : false,
                                       "columns"                 : cols,
                                       "singleSelectKeyField"    : "MAC"});
        contentPage.remove("ClientStatus");
        contentPage.add(clientStatus, "ClientStatus", "Client Status", "help/help_advanced_client_status.html");
    }.bind(this);
    this.refresh = function() {
        this.getConfig();
    }.bind(this);
    this.details = function() {
        jObject = contentPage.get("ClientStatus").getSingleSelectData();
        h = 550;
        t = 50;
        w = screen.availWidth/2;  
        l = screen.availWidth/4;
        
        win = window.open("client_status.php?mac="+jObject.MAC,
                          "clientStatus",
                          "width="+w+",height="+h+",top="+t+",left="+l+ 
                          ",scrollbars=no" +
                          ",location=no,menubar=no,toolbar=no");
    }.bind(this);
}

MonitoringRogueAp = function(rapType) {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page(rapType + " Rogue Access Points", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getConfig();

        $("standardButtons").update();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    this.refresh);
        $("standardButtons").insert(refreshBtn);

        exportBtn = new NG_UI_button("btn_export",
                                    "export",
                                    "off",
                                    this.exportList);
        $("standardButtons").insert(exportBtn);
    };

    this.getConfig = function() {
        jObject = {"known" : (rapType == "Known" ? 1 : 0)};
        new ajaxRequest().sendRequest("get_rogue_ap",
                                      Object.toJSON(jObject),
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
    
        value = value.rogue_ap;

        if(value[0].list.length == 0) {
            cols = ["Mac_address", "Ssid", "Channel", "Privacy",
                    "Rate", "Beacon int.", "# of beacons",
                    "Last beacon", "Neighbour access points"];
        } else {
            cols = Object.keys(value[0].list[0]);
        }
        bgRogueApStatus = new NG_TableOrderer(value[0].type,
                                      {"data"     : value[0].list,
                                       "columns"  : cols,
                                       "paginate" : false});
        if(value[1].list.length == 0) {
            cols = ["Mac_address", "Ssid", "Channel", "Privacy",
                    "Rate", "Beacon int.", "# of beacons",
                    "Last beacon", "Neighbour access points"];
        } else {
            cols = Object.keys(value[0].list[1]);
        }
        aRogueApStatus = new NG_TableOrderer(value[1].type,
                                      {"data"     : value[1].list,
                                       "columns"  : cols,
                                       "paginate" : false});

        typeTabbedPan = new NG_UI_tabbedPan("RogueAP")
                .addTab("11g", value[0].type, bgRogueApStatus)
                .addTab("11a", value[1].type, aRogueApStatus);
                
        contentPage.remove("RogueApStatus");
        tmpHelpUrl = "help/help_known_ap_list.html";
        if("Known" != rapType)
            tmpHelpUrl = "help/help_unknown_ap_list.html";
        contentPage.add(typeTabbedPan, "RogueApStatus", rapType + " Rogue Access Points", tmpHelpUrl);
    }.bind(this);
    this.refresh = function() {
        this.getConfig();
    }.bind(this);
    this.exportList = function() {

        typeTab = contentPage.get("RogueApStatus").getSelectedTab();
        list = typeTab.getData();

        ary = new Array();
        for(var i = 0; i < list.length; i++) {
            ary[i] = list[i].mac_address;
        }
        str = ary.toString().gsub(",", "\n");
        postData("download_file.php",
                 "_blank",
                 [{ "name" : "string",   "value" : str},
                  { "name" : "fileName", "value" : rapType + "ApList-" + typeTab.id + ".txt"}]);
    }.bind(this);
}

MonitoringNetworkUsage = function() {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Network Usage", { "width" : "426px" });
        $("contents").update(contentPage);

        this.idEth = "ethernet_frame" + Math.random();
        this.idRadioBg = "radio11bgn_frame" + Math.random();
        this.idRadioA = "radio11an_frame" + Math.random();

        ethFrame = new Element("IFRAME", 
                                      {"id"           : this.idEth,
                                       "name"         : this.idEth,
                                       "src"          : "",
                                       "height"       : "300px",
                                       "width"        : "800px",
                                       "marginheight" : "0px",
                                       "marginwidth"  : "0px",
                                       "frameborder"  : "0",
                                       "vspace"       : "0",
                                       "hspace"       : "0"});

        radio1Frame = new Element("IFRAME", 
                                       {"id"           : this.idRadioBg,
                                        "name"         : this.idRadioBg,
                                        "src"          : "",
                                        "frameborder"  : "0",
                                        "height"       : "300px",
                                        "width"        : "800px"});

        radio2Frame = new Element("IFRAME", 
                                       {"id"           : this.idRadioA,
                                        "name"         : this.idRadioA,
                                        "src"          : "",
                                        "frameborder"  : "0",
                                        "height"       : "300px",
                                        "width"        : "800px"});

        ethLegendTbl = new NG_Legend([{color : "#46008f", "label" : "Average Receive Rate / Access Point"},
                                   {color : "#666f74", "label" : "Average Transmit Rate / Access Point"}]);
        ethLegendTbl.writeAttribute({"align" : "center"});

        radio1LegendTbl = new NG_Legend([{color : "#46008f", "label" : "Average Receive Rate / Access Point"},
                                   {color : "#666f74", "label" : "Average Transmit Rate / Access Point"}]);
        radio1LegendTbl.writeAttribute({"align" : "center"});

        radio2LegendTbl = new NG_Legend([{color : "#46008f", "label" : "Average Receive Rate / Access Point"},
                                   {color : "#666f74", "label" : "Average Transmit Rate / Access Point"}]);
        radio2LegendTbl.writeAttribute({"align" : "center"});


        ethDiv = Element.wrap(ethFrame, "DIV",
                                      {"height" : "300px", "width" : "800px"});
        ethTbl = new NG_Table();
        ethTbl.addCaptionRow(ethDiv);
        row = ethTbl.addCaptionRow(ethLegendTbl);
        row.down().writeAttribute({align : "center"});

        radio1Div = Element.wrap(radio1Frame, "DIV",
                                      {"height" : "300px", "width" : "800px"});
        radio1Tbl = new NG_Table();
        radio1Tbl.addCaptionRow(radio1Div);
        row = radio1Tbl.addCaptionRow(radio1LegendTbl);
        row.down().writeAttribute({align : "center"});

        radio2Div = Element.wrap(radio2Frame, "DIV",
                                      {"height" : "300px", "width" : "800px"});
        radio2Tbl = new NG_Table();
        radio2Tbl.addCaptionRow(radio2Div);
        row = radio2Tbl.addCaptionRow(radio2LegendTbl);
        row.down().writeAttribute({align : "center"});

        contentPage.add(ethTbl,
                        "ethernet", "Ethernet Statistics", "help/help_advanced_network_usage.html");
        contentPage.add(radio1Tbl,
                        "radio11bgn", "Wireless 11b/bg/bn Statistics", "help/help_advanced_network_usage.html");
        contentPage.add(radio2Tbl,
                        "radio11an", "Wireless 11a/an Statistics", "help/help_advanced_network_usage.html");       

        this.getUsage();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh",
                                      "refresh",
                                      "off",
                                      this.refresh);
        buttonPanel.add("refresh", refreshBtn);
    };
    this.refresh = function() {
        this.openPage();
    }.bind(this);
    this.getUsage = function() {
        new ajaxRequest().sendRequest("get_usage",
                                      "",
                                      this.handleGetUsage);
    }.bind(this);

    this.handleGetUsage = function(value) {
        drawChart(window.frames[this.idEth],
                               [value.rx_ethernet, value.tx_ethernet],
                                 {"YScale"   : " Kbps",
                                  "XScale"   : " Hrs",
                                  "title"    : "<b>Network Usage : Ethernet Traffic</b>",
                                   bgColor   : "#EEEEEE",
                                   gridColor : "#cccccc",
                                   fontColor : "#000000"});
         drawChart(window.frames[this.idRadioBg],
                                [value.rx_radio11bgn, value.tx_radio11bgn],
                                 {"YScale"   : " Kbps",
                                  "XScale"   : " Hrs",
                                  "title"    : "<b>Network Usage : Wireless 11b/bg/ng Traffic</b>",
                                   bgColor   : "#EEEEEE",
                                   gridColor : "#cccccc",
                                   fontColor : "#000000"});
         drawChart(window.frames[this.idRadioA],
                                [value.rx_radio11an, value.tx_radio11an],
                                 {"YScale"   : " Kbps",
                                  "XScale"   : " Hrs",
                                  "title"    : "<b>Network Usage : Wireless 11a/an Traffic</b>",
                                   bgColor   : "#EEEEEE",
                                   gridColor : "#cccccc",
                                   fontColor : "#000000"});
    }.bind(this);
}

MonitoringNetworkInfo = function() {

    this.config = null;
    this.chartDiv = new Element("DIV");

    this.openPage = function() {
        contentPage = new NG_UI_page("Topology Map", { "width" : "426px" });
        $("contents").update(contentPage);
        contentPage.add(this.V_Graph(), "NetworkTopology", "Network Topology", "help/help_topology.html");

        this.getConfig();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh",
                                      "refresh",
                                      "off",
                                      this.refresh);
        buttonPanel.add("refresh", refreshBtn);

        applyBtn = new NG_UI_button("btn_apply",
                                      "apply",
                                      "off",
                                      this.applyConfig);
        buttonPanel.add("apply", applyBtn);

        /*exportBtn = new NG_UI_button("btn_export",
                                      "export",
                                      "off",
                                      this.uploadFile);*/
        //buttonPanel.add("export", exportBtn);

        if(userType != "admin") {
            applyBtn.inActivate();
            //exportBtn.inActivate();
        }
    };

    this.refresh = function() {
        this.openPage();
    }.bind(this);

    this.applyConfig = function() {
        new ajaxRequest().sendRequest("set_ap_loc",
                                      Object.toJSON($(this.iFrameId).contentWindow["dataArray"]),
                                      this.handleGetConfig);
        
    }.bind(this);

    this.uploadFile = function() {
        iFrameLoad(fileUploadFrame, this.uploadFileComplete);
        busyBar.show();
        this.uploadFileForm.submit();
    }.bind(this);

    this.uploadFileComplete = function() {
        busyBar.hide();
        jObject = {"location" : "/tmp/wnc.bin"};
        new ajaxRequest().sendRequest("upload_topology_bg",
                                      Object.toJSON(jObject),
                                      this.handleUploadImage);
    }.bind(this);
    this.handleUploadImage = function() {
        $(this.iFrameId).contentWindow["refresh"]();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_topology_map",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.V_Graph = function() {

      	tbl = new NG_ConfTable({"leftColWidth"   : "20%",
                                "rightColWidth"  : "80%"});
      	
      	uploadFile = new NG_FileBox("upgrade_file", "",
                                    {"class" : "required",
                                     "Title" : "Select file to upgrade Access Point"});
        Event.observe(uploadFile, "change", this.uploadFile);
      	this.uploadFileForm = Element.wrap(uploadFile, "FORM",
                                  {"method"   : "post",
                                   "action"   : "file_upload.php",
                                   "target"   : "file_upload_frame",
                                   "encoding" : "multipart/form-data",
                                   "enctype"  : "multipart/form-data"});
        tbl.addRow(["Background image file"], [this.uploadFileForm]);
        tbl.addCaptionRow(this.chartDiv);

		return tbl;
	};

    this.handleGetConfig = function(value) {
         this.iFrameId = "topo_frame" + Math.random();
         this.chartFrame = new Element("IFRAME", 
                                  {"id"           : this.iFrameId,
                                   "name"         : this.iFrameId,
                                   "src"          : "topology.php",
                                   "height"       : "600px",
                                   "width"        : "800px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});
        
        this.chartDiv.update(this.chartFrame);
    }.bind(this);
}

GuestAccessConfig = function() {
    this.dummyFrame = new Element("IFRAME", 
                                  {"id"           : "guestaccess_frame",
                                   "name"         : "guestaccess_frame",
                                   "src"          : "",
                                   "height"       : "0px",
                                   "width"        : "0px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});
    this.openPage = function() {
        contentPage = new NG_UI_page("Guest Access", { "width" : "426px" });
        $("contents").update(contentPage);
        this.getConfig();

        buttonPanel.reset();

        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.uploadFile);
        buttonPanel.add("apply", applyBtn);

        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_guest_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        confForm = Element.wrap(this.V_GuestAccessConfig(value), "form",
                                  {"method"   : "post",
                                   "action"   : "file_upload.php",
                                   "target"   : this.dummyFrame.id,
                                   "encoding" : "multipart/form-data",
                                   "enctype"  : "multipart/form-data"});

        formChangeAction(confForm, function(){
            buttonPanel.get("cancel").enable(true);
        });

        contentPage.remove("GuestAccessConfig");

        contentPage.add(confForm,
                        "GuestAccessConfig",
                        "Guest Access", "help/help_guest_access.html");
        confForm.focusFirstElement();
    }.bind(this);


    this.V_GuestAccessConfig = function(config) {
        tbl = new NG_ConfTable();
        var chkBox = new NG_CheckBox("enable", config.enable)
        Event.observe(chkBox,
                      "click",
                      function(event) {
                          e = Event.element(event);
                          this.urlBox.disabled = !e.checked;
                          this.redirectLocation[0].disabled = !e.checked;
                          this.redirectLocation[2].disabled = !e.checked;
                          this.imgFile = !e.checked;
                      }.bind(this));
                      
        this.urlBox = new NG_TextBox("url", config.url);
        this.redirectLocation = new NG_LocalExternalRadio("redir_location", config.redir_location, function(event) {
            e = Event.element(event);
            enable = (e.value == "1");
            this.urlBox.disabled = !enable;
            this.imgFile.disabled = enable;
            if(!enable) {
                this.urlBox.value = "http://" + window.location.host + "/guest/";
            }
        }.bind(this));

        this.imgFile = new NG_FileBox("upgrade_file", "")

        Event.observe(this.imgFile, "change", function(event) {
            e = Event.element(event);
            this.previewBtn.enable(e.value != "");

        }.bind(this));

        var enable = (config.redir_location == "1");
        this.urlBox.disabled = !enable;
        this.imgFile.disabled = enable;

        tbl.addRow(["Enable"], [chkBox]);
        tbl.addRow(["Redirect Location"], this.redirectLocation);
        tbl.addRow(["URL"], [this.urlBox]);
        tbl.addRow(["Select image file"],
                   [this.imgFile, this.dummyFrame]);
        this.previewBtn = new NG_UI_button("btn_preview", "preview", "off", this.previewFile);
        this.previewBtn.enable(false);
        tbl.addRow(["Preview selected image file"],
                   [this.previewBtn]);

        return tbl;
	};
    this.getConfig = function(value) {
        new ajaxRequest().sendRequest("get_guest_cfg",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.previewWindow = null;
    this.previewFile = function() {
            this.previewWindow = window.open("http://" + window.location.host +
                                             "/guest/preview.html", "_preview",
                                             "width=800,height=600,titlebar=no,"+
                                             "scrollbars=yes,resizable=no,"+
                                             "menubar=no,status=no,location=no,"+
                                             "toolbar=no");
            busyBar.show();
            iFrameLoad(this.dummyFrame, function() {
                this.previewWindow.location.reload();
                busyBar.hide();
            }.bind(this));

            Element.writeAttribute(
                contentPage.get("GuestAccessConfig"),
                {"action" : "guest_access_preview_file_upload.php"});
            contentPage.get("GuestAccessConfig").submit();

    }.bind(this);

    this.uploadFile = function() {
        if(contentPage.get("GuestAccessConfig").upgrade_file.disabled) {
            this.applyConfig();
        } else {
        
            iFrameLoad(this.dummyFrame, this.uploadFileComplete);
            busyBar.show();
            Element.writeAttribute(
                contentPage.get("GuestAccessConfig"),
                {"action" : "file_upload.php"});
            contentPage.get("GuestAccessConfig").submit();
        }
    }.bind(this);

    this.uploadFileComplete = function() {
        busyBar.hide();
        this.hostFile();
    }.bind(this);

    this.hostFile = function(value) {
        new ajaxRequest().sendRequest("upload_guest_bg",
                                      Object.toJSON({ "location" : "/tmp/wnc.bin"}),
                                      this.handleHostFile);
    }.bind(this);

    this.handleHostFile = function(value) {
        this.applyConfig();
    }.bind(this);

    this.applyConfig = function() {
        var form = contentPage.get("GuestAccessConfig");
        new ajaxRequest().sendRequest("set_guest_cfg",
                                      $H(form.serialize(true)).toJSON(),
                                      this.handleApplyConfig);
    }.bind(this);
}

GuestList = function() {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Guest List", { "width" : "426px" });
        $("contents").update(contentPage);

        this.getConfig();

        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh", "refresh", "off", this.refreshAction);
        buttonPanel.add("refresh", refreshBtn);
    };

    this.refreshAction = function() {
        this.openPage();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_guest",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        if (value.length == 0) {
            cols = ["Ip", "Email"];
        } else {
            cols = Object.keys(value[0]);
        }
        guestList = new NG_TableOrderer('GuestList',
                                        {"data" : value,
                                         "columns" : cols});
        contentPage.remove("GuestList");
        contentPage.add(guestList, "GuestList", "Guest List", "help/help_guest_show.html");
    }.bind(this);
}

WncBackup = function() {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Backup settings", { "width" : "426px" });
        $("contents").update(contentPage);

        contentPage.remove("BackupSettings");
        contentPage.add(this.V_Backup(),
                        "BackupSettings",
                        "Backup Settings",
                        "help/help_backup_settings.html");

        $("standardButtons").update();
    };
    this.V_Backup = function() {
        tbl = new NG_ConfTable();
        backupBtn = new NG_UI_button("btn_backup",
                                    "backup",
                                    "on",
                                    this.backupSettings);
        tbl.addRow(["Backup a copy of the current settings to a file"],
                   [backupBtn]);
        return tbl;
	};
	this.backupSettings = function() {
        window.open("backup_settings.php", "_blank"); 
	}.bind(this);
}

WncRestore = function() {
    this.dummyFrame = new Element("IFRAME", 
                                  {"id"           : "restore_frame",
                                   "name"         : "restore_frame",
                                   "src"          : "",
                                   "height"       : "0px",
                                   "width"        : "0px",
                                   "marginheight" : "0px",
                                   "marginwidth"  : "0px",
                                   "scrolling"    : "no",
                                   "frameborder"  : "0",
                                   "vspace"       : "0",
                                   "hspace"       : "0"});
    this.openPage = function() {
        contentPage = new NG_UI_page("Restore Settings", { "width" : "426px" });
        $("contents").update(contentPage);

        uploadForm = Element.wrap(this.V_Upload(), "form",
                                  {"method"   : "post",
                                   "action"   : "file_upload.php",
                                   "target"   : this.dummyFrame.id,
                                   "encoding" : "multipart/form-data",
                                   "enctype"  : "multipart/form-data"});
        contentPage.remove("UploadConfig");
        contentPage.add(uploadForm, "UploadConfig", "Restore Settings", "help/help_restore_settings.html");

        $("standardButtons").update();
        applyBtn = new NG_UI_button("btn_apply",
                                    "apply",
                                    "off",
                                    this.uploadFile);
        $("standardButtons").insert(applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
    };

    this.V_Upload = function() {
        tbl = new NG_ConfTable();
        tbl.addRow(["Restore saved settings from a file"],
                   [new NG_FileBox("upgrade_file", ""), this.dummyFrame]);
        return tbl;
	};

    this.uploadFile = function() {
        iFrameLoad(this.dummyFrame, this.uploadFileComplete);
        busyBar.show();
        contentPage.get("UploadConfig").submit();
    }.bind(this);

    this.uploadFileComplete = function() {
        busyBar.hide();
        this.restore();
    }.bind(this);

    this.restore = function(value) {
        new ajaxRequest().sendRequest("restore_cfg",
                                      Object.toJSON({"location" : "/tmp/wnc.bin"}),
                                      this.handleRestore,
                                      { redirect : "login.php" });
    }.bind(this);

    this.handleRestore = function(value) {
        alert("WMS5316 Rebooting");
    }.bind(this);
}

WncLogs = function() {
    this.config = null;

    this.openPage = function() {
        contentPage = new NG_UI_page("Download Logs", { "width" : "426px" });
        $("contents").update(contentPage);

        contentPage.remove("DownloadLogs");
        contentPage.add(this.V_DownloadLogs(),
                        "DownloadLogs",
                        "Download Logs",
                        "help/help_logs_maintenance.html");

        $("standardButtons").update();
    };
    this.V_DownloadLogs = function() {
        tbl = new NG_ConfTable();
        downloadLogsBtn = new NG_UI_button("btn_backup",
                                    "backup",
                                    "on",
                                    this.downloadLogs);
        tbl.addRow(["Download log files"],
                   [downloadLogsBtn]);
        return tbl;
	};
	this.downloadLogs = function() {
        window.open("download_log.php", "_blank"); 
	}.bind(this);
}

AccessPointPing = function() {
    this.pingResultBox = new NG_TextArea("pingResult",
                                         "",
                                         {"cols"     : "65",
                                          "rows"     : "12",
                                          "readonly" : "readonly",
                                          "wrap"     : "off"})
    this.openPage = function() {
        contentPage = new NG_UI_page("Ping", { "width" : "426px" });

        this.getApList();
        $("contents").update(contentPage);
        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.stopPing);
        buttonPanel.add("cancel", cancelBtn);
        startBtn = new NG_UI_button("btn_start",
                                    "start",
                                    "on",
                                    this.startPing);
        buttonPanel.add("start", startBtn);
        cancelBtn.enable(false);
    };

    this.getApList = function() {
        new ajaxRequest().sendRequest("get_ap_list",
                                      null,
                                      this.handleGetApList);
    }.bind(this);
    this.handleGetApList = function(value) {
        form = Element.wrap(this.V_Ping(value), "form");
        formChangeAction(form, function(){
            buttonPanel.get("cancel").enable(true);
        });
        
        contentPage.add(form,
                        "Ping",
                        "Ping", "help/help_ping.html");
        
        contentPage.add(this.V_PingResult(),
                        "PingResult",
                        "Ping Result", "help/help_ping.html");
    }.bind(this);

    this.V_Ping = function(apList) {
        pingTbl = new NG_ConfTable();
        apIpArray = new Array();
        apIpArray[0] = {"label" : "---Select Access Point---", "value" : ""};
        for(var i = 0; i < apList.length; i++) {
            apIpArray[i + 1] = {"label" : apList[i].name,
                                "value" : apList[i].ip};
        }
        apIpArray[apIpArray.length] = {"label" : "Other IP", "value" : ""};

        apIpCombo = new NG_Combo("IPList", apIpArray);
        ipTextBox = new NG_TextBox("ip",
                                   "",
                                   { "class" : "required validate-ip",
                                     "title" : "Please enter a valid IP Address or Select an Access Point"});
        apIpCombo.ipTextBox = ipTextBox;
        Event.observe(apIpCombo, "change",
                       function(event) {
                           e = Event.element(event);
                           e.ipTextBox.value = getComboSelectedValue(e);
                           e.ipTextBox.disabled = !(e.ipTextBox.value == "");
                       });
        this.ping_id = "";
        pingTbl.addRow(["Ping Count"],
                       [new NG_TextBox("count",
                                       "10",
                                       { "class" : "required validate-digits",
                                          "title" : "Please enter a valid Ping Count"})]);
        pingTbl.addRow(["Access Point"], [apIpCombo]);
        pingTbl.addRow(["IP Address"], [ipTextBox]);
        return pingTbl;
    };

    this.V_PingResult = function() {
        pingResultTbl = new NG_Table();

        pingResultTbl.addCaptionRow(this.pingResultBox);

        return pingResultTbl;
    };

    this.validate = function() {
        form = contentPage.get("Ping");
        this.validation = new Validation(form, {onSubmit:false,
                                                useTitles : true});
        this.validation.reset();
        return this.validation.validate();
    }

    this.startPing = function() {
        if(!this.validate()) return;

        form = contentPage.get("Ping");  
        jHash = $H(form.serialize(true));

        new ajaxRequest().sendRequest("start_ping",
                                      jHash.toJSON(),
                                      this.handleStartPing,
                                      { showBusyBar : false });
    }.bind(this);

    this.handleStartPing = function(value) {
        this.ping_id = value;
        this.pingResultBox.value = "";
        this.periodical_executer = new PeriodicalExecuter(function(pe) {
            jObject = {"id"    : this.ping_id };
            new ajaxRequest().sendRequest("get_ping_results",
                                      Object.toJSON(jObject),
                                      this.handlePingResults,
                                      { showBusyBar : false });
        }.bind(this), 1);
        cancelBtn.enable(true);
        startBtn.enable(false);
    }.bind(this);

    this.handlePingResults = function(value) {
        if (this.ping_id == "") {
            return;
        }
        if (value.status == "failure") {
            this.periodical_executer.stop();
            cancelBtn.enable(false);
            startBtn.enable(true);
        }
        var text = "";
        for (i = 0; i < value.lines.length; ++i) {
            text = text + value.lines[i] + '\n';
        }
        this.pingResultBox.value = text;
        this.pingResultBox.scrollTop = this.pingResultBox.scrollHeight;
        if (value.done == "1") {
            this.stopPing();
        }
    }.bind(this);

    this.stopPing = function() {
        if (this.ping_id != "") {
            this.periodical_executer.stop();
            jObject = {"id"    : this.ping_id };
            new ajaxRequest().sendRequest("stop_ping",
                                      Object.toJSON(jObject),
                                      this.handlePingStop,
                                      { showBusyBar : false });
        }
    }.bind(this);

    this.handlePingStop = function(value) {
        this.ping_id = "";
        cancelBtn.enable(false);
        startBtn.enable(true);
    }.bind(this);
}

ApSyslog = function() {
    this.apHash = null;
    this.openPage = function() {
        contentPage = new NG_UI_page("Access Point Log", { "width" : "426px" });

        this.getApList();
        $("contents").update(contentPage);
        $("standardButtons").update();
        refreshBtn = new NG_UI_button("btn_refresh",
                                    "refresh",
                                    "off",
                                    this.refreshConfig);
        refreshBtn.enable(false);
        $("standardButtons").insert(refreshBtn);
        clearBtn = new NG_UI_button("btn_clear",
                                    "clear",
                                    "off",
                                    this.clearConfig);
        clearBtn.enable(false);
        //$("standardButtons").insert(clearBtn);
        if(userType != "admin") {
            clearBtn.inActivate();
        }
    };
    this.getApList = function() {
        new ajaxRequest().sendRequest("get_ap_list",
                                      null,
                                      this.handleGetApList);
    }.bind(this);

    this.handleGetApList = function(value) {
        contentPage.add(Element.wrap(this.V_ApList(value), "form"),
                        "Syslog",
                        "Access Point Log", "help/help_logs_ap_diagnostics.html");
        
        contentPage.add(this.V_Syslog(""),
                        "SyslogResult",
                        "Access Point System Log", "help/help_logs_ap_diagnostics.html");
    }.bind(this);

    this.V_ApList = function(apList) {
        this.apHash = new Hash();
        for(i = 0; i < apList.length; i++) {
            this.apHash.set(apList[i].ip, apList[i]);
        }

        apListTbl = new NG_ConfTable();
        apIpArray = new Array();
        apIpArray[0] = {"label" : "---Select Access Point---", "value" : ""};
        for(var i = 0; i < apList.length; i++) {
            apIpArray[i + 1] = {"label" : apList[i].name,
                                "value" : apList[i].ip};
        }
        apIpCombo = new NG_Combo("ip", apIpArray);
        Event.observe(apIpCombo, "change", this.getConfig);

        apListTbl.addRow(["Access Point"], [apIpCombo]);
        return apListTbl;
    };

    this.V_Syslog = function(log) {
        syslogTbl = new NG_Table();
        function repl(text) { text = text.replace(/(\r\n|\r|\n)/g, '\n');
                   return text.replace(/([^\n])\n([^\n])/g, "$1\n$2");} 
        log = repl(log);

        syslogTbl.addCaptionRow(new NG_TextArea("syslog",
                                                log,
                                                {"cols"     : "65",
                                                 "rows"     : "12",
                                                 "readonly" : "readonly"}));

        return syslogTbl;
    };

    this.getConfig = function() {
        form = contentPage.get("Syslog");  
        jHash = $H(form.serialize(true));
        ip = jHash.get("ip");
        if(ip == "") {
            refreshBtn.enable(false);
            clearBtn.enable(false);
            return;
        }
        jObject = {"ip"    : ip,
                   "model" : this.apHash.get(jHash.get("ip")).model};
        new ajaxRequest().sendRequest("get_ap_log",
                                      Object.toJSON(jObject),
                                      this.handleGetConfig,
                                      {"url" : "nonjson_request_handler.php"});
    }.bind(this);

    this.handleGetConfig = function(value) {
        contentPage.remove("SyslogResult");

        if (value.substr(0,7) == "success") {
            contentPage.add(this.V_Syslog(value.substr(8)),
                            "SyslogResult",
                            "Access Point System Log", "help/help_logs_ap_diagnostics.html");
        }
        else {
            $('errorBlock').set(value.substr(6));
            contentPage.add(this.V_Syslog(""),
                            "SyslogResult",
                            "Access Point System Log", "help/help_logs_ap_diagnostics.html");
        }
        refreshBtn.enable(true);
        clearBtn.enable(true);

    }.bind(this);

    this.refreshConfig = function() {
        this.getConfig();
    }.bind(this);

    this.clearConfig = function() {
        form = contentPage.get("Syslog");  
        jHash = $H(form.serialize(true));
        ip = jHash.get("ip");
        if(ip == "") return;
        jObject = {"ip"    : ip,
                   "model" : this.apHash.get(jHash.get("ip")).model};
        new ajaxRequest().sendRequest("clear_ap_log",
                                      Object.toJSON(jObject),
                                      this.handleGetConfig,
                                      {"url" : "nonjson_request_handler.php"});
    }.bind(this);
    this.handleClearConfig = function(value) {
        this.getConfig();
    }.bind(this);


}

DiscoveryOui = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Discovery OUI", { "width" : "426px" });

        this.getConfig();
        $("contents").update(contentPage);

        buttonPanel.reset();
        cancelBtn = new NG_UI_button("btn_cancel", "cancel", "off", this.cancelAction);
        buttonPanel.add("cancel", cancelBtn);

        applyBtn = new NG_UI_button("btn_apply", "apply", "off", this.applyConfig);
        buttonPanel.add("apply", applyBtn);
        if(userType != "admin") {
            applyBtn.inActivate();
        }
        cancelBtn.enable(false);
    };

    this.cancelAction = function() {
        this.openPage();
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_disc_oui",
                                      "",
                                      this.handleGetConfig);
    }.bind(this);

    this.handleGetConfig = function(value) {
        contentPage.add(this.V_OuiList(value.disc_oui),
                        "OuiList",
                        "Discovery OUI", "help/help_discovery_oui.html");
    }.bind(this);

     this.V_OuiList = function(ouiList) {
        for(var i = 0; i < ouiList.length; i++) {
            ouiList[i].to_delete = false;
            if(ouiList[i].type == "0") {
                ouiList[i].disabledKeyCol = true;
                ouiList[i].oui_list = ouiList[i].oui + "&nbsp;&nbsp;(Preset)";
            } else {
                ouiList[i].disabledKeyCol = false;
                ouiList[i].oui_list = ouiList[i].oui;
            }
        }
        this.ouiTable = new NG_TableOrderer("",
                                       { "data"              : ouiList,
                                         "paginate"          : false,
                                         "multiSelect"       : "to_delete",
                                         disabledKeyCol      : "disabledKeyCol",
                                         "multiSelectAction" : function() {
                                                                   cancelBtn.enable(true);
                                                               },
                                         "columns"           : ["oui_list"],
                                         "inputRow"          : true} );

        delBtn = new NG_UI_button("btn_delete_small", "delete_small", "on", function() {
            this.ouiTable.deleteSelectedData();
        }.bind(this));
        delBtn.writeAttribute({ "align" : "right"});

        addBtn = new NG_UI_button("btn_delete_small", "add_small", "on", function() {
            d = this.ouiTable.getInputRow();
            var tblData = this.ouiTable.getData();
            $("errorBlock").reset();

            if(!Validation.get("validate-oui").test(d.oui_list)) {
                $("errorBlock").addError("Invalid OUI value");
                return;
            }
            for(var i = 0; i < tblData.length; i++) {
                if(tblData[i].oui.toLowerCase() == d.oui_list.toLowerCase()) {
                    $("errorBlock").addError("OUI already in the list");
                    return;
                }
            }

            d.oui = d.oui_list;
            d.type = "1";
            this.ouiTable.addData([d]);
            cancelBtn.enable(true);
        }.bind(this));
        addBtn.writeAttribute({ "align" : "right"});

        labelRow = new Element("TR");

        t = new Element("TABLE", { width : "100%" });
        b = new Element("TBODY"); t.update(b);
        r = new Element("TR")
                .insert(new Element("TD", { "class" : "font12BoldBlue" }).update("&nbsp;"))
                .insert(new Element("TD", { "style" : "width:57px" }).insert(delBtn))
                .insert(new Element("TD", { "style" : "width:45px" }).insert(addBtn));

        b.insert(r); 
        r = new Element("TR")
                .insert(new Element("TD", { "colspan" : "3" }).update(this.ouiTable));
        b.insert(r); 

        return t;
    }

    this.applyConfig = function() {
        jObject = { "disc_oui" : this.ouiTable.getData() };
        new ajaxRequest().sendRequest("set_disc_oui",
                                      Object.toJSON(jObject),
                                      this.handleApplyConfig);
    }.bind(this);

    this.handleApplyConfig = function(value) {
    }.bind(this);
}

DhcpLease = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("DHCP Lease", { "width" : "426px" });

        $("contents").update(contentPage);

        this.getConfig();
        buttonPanel.reset();
        refreshBtn = new NG_UI_button("btn_refresh", "refresh", "off", this.openPage);
        buttonPanel.add("refresh", refreshBtn);
    }.bind(this);

    this.getConfig = function() {
        new ajaxRequest().sendRequest("get_dhcpd_leases",
                                      null,
                                      this.handleGetConfig);
    }.bind(this);
    this.handleGetConfig = function(value) {
        if(value.leases.length == 0) {
            cols = ["Host name", "Ip", "End time", "End date", "Mac", "Vlan"];
        } else {
            cols = Object.keys(value.leases[0]);
        }

        var tbl = new NG_TableOrderer("", { "data"   : value.leases,
                                            "columns" : cols});
        contentPage.add(tbl, "DHCPLease", "DHCP Lease", "help/help_dhcp_leases.html");
    }.bind(this);
}

Documentation = function() {
    this.openPage = function() {
        contentPage = new NG_UI_page("Documentation", { "width" : "426px" });

        $("contents").update(contentPage);
        buttonPanel.reset();
        docTbl = new NG_Table();
        link = new Element("A", { href : "http://documentation.netgear.com/wms5316/enu/202-10601-01/index.htm",
                                  target : "_blank"})
                          .update("Click here to open product documentation in a new window");
        linkDiv = Element.wrap(link, "DIV", { "class" : ".font12BoldBlue" });
        docTbl.addCaptionRow(linkDiv);
        contentPage.add(docTbl,
                        "Documentation",
                        "Documentation", "");
    }.bind(this);
}
