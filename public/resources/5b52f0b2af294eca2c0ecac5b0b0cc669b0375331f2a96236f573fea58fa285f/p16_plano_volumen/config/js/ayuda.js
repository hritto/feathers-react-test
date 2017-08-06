

function showAyuda() {
	if(!jQuery('style.cssIconsAyuda').length){  cssIconsAyuda(); };
	
	var descripcion;
	if(arrDescAct[idAct]){  descripcion = arrDescAct[idAct][idioma]  }
	else{  descripcion = arrDescAct['EnProceso'];  }
	
	var listControl = arr[0].element.find('control').text();
	var obj = listControl.split(',');
	var logo;
	var control = '<div id="fonAyudaDiv" >';
		control += '<div id="ayudaDiv" >';
		control += '<div class="cerrar" onclick="cajaAyuda();">x</div>';
		var nomTitleAyuda = $('#ayuda > span').text();
		control += '<div class="ui-widget-header ui-dialog-title">'+nomTitleAyuda+'</div>';
		control += '<div class="cajaAyudaScroll">';
		control += '<div class="textoTitulo" id="textoTituloAct">';
		control += '</div>';
		control += '<div class="descrAct">';
		control += descripcion;
		control += '</div>';
		control += '<div class="textoTitulo" id="textoTituloBar">';
		control += '</div>';
		control += '<table cellpadding=5 cellspacing=15 border=0>';
		
		$.each(obj,function (i,v){
			var btnControl = v.split(':');
			var nombre = btnControl[0];
			var nomIcon = $('#'+nombre+' > span').text();

			if(nombre != 'logo' && nombre != 'ayuda'){
				control += '<tr>';
					control += '<td id="ayuda-'+nombre+'">';
						control += '<div></div>';
						control += '<span>'+nomIcon+'</span>';
					control += '</td>';
					
					control += '<td>';
						control += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc turpis neque, pretium sit amet placerat eget, ullamcorper eu dui. Etiam est nisi, adipiscing ac scelerisque ac, auctor ut felis. ';
					control += '</td>';
				control += '</tr>';
			}
		});
		control += '</table>';
		control += '</div>'; //cajaAyudaScroll
		control += '</div>'; //ayudaDiv
		control += '</div>'; //fonAyudaDiv
	$(control).appendTo('body');
	PonerIdiomaActividad();
	
	jQuery('#fonAyudaDiv').unbind().bind('click', function() {
		cajaAyuda();
	});
	
	jQuery('#ayudaDiv').unbind().bind('click', function(event) {   
		event.preventDefault();
		event.stopPropagation();
	});

	$( "#ayudaDiv" ).draggable({ handle: ".ui-widget-header" });
	$( window ).resize(function() {
		if(!is_mobile()){
			var wPantalla = jQuery(window).width();
			var hPantalla = jQuery(window).height();
			$( "#ayudaDiv" ).css({
				'top': '50%',
				'left': '50%',
			});
		}
	});
}



function cssIconsAyuda(){
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
		'<style class="cssIconsAyuda">'+
			'div#ayudaDiv .cajaAyudaScroll table  td > div{	'+
				'background-image:  url(config/'+carpeta+'/'+icono+'-default.png);'+
			'}'+
		'</style>'
	);
}

function cajaAyuda() {
	if(jQuery('div#ayudaDiv').length){
		$("#fonAyudaDiv").remove();
	}else{
		showAyuda();
	}
}