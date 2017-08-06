

﻿
// 10 – Algaida Editorial
// 20 – Anaya Educación
// 30 – Barcanova Editorial
// 40 - Bruño Educación
// 50 - Xerais
// 99 - Genérico

var nomCarpIcon = 'iconos'; //Nombre de la carpeta dentro de Config donde se encuentran los iconos

function barraAnaya(){
	if(!jQuery('link.cssBarraAnaya').length){  cssVisorActividad(); };

	var obj = arr[0].element.find('control').text();
	if(obj != ''){ obj = obj.split(',');
	}else{	obj = ''; }

	$('div[data-anaya=barraInferior]').remove();
	var logo;
	var control = '<div data-anaya="barraInferior" >';
		control += '<ul>';
		$.each(obj,function (i,v){
			var btnControl = v.split(':');
			var nombre = btnControl[0];
			control += '<li id="'+nombre+'" data-anaya="'+nombre+'"';
			if(nombre == 'logo'){
				var editorial = transformar_texto(confActividad['logo'],'limpiar_carac,min');

				if(editorial == '20'){ logo = 'anaya'; }
				else if(editorial == '10'){  logo = 'algaida'; }
				else if(editorial == '30'){  logo = 'barcanova'; }
				else if(editorial == '40'){  logo = 'bruno'; }
				else if(editorial == '50'){  logo = 'xerais'; }
				else if(editorial == '99'){  logo = 'generico'; }
				else { logo = editorial; }
				control += ' title="'+logo+'">';
				control += '<a href="'+confActividad['link']+'" target="_blank">';
				control += '<img src="config/'+nomCarpIcon+'/logos/'+logo+'.png" border=0>';
				control += '</a>';
			}else{
				control += '>';
				control += '<div class="anaya-state-default anaya-icon-'+nombre+'"></div>';
				control += '<span>'+nombre+'</span>';
			}
			control += '</li">';		
			if(nombre == 'audio'){ control += '<section id="sliderAudio"></section>';};
			
			var estadoBtn = btnControl[1] || 'FAIL';
			estadoBtn = transformar_texto(estadoBtn,'limpiar_carac,min');
			if(estadoBtn.indexOf('in')!=-1){	
				btnBarraAct['botonesInactivos'].push(nombre);	
			}else if(estadoBtn.indexOf('ac')!=-1){	
				var idx = btnBarraAct['botonesInactivos'].indexOf(nombre);
				if(idx!=-1) btnBarraAct['botonesInactivos'].splice(idx, 1);
			}
		});
		control += '</ul">';
		control += '</div>';
	$(control).appendTo(btnBarraAct['mostrarEn']);
	jQuery(btnBarraAct['mostrarEn']).hide();

	var nIcons = jQuery('[data-anaya=barraInferior] > ul > li').length;
	if(!urlAudioPrincipal && jQuery('li#audio').length){ nIcons = nIcons - 1} ;//QUITAR SI NO HAY AUDIO
	if((currentIndex+1) == pantallas && jQuery('li#siguiente').length){ 
		jQuery('[data-anaya=barraInferior] > ul > li#siguiente').remove()
		nIcons = nIcons - 1
	};//QUITAR SI NO HAY MAS PANTALLAS
	var wIcons = 100 / nIcons;
	jQuery('[data-anaya=barraInferior] > ul > li').css({
		'width':wIcons+'%',
	});	
	
	jQuery("[data-anaya=barraInferior]").find('li:not("#logo")').mouseover(function(){
		if(!$(this).hasClass('anaya-state-inactivo')){
		}
	});

	var inactivos = btnBarraAct['botonesInactivos'];
	$("[data-anaya='barraInferior'] > ul > li").each(function(){
		var id = $(this).attr('id');	
		$.each(inactivos,function(i, select){
			if(id == select){	
				$('#'+id+'').data('inactivo',true);
				$('#'+id+'').addClass( "anaya-state-inactivo" );
				$('#'+id+'').attr('title', '');
			}
		});	
	});	
	jQuery('footer').fadeIn(10);
		

	jQuery( "[data-anaya=notas]" ).unbind().bind('click', function(){
		if(!$(this).hasClass('anaya-state-inactivo')){
			if ($('#notepad').length){
				$( "#notepad" ).dialog("isOpen")? $( "#notepad" ).dialog("close"):$( "#notepad" ).dialog("open");
			}else{
				alert('No esta enlazado el archivo "editor_notas.js" para que funcione correctamente.');
			}
		}
	});	


	jQuery("[data-anaya=cerrar]").unbind().bind('click', function(e){			
		if(!$(this).hasClass('anaya-state-inactivo') && $(this).attr('id') == 'cerrar'){
			//if (Scorm_conectado()){salirSCOSinTerminar();}; //Llamada a salir librería Scorm	sin terminar el ejercicio		
		
		}else if(!$(this).hasClass('anaya-state-inactivo') && $(this).attr('id') == 'final'){
			//if (Scorm_conectado()){salirSCOFinalizado()}; //Llamada a salir librería Scorm
			alert(TextoAlertCerrarFin);
			
			jQuery("#final").removeAttr('id').attr('id','cerrar');
			setTimeout(function() {
				ocultar_bot("#otravez");
				ocultar_bot("#cerrar");
			}, 500);
		}
		$("#cerrar").addClass("anaya-state-inactivo");
		$("#otravez").addClass("anaya-state-inactivo");
		window.close();
	});
		
	jQuery("[data-anaya=otravez]").unbind().bind('click', function(e){
		if(!$(this).hasClass('anaya-state-inactivo')){
			setTimeout(function() { 
				ocultar_bot("#otravez");
				ocultar_bot("#cerrar");
				location.reload(true);
			}, 500);
		}
	});

	$( "[data-anaya=ayuda]" ).unbind().bind('click', function(event){	
		if(!$(this).hasClass('anaya-state-inactivo')){
			cajaAyuda();
		}
	});
	
	var imprimir = 'imprimir.pdf';
	$( "[data-anaya=imprimir]" ).unbind().bind('click', function(){	
		window.open('imprimir/'+imprimir+'','_blank',"toolbar=no, scrollbars=yes,top=0, left=0, resizable=yes, width=800, height=600");
	});
	
	$( "[data-anaya=anterior]" ).unbind().bind('click', function(){	
		if(!$(this).hasClass('anaya-state-inactivo')){
			currentIndex = currentIndex - 2;
			loadXML();
		}
	});
	
	$( "header" ).unbind().bind('click', function(){
		if (Scorm_conectado()){Scorm_conectado()?bienvenidaSco():false;};
	});

	$("#siguiente").unbind().bind('click', function(){
		if(!$(this).hasClass('anaya-state-inactivo')){
			if($('.ui-dialog:visible').length){	$( "#respuestas" ).empty().dialog("destroy");	}
			ocultar_bot("#siguiente");
			jQuery('#mensaje').remove();
			loadXML();
		}
	});
}


function cssVisorActividad(){
	$("head").append($('<link rel="stylesheet" href="config/'+nomCarpIcon+'/css/barraAnaya.css" media="screen" class="cssBarraAnaya" >'));
	$("head").find('title').text('');
	
	var tipoVisor = transformar_texto(confActividad['iconos'],'limpiar_carac');
	var ruta = tipoVisor.split('_');
	var numCarpetas = ruta.length;
	var carpeta = '';
	var icono = '';
	var edit = '';
	
		carpeta += nomCarpIcon;
		$.each(ruta,function (i,v){
			carpeta += '/';
			carpeta += v;
			if((i+1) < numCarpetas){
				icono += v;
				icono += '-';
			}else if((i+1) == numCarpetas){
				icono += v;
			}
		});
				
	$('head').append(
		'<style class="cssBarraAnaya">'+
			'[data-anaya=barraInferior] > ul > li > div{	'+
				'background-image:  url(config/'+carpeta+'/'+icono+'-default.png);'+
			'}'+
			'[data-anaya=barraInferior] > ul > li:not(.anaya-state-inactivo):hover > div{ '+
				'background-image:  url(config/'+carpeta+'/'+icono+'-hover.png);'+
			'}'+
			'[data-anaya=barraInferior] > ul > li:not(.anaya-state-inactivo):active > div{'+
				'background-image:  url(config/'+carpeta+'/'+icono+'-active.png);'+
			'}'+
			'[data-anaya=barraInferior]{'+
				'background-color:  '+btnBarraAct['BgColor']+';'+
			'}'+
		'</style>'
	);
}

(function($){ 
	$.fn.control = function(param) { 
		return this.each(function(){		
				switch (param){

				case "Correcto":
					jQuery('#mensaje').remove();
					$(this).append('<div id="mensaje"><img src="config/img/OK.png"/></div>');
					mostrarYocultar_mensaje("#mensaje");
					setTimeout(function(){$("#mensaje").posicionar();}, 10);
						if(currentIndex != pantallas){
							setTimeout(function(){
								loadXML();
							}, 4000);
						}
					jQuery('#mensaje').hide();
				break;
				
				case "Incorrecto":
					jQuery('#mensaje').remove();
					$(this).append('<div id="mensaje"><img src="config/img/KO.png"/></div>');
					mostrarYocultar_mensaje("#mensaje");
					setTimeout(function(){$("#mensaje").posicionar();}, 10);
					jQuery('#mensaje').hide();
				break;
				
				case "Siguiente":
					mostrar_bot("#siguiente");
					animar_bot("#siguiente");
					$("#siguiente").unbind().bind('click', function(e){ 
						if($('.ui-dialog:visible').length){	$( "#respuestas" ).empty().dialog("destroy");	}
						ocultar_bot("#siguiente");
						jQuery('#mensaje').remove();
						loadXML();
					});
				break;
				
				case "Finalizado":
					jQuery(this).append('<div id="mensajefinal"><p>'+TextoActividadFinalizada+'</p></div>');
					//mensajeFinalSCO es el mensaje del script scorm.js
					//jQuery("#mensaje").append("<h7>"+mensajeFinalSCO+"</h7>");
					//mensajeFinalSCO es el mensaje del script scorm.js
						mostrar_bot("#cerrar");
						animar_bot("#cerrar");
						if ($('#otravez').length){
							mostrar_bot("#otravez");
							animar_bot("#otravez",100);
						}
		
						$("#mensajefinal").dialog({
							buttons: [{
								text: "Ok",
								click: function() { 
								$( "#mensajefinal" ).dialog("destroy");
								$( "#mensajefinal" ).remove();
							}}],
							resizable: false,
							draggable : true,
							modal : true,
							show : 'fade',
							hide : 'fade',
							dialogClass: 'noTitleStuff'
						});
					jQuery( ".noTitleStuff .ui-button-text" ).html(TextoDialogoAudioBotton);
					jQuery("#cerrar").removeAttr('id').attr('id','final');	
				break;
				}
		});
	};  
})(jQuery);

function mostrarYocultar_mensaje(mensaje){
	$(mensaje).fadeIn(100, function(){	
		time = setTimeout(function(){
			jQuery("#mensaje").fadeOut(100, function(){
				jQuery('#mensaje').remove();
			});
		}, 4000);
	});
}

function mostrar_bot(bot){
	$(bot).attr("animar",true);
	$(bot).css("cursor","");
	$(bot).removeClass("anaya-state-inactivo");
	var title = $(''+bot+'>span').html();
	$(bot).attr('title', ''+title+'');
	if ($(bot).data('inactivo')){
		$(bot).data('inactivo',false);
	}
}

function ocultar_bot(bot){
	if (!($(bot).data('inactivo'))){
		$(bot).css("cursor","default");
		$(bot).addClass("anaya-state-inactivo");
		$(bot).unbind();
		$(bot).removeAttr("animar");
		$(bot).removeAttr('title');
		$(bot).removeClass("iluminaBoton");
		$(bot+'>div' ).removeClass("animateBoton");
		$(bot+'>span').removeClass("iluminaText");
	}
}

function animar_bot(bot, posAdic){
	 $(bot).addClass("iluminaBoton");
	 $(bot+'>div' ).addClass("animateBoton");
	 $(bot+'>span').addClass("iluminaText");
}

(function($){ 
	$.fn.posicionar = function() { 
		return this.each(function(){		
			var esteAncho = '160'
			$(this).css({"position":"absolute"});			
			$(this).css("top", Math.max(0, ((($(window).height() - esteAncho) / 3)*2.5) + $(window).scrollTop()) + "px");
			$(this).css("left", Math.max(0, (($(window).width() - esteAncho) / 2) + $(window).scrollLeft()) + "px");			
			jQuery(this).show();
		});
	};  
})(jQuery);