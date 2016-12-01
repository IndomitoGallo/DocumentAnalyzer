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
var AnalyzerService = (function () {
    function AnalyzerService(http) {
        this.http = http;
    }
    AnalyzerService.prototype.getAnnotators = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getAnnotators?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getAnnotationsId = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getAnnotationsId?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.analyze = function (annotatorName, language, inputFormat, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/analyze?' +
            'annotator=' + annotatorName + '&' +
            'lng=' + language + '&' +
            'inputFormat=' + inputFormat + '&' +
            'ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.uploadFile = function (formData) {
        return Observable_1.Observable.create(function (observer) {
            var request = new XMLHttpRequest();
            request.open("post", backEndURL_1.BackEndURL + "/uploadFile", true);
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
    AnalyzerService.prototype.getTriplesPreviewOfAnnotation = function (annotationId, uimaType, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getTriplesPreviewOfAnnotation?annotationId=' + annotationId +
            '&uimaType=' + uimaType + '&ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getTriplesPreview = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getTriplesPreview?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.addTriples = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/addTriples?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getAnnotationContent = function (annotationId, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getAnnotationContent?annotationId=' + annotationId + '&ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getAnnotationTree = function (annotationId, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getAnnotationTree?annotationId=' + annotationId + '&ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getAnnotationType = function (annotationId, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getAnnotationType?annotationId=' + annotationId + '&ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.getUsefulPearlRules = function (annotationId, project) {
        return this.http.get(backEndURL_1.BackEndURL + '/getUsefulPearlRules?annotationId=' + annotationId + '&ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.exportTriples = function (project) {
        var httpReq = new XMLHttpRequest();
        httpReq.open("GET", backEndURL_1.BackEndURL + '/exportTriples?ctx_project=' + project, true);
        httpReq.setRequestHeader("Access-Control-Allow-Origin", "*");
        console.log("URL --> " + backEndURL_1.BackEndURL + '/exportTriples?ctx_project=' + project);
        httpReq.responseType = "blob";
        return new Observable_1.Observable(function (o) {
            //handle the request completed
            httpReq.onreadystatechange = function (event) {
                if (httpReq.readyState === 4) {
                    if (httpReq.status === 200) {
                        console.log("Risposta ricevuta");
                        o.next(httpReq.response);
                        o.complete();
                    }
                    else {
                        throw new Error(httpReq.statusText);
                    }
                }
            };
            //execute the get
            httpReq.send();
        }).catch(function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error);
        });
    };
    AnalyzerService.prototype.deleteInstalledAnnotators = function (project) {
        return this.http.get(backEndURL_1.BackEndURL + '/deleteInstalledAnnotators?ctx_project=' + project)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AnalyzerService.prototype.disconnectFromProject = function (project) {
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
    AnalyzerService.prototype.extractData = function (res) {
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
    AnalyzerService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    AnalyzerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AnalyzerService);
    return AnalyzerService;
}());
exports.AnalyzerService = AnalyzerService;
//# sourceMappingURL=analyzer.service.js.map