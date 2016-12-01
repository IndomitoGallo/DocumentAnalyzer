Components.utils.import("resource://exModules/exampleRequests.jsm");
Components.utils.import("resource://stmodules/Logger.jsm");
Components.utils.import("resource://stmodules/STHttpMgrFactory.jsm");
Components.utils.import("resource://stmodules/Context.jsm");

EXPORTED_SYMBOLS = [ "ExRequests" ];

var service = ExRequests.Example;
var serviceName = service.serviceName;

var groupId = "it.uniroma2.art.semanticturkey";
var artifactId = "st_exp-extension";

function sayHi(name) {
	Logger.debug('[SERVICE_Example.jsm] sayHi');
	var p_name = "name=" + name;
	var currentSTHttpMgr = STHttpMgrFactory.getInstance(groupId, artifactId);
	return currentSTHttpMgr.GET(null, serviceName, service.sayHiRequest, this.context, p_name);
}

//this return an implementation for Project with a specified context
service.prototype.getAPI = function(specifiedContext){
	var newObj = new service();
	newObj.context = specifiedContext;
	return newObj;
}

service.prototype.sayHi = sayHi;
service.prototype.context = new Context();  // set the default context
service.constructor = service;
service.__proto__ = service.prototype;
