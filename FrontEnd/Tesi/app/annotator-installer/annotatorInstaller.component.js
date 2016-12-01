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
var annotatorInstaller_service_1 = require('./annotatorInstaller.service');
var AnnotatorInstallerComponent = (function () {
    function AnnotatorInstallerComponent(_annotatorInstallerService, _router, route) {
        this._annotatorInstallerService = _annotatorInstallerService;
        this._router = _router;
        this.route = route;
        this.annotatorUploaded = false;
        this.annotatorUploading = false;
    }
    AnnotatorInstallerComponent.prototype.fileChangeEvent = function (file) {
        console.log("Chiamata a metodo fileChangeEvent()");
        this.inputFile = file;
        this.annotatorUploaded = false;
    };
    AnnotatorInstallerComponent.prototype.installAnnotator = function () {
        var _this = this;
        console.log("Chiamata a metodo installAnnotator()");
        console.log("InputFile: " + this.inputFile.name);
        this.annotatorUploading = true;
        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("file", this.inputFile);
        formData.append("ctx_project", this.project);
        this._annotatorInstallerService.installAnnotator(formData)
            .subscribe(function (response) {
            _this.annotatorUploading = false;
            _this.annotatorUploaded = true,
                function (error) { return _this.errorMessage = "Errore durante l'upload del file. Ritenta.."; };
        });
    };
    AnnotatorInstallerComponent.prototype.disconnectFromProject = function (project) {
        var _this = this;
        console.log("Chiamata a metodo disconnectFromProject()");
        this._annotatorInstallerService.deleteInstalledAnnotators(this.project)
            .subscribe(function (response) {
            _this._annotatorInstallerService.disconnectFromProject(_this.project)
                .subscribe(function (response) {
                _this._router.navigate(['/projects']);
            }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
        }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
    };
    AnnotatorInstallerComponent.prototype.goTo = function (component) {
        if (component == "/annotator-installer") {
            this.annotatorUploaded = false;
            this.inputFile = null;
        }
        else {
            this._router.navigate([component, this.project]);
        }
    };
    AnnotatorInstallerComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Recupero il nome del progetto
        this.route.params.subscribe(function (params) {
            _this.project = params['project'];
        });
    };
    AnnotatorInstallerComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/annotator-installer/annotatorInstaller.component.html'
        }), 
        __metadata('design:paramtypes', [annotatorInstaller_service_1.AnnotatorInstallerService, router_1.Router, router_1.ActivatedRoute])
    ], AnnotatorInstallerComponent);
    return AnnotatorInstallerComponent;
}());
exports.AnnotatorInstallerComponent = AnnotatorInstallerComponent;
//# sourceMappingURL=annotatorInstaller.component.js.map