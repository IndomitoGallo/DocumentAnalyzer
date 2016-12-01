package it.uniroma2.art.application.services;

import org.apache.commons.io.IOUtils;
import org.apache.uima.UIMAFramework;
import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.analysis_engine.AnalysisEngineProcessException;
import org.apache.uima.jcas.JCas;
import org.apache.uima.resource.ResourceInitializationException;
import org.apache.uima.resource.ResourceSpecifier;
import org.apache.uima.util.InvalidXMLException;
import org.apache.uima.util.XMLInputSource;
import org.json.JSONException;
import org.osgi.framework.BundleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import it.uniroma2.art.application.AppContext;
import it.uniroma2.art.application.coda.ApplicationCODA;
import it.uniroma2.art.application.domain.HtmlFile;
import it.uniroma2.art.application.utilities.AnnotatorsUtils;
import it.uniroma2.art.application.utilities.DAUtils;
import it.uniroma2.art.application.utilities.HtmlParser;
import it.uniroma2.art.application.utilities.PearlUtils;
import it.uniroma2.art.coda.core.CODACore;
import it.uniroma2.art.coda.exception.ConverterException;
import it.uniroma2.art.coda.exception.DependencyException;
import it.uniroma2.art.coda.exception.PRParserException;
import it.uniroma2.art.coda.exception.ProjectionRuleModelNotSet;
import it.uniroma2.art.coda.exception.RDFModelNotSetException;
import it.uniroma2.art.coda.exception.UnassignableFeaturePathException;
import it.uniroma2.art.coda.osgi.bundle.CODAOSGiFactory;
import it.uniroma2.art.coda.provisioning.ComponentProvisioningException;
import it.uniroma2.art.coda.structures.ARTTriple;
import it.uniroma2.art.coda.structures.SuggOntologyCoda;
import it.uniroma2.art.owlart.exceptions.ModelAccessException;
import it.uniroma2.art.owlart.exceptions.ModelCreationException;
import it.uniroma2.art.owlart.exceptions.ModelUpdateException;
import it.uniroma2.art.owlart.exceptions.QueryEvaluationException;
import it.uniroma2.art.owlart.exceptions.UnavailableResourceException;
import it.uniroma2.art.owlart.exceptions.UnsupportedQueryLanguageException;
import it.uniroma2.art.owlart.io.RDFFormat;
import it.uniroma2.art.owlart.model.NodeFilters;
import it.uniroma2.art.owlart.models.ModelFactory;
import it.uniroma2.art.owlart.models.OWLArtModelFactory;
import it.uniroma2.art.owlart.models.OWLModel;
import it.uniroma2.art.owlart.models.RDFSModel;
import it.uniroma2.art.owlart.models.conf.ModelConfiguration;
import it.uniroma2.art.owlart.query.MalformedQueryException;
import it.uniroma2.art.semanticturkey.exceptions.ProjectInconsistentException;
import it.uniroma2.art.semanticturkey.generation.annotation.GenerateSTServiceController;
import it.uniroma2.art.semanticturkey.generation.annotation.RequestMethod;
import it.uniroma2.art.semanticturkey.plugin.PluginManager;
import it.uniroma2.art.semanticturkey.services.STServiceAdapter;
import it.uniroma2.art.semanticturkey.servlet.JSONResponseREPLY;
import it.uniroma2.art.semanticturkey.servlet.Response;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;


/**
 * La classe espone tutti i servizi dell’applicazione, raggiungibili tramite richieste http.
 * @author Luca Talocci
 */
@GenerateSTServiceController 
@Validated 
@Component 
@Controller 
@Configurable
public class DocumentAnalyzer extends STServiceAdapter {
	
	private static final String SERVICE_NAME = "****DocumentAnalyzer**** ";
    
	private AppContext context;
	
	@Autowired
	private CODAOSGiFactory codaOSGiFactory;
	
  	//bundleContext is the BundleContext associated with the current bundle
	@Autowired
	private BundleContext bundleContext;
	
	public DocumentAnalyzer() {
		System.out.println(SERVICE_NAME + " started");
	}
	
	/**
	 * Il metodo restituisce la lista degli annotatori utilizzabili nel contesto dell'applicazione
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getAnnotators
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response getAnnotators() {
		
		System.out.println("\n" + SERVICE_NAME + "method getAnnotators");
		
		String[] responseData = AnnotatorsUtils.getAnnotators(getProject().getName());
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	/**
	 * Il metodo restituisce la lista degli id delle annotazioni generate.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getAnnotationsId
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response getAnnotationsId() {
		
		System.out.println("\n" + SERVICE_NAME + "method getAnnotationsId");
		
		String[] responseData = DAUtils.getAnnotationsId(this.context.getJcas());
		
		//String[] responseData = DAUtils.getAnnotationsId();
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo esegue tutte le operazioni necessarie all'analisi del documento caricato.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/analyze
	 * @param annotator String annotatore scelto per analizzare il file
	 * @param lng String linguaggio del file da analizzare
	 * @return Response
	 * @throws ModelCreationException 
	 * @throws ProjectInconsistentException 
	 * @throws UnavailableResourceException 
	 * @throws IOException 
	 * @throws InvalidXMLException 
	 * @throws ResourceInitializationException 
	 * @throws AnalysisEngineProcessException 
	 * @throws TransformerException 
	 * @throws ParserConfigurationException 
	 * @throws SAXException 
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response analyze(String annotator, String lng, String inputFormat) throws ModelCreationException, UnavailableResourceException, ProjectInconsistentException, InvalidXMLException, IOException, ResourceInitializationException, AnalysisEngineProcessException, SAXException, ParserConfigurationException, TransformerException {
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method analyze");
		
		//Effettuo un controllo per verificare che il file passato in input corrisponda al formato inputFormat
		if(inputFormat.compareTo("text") == 0 && this.context.getExtension().compareTo("txt") != 0) {
			inputFormat = "html";
		}
		else if(inputFormat.compareTo("html") == 0 && this.context.getExtension().compareTo("html") != 0) {
			inputFormat = "text";
		}
		
		CODACore codaCore = codaOSGiFactory.getInstance(bundleContext);
		
		OWLModel model = getOWLModel().forkModel();		
		OWLArtModelFactory<?> mf = OWLArtModelFactory.createModelFactory(PluginManager.getOntManagerImpl(
					getProject().getOntologyManagerImplID()).createModelFactory());
		codaCore.initialize(model, mf);
		
		context.setCodaCore(codaCore);
		context.setModel(model);
		
		//Next we set up in AppContext the pearl file to be used
		context.setPearlFile(PearlUtils.getPearlFile());
		File inputFile = context.getFileToBeAnalyzed();
		
		//Next we extract a specific UIMA pear (annotator) to call an UIMA AE
		String descrPathString = AnnotatorsUtils.getAnnotator(annotator);
		
		//Next we create the Analysis Engine and the relative JCas
		ResourceSpecifier specifier = UIMAFramework.getXMLParser()
												   .parseResourceSpecifier(new XMLInputSource(descrPathString));
		AnalysisEngine ae = UIMAFramework.produceAnalysisEngine(specifier);
		JCas jcas = ae.newJCas();
		
		//Next we upload a text file
		String fileToBeAnalyzed = null;
		if(inputFormat.compareTo("html") != 0) {
			fileToBeAnalyzed = DAUtils.fileToString(inputFile); 
		}
		
		//Qui verifico se il file è una pagina web: in tal caso effettuo delle operazioni
		HtmlFile htmlFile = null;
		
		if(inputFormat.compareTo("html") == 0) {
			
			String inputHtmlText = DAUtils.fileToString(inputFile);
			
			htmlFile = new HtmlFile();
			htmlFile.setPrefix(HtmlParser.trackPrefix(inputHtmlText));
			htmlFile.setContent(HtmlParser.detagHtmlText(inputHtmlText));
			fileToBeAnalyzed = htmlFile.getContent();
		}
		
		//Now that AE is ready it can be invoked to analyze/annotate a text
		jcas.reset();
		jcas.setDocumentLanguage(lng);
		jcas.setDocumentText(fileToBeAnalyzed);		
		ae.process(jcas);	
		
		//Next we set the analyzed jcas in the AppContext
		context.setJcas(jcas);
		
		//Next we construct the HTML String with span annotations
		String analyzedHtmlText = DAUtils.getHtmlView(jcas, inputFormat, annotator);
		
		//Next we construct the Html output string
		if(inputFormat.compareTo("html") == 0) {
			String htmlTaggedText = HtmlParser.tagHtmlText(analyzedHtmlText);
			analyzedHtmlText = htmlFile.getPrefix() + "<body>" + htmlTaggedText + "</html>";
		}
		
		//Finally we construct the method response
		String legend = AnnotatorsUtils.getLegend(jcas, inputFormat);
		String[] responseData = { legend, analyzedHtmlText };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
	}
	
	
	/**
	 * Il metodo permette l'upload di un file in una directory del server.
	 * @param file
	 * @return
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.POST)
	public Response uploadFile(MultipartFile file) throws IOException {
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method uploadFile");
		
		String filename = file.getOriginalFilename();
		int index = filename.lastIndexOf('.');
		String extension = filename.substring(index);
		filename = filename.substring(0,index);
		
		File inputFile = File.createTempFile(filename, extension);
		
		BufferedWriter bw = new BufferedWriter(new FileWriter(inputFile));
		byte[] byteText = file.getBytes();
		bw.write(new String(byteText , Charset.forName("UTF-8")));
		bw.close();
		System.out.println("Salvo nel context --> " + extension.substring(1));
		context = new AppContext(inputFile, extension.substring(1));
        
		String[] responseData = { "upload success" };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo permette l'upload e l'installazione, in una directory del server, di un annotatore che potrà quindi
	 * essere utilizzato per l'analisi di documenti.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/installAnnotator
	 * @param file
	 * @return
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.POST)
	public Response installAnnotator(MultipartFile file, String ctx_project) throws IOException {
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method installAnnotator");  
		
		File annotator = File.createTempFile(file.getOriginalFilename().substring(0, file.getOriginalFilename().length() - 5), ".pear");
		file.transferTo(annotator);
		
		AnnotatorsUtils.installPear(annotator, ctx_project);
        
		String[] responseData = {"upload success"};
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	/**
	 * Il metodo permette la cancellazione "logica" di tutti gli annotatori installati nel contesto del progetto precedentemente aperto.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/deleteInstalledAnnotators
	 * @param file
	 * @return
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response deleteInstalledAnnotators() throws IOException {
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method deleteInstalledAnnotators");  
		
		AnnotatorsUtils.deleteInstalledAnnotators(getProject().getName());
        
		String[] responseData = {"delete success"};
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	

	/**
	 * Il metodo restituisce il codice Pearl dell'applicazione.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getPearl
	 * @author Luca Talocci
	 * @throws IOException 
	 */
	@GenerateSTServiceController
	public Response getPearl() throws IOException {
		
		System.out.println("\n" + SERVICE_NAME + "method getPearl"); 
		
		File pearlFile = PearlUtils.getPearlFile();
		String pearlFileString = PearlUtils.pearlFileToString(pearlFile);
		String[] responseData = { pearlFileString };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
	
	}
	

	/**
	 * Il metodo permette la modifica del file Pearl.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/savePearl
	 * @author Luca Talocci 
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.POST)
	public Response editPearl(String pearlCode) throws IOException {		
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method editPearl"); 
		
		PearlUtils.editPearlFile(pearlCode);

		String[] responseData = { pearlCode };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo cancella tutte le modifiche apportate al codice Pearl.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/deletePearlUpdates
	 * @author Luca Talocci 
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response deletePearlUpdates() throws IOException {		
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method deletePearlUpdates"); 

		String pearlFileString = PearlUtils.pearlFileToString(PearlUtils.deleteUpdates());
		
		String[] responseData = { pearlFileString };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo cancella l'ultima modifica apportata al codice Pearl.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/deleteLastPearlUpdates
	 * @author Luca Talocci 
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.GET)
	public Response deleteLastPearlUpdates() throws IOException {		
		
		System.out.println("\n" + SERVICE_NAME + "Chiamata a method deleteLastPearlUpdates"); 
		
		String pearlFileString = PearlUtils.pearlFileToString(PearlUtils.deleteLastUpdates());
		
		String[] responseData = { pearlFileString };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo permette la modifica del codice Pearl tramite il caricamento di nuove regole presenti in un file .pr
	 * che viene caricato in una directory del server.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/uploadPearl
	 * @author Luca Talocci
	 * @throws IOException 
	 */
	@GenerateSTServiceController (method = RequestMethod.POST)
	public Response uploadPearl(MultipartFile file) throws IOException {

		System.out.println("\n" + SERVICE_NAME + "method uploadPearl"); 
		
		String filename = file.getOriginalFilename();
		int index = filename.lastIndexOf('.');
		String extension = filename.substring(index);
		if(extension.compareTo(".pr") != 0) {
			String error = "Il file caricato non ha estensione .pr";
			System.out.println(SERVICE_NAME + error + "\n");
			String[] errorResponse = { error };
			JSONResponseREPLY response = DAUtils.createJSONResponse(errorResponse);
			return response;
		}
		filename = filename.substring(0,index);
		File inputPearlFile = File.createTempFile(filename, extension);
		file.transferTo(inputPearlFile);

		String pearlFileString = PearlUtils.pearlFileToString(PearlUtils.updatePearlFile(inputPearlFile));

		String[] responseData = { pearlFileString };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}

	
	
	/**
	 * Il metodo restituisce una preview di tutte le triple RDF generate dall'applicazione.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getTriplesPreview
	 * @author Luca Talocci 
	 * @throws ProjectInconsistentException 
	 * @throws UnavailableResourceException 
	 * @throws UnassignableFeaturePathException 
	 * @throws ProjectionRuleModelNotSet 
	 * @throws RDFModelNotSetException 
	 * @throws DependencyException 
	 * @throws QueryEvaluationException 
	 * @throws MalformedQueryException 
	 * @throws ModelAccessException 
	 * @throws UnsupportedQueryLanguageException 
	 * @throws ConverterException 
	 * @throws ComponentProvisioningException 
	 * @throws PRParserException 
	 * @throws JSONException 
	 */
	@GenerateSTServiceController
	public Response getTriplesPreview() throws UnavailableResourceException, ProjectInconsistentException, PRParserException, ComponentProvisioningException, ConverterException, UnsupportedQueryLanguageException, ModelAccessException, MalformedQueryException, QueryEvaluationException, DependencyException, RDFModelNotSetException, ProjectionRuleModelNotSet, UnassignableFeaturePathException, JSONException {
		
		System.out.println("\n" + SERVICE_NAME + "method getTriplesPreview"); 
		
		ModelFactory<ModelConfiguration> modelFact = PluginManager.getOntManagerImpl(
					getProject().getOntologyManagerImplID()).createModelFactory();
		
		ApplicationCODA applicationCoda = new ApplicationCODA(context.getModel(), modelFact, context.getCodaCore(),
															  context.getJcas(), context.getPearlFile());
		
		List<SuggOntologyCoda> listSuggOntCoda = applicationCoda.suggestTriples();
		context.setSuggestedTriples(listSuggOntCoda);		
		
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(listSuggOntCoda, "multiple");
		return respJSON;
		
	}
	
	
	/**
	 * Il metodo aggiunge le triple generate al triple store
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/addTriples
	 * @return
	 * @author Luca Talocci
	 * @throws ModelUpdateException 
	 */
	@GenerateSTServiceController
	public Response addTriples() throws ModelUpdateException {
		
		System.out.println("\n" + SERVICE_NAME + "method addTriples"); 
		
		RDFSModel model = context.getModel();
		List<SuggOntologyCoda> suggTriples = context.getSuggestedTriples();
		for (SuggOntologyCoda sugg : suggTriples){
			List<ARTTriple> triples = sugg.getAllARTTriple();
			for (ARTTriple t : triples){
				model.addTriple(t.getSubject(), t.getPredicate(), t.getObject(), NodeFilters.MAINGRAPH);
			}
		}
		
		String[] responseData = { "add success" };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
	}
	
	/**
	 * Il metodo restituisce la preview delle triple generate dall'applicazione di una singola regola Pearl ad 
	 * una specifica annotazione.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getTriplesPreviewofAnnotation
	 * @author Luca Talocci 
	 * @throws JSONException 
	 * @throws ProjectInconsistentException 
	 * @throws UnavailableResourceException 
	 * @throws UnassignableFeaturePathException 
	 * @throws ProjectionRuleModelNotSet 
	 * @throws RDFModelNotSetException 
	 * @throws DependencyException 
	 * @throws QueryEvaluationException 
	 * @throws MalformedQueryException 
	 * @throws ModelAccessException 
	 * @throws UnsupportedQueryLanguageException 
	 * @throws ConverterException 
	 * @throws ComponentProvisioningException 
	 * @throws PRParserException 
	 */
	@GenerateSTServiceController
	public Response getTriplesPreviewOfAnnotation(int annotationId, String uimaType) throws JSONException, UnavailableResourceException, ProjectInconsistentException, PRParserException, ComponentProvisioningException, ConverterException, UnsupportedQueryLanguageException, ModelAccessException, MalformedQueryException, QueryEvaluationException, DependencyException, RDFModelNotSetException, ProjectionRuleModelNotSet, UnassignableFeaturePathException {
		
		System.out.println("\n" + SERVICE_NAME + "method getTriplesPreviewOfAnnotation"); 
		
		ModelFactory<ModelConfiguration> modelFact = PluginManager.getOntManagerImpl(
					getProject().getOntologyManagerImplID()).createModelFactory();
		
		//Istanzio ApplicationCODA
		ApplicationCODA applicationCoda = new ApplicationCODA(context.getModel(), modelFact, context.getCodaCore(), 
															  context.getJcas(), context.getPearlFile());
		
		List<SuggOntologyCoda> listSuggOntCoda = applicationCoda.suggestTriplesOfAnnotation(annotationId, uimaType);
		context.addSuggestedTriples(listSuggOntCoda);
		
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(listSuggOntCoda, "single");
		return respJSON;
		
	}

	/**
	 * Il metodo restituisce le regole Pearl applicabili ad una specifica annotazione. 
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getUsefulPearlRules
	 * @param annotationId
	 * @return
	 * @throws UnavailableResourceException
	 * @throws ProjectInconsistentException
	 * @throws PRParserException
	 * @throws RDFModelNotSetException
	 */
	@GenerateSTServiceController
	public Response getUsefulPearlRules(int annotationId) throws UnavailableResourceException, ProjectInconsistentException, PRParserException, RDFModelNotSetException {
		
		System.out.println("\n" + SERVICE_NAME + "method getUsefulPearlRules");
		
		ModelFactory<ModelConfiguration> modelFact = PluginManager.getOntManagerImpl(
				getProject().getOntologyManagerImplID()).createModelFactory();
		
		ApplicationCODA applicationCoda = new ApplicationCODA(context.getModel(), modelFact, context.getCodaCore(),
				  context.getJcas(), context.getPearlFile());

		List<String[]> usefulPearlRules = applicationCoda.getUsefulPearlRules(annotationId);
		
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(usefulPearlRules);
		return respJSON;
		
	}
	
	/**
	 * Il metodo restituisce il contenuto testuale di una specifica annotazione.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getAnnotationContent
	 * @param annotationId
	 * @return
	 */
	@GenerateSTServiceController
	public Response getAnnotationContent(int annotationId) {
		
		System.out.println("\n" + SERVICE_NAME + "method getAnnotationContent");
		
		String content = DAUtils.getAnnotationContent(annotationId, this.context.getJcas());
		
		String[] responseData = { content };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	/**
	 * Il metodo restituisce il tipo Uima di una specifica annotazione
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getAnnotationType
	 * @param annotationId
	 * @return
	 */
	@GenerateSTServiceController
	public Response getAnnotationType(int annotationId) {
		
		System.out.println("\n" + SERVICE_NAME + "method getAnnotationType");
		
		String content = DAUtils.getAnnotationType(annotationId, this.context.getJcas());
		
		String[] responseData = { content };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	/**
	 * Il metodo restiuisce una view HTML che rappresenta l'albero delle annotazioni contenute in una specifica annotazione.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/getAnnotationTree
	 */
	@GenerateSTServiceController
	public Response getAnnotationTree(int annotationId) {
		
		System.out.println("\n" + SERVICE_NAME + "method getAnnotationTree");
		
		String content = DAUtils.getAnnotationTree(annotationId);
		
		String[] responseData = { content };
		JSONResponseREPLY respJSON = DAUtils.createJSONResponse(responseData);
		return respJSON;
		
	}
	
	/**
	 * Il metodo genera un file .rdf scaricabile dall'utente contenente tutte le triple aggiunte al triple store.
	 * URL: http://localhost:1979/semanticturkey/it.uniroma2.art.semanticturkey/st_exp-extension/DocumentAnalyzer/exportTriples
	 * @throws ModelUpdateException 
	 * @throws IOException 
	 */
	@RequestMapping(value = "/DocumentAnalyzer/exportTriples", 
			method = org.springframework.web.bind.annotation.RequestMethod.GET)
	public HttpEntity<byte[]> exportTriples(/*HttpServletResponse oRes*/) throws ModelUpdateException {
		
		System.out.println("\n" + SERVICE_NAME + "method exportTriples");
		
		ByteArrayOutputStream out = new ByteArrayOutputStream();
	    HttpHeaders responseHeaders = new HttpHeaders();
	    byte[] documentBody = null;
	    
		File tempServerFile;
		try {
			tempServerFile = DAUtils.exportTriples(context.getSuggestedTriples(), context.getModel());
			RDFFormat rdfFormat = RDFFormat.guessRDFFormatFromFile(tempServerFile);
			rdfFormat = RDFFormat.RDFXML;
			FileInputStream is = new FileInputStream(tempServerFile);
			responseHeaders.set("Access-Control-Allow-Origin", "*");
			responseHeaders.add("Content-Type", rdfFormat.getMIMEType());
			responseHeaders.add("Content-Length", Integer.toString((int) tempServerFile.length()));
			responseHeaders.add("Content-Disposition", "attachment; filename=triples.rdf");
			IOUtils.copy(is, out);
			documentBody = out.toByteArray();
			is.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return new HttpEntity<byte[]>(documentBody, responseHeaders);
		
	}

	
}
