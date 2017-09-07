var arrDescAct = [];
var idioma;
var TextoNotas = "",
	TextoCerrar = "",
	TextoSiguiente = "",
	TextoOtraVez = "",
	TextoAudio = "",
	TextoComprobar = "",
	TextoAyuda = "",
	TextoAnterior = "",
	TextoImprimir = "",
	TextoSolucion = "",
	TextoActividadFinalizada = "",
	TituloNotas = "",
	explNotas = "",
	GuardarNotas = "",
	TituloDialogoAudio = "",
	TextoDialogoAudioBotton = "",
	TextoDialogoAudioInicio = "",
	TextoDialogoAudioContinuar = "";
	tituloAyudaAct = "";
	tituloAyudaBar = "";
	descrActividad = "";
	ayudaNotas = "";
	ayudaCerrar = "";
	ayudaAudio = "";
	ayudaSiguiente = "";
	ayudaComprobar = "";
	ayudaOtraVez = "";
	ayudaAnterior = "";
	ayudaImprimir = "";
	TextoAlertCerrarFin = "";


function PonerIdiomaActividad(){
	idioma = confActividad['idioma'];
		
		if(idioma == 'castellano'){ IdiomaCastellano();
		}else if(idioma == 'ingles'){ IdiomaIngles();
		}else if(idioma == 'euskera'){ IdiomaEuskera();
		}else if(idioma == 'valenciano'){ IdiomaValenciano();
		}else if(idioma == 'balear'){ IdiomaBalear();
		}else if(idioma == 'gallego'){ IdiomaGallego();
		}else if(idioma == 'frances'){ IdiomaFrances();
		}

		jQuery('[data-anaya=notas] > span, #ayuda-notas > span').html(TextoNotas);
		jQuery('[data-anaya=cerrar] > span, #ayuda-cerrar > span').html(TextoCerrar);
		jQuery('[data-anaya=anterior] > span, #ayuda-anterior > span').html(TextoAnterior);
		jQuery('[data-anaya=siguiente] > span, #ayuda-siguiente > span').html(TextoSiguiente);
		jQuery('[data-anaya=imprimir] > span, #ayuda-imprimir > span').html(TextoImprimir);
		jQuery('[data-anaya=otravez] > span, #ayuda-otravez > span').html(TextoOtraVez);
		jQuery('[data-anaya=comprobar] > span, #ayuda-comprobar > span').html(TextoComprobar);
		jQuery('[data-anaya=audio] > span, #ayuda-audio > span').html(TextoAudio);
		jQuery('[data-anaya=ayuda] > span, #ayuda-ayuda > span').html(TextoAyuda);
		
		jQuery('#respuestas > strong').html(TextoSolucion);	 //Caja Solución Input
		jQuery('#mensaje > p').html(TextoActividadFinalizada);	//Texto Final Actividad
		jQuery('#ui-id-1').html(TituloNotas); //Editor de notas
		jQuery('#notepad > textarea').html(explNotas);
		jQuery('.ui-button-text').html(GuardarNotas);
		
		
		
		jQuery('div#ayudaDiv .cajaAyudaScroll .textoTitulo#textoTituloAct').html(tituloAyudaAct);
		jQuery('div#ayudaDiv .cajaAyudaScroll .textoTitulo#textoTituloBar').html(tituloAyudaBar);
		
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-notas+td').html(ayudaNotas);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-cerrar+td').html(ayudaCerrar);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-audio+td').html(ayudaAudio);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-siguiente+td').html(ayudaSiguiente);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-comprobar+td').html(ayudaComprobar);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-otravez+td').html(ayudaOtraVez);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-anterior+td').html(ayudaAnterior);
		jQuery('div#ayudaDiv .cajaAyudaScroll table  tr > td#ayuda-imprimir+td').html(ayudaImprimir);
		
		//FALTA PONER EL MENSAJE DE SCORM 'mensajeFinalSCO'
}

function IdiomaCastellano(){ //IDIOMA CASTELLANO
	TextoNotas = 'Notas';
	TextoCerrar = 'Cerrar';
	TextoSiguiente = 'Siguiente';
	TextoOtraVez = 'Otra Vez';
	TextoAudio = 'Audio';
	TextoComprobar = 'Comprobar';
	TextoAyuda = 'Ayuda';
	TextoImprimir = 'Imprimir';
	TextoAnterior = 'Anterior';
	TextoSolucion = 'Soluci&oacute;n:'; 
	
	TextoActividadFinalizada = 'Actividad finalizada'; 
		
	TituloNotas = 'Editor de notas', 
	explNotas = 'Anota toda la informaci&oacute;n que quieras en este campo.', 
	GuardarNotas = 'Guardar';
	
	TituloDialogoAudio = 'Actividad Interactiva';
	TextoDialogoAudioBotton = 'ACEPTAR';
	TextoDialogoAudioInicio = 'Pulsa "'+TextoDialogoAudioBotton+'" para empezar la actividad.';
	TextoDialogoAudioContinuar = 'Pulsa "'+TextoDialogoAudioBotton+'" para continuar la actividad.';
	
	tituloAyudaAct = "Ayuda para la actividad.";
	tituloAyudaBar = "Ayuda para la barra de herramientas.";
	ayudaNotas = "Esta herramienta funciona como bloc de notas para la actividad. Puedes guardar tus anotaciones sobre la actividad en el campo de texto que aparecerá al pulsar el botón. Las 'Notas' se guardarán siempre en el navegador y ordenador que estés utilizando." 
	ayudaCerrar = "Este botón te permite abandonar la actividad cuando lo desees. Recuerda que si sales de la actividad antes de terminarla, esta no tendrá la posibilidad de ser evaluada."
	ayudaAudio = "Si la actividad tiene una locución de introducción o audio asociado, podrás volver a escucharlo pulsando sobre este icono."
	ayudaSiguiente = "Si la actividad tiene más de un ejercicio, este botón te permite avanzar entre ellos. El botón sólo se activará cuando hayas terminado de resolver el ejercicio en la que te encuentres."
	ayudaComprobar = "Este botón aparece para comprobar los resultados de la actividad.  Al pulsarlo el sistema corregirá tus resultados."
	ayudaOtraVez = "Este botón aparece cuando hayas finalizado la actividad.  Al pulsarlo comenzarás la actividad de nuevo."
	ayudaAnterior = "Si la actividad tiene más de un ejercicio, este botón te permite retroceder entre ellos."
	ayudaImprimir = "Este botón abre un documento imprimible relacionado con la actividad."

	TextoAlertCerrarFin = 'La actividad ha finalizado. Cierra esta ventana para volver al índice.';
}



function IdiomaIngles(){ //IDIOMA INGLES
	TextoNotas = 'Notes';
	TextoCerrar = 'Close';
	TextoSiguiente = 'Next';
	TextoOtraVez = 'Try Again';
	TextoAudio = 'Audio';
	TextoComprobar = 'Check';
	TextoAyuda = 'Help';
	TextoImprimir = '¿¿??';
	TextoAnterior = '¿?';
	TextoSolucion = 'Solution:'; 
	
	TextoActividadFinalizada = 'Activity finished'; 
		
	TituloNotas = 'Note editor', 
	explNotas = 'Write down all the information you want in this field.', 
	GuardarNotas = 'Save';
	
	TituloDialogoAudio = 'Interactive Activity';
	TextoDialogoAudioBotton = 'OK';
	TextoDialogoAudioInicio = 'Press "'+ TextoDialogoAudioBotton +'" to begin the activity.';
	TextoDialogoAudioContinuar = 'Press "'+ TextoDialogoAudioBotton +'" to continue the activity.';
	
	tituloAyudaAct = "0000";
	tituloAyudaBar = "0000";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";

	TextoAlertCerrarFin = '000000';
	
}



function IdiomaEuskera(){ //IDIOMA EUSKERA
	TextoNotas = 'Oharrak';
	TextoCerrar = 'Itxi';
	TextoSiguiente = 'Hurrengoa';
	TextoOtraVez = 'Berriro';
	TextoAudio = 'Entzungaia';
	TextoComprobar = 'Egiaztatu';
	TextoAyuda = '¿¿??';
	TextoImprimir = '¿¿??';
	TextoAnterior = '¿?';
	TextoSolucion = 'Soluzioa:'; 
	
	TextoActividadFinalizada = 'Ariketa amaituta'; 
		
	TituloNotas = 'Ohar-editorea', 
	explNotas = 'Idatzi eremu honetan nahi duzun informazio guztia.', 
	GuardarNotas = 'Gorde';
	
	TituloDialogoAudio = '??????????????????';
	TextoDialogoAudioBotton = 'ONARTU';
	TextoDialogoAudioInicio = 'Ariketa hasteko, sakatu '+ TextoDialogoAudioBotton +'.';
	TextoDialogoAudioContinuar = '?????????????????.';
	
	tituloAyudaAct = "0000";
	tituloAyudaBar = "0000";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";

	TextoAlertCerrarFin = '000000';
	
}



function IdiomaValenciano(){ //IDIOMA VALENCIANO
	TextoNotas = 'Notes';
	TextoCerrar = 'Tanca';
	TextoSiguiente = 'Seg&uuml;ent';
	TextoOtraVez = 'Altra vegada';
	TextoAudio = '&Agrave;udio';
	TextoComprobar = 'Comprova';
	TextoAyuda = 'Ayuda';
	TextoImprimir = '¿¿??';
	TextoAnterior = 'Imprimix';
	TextoSolucion = 'Soluci&oacute;:'; 
	
	TextoActividadFinalizada = 'Activitat finalitzada'; 
		
	TituloNotas = 'Editor de notes', 
	explNotas = 'Anota tot el que vulgues en aquest camp.', 
	GuardarNotas = 'Guarda';
	
	TituloDialogoAudio = 'Activitat Interactiva';
	TextoDialogoAudioBotton = 'ACCEPTA';
	TextoDialogoAudioInicio = "Fes clic en "+ TextoDialogoAudioBotton +" per començar l'activitat.";
	TextoDialogoAudioContinuar = '???????????????.';
	
	tituloAyudaAct = "0000";
	tituloAyudaBar = "0000";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";
	
	TextoAlertCerrarFin = 'L’activitat ha finalitzat. Tanca aquesta finestra per a tornar a l’índex.';
	
}



function IdiomaBalear(){ //IDIOMA BALEAR
	TextoNotas = 'Notes';
	TextoCerrar = 'Tanca';
	TextoSiguiente = 'Seg&uuml;ent';
	TextoOtraVez = 'Altra vegada';
	TextoAudio = '&Agrave;udio';
	TextoComprobar = 'Comprova';
	TextoAyuda = 'Ayuda';
	TextoImprimir = 'Imprimix';
	TextoAnterior = '¿?';
	TextoSolucion = 'Soluci&oacute;:'; 
	
	TextoActividadFinalizada = 'Activitat finalitzada'; 
		
	TituloNotas = 'Editor de notes', 
	explNotas = 'Anota tot el que vulguis en aquest camp.', 
	GuardarNotas = 'Desa';
	
	TituloDialogoAudio = 'Activitat Interactiva';
	TextoDialogoAudioBotton = 'ACCEPTA';
	TextoDialogoAudioInicio = "Fes clic en "+ TextoDialogoAudioBotton +" per comen?ar l'activitat.";
	TextoDialogoAudioContinuar = '???????????????.';
	
	tituloAyudaAct = "0000";
	tituloAyudaBar = "0000";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";

	TextoAlertCerrarFin = 'L’activitat ha finalitzat. Tanca aquesta finestra per tornar a l’índex.';
	
}



function IdiomaGallego(){ //IDIOMA GALLEGO
	TextoNotas = 'Notas';
	TextoCerrar = 'Pechar';
	TextoSiguiente = 'Seguinte';
	TextoOtraVez = 'Outra vez';
	TextoAudio = 'Audio';
	TextoComprobar = 'Comprobar';
	TextoAyuda = 'Ayuda';
	TextoImprimir = '¿¿??';
	TextoAnterior = '¿?';
	TextoSolucion = 'Soluci&oacute;n:'; 
	
	TextoActividadFinalizada = 'Actividade finalizada'; 
		
	TituloNotas = 'Editor de notas', 
	explNotas = 'Anota toda a informaci&oacute;n que queiras neste campo.', 
	GuardarNotas = 'Gardar';
	
	TituloDialogoAudio = 'Actividade Interativa';
	TextoDialogoAudioBotton = 'ACEPTAR';
	TextoDialogoAudioInicio = "Preme "+ TextoDialogoAudioBotton +" para comezar a actividade.";
	TextoDialogoAudioContinuar = '???????????????.';
	
	tituloAyudaAct = "0000";
	tituloAyudaBar = "0000";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";

	TextoAlertCerrarFin = 'A actividade rematou. Pecha esta ventá para volver ao índice.';

}


function IdiomaFrances(){ //IDIOMA FRANCES
	TextoNotas = 'Annotations';
	TextoCerrar = 'Fermer';
	TextoSiguiente = 'Suivant';
	TextoOtraVez = 'Encore';
	TextoAudio = 'Locución';
	TextoComprobar = 'Vérifier';
	TextoAyuda = 'Aide';
	TextoImprimir = 'Print';
	TextoAnterior = 'Précédent';
	TextoSolucion = 'Solution:'; 
	
	TextoActividadFinalizada = 'Activité achèvement'; 
		
	TituloNotas = 'Editeur de notes', 
	explNotas = 'Écrire toutes les informations que vous souhaitez dans ce domaine.', 
	GuardarNotas = 'Enregistrer';
	
	TituloDialogoAudio = 'Activité Interactive';
	TextoDialogoAudioBotton = 'OK';
	TextoDialogoAudioInicio = "Appuyez sur  "+TextoDialogoAudioBotton+" pour commencer l'activité.";
	TextoDialogoAudioContinuar = "Appuyez sur "+TextoDialogoAudioBotton+" pour continuer l'activité.";
	
	tituloAyudaAct = "Aide pour l'activité.";
	tituloAyudaBar = "Aide barre d'outils.";
	ayudaNotas = "0000";
	ayudaCerrar = "0000";
	ayudaAudio = "0000";
	ayudaSiguiente = "0000";
	ayudaComprobar = "0000";
	ayudaOtraVez = "0000";
	ayudaAnterior = "0000";
	ayudaImprimir = "0000";

	TextoAlertCerrarFin = "Est terminé. Fermez cette fenêtre pour retourner à l'index.";

}

(function($){  //DESCRIBIR LAS ACTIVIDADES SEGÚN SU IDIOMA EN LA CAJA DE AYUDA
	arrDescAct = {
		"EnProceso"  : '~~~~ En proceso de edición. ~~~~', //GENËRICO PARA ACT SIN DESCRIPCIÓN AUN.
		"011"  : {
				'castellano'  : 'Tienes que arrastrar las cajas de texto a los contenedores correctos, según se plantee en el enunciado. Una vez se hayan arrastrado todos los objetos, la actividad te muestra el botón "Comprobar", que evalúa si están bien colocados. En algunos casos puedes disponer de otra oportunidad para resolver la actividad.',    
				'ingles'  : 'DragIng',     
				'euskera'  : 'DragEus',     
				'valenciano'  : 'DragVal',  
				'balear'  : 'DragBale',     
				'gallego'  : 'DragGalle',     
				'frances'  : 'DragFran',    
		},
		"012"  : {
				'castellano'  : 'SortCast',    
				'ingles'  : 'SortIng',     
				'euskera'  : 'SortEus',     
				'valenciano'  : 'SortVal',  
				'balear'  : 'SortBale',     
				'gallego'  : 'SortGalle',     
				'frances'  : 'SortFran',    
		}
	};
})(jQuery);