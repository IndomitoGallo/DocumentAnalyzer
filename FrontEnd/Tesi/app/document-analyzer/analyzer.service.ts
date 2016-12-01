import {Injectable} from '@angular/core';
import {BackEndURL} from '../backEndURL';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import { Resp } from '../response/resp';
import { RespTriples } from '../response/respTriples';
import { RespRules } from '../response/respRules';

@Injectable()
export class AnalyzerService {

    constructor (private http: Http) {}

    getAnnotators(project: string): Observable<Resp> {
        return this.http.get(BackEndURL + '/getAnnotators?ctx_project=' + project)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    getAnnotationsId(project: string): Observable<Resp> {
        return this.http.get(BackEndURL + '/getAnnotationsId?ctx_project=' + project)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    analyze(annotatorName: string, language: string, inputFormat: string, project: string): Observable<Resp> {

        return this.http.get(BackEndURL + '/analyze?' +
                             'annotator=' + annotatorName + '&' +
                             'lng=' + language + '&' +
                             'inputFormat=' + inputFormat + '&' +
                             'ctx_project=' + project)
                        .map(this.extractData)
                        .catch(this.handleError);

    }

    uploadFile(formData : FormData) {

        return Observable.create((observer: any) => {
            var request = new XMLHttpRequest();
            request.open("post", BackEndURL + "/uploadFile", true);
            request.send(formData);  /* Send to server */

            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        observer.next(JSON.parse(request.response));
                        observer.complete();
                    } else {
                        observer.error(request.response);
                    }
                }
            };
        });

    }

    getTriplesPreviewOfAnnotation(annotationId: string, uimaType: string, project: string): Observable<RespTriples> {

        return this.http.get(BackEndURL + '/getTriplesPreviewOfAnnotation?annotationId=' + annotationId +
                                          '&uimaType=' + uimaType + '&ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    getTriplesPreview(project: string): Observable<RespTriples> {

        return this.http.get(BackEndURL + '/getTriplesPreview?ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    addTriples(project: string): Observable<Resp> {

        return this.http.get(BackEndURL + '/addTriples?ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    getAnnotationContent(annotationId: string, project: string): Observable<Resp> {

        return this.http.get(BackEndURL + '/getAnnotationContent?annotationId=' + annotationId + '&ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    getAnnotationTree(annotationId: string, project: string): Observable<Resp> {

        return this.http.get(BackEndURL + '/getAnnotationTree?annotationId=' + annotationId + '&ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    getAnnotationType(annotationId: string, project: string): Observable<Resp> {

        return this.http.get(BackEndURL + '/getAnnotationType?annotationId=' + annotationId + '&ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    getUsefulPearlRules(annotationId: string, project: string): Observable<RespRules> {

        return this.http.get(BackEndURL + '/getUsefulPearlRules?annotationId=' + annotationId + '&ctx_project=' + project)
                      .map(this.extractData)
                      .catch(this.handleError);

    }

    exportTriples(project: string) {

        var httpReq = new XMLHttpRequest();
        httpReq.open("GET", BackEndURL + '/exportTriples?ctx_project=' + project, true);
        httpReq.setRequestHeader("Access-Control-Allow-Origin", "*");
        console.log("URL --> " + BackEndURL + '/exportTriples?ctx_project=' + project)
        httpReq.responseType = "blob";

        return new Observable((o: any) => {
            //handle the request completed
            httpReq.onreadystatechange = function(event) {
                if (httpReq.readyState === 4) { //request finished and response is ready
                    if (httpReq.status === 200) {
                        console.log("Risposta ricevuta");
                        o.next(httpReq.response);
                        o.complete();
                    } else {
                        throw new Error(httpReq.statusText);
                    }
                }
            };
            //execute the get
            httpReq.send();
        }).catch(error => {
            console.error(error);
            return Observable.throw(error);
        });

    }

    deleteInstalledAnnotators(project: string): Observable<Resp> {
        return this.http.get(BackEndURL + '/deleteInstalledAnnotators?ctx_project=' + project)
                        .map(this.extractData)
                        .catch(this.handleError);
    }


    disconnectFromProject(project: string) {

        var url: string = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st-core-services/Projects";
        var request = new XMLHttpRequest();
        request.open("get", url + "/disconnectFromProject?consumer=SYSTEM&projectName=" + project, true);
        request.setRequestHeader("Accept", "application/xml");

        return new Observable((o: any) => {
            //handle the request completed
            request.onreadystatechange = function(event) {
                if (request.readyState === 4) { //request finished and response is ready
                    if (request.status === 200) {

                        console.log("Response --> " + request.responseText);

                        o.next(request.responseText);
                        o.complete();

                    } else {
                        throw new Error(request.statusText);
                    }
                }
            };
            //execute the post
            request.send();
        })

    }

    /*
     * Il metodo extractData è un'utility per gestire la risposta dal server
     * e quindi parsare bene il json.
     */
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
          throw new Error('Bad response status: ' + res.status);
        }
        console.log("RES = " + JSON.stringify(res));
        let body = res.json();
        console.log("BODY = " + JSON.stringify(body));
        return body || { };
    }

    /*
     * Il metodo handleError serve a catturare un eventuale errore proveniente dal server.
     */
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
                      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
