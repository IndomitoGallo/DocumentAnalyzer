import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }                   from './app.component';
import { AnalyzerComponent }              from './document-analyzer/analyzer.component';
import { AnalyzerService }                from './document-analyzer/analyzer.service';
import { ProjectsComponent }              from './projects/projects.component';
import { ProjectsService }                from './projects/projects.service';
import { PearlEditorComponent }           from './pearl-editor/pearlEditor.component';
import { PearlEditorService }             from './pearl-editor/pearlEditor.service';
import { CodemirrorComponent }           from './pearl-editor/codemirror.component';
import { AnnotatorInstallerComponent }    from './annotator-installer/annotatorInstaller.component';
import { AnnotatorInstallerService }      from './annotator-installer/annotatorInstaller.service';
import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule
  ],
  declarations: [
    AppComponent,
    AnalyzerComponent,
    ProjectsComponent,
    PearlEditorComponent,
    AnnotatorInstallerComponent,
    CodemirrorComponent
  ],
  providers: [
    AnalyzerService,
    ProjectsService,
    PearlEditorService,
    AnnotatorInstallerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
