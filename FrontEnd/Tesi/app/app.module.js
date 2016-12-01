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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var analyzer_component_1 = require('./document-analyzer/analyzer.component');
var analyzer_service_1 = require('./document-analyzer/analyzer.service');
var projects_component_1 = require('./projects/projects.component');
var projects_service_1 = require('./projects/projects.service');
var pearlEditor_component_1 = require('./pearl-editor/pearlEditor.component');
var pearlEditor_service_1 = require('./pearl-editor/pearlEditor.service');
var codemirror_component_1 = require('./pearl-editor/codemirror.component');
var annotatorInstaller_component_1 = require('./annotator-installer/annotatorInstaller.component');
var annotatorInstaller_service_1 = require('./annotator-installer/annotatorInstaller.service');
var app_routing_1 = require('./app.routing');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                app_routing_1.routing,
                http_1.HttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                analyzer_component_1.AnalyzerComponent,
                projects_component_1.ProjectsComponent,
                pearlEditor_component_1.PearlEditorComponent,
                annotatorInstaller_component_1.AnnotatorInstallerComponent,
                codemirror_component_1.CodemirrorComponent
            ],
            providers: [
                analyzer_service_1.AnalyzerService,
                projects_service_1.ProjectsService,
                pearlEditor_service_1.PearlEditorService,
                annotatorInstaller_service_1.AnnotatorInstallerService
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map