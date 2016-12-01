"use strict";
var router_1 = require('@angular/router');
var analyzer_component_1 = require('./document-analyzer/analyzer.component');
var projects_component_1 = require('./projects/projects.component');
var pearlEditor_component_1 = require('./pearl-editor/pearlEditor.component');
var annotatorInstaller_component_1 = require('./annotator-installer/annotatorInstaller.component');
var appRoutes = [
    {
        path: '',
        redirectTo: '/projects',
        pathMatch: 'full'
    },
    {
        path: 'projects',
        component: projects_component_1.ProjectsComponent
    },
    {
        path: 'document-analyzer/:project',
        component: analyzer_component_1.AnalyzerComponent
    },
    {
        path: 'pearl-editor/:project',
        component: pearlEditor_component_1.PearlEditorComponent
    },
    {
        path: 'annotator-installer/:project',
        component: annotatorInstaller_component_1.AnnotatorInstallerComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map