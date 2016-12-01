Experimental extension for Semantic Turkey
==========================================
This is an experimental extension for Semantic Turkey (`0.12`, see property st.version inside `pom.xml`).

The class `it.uniroma2.art.semanticturkey.extensions.example.services.Example` is an example service.
It includes the service method `sayHi`, which can be invoked by fetching the following URL:

http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/Example/sayHi?name=Manuel

In general, a service method will be exposed at the following URL:

http://localhost:1979/semanticturkey/`${project.groupId}`/`${project.artifactId}`/`ClassName`/`methodName`?`ctx_project=ProjectName`&`param1name`=`arg1`&..&`paramNname`=`argN`

where:

* `${project.groupId}` is the project group identifier (see `pom.xml`)
* `${project.artifactId}` is the project artifact identifier (see `pom.xml`)
* `ClassName` is the simple (non qualified) name of a service class
* `methodName` is the name of a published service method
* `ctx_project` indicate the current project for executing a service
* `paramNname` is the name of the n-th parameter of the service method
* `argN` is the argument bound to a parameter


How to create a new extension project
-------------------------------------
1. Change the project `groupId` and `artifactId`
2. Create a new package for the service classes
3. In `src/main/webapp/WEB-INF/mvc-dispatcher-servlet.xml`, replace `it.uniroma2.art.semanticturkey.extensions.example` inside the attribute `base-package` of the element `context:component-scan` with the new service package
4. Update `src/main/firefox/{chrome.manifest,install,rdf}` (if you plan to develop a Firefox extension)