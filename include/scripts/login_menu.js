var loginForm = null;
updateMenu = function(pointer) {
	if(pointer == "login") {
		showLogin();
	} else {
		showHelp();
	}
}

function showLogin(){
		$("loginMainMenu").addClassName("Active");
		$("helpMainMenu").removeClassName("Active");
		$("Tree").hide();
		$("secondaryNav").hide();
		
		
        $("contentsLogin").show();
        $("contentMenu").hide();
        $("contents").hide();
}

function showHelp() {
		$("helpMainMenu").addClassName("Active");
		$("loginMainMenu").removeClassName("Active");
		$("Tree").show();
		$("secondaryNav").show();

        $("contentsLogin").hide();
        $("contentMenu").show();
        $("contents").show();
}

function loginTable() {

		tbl = new Element("TABLE", {"class":"BlockContent Trans", "width":"260px"});
		tbody = new Element("TBODY"); tbl.update(tbody);

		row = new Element("TR"); tbody.insert(row);
		unameLabelCell = new Element("TD", {'class': 'DatablockLabel'}).update("User Name");
		row.insert(unameLabelCell);
		unameInputCell = new Element("TD", {'align': 'right'})
            .update(new Element("INPUT", {'id':"user_name",type:"text", name:"user_name", "maxlength" : "31"}));
		row.insert(unameInputCell);

		row = new Element("TR"); tbody.insert(row);
		unameLabelCell = new Element("TD", {'class': 'DatablockLabel'}).update("Password");
		row.insert(unameLabelCell);
		unameInputCell = new Element("TD", {'align': 'right'}).update(new Element("INPUT", {'id':"password",type:"password", name:"password", "maxlength" : "31"}));
		row.insert(unameInputCell);

		row = new Element("TR"); tbody.insert(row);
		loginBtn = new Element("INPUT", { "type" : "image", "src" : "images/login_on.gif"});
		Event.observe(loginBtn, "click", doLogin);

		btnDiv = new Element("DIV",{"width":"100%", "align":"right"}); btnDiv.insert(loginBtn);
		unameLabelCell = new Element("TD", {'class': 'padding5TopBottom10Right', 'colspan':'2'}).update(btnDiv);
		row.insert(unameLabelCell);

		loginForm = new Element("FORM", {"id" : "login_form"}).update(tbl);

		loginTbl = new NG_Title_Wrapper(loginForm, "Login", "help/help_login.html").wrapper;
		loginTblDiv = new Element("DIV", { "id" : "loginTbl"}).update(loginTbl);
        loginTbl.style.width = "260px";		
		loginTblDiv.style.position = 'absolute';
		loginTblDiv.style.top = '50px';

		loginTbl.removeClassName("tableStyle");

		return loginTblDiv;
}

function doLogin() {
		new ajaxRequest().sendRequest("auth_user",
		                              $H($("login_form").serialize(true)).toJSON(),
		                              handleLoginResp);
		return false;

}

function handleLoginResp(value) {
    jHash = $H($("login_form").serialize(true));
    if(value.err == "true") {
        if(confirm("Another admin user session is curently active.\n" +
                   "Do you want to terminate that session?")) {
     		new ajaxRequest().sendRequest("force_auth_user",
                                              jHash.toJSON(),
    	   	                              handleLoginResp);
        }
        return;
    }
    userName = jHash.get("user_name");
    window.open("index.php?user_name="+userName, "_self");
}

function layout()
{
	var footerHeight = 64;
	var headerHeight = 123;
	var rightEdgeWidth = 11;
	var leftEdgeWidth = 11;
	var leftMenuWidth = 155;

	var contentHeight = document.viewport.getHeight() - (footerHeight + headerHeight);
	var contentWidth = document.viewport.getWidth() - (leftEdgeWidth + leftMenuWidth + rightEdgeWidth) - 10;
	var contentBodyWidth = contentWidth - 10;
	var footerPosition = document.viewport.getHeight() - footerHeight;
	var rightEdgePosition = document.viewport.getWidth() - rightEdgeWidth;

	$('headerMain').style.width          = document.viewport.getWidth() + 'px';
	$('footerMain').style.width          = document.viewport.getWidth() + 'px';

	$('contentRightEdge').style.left     = rightEdgePosition + 'px';
	$('contentMenu').style.height        = contentHeight + 'px';
	$('contentRightEdge').style.height   = contentHeight + 'px';
	$('contentLeftEdge').style.height    = contentHeight + 'px';

	$('contents').style.height           = contentHeight + 'px';
	$('contents').style.width            = contentWidth + 'px';

    var contentsLoginWidth = document.viewport.getWidth() - (leftEdgeWidth + rightEdgeWidth);
	$('contentsLogin').style.width           = contentsLoginWidth + 'px';
	$('contentsLogin').style.height          = contentHeight + 'px';

	l = (contentsLoginWidth - 260)/2;
	$('loginTbl').style.left = l + 'px';


	$('footerMain').style.top            = footerPosition + 'px';
	$('footerMain').style.bottomMargin   = '0px';
}

Event.onDOMReady ( function() {
    // add login page
	$("contentsLogin").update(loginTable());
   
    // add help page
    contentPage = new NG_UI_page("Help");
	doc = new Element("DIV", {width:"100%"}).update("<A href='#'>Click here to open product documentation in a new window</A>");
	contentPage.add(doc, "Documentation", "Documentation", "");
	$('contents').style.paddingLeft = '10px';

	$("contents").update(contentPage);

    $("login_form").focusFirstElement();

	layout();
	updateMenu("login");
    window.onresize = layout;
});

ajaxRequest = function() {
	this.respHandler = null;
	this.sendRequest = function(reqMethod, reqString, respHandler) {
		this.respHandler = respHandler;
		var param = new Hash();
		//alert("method:"+reqMethod+"\n"+"json:"+reqString);
		if(reqMethod != null && reqMethod != undefined) {
			param.set("reqMethod", reqMethod);
		}

		if(reqString != null && reqString != undefined) {
			param.set("jsonData", reqString);
		}

		new Ajax.Request("login_handler.php", {
			"method": "post",
			"parameters": param,
			"onSuccess": this.commonRespHandler,
			"onFailure": function() {
				alert("There was an error with the connection, Please try again!");
			}
		});
	}

	this.commonRespHandler = function(transport) {
		//alert(transport.responseText);
        respObj = transport.responseText.evalJSON();
		
		if(respObj.status != null && respObj.status != undefined &&
			respObj.status == "success") {
			this.respHandler(respObj.value);
		} else {
			if(respObj.error != null && respObj.error != undefined) {
				alert("Error: " + respObj.error);
			}
		}
	}.bind(this);

	return this;
}

