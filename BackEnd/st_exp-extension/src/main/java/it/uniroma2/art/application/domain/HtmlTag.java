package it.uniroma2.art.application.domain;

/**
 * La classe modella i tag html che l’applicazione estrae da una pagina web tramite i seguenti parametri:
 * begin, con cui si intende l’indice del carattere iniziale del tag all’interno della pagina;
 * type, con cui si intende il nome del tag html estratto;
 * incipit, con cui si intende il tag compreso di tutti i suoi attributi.
 * @author Luca Talocci
 */
public class HtmlTag implements Comparable<HtmlTag> {
	
	private int begin;
	private String incipit;
	private String type;
	
	public HtmlTag(int begin, String incipit, String type) {
		super();
		this.begin = begin;
		this.incipit = incipit;
		this.type = type;
	}
	
	public int getBegin() {
		return begin;
	}
	
	public void setBegin(int begin) {
		this.begin = begin;
	}

	public String getIncipit() {
		return incipit;
	}

	public void setIncipit(String incipit) {
		this.incipit = incipit;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@Override
	public String toString() {
		return "HTML TAG --> begin: " + begin + ", incipit: " + incipit + ", type: " + type;
	}
	
	@Override
	public int compareTo(HtmlTag tag) {
		if(this.begin == tag.getBegin()) {
				return 0;
		}
		else if(this.begin < tag.getBegin()) {
			return -1;
		}
		else return 1;
	}
	
}
