/**************************
 *   Securtity Settings
 **************************/


viewOpenSystem = function(index) {
    tbl = new NG_ConfTable({"leftColWidth"   : "50%",
                            "rightColWidth"  : "50%"});

    encrCombo = NG_Combo("encr", DataEnc[index]);
    tbl.addRow(["Data Encryption"], [encrCombo]);
    Event.observe(encrCombo, "change", encrComboChange);
    tbl.addRow(["Key 1&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "1", "checked" : "checked"})],
                 [new Element("INPUT", {"id" : "key_1", "name" : "key_1", "type" : "password", "maxlength" : "32"})]).hide();
    tbl.addRow(["Key 2&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "2"})],
                 [new Element("INPUT", {"id" : "key_2", "name" : "key_2", "type" : "password", "maxlength" : "32"})]).hide();
    tbl.addRow(["Key 3&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "3"})],
                 [new Element("INPUT", {"id" : "key_3", "name" : "key_3", "type" : "password", "maxlength" : "32"})]).hide();
    tbl.addRow(["Key 4&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "4"})],
                 [new Element("INPUT", {"id" : "key_4", "name" : "key_4", "type" : "password", "maxlength" : "32"})]).hide();

    tbl.addRow(["Wireless Client Security Separation"], [new NG_EnableDisableCombo("client_seperation")]);

    return tbl;
}
setOpenSystem = function(tbl, value) {
    rows = tbl.down().immediateDescendants();
    rows[0].immediateDescendants()[1].firstDescendant().selectedIndex = getDataEncIndex(getAuthTypeIndex(value.auth), value.encr);
    encrComboChangeAction(rows[0].immediateDescendants()[1].firstDescendant());
    Event.observe(rows[0].immediateDescendants()[1].firstDescendant(), "change", encrComboChange);

    rows[1].immediateDescendants()[1].firstDescendant().selectedIndex = value.client_seperation;
    if((value.encr == 64) || (value.encr == 128) || (value.encr == 152)) {
        rows[1].immediateDescendants()[1].firstDescendant().value = value.key_1;
        rows[2].immediateDescendants()[1].firstDescendant().value = value.key_2;
        rows[3].immediateDescendants()[1].firstDescendant().value = value.key_3;
        rows[4].immediateDescendants()[1].firstDescendant().value = value.key_4;
        rows[1].show();
        rows[2].show();
        rows[3].show();
        rows[4].show();
    }
    rows[1].immediateDescendants()[0].firstDescendant().checked = true;
    rows[1].immediateDescendants()[0].firstDescendant().defaultChecked = true;
    for(i = 1; i <= 4; i++) {
        if(value.key_idx == i) {
            rows[i].immediateDescendants()[0].firstDescendant().checked = true;
            rows[i].immediateDescendants()[0].firstDescendant().defaultChecked = true;
        }
    }
    rows[5].immediateDescendants()[1].firstDescendant().selectedIndex = value.client_seperation;
}

encrComboChange = function(event) {
    encrCombo = Event.element(event);
    encrComboChangeAction(encrCombo);
}
encrComboChangeAction = function(encrCombo) {
    rows = encrCombo.parentNode.parentNode.parentNode.immediateDescendants();
    if(encrCombo.options[encrCombo.selectedIndex].value == 64 ||
       encrCombo.options[encrCombo.selectedIndex].value == 128 ||
       encrCombo.options[encrCombo.selectedIndex].value == 152) {
        rows[1].show();
        rows[2].show();
        rows[3].show();
        rows[4].show();
    } else {
        rows[1].hide();
        rows[2].hide();
        rows[3].hide();
        rows[4].hide();
    }
}

viewSharedKey = function(index) {
    tbl = new NG_ConfTable({"leftColWidth"   : "50%",
                            "rightColWidth"  : "50%"});

    tbl.addRow(["Data Encryption"], [NG_Combo("encr", DataEnc[index])]);
    tbl.addRow(["Key 1&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "1", "checked" : "checked"})],
               [new Element("INPUT", {"id" : "key_1", "name" : "key_1", "type" : "password", "maxlength" : "32"})]);
    tbl.addRow(["Key 2&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "2"})],
               [new Element("INPUT", {"id" : "key_2", "name" : "key_2", "type" : "password", "maxlength" : "32"})]);
    tbl.addRow(["Key 3&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "3"})],
               [new Element("INPUT", {"id" : "key_3", "name" : "key_3", "type" : "password", "maxlength" : "32"})]);
    tbl.addRow(["Key 4&nbsp;&nbsp;", new Element("INPUT", {"type" : "radio", "name" : "key_idx", "value" : "4"})],
               [new Element("INPUT", {"id" : "key_4", "name" : "key_4", "type" : "password", "maxlength" : "32"})]);
    tbl.addRow(["Wireless Client Security Separation"],
               [new NG_EnableDisableCombo("client_seperation")]);

    return tbl;
}
setSharedKey = function(tbl, value) {
    rows = tbl.immediateDescendants()[tbl.immediateDescendants().length - 1].immediateDescendants();
    rows[0].immediateDescendants()[1].firstDescendant().selectedIndex = getDataEncIndex(getAuthTypeIndex(value.auth), value.encr);
    rows[1].immediateDescendants()[1].firstDescendant().value = value.key_1;
    rows[2].immediateDescendants()[1].firstDescendant().value = value.key_2;
    rows[3].immediateDescendants()[1].firstDescendant().value = value.key_3;
    rows[4].immediateDescendants()[1].firstDescendant().value = value.key_4;

    for(i = 1; i <= 4; i++) {
        if(value.key_idx == i) {
            rows[i].immediateDescendants()[0].firstDescendant().checked = true;
            rows[i].immediateDescendants()[0].firstDescendant().defaultChecked = true;
        }
    }

    rows[5].immediateDescendants()[1].firstDescendant().selectedIndex = value.client_seperation;
}

viewLegacy8021X = function(index) {
    tbl = new NG_ConfTable({"leftColWidth"   : "50%",
                            "rightColWidth"  : "50%"});


    encrIndex = DataEnc[index];
    encrCombo = new NG_Combo("encr", encrIndex);
    tbl.addRow(["Data Encryption"], [encrCombo]);
    tbl.addRow(["Wireless Client Security Separation"], [new NG_EnableDisableCombo("client_seperation")]);
    return tbl;
}
setLegacy8021X = function(tbl, value) {
    rows = tbl.immediateDescendants()[tbl.immediateDescendants().length - 1].immediateDescendants();
    rows[0].immediateDescendants()[1].firstDescendant().selectedIndex = getDataEncIndex(getAuthTypeIndex(value.auth), value.encr);
    Event.observe(rows[0].immediateDescendants()[1].firstDescendant(), "change", encrComboChange);
    rows[1].immediateDescendants()[1].firstDescendant().selectedIndex = value.client_seperation;
}

viewWPAPSK = function(index) {
    tbl = new NG_ConfTable({"leftColWidth"   : "50%",
                            "rightColWidth"  : "50%"});

    tbl.addRow(["Data Encryption"], [NG_Combo("encr", DataEnc[index])]);
    tbl.addRow(["WPA Passphrase (Network Key)"],
               [new Element("INPUT", {"id" : "wpa_passphrase", "name" : "wpa_passphrase", "type" : "password", "maxlength" : "63"})]);
    tbl.addRow(["Wireless Client Security Separation"], [new NG_EnableDisableCombo("client_seperation")]);
    return tbl;
}
setWPAPSK = function(tbl, value) {
    rows = tbl.immediateDescendants()[tbl.immediateDescendants().length - 1]
        .immediateDescendants();
    rows[0].immediateDescendants()[1].firstDescendant().selectedIndex =
        getDataEncIndex(getAuthTypeIndex(value.auth), value.encr);
    rows[1].immediateDescendants()[1].firstDescendant().value =
        value.wpa_passphrase;
    rows[2].immediateDescendants()[1].firstDescendant().selectedIndex =
        value.client_seperation;
}

NetworkAuthTypeList = [
    {"label" : "Open System", "value" : "0"},
    {"label" : "Shared Key", "value" : "1"},
    {"label" : "Legacy 802.1X", "value" : "2"},
    {"label" : "WPA with Radius", "value" : "4"},
    {"label" : "WPA2 with Radius", "value" : "8"},
    {"label" : "WPA & WPA2 with Radius", "value" : "12"},
    {"label" : "WPA-PSK", "value" : "16"},
    {"label" :"WPA2-PSK", "value" : "32"},
    {"label" :"WPA-PSK & WPA2-PSK", "value" : "48"}
];
getAuthTypeIndex = function(authType) {
    for(i = 0; i < NetworkAuthTypeList.length; i++) {
        if(authType == NetworkAuthTypeList[i].value) {
            return i;
        }
    }

}
getAuthTypeLabelByValue = function(authType) {
    for(i = 0; i < NetworkAuthTypeList.length; i++) {
        if(authType == NetworkAuthTypeList[i].value) {
            return NetworkAuthTypeList[i].label;
        }
    }
}

getDataEncIndex = function(authIndex, enc) {
    for(i = 0; i < DataEnc[authIndex].length; i++) {
        if(enc == DataEnc[authIndex][i].value) {
            return i;
        }
    }
}

DataEnc = [
    [{"label" : "None", "value" : "0"},
     {"label" : "64 bit WEP", "value" : "64"},
     {"label" : "128 bit WEP", "value" : "128"},
     {"label" : "152 bit WEP", "value" : "152"}],    //Open System
    [{"label" : "64 bit WEP", "value" : "64"},
     {"label" : "128 bit WEP", "value" : "128"},
     {"label" : "152 bit WEP", "value" : "152"}],    //Shared Key
    [{"label" : "None", "value" : "0"}],           //Legacy 802.1X
    [{"label" : "TKIP", "value" : "2"},
     {"label" : "TKIP + AES",  "value" : "6"}],    //WPA with Radius
    [{"label" : "AES", "value" : "4"},
     {"label" : "TKIP + AES", "value" : "6"}],     //WPA2 with Radius
    [{"label" : "TKIP + AES", "value" : "6"}],     //WPA & WPA2 with Radius
    [{"label" : "TKIP", "value" : "2"},
     {"label" : "TKIP + AES",  "value" : "6"}],    //WPA-PSK
    [{"label" : "AES", "value" : "4"},
     {"label" : "TKIP + AES",  "value" : "6"}],    //WPA2-PSK
    [{"label" : "TKIP + AES", "value" : "6"}]      //WPA2-PSK & WPA2-PSK
];

getDataEncViewArray = function() {
return [
    viewOpenSystem(0),
    viewSharedKey(1),
    viewLegacy8021X(2),  //viewLegacy8021X
    viewLegacy8021X(3),  //viewWPAwithRadius
    viewLegacy8021X(4),  //viewWPA2withRadius
    viewLegacy8021X(5),  //viewWPAWPA2withRadius
    viewWPAPSK(6),
    viewWPAPSK(7),       //viewWPA2PSK
    viewWPAPSK(8)];      //viewWPA2PSKWPA2PSK
}
DataEncSetFunctionArray = [
    setOpenSystem,
    setSharedKey,
    setLegacy8021X,
    setLegacy8021X,          //setWPAwithRadius
    setLegacy8021X,          //setWPA2withRadius
    setLegacy8021X,          //setWPAWPA2withRadius
    setWPAPSK,
    setWPAPSK,              //setWPA2PSK
    setWPAPSK];               //setWPA2PSKWPA2PSK

