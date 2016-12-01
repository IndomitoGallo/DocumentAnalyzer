# DocumentAnalyzer
Repository ufficiale di un'applicazione sviluppata con tecnologie Javascript/Angular2 e J2EE/Spring per l'analisi di documenti di testo o pagine html secondo opportuni annotatori (sviluppati secondo gli standard UIMA) e la generazione di triple RDF basate sulle annotazioni rintracciate nel testo

#FrontEnd
Il progetto Angular2 è contenuto nella cartella "FrontEnd".
Per farlo partire è necessario aprire il prompt dei comandi, spostarsi nell cartella "Tesi" tramite il comando cd ed eseguire:
- "npm install" per installare tutte le dipendenze di Angular2
- "npm install codemirror" per installare codemirror 
- "npm start" per far partire l'applicazione
Il "mode" che ho creato per il linguaggio Pearl su codemirror è già definito all'interno del FrontEnd nel path "app/pearl-editor/pearl" e non necessita quindi di nulla se non dell'installazione di codemirror.

#BackEnd
L'estensione di ST si trova nella cartella "BackEnd" e contiene anche il Javadoc.

#SemanticTurkeyData
Per far funzionare l'applicazione ho creato nella cartella "SemanticTurkeyData" una mia cartella MyApp presente nel .zip "MyApp".
MyApp è strutturata in 4 sottocartelle:
- File --> in cui viene salvato il file .rdf generato per il download delle triple
- FileProcessed --> che credo forse non serva più viste alcune modifiche che avevo apportato al codice
- PearInstallDirectory --> in cui vengono installati i file pearl dell'applicazione. In essa sono già presenti i 4 annotatori di default che ho creato.
- Pearl --> contenente il file .pr di riferimento dell'applicazione

La cartella "MyApp" può essere tranquillamente rinominata, a patto di modificare anche le seguenti righe di codice:
- PearlUtils.java --> riga 17
- AnnotatorsUtils.java --> riga 27

#Annotators
Nella cartella "Annotators" sono presenti i 4 annotatori di default dell'applicazione più un altro di prova che si chiama "EmailAnnotator" e l'annotatore di leggi che ho utilizzato. Questi ultimi due possono essere installati direttamente da interfaccia grafica.

#File di Test
Nella cartella "File di Test" ci sono tutti i file .txt e .html che potete utilizzare per testare l'applicazione con gli annotatori in dotazione.
