package it.uniroma2.art.application.utilities;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.util.XmlCasSerializer;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.util.HtmlUtils;
import org.xml.sax.SAXException;

import it.uniroma2.art.application.domain.UIMAAnnotation;
import it.uniroma2.art.coda.structures.ARTTriple;
import it.uniroma2.art.coda.structures.SuggOntologyCoda;
import it.uniroma2.art.owlart.exceptions.ModelAccessException;
import it.uniroma2.art.owlart.exceptions.UnsupportedRDFFormatException;
import it.uniroma2.art.owlart.io.RDFFormat;
import it.uniroma2.art.owlart.io.RDFNodeSerializer;
import it.uniroma2.art.owlart.model.ARTStatement;
import it.uniroma2.art.owlart.models.RDFSModel;
import it.uniroma2.art.owlart.navigation.ARTStatementIterator;
import it.uniroma2.art.owlart.utilities.RDFIterators;
import it.uniroma2.art.semanticturkey.servlet.JSONResponseREPLY;
import it.uniroma2.art.semanticturkey.servlet.ServletUtilities;
import it.uniroma2.art.semanticturkey.servlet.ServiceVocabulary.RepliesStatus;
import it.uniroma2.art.semanticturkey.servlet.ServiceVocabulary.SerializationType;

/**
 * This class provides some utilities to facilitate DA operations.
 * @author Luca Talocci
 */
public class DAUtils {
	
	private static final String UTIL_NAME = "****DAUtils**** ";
	//Lista delle annotazioni UIMA rintracciate nel testo
	private static List<UIMAAnnotation> UIMAAnnotations;
	
	/**
	 * Il metodo rappresenta una semplice utility per la creazione di risposte JSON nel contesto di SemanticTurkey.
	 * @param content contenuto del messaggio
	 * @return JSONResponseREPLY
	 */
	public static JSONResponseREPLY createJSONResponse(String[] content) {
		
		System.out.println(UTIL_NAME + "method createJSONResponse");
		
		ServletUtilities servUtil = ServletUtilities.getService();
		JSONResponseREPLY respJSON = (JSONResponseREPLY) servUtil.createReplyResponse("request", RepliesStatus.ok, SerializationType.json);
		JSONObject dataElem;
		try {
			dataElem = respJSON.getDataElement();
			dataElem.append("response", content);
		} catch (JSONException e) {
			System.out.println("\n *****JSON_ERROR***** Errore durante la creazione della risposta\n");
		}
		return respJSON;
		
	}
	
	/**
	 * Il metodo rappresenta una semplice utility per la creazione di risposte JSON nel contesto di SemanticTurkey.
	 * @param content contenuto del messaggio
	 * @return JSONResponseREPLY
	 */
	public static JSONResponseREPLY createJSONResponse(List<String[]> content) {
		
		System.out.println(UTIL_NAME + "method createJSONResponse");
		
		ServletUtilities servUtil = ServletUtilities.getService();
		JSONResponseREPLY respJSON = (JSONResponseREPLY) servUtil.createReplyResponse("request", RepliesStatus.ok, SerializationType.json);
		JSONObject dataElem;
		try {
			dataElem = respJSON.getDataElement();
			dataElem.append("response", content);
		} catch (JSONException e) {
			System.out.println("\n *****JSON_ERROR***** Errore durante la creazione della risposta\n");
		}
		return respJSON;
		
	}
	
	/**
	 * Il metodo rappresenta una semplice utility per la creazione di risposte JSON nel contesto di SemanticTurkey.
	 * @param content contenuto del messaggio
	 * @return JSONResponseREPLY
	 */
	public static JSONResponseREPLY createJSONResponse(List<SuggOntologyCoda> listSuggOntCoda, String multiplicity) throws JSONException {
		
		System.out.println(UTIL_NAME + "method createJSONResponse");
		
		ServletUtilities servUtil = ServletUtilities.getService();
		JSONResponseREPLY respJSON;
		respJSON = (JSONResponseREPLY) servUtil.createReplyResponse("request", RepliesStatus.ok, SerializationType.json);
		JSONObject dataElem = null;
		try {
			dataElem = respJSON.getDataElement();
		} catch (JSONException e) {
			System.out.println("\n *****JSON_ERROR***** Errore durante la creazione della risposta\n");
		}
	
		int triplesToReturn = listSuggOntCoda.size();
		
		//int count = 1;
		List<List<String>> triples = new ArrayList<List<String>>();
		if(multiplicity.compareTo("single") != 0) {
			
			for (int i=1; i < triplesToReturn; i++){
				SuggOntologyCoda suggOntCoda = listSuggOntCoda.get(i);
				List<ARTTriple> tripleList = suggOntCoda.getAllARTTriple();
				for (ARTTriple t : tripleList){
					List<String> triple = new ArrayList<String>();
					triple.add(RDFNodeSerializer.toNT(t.getSubject()));
					triple.add(RDFNodeSerializer.toNT(t.getPredicate()));
					triple.add(RDFNodeSerializer.toNT(t.getObject()));
					triples.add(triple);
				}
			}
			
		}
		else {
			
			for (int i=0; i < triplesToReturn; i++){
				SuggOntologyCoda suggOntCoda = listSuggOntCoda.get(i);
				List<ARTTriple> tripleList = suggOntCoda.getAllARTTriple();
				for (ARTTriple t : tripleList){
					List<String> triple = new ArrayList<String>();
					triple.add(RDFNodeSerializer.toNT(t.getSubject()));
					triple.add(RDFNodeSerializer.toNT(t.getPredicate()));
					triple.add(RDFNodeSerializer.toNT(t.getObject()));
					triples.add(triple);
				}
			}
			
		}
		dataElem.append("triples", triples);
		return respJSON;
		
	}
	
	/**
	 * Il metodo restituisce una lista con gli id delle annotazioni Uima.
	 */
	public static String[] getAnnotationsId(JCas jcas) {
		System.out.println(UTIL_NAME + "method getAnnotationsId");
    	
		List<Integer> annotationsIdNumbers = new ArrayList<Integer>();
		
		for(Annotation a : jcas.getAnnotationIndex()) {
			if(a.getAddress() != 1) {
				annotationsIdNumbers.add(a.getAddress());
			}
		}
    	
    	Collections.sort(annotationsIdNumbers);
    	
    	String[] annotationsId = new String[annotationsIdNumbers.size()];
    	
    	int count = 0;
    	
    	for(Integer i : annotationsIdNumbers) {
    		annotationsId[count] = Integer.toString(i);
    		count++;
    	}
    	
    	return annotationsId;
	}


	
	/**
	 * Il metodo converte qualsiasi file di testo in una stringa.
	 * @param file
	 * @return String
	 * @throws IOException 
	 */
	public static String fileToString(File file) throws IOException {
		
		System.out.println(UTIL_NAME + "method fileToString");
		
		String output = "";
		BufferedReader br;
		try {
			br = new BufferedReader(new FileReader(file));
			String sCurrentLine;
			while ((sCurrentLine = br.readLine()) != null) {
				output = output + "\n" + sCurrentLine;
			}
			br.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return output;
		
	}
	
	/**
	 * Il metodo analizza il contenuto del JCAS e restituisce una stringa contenente il testo analizzato e 
	 * convertito in codice HTML.
	 * @throws IOException 
	 * @throws SAXException 
	 * @throws TransformerException 
	 * @throws TransformerFactoryConfigurationError 
	 * @throws ParserConfigurationException 
	 */
	public static String getHtmlView(JCas jcas, String inputFormat, String annotatorName) throws SAXException, IOException, ParserConfigurationException, TransformerException {
		
		System.out.println(UTIL_NAME + "method getHtmlView");
		
		File casFile = null;
		try {
			casFile = File.createTempFile("cas", ".xml");
		} catch (IOException e) {
			e.printStackTrace();
		}
		FileOutputStream outputFile = null;
		try {
			outputFile = new FileOutputStream(casFile);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		try {
			XmlCasSerializer.serialize(jcas.getCas(), outputFile);
		} catch (SAXException | IOException e) {
			e.printStackTrace();
		}
		String textToBeAnalyzed = jcas.getDocumentText();
		return parseHtmlFile(textToBeAnalyzed, casFile, inputFormat, annotatorName, jcas);
		
	}
	
	/**
	 * Il metodo restituisce il contenuto dell'annotazione con id=annotationId.
	 * @param annotationId
	 * @return
	 */
	public static String getAnnotationContent(int annotationId, JCas jcas) {
		
		System.out.println(UTIL_NAME + "method getAnnotationContent");

		String content = null;
		
		for(Annotation a : jcas.getAnnotationIndex()) {
			if(a.getAddress() == annotationId) {
				content = a.getCoveredText();
			}
		}
		
		return content;
		
	}
	
	/**
	 * Il metodo restituisce il tipo Uima dell'annotazione con id=annotationId.
	 * @param annotationId
	 * @return
	 */
	public static String getAnnotationType(int annotationId, JCas jcas) {
		
		System.out.println(UTIL_NAME + "method getAnnotationContent");

		String uimaType = null;
		
		for(Annotation a : jcas.getAnnotationIndex()) {
			if(a.getAddress() == annotationId) {
				uimaType = a.getType().getName();
			}
		}
		
		int index = uimaType.lastIndexOf('.');
		String type = uimaType.substring(index + 1);
		
		return type;
		
	}
	
	/**
	 * Il metodo restituisce l'albero dell'annotazione con id=annotationId.
	 * @param annotationId
	 * @return
	 */
	public static String getAnnotationTree(int annotationId) {
		
		System.out.println(UTIL_NAME + "method getAnnotationTree");

		String content = null;

		for(UIMAAnnotation a : UIMAAnnotations) {
			if(a.getId() == annotationId) {
				content = a.getTree();
			}
		}
		
		return content;
		
	}
	
	/**
	 * Il metodo restituisce la lista delle annotazioni "nested" dell'annotazione con id=annotationId, ovvero 
	 * quelle annotazioni contenute strettamente o parzialmente all'interno dei suoi indici "begin" e "end".
	 * @param annotationId
	 * @return
	 */
	public static List<UIMAAnnotation> getNestedAnnotations(int annotationId) {
		
		System.out.println(UTIL_NAME + "method getNestedAnnotationsId");
		
		List<UIMAAnnotation> nestedAnnotations = new ArrayList<UIMAAnnotation>();
		
		for(UIMAAnnotation a : UIMAAnnotations) {
			if(a.getId() == annotationId) {
				nestedAnnotations = a.getNestedUIMAAnnotations();
			}
		}
		
		return nestedAnnotations;
		
	}
	
	/**
	 * Il metodo restituisce un file .rdf contenente tutte le triple aggiunte al triple store del progetto.
	 * @param annotationId
	 * @return
	 */
	public static File exportTriples(List<SuggOntologyCoda> suggOntCodaList, RDFSModel model) throws IOException {
		
		System.out.println(UTIL_NAME + "method exportTriples");
		
		File tempFile = File.createTempFile("triples", ".rdf");
		
		try {
			BufferedWriter bw = new BufferedWriter(new FileWriter(tempFile));
			Collection<ARTStatement> cStat = new ArrayList<>();
			for(SuggOntologyCoda soc : suggOntCodaList) {
				List<ARTTriple> triples = soc.getAllARTTriple();
				for(ARTTriple triple : triples) {
//					String content = RDFNodeSerializer.toNT(triple.getSubject()) + " " +
//									 RDFNodeSerializer.toNT(triple.getPredicate()) + " " +
//									 RDFNodeSerializer.toNT(triple.getObject()) + "\n\n";
					ARTStatement stat = model.createStatement(triple.getSubject(), triple.getPredicate(), triple.getObject());
					cStat.add(stat);
//					bw.write(content);
				}
			}
			Iterator<ARTStatement> it = cStat.iterator();
			ARTStatementIterator artIt = RDFIterators.createARTStatementIterator(it);
			model.writeRDF(artIt, RDFFormat.NTRIPLES, bw);
			bw.close();
		} catch (IOException | ModelAccessException | UnsupportedRDFFormatException e) {
			e.printStackTrace();
		}
		
		return tempFile;
		
	}
	
	
	/**
	 * Il metodo restituisce prende in input un file html già processato da un AnalysisEngine e
	 * restituisce il file con le annotazioni nell corretta posizione all'interno del testo.
	 * @param xmlFile
	 * @return File
	 * @throws NumberFormatException 
	 * @throws ParserConfigurationException 
	 * @throws TransformerFactoryConfigurationError 
	 * @throws TransformerException 
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 */
	private static String parseHtmlFile(String inputText, File xmlFile, String inputFormat, String annotatorName, JCas jcas) {
		
		System.out.println(UTIL_NAME + "method parseHtmlFile");
		
		
		//System.out.println("\n" + UTIL_NAME + "1 - Recupero nodi Annotation" + "\n");

		List<UIMAAnnotation> annotations = recoverAnnotations(xmlFile, annotatorName, jcas);
		
		//System.out.println("\n" + UTIL_NAME + "2 - Copio il testo del file inserendo le annotazioni inline" + "\n");
		
		String outputText = "";
		
		//System.out.println("Numero caratteri jcas text --> " + jcas.getDocumentText().length());
		
		outputText = outputText + annotateHtmlText(inputText, annotations);

		return outputText;
		
	}
	
	/**
	 * Il metodo restituisce un testo in input e vi inserisce le annotazioni presenti nella lista annotations.
	 * @param inputText
	 * @param annotations
	 * @return String outputText annotated
	 */
	private static String annotateHtmlText(String inputText, List<UIMAAnnotation> annotations) {
		
		System.out.println(UTIL_NAME + "method annotateHtmlText");

		String outputText = "";
		int begin;
		//int end;
		int offset = 0;
		char[] inputArray = HtmlUtils.htmlUnescape(inputText).toCharArray();
		int currentPosition = 0;
		
		AnnotatorsUtils.setColors(annotations);
		
		//System.out.println(UTIL_NAME + "colori settati");
		
		//parso le annotazioni per gestire annotazioni annidate
		annotations = parseNestedAnnotations(annotations);
		
		//System.out.println(UTIL_NAME + "annotazioni innestate parsate");
		
		UIMAAnnotations = annotations;
		
		//System.out.println("Numero caratteri inputText --> " + inputArray.length);
		//System.out.println("Posizione ultimo carattere ultima annotazione --> " + annotations.get(annotations.size() - 1).getEnd());
		
		//copio il testo da annotare inserendo correttamente le annotazioni inline
		for(UIMAAnnotation a : annotations) {
			//memorizzo punto di inizio dell'annotazione
			begin = a.getBegin();
			//copio il testo fino alla posizione Begin
			for(int i = currentPosition; i < begin; i++) {
				outputText = outputText + inputArray[i];
			}
			
			//aggiungo l'annotazione
			outputText = outputText + a.getHTMLContent();
			//System.out.println("\n" + UTIL_NAME + "Annotazione:" + a.toHTMLString() + "\n");
			//memorizzo la posizione corrente
			currentPosition = a.getEnd();
			offset = offset + a.toXMLString().length();
			//System.out.println("currentPosition --> " + currentPosition);
		}
		//copio ciò che resta di InputText
		for(int i = currentPosition; i < inputArray.length; i++) {
			outputText = outputText + inputArray[i];
		}
		
		return outputText;
		
	}
	
	
	/**
	 * Il metodo legge un file in input e ne restituisce le annotazioni rintracciate dall'AnalysisEngine.
	 * @param file
	 * @return List<Annotation>
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	private static List<UIMAAnnotation> recoverAnnotations(File file, String annotator, JCas jcas) {
		
		System.out.println(UTIL_NAME + "method recoverAnnotations");

		List<UIMAAnnotation> annotations = new ArrayList<UIMAAnnotation>();
		
		for(Annotation ann : jcas.getAnnotationIndex()) {					
			
			String annotatorName = ann.getType().getName();
			int index = annotatorName.lastIndexOf('.');
			annotatorName = annotatorName.substring(index+1);
			
			if(annotatorName.compareTo("DocumentAnnotation") != 0) {

	        	UIMAAnnotation a = new UIMAAnnotation(
	        			annotatorName, ann.getAddress(),  
	        			ann.getBegin(), ann.getEnd(), ann.getCoveredText());
	        	annotations.add(a);
	        	
			}
			
			
		}
	    
	    return annotations;
		
	}	
	
	
	/**
	 * Algoritmo di ordinamento di tipo "MergeSort" per gli oggetti di tipo UIMAAnnotation.
	 */
	private static List<UIMAAnnotation> mergeSort(List<UIMAAnnotation> annotations) {
		
	    List<UIMAAnnotation> left = new ArrayList<UIMAAnnotation>();
	    List<UIMAAnnotation> right = new ArrayList<UIMAAnnotation>();
	    
	    int center;
	 
	    if (annotations.size() == 1) {    
	        return annotations;
	    } else {
	        center = annotations.size()/2;
	        // copy the left half of annotations into the left.
	        for (int i=0; i < center; i++) {
	                left.add(annotations.get(i));
	        }	 
	        //copy the right half of annotations into the new arraylist.
	        for (int i = center; i < annotations.size(); i++) {
	                right.add(annotations.get(i));
	        }
	 
	        // Sort the left and right halves of the arraylist.
	        left  = mergeSort(left);
	        right = mergeSort(right);
	 
	        // Merge the results back together.
	        merge(left, right, annotations);
	    }
	    return annotations;
	}
	
	/**
	 * Funzione "merge" dell'algoritmo "MergeSort" per gli oggetti di tipo UIMAAnnotation.
	 * @param left
	 * @param right
	 * @param annotations
	 */
	private static void merge(List<UIMAAnnotation> left, List<UIMAAnnotation> right, List<UIMAAnnotation> annotations) {
	    
		int leftIndex = 0;
	    int rightIndex = 0;
	    int annotationsIndex = 0;
	 
	    // As long as neither the left nor the right ArrayList has
	    // been used up, keep taking the smaller of left.get(leftIndex)
	    // or right.get(rightIndex) and adding it at both.get(bothIndex).
	    while (leftIndex < left.size() && rightIndex < right.size()) {
	        if ( (left.get(leftIndex).compareTo(right.get(rightIndex))) < 0) {
	        	annotations.set(annotationsIndex, left.get(leftIndex));
	            leftIndex++;
	        } else {
	        	annotations.set(annotationsIndex, right.get(rightIndex));
	            rightIndex++;
	        }
	        annotationsIndex++;
	    }
	 
	    List<UIMAAnnotation> rest;
	    int restIndex;
	    if (leftIndex >= left.size()) {
	        // The left ArrayList has been use up...
	        rest = right;
	        restIndex = rightIndex;
	    } else {
	        // The right ArrayList has been used up...
	        rest = left;
	        restIndex = leftIndex;
	    }
	 
	    // Copy the rest of whichever ArrayList (left or right) was not used up.
	    for (int i = restIndex; i < rest.size(); i++) {
	    	annotations.set(annotationsIndex, rest.get(i));
	    	annotationsIndex++;
	    }
	}
	
	/**
	 * Il metodo prende in input una lista di annotazioni e restituisce una lista di annotazioni con le annotazioni "nested"
	 * correttamente parsate. Ne consegue che le annotazioni nested, vengono eliminate dalla lista ed inglobate nell'oggetto 
	 * UIMAAnnotation che le contiene. 
	 */
	private static List<UIMAAnnotation> parseNestedAnnotations(List<UIMAAnnotation> annotations) {
		
		System.out.println(UTIL_NAME + "method parseNestedAnnotations");
		
		if(annotations.isEmpty()) {
			return annotations;
		}
		else {
			//Ordino le annotazioni in base al campo "Begin"
			annotations = mergeSort(annotations);

			//Variabile booleana che blocca il secondo ciclo for se non ci sono più annotazioni annidate
	    	Boolean finished = false;
			//Scorro la lista dalla penultima posizione indietro
	    	int back;
	    	int forward;
	    	//variabile utilizzata per memorizzare la lunghezza parziale della lista nel secondo ciclo for
	    	int length = annotations.size();;
	    	for(back = length-2; back >= 0; back--) {
	    		//Prendo l'annotazione in posizione back nella lista
	    		UIMAAnnotation a = annotations.get(back);
				//verifico se, tra le annotazioni che vanno da back alla fine ce ne sono di annidate rispetto ad a
				for(forward = back + 1; forward < length && !finished; forward++) {
					//prendo l'annotazione in posizione forward
					UIMAAnnotation possibleNestedAnnotation = annotations.get(forward);
					
	    			//L'annotazione non è annidata
					if(a.getEnd() <= possibleNestedAnnotation.getBegin()) {
		    			//da questa annotazione in poi non troverò annotazioni annidate: sono in ordine di Begin
		    			finished = true;
		    		}
					//L'annotazione è completamente annidata
		    		else if(a.getBegin() <= possibleNestedAnnotation.getBegin() 
		    				&& a.getEnd() >= possibleNestedAnnotation.getEnd()) {
		    			a.insertNestedAnnotation(possibleNestedAnnotation);
		    			annotations.remove(forward);
		    			length--;
		    			forward--;
		    		}
		    		else if(a.getBegin() <= possibleNestedAnnotation.getBegin() 
		    				&& a.getEnd() < possibleNestedAnnotation.getEnd()) {
		    			//l'annotazione va messa solo in parte all'interno di a
		    			String message = "PARSING: l'annotazione va messa solo in parte all'interno di a";
		    			System.out.println(UTIL_NAME + message);
		    			//imposto che iterator è "nested"
		    		}
				}
				if(finished) {
					finished = false;
				}
	    	}
			return mergeSort(annotations);
		}
		
	}
	
}
