var widget_file_icono = 'config/img/icon_file.png';

function play_File(){
	crearYofile();
	fileClickFunction();
	if($('#btnFileClickOculto').length == 0){
		$('body').append('<div id="btnFileClickOculto"></div>'); //CREA CAPA DE AUDIO EN EL HTML
	}
}


function crearFileClick(foto,titulo){ //CREA ETIQUETA FOTO CON DIALOG

	$("#btnFileClickOculto").empty();

	
	jQuery( "#btnFileClickOculto" ).dialog({
		modal : true,
		autoOpen : false,
		draggable : true,
		zIndex : 10900,
		resizable : true,
		show : 'fade',
		hide : 'fade',
		width: 600,
		height: 400,
		close: function() {jQuery( "#btnFileClickOculto" ).empty();}
	});	
	
	
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	jQuery( 'div.ui-dialog > div[id=btnFileClickOculto]' ).parent().addClass('theDialogFoto' );
	

	jQuery( "div.theDialogFoto div.ui-dialog-titlebar > span.ui-dialog-title" ).html(titulo||'&nbsp');
	jQuery( "div.theDialogFoto .ui-dialog-titlebar-close" ).css("display","block");	
	jQuery( "div.theDialogFoto #btnVideoClickOculto" ).css("overflow","hidden");	
	
	
	jQuery( 'div.ui-dialog' ).attr( 'id', 'theDialog' );
	
	
	var sentence = foto;
	if (sentence.indexOf(".jpg")!=-1||sentence.indexOf(".png")!=-1||sentence.indexOf(".gif")!=-1){
			$("#btnFileClickOculto").css({
				'background-image':' url(imagenes/'+foto+')',
				'background-position':'center center', 
				'background-repeat':'no-repeat',
				'background-size':'contain',
			});
			jQuery( "#btnFileClickOculto" ).dialog('open');
			
	}else if (sentence.indexOf(".pdf")!=-1||sentence.indexOf(".doc")!=-1||sentence.indexOf(".docx")!=-1||sentence.indexOf(".zip")!=-1){
			window.open('documentos/'+foto);
	}else{
			$("#btnFileClickOculto").html(foto);
			jQuery( "#btnFileClickOculto" ).dialog('open');
	}	
}






function fileClickFunction(){	//FUNCION CLICK ATRIBUTO '[VIDEO]'
	
	jQuery('[file]').unbind();
	
	jQuery('[file]').bind('click', function() {
		var fileClick = jQuery(this).attr("file");
		var fileTitulo = jQuery(this).attr("alt");
		crearFileClick(fileClick,fileTitulo);
	});
}




function crearYofile(){ //CREAR ICONO Y FUNCION FOTO '<yofile>foto</yofile>'
	var etiquetaYofile = jQuery('#contents').find('yofile');	
	
	$.each(etiquetaYofile, function(i, v) {
		var contenidoFile = jQuery(this).text();
		var crearBtnFile = '';
		crearBtnFile += '<img src="config/img/icon_file.png" ';
		crearBtnFile += 'file="'+contenidoFile+'"';
		crearBtnFile += 'alt="'+contenidoFile+'"';
		crearBtnFile += ' />';
		
		jQuery(this).html(crearBtnFile);
	});
}



