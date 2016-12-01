package it.uniroma2.art.application.utilities;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import it.uniroma2.art.semanticturkey.resources.Config;

public class PearlUtils {
	
	private static final String UTIL_NAME = "****PearlUtils**** ";
	//Directory dell'applicazione in SemanticTurkeyData
	private final static String appDirectory = Config.getDataDir() + File.separator + "MyApp" + File.separator;
	
	//PearlFile originale dell'applicaizone
	private static final File pearlFile = new File(appDirectory + "Pearl\\pearl.pr");
	//pearl file correntemente in uso nel progetto: nel momento di apertura di un nuovo progetto punta a pearlFile
	private static File currentPearlFile = pearlFile;
	//puntamento al file pearl precedente all'ultima modifica
	private static File lastModified = null;
	
	
	/**
	 * Il metodo restituisce il file currentPearlFile.
	 */
	public static File getPearlFile() {
		System.out.println(UTIL_NAME + "method getPearlFile");
		return currentPearlFile;
	}
	
	/**
	 * Il metodo restituisce il file currentPearlFile come stringa
	 * @param pearlFile
	 * @return
	 * @throws IOException
	 */
	public static String pearlFileToString(File pearlFile) throws IOException {
		
		System.out.println(UTIL_NAME + "method pearlFileToString");
		
		if (!pearlFile.getName().endsWith(".pr"))
			throw new IOException("input file is not a pear file (.pr)");
		String pearlCode = "";
		BufferedReader input = null;
		try {
			input = new BufferedReader(new FileReader(pearlFile));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		StringBuffer buffer = new StringBuffer();
		try {
			while ((pearlCode = input.readLine()) != null)
				buffer.append(pearlCode + "\n");
			input.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		pearlCode = buffer.toString();
		return pearlCode;
	}
	
	/**
	 * Checks if a pearl file is ready to be given in input to CODA. It returns true if the pearl file is
	 * correct, false otherwise.
	 * @param pearlFile
	 * @return
	 * @throws IOException
	 */
	public static boolean checkPearl(File pearlFile) throws IOException {
		System.out.println(UTIL_NAME + "method checkPearl");
		String pearlCode = null;
		try {
			pearlCode = pearlFileToString(pearlFile);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return !pearlCode.contains("<pls_provide_");
	}

	/**
	 * Il metodo cancella tutte le modifiche apportate al pearl file originale.
	 */
	public static File deleteUpdates() {
		
		System.out.println(UTIL_NAME + "Chiamata a metodo deleteUpdates");
		
		lastModified = null;
		currentPearlFile = pearlFile;
		
		return getPearlFile();
		
	}
	
	/**
	 * Il metodo cancella l'ultima modifica apportata al file pearl.
	 */
	public static File deleteLastUpdates() {
		
		System.out.println(UTIL_NAME + "method deleteLastUpdates");
		
		currentPearlFile = lastModified;
		lastModified = null;
		
		return getPearlFile();
		
	}
	
	/**
	 * Il metodo effettua il merge tra il currentPearlFile e un file pearl caricato tramite upload dall'utente.
	 * @param inputPearlFile
	 * @return
	 */
	public static File updatePearlFile(File inputPearlFile) throws IOException {
		
		System.out.println(UTIL_NAME + "method updatePearlFile");
		
		lastModified = currentPearlFile;
		String lastPearlFile = null;
		try {
			lastPearlFile = pearlFileToString(lastModified);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		String newPearlFile = pearlFileToString(inputPearlFile);
		
		//Estrapolo i prefix da lastPearlFile
		String outputText = "";
		int lastPearlFilePosition = 0;
		char[] rule = new char[4];
		for(int i = 0; i < 4; i++) {
			rule[i] = lastPearlFile.charAt(i);
		}
		
		while(String.valueOf(rule).compareTo("rule") != 0) {
			outputText = outputText + lastPearlFile.charAt(lastPearlFilePosition);
			
			//shift degli elementi di rule
			for(int i = 0; i < 3; i++) {
				rule[i] = rule[i+1];
			}
			rule[3] = lastPearlFile.charAt(lastPearlFilePosition + 4);
			
			lastPearlFilePosition++;
		}
		
		outputText = outputText + "\n";
		
		//Estrapolo i prefix da newPearlFile
		int newPearlFilePosition = 0;
		for(int i = 0; i < 4; i++) {
			rule[i] = newPearlFile.charAt(i);
		}
		
		while(String.valueOf(rule).compareTo("rule") != 0) {
			outputText = outputText + newPearlFile.charAt(newPearlFilePosition);
			
			//shift degli elementi di rule
			for(int i = 0; i < 3; i++) {
				rule[i] = rule[i+1];
			}
			rule[3] = newPearlFile.charAt(newPearlFilePosition + 4);
			
			newPearlFilePosition++;
		}
		
		//copio il resto di lastPearlFile
		outputText = outputText + lastPearlFile.substring(lastPearlFilePosition);
		//copio il resto di lastPearlFile
		outputText = outputText + newPearlFile.substring(newPearlFilePosition);
		
		File mixedPearlFile = File.createTempFile("pearl", ".pr");
		BufferedWriter bw = new BufferedWriter(new FileWriter(mixedPearlFile));
		bw.write(outputText);
		bw.close();
		currentPearlFile = mixedPearlFile;
		
		return getPearlFile();
		
	}
	
	/**
	 * Il metodo modifica il currentPearlFile sostituendo il contenuto con la string in input.
	 * @param inputPearlFile
	 * @return
	 */
	public static void editPearlFile(String pearlCode) throws IOException {
		
		System.out.println(UTIL_NAME + "method updatePearlFile");
		
		File newPearlFile= File.createTempFile("pearl", ".pr");
		BufferedWriter bw = new BufferedWriter(new FileWriter(newPearlFile));
		bw.write(pearlCode);
		bw.close();
		
		lastModified = currentPearlFile;
		currentPearlFile = newPearlFile;
		
	}
	
	
}
