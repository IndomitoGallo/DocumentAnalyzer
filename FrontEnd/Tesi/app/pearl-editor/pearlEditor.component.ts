///<reference path="../../typings/index.d.ts"/>

import { Component, OnInit, ViewChild, Input, Output, EventEmitter }  from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BackEndURL } from '../backEndURL';

import { Resp } from '../response/resp';
import { DomSanitizer } from '@angular/platform-browser';
import { PearlEditorService } from './pearlEditor.service';

@Component({
  templateUrl: 'app/pearl-editor/pearlEditor.component.html'
})

export class PearlEditorComponent {
    
    errorMessage: string;

    pearlRules: any = "";

    pearlFileReceived: boolean = false;

    inputFile: File;

    project: string;

    constructor(private _pearlEditorService: PearlEditorService, 
                private _router: Router, private route: ActivatedRoute, public sanitizer: DomSanitizer) { }

    disconnectFromProject() {

        console.log("Chiamata a metodo disconnectFromProject()");

        this._pearlEditorService.deleteInstalledAnnotators(this.project)
                        .subscribe(
                            response => {
                                this._pearlEditorService.disconnectFromProject(this.project)
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

    ngOnInit() {

        console.log("Chiamata a PEARL EDITOR ngOnInit()");
        this.pearlFileReceived = false;

        //Recupero il nome del progetto
        this.route.params.subscribe(params => {
            this.project = params['project'];
        });
        //carico dal server il file Pearl da visualizzare
        this._pearlEditorService.getPearl(this.project)
                         .subscribe(
                               response  => {
                                  this.pearlRules = response.stresponse.data.response[0][0];
                                  this.pearlFileReceived = true;
                               },
                               error =>  this.errorMessage = "Non è momentaneamente possibile recuperare il file Pearl"
                          );
                          
    }
    
    goTo(component: string) {
      if(component == "/pearl-editor") {

        this.pearlFileReceived = false;

        this.pearlRules = null;
      }
      else {
          this._router.navigate([ component, this.project ]);
      }
    }

}
