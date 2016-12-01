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
var router_1 = require('@angular/router');
//import { HTTP_PROVIDERS }      from 'angular2/http';
//import { Router, RouteParams, ROUTER_DIRECTIVES } from 'angular2/router';
//import { NgForm }    from '@angular/common';
var platform_browser_1 = require('@angular/platform-browser');
var triple_1 = require('../domain/triple');
var rule_1 = require('../domain/rule');
var analyzer_service_1 = require('./analyzer.service');
var AnalyzerComponent = (function () {
    function AnalyzerComponent(_analyzerService, _router, route, sanitizer) {
        this._analyzerService = _analyzerService;
        this._router = _router;
        this.route = route;
        this.sanitizer = sanitizer;
        this.annotatorsLoaded = false;
        this.analysisStarted = false;
        this.analysisComplete = false;
        this.charEncoding = ['UTF-8', 'ISO-8859-1', 'US-ASCII', 'UTF-16BE', 'UTF-16LE', 'UTF-16'];
        this.languages = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko-kr', 'pt-br', 'zh-cn', 'zh-tw', 'x-unspecified'];
        this.inputFormats = ['text', 'html'];
        this.htmlText = "Loading HTML view...";
        //Valori booleani per settare la view corretta
        this.viewHTML = false;
        this.textAnalysis = false;
        this.htmlAnalysis = false;
        this.triplesPreviewReceived = false;
        this.triplesGenerated = false;
        this.addingTriples = false;
        this.annContentAndPearlRulesReceived = false;
        this.annTriplesPreviewReceived = false;
        this.annContentReceived = false;
        this.pearlRulesReceived = false;
        this.downloadReady = false;
        this.annotators = [];
        this.annotationsId = [];
        this.generatedTriples = [];
        this.usefulPearlRules = [];
        this.annotatorChosen = "";
        this.inputFormat = "";
        this.language = "";
    }
    AnalyzerComponent.prototype.fileChangeEvent = function (file) {
        console.log("Chiamata a metodo fileChangeEvent()");
        this.inputFile = file;
    };
    AnalyzerComponent.prototype.analyze = function () {
        var _this = this;
        console.log("Chiamata a metodo analyze()");
        console.log("Annotatore: " + this.annotatorChosen);
        console.log("Linguaggio: " + this.language);
        console.log("InputFormat: " + this.inputFormat);
        console.log("InputFile: " + this.inputFile.name);
        //console.log("CharEncoding: " + this.encoding);
        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("file", this.inputFile);
        //formData.append("encoding", this.encoding);
        this.analysisStarted = true;
        this._analyzerService.uploadFile(formData)
            .subscribe(function (response) {
            _this.startAnalysis(_this.annotatorChosen, _this.language, _this.inputFormat),
                function (error) { return _this.errorMessage = "Errore durante l'upload del file. Ritenta.."; };
        });
    };
    AnalyzerComponent.prototype.startAnalysis = function (annotatorChosen, language, inputFormat) {
        var _this = this;
        console.log("Chiamata a metodo startAnalysis()");
        this._analyzerService.analyze(annotatorChosen, language, inputFormat, this.project)
            .subscribe(function (response) {
            if (inputFormat == 'text') {
                _this.legend = _this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
                _this.htmlText = _this.sanitizer.bypassSecurityTrustHtml("<p>" + response.stresponse.data.response[0][1].replace(/\n/g, "<br>") + "</p>");
                _this.getAnnotationsId("text");
            }
            else {
                _this.legend = _this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
                _this.htmlText = _this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][1]);
                _this.getAnnotationsId("html");
            }
            //this.analysisComplete = true;
            /*
            if(inputFormat == 'text') {
                this.enableButtons();
            } else {
                this.enableFrameButtons();
            }
            */
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile analizzare il file. Ritenta.."; });
    };
    AnalyzerComponent.prototype.getAnnotationsId = function (inputFormat) {
        var _this = this;
        console.log("Chiamata a metodo startAnalysis()");
        this._analyzerService.getAnnotationsId(this.project)
            .subscribe(function (response) {
            _this.annotationsId = response.stresponse.data.response[0];
            if (inputFormat == 'text') {
                _this.textAnalysis = true;
            }
            else {
                _this.htmlAnalysis = true;
            }
            _this.analysisComplete = true;
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile recuperare l'id delle annotazioni. Ritenta.."; });
    };
    AnalyzerComponent.prototype.enableButtons = function () {
        var _this = this;
        window.setTimeout(function () {
            var buttons = document.getElementsByClassName("annotation-btn");
            console.log(buttons);
            console.log("btns length " + buttons.length);
            var i;
            for (i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function (event) {
                    var button = event.target;
                    var idAnn = button.getAttribute("id");
                    console.log(idAnn + " button pressed");
                    _this.getAnnotationContent(idAnn);
                });
            }
        });
    };
    AnalyzerComponent.prototype.enableFrameButtons = function () {
        var _this = this;
        window.setTimeout(function () {
            var buttons = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("annotation-btn");
            console.log(buttons);
            console.log("btns length " + buttons.length);
            var i;
            for (i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function (event) {
                    var button = event.target;
                    var idAnn = button.getAttribute("id");
                    console.log(idAnn + " button pressed");
                    _this.getAnnotationContent(idAnn);
                });
            }
        }, 3000);
    };
    AnalyzerComponent.prototype.getAnnotationContent = function (annotationId) {
        var _this = this;
        console.log("Chiamata a metodo getAnnotationContent()");
        this.annotationId = annotationId;
        this.annTriplesPreviewReceived = false;
        this._analyzerService.getAnnotationContent(annotationId, this.project)
            .subscribe(function (response) {
            _this.annotationContent = _this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
            //this.getAnnotationTree(annotationId);
            _this.getAnnotationType(annotationId);
        }, function (error) { return _this.annErrorMessage = "Impossibile recuperare il contenuto dell'annotazione selezionata."; });
    };
    AnalyzerComponent.prototype.getAnnotationTree = function (annotationId) {
        var _this = this;
        console.log("Chiamata a metodo getAnnotationTree()");
        this.annotationId = annotationId;
        this._analyzerService.getAnnotationTree(annotationId, this.project)
            .subscribe(function (response) {
            _this.annotationTree = response.stresponse.data.response[0][0];
            console.log(_this.annotationTree);
            _this.getUsefulPearlRules(annotationId);
            //this.annContentReceived = true;
        }, function (error) { return _this.annErrorMessage = "Impossibile recuperare l'albero dell'annotazione selezionata."; });
    };
    AnalyzerComponent.prototype.getAnnotationType = function (annotationId) {
        var _this = this;
        console.log("Chiamata a metodo getAnnotationType()");
        this.annotationId = annotationId;
        this._analyzerService.getAnnotationType(annotationId, this.project)
            .subscribe(function (response) {
            _this.annotationType = response.stresponse.data.response[0][0];
            console.log(_this.annotationType);
            _this.getUsefulPearlRules(annotationId);
        }, function (error) { return _this.annErrorMessage = "Impossibile recuperare il tipo dell'annotazione selezionata."; });
    };
    AnalyzerComponent.prototype.getUsefulPearlRules = function (annotationId) {
        var _this = this;
        console.log("Chiamata a metodo getUsefulPearlRules()");
        this._analyzerService.getUsefulPearlRules(annotationId, this.project)
            .subscribe(function (response) {
            _this.usefulPearlRules = _this.extractRules(response.stresponse.data.response[0]);
            //this.pearlRulesReceived = true;
            _this.annContentAndPearlRulesReceived = true;
            console.log(_this.annContentAndPearlRulesReceived);
        }, function (error) { return _this.annErrorMessage = "Impossibile recuperare le regole pearl utilizzabili."; });
    };
    AnalyzerComponent.prototype.getTriplesPreviewOfAnnotation = function (uimaType, annotationId) {
        var _this = this;
        console.log("Chiamata a metodo getTriplesPreviewOfAnnotation()");
        this._analyzerService.getTriplesPreviewOfAnnotation(annotationId, uimaType, this.project)
            .subscribe(function (response) {
            _this.annTriples = _this.extractTriples(response.stresponse.data.triples[0]);
            _this.annTriplesPreviewReceived = true;
            console.log(_this.annTriplesPreviewReceived);
        }, function (error) { return _this.annErrorMessage = "Non \u00E8 stato possibile generare le triple RDF. Ritenta.."; });
    };
    AnalyzerComponent.prototype.addTriplesOfAnnotation = function () {
        var _this = this;
        console.log("Chiamata a metodo addTriplesOfAnnotation()");
        this.addingTriples = true;
        this._analyzerService.addTriples(this.project)
            .subscribe(function (response) {
            var i;
            for (i = 0; i < _this.annTriples.length; i++) {
                _this.generatedTriples.push(_this.annTriples[i]);
            }
            _this.annTriples = [];
            _this.annTriplesPreviewReceived = false;
            _this.addingTriples = false;
            _this.downloadLink = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/exportTriples?ctx_project=" + _this.project;
            _this.triplesGenerated = true;
            console.log(_this.generatedTriples);
        }, function (error) { return _this.annErrorMessage = "Non \u00E8 stato possibile agiungere le triple RDF al MAINGRAPH. Ritenta.."; });
    };
    AnalyzerComponent.prototype.getTriplesPreview = function () {
        var _this = this;
        console.log("Chiamata a metodo getTriplesPreview()");
        this._analyzerService.getTriplesPreview(this.project)
            .subscribe(function (response) {
            _this.cacheTriples = _this.extractTriples(response.stresponse.data.triples[0]);
            _this.triplesPreviewReceived = true;
            console.log(_this.triplesPreviewReceived);
        }, function (error) { return _this.tripleErrorMessage = "Non \u00E8 stato possibile generare le triple RDF. Ritenta.."; });
    };
    AnalyzerComponent.prototype.addTriples = function () {
        var _this = this;
        console.log("Chiamata a metodo addTriples()");
        this.addingTriples = true;
        this._analyzerService.addTriples(this.project)
            .subscribe(function (response) {
            _this.generatedTriples = _this.cacheTriples;
            _this.addingTriples = false;
            _this.downloadLink = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/exportTriples?ctx_project=" + _this.project;
            _this.triplesGenerated = true;
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile agiungere le triple RDF al MAINGRAPH. Ritenta.."; });
    };
    /*
    exportTriples() {

        console.log("Chiamata a metodo exportTriples()");

        this._analyzerService.exportTriples(this.project)
            .subscribe(
                 response => {
                    var data = new Blob([response], {type: "octet/stream"});
                    var exportLink = window.URL.createObjectURL(data);
                    //this.modalService.downloadLink("Export triples", null, exportLink, "triples.rdf");
                    this.downloadURL = this.sanitizer.bypassSecurityTrustUrl(exportLink);
                    console.log("URL --> " + this.downloadURL);
                    this.downloadReady = true;
                 },
                 error =>  this.errorMessage = `Non è stato possibile generare il file con le triple generate. Ritenta..`
            );
    }
    */
    AnalyzerComponent.prototype.extractRules = function (rulesList) {
        var rules = [];
        var i;
        console.log("rulesList.length = " + rulesList.length);
        for (i = 0; i < rulesList.length; i++) {
            var rule = new rule_1.Rule(rulesList[i][0], rulesList[i][1], rulesList[i][2]);
            rules.push(rule);
            console.log("Rule numero " + i + " --> " + rulesList[i][0] + " " + rulesList[i][1]);
        }
        return rules;
    };
    AnalyzerComponent.prototype.extractTriples = function (triplesList) {
        var triples = [];
        var i;
        console.log("triplesList.length = " + triplesList.length);
        for (i = 0; i < triplesList.length; i++) {
            var triple = new triple_1.Triple(triplesList[i][0], triplesList[i][1], triplesList[i][2]);
            triples.push(triple);
            console.log("Tripla numero " + i + " --> " + triplesList[i][0] + " " + triplesList[i][1] + " " + triplesList[i][2]);
        }
        return triples;
    };
    /*
     * Questa funzione viene attivata dal tasto "Torna Indietro" e riporta l'utente
     * alla pagina precedentemente visualizzata.
     */
    AnalyzerComponent.prototype.newAnalysis = function () {
        this.analysisStarted = false;
        this.analysisComplete = false;
        this.annotatorsLoaded = false;
        this.htmlText = "Loading HTML view...";
        this.annotatorChosen = "";
        this.language = "";
        this.inputFormat = "";
        this.textAnalysis = false;
        this.htmlAnalysis = false;
        this.inputFile = null;
        this.triplesGenerated = false;
        this.cacheTriples = [];
        this.generatedTriples = [];
        this.ngOnInit();
    };
    AnalyzerComponent.prototype.disconnectFromProject = function () {
        var _this = this;
        console.log("Chiamata a metodo disconnectFromProject()");
        this._analyzerService.deleteInstalledAnnotators(this.project)
            .subscribe(function (response) {
            _this._analyzerService.disconnectFromProject(_this.project)
                .subscribe(function (response) {
                _this._router.navigate(['/projects']);
            }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
        }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
    };
    AnalyzerComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Recupero il nome del progetto
        this.route.params.subscribe(function (params) {
            _this.project = params['project'];
        });
        //carico dal server la lista degli annotatori da visualizzare
        this._analyzerService.getAnnotators(this.project)
            .subscribe(function (response) {
            _this.annotators = response.stresponse.data.response[0];
            console.log("Annotators: " + _this.annotators);
            _this.annotatorsLoaded = true;
        }, function (error) { return _this.errorMessage = error; });
    };
    AnalyzerComponent.prototype.goTo = function (component) {
        if (component == "/document-analyzer") {
            this.analysisStarted = false;
            this.analysisComplete = false;
            this.annotatorsLoaded = false;
            this.htmlText = "Loading HTML view...";
            this.textAnalysis = false;
            this.htmlAnalysis = false;
            this.inputFile = null;
            this.ngOnInit();
        }
        else {
            this._router.navigate([component, this.project]);
        }
    };
    AnalyzerComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/document-analyzer/analyzer.component.html'
        }), 
        __metadata('design:paramtypes', [analyzer_service_1.AnalyzerService, router_1.Router, router_1.ActivatedRoute, platform_browser_1.DomSanitizer])
    ], AnalyzerComponent);
    return AnalyzerComponent;
}());
exports.AnalyzerComponent = AnalyzerComponent;
//# sourceMappingURL=analyzer.component.js.map