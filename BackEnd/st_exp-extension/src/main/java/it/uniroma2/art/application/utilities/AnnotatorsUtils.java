package it.uniroma2.art.application.utilities;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.pear.tools.PackageBrowser;
import org.apache.uima.pear.tools.PackageInstaller;

import it.uniroma2.art.application.domain.UIMAAnnotation;
import it.uniroma2.art.semanticturkey.resources.Config;

/**
 * La classe offre delle utility per una facile gestione degli annotatori.
 * @author Luca Talocci
 */
public class AnnotatorsUtils {
	
	private final static String UTIL_NAME = "****AnnotatorsUtils**** ";
	
	//Installation Directory for Pear files
	private static File installDir =  new File(Config.getDataDir() + File.separator + "MyApp" + File.separator + "PearInstallDirectory");
	
	//Annotatori di default dell'applicazione
	private static HashMap<String, String> annotatorsDescriptors;
	//HashMap Initialization
    static
    {
    	annotatorsDescriptors = new HashMap<String, String>();
    	annotatorsDescriptors.put("RoomNumber", installDir + 
    			File.separator + "RoomNumberAnnotator" + File.separator + "RoomNumberAnnotator_pear.xml");
    	annotatorsDescriptors.put("DateTime", installDir + 
    			File.separator + "DateTimeAnnotator" + File.separator + "DateTimeAnnotator_pear.xml");
    	annotatorsDescriptors.put("RoomNumberAndDateTime", installDir + 
    			File.separator + "RoomNumberAndDateTimeAnnotator" + File.separator + "RoomNumberAndDateTimeAnnotator_pear.xml");
    	annotatorsDescriptors.put("Meeting", installDir + 
    			File.separator + "MeetingAnnotator" + File.separator + "MeetingAnnotator_pear.xml");
    }
    //Annotatori correntemente in uso dall'applicazione
    private static HashMap<String, String> cacheDescriptors = new HashMap<String, String>();
    //Annotatori associati ai progetti di ST
    private static HashMap<String, String> annotatorsOfProject = new HashMap<String, String>();
    
    //Colori da associare alle annotazioni
    private static final List<String> colors;
    //HashMap Initialization
    static
    {
    	colors = new ArrayList<String>();
    	colors.add("#FFCC99");
    	colors.add("#33FF99");
    	colors.add("#FF66FF");
    	colors.add("#99CCFF");
    	colors.add("#7FFFD4");
    	colors.add("#FFB6C1");
    	colors.add("#FFE4B5");
    	colors.add("#E6E6FA");
    	colors.add("#F5DEB3");
    	colors.add("#D8BFD8");
    	colors.add("#D2691E");
    	colors.add("#8B008B");
    	colors.add("#F5F5DC");
    	colors.add("#8A2BE2");
    	colors.add("#48D1CC");
    	colors.add("#2E8B57");
    	colors.add("#90EE90");
    	colors.add("#DAA520");
    	colors.add("#FA8072");
    	colors.add("#FF6347");
    	colors.add("#808000");
    	colors.add("#F4A460");
    	colors.add("#D2B48C");
    	colors.add("#FFE4E1");
    	colors.add("#BC8F8F");
    	colors.add("#FFF0F5");
    	colors.add("#B0C4DE");
    	colors.add("#E6E6FA");
    	colors.add("#F0FFF0");
    	colors.add("#DCDCDC");
    }
    
    /**
     * Il metodo restituisce il path del descrittore .xml di un annotatore specifico.
     * @return String annotator path
     */
    public static String getAnnotator(String annotatorName) {
    	
    	System.out.println(UTIL_NAME + "method getAnnotator");
    	
    	return annotatorsDescriptors.get(annotatorName);
    	
    }
    
    /**
     * Il metodo restituisce la lista degli annotatori installati nell'applicazione e nel progetto in input.
     * @return String[]
     */
    public static String[] getAnnotators(String project) {
    	
    	System.out.println(UTIL_NAME + "method getAnnotators");
    	
    	for(String key : annotatorsOfProject.keySet()) {
    		if(annotatorsOfProject.get(key).compareTo(project) == 0) {
    			String annotatorName = cacheDescriptors.get(key);
    			annotatorsDescriptors.put(annotatorName, key);
    		}
    	}
    	
    	String[] annotatorsKeys = new String[annotatorsDescriptors.size()];
    	
    	int count = 0;
    	for(String key : annotatorsDescriptors.keySet()) {
    		annotatorsKeys[count] = key;
    		count++;
    	}
    	
    	return annotatorsKeys;
    	
    }
    
    /**
     * Il metodo assegna un colore a ciascuna annotazione in base al tipo Uima.
     */
    public static List<UIMAAnnotation> setColors(List<UIMAAnnotation> annotations) {
    	
    	HashMap<String, String> colorsOfTypes = new HashMap<String, String>();
    	
    	int maxColors = colors.size() - 1;
    	
    	int count = 0;
    	
    	for(UIMAAnnotation a : annotations) {
    		
    		if(count > maxColors) {
    			colorsOfTypes.put(a.getAnnotatorName(), generateColor());
    			count++;
    		}
			
			if(!colorsOfTypes.containsKey(a.getAnnotatorName())) {
				colorsOfTypes.put(a.getAnnotatorName(), colors.get(count));
				count++;
			}
			
		}
    	
    	for(UIMAAnnotation a : annotations) {
    		
    		a.setColor(colorsOfTypes.get(a.getAnnotatorName()));
    		
    	}
    	
    	return annotations;
    	
    }
    
    /**
	 * Il metodo restituisce una legenda per identificare i tipi Uima attraverso i colori.
	 * @param annotatorName
	 * @param htmlText
	 * @return
	 */
	public static String getLegend(JCas jcas, String inputFormat) {
		
		System.out.println(UTIL_NAME + "method getLegend");
		
		String legend = "<br>Annotators: ";
		
		List<String> types = new ArrayList<String>();
		
		for(Annotation a : jcas.getAnnotationIndex()) {
			
			String typeName = a.getType().getName();
			int index = typeName.lastIndexOf('.');
			typeName = typeName.substring(index + 1);
			
			if(typeName.compareTo("DocumentAnnotation") != 0) {
				if(!types.contains(typeName)) {
					types.add(typeName);
				}
			}
			
		}
		
		String[] colorParameters = new String[types.size()];
		
		int count = 0;
		if(inputFormat.compareTo("html") == 0) {
			for(String type : types) {
				legend = legend + "<label class='checkbox-inline' style='background-color: " + colors.get(count) + "'>" +
								  "<input class=\"ckbx\" onclick='selectFrameAnnotator(\"" + colors.get(count) + "\")' checked type='checkbox' value=''>" + 
								  type +
								  " </label>";
				colorParameters[count] = colors.get(count);
				count++;
			}
		}
		else {
			for(String type : types) {
				legend = legend + "<label class='checkbox-inline' style='background-color: " + colors.get(count) + "'>" +
								  "<input class=\"ckbx\" onclick='selectAnnotator(\"" + colors.get(count) + "\")' checked type='checkbox' value=''>" + 
								  type +
								  "</label>";
				colorParameters[count] = colors.get(count);
				count++;
			}
		}
		
		if(inputFormat.compareTo("html") == 0) {
			legend = legend + "<label class='checkbox-inline'>" +
					  "<input id=\"selectAll\" onclick='selectAllFrameAnnotators(";
	
			for(int i = 0; i < colorParameters.length - 1; i++) {
				legend = legend + "\"" + colorParameters[i] + "\",";
			}
			legend = legend + "\"" + colorParameters[colorParameters.length - 1] + "\"";
			
			legend = legend + ")' checked type='checkbox' value=''>" + 
							  "<p id=\"selectAllLabel\">Deselect All</p></label>";
		}
		else {
			legend = legend + "<label class='checkbox-inline'>" +
					  "<input id=\"selectAll\" onclick='selectAllAnnotators(";
	
			for(int i = 0; i < colorParameters.length - 1; i++) {
				legend = legend + "\"" + colorParameters[i] + "\",";
			}
			legend = legend + "\"" + colorParameters[colorParameters.length - 1] + "\"";
			
			legend = legend + ")' checked type='checkbox' value=''>" + 
							  "<p id=\"selectAllLabel\">Deselect All</p></label>";
		}
		
		return legend + "<br>";
	
	}
	
	/**
	 * Il metodo permette l'installazione di un annotatore all'interno di una directory del server.
	 * @param pearFile
	 * @return String
	 * @throws IOException 
	 */
	public static void installPear(File pearFile, String project) throws IOException {
		
		System.out.println(UTIL_NAME + "method installPear");
		
		//Recupero il nome dell'annotatore
		String annotatorName = getOriginalPearFilename(pearFile.getName());
		
		File directory = new File(installDir + File.separator + project);
		if(!directory.exists()) {
			System.out.println(UTIL_NAME + "Creo una directory per il progetto");
			directory.mkdir();
		}
		
		//Installo l'annotatore		
		//PackageBrowser instPear = PackageInstaller.installPackage(installDir, pearFile, true);
		PackageBrowser instPear = PackageInstaller.installPackage(directory, pearFile, true);
		
		//Aggiungo il nome del descrittore al dizionario annotatorsDescriptors
		try {
			annotatorsDescriptors.put(annotatorName, instPear.getComponentPearDescPath());
			cacheDescriptors.put(instPear.getComponentPearDescPath(), annotatorName);
			annotatorsOfProject.put(instPear.getComponentPearDescPath(), project);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	/**
	 * Il metodo cancella "logicamente" tutti gli annotatori installati nel contesto del progetto precedentemente in uso.
	 * @param pearFile
	 * @return String
	 * @throws IOException 
	 */
	public static void deleteInstalledAnnotators(String project) throws IOException {
		
		System.out.println(UTIL_NAME + "method deleteInstalledAnnotators");
		
		for(String key : annotatorsOfProject.keySet()) {
    		if(annotatorsOfProject.get(key).compareTo(project) == 0) {
    			String annotatorName = cacheDescriptors.get(key);
    			annotatorsDescriptors.remove(annotatorName);
    		}
    	}

	}

	/**
	 * Il metodo restituisce il nome originale di un file .pear
	 * @return
	 */
	private static String getOriginalPearFilename(String filename) {
		
		System.out.println(UTIL_NAME + "method getOriginalPearFilename");
		
		int i = 0;
		Boolean condition = false;
		while(!condition) {
			if(filename.charAt(i) == '0' || filename.charAt(i) == '1' || filename.charAt(i) == '2' ||
			   filename.charAt(i) == '3' || filename.charAt(i) == '4' || filename.charAt(i) == '5' ||
			   filename.charAt(i) == '6' || filename.charAt(i) == '7' || filename.charAt(i) == '8' ||
			   filename.charAt(i) == '9') {
				condition = true;
			}
			i++;
		}
		return filename.substring(0, i - 1);
		
	}
	
	/**
	 * Il metodo genera dei colori casuali se quelli di default dell'applicazione sono in numero inferiore
	 * rispetto ai tipi Uima rintracciati nel testo.
	 * @return
	 */
	private static String generateColor() {
		
		System.out.println(UTIL_NAME + "method generateColor");
		
		String color = "#";
		
		Random random = new Random();
		
		for(int i = 0; i < 6; i++) {
			color = color + random.nextInt(9);
		}
        
        return color;
		
	}

}
