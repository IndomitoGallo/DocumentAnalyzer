package it.uniroma2.art.application.domain;

/**
 * La classe modella il file di una pagina web tramite due attributi principali:
 * prefix, che rappresenta l'<head> di una pagina Web;
 * content, che rappresenta il <body> di una pagina Web.
 * @author Luca Talocci
 */
public class HtmlFile {
	
	private String prefix;
	private String content;
	
	public String getPrefix() {
		return prefix;
	}
	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}

}
