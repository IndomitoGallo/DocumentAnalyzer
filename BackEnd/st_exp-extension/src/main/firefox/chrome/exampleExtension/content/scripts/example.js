if (typeof (art_stexp_ext) == "undefined") var art_stexp_ext = {};

Components.utils.import("resource://exServices/SERVICE_Example.jsm", art_stexp_ext);

window.addEventListener("load",  function() {
	art_stexp_ext.init();
}, false);

art_stexp_ext.init = function() {
	document.getElementById("testBtn").addEventListener("command", art_stexp_ext.sayHi, true);
};

art_stexp_ext.sayHi = function() {
	var name = document.getElementById("testTxt").value;
	if (name == "") {
		alert("insert something in the textbox");
		return;
	}
	var xmlResp = art_stexp_ext.ExRequests.Example.sayHi(name);
	var sayHiResult = xmlResp.getElementsByTagName("data")[0].textContent;
	document.getElementById("testLbl").setAttribute("value", sayHiResult);
}