Object.extend(Array.prototype, {
	removeItem: function(search) {
		for(var i=0;i<this.length;i++) {
			if (this[i] == search) {
				return this.splice(i,1);
			}
		}
	}
});

var menuClass = Class.create({
	data: $H({
		'Configuration': $H({
			"System": $H({
				"Basic":
					[{"text":"General",
                      "func": function(){new WncGeneralSettings().openPage();}},
					 {"text":"Time",
                      "func": function(){ new WncTimeSettings().openPage(); }},
					 {"text":"IP Settings",
                      "func": function(){new WncConfIpSettings().openPage();}},
                     {"text":"VLAN Settings",
                      "func": function(){ new WncVlan().openPage(); }},
					 {"text":"DHCP Server Settings",
                      "func": function(){ new WncConfAddDhcp().openPage(); }}],
				"Advanced":
					[{"text":"Syslog",
                      "func": function(){ new WncSyslogSettings().openPage(); }},
					 {"text":"Discovery OUI",
                      "func": function(){ new DiscoveryOui().openPage(); }}]
			}),
			"Access Point Discovery": $H({
				"Discover Access Point": function() { new Discovery().openPage(); }
			}),
			"Access Point Groups": $H({
				"Basic":
					[{"text":"Managed List",
					  "func": function(){new ManagedApList().openPage();}
					 }],
				"Advanced":
					[{"text":"Groups",
                      "func": function(){new GroupList().openPage();}}]
			}),
			"Wireless": $H({
				"Basic":
					[{"text":"RF Management",
					  "func": function(){new BasicWireless().openPage();}
					 },
					 {"text":"QoS Settings",
					  "func": function(){new QosSettings().openPage();}
					 },
					 {"text":"Load Balancing",
					  "func": function(){new LoadBalancing().openPage();}
					 }
					],
				"Advanced":
					[{"text":"Wireless Settings",
                      "func": function(){new AdvancedWireless().openPage();}},
					 {"text":"QoS Settings",
                      "func": function(){new AdvancedQosSettings().openPage();}},
					 {"text":"Load Balancing",
					  "func": function(){new AdvancedLoadBalancing().openPage();}
					 }]
			}),
			"Security": $H({
				"Basic":
					[{"text":"Profile Settings",
                      "func": function(){new SecurityProfileList().openPage();}},
					 {"text":"Rogue Access Points",
                      "func": function(){new RogueAP().openPage();}},
					 {"text":"Mac Authentication",
                      "func": function(){new MacAcl().openPage();}},
					 {"text":"Radius Server",
                      "func": function(){ new RadiusServer().openPage(); }}],
				"Advanced":
					[{"text":"Profile Settings",
                      "func": function(){new AdvancedSecurityProfileList().openPage();}},
                     {"text":"Mac Authentication",
                      "func": function(){ new AdvancedMacAcl().openPage();}},
					 {"text":"Radius Server",
                      "func": function(){ new AdvancedRadiusServer().openPage(); }}]
			}),
			"Guest Access": $H({
				"Config" : function() { new GuestAccessConfig().openPage(); },
				"Show"   : function() { new GuestList().openPage(); }
			})
		}),

		'Monitoring': $H({
			"Summary": $H({
				"Basic": function(){new MonitoringSummary().openPage();},
				"Advanced":
					[{"text":"Access Point Status",
                      "func": function(){new MonitoringApStatus().openPage();}},
					 {"text":"Client Status",
                      "func":  function(){new MonitoringClientStatus().openPage();}},
					 {"text":"Network Usage",
                      "func": function(){ new MonitoringNetworkUsage().openPage();}},
 					 {"text":"Topology Map",
                       "func": function(){new MonitoringNetworkInfo().openPage()}},
 					 {"text":"DHCP Leases",
                       "func": function(){new DhcpLease().openPage()}}]
			}),
			"Rogue Access Point": $H({
				"Rogue Access Point":
					[{"text":"Unknown",
                      "func": function(){new MonitoringRogueAp("Unknown").openPage();}},
					 {"text":"Known",
                      "func":  function(){new MonitoringRogueAp("Known").openPage();}}]
			})
		}),

		'Maintenance': $H({
			"User Management": $H({
				"User Management": function() {new WncUserMgmt().openPage();}
			}),
			"Password": $H({
				"Password": function() {new WncUserPassword().openPage();}
			}),
			"Reset": $H({
				"System": 
					[{"text":"Reboot",
                      "func": function(){new WncReboot().openPage();}},
					 {"text":"Restore Defaults",
                      "func": function(){new WncRestoreDefault().openPage();}}],
				"Access Points": 
					[{"text":"Reboot",
                      "func": function(){new GroupReboot().openPage();}}]
			}),
			"Remote Management": $H({
				"System": 
					[{"text":"SNMP",
                      "func": function(){new WncSnmpSettings().openPage();}},
					 {"text":"Remote Console",
                      "func": function(){new WncConsoleSettings().openPage();}},
					 {"text":"Session Timeout",
                      "func": function(){new WncSessionTimeout().openPage();}}],
				"Access Points": 
					[{"text":"SNMP",
                      "func": function(){new GroupSnmpSettings().openPage();}},
					 {"text":"Remote Console",
                      "func": function(){new GroupConsoleSettings().openPage();}}]
			}),
			"Upgrade": $H({
				"System Upgrade": function() {new WncUpgrade().openPage();},
				"Access Point Upgrade": function() {new ApUpgrade().openPage();},
				"Backup": function() {new WncBackup().openPage();},
				"Restore Settings": function() {new WncRestore().openPage();}
			}),
			"Logs": $H({
				"Logs": function() {new WncLogs().openPage();}
			})
		}),
		'Diagnostics': $H({
			"Log": $H({
				"System": function() { new WncSyslog().openPage();},
				"Access Point": function() { new ApSyslog().openPage();}
			}),
			"Ping": $H({
				"Ping": function() { new AccessPointPing().openPage();}
			})
		}),
		'Support': $H({
			"Documentation": $H({
				"Documentation": function() { new Documentation().openPage();}
			})
		})
	}),

	initialize: function () {
		this.pointer = {first: 0, second: 0, third: 0, fourth: 0};
		this.currentData = { first: null, second: null, third: null, fourth: [] };
		this.initialLoad = true;
		this.getFirstLevelData();
		//this.updateMenu('first',0);
	},
	updateItem: function(item, value, key) {
		var key = (key == undefined) ? 0 : key;
		switch(item) {
			case 'first':
				this.currentData.first = value;
				break;
			case 'second':
				this.currentData.second = value;
				break;
			case 'third':
				this.currentData.third = value;
				break;
			case 'fourth':
				this.currentData.fourth[key] = value;
				break;
		}
	},
	updatePointer: function(level, value) {
		switch(level) {
			case 'first':
				this.pointer.first = value;
				break;
			case 'second':
				this.pointer.second = value;
				break;
			case 'third':
				this.pointer.third = value;
				break;
			case 'fourth':
				this.pointer.fourth = value;
				break;
		}
	},
	getLevel: function(level,id) {
		switch(level) {
			case 'first':
				return this.currentData.first[id];
				break;
			case 'second':
				return this.currentData.second[id];
				break;
			case 'third':
				return this.currentData.third[id];
				break;
			case 'fourth':
				return this.currentData.fourth[id];
				break;
		}
		return this.first[id];
	},
	getPointer: function(level) {
		switch(level) {
			case 'first':
				return this.pointer.first;
				break;
			case 'second':
				return this.pointer.second;
				break;
			case 'third':
				return this.pointer.third;
				break;
			case 'fourth':
				return this.pointer.fourth;
				break;
		}
	},
	resetPointer: function(level) {
		switch(level) {
			case 'first':
				this.updatePointer('second',0);
				break;
			case 'second':
				this.updatePointer('third',0);
				break;
			case 'third':
				this.updatePointer('fourth',0);
				break;
		}
	},
	getFirstLevelData:  function() {
		this.updateItem('first',this.data.keys());
		this.getSecondLevelData()
	},
	getSecondLevelData: function() {
		var dataValues = this.data.values();
		for (var i=0; i<dataValues.length;i++) {
			if (i == this.getPointer('first')) {
				this.updateItem('second',dataValues[i].keys());
			}
		}
		this.getThirdLevelData();
	},
	getThirdLevelData: function() {
		var dataValues = this.data.values();
		for (var key=0; key<dataValues.length;key++) {
			if (key == this.getPointer('first')) {
				var itemValues = dataValues[key].values();
				for (var key2=0; key2<itemValues.length;key2++) {
					if (key2 == this.getPointer('second')) {
						this.updateItem('third',itemValues[key2].keys());
					}
				}
			}
		}
		this.getFourthLevelData();
	},
	getFourthLevelData: function() {
		var dataValues = this.data.values();
		for (var key=0; key<dataValues.length;key++) {
			if (key == this.getPointer('first')) {
				var itemValues = dataValues[key].values();
				for (var key2=0; key2<itemValues.length;key2++) {
					if (key2 == this.getPointer('second')) {
						var item2Values = itemValues[key2].values();
						for (var key3=0; key3<item2Values.length;key3++) {
							this.updateItem('fourth', item2Values[key3], key3);
						}
					}
				}
			}
		}
	},
	updateMenu: function(level, pointer, start) {
		this.updatePointer(level,pointer);
		switch(level) {
			case 'first':
				this.getFirstLevelData();
				this.updateFirstMenu();
				break;
			case 'second':
				this.getSecondLevelData();
				this.updateSecondMenu();
				break;
			case 'third':
				this.getThirdLevelData();
				this.updateThirdMenu();
				break;
		}

		return;
	},
	updateFirstMenu: function() {
		var primaryTabs = $('primaryNav').immediateDescendants();
		for (var x=0; x< primaryTabs.length; x++) {
			if (this.getPointer('first') == x) {
				primaryTabs[x].replace("<LI class='Active'><A href='#' onclick=\"javascript:menuObject.updateMenu('first',"+x+", false);\">"+this.getLevel('first',x)+"</A></LI>");
			}
			else {
				primaryTabs[x].replace("<LI><A href='#' onclick=\"javascript:menuObject.updateMenu('first',"+x+",false);\">"+this.getLevel('first',x)+"</A></LI>");
			}
		}

		this.updatePointer('second',0);
		this.getSecondLevelData();
		this.updateSecondMenu();
	},
	updateSecondMenu: function() {
		var secondaryTabs = $('secondaryNav').immediateDescendants();
		for (var x=0; x< ((secondaryTabs.length > this.currentData.second.length)?secondaryTabs.length:this.currentData.second.length); x++) {
			var str = "<LI><A href='javascript:void(0)' onclick=\"menuObject.updateMenu('second',"+x+",false);\" ";
			if (this.getPointer('second') == x) {
				str = str + "class='Active'";
			}
			str = str + ">"+this.getLevel('second',x)+"</A>";
			if (this.currentData.second.length != x+1)
				str =  str + '&nbsp;<img src="images/tab_separator.gif" class="separatorImage">&nbsp;';
			str = str + '</LI>';
			if (this.getLevel('second',x)!=undefined) {
				secondaryTabs[x].show();
				secondaryTabs[x].replace(str);
			}
			else {
				secondaryTabs[x].hide();
			}
		}

		this.updatePointer('third',0);
		this.getThirdLevelData();
		this.updateThirdMenu();
	},
	updateThirdMenu: function() {
		var x = 0;
		if($('thirdMenuTable') == undefined)
		{
			this.resetPointer('third');
		}
		this.prepareThirdMenu();
	},
	prepareThirdMenu: function() {
		var thirdMenuTable = $CE('TABLE',{ className: 'tableStyle', id: 'thirdMenuTable' });
		var x = 0, flag = true;
		var thirdTab = this.currentData.third;
		for (var x = 0; x < thirdTab.length; x++) {
			var thirdMenuRow = thirdMenuTable.appendRow({ id: 'TR_Main_'+x });
			var style = '';
			var imgStr = 'right';
			var fourthData = this.getLevel('fourth',x);
			var fourthIsFunction = Object.isFunction(fourthData);


			if (x == this.getPointer('third')) {
				style = "color: #FFA400;";
				imgStr = 'down';
				if(Object.isFunction(fourthData)) fourthData();
			}

			var link;
			link = new Element("A", { "href":"javascript:void(0)", "class":"TertiaryNav", "style":style}).update("<strong>"+thirdTab[x]+"</strong>");

			Event.observe(link, 'click', function(e) { menuObject.updateMenu(arguments[1],arguments[2],arguments[3])}.bindAsEventListener(link, "third", x, false));

			if (fourthIsFunction) {
				flag = false;
				imgStr = 'right';
			}

			thirdMenuRow.appendCell({ id: 'TD_PriArrow_'+x, width: '10px', height: '10px', vAlign: 'top', className: 'padAll noPadRight' }).update('<img src="images/arrow_'+imgStr+'.gif" id="img_Basic" style="border: 0px; margin: 0px; margin-top: 3px; _margin-top: 0px; float: both; vertical-align: middle;">');
			thirdMenuRow.appendCell({ id: 'TD_Main_'+x, colSpan: 2, className: 'padAll noPadLeft' }).update(link);

			if (x == this.getPointer('third')) {
				this.prepareFourthMenu(x, thirdMenuTable);
			}
		}

		try {
			$('TreeFrame').innerHTML = '';
			$('TreeFrame').appendChild(thirdMenuTable);
		}
		catch(e) {
			$('TreeFrame').update(thirdMenuTable.outerHTML);
		}
	},
	prepareFourthMenu: function(level, body) {
		if(!Object.isFunction(this.currentData.fourth[level])) {
			var items = this.currentData.fourth.item(level);
			for (var x=0; x < items.length; x++) {
				var fourthLevelRow = body.appendRow({ id: 'TR_Second_'+level+x });
				str = "";
				if(x == this.getPointer('fourth')){
					str = 'nOrange';
					items[x].func();
				} else {
					str = 'nBlue';
				}

				fourthLevelRow.insert(new Element("TD", { "class" : str, "id" : "TD_Dummy_"+level+x}));
				link = new Element("A", {"href":"javascript:void(0)","class": str, "style":"text-decoration: none;"})
					.update("&raquo;  " + items[x].text);
				Event.observe(link, 'click', function(e) { menuObject.updateFourthMenu(arguments[0], arguments[1])}.bindAsEventListener(link, level));
				fourthLevelRow.insert(new Element("TD",{id: 'TD_Second_'+level+x, "class": "FourthLevelNav fourthLevelLink"}).update(link));
			}
		}

	},
	updateFourthMenu: function(event, level) {
		var x = this.getPointer('third');
		fourthLevelElements = $$(".fourthLevelLink");
		fourthLevelData = this.currentData.fourth.item(level);

		var x;
		for(i = 0; i < fourthLevelElements.length; i++) {
			desc = fourthLevelElements[i].firstDescendant();
			desc.removeClassName("nBlue");
			desc.removeClassName("nOrange");

			if(Event.element(event).innerHTML.include(fourthLevelData[i].text)) {
				x = i;
				desc.addClassName("nOrange");
			} else {
				desc.addClassName("nBlue");
			}
		}
		fourthLevelData[x].func();
	}
});
