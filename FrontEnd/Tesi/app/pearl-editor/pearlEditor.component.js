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
var router_1 = require('@angular/router');
var platform_browser_1 = require('@angular/platform-browser');
var pearlEditor_service_1 = require('./pearlEditor.service');
var PearlEditorComponent = (function () {
    function PearlEditorComponent(_pearlEditorService, _router, route, sanitizer) {
        this._pearlEditorService = _pearlEditorService;
        this._router = _router;
        this.route = route;
        this.sanitizer = sanitizer;
        this.pearlRules = "";
        this.pearlFileReceived = false;
    }
    PearlEditorComponent.prototype.disconnectFromProject = function () {
        var _this = this;
        console.log("Chiamata a metodo disconnectFromProject()");
        this._pearlEditorService.deleteInstalledAnnotators(this.project)
            .subscribe(function (response) {
            _this._pearlEditorService.disconnectFromProject(_this.project)
                .subscribe(function (response) {
                _this._router.navigate(['/projects']);
            }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
        }, function (error) { return _this.errorMessage = "Non \u00E8 momentaneamente possibile disconnettersi dal progetto corrente"; });
    };
    PearlEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Chiamata a PEARL EDITOR ngOnInit()");
        this.pearlFileReceived = false;
        //Recupero il nome del progetto
        this.route.params.subscribe(function (params) {
            _this.project = params['project'];
        });
        //carico dal server il file Pearl da visualizzare
        this._pearlEditorService.getPearl(this.project)
            .subscribe(function (response) {
            _this.pearlRules = response.stresponse.data.response[0][0];
            _this.pearlFileReceived = true;
        }, function (error) { return _this.errorMessage = "Non è momentaneamente possibile recuperare il file Pearl"; });
    };
    PearlEditorComponent.prototype.goTo = function (component) {
        if (component == "/pearl-editor") {
            this.pearlFileReceived = false;
            this.pearlRules = null;
        }
        else {
            this._router.navigate([component, this.project]);
        }
    };
    PearlEditorComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/pearl-editor/pearlEditor.component.html'
        }), 
        __metadata('design:paramtypes', [pearlEditor_service_1.PearlEditorService, router_1.Router, router_1.ActivatedRoute, platform_browser_1.DomSanitizer])
    ], PearlEditorComponent);
    return PearlEditorComponent;
}());
exports.PearlEditorComponent = PearlEditorComponent;
//# sourceMappingURL=pearlEditor.component.js.map