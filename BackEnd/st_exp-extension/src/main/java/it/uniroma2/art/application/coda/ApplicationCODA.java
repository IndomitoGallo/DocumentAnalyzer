package it.uniroma2.art.application.coda;


import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;

import it.uniroma2.art.coda.core.CODACore;
import it.uniroma2.art.coda.exception.ConverterException;
import it.uniroma2.art.coda.exception.DependencyException;
import it.uniroma2.art.coda.exception.PRParserException;
import it.uniroma2.art.coda.exception.RDFModelNotSetException;
import it.uniroma2.art.coda.pearl.model.ProjectionRule;
import it.uniroma2.art.coda.pearl.model.ProjectionRulesModel;
import it.uniroma2.art.coda.provisioning.ComponentProvisioningException;
import it.uniroma2.art.coda.structures.SuggOntologyCoda;
import it.uniroma2.art.owlart.exceptions.ModelAccessException;
import it.uniroma2.art.owlart.exceptions.QueryEvaluationException;
import it.uniroma2.art.owlart.models.ModelFactory;
import it.uniroma2.art.owlart.models.RDFModel;

/**
 * La classe si ha la responsabilità di effettuare tutte le operazioni che si interfacciano al framework CODA e 
 * che riguardano la generazione delle triple RDF e l’aggiunta di esse al triple store.
 * @author Luca Talocci
 *
 */
public class ApplicationCODA {
	
	private CODACore codaCore;
	private JCas jcas;
	private File pearlFile;
	
	public ApplicationCODA(RDFModel model, ModelFactory<?> modelFact, CODACore codaCore, JCas jcas, File pearlFile){
		this.codaCore = codaCore;
		this.jcas = jcas;
		this.pearlFile = pearlFile;
		this.codaCore.initialize(model, modelFact);
		this.codaCore.setJCas(this.jcas);
	}
	
	/**
	 * Il metodo genera una preview delle triple generabili dall'applicazione di tutte le regole Pearl 
	 * presenti nel repository a tutte le annotazioni presenti nel CAS.
	 * @return lista di oggetti SuggOntologyCoda
	 * @throws PRParserException
	 * @throws ComponentProvisioningException
	 * @throws ConverterException
	 * @throws ModelAccessException
	 * @throws QueryEvaluationException
	 * @throws DependencyException
	 * @throws RDFModelNotSetException
	 */
	public List<SuggOntologyCoda> suggestTriples() throws PRParserException, ComponentProvisioningException, ConverterException, 
														  ModelAccessException, QueryEvaluationException, DependencyException, 
														  RDFModelNotSetException {
		
		try {
			codaCore.setProjectionRulesModelAndParseIt(pearlFile);
		} catch (PRParserException | RDFModelNotSetException e) {
			e.printStackTrace();
		}
		
		ProjectionRulesModel prModel = codaCore.getProjRuleModel();
		
		List<SuggOntologyCoda> listSuggOntCoda = new ArrayList<SuggOntologyCoda>();
		
		for(Annotation ann : jcas.getAnnotationIndex()){
			
			//System.out.println("E' presente una nuova annotazione");
			
			String uimaType = ann.getType().getName();
			Collection<ProjectionRule> prList = prModel.getStandardProjectionRulesByTypeName(uimaType);
			for(ProjectionRule pr : prList) {
				SuggOntologyCoda suggOntCoda = new SuggOntologyCoda(ann);
				try {
					codaCore.executeProjectionRule(pr, ann, suggOntCoda);
				} catch (ComponentProvisioningException | ConverterException | ModelAccessException
						| QueryEvaluationException | DependencyException e) {
					e.printStackTrace();
				}
				listSuggOntCoda.add(suggOntCoda);
				//System.out.println("annotazione processata --> " + suggOntCoda.getAnnotation().getType().getName());
			}

		}
		
		return listSuggOntCoda;
	}
	
	/**
	 * Il metodo genera una preview delle triple generabili dall'applicazione di una regola Pearl 
	 * presente nel repository ad una specifica annotazione.
	 * @param annotationId
	 * @param uimaType
	 * @return lista di oggetti SuggOntologyCoda
	 * @throws PRParserException
	 * @throws ComponentProvisioningException
	 * @throws ConverterException
	 * @throws ModelAccessException
	 * @throws QueryEvaluationException
	 * @throws DependencyException
	 * @throws RDFModelNotSetException
	 */
	public List<SuggOntologyCoda> suggestTriplesOfAnnotation(int annotationId, String uimaType) throws PRParserException, 
																ComponentProvisioningException, ConverterException, 
																ModelAccessException, QueryEvaluationException, DependencyException, 
																RDFModelNotSetException {
		
		try {
			codaCore.setProjectionRulesModelAndParseIt(pearlFile);
		} catch (PRParserException | RDFModelNotSetException e) {
			e.printStackTrace();
		}
		
		ProjectionRulesModel prModel = codaCore.getProjRuleModel();
		
		Collection<ProjectionRule> prList = prModel.getStandardProjectionRulesByTypeName(uimaType);
		
		Annotation desiredAnn = null;
		for(Annotation ann : jcas.getAnnotationIndex()){
			if(ann.getAddress() == annotationId) {
				desiredAnn = ann;
			}
		}
		
		List<SuggOntologyCoda> listSuggOntCoda = new ArrayList<SuggOntologyCoda>();
		
		for(ProjectionRule pr : prList) {
			SuggOntologyCoda suggOntCoda = new SuggOntologyCoda(desiredAnn);
			try {
				codaCore.executeProjectionRule(pr, desiredAnn, suggOntCoda);
			} catch (ComponentProvisioningException | ConverterException | ModelAccessException
					| QueryEvaluationException | DependencyException e) {
				e.printStackTrace();
			}
			listSuggOntCoda.add(suggOntCoda);
		}
		
		return listSuggOntCoda;
	}
	
	/**
	 * Il metodo restituisce le regole Pearl presenti nel repository e applicabili ad una specifica annotazione.
	 * @param annotationId
	 * @return lista degli id delle regole Pearl
	 * @throws PRParserException
	 * @throws RDFModelNotSetException
	 */
	public List<String[]> getUsefulPearlRules(int annotationId) throws PRParserException, RDFModelNotSetException {
		
		try {
			codaCore.setProjectionRulesModelAndParseIt(pearlFile);
		} catch (PRParserException | RDFModelNotSetException e) {
			e.printStackTrace();
		}
		
		ProjectionRulesModel prModel = codaCore.getProjRuleModel();

		Annotation desiredAnn = null;
		for(Annotation ann : jcas.getAnnotationIndex()){
			if(ann.getAddress() == annotationId) {
				desiredAnn = ann;
			}
		}
		
		String uimaType = desiredAnn.getType().getName();
		
		Collection<ProjectionRule> prList = prModel.getStandardProjectionRulesByTypeName(uimaType);
		
		List<String[]> rules = new ArrayList<String[]>();
		
		for(ProjectionRule pr : prList) {
			String[] ruleInfo = { pr.getId(), pr.getUIMAType(), Integer.toString(desiredAnn.getAddress())};
			rules.add(ruleInfo);
		}		
		
		return rules;
		
	}

}
