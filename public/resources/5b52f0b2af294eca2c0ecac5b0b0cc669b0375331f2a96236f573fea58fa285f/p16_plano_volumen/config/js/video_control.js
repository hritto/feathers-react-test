

var widget_video_icono = 'config/img/icon_video.png';

var optionsVideo = [];
optionsVideo.push({
	CarpetaVideo : 'video',
	IconVideo : widget_video_icono,
	AutoPlay : true,
	Preload : 'auto',
	Controls : true,
	Loop : false,
	PantallaCompleta : false,
});




function play_Video(){
	crearYoveo();
	videoClickFunction();
	if($('#btnVideoClickOculto').length == 0){
		$('body').append('<div id="btnVideoClickOculto"></div>'); //CREA CAPA DE VIDEO EN EL HTML	
	}
}



function crearVideoClick(animacion){ //CREA ETIQUETA VIDEO CON DIALOG

	$("#btnVideoClickOculto").empty();
	
	$('#btnVideoClickOculto').append(
		'<video  id="videoclick"  width="100%" height="100%"  poster="imagenes/video_'+animacion+'.jpg">'+
		'<source src="'+optionsVideo[0].CarpetaVideo+'/'+animacion+'.ogv" type="video/ogg" />'+
		'<source src="'+optionsVideo[0].CarpetaVideo+'/'+animacion+'.mp4" type="video/mp4" />'+
		'<div class="nosup"><h2>Tu navegador no posee la tecnolog&iacute;a para iniciar esta aplicaci&oacute;n.</h2><div>Desc&aacute;rgate e instala <a href="http://www.google.es/chrome?hl=es">Google Chrome</a>, <a href="http://www.mozilla.org/es-ES/firefox/new/">Mozilla Firefox</a> o <a href="http://www.apple.com/es/safari/download/">Apple Safari</a> para poder iniciarla.</div></div>'+
		'</video>'
	);

	var video = document.getElementById('videoclick');
	video.autoplay = optionsVideo[0].AutoPlay;
	video.preload = optionsVideo[0].Preload;
	video.controls = optionsVideo[0].Controls;
	video.loop = optionsVideo[0].Loop;
	
		jQuery( "#btnVideoClickOculto" ).dialog({
			modal : true,
			autoOpen : true,
			draggable : true,
			zIndex : 10900,
			resizable : true,
			show : 'fade',
			hide : 'fade',
			width: 600,
			height: 400,
			close: function() {jQuery( "#btnVideoClickOculto" ).empty(); jQuery( "video" ).remove();}
		});	
				
		jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
		jQuery( 'div.ui-dialog > div[id=btnVideoClickOculto]' ).parent().addClass('theDialogVideo' );

		jQuery( "div.theDialogVideo #dialog > p" ).html(TextoDialogoAudioInicio);
		jQuery( "div.theDialogVideo .ui-button-text" ).html(TextoDialogoAudioBotton);
		jQuery( "div.theDialogVideo .ui-dialog-titlebar-close" ).css("display","block");	
		jQuery( "div.theDialogVideo #btnVideoClickOculto" ).css("overflow","hidden");	

		jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
}






function videoClickFunction(){	//FUNCION CLICK ATRIBUTO '[VIDEO]'
	
	jQuery('[video]').unbind();

	jQuery('[video]').bind('click', function() {
		var VideoClick = jQuery(this).attr("video");
		crearVideoClick(VideoClick);
		
		if(is_mobile()){
			videoclick.load();
			if(optionsVideo[0].AutoPlay){
				videoclick.play();
			}
		}

	});
}


function crearYoveo(){ //CREAR ICONO Y FUNCION VIDEO '<yoveo>video</yoveo>'
	var etiquetaYoveo = jQuery('#contents').find('yoveo');	
	$.each(etiquetaYoveo, function(i, v) {
		var contenidoVideo = jQuery(this).text();
		var crearBtnVideo = '';
		crearBtnVideo += '<img src="'+widget_video_icono+'" ';
		crearBtnVideo += 'video="'+contenidoVideo+'"';
		crearBtnVideo += 'alt="'+contenidoVideo+'"';
		crearBtnVideo += ' />';
		
		jQuery(this).html(crearBtnVideo);
	});
}
