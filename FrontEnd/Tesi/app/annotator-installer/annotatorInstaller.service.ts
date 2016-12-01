import {Injectable} from '@angular/core';
import {BackEndURL} from '../backEndURL';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import { Resp } from '../response/resp';

@Injectable()
export class AnnotatorInstallerService {

    constructor (private http: Http) {}

    installAnnotator(formData : FormData) {
        return Observable.create((observer: any) => {
            var request = new XMLHttpRequest();
            request.open("post", BackEndURL + "/installAnnotator", true);
            request.getResponseHeader("Access-Control-Allow-Origin");
            request.send(formData); 
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
