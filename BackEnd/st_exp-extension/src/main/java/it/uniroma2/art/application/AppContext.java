package it.uniroma2.art.application;

import it.uniroma2.art.coda.core.CODACore;
import it.uniroma2.art.coda.structures.SuggOntologyCoda;
import it.uniroma2.art.owlart.models.RDFSModel;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.uima.jcas.JCas;

/**
 * Modella il contesto dell'applicazione. Memorizza tutti i dati necessari alle operazioni di analisi e 
 * di generazione delle triple. I dati memorizzati sono i seguenti:
 * un oggetto CODACore;
 * un documento da analizzare e la sua relativa estensione (.txt o .html);
 * un file .pr contenente le regole Pearl del repository dell'applicazione;
 * il jcas;
 * un oggetto RDFSModel;
 * le triple RDF generate e disponibili nella preview;
 * le triple RDF aggiunte al triple store.
 * @author Luca Talocci
 */
public class AppContext {
	
	private CODACore codaCore;
	private File fileToBeAnalyzed;
	private String extension;
	private File pearlFile;
	private JCas jcas;
	private RDFSModel model;
	private List<SuggOntologyCoda> suggestedTriples; 
	private List<SuggOntologyCoda> generatedTriples; 
	
	public AppContext(File fileToBeAnalyzed, String extension) {
		this.fileToBeAnalyzed = fileToBeAnalyzed;
		this.extension = extension;
	}
	
	public AppContext(CODACore codaCore, File fileToBeAnalyzed, RDFSModel model) {
		this.fileToBeAnalyzed = fileToBeAnalyzed;
		this.model = model;
		this.codaCore = codaCore;
	}
	
	public File getFileToBeAnalyzed() {
		return fileToBeAnalyzed;
	}
	
	public void setFileToBeAnalyzed(File inputFile) {
		this.fileToBeAnalyzed = inputFile;
	}
	
	public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public File getPearlFile() {
		//in case the pearl file has not been set
		//(ex. if is not generated or loaded, but simply written by user)
		if (pearlFile == null){
			try {
				pearlFile = File.createTempFile("pearl", ".pr");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return pearlFile;
	}

	public void setPearlFile(File pearlFile) {
		this.pearlFile = pearlFile;
	}

	public RDFSModel getModel() {
		return model;
	}

	public void setModel(RDFSModel model) {
		this.model = model;
	}

	public CODACore getCodaCore() {
		return codaCore;
	}

	public void setCodaCore(CODACore codaCore) {
		this.codaCore = codaCore;
	}
	
	public List<SuggOntologyCoda> getSuggestedTriples(){
		return suggestedTriples;
	}
	
	public void setSuggestedTriples(List<SuggOntologyCoda> suggestedTriples){
		this.suggestedTriples = suggestedTriples;
	}
	
	public List<SuggOntologyCoda> getGeneratedTriples() {
		return generatedTriples;
	}

	public void setGeneratedTriples(List<SuggOntologyCoda> generatedTriples) {
		this.generatedTriples = generatedTriples;
	}

	public void addSuggestedTriples(List<SuggOntologyCoda> suggestedTriples) {
		if(this.suggestedTriples == null) {
			this.suggestedTriples = new ArrayList<SuggOntologyCoda>();
		}
		for(SuggOntologyCoda soc : suggestedTriples) {
			this.suggestedTriples.add(soc);
		}
	}
	
	public void close(){
		this.pearlFile.deleteOnExit();
		this.fileToBeAnalyzed.deleteOnExit();
	}

	public JCas getJcas() {
		return jcas;
	}

	public void setJcas(JCas jcas) {
		this.jcas = jcas;
	}
	
	public Boolean initializedParams() {
		
		if(this.codaCore != null && this.model != null) {
			System.out.println("Parametri inizializzati: codaCore --> " + codaCore.hashCode() + ", model --> " + model.getBaseURI());
			return true;
		}
		else {
			System.out.println("Parametri non inizializzati");
			return false;
		}
		
	}

}

