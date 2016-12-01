///<reference path="../../typings/index.d.ts"/>

import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { PearlEditorService } from './pearlEditor.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'codemirror',
    template: `
        <form #pearlForm="ngForm">
            <div class="form-group col-sm-9">
                <label for="inputFile">Upload a Pearl File</label>
                <input #inputFile id="inputFile" class="form-control" type="file" (change)="fileChangeEvent(inputFile.files[0])" ngControl="inputFile">
            </div>
            <button type="button" class="btn btn-success uploadPearl" (click)="uploadPearl()">Upload</button>
            <br>
            <div class="form-group" style="float: left;">
                <button type="button" class="btn btn-default pearlButton" (click)="editPearl()" [disabled]="!pearlForm.form.valid">Edit</button>
                <button type="button" class="btn btn-default pearlButton" (click)="deletePearlUpdates()" [disabled]="!codeModify">Delete Updates</button>
                <button type="button" class="btn btn-default pearlButton" (click)="deleteLastPearlUpdates()" [disabled]="!lastCodeModify">Delete Last Update</button>
            </div>
            <br>
            <div class="form-group">
                <textarea *ngIf="rules" #txtarea name="rules" [(ngModel)]="rules">{{rules}}</textarea>
            </div>
            <div *ngIf="errorMessage" class="error">
                {{ errorMessage }}
            </div>
        </form>
    `,
    host: { style: "border: 1px solid #ddd;"}
})

export class CodemirrorComponent {

    @Input() project: string;

    @Input() rules: string;
    @Output() querychange = new EventEmitter<string>();    
    @ViewChild('txtarea') textareaElement: any;

    private cmEditor: CodeMirror.EditorFromTextArea;

    errorMessage: string;

    pearlFileReceived: boolean = false;
    codeModify: boolean = false;
    lastCodeModify: boolean = false;
    numberModifies: number = 0;

    inputFile: File;

    constructor(private _pearlEditorService: PearlEditorService, 
                private _router: Router, private route: ActivatedRoute) { }


    ngAfterViewInit() {
        console.log("Chiamata a ngAfterViewInit()");

        this.cmEditor = CodeMirror.fromTextArea(
            this.textareaElement.nativeElement,
            { 
                lineNumbers: true, 
                mode: "application/pearl", 
                indentUnit : 4,
                indentWithTabs: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                lineWrapping: true
            }
        );
            
        this.cmEditor.on('change', (editor: CodeMirror.Editor) => {
            this.querychange.emit(editor.getDoc().getValue());
        });

        this.cmEditor.setSize("100%", "500px");

        this.cmEditor.setOption("matchBrackets", true);
        this.cmEditor.setOption("highlightSelectionMatches", {showToken: /\w/, annotateScrollbar: true});
        this.cmEditor.setOption("autoCloseBrackets", true);
        this.cmEditor.setOption("scrollbarStyle", "overlay");
        this.cmEditor.setOption("styleActiveLine", true);
        
    }
    
    fileChangeEvent(file: File) {

        console.log("Chiamata a metodo fileChangeEvent()");

        this.inputFile = file;

    }

    uploadPearl() {
        console.log("Chiamata a metodo uploadPearl()");

        console.log("InputFile: " + this.inputFile.name);

        /* Create a FormData instance */
        var formData = new FormData();
        /* Add the file */
        formData.append("file", this.inputFile);

        this._pearlEditorService.uploadPearl(formData)
            .subscribe(
                (response: any) => {
                  //carico dal server il nuovo file Pearl da visualizzare
                  this._pearlEditorService.getPearl(this.project)
                                   .subscribe(
                                         response  => {
                                            //this.pearlFileReceived = true;
                                            this.rules = response.stresponse.data.response[0][0];
                                            this.cmEditor.setValue(this.rules);
                                            console.log("Pearl File: " + this.rules);
                                            this.codeModify = true;
                                            this.lastCodeModify = true;
                                            this.numberModifies++;
                                         },
                                         error =>  this.errorMessage = `Il file è stato caricato correttamente, ma non  
                                                    è momentanemente possibile recuperare le regole pearl.`
                                    ),
                 (error: any) => this.errorMessage = "Errore durante l'upload del file. Ritenta..";
               }
            );
    }

    editPearl() {

        console.log("Chiamata a metodo editPearl()");

        this.pearlFileReceived = false;

        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.editPearl(this.cmEditor.getDoc().getValue(), this.project)
                    .subscribe(
                        (response: any) => {
                            this.pearlFileReceived = true;
                            this.rules = response.stresponse.data.response[0][0];
                            console.log("RULES --> " + this.rules);
                            this.cmEditor.setValue(this.rules);
                            this.codeModify = true;
                            this.lastCodeModify = true;
                            this.pearlFileReceived = true;
                            this.numberModifies++;
                        },
                        (error: any) =>  this.errorMessage = `Non è momentaneamente possibile modificare le regole pearl. Ritenta..`
                    );

    }

    deletePearlUpdates() {

        console.log("Chiamata a metodo deletePearlUpdates()");

        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.deletePearlUpdates(this.project)
            .subscribe(
                 response => {
                    this.rules = response.stresponse.data.response[0][0];
                    this.cmEditor.setValue(this.rules);
                    console.log("Pearl File: " + this.rules);
                    this.codeModify = false;
                    this.lastCodeModify = false;
                    this.numberModifies = 0;
                 },
                 error =>  this.errorMessage = `Impossibile cancellare le modifiche precedentemente apportate.`
            );

    }

    deleteLastPearlUpdates() {

        console.log("Chiamata a metodo deleteLastPearlUpdates()");

        // chiamata alla procedura AnalyzeXML del Service
        this._pearlEditorService.deleteLastPearlUpdates(this.project)
            .subscribe(
                 response => {
                    //this.pearlFileReceived = true;
                    this.rules = response.stresponse.data.response[0][0];
                    this.cmEditor.setValue(this.rules);
                    console.log("Pearl File: " + this.rules);
                    this.lastCodeModify = false;
                    this.numberModifies--;
                    if(this.numberModifies == 0) {
                        this.codeModify = false;
                    }
                 },
                 error =>  this.errorMessage = `Impossibile cancellare l'ultima modifica apportata.`
            );

    }

}