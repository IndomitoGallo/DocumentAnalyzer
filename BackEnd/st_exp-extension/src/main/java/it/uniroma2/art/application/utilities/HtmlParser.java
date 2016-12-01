package it.uniroma2.art.application.utilities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.util.HtmlUtils;

import it.uniroma2.art.application.domain.HtmlTag;

/**
 * La classe offre delle utilità per una facile analisi di pagine web.
 * @author Luca Talocci
 *
 */
public class HtmlParser {
	
	private static final String UTIL_NAME = "****HtmlParser**** ";
	
	private static List<HtmlTag> tags = new ArrayList<HtmlTag>();
	
	//Lista dei tag HTML
	private static final List<String> labels;
	//List Initialization
    static
    {
    	labels = new ArrayList<String>();
    	labels.add("a");
    	labels.add("article");
    	labels.add("aside");
    	labels.add("b");
    	labels.add("blockquote");
    	labels.add("br");
    	labels.add("button");
    	labels.add("div");
    	labels.add("em");
    	labels.add("footer");
    	labels.add("form");
    	labels.add("frame");
    	labels.add("h1");
    	labels.add("h2");
    	labels.add("h3");
    	labels.add("h4");
    	labels.add("h5");
    	labels.add("h6");
    	labels.add("header");
    	labels.add("hr");
    	labels.add("i");
    	labels.add("iframe");
    	labels.add("img");
    	labels.add("input");
    	labels.add("label");
    	labels.add("li");
    	labels.add("nav");
    	labels.add("ol");
    	labels.add("option");
    	labels.add("p");
    	labels.add("pre");
    	labels.add("script");
    	labels.add("section");
    	labels.add("select");
    	labels.add("small");
    	labels.add("span");
    	labels.add("strong");
    	labels.add("table");
    	labels.add("tbody");
    	labels.add("td");
    	labels.add("textarea");
    	labels.add("th");
    	labels.add("thead");
    	labels.add("tr");
    	labels.add("u");
    	labels.add("ul");
    	labels.add("/a");
    	labels.add("/article");
    	labels.add("/aside");
    	labels.add("/b");
    	labels.add("/blockquote");
    	labels.add("/br");
    	labels.add("/button");
    	labels.add("/div");
    	labels.add("/em");
    	labels.add("/footer");
    	labels.add("/form");
    	labels.add("/frame");
    	labels.add("/h1");
    	labels.add("/h2");
    	labels.add("/h3");
    	labels.add("/h4");
    	labels.add("/h5");
    	labels.add("/h6");
    	labels.add("/header");
    	labels.add("/hr");
    	labels.add("/i");
    	labels.add("/iframe");
    	labels.add("/img");
    	labels.add("/input");
    	labels.add("/label");
    	labels.add("/li");
    	labels.add("/nav");
    	labels.add("/ol");
    	labels.add("/option");
    	labels.add("/p");
    	labels.add("/pre");
    	labels.add("/script");
    	labels.add("/section");
    	labels.add("/select");
    	labels.add("/small");
    	labels.add("/span");
    	labels.add("/strong");
    	labels.add("/table");
    	labels.add("/tbody");
    	labels.add("/td");
    	labels.add("/textarea");
    	labels.add("/th");
    	labels.add("/thead");
    	labels.add("/tr");
    	labels.add("/u");
    	labels.add("/ul");
    }
    
    //Lista dei tag HTML che hanno associato per default lo stile display:block
    private static final List<String> blockTags;
	//List Initialization
    static
    {
    	blockTags = new ArrayList<String>();
    	blockTags.add("article");
    	blockTags.add("aside");
    	blockTags.add("b");
    	blockTags.add("div");
    	blockTags.add("footer");
    	blockTags.add("li");
    	blockTags.add("nav");
    	blockTags.add("ol");
    	blockTags.add("section");
    	blockTags.add("table");
    	blockTags.add("ul");
    	blockTags.add("/article");
    	blockTags.add("/aside");
    	blockTags.add("/b");
    	blockTags.add("/div");
    	blockTags.add("/footer");
    	blockTags.add("/li");
    	blockTags.add("/nav");
    	blockTags.add("/ol");
    	blockTags.add("/section");
    	blockTags.add("/table");
    	blockTags.add("/ul");
    }
	
	private static char[] tagHandler = new char[12];
	private static char[] tagBlockHandler = new char[9];
	private static int inputPosition = 0;
	
	
	/**
	 * Il metodo restituisce il contenuto del tag <head> della pagina web
	 * @param inputText
	 * @return String
	 */
	public static String trackPrefix(String inputText) {
		
		System.out.println(UTIL_NAME + "method trackPrefix");
		
		//converto inputText in un array di caratteri
		char[] inputArray = HtmlUtils.htmlUnescape(inputText).toCharArray();
		//array di caratteri che determinerà il raggiungimento del tag <body>
		char[] bodyTag = new char[6];
		//copio i primi sei caratteri del testo per inizializzare l'array "bodyTag"
		for(int i=0; i < 6; i++) {
			bodyTag[i] = inputArray[i];
		}
		
		//int inputPosition = 0;
		String prefix = bodyTag.toString();
		
		//System.out.println("\n" + UTIL_NAME + "Prefix: before while\n");
		
		//copio tutto ciò che precede il tag <body>
		while(String.valueOf(bodyTag).compareTo("<body>") != 0) {
			
			for(int i = 0; i < 5; i++) {
				bodyTag[i] = bodyTag[i+1];
			}	
			bodyTag[5] = inputArray[inputPosition];
			prefix = prefix + bodyTag[5];

			inputPosition++;
		}
		
		//Poiché prefix contiene anche il tag <body>, lo tolgo:
		prefix = prefix.substring(0, prefix.length() - 6);
		
		//tolgo il prefisso che UIMA mette sull'html annotato
		int currentPosition = 0;
		while(prefix.charAt(currentPosition) != '<') {
			currentPosition++;
		}
		prefix = prefix.substring(currentPosition);
 		
		//System.out.println("\n" + UTIL_NAME + "Prefix: " + prefix + "\n");
		
		prefix = insertButtonStyleProperties(prefix);
		
		return prefix;
		
	}
	
	/**
	 * Il metodo restituisce il testo della pagina web privo dei tag html. 
	 * @param inputText testo html completo
	 * @return String testo senza tag Html
	 */
	public static String detagHtmlText(String inputText) {
		
		System.out.println(UTIL_NAME + "method detagHtmlText");
		
		//memorizzo in una variabile la posizione iniziale del testo
		int beginTextPosition = inputPosition;
		//stringa in cui memorizzo i caratteri effettivi del testo
		String outputText = "";
		//stringa che serve a verificare, ad ogni iterazione, se ho rintracciato un tag o meno
		String tag = null;
		//array di caratteri che determinerà il raggiungimento del tag </body>
		char[] endBodyTag = new char[7];
		
		//System.out.println("\n" + UTIL_NAME + "Detag: cerco il tag </body>\n");
		
		while(String.valueOf(endBodyTag).compareTo("</body>") != 0) {
			
			//aggiorno endBodyTag per verificare il raggiungimento del tag </body>
			for(int i = 0; i < 6; i++) {
				endBodyTag[i] = endBodyTag[i+1];
			}
			endBodyTag[6] = inputText.charAt(inputPosition);
			
			//memorizzo in tag l'esito della verifica del metodo verifyTags()
			tag = handleTags();
			
			if(tag == null) { //non ho trovato nessun tag: continuo a copiare il testo
				
				outputText = outputText + inputText.charAt(inputPosition);
				
				//effettuo lo shift dei caratteri di tagHandler
				for(int i = 0; i < tagHandler.length - 1; i++) {
					tagHandler[i] = tagHandler[i+1];
				}
				//aggiorno l'ultimo carattere di tagHandler
				tagHandler[tagHandler.length - 1] = inputText.charAt(inputPosition);
				//aggiorno il valore di inputPosition
				inputPosition++;
			}
			else { //ho trovato un tag
				
				//effettuo un controllo sul prefisso dei tag
				if(verifyCollisions(tag, inputText.toCharArray(), inputPosition)) {
					//aggiungo il carattere corrente a outputText
					outputText = outputText + inputText.charAt(inputPosition);
				}
				else {
					//System.out.println("\n" + UTIL_NAME + "1 - Tag: " + tag + "\n");
					//tolgo l'incipit del tag precedentemente copiato in outputText
					outputText = outputText.substring(0, outputText.length() - tag.length() - 1);
					//memorizzo la posizione di start del tag all'interno del testo
					int beginTag = inputPosition - beginTextPosition - (tag.length() + 1);
					
					//memorizzo l'incipit del tag per comprenderne eventuali attributi
					String incipit = tag;
					while(inputText.charAt(inputPosition) != '>') {
						incipit = incipit + inputText.charAt(inputPosition);
						inputPosition++;
					}
					
					//creo un oggetto di tipo HtmlTag e lo aggiungo alla lista dei tag rintracciati
					HtmlTag htmlTag = new HtmlTag(beginTag, incipit, tag);
					tags.add(htmlTag);
					
					//System.out.println("5 - " + htmlTag.toString());
				}
				
				//effettuo lo shift dei caratteri di tagHandler
				for(int i = 0; i < tagHandler.length - 1; i++) {
					tagHandler[i] = tagHandler[i+1];
				}
				//aggiorno l'ultimo carattere di tagHandler
				tagHandler[tagHandler.length - 1] = inputText.charAt(inputPosition);
				
				//aggiorno il valore di inputPosition
				inputPosition++;
					
			}
			
		}
		
		inputPosition = 0;
		
		return outputText;
		
	}
	
	/**
	 * Il metodo reimposta i tag Html estratti dal testo originale nella corretta posizione.
	 * @param inputText
	 * @return
	 */
	public static String tagHtmlText(String inputText) {
		
		System.out.println(UTIL_NAME + "method tagHtmlText");
		
		//System.out.println("INPUT TEXT --> " + inputText );
		
		String outputText = "";
		
		int textPosition = 0;
		int beginTag;
		char[] spanStart = new char[5];
		char[] spanEnd = new char[6];
		char[] supStart = new char[4];
		
		//inizializzo spanStart
		for(int i = 0; i < 5; i++) {
			spanStart[i] = inputText.charAt(i);
		}
		//inizializzo spanEnd
		for(int i = 0; i < 6; i++) {
			spanEnd[i] = inputText.charAt(i);
		}
		
		for(int i = 0; i < 4; i++) {
			supStart[i] = inputText.charAt(i);
		}
		
		int currentPosition = 0;
		int overflow = 0;
		
		//System.out.println("\n" + UTIL_NAME + "NUMERO TAG --> " + tags.size() + "\n");
		
		for(HtmlTag tag : tags) {
			
			//System.out.println("\n" + UTIL_NAME + "1 - NUOVO TAG --> " + tag.getIncipit() + "\n");
			//System.out.println("\n" + UTIL_NAME + "2 - TAG BEGIN --> " + tag.getBegin() + "\n");
			//System.out.println("\n" + UTIL_NAME + "3 - TEXT POSITION --> " + textPosition + "\n");
			beginTag = tag.getBegin();
			while((beginTag != (textPosition + overflow))) {
				if(String.valueOf(spanStart).compareTo("<span") == 0 || String.valueOf(spanEnd).compareTo("</span") == 0) {
					
					//System.out.println("\n" + UTIL_NAME + "4 - Ho trovato uno <span>\n");
					
					overflow--;
					
					while(inputText.charAt(currentPosition) != '>') {
						//copio il carattere in outputText
						outputText = outputText + inputText.charAt(currentPosition);
						//shift degli elementi di spanStart
						for(int j = 0; j < 4; j++) {
							spanStart[j] = spanStart[j+1];
						}
						//aggiorno l'ultimo carattere di spanStart
						spanStart[4] = inputText.charAt(currentPosition + 5);
						//shift degli elementi di spanEnd
						for(int j = 0; j < 5; j++) {
							spanEnd[j] = spanEnd[j+1];
						}
						//aggiorno l'ultimo carattere di spanEnd
						spanEnd[5] = inputText.charAt(currentPosition + 6);
						//shift degli elementi di buttonStart
						for(int j = 0; j < 3; j++) {
							supStart[j] = supStart[j+1];
						}
						supStart[3] = inputText.charAt(currentPosition + 4);
						
						currentPosition++;
					}
					
				} 
				else if(String.valueOf(supStart).compareTo("<sup") == 0) {
					
					//System.out.println("\n" + UTIL_NAME + "4 - Ho trovato un <sup>\n");
					
					overflow--;
					
					//shift degli elementi di supStart
					for(int i = 0; i < 3; i++) {
						supStart[i] = supStart[i+1];
					}
					//aggiorno l'ultimo carattere di supStart
					supStart[3] = inputText.charAt(currentPosition + 4);
					
					char[] supEnd = new char[5];
					
					while(String.valueOf(supEnd).compareTo("</sup") != 0) {
						
						
						//System.out.println("\n" + UTIL_NAME + "9 - BUTTON END --> " + String.valueOf(supEnd) + "\n");
						//System.out.println("\n" + UTIL_NAME + "10 - OUTPUT TEXT --> " + outputText + "\n");
						//copio il carattere in outputText
						outputText = outputText + inputText.charAt(currentPosition);
						//shift degli elementi di buttonEnd
						for(int i = 0; i < 4; i++) {
							supEnd[i] = supEnd[i+1];
						}
						//aggiorno l'ultimo carattere di buttonStart
						supEnd[4] = inputText.charAt(currentPosition);
						//shift degli elementi di spanStart
						for(int j = 0; j < 4; j++) {
							spanStart[j] = spanStart[j+1];
						}
						//aggiorno l'ultimo carattere di spanStart
						spanStart[4] = inputText.charAt(currentPosition + 5);
						//shift degli elementi di spanEnd
						for(int j = 0; j < 5; j++) {
							spanEnd[j] = spanEnd[j+1];
						}
						//aggiorno l'ultimo carattere di spanEnd
						spanEnd[5] = inputText.charAt(currentPosition + 6);
						
						currentPosition++;
					}
				}
				else {
					
					//copio il carattere in outputText
					outputText = outputText + inputText.charAt(currentPosition);
					//shift degli elementi di spanStart
					for(int j = 0; j < 4; j++) {
						spanStart[j] = spanStart[j+1];
					}
					//aggiorno l'ultimo carattere di spanStart
					spanStart[4] = inputText.charAt(currentPosition + 5);
					//shift degli elementi di spanEnd
					for(int j = 0; j < 5; j++) {
						spanEnd[j] = spanEnd[j+1];
					}
					//aggiorno l'ultimo carattere di spanEnd
					spanEnd[5] = inputText.charAt(currentPosition + 6);
					//shift degli elementi di buttonStart
					for(int j = 0; j < 3; j++) {
						supStart[j] = supStart[j+1];
					}
					supStart[3] = inputText.charAt(currentPosition + 4); 
					
					currentPosition++;
					textPosition++;
					
					//System.out.println("Current Position --> " + currentPosition);
					//System.out.println("Text Position --> " + textPosition);
				}
				//System.out.println("\n" + UTIL_NAME + "5 - SPAN START --> " + String.valueOf(spanStart) + "\n");
				//System.out.println("\n" + UTIL_NAME + "6 - SPAN END --> " + String.valueOf(spanEnd) + "\n");
				//System.out.println("\n" + UTIL_NAME + "7 - BUTTON START --> " + String.valueOf(supStart) + "\n");
				//System.out.println("\n" + UTIL_NAME + "8 - OUTPUT TEXT --> " + outputText + "\n");

			}

			outputText = outputText + "<" + tag.getIncipit() + ">";
			overflow = overflow + tag.getIncipit().length() + 2;
			
		}
		
		//copio il resto del testo, se è rimasto
		if(currentPosition < inputText.length()) {
			outputText = outputText + inputText.substring(currentPosition);
		}
		
		//cancello tutti gli HtmlTag della lista tags
		//System.out.println("\n" + UTIL_NAME + "Cancello " + tags.size() + "tags\n");
		tags.clear();
		//System.out.println("\n" + UTIL_NAME + "Ora tags ha " + tags.size() + "elementi\n");
		
		outputText = adjustInlineAnnotations(outputText);
		
		//System.out.println("\n" + UTIL_NAME + "OUTPUT TEXT --> " + outputText + "\n");
			
		return outputText;
		
	}
	
	/**
	 * Il metodo ha il compito di verificare, di volta in volta, se si è incontrato un tag html durante il parsing del testo.
	 * @return String nome del tag se si tratta di un tag di apertura (preceduto da '/' se si tratta di un tag di chiusura)
	 */
	private static String handleTags() {
		
		String tag = String.valueOf(tagHandler);
		
		for(String label : labels) {
			if(tag.substring(tagHandler.length - label.length() - 1).compareTo('<' + label) == 0) {
				return label;
			}
		}
		return null;
		
	}
	
	/**
	 * Il metodo ha il compito di verificare, di volta in volta, se si è incontrato un tag html di tipo block durante il parsing del testo.
	 * @return String tag name if it is a start tag (preceded by '/' if it is an end tag)
	 */
	private static String handleBlockTags() {
		
		String tag = String.valueOf(tagBlockHandler);
		
		for(String label : blockTags) {
			if(tag.substring(tagBlockHandler.length - label.length() - 1).compareTo('<' + label) == 0) {
				return label;
			}
		}
		return null;
		
	}

	/**
	 * Il metodo restiuisce true se ci sono collisioni tra i tag html, false altrimenti.
	 * Per collisione si intende il caso in cui più tag iniziano con la stessa lettera: non è quindi vero che se si incontra una 'b'
	 * nel testo, si è di fronte ad un tag di tipo <b>, poiché ne esistono altri come <br> etc.
	 * @return Boolean esito della verifica
	 */
	private static Boolean verifyCollisions(String tag, char[] inputArray, int inputPosition) {
		
		//effettuo un controllo sui tag di inizio
		if(tag.compareTo("a") == 0 ||
		   tag.compareTo("b") == 0 ||
		   tag.compareTo("p") == 0 ||
		   tag.compareTo("th") == 0 ||
		   tag.compareTo("u") == 0) {
			
			if(inputArray[inputPosition] != ' ' && inputArray[inputPosition] != '>') 
				return true;
			
		}
		//effettuo un controllo sui tag di chiusura
		else if(tag.compareTo("/a") == 0 ||
				tag.compareTo("/b") == 0 ||
				tag.compareTo("/p") == 0 ||
				tag.compareTo("/th") == 0 ||
				tag.compareTo("/u") == 0){
			
			if(inputArray[inputPosition] != '>') 
				return true;
			
		}
		
		return false;
		
	}
	
	/**
	 * Il metodo restiuisce true se ci sono collisioni tra i tag html di tipo block, false altrimenti.
	 * Per collisione si intende il caso in cui più tag iniziano con la stessa lettera: non è quindi vero che se si incontra una 'b'
	 * nel testo, si è di fronte ad un tag di tipo <b>, poiché ne esistono altri come <br> etc.
	 * @return Boolean esito della verifica
	 */
	private static Boolean verifyBlockCollisions(String tag, char[] inputArray, int inputPosition) {
		
		//effettuo un controllo sui tag di inizio
		if(tag.compareTo("b") == 0) {
			
			if(inputArray[inputPosition] != ' ' && inputArray[inputPosition] != '>') 
				return true;
			
		}
		//effettuo un controllo sui tag di chiusura
		else if(tag.compareTo("/b") == 0){
			
			if(inputArray[inputPosition] != '>') 
				return true;
			
		}
		
		return false;
		
	}
	
	/**
	 * Il metodo gestisce i tag di tipo <span>, utilizzati per evidenziare le annotazioni Uima, perché, se ci sono dei tag di
	 * tipo block tra <span> e </span>, l'annotazione non verrebbe correttamente evidenziata. E' quindi necessario chiudere il tag 
	 * <span> prima dell'inizio del tag di tipo block e riaprirlo immediatamente dopo.
	 * @param inputText String testo Html compreso di annotazioni
	 * @return
	 */
	private static String adjustInlineAnnotations(String inputText) {
		
		System.out.println(UTIL_NAME + "method adjustInlineAnnotations");
		
		String outputText = "";
		
		//array per riconoscere l'incipit di una annotazione
		char[] spanStart = new char[14];
		//Lista di stringhe per memorizzare l'incipit di annotazioni che forse potrebbero essere copiate
		List<String> spanTags = new ArrayList<String>();
		//stringa per memorizzare l'incipit di una annotazione da inserire nella lista
		String spanTag = null;
		//intero per memorizzare la posizione corrente all'interno di inputText
		int currentPosition = 0;
		//array per riconoscere la fine di una annotazione
		char[] spanEndTag = new char[6];
		
		//booleano per indicare che le annotazioni correnti sono state correttamente gestite
		Boolean stopSearch = false;
		//stringa per memorizzare il tag block incontrato
		String blockTag = null;
		
		while(currentPosition < inputText.length()) {
			
			//System.out.println("\n" + UTIL_NAME + "Nuova Iterazione: outputText --> " + outputText + "\n");
			
			if(String.valueOf(spanStart).compareTo("<span class=\"#") == 0) {
				
				//System.out.println("\n" + UTIL_NAME + "1 - Ho trovato un'annotazione" + "\n");
				
				spanTag = "<span class=\"#";
				
				//copio il testo fino al carattere '>'
				while(inputText.charAt(currentPosition-1) != '>') {
					//copio il carattere in outputText
					outputText = outputText + inputText.charAt(currentPosition);
					//copio il carattere in spanTag
					spanTag = spanTag + inputText.charAt(currentPosition);
					
					currentPosition++;
				}
				
				//System.out.println("\n" + UTIL_NAME + "Ho trovato un'annotazione --> " + spanTag + "\n");
				
				//aggiungo il tag alla lista delle possibili annotazioni da sistemare
				spanTags.add(spanTag);
				
				//aggiorno spanStart per evitare i loop
				//shift degli elementi di spanStart
				for(int j = 0; j < 13; j++) {
					spanStart[j] = spanStart[j+1];
				}
				//aggiorno l'ultimo carattere di spanStart
				spanStart[13] = inputText.charAt(currentPosition);
				
				//System.out.println("\n" + UTIL_NAME + "spanStart --> " + String.valueOf(spanStart) + "\n");
				
				while(!stopSearch) {
					
					//System.out.println("\n" + UTIL_NAME + "INIZIO LA RICERCA!" + "\n");
					
					//shift degli elementi di spanStart
					for(int j = 0; j < 13; j++) {
						spanStart[j] = spanStart[j+1];
					}
					//aggiorno l'ultimo carattere di spanStart
					spanStart[13] = inputText.charAt(currentPosition);
					
					//System.out.println("\n" + UTIL_NAME + "spanStart --> " + String.valueOf(spanStart) + "\n");
					
					//shift degli elementi di spanEndTag
					for(int j = 0; j < 5; j++) {
						spanEndTag[j] = spanEndTag[j+1];
					}
					//aggiorno l'ultimo carattere di spanEndTag
					spanEndTag[5] = inputText.charAt(currentPosition);
					
					//shift degli elementi di tagBlockHandler
					for(int j = 0; j < tagBlockHandler.length - 1; j++) {
						tagBlockHandler[j] = tagBlockHandler[j+1];
					}
					//aggiorno l'ultimo carattere di tagBlockHandler
					tagBlockHandler[tagBlockHandler.length - 1] = inputText.charAt(currentPosition);
					
					blockTag = handleBlockTags();
					
					if(String.valueOf(spanStart).compareTo("<span class=\"#") == 0) {
						spanTag = "<span class=\"";
						
						//copio il testo fino al carattere '>'
						while(inputText.charAt(currentPosition-1) != '>') {
							//copio il carattere in outputText
							outputText = outputText + inputText.charAt(currentPosition);
							//copio il carattere in spanTag
							spanTag = spanTag + inputText.charAt(currentPosition);
							
							currentPosition++;
						}
						
						//System.out.println("\n" + UTIL_NAME + "Ho trovato un nestedSpanTag --> " + spanTag + "\n");
						
						//aggiungo il tag alla lista delle possibili annotazioni da sistemare
						spanTags.add(spanTag);
					}					
					else if(String.valueOf(spanEndTag).compareTo("</span") == 0) {
						
						//System.out.println("\n" + UTIL_NAME + "Ho trovato un tag di chiusura </span> --> elimino l'ultima annotazione" + "\n");
						//System.out.println("\n" + UTIL_NAME + "Numero Annotazioni Prima: " + spanTags.size() + "\n");
						//elimino l'ultima annotazione perché è correttamente chiusa
						spanTags.remove(spanTags.size() - 1);
						//System.out.println("\n" + UTIL_NAME + "Numero Annotazioni Dopo: " + spanTags.size() + "\n");
						if(spanTags.size() == 0) {
							//l'annotazione non crea conflitti con dei tag block
							//System.out.println("\n" + UTIL_NAME + "STOP DELLA RICERCA!" + "\n");
							stopSearch = true;
						}
					}					
					else if(blockTag != null) {
						
						//effettuo un controllo sul prefisso dei tag
						if(verifyBlockCollisions(blockTag, inputText.toCharArray(), currentPosition)) {
							//System.out.println("\n" + UTIL_NAME + "Collisione: continuo a copiare in outputText" + "\n");
							//aggiungo il carattere corrente a outputText
							//outputText = outputText + inputText.charAt(currentPosition);
							//currentPosition++;
						}
						else {
							//System.out.println("\n" + UTIL_NAME + "Ho individuato un blockTag: " + blockTag + "\n");
							
							//outputText = outputText.substring(0, outputText.length() - (blockTag.length() + 1));
							outputText = outputText.substring(0, outputText.length() - (blockTag.length()));
							
							//chiudo le annotazioni correntemente aperte
							for(int i = 0; i < spanTags.size(); i++) {
								outputText = outputText + "</span>";
							} 
							//copio l'incipit del tag block
							outputText = outputText + "<" + blockTag;
							
							currentPosition++;
							
							//continuo a copiare l'incipit del tag block fino al carattere '>'
							while(inputText.charAt(currentPosition-1) != '>') {
								//copio il carattere in outputText
								outputText = outputText + inputText.charAt(currentPosition);
								//copio il carattere in spanTag
								spanTag = spanTag + inputText.charAt(currentPosition);
								
								currentPosition++;
							}
							
							//copio l'incipit delle annotazioni da inserire dopo il tag block
							for(int i = 0; i < spanTags.size(); i++) {
								outputText = outputText + spanTags.get(i);
							}
							
							//System.out.println("\n" + UTIL_NAME + "outputText dopo: " + outputText + "\n");
							
							//shift degli elementi di spanStart
							for(int j = 0; j < 13; j++) {
								spanStart[j] = spanStart[j+1];
							}
							//aggiorno l'ultimo carattere di spanStart
							spanStart[13] = inputText.charAt(currentPosition);
							
							//shift degli elementi di spanEndTag
							for(int j = 0; j < 5; j++) {
								spanEndTag[j] = spanEndTag[j+1];
							}
							//aggiorno l'ultimo carattere di spanEndTag
							spanEndTag[5] = inputText.charAt(currentPosition);
						}
						
					}
					//copio il carattere in outputText
					outputText = outputText + inputText.charAt(currentPosition);
					currentPosition++;
					
				}
				stopSearch = false;
				
			}
			else {
				
				//non ho trovato alcuna annotazione
				
				//copio il carattere in outputText
				outputText = outputText + inputText.charAt(currentPosition);
				//shift degli elementi di spanStart
				for(int j = 0; j < 13; j++) {
					spanStart[j] = spanStart[j+1];
				}
				//aggiorno l'ultimo carattere di spanStart
				spanStart[13] = inputText.charAt(currentPosition);
				
				//System.out.println("\n" + UTIL_NAME + "Non ho trovato annotazioni: spanStart --> " + String.valueOf(spanStart) + "\n");
				
				currentPosition++;
			}
		}
		
		return outputText;
	}
	
	/**
	 * Il metodo inserisce, nell'<head> del file di risposta, lo stile css relativo alle checkbox degli annotatori.
	 * @param inputHead
	 */
	private static String insertButtonStyleProperties(String inputHead) {
		
		System.out.println(UTIL_NAME + "method adjustInlineAnnotations");
		
		char[] head = new char[6];
		
		//inizializzo head
		for(int i = 0; i < 6; i++) {
			head[i] = inputHead.charAt(i);
		}
		
		
		String style = "<style>.ann-btn{cursor: pointer;background: #ffffff;border: 1px solid #666666;-webkit-border-radius: 57;" +
					   "-moz-border-radius: 57;border-radius: 57px;-moz-box-shadow: 0px 0px 1px #666666;font-family: Arial;" +
					   "color: #1b285c;font-size: 9px;padding: 2px 2px 2px 2px;margin: 0px 3px 0px 3px;display: inline;}" +
					   ".ann-btn:hover{background-image: -webkit-linear-gradient(top, #43e82a, #f5f525);" + 
					   "background-image: -moz-linear-gradient(top, #43e82a, #f5f525);" +
					   "background-image: -ms-linear-gradient(top, #43e82a, #f5f525);" +
					   "background-image: -o-linear-gradient(top, #43e82a, #f5f525);" + 
					   "background-image: linear-gradient(to bottom, #43e82a, #f5f525);text-decoration: none;}</style>";		
		
		String outputHead = "";
		int currentPosition = 0;
		
		while(String.valueOf(head).compareTo("</head") != 0) {
			
			outputHead = outputHead + inputHead.charAt(currentPosition);
			//shift degli elementi di head
			for(int i = 0; i < 5; i++) {
				head[i] = head[i+1];
			}
			head[5] = inputHead.charAt(currentPosition + 6);
			//aggiorno currentPosition
			currentPosition++;
			
		}
		
		outputHead = outputHead + style + "</head>";
		
		return outputHead;
		
	}
	
}
