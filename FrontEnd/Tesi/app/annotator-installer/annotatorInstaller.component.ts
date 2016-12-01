import { Component, OnInit }  from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BackEndURL } from '../backEndURL';

import { Resp } from '../response/resp';

import { AnnotatorInstallerService } from './annotatorInstaller.service';

@Component({
  templateUrl: 'app/annotator-installer/annotatorInstaller.component.html'
})

export class AnnotatorInstallerComponent implements OnInit {

    errorMessage: string;

    annotatorUploaded: boolean = false;
    annotatorUploading: boolean = false;

    inputFile: File;

    project: string;

    constructor(private _annotatorInstallerService: AnnotatorInstallerService, 
                private _router: Router, private route: ActivatedRoute) { }

    fileChangeEvent(file: File) {

        console.log("Chiamata a metodo fileChangeEvent()");

        this.inputFile = file;
        this.annotatorUploaded = false;

    }

    installAnnotator() {

        console.log("Chiamata a metodo installAnnotator()");
        console.log("InputFile: " + this.inputFile.name);
        this.annotatorUploading = true;

        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("file", this.inputFile);
        formData.append("ctx_project", this.project);

        this._annotatorInstallerService.installAnnotator(formData)
            .subscribe(
                (response: any) => {
                    this.annotatorUploading = false;
                    this.annotatorUploaded = true,
                    (error: any) => this.errorMessage = `Errore durante l'upload del file. Ritenta..`;
                }
            )

    }

    disconnectFromProject(project: string) {

        console.log("Chiamata a metodo disconnectFromProject()");

        this._annotatorInstallerService.deleteInstalledAnnotators(this.project)
                        .subscribe(
                            response => {
                                this._annotatorInstallerService.disconnectFromProject(this.project)
                                            .subscribe(
                                                response  => {
                                                    this._router.navigate([ '/projects' ]);
                                                },
                                                error =>  this.errorMessage = `Non è momentaneamente possibile disconnettersi dal progetto corrente`
                                            );
                            },
                            error =>  this.errorMessage = `Non è momentaneamente possibile disconnettersi dal progetto corrente`
                        );

    }

    goTo(component: string) {
        if(component == "/annotator-installer") {

          this.annotatorUploaded = false;

          this.inputFile = null;
        }
        else {
            this._router.navigate([ component, this.project ]);
        }
    }

    ngOnInit() {
        //Recupero il nome del progetto
        this.route.params.subscribe(params => {
            this.project = params['project'];
        });
    }

}
