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
var backEndURL_1 = require('../backEndURL');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var PearlEditorService = (function () {
    function PearlEditorService(http) {
        this.http = http;
    }
    PearlEditorService.prototype.getPearl = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getPearl?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    PearlEditorService.prototype.uploadPearl = function (formData) {
        return Observable_1.Observable.create(function (observer) {
            var request = new XMLHttpRequest();
            request.open("post", backEndURL_1.BackEndURL + "/uploadPearl", true);
            request.send(formData); /* Send to server */
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        observer.next(JSON.parse(request.response));
                        observer.complete();
                    }
                    else {
                        observer.error(request.response);
                    }
                }
            };
        });
    };
    PearlEditorService.prototype.editPearl = function (pearlCode, project) {
        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("pearlCode", pearlCode);
        return Observable_1.Observable.create(function (observer) {
            var request = new XMLHttpRequest();
            request.open("post", backEndURL_1.BackEndURL + "/editPearl?ctx_project=" + project, true);
            request.send(formData); /* Send to server */
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        observer.next(JSON.parse(request.response));
                        observer.complete();
                    }
                    else {
                        observer.error(request.response);
                    }
                }
            };
        });
    };
    PearlEditorService.prototype.deletePearlUpdates = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/deletePearlUpdates?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    PearlEditorService.prototype.deleteLastPearlUpdates = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/deleteLastPearlUpdates?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    PearlEditorService.prototype.deleteInstalledAnnotators = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/deleteInstalledAnnotators?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    PearlEditorService.prototype.disconnectFromProject = function (project) {
        var url = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st-core-services/Projects";
        var request = new XMLHttpRequest();
        request.open("get", url + "/disconnectFromProject?consumer=SYSTEM&projectName=" + project, true);
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
    /*
     * Il metodo extractData è un'utility per gestire la risposta dal server
     * e quindi parsare bene il json.
     */
    PearlEditorService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        console.log("RES = " + JSON.stringify(res));
        var body = res.json();
        console.log("BODY = " + JSON.stringify(body));
        return body || {};
    };
    /*
     * Il metodo handleError serve a catturare un eventuale errore proveniente dal server.
     */
    PearlEditorService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    PearlEditorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PearlEditorService);
    return PearlEditorService;
}());
exports.PearlEditorService = PearlEditorService;
//# sourceMappingURL=pearlEditor.service.js.map