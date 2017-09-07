//editor_notas.js actualizado 5/5/16

function iniNota(){

if (typeof currentIndex == "undefined") currentIndex = 1;
	
	var default_text = "Anota toda la información que quieras en este campo";
	
	$("body").append('<div id="notepad" title="Editor de notas" >'+'<textarea style="width: 530px; height: 95px;">'+default_text+'</textarea>'+'</div>');
	$("#notepad").hide();
	$( "#notepad" ).css("overflow-y", "hidden");

	$( "#notepad" ).dialog({
		buttons: [{
			text: "Guardar nota",
			click: function() { 
				setData( "nota_"+currentIndex, $('#notepad textarea').val() );
				$( "#notepad" ).dialog("close");
			}
		}],
		resizable: false,
		draggable : true,
		width: 600,
		height:300,
	});

								
	$("#notepad textarea" ).click(function(e) {
		var str= $("#notepad textarea").val();
		if (str.match(/Anota toda la/) != null){
			$("#notepad textarea").val("");
		}
	});

	$("#notepad" ).dialog("close");
	$("#notepad").dialog( "option", "show", { effect: 'drop', direction: "left" } );
	$("#notepad").dialog( "option", "hide", { effect: 'drop', direction: "right" } );
	$(".ui-dialog").css('z-index','10000');

	if ( ! window.localStorage ) {			
	    $('#notas').hide();	
	}
		
	$( document ).on("click", "#notas", function(e) {

		var ls_nota = getData("nota_"+currentIndex);

	    if ( typeof ls_nota != "undefined" && ls_nota != "" ) {
	      	$("#notepad textarea").val(ls_nota);
	    } else {
	      	$("#notepad textarea").val(default_text);
	    }

		jQuery( "div.ui-dialog-titlebar > span.ui-dialog-title" ).text(TituloNotas);
		jQuery( ".ui-button-text" ).text(GuardarNotas);
		jQuery( ".ui-dialog-titlebar-close" ).css("display","block");

	});

};


$(window).load(function() {
	if ( $("#notepad").length == 0 ) iniNota();
});



function loadData() {

	if ( Scorm_conectado() ) {
		var data = LMSGetValue("cmi.suspend_data");
	} else if ( window.localStorage ) {
		var url = window.location.href;
		var data = localStorage.getItem(url);
	}

	if (data !== null && data != ""){ 
        return JSON.parse( data );
    } else { 
		return {};
	}
}


function getData(key){
	var data = loadData();
	return data[key];
}


function setData(key, value){

	var data = loadData();
	data[key] = value;
	data = JSON.stringify(data);

	if (Scorm_conectado()){
		LMSSetValue( "cmi.suspend_data", data );
	}
	
	if ( window.localStorage ) {
		var url = window.location.href;
		localStorage.setItem(url, data); 
	}
}