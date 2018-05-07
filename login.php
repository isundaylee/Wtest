<?php
    include("common.php"); 
    session_start();
    session_id(rand());
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<script type="text/javascript" src="include/scripts/prototype.js"></script>
<script type="text/javascript" src="include/scripts/prototype-ext.js"></script>
<script type="text/javascript" src="include/scripts/browser-ext.js"></script>
<script type="text/javascript" src="include/scripts/ng.js"></script>
<script type="text/javascript" src="include/scripts/ui_components.js"></script>
<script type="text/javascript" src="include/scripts/login_menu.js"></script>
<script type="text/javascript" src="include/scripts/utils.js"></script>

<link rel="stylesheet" href="include/css/layout.css" type="text/css">
<link rel="stylesheet" href="include/css/style.css" type="text/css">
<link rel="stylesheet" href="include/css/default.css" type="text/css">
<link rel="stylesheet" href="include/css/fonts.css" type="text/css">
<link rel="stylesheet" href="include/css/exp.css" type="text/css">
<title>Netgear</title>
</head>
<body>
<div id="layoutContainer">
	<div id="headerMain">
		<table class="tableStyle" style="margin: 0px;">
			<tr class="topAlign">
							<td class="leftEdge"></td>
				<td valign="top">
					<table class="tableStyle">

						<tr>
							<td style="width: 8px;"><img src="images/clear.gif" width="8"/></td>
							<td>
								<table class="tableStyle" style="margin-top: 8px;">
									<tr>
										<td class="logoNetGear space50Percent topAlign"><img src="images/clear.gif" width="150" height="50"/></td><td class="vertionImage spacer50Percent topAlign rightHAlign"><img src="images/clear.gif" width="205" height="50"/></td>							</tr>
								</table>
							</td>

						</tr>
						<tr>
							<td><img src="images/clear.gif" width="8"/></td>
							<td>
								<table class="tableStyle">
									<tr>
										<td class="bottomAlign">
											<table class="tableStyle">
												<tr>
													<td class="spacer80Percent bottomAlign" id="tabs">
														<ul class="tabs" id="primaryNav">
															<li id="loginMainMenu" class="Active"><a href="#" onclick="javascript:updateMenu('login')">Login</a></li>
															<li id="helpMainMenu"><a href="#" onclick="javascript:updateMenu('help')">Help</a></li>
														</ul>
													</td>
													<td class="loginActionCell spacer20Percent rightHAlign padding5LeftRight"></td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>

						<tr class="background-blue">
							<td><img src="images/clear.gif" width="8"/></td>
							<td class="padding7Top spacer100Percent">
								<div class="submenu" submenu="yes">
									<ul id="secondaryNav">
										<li><a href="#" style="color: #ffa400;">Online Help</a>&nbsp;</li>
										<li>&nbsp;</li>
									</ul>
								</div>
							</td>
						</tr>
					</table>

				</td>
				<td class="rightEdge"></td>
			</tr>
			<tr class="topAlign">
							<td valign="top" class="leftBodyNotch topAlign"></td>
							<td>
								<table class="tableStyle">
						<tr class="topAlign">
							<td class="leftNextBodyNotch"><img src="images/clear.gif" width="11" height="16"/></td>

							<td class="middleBodyNotch spacer100Percent"></td>
													<td class="rightNextBodyNotch"><img src="images/clear.gif" width="11"/></td>
						</tr>
								</table>
							</td>
							<td class="rightBodyNotch"></td>
					</tr>
		</table>
	</div>


	<div id="contentLeftEdge"></div>
	<div id="contentMenu">
		<table class="tableStyle">
			<tr >
				<td valign="top">
					<table class="tableStyle">
						<tr>
							<td style="width: 12px;"></td>
							<td class="padding2Top topAlign">
								<table border="0" cellspacing="0" cellpadding="0" id="Tree" width="144" >
									<tr height="5px">
										<td class="thardNavContainerTopLeftImg"></td>
										<td class="thardNavContainerTopMiddleImg spacer100Percent"></td>
										<td class="thardNavContainerTopRightImg"></td>
									</tr>
									<tr>
										<td class="thardNavContainerSecondTopLeftImg"><img src="images/clear.gif" width="5px" height="5px"/></td>
										<td class="leftNavBg padding1Top topAlign" id="TreeFrame">
											<table class="tableStyle">
												<tr>
													<td width="10px" height="10px" vAlign="top" class="paddAll noPadRight">
														<img src="images/arrow_right.gif" id="img_Basic" style="border: 0px; margin: 0px; margin-top: 0px; _margin-top: 0px; float: both; vertical-align: middle;">
													</td>

													<td colSpan="2" className: "padAll noPadLeft">
														<A href="#" class="TertiaryNav" style="color: #FFA400;"><strong>Support</strong></a>
													</td>
												</tr>
											</table>
										</td>
										<td class="thardNavContainerSecondTopRightImg"><img src="images/clear.gif" width="5px" height="5px"/></td>
									</tr>
									<tr height="5px">
										<td class="thardNavContainerBottomLeftImg"></td>
										<td class="thardNavContainerBottomMiddleImg"></td>
										<td class="thardNavContainerBottomRightImg"></td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</div>
  	<div id="contents" class="bodyblock"></div>
  	<div id="contentsLogin" class="bodyblock"></div>
  <div id="contentRightEdge"></div>
	<div id="footerMain"><?php include("footer.php"); ?></div>
</div>
</body>
</html>
