import { Component, OnInit }  from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { HTTP_PROVIDERS }      from 'angular2/http';
//import { Router, RouteParams, ROUTER_DIRECTIVES } from 'angular2/router';
//import { NgForm }    from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BackEndURL } from '../backEndURL';

import { Resp } from '../response/resp';
import { Triple } from '../domain/triple';
import { Rule } from '../domain/rule';

import { AnalyzerService } from './analyzer.service';


@Component({
  templateUrl: 'app/document-analyzer/analyzer.component.html'
})

export class AnalyzerComponent implements OnInit {

    errorMessage: string;
    annErrorMessage: string;
    tripleErrorMessage: string;

    annotators: string[];
    annotationsId: string[];

    //FormData
    annotatorChosen: string;
    language: string;
    inputFormat: string;
    encoding: string;

    annotatorsLoaded: boolean = false;
    analysisStarted: boolean = false;
    analysisComplete: boolean = false;

    charEncoding = ['UTF-8','ISO-8859-1','US-ASCII','UTF-16BE','UTF-16LE','UTF-16'];
    languages = ['en','de','es','fr','it','pt','ja','ko-kr','pt-br','zh-cn','zh-tw','x-unspecified'];
    inputFormats = ['text', 'html'];

    htmlText: any = "Loading HTML view...";

    //Valori booleani per settare la view corretta
    viewHTML: boolean = false;

    textAnalysis: boolean = false;
    htmlAnalysis: boolean = false;

    inputFile: File;

    legend: any;

    cacheTriples: Triple[];
    triplesList: string[][];
    triplesPreviewReceived: boolean = false;

    generatedTriples: Triple[];
    triplesGenerated: boolean = false;
    addingTriples: boolean = false;

    project: string;

    annotationId: string;
    annotationContent: any;
    annotationTree: string;
    annotationType: string;
    usefulPearlRules: Rule[];
    annContentAndPearlRulesReceived: boolean = false;
    annTriplesPreviewReceived: boolean = false;
    annContentReceived: boolean = false;
    pearlRulesReceived: boolean = false;
    annTriples: Triple[];
    
    downloadURL: any;
    downloadLink: any;
    downloadReady: boolean = false;

    constructor(private _analyzerService: AnalyzerService, private _router: Router, 
                private route: ActivatedRoute, public sanitizer: DomSanitizer) {
        this.annotators = [];
        this.annotationsId = [];
        this.generatedTriples = [];
        this.usefulPearlRules = [];
        this.annotatorChosen = "";
        this.inputFormat = "";
        this.language = "";
        
    }

    fileChangeEvent(file: File) {

        console.log("Chiamata a metodo fileChangeEvent()");

        this.inputFile = file;

    }

    analyze() {

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
            .subscribe(
                (response: any) => {
                    this.startAnalysis(this.annotatorChosen, this.language, this.inputFormat),
                    (error: any) => this.errorMessage = "Errore durante l'upload del file. Ritenta..";
                }
            );

    }

    startAnalysis(annotatorChosen: string, language: string, inputFormat: string) {

        console.log("Chiamata a metodo startAnalysis()");

        this._analyzerService.analyze(annotatorChosen, language, inputFormat, this.project)
            .subscribe(
                 response => {
                    if(inputFormat == 'text') {
                        this.legend = this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
                        this.htmlText = this.sanitizer.bypassSecurityTrustHtml(
                                "<p>" + response.stresponse.data.response[0][1].replace(/\n/g, "<br>") + "</p>");
                        this.getAnnotationsId("text");
                        //this.textAnalysis = true;
                    }
                    else {
                        this.legend = this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
                        this.htmlText = this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][1]);
                        this.getAnnotationsId("html");
                        //this.htmlAnalysis = true;
                    }
                    
                    //this.analysisComplete = true;
                    /*
                    if(inputFormat == 'text') {
                        this.enableButtons();
                    } else {
                        this.enableFrameButtons();
                    }
                    */
                 },
                 error =>  this.errorMessage = `Non è stato possibile analizzare il file. Ritenta..`
            );
    }

    
    getAnnotationsId(inputFormat: string) {
        console.log("Chiamata a metodo startAnalysis()");

        this._analyzerService.getAnnotationsId(this.project)
            .subscribe(
                 response => {
                    this.annotationsId = response.stresponse.data.response[0];
                    if(inputFormat == 'text') {
                        this.textAnalysis = true;
                    } else {
                        this.htmlAnalysis = true;
                    }
                    this.analysisComplete = true;
                 },
                 error =>  this.errorMessage = `Non è stato possibile recuperare l'id delle annotazioni. Ritenta..`
            );
    }
    

    private enableButtons() {
        window.setTimeout(() => {
            var buttons = document.getElementsByClassName("annotation-btn");
            console.log(buttons);
            console.log("btns length " + buttons.length);
            var i: number;
            for(i = 0; i < buttons.length; i++) {

                buttons[i].addEventListener("click", event => {
                                            var button: HTMLButtonElement = <HTMLButtonElement>event.target;
                                            var idAnn = button.getAttribute("id");
                                            console.log(idAnn + " button pressed");
                                            this.getAnnotationContent(idAnn);
                                        });
            }

        });
    }

    private enableFrameButtons() {
        window.setTimeout(() => {
            var buttons = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("annotation-btn");
            console.log(buttons);
            console.log("btns length " + buttons.length);
            var i: number;
            for(i = 0; i < buttons.length; i++) {

                buttons[i].addEventListener("click", event => {
                                            var button: HTMLButtonElement = <HTMLButtonElement>event.target;
                                            var idAnn = button.getAttribute("id");
                                            console.log(idAnn + " button pressed");
                                            this.getAnnotationContent(idAnn);
                                        });
            }

        }, 3000);
    }

    getAnnotationContent(annotationId: string) {

        console.log("Chiamata a metodo getAnnotationContent()");

        this.annotationId = annotationId;

        this.annTriplesPreviewReceived = false;

        this._analyzerService.getAnnotationContent(annotationId, this.project)
            .subscribe(
                 response => {
                    this.annotationContent = this.sanitizer.bypassSecurityTrustHtml(response.stresponse.data.response[0][0]);
                    //this.getAnnotationTree(annotationId);
                    this.getAnnotationType(annotationId);
                 },
                 error =>  this.annErrorMessage = `Impossibile recuperare il contenuto dell'annotazione selezionata.`
            );

    }

    getAnnotationTree(annotationId: string) {

        console.log("Chiamata a metodo getAnnotationTree()");

        this.annotationId = annotationId;

        this._analyzerService.getAnnotationTree(annotationId, this.project)
            .subscribe(
                 response => {
                    this.annotationTree = response.stresponse.data.response[0][0];
                    console.log(this.annotationTree);
                    this.getUsefulPearlRules(annotationId);
                    //this.annContentReceived = true;
                 },
                 error =>  this.annErrorMessage = `Impossibile recuperare l'albero dell'annotazione selezionata.`
            );

    }

    getAnnotationType(annotationId: string) {

        console.log("Chiamata a metodo getAnnotationType()");

        this.annotationId = annotationId;

        this._analyzerService.getAnnotationType(annotationId, this.project)
            .subscribe(
                 response => {
                    this.annotationType = response.stresponse.data.response[0][0];
                    console.log(this.annotationType);
                    this.getUsefulPearlRules(annotationId);
                 },
                 error =>  this.annErrorMessage = `Impossibile recuperare il tipo dell'annotazione selezionata.`
            );

    }

    getUsefulPearlRules(annotationId: string) {

        console.log("Chiamata a metodo getUsefulPearlRules()");

        this._analyzerService.getUsefulPearlRules(annotationId, this.project)
            .subscribe(
                 response => {
                    this.usefulPearlRules = this.extractRules(response.stresponse.data.response[0]);
                    //this.pearlRulesReceived = true;
                    this.annContentAndPearlRulesReceived = true;
                    console.log(this.annContentAndPearlRulesReceived);
                 },
                 error =>  this.annErrorMessage = `Impossibile recuperare le regole pearl utilizzabili.`
            );

    }

    getTriplesPreviewOfAnnotation(uimaType: string, annotationId: string) {

        console.log("Chiamata a metodo getTriplesPreviewOfAnnotation()");

        this._analyzerService.getTriplesPreviewOfAnnotation(annotationId, uimaType, this.project)
            .subscribe(
                 response => {
                    this.annTriples = this.extractTriples(response.stresponse.data.triples[0]);
                    this.annTriplesPreviewReceived = true;
                    console.log(this.annTriplesPreviewReceived);
                 },
                 error =>  this.annErrorMessage = `Non è stato possibile generare le triple RDF. Ritenta..`
            );
    }

    addTriplesOfAnnotation() {

      console.log("Chiamata a metodo addTriplesOfAnnotation()");

      this.addingTriples = true;

      this._analyzerService.addTriples(this.project)
          .subscribe(
               response => {
                  var i: number;
                  for(i=0; i < this.annTriples.length; i++) {
                      this.generatedTriples.push(this.annTriples[i]);
                  }
                  this.annTriples = [];
                  this.annTriplesPreviewReceived = false;
                  this.addingTriples = false;
                  this.downloadLink = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/exportTriples?ctx_project=" + this.project;
                  this.triplesGenerated = true;
                  console.log(this.generatedTriples);
               },
               error =>  this.annErrorMessage = `Non è stato possibile agiungere le triple RDF al MAINGRAPH. Ritenta..`
          );

    }

    getTriplesPreview() {

        console.log("Chiamata a metodo getTriplesPreview()");

        this._analyzerService.getTriplesPreview(this.project)
            .subscribe(
                 response => {
                    this.cacheTriples = this.extractTriples(response.stresponse.data.triples[0]);
                    this.triplesPreviewReceived = true;
                    console.log(this.triplesPreviewReceived);
                 },
                 error =>  this.tripleErrorMessage = `Non è stato possibile generare le triple RDF. Ritenta..`
            );
    }

    addTriples() {

      console.log("Chiamata a metodo addTriples()");

      this.addingTriples = true;

      this._analyzerService.addTriples(this.project)
          .subscribe(
               response => {
                  this.generatedTriples = this.cacheTriples;
                  this.addingTriples = false;
                  this.downloadLink = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/exportTriples?ctx_project=" + this.project;
                  this.triplesGenerated = true;
               },
               error =>  this.errorMessage = `Non è stato possibile agiungere le triple RDF al MAINGRAPH. Ritenta..`
          );

    }
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

    extractRules(rulesList: string[][]): Rule[] {

        var rules: Rule[] = [];
        var i: number;
        console.log("rulesList.length = " + rulesList.length);
        for(i = 0; i < rulesList.length; i++) {
          var rule = new Rule(rulesList[i][0], rulesList[i][1], rulesList[i][2]);
          rules.push(rule);
          console.log("Rule numero " + i + " --> " + rulesList[i][0] + " " + rulesList[i][1]);
        }
        return rules;

    }

    extractTriples(triplesList: string[][]): Triple[] {

        var triples: Triple[] = [];
        var i: number;
        console.log("triplesList.length = " + triplesList.length);
        for(i = 0; i < triplesList.length; i++) {
          var triple = new Triple(triplesList[i][0], triplesList[i][1], triplesList[i][2]);
          triples.push(triple);
          console.log("Tripla numero " + i + " --> " + triplesList[i][0] + " " + triplesList[i][1] + " " + triplesList[i][2]);
        }
        return triples;

    }

    /*
     * Questa funzione viene attivata dal tasto "Torna Indietro" e riporta l'utente
     * alla pagina precedentemente visualizzata.
     */
    newAnalysis() {
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
    }

    disconnectFromProject() {

        console.log("Chiamata a metodo disconnectFromProject()");

        this._analyzerService.deleteInstalledAnnotators(this.project)
                        .subscribe(
                            response => {
                                this._analyzerService.disconnectFromProject(this.project)
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

        //Recupero il nome del progetto
        this.route.params.subscribe(params => {
            this.project = params['project'];
        });
        //carico dal server la lista degli annotatori da visualizzare
        this._analyzerService.getAnnotators(this.project)
                         .subscribe(
                               response  => {
                                  this.annotators = response.stresponse.data.response[0];
                                  console.log("Annotators: " + this.annotators);
                                  this.annotatorsLoaded = true;
                               },
                               error =>  this.errorMessage = <any>error
                          );
    }

    goTo(component: string) {
        if(component == "/document-analyzer") {
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
            this._router.navigate([ component, this.project ]);
        }
    }

}
