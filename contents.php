		<table id="bodyContainer">
			<tr>
				<td class="font15Bold">Wireless Settings&nbsp;</td>
			</tr>

			<tr>
				<td class="spacerHeight9" style="text-align: center;" align="center">
					<table id="errorMessageBlock" align="center" style="margin: 4px auto 10px auto; display: none;">
						<tr>
							<td style="padding: 5px; vertical-align: top;"><img src="images/alert.gif" style="border: 0px; padding: 0px; margin: 0px;"></td>
							<td style="padding: 5px 5px 5px 0px; vertical-align: middle;"><b id="br_head">Please address the fields highlighted!</b></td>
						</tr>
						<tr>

							<td style="padding: 0px; vertical-align: top;"></td>
							<td style="padding: 0px 5px 5px 0px; text-align: left;"></td>
						</tr>
					</table>
				</td>
			</tr>
							<tr>
		<td>
			<table class="tableStyle">

				<tr>
					<td colspan="3"><script>tbhdr('Wireless Settings','radioSettings')</script></td>
				</tr>
				<tr>
					<td class="subSectionBodyDot">&nbsp;</td>
					<td class="spacer100Percent paddingsubSectionBody" style="padding: 0px;">
						<table class="tableStyle">
						<tr>

							<td>
								<div  id="WirelessBlock">
									<table class="inlineBlockContent" style="margin-top: 10px; width: 100%;">
										<tr>
											<td>
												<ul class="inlineTabs">
																											<li id="inlineTab1" class="Active" activeRadio="true" currentId="1"><a id="inlineTabLink1" href="javascript:void(0)">802.11<span class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'><b class="RadioText">b</b></span>/<span class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'><b class="RadioText">bg</b></span>/<span class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'><b class="RadioTextActive">ng<img src="../images/activeRadio.gif"><span>Radio is set to 'ON'</span></b></span></a></li>

																																								<li id="inlineTab2" class="Active" activeRadio="true" currentId="2"><a id="inlineTabLink2" href="javascript:void(0)">802.11<span class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'><b class="RadioText">a</b></span>/<span class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'><b class="RadioTextActive">na<img src="../images/activeRadio.gif"><span>Radio is set to 'ON'</span></b></span></a></li>
																									</ul>
											</td>
										</tr>
									</table>
								</div>

								<div id="IncludeTabBlock">
								<input type="hidden" name="activeMode" id="activeMode" value="">
								<input type="hidden" name="currentMode" id="currentMode" value="">
                                <input type="hidden" name="previousInterfaceNum" id="previousInterfaceNum">
										<div  class="BlockContent" id="wlan1">
										<table class="BlockContent Trans" id="table_wlan1">
											<tr class="Gray">
												<td class="DatablockLabel" style="width: 1%;">Wireless Mode</td>

												<td class="DatablockContent" style="width: 100%;">
													<span class="legendActive">2.4GHz Band</span>
													<input type="radio" style="padding: 2px;" name="WirelessMode1" id="WirelessMode1"  value="0"><span id="mode_b" >11b</span>
													<input type="radio" style="padding: 2px;" name="WirelessMode1" id="WirelessMode1"  value="1"><span id="mode_bg" >11bg</span>
													<input type="radio" style="padding: 2px;" name="WirelessMode1" id="WirelessMode1" checked="checked" value="2"><span id="mode_ng" class="Active" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'>11ng<img src="../images/activeRadio.gif"><span>Radio is set to 'ON'</span></span>													<input type="hidden" name="system['wlanSettings']['wlanSettingTable']['wlan0']['operateMode']" id="activeMode0" value="2">
													<input type="hidden" name="radioStatus0" id="radioStatus0" value="1">

																									<input type="hidden" name="modeWlan0" id="modeWlan0" value="">
												</td>
											</tr>
																																	<tr id="radioRow1" >
				<td class="DatablockLabel" >Turn Radio On</td>
				<td class="DatablockContent"><input type='checkbox'  name="cb_chkRadio0" id="cb_chkRadio0" label="Turn Radio On" onclick="$('chkRadio0').value=(this.checked)?'1':'0';setActiveContent();" value="1" checked = 'checked'><input type='hidden'  name="system['wlanSettings']['wlanSettingTable']['wlan0']['radioStatus']" id="chkRadio0" class=" input" onkeydown="setActiveContent();" value="1"></td>
			</tr>
																					<tr  >

				<td class="DatablockLabel" >Wireless Network Name (SSID)</td>
				<td class="DatablockContent"><input type='text'  name="system['vapSettings']['vapSettingTable']['wlan0']['vap0']['ssid']" id="wirelessSSID0" class=" input" label="Wireless Network Name (SSID)" maxlength="32" onkeydown="setActiveContent();" validate="Presence, {allowSpace: true,allowTrimmed: false}^Length, { minimum: 2, maximum: 32 }" value="NETGEAR_11g"></td>
			</tr>

																						<tr  >
				<td class="DatablockLabel" >Broadcast Wireless Network Name (SSID)</td>
				<td class="DatablockContent"><table class="tableStyle" cellspacing="0" cellpadding="0"><tr><td class="spacer5Percent" style="padding: 0px;"><input type='radio' name="system['vapSettings']['vapSettingTable']['wlan0']['vap0']['hideNetworkName']" id="idbroadcastSSID1" label="Broadcast Wireless Network Name (SSID)" onclick="setActiveContent();" value="0" checked = 'checked'></td><td class="spacer20Percent" style="padding: 0px; padding-right: 14px;">Yes</td><td class="spacer5Percent" style="padding: 0px;"><input type='radio' name="system['vapSettings']['vapSettingTable']['wlan0']['vap0']['hideNetworkName']" id="idbroadcastSSID1" label="Broadcast Wireless Network Name (SSID)" onclick="setActiveContent();" value="1"></td><td class="spacer80Percent" style="padding: 0px; padding-right: 14px;">No</td></tr></table></td>
			</tr>

											<tr  >
				<td class="DatablockLabel" >Channel / Frequency</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['channel']" id="ChannelList1" class="select " label="Channel / Frequency" onchange="setActiveContent();checkWDSStatus(this,'0');">
<option value="0">Auto</option><option value="1">1/2.412GHz</option><option value="2">2/2.417GHz</option><option value="3">3/2.422GHz</option><option value="4">4/2.427GHz</option><option value="5">5/2.432GHz</option><option value="6" selected="selected">6/2.437GHz</option><option value="7">7/2.442GHz</option><option value="8">8/2.447GHz</option><option value="9">9/2.452GHz</option><option value="10">10/2.457GHz</option><option value="11">11/2.462GHz</option></select>

</td>
			</tr>

											<tr id="datarate11n1" >
				<td class="DatablockLabel" >Data Rate</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['dataRate']" id="DatarateList1" class="select " label="Data Rate" onchange="setActiveContent();">
</select>
</td>
			</tr>
																					<tr id="mcsrate11n1" >

				<td class="DatablockLabel" id="mcsrateLabel">MCS Index / Data Rate</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['mcsRate']" id="MCSrateList1" class="select " label="MCS Index / Data Rate" onchange="setActiveContent();">
<option value="99" selected="selected">Best</option><option value="0">0 / 7.2 Mbps</option><option value="1">1 / 14.4 Mbps</option><option value="2">2 / 21.7 Mbps</option><option value="3">3 / 28.9 Mbps</option><option value="4">4 / 43.3 Mbps</option><option value="5">5 / 57.8 Mbps</option><option value="6">6 / 65 Mbps</option><option value="7">7 / 72.2 Mbps</option><option value="8">8 / 14.44 Mbps</option><option value="9">9 / 28.88 Mbps</option><option value="10">10 / 43.33 Mbps</option><option value="11">11 / 57.77 Mbps</option><option value="12">12 / 86.66 Mbps</option><option value="13">13 / 115.56 Mbps</option><option value="14">14 / 130 Mbps</option><option value="15">15 / 144.44 Mbps</option></select>

</td>
			</tr>
                                            											<tr id="bandwidth11n1" >
				<td class="DatablockLabel" >Channel Width</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['channelWidth']" id="Bandwidth1" class="select " label="Channel Width" onchange="setActiveContent();DispChannelList(1,$('activeMode0').value);">
<option value="2">Dynamic 20/40 MHz</option><option value="0" selected="selected">20 MHz</option><option value="1">40 MHz</option></select>
</td>
			</tr>

											<tr id="gi11n1" >
				<td class="DatablockLabel" >Guard Interval</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['guardInterval']" id="GI1" class="select " label="Guard Interval" onchange="setActiveContent();DispChannelList(1,$('activeMode0').value);">
<option value="0" selected="selected">Auto</option><option value="800">Long - 800 ns</option></select>
</td>
			</tr>
																					<tr  >
				<td class="DatablockLabel" >Output Power</td>

				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan0']['txPower']" id="PowerList1" class="select " label="Output Power" onchange="setActiveContent();">
<option value="0" selected="selected">Full</option><option value="1">Half</option><option value="2">Quarter</option><option value="3">Eighth</option><option value="4">Minimum</option></select>
</td>
			</tr>
																				</table>
									</div>
										<div  class="BlockContent" id="wlan2">

										<table class="BlockContent Trans" id="table_wlan2">
											<tr class="Gray">
												<td class="DatablockLabel" style="width: 1%;">Wireless Mode</td>
												<td class="DatablockContent" style="width: 100%;">
													<span class="legendActive">5GHz Band</span>
													<input type="radio" style="padding: 2px;" name="WirelessMode2" id="WirelessMode2"  value="3"><span id="mode_a" >11a</span>
													<input type="radio" style="padding: 2px;" name="WirelessMode2" id="WirelessMode2" checked="checked" value="4"><span id="mode_na" class="Active" id="radioAct" onmouseover='showLayer(this);' onmouseout='hideLayer(this);'>11na<img src="../images/activeRadio.gif"><span>Radio is set to 'ON'</span></span>													<input type="hidden" name="system['wlanSettings']['wlanSettingTable']['wlan1']['operateMode']" id="activeMode1" value="4">

													<input type="hidden" name="radioStatus1" id="radioStatus1" value="1">
																									<input type="hidden" name="modeWlan1" id="modeWlan1" value="4">
												</td>
											</tr>

																						                                                                                                                                        											<tr id="radioRow2" >
				<td class="DatablockLabel" >Turn Radio On</td>
				<td class="DatablockContent"><input type='checkbox'  name="cb_chkRadio1" id="cb_chkRadio1" label="Turn Radio On" onclick="$('chkRadio1').value=(this.checked)?'1':'0';setActiveContent();" value="1" checked = 'checked'><input type='hidden'  name="system['wlanSettings']['wlanSettingTable']['wlan1']['radioStatus']" id="chkRadio1" class=" input" onkeydown="setActiveContent();" value="1"></td>
			</tr>

											<tr  >
				<td class="DatablockLabel" >Wireless Network Name (SSID)</td>
				<td class="DatablockContent"><input type='text'  name="system['vapSettings']['vapSettingTable']['wlan1']['vap0']['ssid']" id="wirelessSSID1" class=" input" label="Wireless Network Name (SSID)" maxlength="32" onkeydown="setActiveContent();" validate="Presence, {allowSpace: true,  allowTrimmed: false}^Length, { minimum: 2, maximum: 32 }" value="NETGEAR_11a"></td>
			</tr>

																						<tr  >
				<td class="DatablockLabel" >Broadcast Wireless Network Name (SSID)</td>
				<td class="DatablockContent"><table class="tableStyle" cellspacing="0" cellpadding="0"><tr><td class="spacer5Percent" style="padding: 0px;"><input type='radio' name="system['vapSettings']['vapSettingTable']['wlan1']['vap0']['hideNetworkName']" id="idbroadcastSSID1" label="Broadcast Wireless Network Name (SSID)" onclick="setActiveContent();" value="0" checked = 'checked'></td><td class="spacer20Percent" style="padding: 0px; padding-right: 14px;">Yes</td><td class="spacer5Percent" style="padding: 0px;"><input type='radio' name="system['vapSettings']['vapSettingTable']['wlan1']['vap0']['hideNetworkName']" id="idbroadcastSSID1" label="Broadcast Wireless Network Name (SSID)" onclick="setActiveContent();" value="1"></td><td class="spacer80Percent" style="padding: 0px; padding-right: 14px;">No</td></tr></table></td>

			</tr>

											<tr  >
				<td class="DatablockLabel" >Channel / Frequency</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['channel']" id="ChannelList2" class="select " label="Channel / Frequency" onchange="setActiveContent();checkWDSStatus(this,'1');">
<option value="0" selected="selected">Auto</option><option value="36">36/5.180GHz</option><option value="40">40/5.200GHz</option><option value="44">44/5.220GHz</option><option value="48">48/5.240GHz</option><option value="149">149/5.745GHz</option><option value="153">153/5.765GHz</option><option value="157">157/5.785GHz</option><option value="161">161/5.805GHz</option></select>

</td>
			</tr>

											<tr id="datarate11n2" >
				<td class="DatablockLabel" >Data Rate</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['dataRate']" id="DatarateList2" class="select " label="Data Rate" onchange="setActiveContent();">
</select>
</td>
			</tr>
																					<tr id="mcsrate11n2" >

				<td class="DatablockLabel" id="mcsrateLabel">MCS Index / Data Rate</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['mcsRate']" id="MCSrateList2" class="select " label="MCS Index / Data Rate" onchange="setActiveContent();">
<option value="99" selected="selected">Best</option><option value="0">0 / 15 Mbps</option><option value="1">1 / 30 Mbps</option><option value="2">2 / 45 Mbps</option><option value="3">3 / 60 Mbps</option><option value="4">4 / 90 Mbps</option><option value="5">5 / 120 Mbps</option><option value="6">6 / 135 Mbps</option><option value="7">7 / 150 Mbps</option><option value="8">8 / 30 Mbps</option><option value="9">9 / 60 Mbps</option><option value="10">10 / 90 Mbps</option><option value="11">11 / 120 Mbps</option><option value="12">12 / 180 Mbps</option><option value="13">13 / 240 Mbps</option><option value="14">14 / 270 Mbps</option><option value="15">15 / 300 Mbps</option></select>

</td>
			</tr>
                                            											<tr id="bandwidth11n2" >
				<td class="DatablockLabel" >Channel Width</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['channelWidth']" id="Bandwidth2" class="select " label="Channel Width" onchange="setActiveContent();DispChannelList(2,$('activeMode1').value);">
<option value="2" selected="selected">Dynamic 20/40 MHz</option><option value="0">20 MHz</option><option value="1">40 MHz</option></select>
</td>
			</tr>

											<tr id="gi11n2" >
				<td class="DatablockLabel" >Guard Interval</td>
				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['guardInterval']" id="GI2" class="select " label="Guard Interval" onchange="setActiveContent();DispChannelList(2,$('activeMode1').value);">
<option value="0" selected="selected">Auto</option><option value="800">Long - 800 ns</option></select>
</td>
			</tr>
																					<tr  >
				<td class="DatablockLabel" >Output Power</td>

				<td class="DatablockContent"><select name="system['wlanSettings']['wlanSettingTable']['wlan1']['txPower']" id="PowerList2" class="select " label="Output Power" onchange="setActiveContent();">
<option value="0" selected="selected">Full</option><option value="1">Half</option><option value="2">Quarter</option><option value="3">Eighth</option><option value="4">Minimum</option></select>
</td>
			</tr>
										</table>
									</div>
								</div>

							</td>
						</tr>
						</table>
					</td>
					<td class="subSectionBodyDotRight">&nbsp;</td>
				</tr>
				<tr>
					<td colspan="3" class="subSectionBottom">&nbsp;</td>
				</tr>

			</table>
		</td>
	</tr>
	</table>
