///<reference path="../../typings/index.d.ts"/>
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
var pearlEditor_service_1 = require('./pearlEditor.service');
var router_1 = require('@angular/router');
var CodemirrorComponent = (function () {
    function CodemirrorComponent(_pearlEditorService, _router, route) {
        this._pearlEditorService = _pearlEditorService;
        this._router = _router;
        this.route = route;
        this.querychange = new core_1.EventEmitter();
        this.pearlFileReceived = false;
        this.codeModify = false;
        this.lastCodeModify = false;
        this.numberModifies = 0;
    }
    CodemirrorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log("Chiamata a ngAfterViewInit()");
        this.cmEditor = CodeMirror.fromTextArea(this.textareaElement.nativeElement, {
            lineNumbers: true,
            mode: "application/pearl",
            indentUnit: 4,
            indentWithTabs: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            lineWrapping: true
        });
        this.cmEditor.on('change', function (editor) {
            _this.querychange.emit(editor.getDoc().getValue());
        });
        this.cmEditor.setSize("100%", "500px");
        this.cmEditor.setOption("matchBrackets", true);
        this.cmEditor.setOption("highlightSelectionMatches", { showToken: /\w/, annotateScrollbar: true });
        this.cmEditor.setOption("autoCloseBrackets", true);
        this.cmEditor.setOption("scrollbarStyle", "overlay");
        this.cmEditor.setOption("styleActiveLine", true);
    };
    CodemirrorComponent.prototype.fileChangeEvent = function (file) {
        console.log("Chiamata a metodo fileChangeEvent()");
        this.inputFile = file;
    };
    CodemirrorComponent.prototype.uploadPearl = function () {
        var _this = this;
        console.log("Chiamata a metodo uploadPearl()");
        console.log("InputFile: " + this.inputFile.name);
        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("file", this.inputFile);
        this._pearlEditorService.uploadPearl(formData)
            .subscribe(function (response) {
            //carico dal server il nuovo file Pearl da visualizzare
            _this._pearlEditorService.getPearl(_this.project)
                .subscribe(function (response) {
                //this.pearlFileReceived = true;
                _this.rules = response.stresponse.data.response[0][0];
                _this.cmEditor.setValue(_this.rules);
                console.log("Pearl File: " + _this.rules);
                _this.codeModify = true;
                _this.lastCodeModify = true;
                _this.numberModifies++;
            }, function (error) { return _this.errorMessage = "Il file \u00E8 stato caricato correttamente, ma non  \n                                                    \u00E8 momentanemente possibile recuperare le regole pearl."; }),
                function (error) { return _this.errorMessage = "Errore durante l'upload del file. Ritenta.."; };
        });
    };
    CodemirrorComponent.prototype.editPearl = function () {
        var _this = this;
        console.log("Chiamata a metodo editPearl()");
        this.pearlFileReceived = false;
        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.editPearl(this.cmEditor.getDoc().getValue(), this.project)
            .subscribe(function (response) {
            _this.pearlFileReceived = true;
            _this.rules = response.stresponse.data.response[0][0];
            console.log("RULES --> " + _this.rules);
            _this.cmEditor.setValue(_this.rules);
            _this.codeModify = true;
            _this.lastCodeModify = true;
            _this.pearlFileReceived = true;
            _this.numberModifies++;
        }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile modificare le regole pearl. Ritenta.."; });
    };
    CodemirrorComponent.prototype.deletePearlUpdates = function () {
        var _this = this;
        console.log("Chiamata a metodo deletePearlUpdates()");
        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.deletePearlUpdates(this.project)
            .subscribe(function (response) {
            _this.rules = response.stresponse.data.response[0][0];
            _this.cmEditor.setValue(_this.rules);
            console.log("Pearl File: " + _this.rules);
            _this.codeModify = false;
            _this.lastCodeModify = false;
            _this.numberModifies = 0;
        }, function (error) { return _this.errorMessage = "Impossibile cancellare le modifiche precedentemente apportate."; });
    };
    CodemirrorComponent.prototype.deleteLastPearlUpdates = function () {
        var _this = this;
        console.log("Chiamata a metodo deleteLastPearlUpdates()");
        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.deleteLastPearlUpdates(this.project)
            .subscribe(function (response) {
            //this.pearlFileReceived = true;
            _this.rules = response.stresponse.data.response[0][0];
            _this.cmEditor.setValue(_this.rules);
            console.log("Pearl File: " + _this.rules);
            _this.lastCodeModify = false;
            _this.numberModifies--;
            if (_this.numberModifies == 0) {
                _this.codeModify = false;
            }
        }, function (error) { return _this.errorMessage = "Impossibile cancellare l'ultima modifica apportata."; });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodemirrorComponent.prototype, "project", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CodemirrorComponent.prototype, "rules", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CodemirrorComponent.prototype, "querychange", void 0);
    __decorate([
        core_1.ViewChild('txtarea'), 
        __metadata('design:type', Object)
    ], CodemirrorComponent.prototype, "textareaElement", void 0);
    CodemirrorComponent = __decorate([
        core_1.Component({
            selector: 'codemirror',
            template: "\n        <form #pearlForm=\"ngForm\">\n            <div class=\"form-group col-sm-9\">\n                <label for=\"inputFile\">Upload a Pearl File</label>\n                <input #inputFile id=\"inputFile\" class=\"form-control\" type=\"file\" (change)=\"fileChangeEvent(inputFile.files[0])\" ngControl=\"inputFile\">\n            </div>\n            <button type=\"button\" class=\"btn btn-success uploadPearl\" (click)=\"uploadPearl()\">Upload</button>\n            <br>\n            <div class=\"form-group\" style=\"float: left;\">\n                <button type=\"button\" class=\"btn btn-default pearlButton\" (click)=\"editPearl()\" [disabled]=\"!pearlForm.form.valid\">Edit</button>\n                <button type=\"button\" class=\"btn btn-default pearlButton\" (click)=\"deletePearlUpdates()\" [disabled]=\"!codeModify\">Delete Updates</button>\n                <button type=\"button\" class=\"btn btn-default pearlButton\" (click)=\"deleteLastPearlUpdates()\" [disabled]=\"!lastCodeModify\">Delete Last Update</button>\n            </div>\n            <br>\n            <div class=\"form-group\">\n                <textarea *ngIf=\"rules\" #txtarea name=\"rules\" [(ngModel)]=\"rules\">{{rules}}</textarea>\n            </div>\n            <div *ngIf=\"errorMessage\" class=\"error\">\n                {{ errorMessage }}\n            </div>\n        </form>\n    ",
            host: { style: "border: 1px solid #ddd;" }
        }), 
        __metadata('design:paramtypes', [pearlEditor_service_1.PearlEditorService, router_1.Router, router_1.ActivatedRoute])
    ], CodemirrorComponent);
    return CodemirrorComponent;
}());
exports.CodemirrorComponent = CodemirrorComponent;
//# sourceMappingURL=codemirror.component.js.map