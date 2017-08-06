

var pantallas = confActividad['pantallas'];   /* DECLARAMOS PANTALLAS PARA RECOGERLAS EN CONTROL.JSON */
var currentIndex = 0; /* ABRIR EL DATA¿?.XML || Empezamos en el 0*/
var arr = []; // ARRAY PRINCIPAL PARA LOS XML
var idAct = ""; //ID de la actividad por pantalla.
var urlAudioPrincipal,urlAudioPantalla; 

jQuery(document).ready(function() {
				
	if (jQuery.browser.msie && jQuery.browser.version < 7) {
		var str = '<div class="nosup"><h2>Tu navegador no posee la tecnolog&iacute;a para iniciar esta aplicaci&oacute;n.</h2><div>Desc&aacute;rgate e instala <a href="http://www.google.es/chrome?hl=es">Google Chrome</a>, <a href="http://www.mozilla.org/es-ES/firefox/new/">Mozilla Firefox</a> o <a href="http://www.apple.com/es/safari/download/">Apple Safari</a> para poder iniciarla.</div></div>';
		jQuery('#contents').html(str);
		return;
	}

	jQuery(window).resize(function() {
		jQuery("#mensaje").posicionar();
	});

    loadXML();
    

});
   


//----------------- CARGA XML --------------------//
function loadXML() {
	jQuery.ajax({
		type : "GET",
		url : "data" + currentIndex + ".xml",
		dataType : "xml",
		success : xmlParser
	});	
}

function xmlParser(xml) {				
	arr = [];	
	jQuery(xml).find("element").each(function() {
		var element = jQuery(this);
		
		var intentos = jQuery(this).children("intentos").text();
		var audiotitulo = jQuery(this).children("audio_titulo").text();
		var audiopantalla = jQuery(this).children("audio_pantalla").text();
		var type = jQuery(this).attr('type');
		var id = jQuery(this).attr('id');
		var place_objects = jQuery(this).attr('place_objects');
		
		var titulo = jQuery(this).children("titulo").text();
		var headercolor = jQuery(this).children("headercolor").text();
		var colortitulo = jQuery(this).children("colortitulo").text();
		var fuentetitulo = jQuery(this).children("fuentetitulo").text();
		var tamanotitulo = jQuery(this).children("tamanotitulo").text();
		
		var enunciado = jQuery(this).children("enunciado").text();
		var colornom = jQuery(this).children("colortexto").text();
		var fuentenom = jQuery(this).children("fuentetexto").text();
		var tamanonom = jQuery(this).children("tamanotexto").text();
		var justifynom = jQuery(this).children("justificaciontexto").text();

		var img = jQuery(this).children("imagenes").text();
		var aleatorios = jQuery(this).children("aleatorios").text(); 
	
		arr.push({
			'element' : element,
			
			'intentos' : intentos,
			'audiotitulo' : audiotitulo,
			'audiopantalla' : audiopantalla,
			'type' : type,
			'id' : id,
			'place_objects' : place_objects,
			
			'enunciado' : enunciado,
			'colornom': colornom,
			'fuentenom': fuentenom,
			'tamanonom': tamanonom,
			'justifynom': justifynom,
			
			'titulo' : titulo,
			'headercolor': headercolor,
			'colortitulo': colortitulo,
			'fuentetitulo': fuentetitulo,
			'tamanotitulo': tamanotitulo,
			
			'img' : img,
			'aleatorios':aleatorios
		});
	});
	
	urlAudioPrincipal = arr[0].audiotitulo; //NOMBRE DEL AUDIO PRINCIPAL
	urlAudioPantalla = arr[0].audiopantalla; //NOMBRE DEL AUDIO POR PANTALLA
	
	barraAnaya();
	PonerIdiomaActividad();
	
	drawAll();
	
	play_Audio(urlAudioPrincipal,urlAudioPantalla);
	play_Video();
	play_Galeria();	
	play_File();
}





function drawAll() {
	currentIndex++;
	jQuery('#text').empty();
	jQuery('#elements').empty();
	jQuery("#respuestas").hide();

	idAct = arr[0].id;
	// ERROR ID
	if (arr[0].id == "" || arr[0].id == undefined){
		alert('Te falta añadir el ID de la actividad a cada data.xml. \n\n <element type="" id="" place_objects="">');
	}
	// Pintar Cabecera
	if (arr[0].headercolor != ""){
		jQuery('header').css({'background-color':arr[0].headercolor});
	}
	// Pintar Cabecera PopUp
	$('head').append(
		'<style class="headerPopUp">'+
			'.ui-widget-header {	'+
				'background-color: '+arr[0].headercolor+' !important;'+
				'color: '+arr[0].colortitulo+' !important;'+
			'}'+
		'</style>'
	);	
	// Pinta el Titulo
	var titulo = arr[0].titulo;
	jQuery('h1').html(titulo); 
	jQuery('header h1').css({'color':arr[0].colortitulo,'font-family':arr[0].fuentetitulo});
	if(arr[0].tamanotitulo) {
		jQuery('h1').css({ 'font-size': arr[0].tamanotitulo+"px"	});
	}else {
			var h1Contador = jQuery('h1').text().length;
			if(h1Contador < 48){
				jQuery('h1').css('font-size','2em');
				jQuery('h1').css('margin-top','5px');
			}  else if(h1Contador > 47 && h1Contador < 65){
				jQuery('h1').css('font-size','1.5em');
			} else if(h1Contador > 64 && h1Contador < 73){
				jQuery('h1').css('font-size','1.3em');
				jQuery('h1').css('margin-top','12px');
			} else if(h1Contador > 72 && h1Contador < 102){
				jQuery('h1').css('font-size','1em');
				jQuery('h1').css('margin-top','16px');
			} else if(h1Contador > 101){
				jQuery('h1').css('font-size','1em');
				jQuery('h1').css('margin-top','7px');
			}
	}	
	// Pinta el Enunciado
	var enunciado = arr[0].enunciado;
	if(enunciado != ""){$("<h5>"+enunciado+"</h5>").appendTo('#elements');} 	
	jQuery('#elements > h5').css({ 'font-size': arr[0].tamanonom+"px",'color':arr[0].colornom,'font-family':arr[0].fuentenom, 'text-align': arr[0].justifynom	});
	// Pinta la Imagen
	var img = arr[0].img; 
	if(img != ""){$("<img src='imagenes/"+img+"'/>").appendTo('#elements');} 
	//Quita los estilos a la caja de Respuestas
	jQuery("#respuestas").removeAttr('class');		
	
	//**************** Pinta el Ejercicio segun el TYPE
	//*************************************************
	arr[0].element.each(function(i,v) {
		var type = jQuery(this).attr('type');
		if (type == 'input') {
			drawInput(v, i);	
		} else if (type == 'click') {	
			drawClick();
		}  else if (type == 'drag') { 
			drawDrag();
		}  else if (type == 'rel') {
			drawRel();
		}  else if (type == 'sortable') {
			drawlistaSortable();
		}  else if (type == 'esquema') {
			esquemaXMLParser();
		}	else if (type == 'libre') {
			drawLibre();
		}		
	});	
}



//----------------- MOSTRAR DIALOG CON #respuestas --------------------//
function sacarRespuestasEnDialog(){     
	jQuery( "#respuestas" ).dialog({
		autoOpen : true,
		draggable : true,
		zIndex : 10900,
		resizable : true,
		show : 'fade',
		hide : 'fade',
		minHeight: 150,
		width: 800,
        close: function() { jQuery( "#respuestas" ).empty();	}
	});	
		
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	jQuery( 'div.ui-dialog > div[id=respuestas]' ).parent().addClass('theDialogResp' );	
	jQuery( "div.theDialogResp div.ui-dialog-titlebar > span.ui-dialog-title" ).html(TextoSolucion);
	jQuery( "div.theDialogResp #dialog > p" ).html(TextoDialogoAudioInicio);
	jQuery( "div.theDialogResp .ui-button-text" ).html(TextoDialogoAudioBotton);
	jQuery( "div.theDialogResp .ui-dialog-titlebar-close" ).css("display","block");
}

//----------------- FUNCION PARA PONER ALEATORIOS --------------------//
function suffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

//----------------- DETECTAR EL AGENT --------------------//
function is_mobile() {
	var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
	for(var i in agents) {
		if(navigator.userAgent.toLowerCase().search(agents[i]) > 0) {
			return true;
		}
	}
	return false;
}




//---------------------------- MIS FUNCIONES ----------------------------//
//-----------------------------------------------------------------------//

// transformar_texto('palabra','limpiar_carac,min,may,first_may');
function transformar_texto(str,type) {
	var pal = '';
	var estilos = type.split(',');

	$.each(estilos,function (i,v){
		if(v == 'min'){ pal = str.toLowerCase(); }
		if(v == 'may'){ pal = str.toUpperCase(); }
		if(v == 'limpiar_carac'){
			var map={'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'AE','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ð':'D','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ø':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ý':'Y','ß':'s','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o','ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y','?':'A','?':'a','?':'A','?':'a','?':'A','?':'a','?':'C','?':'c','?':'C','?':'c','?':'C','?':'c','?':'C','?':'c','?':'D','?':'d','?':'D','?':'d','?':'E','?':'e','?':'E','?':'e','?':'E','?':'e','?':'E','?':'e','?':'E','?':'e','?':'G','?':'g','?':'G','?':'g','?':'G','?':'g','?':'G','?':'g','?':'H','?':'h','?':'H','?':'h','?':'I','?':'i','?':'I','?':'i','?':'I','?':'i','?':'I','?':'i','?':'I','?':'i','?':'IJ','?':'ij','?':'J','?':'j','?':'K','?':'k','?':'L','?':'l','?':'L','?':'l','?':'L','?':'l','?':'L','?':'l','?':'L','?':'l','?':'N','?':'n','?':'N','?':'n','?':'N','?':'n','?':'n','?':'O','?':'o','?':'O','?':'o','?':'O','?':'o','Œ':'OE','œ':'oe','?':'R','?':'r','?':'R','?':'r','?':'R','?':'r','?':'S','?':'s','?':'S','?':'s','?':'S','?':'s','Š':'S','š':'s','?':'T','?':'t','?':'T','?':'t','?':'T','?':'t','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'W','?':'w','?':'Y','?':'y','Ÿ':'Y','?':'Z','?':'z','?':'Z','?':'z','Ž':'Z','ž':'z','?':'s','ƒ':'f','?':'O','?':'o','?':'U','?':'u','?':'A','?':'a','?':'I','?':'i','?':'O','?':'o','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'U','?':'u','?':'A','?':'a','?':'AE','?':'ae','?':'O','?':'o'};
			for (var i = 0; i < str.length; i++) {
				c = str.charAt(i);
				pal += map[c] || c;
			}
		}		
		if(v == 'first_may'){ 
			var letras = '';
			$.each(pal,function (i,v){
				if(i == 0){  letras += v.toUpperCase();
				}else{ letras += v.toLowerCase(); }
			});
			pal = letras
		}
		str = pal
	});

	return pal;
}


//  $('iD').mouseoverColor();	
jQuery.fn.mouseoverColor = function(a){
	var ColorFondo
	$(this).mouseover(function() {		
		ColorFondo = jQuery(this).css('background-color');				
		hexc(ColorFondo);
		jQuery(this).css('background-color',colorFin);

	}).mouseout(function() {			
		jQuery(this).css('background-color',ColorFondo);	
	}).mouseup (function() {	
		jQuery(this).css('background-color',ColorFondo);
	});

	function hexc(colorval) {
		var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		delete(parts[0]);
		for (var i = 1; i <= 3; ++i) {
			parts[i] = parseInt(parts[i]) + 20;				
			parts[i] = parts[i].toString(16);
			if (parts[i].length == 1) parts[i] = '0' + parts[i];
		}
		colorFin = '#'+parts.join('');	
	}
}