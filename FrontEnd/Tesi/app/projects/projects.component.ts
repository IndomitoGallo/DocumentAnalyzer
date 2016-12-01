import { Component, OnInit }  from '@angular/core';
//import { HTTP_PROVIDERS }      from 'angular2/http';
//import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Router } from '@angular/router';

import { Resp } from '../response/resp';

import { ProjectsService } from './projects.service';


@Component({
  templateUrl: 'app/projects/projects.component.html'
})

export class ProjectsComponent implements OnInit {

    errorMessage: string;

    projects: any;

    projectsListReceived: boolean = false;

    creationEnabled: boolean = false;

    projectName: string;
    modelType: string;
    baseURI: string; 
    tripleStore: string;
    modelConfigClass: string;

    constructor(private _projectsService: ProjectsService, private _router: Router) { 
        this.projectName = "";
        this.modelType = "";
        this.baseURI = "";
        this.tripleStore = "";
        this.modelConfigClass = "";
    }

    accessProject(project: string) {

        console.log("Chiamata a metodo accessProject()");
        console.log("Accessing to project: " + project);

        this._projectsService.accessProject(project)
                            .subscribe(
                                response => {
                                    this._router.navigate( ['/document-analyzer', project ] );
                                },
                                error =>  this.errorMessage = `Non è stato possibile accedere al progetto selezionato.
                                                               Riprovare o selezionarne un altro.`
                            );

    }

    deleteProject(project: string) {

        console.log("Chiamata a metodo deleteProject()");
        console.log("Deleting project: " + project);
        this._projectsService.deleteProject(project)
                            .subscribe(
                                response => {
                                    this.projectsListReceived = false;
                                    this.projects = [];
                                    this.listProjects();
                                },
                                error =>  this.errorMessage = `Al momento è impossibile cancellare il progetto selezionato.
                                                               Verificare che non sia ancora aperto in una sessione di lavoro.`
                            );

    }

    listProjects() {

        console.log("Chiamata a metodo listProjects()");

        this._projectsService.listProjects()
                         .subscribe(
                               response  => {
                                  this.projects = response;
                                  this.projectsListReceived = true;
                               },
                               error =>  this.errorMessage = `Non è stato possibile recuperare la lista dei progetti. Ricarica per riprovare.`
                          );

    }

    createProject() {

        console.log("Chiamata a metodo createProject()");

        console.log("Name --> " + this.projectName);
        console.log("Type --> " + this.modelType);
        console.log("URI --> " + this.baseURI);
        console.log("Triple Store --> " + this.tripleStore);
        console.log("Model Class --> " + this.modelConfigClass);
        console.log("Model Config --> " + modelConfig);

        //set Model Type
        if(this.modelType == "1") {
           this. modelType = "it.uniroma2.art.owlart.models.OWLModel";
        }
        else if(this.modelType ==  "2") {
            this.modelType = "it.uniroma2.art.owlart.models.SKOSModel";
        }
        else if(this.modelType == "3") {
            this.modelType = "it.uniroma2.art.owlart.models.SKOSXLModel";
        }

        //set Triple Store
        if(this.tripleStore == "1") {
            this.tripleStore = "it.uniroma2.art.semanticturkey.ontology.sesame2.OntologyManagerFactorySesame2Impl";
        }
        else if (this.tripleStore == "2") {
            this.tripleStore = "it.uniroma2.art.semanticturkey.ontology.rdf4j.OntologyManagerFactoryRDF4JImpl";
        }

        //set Model Configuration Class
        if(this.modelConfigClass == "1") {
            this.modelConfigClass = "it.uniroma2.art.owlart.sesame2impl.models.conf.Sesame2PersistentInMemoryModelConfiguration"
        }
        else if(this.modelConfigClass == "2") {
              this.modelConfigClass = "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNonPersistentInMemoryModelConfiguration"
        }
        else if(this.modelConfigClass == "3") {
              this.modelConfigClass = "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNativeModelConfiguration"
        }

        //set Model Configuration
        var modelConfig: string;
        if(this.modelConfigClass == "it.uniroma2.art.owlart.sesame2impl.models.conf.Sesame2PersistentInMemoryModelConfiguration") {
            modelConfig = "syncDelay%3D1000%0AdirectTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }
        else if(this.modelConfigClass == "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNonPersistentInMemoryModelConfiguration") {
            modelConfig = "directTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }
        else if(this.modelConfigClass == "it.uniroma2.art.owlart.rdf4jimpl.models.conf.RDF4JNativeModelConfiguration") {
            modelConfig = "forceSync%3Dfalse%0AtripleIndexes%3Dspoc%2C%20posc%0AdirectTypeInference%3Dtrue%0ArdfsInference%3Dtrue&";
        }

        console.log("Name --> " + this.projectName);
        console.log("Type --> " + this.modelType);
        console.log("URI --> " + this.baseURI);
        console.log("Triple Store --> " + this.tripleStore);
        console.log("Model Class --> " + this.modelConfigClass);
        console.log("Model Config --> " + modelConfig);


        this._projectsService.createProject(this.projectName, this.modelType, this.baseURI, 
                                            this.tripleStore, this.modelConfigClass, modelConfig)
                         .subscribe(
                               response  => {
                                   this.creationEnabled = false;
                                   this.projectsListReceived = false;
                                   this.projects = [];
                                   this._router.navigate( ['/document-analyzer', this.projectName ] );
                               },
                               error =>  this.errorMessage = `Non è stato possibile creare il progetto con le caratteristiche indicate. 
                                                              Verificare che quello indicato nel campo URI sia effettivamente uno URI.`
                          );

    }


    openForm() {
        this.creationEnabled = true;
    }

    ngOnInit() {

        console.log("ngOnInit");
        //carico dal server la lista degli annotatori da visualizzare
        this.listProjects();
    }

}
