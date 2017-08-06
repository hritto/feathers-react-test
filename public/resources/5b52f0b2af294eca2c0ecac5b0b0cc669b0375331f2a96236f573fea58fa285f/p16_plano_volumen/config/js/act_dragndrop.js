

var drag_arr = [];
var drop_arr = [];
var current_grup_advanced;
var current_item_advanced;
var draggable_mobile_advanced = [];
var divDropAreas = 0;
var dropCount_advanced = 0;
var arrayDropsIncorrectos=new Array();
var intentos_advanced=0;
var contador_D_D; //para sacar el check
var drag_one2one_advanced; //determinar si cada drag tiene un drop específico o múltiples drag van a un drop
var drag_erase; //el drag o elemento que se arrastra sustituye al elemento en el contenedor.
var drags_solo_uno; 

var nom_text; //Para recoger el contenido de la PALABRA
var nom_imagen; //Para recoger el contenido de la IMAGEN
var nom_img; //Para recoger el contenido de la IMAGEN
var nom_locucion; //Para recoger el contenido de la LOCUCION
var nom_video; //Para recoger el contenido de la VIDEO
var nom_file; //Para recoger el contenido de la VIDEO

var hayImgFondo; //Para saber si hay imagen de fondo


//----------------- FUNCIONES PARA DRAG --------------------//
function drawDrag() {

	var delay = 0;
	var items = arr[0].element.find('drag_and_drop').children('drag_item');
	drag_arr = jQuery(items); //Numero de objetos arrastables

	
	var drags_no_aleatorios = arr[0].aleatorios;
	if (drags_no_aleatorios == 0){ items = suffle(items);}

	var dragItems = '<div id="dragItems"></div>';
	$(dragItems).appendTo('#text');


	var dragItems = '<div style="clear: both"></div>';
	$(dragItems).appendTo('#text');
	
	
	
	$.each(items, function(i, v) {		
		var BgColor = jQuery(this).attr("BgColor");
		var Color = jQuery(this).attr("Color");
		var opaFont = jQuery(this).attr("opaFont");
		var opaBG = jQuery(this).attr("opaBG");
		var FontSize = jQuery(this).attr("FontSize")+'px';
		var width = jQuery(this).attr("w")+'px';
		var height = jQuery(this).attr("h")+'px';
		var posH = jQuery(this).attr("posH")+'px';
		var posV = jQuery(this).attr("posV")+'px';
		var lHeight = jQuery(this).attr("L-Height")+'px';

		nom_text = $(v).children('palabra').text();
		nom_imagen = $(v).children('imagen').text();
		nom_img = $(v).children('img').text();
		nom_img_title = $(v).children('img').attr('titulo');
		nom_locucion = $(v).children('yooigo').text();
		nom_video = $(v).children('yoveo').text();
		nom_file = $(v).children('yofile').text();
		
		var nom_clean = nom_text||nom_imagen||nom_img||nom_locucion||nom_video||nom_file; // si es texto devuelve text() y si es imagen devuelve trim

			var tAnchor = '<a class="item" id="item_';
			tAnchor += i+'"';
			tAnchor += ' data-pal_drag="'+nom_clean+'"';
			tAnchor += ' style="top:'+posV+'; left:'+posH+';  min-width:'+width+'; height:'+height+'; opacity:'+opaBG+'; background-color:'+BgColor+';"';
			tAnchor += ' draggable="true">';
				if(nom_text != ''){
					tAnchor += '<p  style="font-size:'+FontSize+'; color:'+Color+'; opacity:'+opaFont+'; line-height:'+lHeight+';">'+nom_text+'</p>';
				}else if(nom_img != ''){	
					tAnchor += '<img src="'+widget_imagen_icono+'" image="'+nom_img+'" alt="" />';
				}else if(nom_imagen != ''){	
					tAnchor += '<img src="imagenes/'+nom_imagen+'" image="'+nom_imagen+'" alt="" />';
				}else if(nom_locucion != ''){	
					tAnchor += '<span class="yooigo" title="">'+nom_locucion+'</span>'; 
				}else if(nom_video != ''){	
					tAnchor += '<img src="'+widget_video_icono+'" video="'+nom_video+'" alt="" /> ';
				}else if(nom_file != ''){	
					tAnchor += '<img src="'+widget_file_icono+'" file="'+nom_file+'"  alt=""/> ';
				}
			tAnchor += '</a>';
			$(tAnchor).appendTo("#dragItems");
			$(tAnchor).data("last_drag",0);
			$(tAnchor).data("drag_corr",0);
		
			var dNode = '#item_' + i;
			var dragNode = $(dNode)
	
			dragNode.delay(delay).fadeIn(250);
			delay += 150;
			
			if(is_mobile()) {
				draggable_mobile_advanced[i] = new webkit_draggable('item_' + i, draggable_options_advanced);
			} else {
				dragNode.css('cursor', 'move');
				dragNode.bind('dragstart', dragStartEvent_advanced);
				dragNode.bind('dragend', dragEndEvent_advanced);
			}
		
	});

	
	drags_solo_uno = arr[0].element.find('drag_and_drop').children('drags_solo_uno').text();
	//if(drags_solo_uno == 1){jQuery('#dragItems').css('display','block');}
	
	if(drags_solo_uno == 1){ 
		var dragWidth = -$('#dragItems > a').outerWidth() / 2;
		$('#dragItems').css('display','block');
		$('#dragItems > a').css({'position' : 'absolute', 'top' : '0px', 'left' : '50%','margin-left' : dragWidth});
	}

		

	var dropArea = arr[0].element.find('drag_and_drop').children('dropArea').text();
	var AA = doActiveAreasFromDropArea(dropArea);
	$(AA).appendTo('#text');

	var o = arr[0].element.find('drag_and_drop').children('dropArea').attr('opaBG')
	var opaBG = (0 == undefined || 0 == "")? "1" : o;
	
	jQuery('article').css({
		'background-color':"#"+arr[0].element.find('drag_and_drop').children('dropArea').attr('BgColor'),
		'background-image':"url(imagenes/"+arr[0].element.find('drag_and_drop').children('dropArea').attr('BGImg')+")",
		'opacity':+opaBG,
		
		'top':arr[0].element.find('drag_and_drop').children('dropArea').attr('posV')+'px',
		'left':arr[0].element.find('drag_and_drop').children('dropArea').attr('posH')+'px',
		'width':arr[0].element.find('drag_and_drop').children('dropArea').attr('w')+'px',
		'height':arr[0].element.find('drag_and_drop').children('dropArea').attr('h')+'px',
		
		'color':"#"+arr[0].element.find('drag_and_drop').children('dropArea').attr('fontColor'),
		'font-size':arr[0].element.find('drag_and_drop').children('dropArea').attr('fontSize')+'px',
		'font-family':arr[0].element.find('drag_and_drop').children('dropArea').attr('fontFamily'),
		'text-align':arr[0].element.find('drag_and_drop').children('dropArea').attr('textAlign')
	});



	
	
	//AÑADIR CLASE 'PARRAFO' AL ARTICLE
	var ponerParrafo = !jQuery('article > .columnas > div').hasClass('caja');
	//if(ponerParrafo){jQuery('article > .columnas').addClass('parrafo');}
	

	
	$('div.activearea').each(function() {
		var dropNode = $(this);

		if(is_mobile()) {
			webkit_drop.add(this, droppable_options_advanced);
		} else {
			dropNode.bind('dragenter', dragEnterEvent_advanced);
			dropNode.bind('dragover', dragOverEvent_advanced);
			dropNode.bind('dragleave', dragLeaveEvent_advanced);
			dropNode.bind('drop', dropEvent_advanced);
		}
	});
	
	intentos_advanced = arr[0].intentos || '9999999999999999999999';
	drag_one2one_advanced = arr[0].element.find('drag_and_drop').children('drag_one2one').text();
	drag_erase = arr[0].element.find('drag_and_drop').children('drag_erase').text();
	contador_D_D=0;
	colocarElementPant_DragnDrop();

	// Para editar, grabar los objetos del XML en el array objetosDraggable de functions.js
	//if(editarActividad) {	leerXMLparaDrags();	leerXMLparaDops();}
}




//mobile
var droppable_options_advanced = {

	hoverClass : 'dragenter',
	onOver : function(e) {
		//
	},
	onOut : function(e) {
		//	
	},
	onDrop : function(e) {
		
		//console.log("contador_D_D_mobile " + contador_D_D);
		if (contador_D_D == $('a[id^="item_"]').length-1){
			mostrar_bot("#comprobar");//Aparece el boton comprobar
			animar_bot("#comprobar");
			check_Dragandrop_advanced("#comprobar");
		}else{
			 ocultar_bot("#comprobar") //Desaparece el boton comprobar
		}
	
		var item = e['id'];
		var sAnchor = '#';
		sAnchor += item;
		var anchor = jQuery(sAnchor);
		
		anchor.removeClass('dragged');
		anchor.css('opacity', '1');
		
			
	//************************************************************************//
	//parche para mobile, no coge "this" y lo sustituimos por "div.dragenter"
	//************************************************************************//
		var divDrop= $("div.dragenter");
		//comprobación inicial para que se sustituya el texto original del drop o no. Si ya se ha arrastrado anteriormente y el contenedor está "ocupado", el drag vuelve a la posición inicial
		if(!drop_txt2parraf(divDrop)) { 
			return;
		}
		contador_D_D++; //cada vez que se arrastra un elemento aumentamos el contador 
		var dropActual = $(divDrop).data("pal_drop"); 
		var dragActual = $(anchor).data("pal_drag");
		
		
		if(drag_one2one_advanced==1){$(divDrop).addClass("dropped");$(divDrop).removeClass("activearea");}
	
		var dropIncorrecto=true;
	
		if(drag_one2one_advanced){ //parche para los contenedores
			var arrayDropActual = dropActual.split("*");

			$(arrayDropActual).each(function (i,v) {
				if (v  == dragActual ){
				return dropIncorrecto=false;
				}
			});
		}
	
			if (dropIncorrecto){//el drop es incorrecto
				if (intentos_advanced){ //todavía quedan intentos
				// la propiedad 'correct_drop' está inicializada a 0, por lo tanto se queda como está.
		
					$(anchor).css('visibility','hidden');
					
				}else{ //no hay intentos, así que desactivamos los anchors y drops
					$(divDrop).unbind();
					$(anchor).unbind();
					$(anchor).css('visibility','hidden');
				}
		
			}else{ // el drop es correcto y aunque queden intentos ya se deja la imagen fija. 	
				$(anchor).data('drag_corr', 1); // y especificamos que está bien colocad	o
				$(anchor).unbind(); //Ojo. Cambio en múltiples drags sobre un mismo drop. El drop no se desactiva, el drag SÍ
				$(anchor).css('visibility','hidden');		
			}

			if(drag_one2one_advanced==1){ 	
				if (drag_erase==1){
					if(nom_text){
						if(hayImgFondo){
							$(divDrop).html('<font>'+dragActual+'</font>'); // Este es el comportamiento normal con imágenes
						}else{
							$(divDrop).text(dragActual);
						}
					}else if(nom_imagen){
						$(divDrop).html('<img src="imagenes/'+dragActual+'" />'); // Este es el comportamiento normal con imágenes
					}else if(nom_img){
						$(divDrop).html('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
						fotoClickFunction();	
					}else if(nom_locucion){
						$(divDrop).html('<span class="yooigo" title="">'+dragActual+'</span>'); 
						crearYooigo();
						audioClickFunction();	
					}else if(nom_video){
						$(divDrop).html('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
						videoClickFunction();	
					}else if(nom_file){
						$(divDrop).html('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
						fileClickFunction();	
					}
				}else{
					if(nom_text){
						if(hayImgFondo){
							$(divDrop).append('<font>'+dragActual+'</font>'); // Este es el comportamiento normal con imágenes
						}else{
							$(divDrop).append(dragActual);
						}
					}else if(nom_imagen){
						$(divDrop).append('<img src="imagenes/'+dragActual+'" />'); // Este es el comportamiento normal con imágenes
					}else if(nom_img){
						$(divDrop).append('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
						fotoClickFunction();	
					}else if(nom_locucion){
						$(divDrop).append('<span class="yooigo" title="">'+dragActual+'</span>'); 
						crearYooigo();
						audioClickFunction();	
					}else if(nom_video){
						$(divDrop).append('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
						videoClickFunction();	
					}else if(nom_file){
						$(divDrop).append('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
						fileClickFunction();	
					}
				}
			}else{ //multirespuesta
				if(nom_text){
					$(divDrop).append('<p>'+dragActual+'</p>'); // Este es el comportamiento normal con imágenes
				}else if(nom_imagen){
					$(divDrop).append('<img src="imagenes/'+dragActual+'" />'); // Este es el comportamiento normal con imágenes
				}else if(nom_img){
					$(divDrop).append('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
					fotoClickFunction();	
				}else if(nom_locucion){
					$(divDrop).append('<span class="yooigo" title="">'+dragActual+'</span>'); 
					crearYooigo();
					audioClickFunction();	
				}else if(nom_video){
					$(divDrop).append('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
					videoClickFunction();	
				}else if(nom_file){
					$(divDrop).append('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
					fileClickFunction();	
				}
			}

			//añadimos a data-last_drag al drop actual para el control posterior
			//$(anchor).attr('data-last_drag',$(divDrop).get(0).outerHTML); //del objeto divDrop saco el literal del nombre del drop para luego tratarlo.
			$(anchor).data('last_drag',$(divDrop)); 
		}
}

var draggable_options_advanced = {
	revert : 'always',
	scroll : true,
	onStart : function() {
		jQuery('#message').fadeOut(200);
		jQuery('#message').removeClass();
	},
	onEnd : function() {
		//
	}
}


function dragStartEvent_advanced(e) {
	current_item_advanced = this.getAttribute('id');
	$('#message').fadeOut(200);
	$('#message').removeClass();
	e.originalEvent.dataTransfer.effectAllowed = 'move';
	e.originalEvent.dataTransfer.setData("Text", current_item_advanced);
	$(this).css('opacity', '.5');
}

function dragEndEvent_advanced(event) {
	$(this).css('opacity', '1');
}

function dragEnterEvent_advanced(e) {
	if($(this).hasClass('activearea')){
		$(this).addClass('dragenter');
	}
}

function dragOverEvent_advanced(e) {

	e.preventDefault();
	e.originalEvent.dataTransfer.dropEffect = 'move';
	
	if($(this).hasClass('activearea')){
		$(this).addClass('dragenter');
	}
}

function dragLeaveEvent_advanced(e) {
	$(this).removeClass('dragenter');
}

function check_Dragandrop_advanced(bot){ 	

	$(bot).unbind().bind('click', function(){
		ocultar_bot(bot)//Desaparece el boton comprobar
			intentos_advanced--;
			
			$.each($('a[id^="item_"]'), function(i, v) {
				var incorrect_item_drag ="";
				var incorrect_item_drop ="";
				var last_drag;

				
				if ($(v).data("drag_corr")){
					last_drag = $(v).data("last_drag");
					
					if(!$(last_drag).hasClass("welldone")|| $(last_drag).find($("p:contains('"+$(v).data("pal_drag") +"')")).hasClass("welldone")){ // Ya está evaluada, estamos con múltiples intentos. Meto los múltiples containers evaluando los <p> por si están correctos.
						if(drag_one2one_advanced==0){
							$(last_drag).find($("p:contains('"+$(v).data("pal_drag") +"')")).addClass('welldone');
							$(".caja span img[src='imagenes/"+$(v).data("pal_drag")+"']").addClass("welldone");
							$(".caja span img[alt='"+$(v).data("pal_drag")+"']").addClass("welldone");	
							$(".caja span img[video='"+$(v).data("pal_drag")+"']").addClass("welldone");	
						}else{
							$(last_drag).addClass('welldone');
							if ((last_drag).data("pal_fin") != "" && nom_text){
								
								if (drag_erase==1){   (last_drag).text();
								}else{   (last_drag).text($(last_drag).data("pal_fin"));  }
								
							}else if ((last_drag).data("pal_fin") != "" && nom_img){
								(last_drag).html('<img src="imagenes/'+$(last_drag).data("pal_fin")+'" />');
								
							}else if ((last_drag).data("pal_fin") != "" && nom_locucion){
								(last_drag).html('<span class="yooigo" title="">'+$(last_drag).data("pal_fin")+'</span>');
								crearYooigo();
								audioClickFunction();	
							}else if ((last_drag).data("pal_fin") != "" && nom_video){
								(last_drag).html('<img src="img/drag_Video_item_v2.png"  video="'+$(last_drag).data("pal_fin")+'"  alt="'+$(last_drag).data("pal_fin")+'" />');
								videoClickFunction();
							}
						}
					}
					
					var textAlternativo = $(last_drag).data("pal_fin");
					if(textAlternativo != ''){(last_drag).text(textAlternativo);}
				
				}else{
				
						
					incorrect_item_drag = $(v);
					incorrect_item_drop = $(v).data("last_drag");
					
					if(intentos_advanced){	// Tenemos más intentos
						incorrect_item_drag.css("visibility", "visible");
						$(incorrect_item_drop).removeClass('dropped');
						$(incorrect_item_drop).addClass('activearea');
						
						if(drag_one2one_advanced==0){
								if(hayImgFondo){
									$(incorrect_item_drop).find($("p:contains('"+$(v).data("pal_drag") +"')")).remove();
									$(".caja span img[src='imagenes/"+$(v).data("pal_drag")+"']").remove();
									$(".caja span img[alt='"+$(v).data("pal_drag")+"']").parent().remove();
									$(".caja span img[video='"+$(v).data("pal_drag")+"']").remove();
								}else{
									$(incorrect_item_drop).find($("p:contains('"+$(v).data("pal_drag") +"')")).text($(incorrect_item_drop).data("pal_ini"));
									$(".caja span img[src='imagenes/"+$(v).data("pal_drag")+"']").remove();
									$(".caja span img[audio='"+$(v).data("pal_drag")+"']").remove();
									$(".caja span img[video='"+$(v).data("pal_drag")+"']").remove();
								}							
						} else {
								if(hayImgFondo){
									$(incorrect_item_drop).html(''); // Este es el comportamiento normal con imágenes
								}else{
									$(incorrect_item_drop).html('<b>'+$(incorrect_item_drop).data("pal_ini")+'</b>');
								}
						}
						contador_D_D--; //cada vez que se arrastra un elemento incorrectamente disminuimos el contador 
					}else{
						if(drag_one2one_advanced==0){
							$(incorrect_item_drop).find($("p:contains('"+$(v).data("pal_drag") +"')")).addClass("fail");
							$(".caja span img[src='imagenes/"+$(v).data("pal_drag")+"']").addClass("fail");	
							$(".caja span img[alt='"+$(v).data("pal_drag")+"']").addClass("fail");	
							$(".caja span img[video='"+$(v).data("pal_drag")+"']").addClass("fail");	
						}else{
							$(incorrect_item_drop).addClass('fail');
						}
					}
						
				}
				
			}); 
			
			
			var fail = $('div.fail').length||$('p.fail').length||$('img.fail').length;
			var ok = $('div.welldone').length||$('p.welldone').length||$('img.welldone').length;
			
			if (ok!=0){
				if (ok == $('a[id^="item_"]').length){
					intentos_advanced=0;
				}
			}
				

			if(!intentos_advanced){
				$("#dragItems > a").css('visibility','hidden');

				if (ok == drag_arr.length) { /*-- CORRECTO --*/				
					var estado = "Correcto";
					actDragnDropFinalizada(estado, ok/drag_arr.length);
				}else { /*-- INCORRECTO --*/
											
					if(nom_text){
						if(drag_one2one_advanced==1){
							$("#respuestas").html("<span>"+$("article").html()+"</span>");
							$("#respuestas .estilo").removeAttr("style");
							var f= $("#respuestas").find($('div[class*="fail"]'));
							$("#respuestas .columnas span").addClass('estilo'); //Color respuestas
							$.each(f, function(i,v) {
								var respuestaIncorrecta = $(v).text();
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).text("");
								$(v).append('<b>'+ respuestaIncorrecta +'</b>');
								$(v).append(' / <span>'+ respuestaCorrecta +'</span>');
								$(v).find('b').css('color','#e2001a').css('font-weight','bold').css('text-decoration','line-through');	
								$(v).find('span').css('color', '#009036').css('text-decoration','underline').css('font-weight','bold');
							});
							var w= $("#respuestas").find($('div[class*="welldone"]'));
							$.each(w, function(i,v) {
								var respuestaCorrecta = $(v).text();
								$(v).text("");
								$(v).append('<span>'+ respuestaCorrecta +'</span>  <br/>');
								$(v).find('span').css('color', '#009036').css('font-weight','bold');
							});

								setTimeout(function() {
									sacarRespuestasEnDialog(); //Mostrar respuestas
									audioClickFunction();
									fotoClickFunction();
									videoClickFunction();
									fileClickFunction();
								}, 1000);
								
								
						}
					}else if(nom_img){
							var f= $("article").find($('div[class*="fail"]'));
							$.each(f, function(i,v) {
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).append('<img class="img_correcta" src="img/icon_imagen.png" imagen="'+respuestaCorrecta+'" alt="'+respuestaCorrecta+'"/>');
								fotoClickFunction();	
							});
					}else if(nom_locucion){
							var f= $("article").find($('div[class*="fail"]'));
							$.each(f, function(i,v) {
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).append('<span style="position:absolute;top:-25px;right:-25px;" class="yooigo" title="">'+respuestaCorrecta+'</span>');
								crearYooigo();
								audioClickFunction();	
							});
					}else if(nom_video){
							var f= $("article").find($('div[class*="fail"]'));
							$.each(f, function(i,v) {
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).append('<img class="img_correcta" src="img/icon_video.png" video="'+respuestaCorrecta+'" alt="'+respuestaCorrecta+'"/>');
								videoClickFunction();	//VIDEO A AL CLICK
							});
					}else if(nom_imagen){
							var f= $("article").find($('div[class*="fail"]'));
							$.each(f, function(i,v) {
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).append('<img class="img_correcta" src="imagenes/'+respuestaCorrecta+'" />');
							});
					}else if(nom_file){
							var f= $("article").find($('div[class*="fail"]'));
							$.each(f, function(i,v) {
								var respuestaCorrecta = $(v).data("pal_fin")||$(v).data("pal_drop");
								$(v).append('<img class="img_correcta" src="img/icon_file.png" file="'+respuestaCorrecta+'" alt="'+respuestaCorrecta+'"/>');
								fileClickFunction();	
							});
					}
					var estado = "Incorrecto";
					actDragnDropFinalizada(estado, ok/drag_arr.length);
				}
			}
	});

}

function actDragnDropFinalizada(Estado, ratio){ //MENSAJE FINAL

	ocultar_bot("#comprobar"); 
	if(currentIndex != pantallas){		
		$("body").control(Estado); 
		if(Estado == 'Incorrecto'){
			setTimeout(function() {
				$("body").control("Siguiente"); 
			}, 2000);
		}
	}else{			
		$("body").control(Estado);
		setTimeout(function() {
			$("body").control("Finalizado"); 
		}, 2500);
	}	
	
	if(Estado == 'Correcto'){
		gestionarSCO(pantallas, currentIndex, ratio);
	}else if(Estado == 'Incorrecto'){
		gestionarSCO(pantallas, currentIndex, ratio);
	}
}




function dropEvent_advanced(e) {
	e.preventDefault();
	e.stopPropagation();

	var item = e.originalEvent.dataTransfer.getData("Text"); //item0 -> itemN : Item que se arrastra
	$(this).removeClass('dragenter');
	var sAnchor = '#';
	sAnchor += item;
	var anchor = $(sAnchor); //anchor : elemento <a> que identifica al itema arrastrado
	
	anchor.removeClass('dragged');
	anchor.css('opacity', '1');

	
	//comprobación inicial para que se sustituya el texto original del drop o no. Si ya se ha arrastrado anteriormente y el contenedor está "ocupado", el drag vuelve a la posición inicial
	if(!drop_txt2parraf(this)) { 
			return;
		}
	contador_D_D++; //cada vez que se arrastra un elemento aumentamos el contador 
	
	var dropActual = $(this).data("pal_drop")
	var dragActual = $(anchor).data("pal_drag")
	
	if(drag_one2one_advanced==1){$(this).addClass("dropped");$(this).removeClass("activearea");}
	
	var dropIncorrecto=true;
	
	if(drag_one2one_advanced){ //parche para los contenedores
	dropActual = dropActual+"";
		if (dropActual.indexOf("*")!= -1){
			var arrayDropActual = dropActual.split("*");
			$(arrayDropActual).each(function (i,v) {
				if (v  == dragActual ){
				return dropIncorrecto=false;
				}
			});
		}else{
			if (dropActual  == dragActual ){
				dropIncorrecto=false;
				}
		}
			
		
	}
	
		if (dropIncorrecto){//el drop es incorrecto
			if (intentos_advanced){ //todavía quedan intentos
				// la propiedad 'correct_drop' está inicializada a 0, por lo tanto se queda como está.
		
				$(anchor).css('visibility','hidden');
			}else{ //no hay intentos, así que desactivamos los anchors y drops
				$(this).unbind();
				$(anchor).unbind();
				$(anchor).css('visibility','hidden');
			}
		
		}else{ // el drop es correcto y aunque queden intentos ya se deja la imagen fija. 
		
			$(anchor).data('drag_corr', 1); // y especificamos que está bien colocad	o
			$(anchor).unbind(); //Ojo. Cambio en múltiples drags sobre un mismo drop. El drop no se desactiva, el drag SÍ
			$(anchor).css('visibility','hidden');
		
		}
	


	if(drag_one2one_advanced==1){ 	
		if (drag_erase==1){
			if(nom_text){
				if(hayImgFondo){
					$(this).html('<font>'+dragActual+'</font>'); // Este es el comportamiento normal con imágenes
				}else{
					$(this).text(dragActual);
				}
			}else if(nom_imagen){
				$(this).html('<img src="imagenes/'+dragActual+'" />'); // Este es el comportamiento normal con imágenes
			}else if(nom_img){
				$(this).html('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
				fotoClickFunction();	
			}else if(nom_locucion){
					$(this).html('<span class="yooigo" title="">'+dragActual+'</span>'); 
					crearYooigo();
					audioClickFunction();	
			}else if(nom_video){
				$(this).html('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
				videoClickFunction();	
			}else if(nom_file){
				$(this).html('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
				fileClickFunction();	
			}
		}else{
			if(nom_text){
				if(hayImgFondo){
					$(this).append('<font>'+dragActual+'</font>'); // Este es el comportamiento normal con imágenes
				}else{
					$(this).append(dragActual);
				}
			}else if(nom_imagen){
				$(this).append('<img src="imagenes/'+dragActual+'" />'); // Este es el comportamiento normal con imágenes
			}else if(nom_img){
				$(this).append('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
				fotoClickFunction();	
			}else if(nom_locucion){
					$(this).append('<span class="yooigo" title="">'+dragActual+'</span>'); 
					crearYooigo();
					audioClickFunction();	
			}else if(nom_video){
				$(this).append('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
				videoClickFunction();	
			}else if(nom_file){
				$(this).append('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
				fileClickFunction();	
			}
		}
	}else{ //multirespuesta
		if(nom_text){
			$(this).append('<p>'+dragActual+'</p>'); // Este es el comportamiento normal con imágenes
		}else if(nom_imagen){
			$(this).append('<img src="imagenes/'+dragActual+'" />'); 
		}else if(nom_img){
			$(this).append('<img src="'+widget_imagen_icono+'" image='+dragActual+'  />'); 
			fotoClickFunction();	
		}else if(nom_locucion){
			$(this).append('<span class="yooigo" title="">'+dragActual+'</span>'); 			
			crearYooigo();
			audioClickFunction();		
		}else if(nom_video){
			$(this).append('<img src="'+widget_video_icono+'" video='+dragActual+' />'); 
			videoClickFunction();	
		}else if(nom_file){
			$(this).append('<img src="'+widget_file_icono+'" file='+dragActual+'  />'); 
			fileClickFunction();	
		}
	}
	//añadimos a data-last_drag al drop actual para el control posterior
	//$(anchor).attr('data-last_drag',$(this).get(0).outerHTML); //del objeto this saco el literal del nombre del drop para luego tratarlo.
	$(anchor).data('last_drag',$(this)); 
	if (contador_D_D == $('a[id^="item_"]').length){
		mostrar_bot("#comprobar");//Aparece el boton comprobar
		animar_bot("#comprobar");
		check_Dragandrop_advanced("#comprobar");
	}else{
		 ocultar_bot("#comprobar") //Desaparece el boton comprobar
	}
	
}

function drop_txt2parraf(queDiv){
	if(drag_one2one_advanced==0){
		return true;
		}
	if ($(queDiv).hasClass("dropped")){ //ya se ha arrastrado un item
			return false;
	}else{
		if ($(queDiv).hasClass("activearea")){
			//$(queDiv).text("");
			return true;
		}
	}
}

function doActiveAreasFromDropArea(quedropArea){
	var output = '';	
	
	var isActiveArea= false;
	var temporalActiveArea="";
	var ArrayTemporalActiveArea= new Array;
	var cajaRespDrop = 0;
	$.each(quedropArea, function(i, v) {
	
		if (v=="["){
		
		cajaRespDrop++;
			isActiveArea=true;
			output += '<span id="cajaRespDrop'+cajaRespDrop+'_pant'+currentIndex+'"><div class="estilo activearea ';
			
		} else if (v == ']') {
			isActiveArea=false;
			ArrayTemporalActiveArea= temporalActiveArea.split("#");
			//parche para el tamaño de la caja, lo meto como cuarto elemento
			var tamanio= "";
			if ((ArrayTemporalActiveArea[3]!=="") && (ArrayTemporalActiveArea[3]!==undefined)){ // especificación del tamaño
				if (!isNaN(ArrayTemporalActiveArea[3][0].valueOf())) { // es número, por tanto no estamos dando una clase fija.
					var ArrayTamDrop = ArrayTemporalActiveArea[3].split("x");
					tamanio= '"style="width:'+ArrayTamDrop[0]+'px; min-height:'+ArrayTamDrop[1]+'px;'; //cierro la clase y pongo el style con los valores directamente pero sin cerrarlo todavía
				}else{
					tamanio=ArrayTemporalActiveArea[3]+'" style="'; // es clase y cierro el atributo clase
				}
			}else{	
				tamanio= '" style="';
			}
			
			var sentence= ArrayTemporalActiveArea[0];
			if (sentence.indexOf(".jpg")!=-1||sentence.indexOf(".png")!=-1||sentence.indexOf(".gif")!=-1){
					tamanio += 'background-image:url(imagenes/'+ArrayTemporalActiveArea[0]+');';
			}			
			var posicion = "";
			if ((ArrayTemporalActiveArea[4]!=="") && (ArrayTemporalActiveArea[4]!==undefined)){ // especificación de la posición
				var ArrayPosDrop = ArrayTemporalActiveArea[4].split(",");
				if (((ArrayTemporalActiveArea[3]!=="") && (ArrayTemporalActiveArea[3]!==undefined)) && (!isNaN(ArrayTemporalActiveArea[3][0].valueOf()))){ // si ya hemos metido el tamaño con valores numéricos no abro el atributo style
					 posicion= ' left:'+ArrayPosDrop[0]+'px;top:'+ArrayPosDrop[1]+'px; position:relative;"'; //cierro la clase y pongo el style con los valores directamente
				}else{
					 posicion=' left:'+ArrayPosDrop[0]+'px; top:'+ArrayPosDrop[1]+'px; position:relative;"'; //cierro la clase y pongo el style con los valores directamente
				}
			}else{	
				if(ArrayTemporalActiveArea[3]!==undefined){ 
					 posicion=""; // hay definición de tamaño por clase y no pongo nada ya que he cerrado la clase anteriormente
				}else{
					 posicion='"'; // no hay definición de tamaño ni de posición y cierro el style
				}
			}
			
			output += tamanio + posicion +' data-pal_ini="'+ArrayTemporalActiveArea[0] +'" data-pal_drop="'+ArrayTemporalActiveArea[1] +'" data-pal_fin="'+ArrayTemporalActiveArea[2] +'"';
			
				if (sentence.indexOf(".jpg")!=-1||sentence.indexOf(".png")!=-1||sentence.indexOf(".gif")!=-1){
					output += 'style="background-image:url(imagenes/'+ArrayTemporalActiveArea[0]+')"';
					output += '>';
					hayImgFondo = true;
				}else{
					output += '>';
					output += '<b>'+ArrayTemporalActiveArea[0]+'</b>';
					hayImgFondo = false;
				}
			output += '</div></span>';
			temporalActiveArea="";
			ArrayTemporalActiveArea=[];
		} else {
			if (isActiveArea) {
				temporalActiveArea += v;
			} else {
				output += v;
			}
		}	
	});


	return output;
}





function colocarElementPant_DragnDrop(){     /* Mostrar dialog de Respuestas */
	if(arr[0].place_objects == 'left'){       ////// left
		var dragWidth = $('#dragItems a').width();
		jQuery('#dragItems').css({
			'width': 'auto',
			'float':'left'
		});	
		jQuery('#dragItems a').css({
			'float':'none',
			'display': 'table'
		});	
		jQuery('article').css({	'float':'right',  'max-width':'80%'	});
		
	} else if(arr[0].place_objects == 'right'){  ////// right
		var dragWidth = $('#dragItems a').width();
		jQuery('#dragItems').css({
			'width': 'auto',
			'float':'right'
		});	
		jQuery('#dragItems a').css({
			'float':'none',
			'display': 'table'
		});	
		jQuery('article').css({	'float':'left',  'max-width':'80%'		});	
		
	}else if(arr[0].place_objects == 'top'){		////// Top
	
	}else if(arr[0].place_objects == 'bottom'){ 	////// Bottom
		var dragTop = $('article').height() + 50;
		jQuery('#dragItems').css({	'top': dragTop+'px'	});	
		jQuery('article').css({	'position':'absolute'	});	
	}
}
