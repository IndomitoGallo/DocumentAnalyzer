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
//import { HTTP_PROVIDERS }      from 'angular2/http';
//import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
var router_1 = require('@angular/router');
var projects_service_1 = require('./projects.service');
var ProjectsComponent = (function () {
    function ProjectsComponent(_projectsService, _router) {
        this._projectsService = _projectsService;
        this._router = _router;
        this.projectsListReceived = false;
        this.creationEnabled = false;
        this.projectName = "";
        this.modelType = "";
        this.baseURI = "";
        this.tripleStore = "";
        this.modelConfigClass = "";
    }
    ProjectsComponent.prototype.accessProject = function (project) {
        var _this = this;
        console.log("Chiamata a metodo accessProject()");
        console.log("Accessing to project: " + project);
        this._projectsService.accessProject(project)
            .subscribe(function (response) {
            _this._router.navigate(['/document-analyzer', project]);
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile accedere al progetto selezionato.\n                                                               Riprovare o selezionarne un altro."; });
    };
    ProjectsComponent.prototype.deleteProject = function (project) {
        var _this = this;
        console.log("Chiamata a metodo deleteProject()");
        console.log("Deleting project: " + project);
        this._projectsService.deleteProject(project)
            .subscribe(function (response) {
            _this.projectsListReceived = false;
            _this.projects = [];
            _this.listProjects();
        }, function (error) { return _this.errorMessage = "Al momento \u00E8 impossibile cancellare il progetto selezionato.\n                                                               Verificare che non sia ancora aperto in una sessione di lavoro."; });
    };
    ProjectsComponent.prototype.listProjects = function () {
        var _this = this;
        console.log("Chiamata a metodo listProjects()");
        this._projectsService.listProjects()
            .subscribe(function (response) {
            _this.projects = response;
            _this.projectsListReceived = true;
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile recuperare la lista dei progetti. Ricarica per riprovare."; });
    };
    ProjectsComponent.prototype.createProject = function () {
        var _this = this;
        console.log("Chiamata a metodo createProject()");
        console.log("Name --> " + this.projectName);
        console.log("Type --> " + this.modelType);
        console.log("URI --> " + this.baseURI);
        console.log("Triple Store --> " + this.tripleStore);
        console.log("Model Class --> " + this.modelConfigClass);
        console.log("Model Config --> " + modelConfig);
        //set Model Type
        if (this.modelType == "1") {
            this.modelType = "it.uniroma2.art.owlart.models.OWLModel";
        }
        else if (this.modelType == "2") {
            this.modelType = "it.uniroma2.art.owlart.models.SKOSModel";
        }
        else if (this.modelType == "3") {
            this.modelType = "it.uniroma2.art.owlart.models.SKOSXLModel";
        }
        //set Triple Store
        if (this.tripleStore == "1") {
            this.tripleStore = "it.uniroma2.art.semanticturkey.ontology.sesame2.OntologyManagerFactorySesame2Impl";
        }
        else if (this.tripleStore == "2") {
            this.tripleStore = "it.uniroma2.art.semanticturkey.ontology.rdf4j.OntologyManagerFactoryRDF4JImpl";
        }
        //set Model Configuration Class
        if (this.modelConfigClass == "1") {
            this.modelConfigClass = "it.uniroma2.art.owlart.sesame2impl.models.conf.Sesame2PersistentInMemoryModelConfiguration";
        }
        else if (this.modelConfigClass == "2") {
            this.modelConfigClass = "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNonPersistentInMemoryModelConfiguration";
        }
        else if (this.modelConfigClass == "3") {
            this.modelConfigClass = "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNativeModelConfiguration";
        }
        //set Model Configuration
        var modelConfig;
        if (this.modelConfigClass == "it.uniroma2.art.owlart.sesame2impl.models.conf.Sesame2PersistentInMemoryModelConfiguration") {
            modelConfig = "syncDelay%3D1000%0AdirectTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }
        else if (this.modelConfigClass == "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNonPersistentInMemoryModelConfiguration") {
            modelConfig = "directTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }
        else if (this.modelConfigClass == "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNativeModelConfiguration") {
            modelConfig = "forceSync%3Dfalse%0AtripleIndexes%3Dspoc%2C%20posc%0AdirectTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }
        console.log("Name --> " + this.projectName);
        console.log("Type --> " + this.modelType);
        console.log("URI --> " + this.baseURI);
        console.log("Triple Store --> " + this.tripleStore);
        console.log("Model Class --> " + this.modelConfigClass);
        console.log("Model Config --> " + modelConfig);
        this._projectsService.createProject(this.projectName, this.modelType, this.baseURI, this.tripleStore, this.modelConfigClass, modelConfig)
            .subscribe(function (response) {
            _this.creationEnabled = false;
            _this.projectsListReceived = false;
            _this.projects = [];
            _this._router.navigate(['/document-analyzer', _this.projectName]);
        }, function (error) { return _this.errorMessage = "Non \u00E8 stato possibile creare il progetto con le caratteristiche indicate. \n                                                              Verificare che quello indicato nel campo URI sia effettivamente uno URI."; });
    };
    ProjectsComponent.prototype.openForm = function () {
        this.creationEnabled = true;
    };
    ProjectsComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        //carico dal server la lista degli annotatori da visualizzare
        this.listProjects();
    };
    ProjectsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/projects/projects.component.html'
        }), 
        __metadata('design:paramtypes', [projects_service_1.ProjectsService, router_1.Router])
    ], ProjectsComponent);
    return ProjectsComponent;
}());
exports.ProjectsComponent = ProjectsComponent;
//# sourceMappingURL=projects.component.js.map