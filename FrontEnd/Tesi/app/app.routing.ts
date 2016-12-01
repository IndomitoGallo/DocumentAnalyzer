import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent }                   from './app.component';
import { AnalyzerComponent }              from './document-analyzer/analyzer.component';
import { ProjectsComponent }              from './projects/projects.component';
import { PearlEditorComponent }           from './pearl-editor/pearlEditor.component';
import { AnnotatorInstallerComponent }    from './annotator-installer/annotatorInstaller.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'document-analyzer/:project',
    component: AnalyzerComponent
  },
  {
    path: 'pearl-editor/:project',
    component: PearlEditorComponent
  },
  {
    path: 'annotator-installer/:project',
    component: AnnotatorInstallerComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
