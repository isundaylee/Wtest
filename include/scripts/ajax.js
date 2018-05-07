ajaxRequest = function() {
    this.options = {
           reqMethod     : "",
           reqString     : "",
           showBusyBar   : true,
           url           : "request_handler.php",
           redirect      : "",
           redirectTime  : 60,
           backgroundReq : false,
           onSuccess     : function() {},
           onInteractive : function() {}
  	};
    
    this.ajaxBusyBar = new NG_ProgressBar().hide();

    this.sendRequest = function(reqMethod, reqString, respHandler, options) {

        //alert("method=" + reqMethod + "\njson=" + reqString);
        this.options = Object.extend(this.options,
                                     { reqString : reqString,
                                       reqMethod : reqMethod,
                                       onSuccess : respHandler});
        this.options = Object.extend(this.options, options || {});

        if($("errorBlock") && !this.options.backgroundReq) $("errorBlock").reset();

        var param = new Hash();
        if(reqMethod != null && reqMethod != undefined) {
            param.set("reqMethod", reqMethod);
        }

        if(reqString != null && reqString != undefined) {
            param.set("jsonData", reqString);
        }

        if(this.options.showBusyBar) {
            this.ajaxBusyBar.show();
            lockGui();
            lockBody();
        }

        new Ajax.Request(this.options.url, {
            "method"        : "post",
            "parameters"    : param,
            "onSuccess"     : this.onSuccess,
            "onFailure"     : this.onFailure,
            "onInteractive" : this.onInteractive
        });
    }.bind(this);

    this.onSuccess = function(transport) {
        if(this.options.showBusyBar && this.options.redirect == "") {
            this.ajaxBusyBar.hide();
            unlockGui();
            unlockBody();
        }
        this.processResp(transport, this.options.onSuccess);
    }.bind(this);

    this.onFailure = function() {
        this.ajaxBusyBar.hide();
        unlockGui();
        unlockBody();
        alert("Connectivity Lost");
        this.options.onFailure();
    }.bind(this);

    this.onInteractive = function(transport) {
        this.processResp(transport, this.options.onInteractive)    }.bind(this);

    this.processResp = function(transport, respCallback) {

        //alert(transport.responseText.isJSON() + " | " + transport.responseText);
        if(!transport.responseText.isJSON()) {
            respCallback(transport.responseText);
            return;
        }

        respObj = transport.responseJSON;

        if(respObj.status != null && respObj.status != undefined &&
            respObj.status == "success") {
            if(this.options.redirect != "") {
                new PeriodicalExecuter( function(pe) {
                    this.ajaxBusyBar.hide();
                    unlockGui();
                    unlockBody();
                    window.open(this.options.redirect, "_self");
                }.bind(this), this.options.redirectTime);
            }
            respCallback(respObj.value);
        } else {
            if (this.options.redirect != "") {
                this.ajaxBusyBar.hide();
                unlockGui();
                unlockBody();
            }
            if(respObj.error != null && respObj.error != undefined) {
                if(respObj.error == "No session exist") {
                    //alert(respObj.error);
                    window.open("login.php", "_self");
                } else {
                    if($("errorBlock")) {
                        $("errorBlock").set(respObj.error); }
                    else {
                        alert(respObj.error);
                    }
                }
            }
        }
    }.bind(this);
    return this;
}
