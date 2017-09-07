var widget_imagen_icono = 'config/img/icon_imagen.png';

function play_Galeria(){
	crearYofoto();
	fotoClickFunction();	
	if($('#btnFotoClickOculto').length == 0){
		$('body').append('<div id="btnFotoClickOculto"></div>'); //CREA CAPA DE AUDIO EN EL HTML
	}
}



function crearFotoClick(foto,titulo){ //CREA ETIQUETA FOTO CON DIALOG

	$("#btnFotoClickOculto").empty();

	$("#btnFotoClickOculto").css({
		'background-image':' url(imagenes/'+foto+')',
		'background-position':'center center', 
		'background-repeat':'no-repeat',
		'background-size':'contain',
	});


	jQuery( "#btnFotoClickOculto" ).dialog({
		modal : true,
		autoOpen : true,
		draggable : true,
		zIndex : 10900,
		resizable : true,
		show : 'fade',
		hide : 'fade',
		width: 600,
		height: 400,
		close: function() {jQuery( "#btnFotoClickOculto" ).empty();}
	});	
	
	
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	jQuery( 'div.ui-dialog > div[id=btnFotoClickOculto]' ).parent().addClass('theDialogFoto' );	

	jQuery( "div.theDialogFoto div.ui-dialog-titlebar > span.ui-dialog-title" ).html(titulo||'&nbsp');
	jQuery( "div.theDialogFoto .ui-dialog-titlebar-close" ).css("display","block");	
	jQuery( "div.theDialogFoto #btnVideoClickOculto" ).css("overflow","hidden");	
	
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );	
}






function fotoClickFunction(){	//FUNCION CLICK ATRIBUTO '[VIDEO]'
	
	jQuery('[image]').unbind();

	jQuery('[image]').bind('click', function() {
		var fotoClick = jQuery(this).attr("image");
		var fotoTitulo = jQuery(this).attr("alt");
		crearFotoClick(fotoClick,fotoTitulo);
	});
}


function crearYofoto(){ //CREAR ICONO Y FUNCION FOTO '<yofoto>foto</yofoto>'
	var etiquetaYoveo = jQuery('#contents').find('yofoto');	

	$.each(etiquetaYoveo, function(i, v) {
		var contenidoFoto = jQuery(this).text();
		var crearBtnFoto = '';
		crearBtnFoto += '<img src="config/img/icon_imagen.png" ';
		crearBtnFoto += 'image="'+contenidoFoto+'"';
		//crearBtnFoto += 'alt="'+contenidoFoto+'"';
		crearBtnFoto += ' />';
		
		jQuery(this).html(crearBtnFoto);
	});
}



