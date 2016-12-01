import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

import { Resp } from '../response/resp';

@Injectable()
export class ProjectsService {

    url: string = "http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st-core-services/Projects";

    constructor () {}

    listProjects() {

        var request = new XMLHttpRequest();
        request.open("get", this.url + "/listProjects", true);
        request.setRequestHeader("Accept", "application/xml");

        return new Observable((o: any) => {
            //handle the request completed
            request.onreadystatechange = function(event) {
                if (request.readyState === 4) { //request finished and response is ready
                    if (request.status === 200) {

                        var parser = new DOMParser();
                        var stResp = parser.parseFromString(request.responseText, "application/xml");
                        var data = stResp.documentElement.childNodes[3];
                        var projects: any = [];
                        for(var i = 0; i < data.childNodes.length; i++) {
                            if(data.childNodes[i].nodeName != "#text") {
                                projects.push(data.childNodes[i].textContent);
                            }
                        }
                        console.log("Projects --> " + projects);

                        o.next(projects);
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

    accessProject(project: string) {

        var request = new XMLHttpRequest();
        request.open("get", this.url + "/accessProject?consumer=SYSTEM&projectName=" + project +
                                       "&requestedAccessLevel=RW&requestedLockLevel=NO", true);
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

    deleteProject(project: string) {

        var request = new XMLHttpRequest();
        request.open("get", this.url + "/deleteProject?consumer=SYSTEM&projectName=" + project, true);
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

    createProject(project: string, modelType: string, baseURI: string, tripleStore: string,
                  modelConfigClass: string, modelConfig: string) {

        var request = new XMLHttpRequest();
        request.open("get", this.url + "/createProject?consumer=SYSTEM&projectName=" + project +
                                       "&modelType=" + modelType + "&baseURI=" + baseURI +
                                       "&ontManagerFactoryID=" + tripleStore +
                                       "&modelConfigurationClass=" + modelConfigClass +
                                       "&modelConfiguration=" + modelConfig, true);
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


    private extractProjects(response: string): string[] {

        var parser = new DOMParser();
        var stResp = parser.parseFromString(response, "application/xml");
        var data = stResp.documentElement.childNodes[3];
        var projects: any = [];
        for(var i = 0; i < data.childNodes.length; i++) {
            if(data.childNodes[i].nodeName != "#text") {
                projects.push(data.childNodes[i].textContent);
            }
        }
        console.log("Projects --> " + projects);
        return projects;

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
