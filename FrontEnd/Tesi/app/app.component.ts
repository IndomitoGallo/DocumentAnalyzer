import { Component } from '@angular/core';
//Librerie per richieste/risposte Http
//import { HTTP_PROVIDERS }    from 'angular2/http';
//librerie per il meccanismo di Routing
//import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>'
})

export class AppComponent {

  constructor(private router: Router) { }

}
