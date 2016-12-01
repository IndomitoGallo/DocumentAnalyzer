/*
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
 * the specific language governing rights and limitations under the License.
 * 
 * The Original Code is SemanticTurkey.
 * 
 * The Initial Developer of the Original Code is University of Roma Tor Vergata.
 * Portions created by University of Roma Tor Vergata are Copyright (C) 2007.
 * All Rights Reserved.
 * 
 * SemanticTurkey was developed by the Artificial Intelligence Research Group
 * (art.uniroma2.it) at the University of Roma Tor Vergata (ART) Current
 * information about SemanticTurkey can be obtained at
 * http://semanticturkey.uniroma2.it
 * 
 */

if (typeof art_stexp_ext == 'undefined') 
	var art_stexp_ext = {};

Components.utils.import("resource://stmodules/Logger.jsm", art_stexp_ext);
Components.utils.import("resource://stmodules/stEvtMgr.jsm", art_stexp_ext);

//Adds the listeners to button and events
art_stexp_ext.associateEventsOnBrowserGraphicElements = function() {
	//Add a listener to exfButton. If clicked it execute the above function (exButtonManger)
	document.getElementById("exButton").addEventListener("command",art_stexp_ext.exButtonManager,true);
	//Add a listener to projectOpened and projectClosed events
	new art_semanticturkey.eventListener("projectOpened", art_stexp_ext.enableButton, null);
	new art_semanticturkey.eventListener("projectClosed", art_stexp_ext.enableButton, null);
};

//Function associated with exButton. When clicked it opens the main page of extension
art_stexp_ext.exButtonManager = function() {
	art_semanticturkey.openUrl("chrome://exampleExtension/content/example.xul");
};


//Handles projectOpened/Closed events showing/hiding exButton
art_stexp_ext.enableButton = function (event, eventObject) {
	if(event=="projectOpened")
		document.getElementById("exButton").hidden = false;
	if(event=="projectClosed")
		document.getElementById("exButton").hidden = true;

};


//Adds associateEventsOnBrowserGraphicElements function as listener on browser loaded event
window.addEventListener("load",
		art_stexp_ext.associateEventsOnBrowserGraphicElements, true);

