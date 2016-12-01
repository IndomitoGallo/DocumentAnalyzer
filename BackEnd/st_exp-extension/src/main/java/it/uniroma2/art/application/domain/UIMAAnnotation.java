package it.uniroma2.art.application.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * La classe modella le annotazioni del Cas. In particolare, le istanze di questa classe sono
 * caratterizzate dai seguenti parametri:
 * id univoco dell’annotazione;
 * indice del carattere di inizio dell’annotazione all’interno del testo;
 * indice del carattere finale dell’annotazione all’interno del testo;
 * tipo dell’annotazione;
 * contenuto testuale dell’annotazione;
 * colore di sfondo dell’annotazione nell’interfaccia grafica;
 * lista di annotazioni “fisicamente contenute” all’interno di essa.
 * @author Luca Talocci
 */
public class UIMAAnnotation implements Comparable<UIMAAnnotation> {
	
	private String content;
	private int id;
	private int begin;
	private int end;
	private String color;
	private String annotatorName;
	private int sofa;
	private List<UIMAAnnotation> nestedAnnotations;
	
	public UIMAAnnotation(String name, int id, int begin, int end, 
					  String color, String annotatorName) {
		this.content = name;
		this.id = id;
		this.begin = begin;
		this.end = end;
		this.color = color;
		this.annotatorName = annotatorName;
		this.setNestedUIMAAnnotations(new ArrayList<UIMAAnnotation>());
	}
	
	public UIMAAnnotation(String annotatorName, int id, int begin, int end, String content) {
		this.annotatorName = annotatorName;
		this.id = id;
		this.begin = begin;
		this.end = end;
		this.content = content;
		this.setNestedUIMAAnnotations(new ArrayList<UIMAAnnotation>());
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getBegin() {
		return begin;
	}

	public void setBegin(int begin) {
		this.begin = begin;
	}

	public int getEnd() {
		return end;
	}

	public void setEnd(int end) {
		this.end = end;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getAnnotatorName() {
		return annotatorName;
	}

	public void setAnnotatorName(String annotatorName) {
		this.annotatorName = annotatorName;
	}
	
	public int getSofa() {
		return sofa;
	}

	public void setSofa(int sofa) {
		this.sofa = sofa;
	}
	
	public List<UIMAAnnotation> getNestedUIMAAnnotations() {
		return nestedAnnotations;
	}

	public void setNestedUIMAAnnotations(List<UIMAAnnotation> nestedAnnotations) {
		this.nestedAnnotations = nestedAnnotations;
	}

	public void insertNestedAnnotation(UIMAAnnotation a) {
		this.nestedAnnotations.add(a);
	}
	
	/**
	 * This method return the annotation as a string XML.
	 * @return String 
	 */
	public String toXMLString() {
		String xml = null;
		if(this.nestedAnnotations.isEmpty()) {
			xml = "<jCasType:" + this.annotatorName + " sofa='" + this.sofa + "' begin='" + this.begin + 
					 "' end='" + this.end + "'";
			xml = xml + ">" + this.content + "</" + this.annotatorName + ">";
		}
		else {
			xml = "<jCasType:" + this.annotatorName + " sofa='" + this.sofa + "' begin='" + this.begin + 
					 "' end='" + this.end + "'";
			xml = xml + ">";
			int nestedBegin;
			//Variabile che memorizza la posizione corrente all'interno della stringa html
			int currentPosition = 0;
			//Variabile che memorizza la posizione corrente all'interno di content
			int annotationPosition = 0;
			char[] content = this.content.toCharArray();
			for(UIMAAnnotation a : this.nestedAnnotations) {
				nestedBegin = a.getBegin();
				//Copio il contenuto di this.name che precede l'annotazione annidata
				while(annotationPosition < (nestedBegin - this.begin)) {
					xml = xml + content[annotationPosition];
					currentPosition++;
					annotationPosition++;
				}
				xml = xml + a.toXMLString();
				currentPosition = currentPosition + a.toXMLString().length();
				annotationPosition = annotationPosition + a.getContent().length();
			}
			//copio il resto del contenuto se sono rimasti caratteri
			while(annotationPosition < content.length) {
				xml = xml + content[annotationPosition];
				annotationPosition++;
			}
			xml = xml + "</" + this.annotatorName + ">";
		}
		return xml;
	}
	
	/**
	 * This method return the html annotation content that appears in the UI.
	 * @return
	 */
	public String getHTMLContent() {
		
		String html = null;
		if(this.nestedAnnotations.isEmpty()) {
			html = "<span class=\""+ this.color + "\" style=\"background-color: " + this.color + "\">" + 
				   this.content + 
				   "<sup id=\"" + this.id + "\" class=\"ann-btn btn" + this.color + "\">" + this.id + "</sup>" + 
				   "</span>";
		}
		else {
			html = "<span class=\""+ this.color + "\" style=\"background-color: " + this.color + "\">";
			int nestedBegin;
			//Variabile che memorizza la posizione corrente all'interno della stringa html
			int currentPosition = 0;
			//Variabile che memorizza la posizione corrente all'interno di content
			int annotationPosition = 0;
			char[] content = this.content.toCharArray();
			for(UIMAAnnotation a : this.nestedAnnotations) {
				nestedBegin = a.getBegin();
				//Copio il contenuto di this.name che precede l'annotazione annidata
				while(annotationPosition < (nestedBegin - this.begin)) {
					html = html + content[annotationPosition];
					currentPosition++;
					annotationPosition++;
				}
				html = html + a.getHTMLContent();
				currentPosition = currentPosition + a.getHTMLContent().length();
				annotationPosition = annotationPosition + a.getContent().length();
			}
			//copio il resto del contenuto se sono rimasti caratteri
			while(annotationPosition < content.length) {
				html = html + content[annotationPosition];
				annotationPosition++;
			}
			html = html + 
				   "<sup id=\"" + this.id + "\" class=\"ann-btn btn" + this.color + "\">" + this.id + "</sup>" +
				   "</span>";
		}
		return html;
		
	}
	
	/**
	 * This method return the annotation as a string HTML.
	 * @return String
	 */
	public String toHTMLString() {
		String html = null;
		if(this.nestedAnnotations.isEmpty()) {
			html = "<span class=\""+ this.color + "\" style=\"background-color: " + this.color + "\">" + 
					 this.content + "</span>";
		}
		else {
			html = "<span class=\""+ this.color + "\" style=\"background-color: " + this.color + "\">";
			int nestedBegin;
			//Variabile che memorizza la posizione corrente all'interno della stringa html
			int currentPosition = 0;
			//Variabile che memorizza la posizione corrente all'interno di content
			int annotationPosition = 0;
			char[] content = this.content.toCharArray();
			for(UIMAAnnotation a : this.nestedAnnotations) {
				nestedBegin = a.getBegin();
				//Copio il contenuto di this.name che precede l'annotazione annidata
				while(annotationPosition < (nestedBegin - this.begin)) {
					html = html + content[annotationPosition];
					currentPosition++;
					annotationPosition++;
				}
				html = html + a.toHTMLString();
				currentPosition = currentPosition + a.toHTMLString().length();
				annotationPosition = annotationPosition + a.getContent().length();
			}
			//copio il resto del contenuto se sono rimasti caratteri
			while(annotationPosition < content.length) {
				html = html + content[annotationPosition];
				annotationPosition++;
			}
			html = html + "</span>";
		}
		return html;
	}
	
	/**
	 * This method returns a tree view of the annotation
	 * @return
	 */
	public String getTree() {
		
		String tree = null;
		tree = "<ul class=\"tree\">" + 
			   "<li><span class=\"treeLabel\">&lt;" + this.annotatorName + " </span><span class=\"treeId\">id=" + this.id + "</span><span class=\"treeLabel\">&gt;</span></li>" + 
			   "<li class=\"labelContent\">" + this.content + "</li>" +
			   "<li><span class=\"treeLabel\">&lt;/" + this.annotatorName + "&gt;</span></li>" + 
			   "</ul>";
		
		return tree;
		
	}
	
	@Override
	public int compareTo(UIMAAnnotation a) {
		if(this.begin == a.getBegin()) {
			if(this.end == a.getEnd())
				return 0;
			else if(this.end < a.getEnd())
				return 1;
			else return -1;
		}
		else if(this.begin < a.getBegin()) {
			return -1;
		}
		else return 1;
	}
	
}
