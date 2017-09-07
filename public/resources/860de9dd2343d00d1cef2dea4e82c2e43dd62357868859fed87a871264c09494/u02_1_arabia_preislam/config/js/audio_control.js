var widget_locucion_icono = 'config/img/icon_audio.png';
function play_Audio(principal,pantalla){
	if($('#dialogAudio').length == 0){
		$('body').append('<div id="dialogAudio"><p></p></div>');
		$('body').append('<div id="audioPrincipal"></div>'); 
		$('body').append('<div id="btnAudioClickOculto"></div>'); 
		$('body').append('<div id="btnAudioPantalla"></div>');
	}
	crearYooigo();
	audioClickFunction();
	cargarAudioPrincipal(principal,pantalla);
	
	player = jQuery('#player')[0];
	player.addEventListener("play", function(_event) {	
		setTimeout(function() { 
			duration = player.duration;
			slideBackgroundBtn();
		}, 20);
	});
}	


var player;
function cargarAudioPrincipal(principal,pantalla){
	var existeNomaudio=0;
	$("#nomaudio").length ? existeNomaudio=1 : $("body").append('<p id="nomaudio" style="display:none;"></p>');
	
	
	crearTagAudio(principal);
	$( "#audio" ).unbind().bind('click', function(){
		if(Modernizr.audio){
			player = jQuery('#player')[0];		
			player.play();
			player.addEventListener('ended',function(){
				setTimeout(function() { 
					crearAudioPantalla(pantalla);
				}, 500);		
			});			
		}
	});
	
	// No hay audio. Se oculta el botón y salimos
	if (!principal){ $("#audio").hide();
	}else{$("#audio").show();}
	
	if ((jQuery("#nomaudio").text()==principal)&& existeNomaudio){ //ya se había creado la caja de texto y el audio es el mismo. Salimos
		crearAudioPantalla(pantalla);
		return;
	}else if (existeNomaudio){ //ya se había creado la caja de texto, pero el audio es diferente y no se necesita inicializar el PLAYER. Ejecutamos el nuevo audio y salimos
			$("#nomaudio").text(principal);
			$("audio source")[0]["src"]="audio/"+principal+".ogg"; //ogg
			$("audio source")[1]["src"]="audio/"+principal+".mp3"; //mp3
			
		if(Modernizr.audio){
			player = jQuery('#player')[0];
			player.play();	
			player.addEventListener('ended',function(){
				setTimeout(function() { 
					crearAudioPantalla(pantalla);
				}, 500);		
			});

			if(is_mobile() && principal){
				jQuery( "#dialogAudio" ).dialog({
					autoOpen : true,
					draggable : true,
					modal : true,
					zIndex : 10900,
					resizable : false,
					show : 'fade',
					hide : 'fade',
					minHeight: 200,
					
					beforeClose: function(e,i){
						
					},
					buttons: {
							Aceptar: function() {
								jQuery( this ).dialog( "close" );
								player.play();
								player.addEventListener('ended',function(){
									setTimeout(function() { 
										crearAudioPantalla(pantalla);
									}, 500);		
								});
							}
						}
				});		
				jQuery( "div.ui-dialog-titlebar > span.ui-dialog-title" ).text(TituloDialogoAudio);
				jQuery( "#dialogAudio > p" ).text(TextoDialogoAudioContinuar);
				jQuery( ".ui-button-text" ).text(TextoDialogoAudioBotton);
				jQuery( ".ui-dialog-titlebar-close" ).css("display","none");
			}
			
			}
			return;
		}
			
			
	$("#nomaudio").text(principal);
	
	if(Modernizr.audio){
		player = jQuery('#player')[0];
		player.play();
		player.addEventListener('ended',function(){
			setTimeout(function() { 
				crearAudioPantalla(pantalla);
			}, 500);		
		});

			if(is_mobile()  && principal){
				jQuery( "#dialogAudio" ).dialog({
					autoOpen : true,
					draggable : true,
					modal : true,
					zIndex : 10900,
					resizable : false,
					show : 'fade',
					hide : 'fade',
					minHeight: 200,
					
					beforeClose: function(e,i){
						
					},
					buttons: {
							COSER: function() {
								jQuery( this ).dialog( "close" );
								player.play();
								player.addEventListener('ended',function(){
									setTimeout(function() { 
										crearAudioPantalla(pantalla);
									}, 500);		
								});
							}
						}
				});	
				jQuery( "div.ui-dialog-titlebar > span.ui-dialog-title" ).html(TituloDialogoAudio);
				jQuery( "#dialogAudio > p" ).html(TextoDialogoAudioInicio);
				jQuery( ".ui-button-text" ).html(TextoDialogoAudioBotton);
				jQuery( ".ui-dialog-titlebar-close" ).css("display","none");
			}
	}
}



function crearTagAudio(audio){ //PRINCIPAL
	$("#audioPrincipal").empty();
	$('#audioPrincipal').append(
	'<audio id="player"  preload="auto" autobuffer>'+
	'<source src="audio/'+audio+'.ogg" type="audio/ogg">'+
	'<source src="audio/'+audio+'.mp3" type="audio/mpeg">'+
	'<div class="nosup"><h2>Tu navegador no posee la tecnolog&iacute;a para iniciar esta aplicaci&oacute;n.</h2><div>Desc&aacute;rgate e instala <a href="http://www.google.es/chrome?hl=es">Google Chrome</a>, <a href="http://www.mozilla.org/es-ES/firefox/new/">Mozilla Firefox</a> o <a href="http://www.apple.com/es/safari/download/">Apple Safari</a> para poder iniciarla.</div></div>'+
	'</audio>'
	);
	$("audio").hide();
}

var cont = 0;
var total = 0;
var duration = 0;
function slideBackgroundBtn (){
	cont++;
	$('li#audio > #sliderAudio').css({'background-size': cont+'% 100%'});
		
	if (cont <= 101) {
		setTimeout(function() {
			slideBackgroundBtn();
		}, duration*10);
	}else{
		$('li#audio > #sliderAudio').css({'background-size':'0'});
		cont = 0;
	}	
}



function crearAudioPantalla(locucion){ //POR PANTALLA
	$("#btnAudioPantalla").empty();
	$('#btnAudioPantalla').append(
	'<audio id="playerpantalla"  preload="auto" autobuffer>'+
	'<source src="audio/'+locucion+'.ogg" type="audio/ogg">'+
	'<source src="audio/'+locucion+'.mp3" type="audio/mpeg">'+
	'<div class="nosup"><h2>Tu navegador no posee la tecnolog&iacute;a para iniciar esta aplicaci&oacute;n.</h2><div>Desc&aacute;rgate e instala <a href="http://www.google.es/chrome?hl=es">Google Chrome</a>, <a href="http://www.mozilla.org/es-ES/firefox/new/">Mozilla Firefox</a> o <a href="http://www.apple.com/es/safari/download/">Apple Safari</a> para poder iniciarla.</div></div>'+
	'</audio>'
	);
	$("audio").hide();	
	
	if(Modernizr.audio){
		var audioMovil = jQuery('#playerpantalla')[0];
		audioMovil.play();			
	}
}

function crearAudioComodin(locucion){ //AUDIO CON CLICK SIN BOTÓN
	$("#btnAudioClickOculto").empty();
	$('#btnAudioClickOculto').append(
	'<audio id="playerclick" autoplay  preload="auto" autobuffer>'+
	'<source src="audio/'+locucion+'.ogg" type="audio/ogg">'+
	'<source src="audio/'+locucion+'.mp3" type="audio/mpeg">'+
	'<div class="nosup"><h2>Tu navegador no posee la tecnolog&iacute;a para iniciar esta aplicaci&oacute;n.</h2><div>Desc&aacute;rgate e instala <a href="http://www.google.es/chrome?hl=es">Google Chrome</a>, <a href="http://www.mozilla.org/es-ES/firefox/new/">Mozilla Firefox</a> o <a href="http://www.apple.com/es/safari/download/">Apple Safari</a> para poder iniciarla.</div></div>'+
	'</audio>'
	);
	$("audio").hide();	 
	
	if(Modernizr.audio){
		var audioMovil = jQuery('#playerclick')[0];
		audioMovil.play();			
	}
}





function crearYooigo(){ //CREAR ICONO AUDIO '<span class="yooigo" title="titulo a mostrar">audio</span>'
	var crearEtiqueta = jQuery('body').find('span.yooigo');	
	$.each(crearEtiqueta, function(i, v) {
		var contenidoTexto = jQuery(this).text() || jQuery(this).children().attr('alt');
		var contenidoTitle = jQuery(this).attr('title');
		var crearBtn = '';
		crearBtn += '<img src="'+widget_locucion_icono+'" ';
		crearBtn += 'class="attrAudio"';
		crearBtn += 'alt="'+contenidoTexto+'"';
		crearBtn += 'title="'+contenidoTitle+'"';
		crearBtn += ' />';
		jQuery(this).html(crearBtn);
	});
}
function audioClickFunction(){	 //CREAR FUNCION AUDIO '<div class="attrAudio" title="titulo a mostrar" alt="audio"></div>'
	jQuery('.attrAudio').unbind();
	jQuery('.attrAudio').bind('click', function() {
		var contenidoTexto = jQuery(this).attr('alt');
		var contenidoTitle = jQuery(this).attr('title');
		if(contenidoTitle == undefined || contenidoTitle == ''){contenidoTitle = "&nbsp"}
		dialogAudioClick(contenidoTexto,contenidoTitle)
	});
}

function dialogAudioClick(AudioClick,titulo){ //CREA CLASE AUDIO CON DIALOG
	$("#btnAudioClickOculto").empty();	
	$('#btnAudioClickOculto').append(
		'<audio id="audioclick">'+
			'<source src="audio/'+AudioClick+'.ogg" type="audio/ogg" />'+
			'<source src="audio/'+AudioClick+'.mp3" type="audio/mpeg" />'+
		'</audio>'
	);
	$('#btnAudioClickOculto').hide();

	var audio = document.getElementById('audioclick');
	audio.autoplay = false;
	audio.preload = true;
	audio.controls = true;
	
	jQuery( "#btnAudioClickOculto" ).dialog({
		modal : false,
		autoOpen : true,
		draggable : true,
		zIndex : 10900,
		resizable : false,
		show : 'fade',
		hide : 'fade',
		width: 335,
		height: 100,
		close: function() {jQuery( "#btnAudioClickOculto" ).empty(); jQuery( "video" ).remove();}
	});	
	
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	jQuery( 'div.ui-dialog > div[id=btnAudioClickOculto]' ).parent().addClass('theDialogVideo' );	
	
	jQuery( "div.theDialogVideo div.ui-dialog-titlebar > span.ui-dialog-title" ).html(titulo);
	jQuery( "div.theDialogVideo .ui-dialog-titlebar-close" ).css("display","block");	
	jQuery( "div.theDialogVideo #btnAudioClickOculto" ).css("overflow","hidden");			
		
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	
	if(Modernizr.audio){
		var audioMovil = jQuery('#audioclick')[0];
		audioMovil.play();			
	 }
}