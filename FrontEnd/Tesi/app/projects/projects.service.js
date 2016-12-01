"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var ProjectsService = (function () {
    function ProjectsService() {
        this.url = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st-core-services/Projects";
    }
    ProjectsService.prototype.listProjects = function () {
        var request = new XMLHttpRequest();
        request.open("get", this.url + "/listProjects", true);
        request.setRequestHeader("Accept", "application/xml");
        return new Observable_1.Observable(function (o) {
            //handle the request completed
            request.onreadystatechange = function (event) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var parser = new DOMParser();
                        var stResp = parser.parseFromString(request.responseText, "application/xml");
                        var data = stResp.documentElement.childNodes[3];
                        var projects = [];
                        for (var i = 0; i < data.childNodes.length; i++) {
                            if (data.childNodes[i].nodeName != "#text") {
                                projects.push(data.childNodes[i].textContent);
                            }
                        }
                        console.log("Projects --> " + projects);
                        o.next(projects);
                        o.complete();
                    }
                    else {
                        throw new Error(request.statusText);
                    }
                }
            };
            //execute the post
            request.send();
        });
    };
    ProjectsService.prototype.accessProject = function (project) {
        var request = new XMLHttpRequest();
        request.open("get", this.url + "/accessProject?consumer=SYSTEM&projectName=" + project +
            "&requestedAccessLevel=RW&requestedLockLevel=NO", true);
        request.setRequestHeader("Accept", "application/xml");
        return new Observable_1.Observable(function (o) {
            //handle the request completed
            request.onreadystatechange = function (event) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        console.log("Response --> " + request.responseText);
                        o.next(request.responseText);
                        o.complete();
                    }
                    else {
                        throw new Error(request.statusText);
                    }
                }
            };
            //execute the post
            request.send();
        });
    };
    ProjectsService.prototype.deleteProject = function (project) {
        var request = new XMLHttpRequest();
        request.open("get", this.url + "/deleteProject?consumer=SYSTEM&projectName=" + project, true);
        request.setRequestHeader("Accept", "application/xml");
        return new Observable_1.Observable(function (o) {
            //handle the request completed
            request.onreadystatechange = function (event) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        console.log("Response --> " + request.responseText);
                        o.next(request.responseText);
                        o.complete();
                    }
                    else {
                        throw new Error(request.statusText);
                    }
                }
            };
            //execute the post
            request.send();
        });
    };
    ProjectsService.prototype.createProject = function (project, modelType, baseURI, tripleStore, modelConfigClass, modelConfig) {
        var request = new XMLHttpRequest();
        request.open("get", this.url + "/createProject?consumer=SYSTEM&projectName=" + project +
            "&modelType=" + modelType + "&baseURI=" + baseURI +
            "&ontManagerFactoryID=" + tripleStore +
            "&modelConfigurationClass=" + modelConfigClass +
            "&modelConfiguration=" + modelConfig, true);
        request.setRequestHeader("Accept", "application/xml");
        return new Observable_1.Observable(function (o) {
            //handle the request completed
            request.onreadystatechange = function (event) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        console.log("Response --> " + request.responseText);
                        o.next(request.responseText);
                        o.complete();
                    }
                    else {
                        throw new Error(request.statusText);
                    }
                }
            };
            //execute the post
            request.send();
        });
    };
    ProjectsService.prototype.extractProjects = function (response) {
        var parser = new DOMParser();
        var stResp = parser.parseFromString(response, "application/xml");
        var data = stResp.documentElement.childNodes[3];
        var projects = [];
        for (var i = 0; i < data.childNodes.length; i++) {
            if (data.childNodes[i].nodeName != "#text") {
                projects.push(data.childNodes[i].textContent);
            }
        }
        console.log("Projects --> " + projects);
        return projects;
    };
    /*
     * Il metodo handleError serve a catturare un eventuale errore proveniente dal server.
     */
    ProjectsService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    ProjectsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ProjectsService);
    return ProjectsService;
}());
exports.ProjectsService = ProjectsService;
//# sourceMappingURL=projects.service.js.map