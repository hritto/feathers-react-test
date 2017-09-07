var btnAnima = true;
function crearPopUp() {
	btnAnima = true;
	$('#btnPopUp').remove();
	$('#ventanaPopUp').remove();
	var archivo = arr[0].element.find("popup").text();	
	var popUpWidth = arr[0].element.find("popup").attr('w');
	var popUpTitulo = arr[0].element.find("popup").attr('titulo');
	var popUpPos = arr[0].element.find("popup").attr('pos');
	var popUpMoves = arr[0].element.find("popup").attr('move');
	


	var wWindow = $(window).innerHeight();
	var wHeader = $('header').innerHeight();
	var wBarra = $('footer').innerHeight();
	wWindow = wWindow - wHeader - wBarra - 100;

	var btnPopUp = '<div id="btnPopUp"';
		btnPopUp += ' style=""';
		btnPopUp += '>';
		btnPopUp += popUpTitulo;
		btnPopUp += '</div>';
	$('#contents').append(btnPopUp);

	var popUp = '<div id="ventanaPopUp" data-pantalla="'+currentIndex+'"';
		popUp += ' style="width:'+popUpWidth+'px; height:'+wWindow+'px"';
		popUp += '>';
		popUp += '<div id="popUpTitle">'+popUpTitulo+'<div id="popUpClose">x</div></div>';
		popUp += '<div id="popUpContent">'+archivo+'</div>';
		popUp += '</div>';
	$('body').append(popUp);

	var hVentPop = $('#ventanaPopUp').innerHeight();
	var wVentPop = $('#ventanaPopUp').innerWidth();
	$('#ventanaPopUp').css({
		'margin-top': '-'+(hVentPop/2)+'px',
		'margin-left': '-'+(wVentPop/2)+'px',
	});
	$('#ventanaPopUp').hide();
	

	



	var topBtn = 'auto';
	var heightBtn;
	$('#btnPopUp').unbind().bind('mouseover', function(e) {
		if(btnAnima){
			heightBtn = '+=5px';
			if(popUpPos == 'top'){topBtn = '+=5px'; heightBtn = 'auto'}
			$('#btnPopUp').animate({
				height: heightBtn,
				top: topBtn
			}, 500, function() {
				// Animation complete.
			});
		}
		

	}).bind('mouseout', function(e) {
		if(btnAnima){
			heightBtn = '-=5px';
			if(popUpPos == 'top'){topBtn = '-=5px'; heightBtn = 'auto'}
			$('#btnPopUp').animate({
				height: heightBtn,
				top: topBtn
			}, 500, function() {
				// Animation complete.
			});
		}
		
	}).bind('click', function(e) {
		$('#btnPopUp').hide();
		$('#ventanaPopUp').fadeIn(500);
	});

	$('#popUpClose').unbind().bind('click', function(e) {
		$('#ventanaPopUp').hide();
		$('#btnPopUp').fadeIn(500);
	});




	if(popUpMoves == 'true'){
		$( "#ventanaPopUp" ).draggable({ handle: "#popUpTitle" }).resizable({
			handles: "se"
		});
	}


	popUpPosition(popUpPos);

	$( window ).resize(function() {
		var wWindow = $(window).innerHeight();
		var wHeader = $('header').innerHeight();
		var wBarra = $('footer').innerHeight();
		var hVentPop = $('#ventanaPopUp').innerHeight();
		var wVentPop = $('#ventanaPopUp').innerWidth();
		wWindow = wWindow - wHeader - wBarra- 100;
		$('#ventanaPopUp').css({
			'height':wWindow+'px',
			'margin-top': '-'+(hVentPop/2)+'px',
			'margin-left': '-'+(wVentPop/2)+'px',
		});
		wWindow = wWindow - $('#popUpTitle').innerHeight();
		$('#popUpContent').css({
			'height':wWindow+'px',
		});
	});
};




function popUpPosition(popUpPos){ //MENSAJE FINAL
	var parametros = new RegExp(/[\,]/m);

	if(popUpPos == 'top'){
		var wObjeto = $('#btnPopUp').innerWidth();
		var wBarra = $('header').height() - 23;
		$('#btnPopUp').css({
			'position':'fixed',
			'top':wBarra+'px',
			'left':'50%',
			'z-index':'10',
			'height':'25px',
			'padding-top':'30px',
			'margin-left':-(wObjeto/2)+'px',
		});
		$('header').css('z-index','15')

	}else if(popUpPos == 'right'){
		$('#btnPopUp').addClass('right');
		var hObjeto = $('#btnPopUp').innerHeight();
		$('#btnPopUp').css({
			'position':'fixed',
			'top':'25%',
			'right':'-60px',
			'margin-top':-(hObjeto/2)+'px',
		});

	}else if(popUpPos == 'bottom'){
		var wObjeto = $('#btnPopUp').innerWidth();
		var wBarra = $('footer').height() - 25;
		$('#btnPopUp').css({
			'position':'fixed',
			'bottom':wBarra+'px',
			'left':'50%',
			'z-index':'10',
			'margin-left':-(wObjeto/2)+'px',
		});

	}else if(popUpPos == 'left'){
		$('#btnPopUp').addClass('left');
		var hObjeto = $('#btnPopUp').innerHeight();
		$('#btnPopUp').css({
			'position':'fixed',
			'top':'50%',
			'left':'-60px',
			'margin-top':-(hObjeto/2)+'px',
		});
		
	}else if(popUpPos.match(parametros)){
		popUpPos = popUpPos.split(',');
		$('#btnPopUp').attr('data-pantalla',currentIndex);
		$('#btnPopUp').css({
			'position':'absolute',
			'top':popUpPos[0]+'px',
			'right':popUpPos[1]+'px'
		});
		btnAnima = false;
		
	}

}




function actLibreFinalizada(Estado){ //MENSAJE FINAL
	random = 0;
	numObj = 0;
	cont = 0;
	refreshIntervalId = 0;
	
	if(numRonda != totalRondas){		
		$("body").control(Estado); 
		if(Estado == 'Incorrecto'){
			//sacarRespuestasSortable()
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
		if (Scorm_conectado()){gestionarSCO(pantallas, currentIndex, 1);}
	}else if(Estado == 'Incorrecto'){
		if (Scorm_conectado()){gestionarSCO(pantallas, currentIndex, 0);}
	}
}

