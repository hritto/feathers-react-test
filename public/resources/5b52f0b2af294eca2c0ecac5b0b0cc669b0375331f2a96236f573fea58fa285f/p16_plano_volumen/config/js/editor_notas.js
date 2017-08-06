

$( window ).load(function() {
	var idW="";
	var url=window.location.pathname;
	var urlA = url.split('/');
		for (i=0;i<=1;i++){
		idW += urlA.pop();
	}
	 $("body").append('<div id="notepad" title="Editor de notas" >'+'<textarea style="width: 530px; height: 100px;">Anota toda la informaci&oacute;n que quieras en este campo</textarea>'+'</div>');
	 $("#notepad").hide();
	 $( "#notepad" ).dialog(
		{
		buttons: [{
		text: "Guardar nota",
		click: function() { 
			localStorage.setItem(idW, $('#notepad textarea').val()); 
			$( "#notepad" ).dialog("close");
		}}],
		resizable: true,
		draggable : true,
		width: 600,
		height:300
	});


									
		$("#notepad textarea" ).click(function(e) {
		//alert(document.getElementById("notepad").isContentEditable);
		var str= $("#notepad textarea").text();
			if (str.match(/Anota toda la/) != null){
				$("#notepad textarea").text("");
				}
			});
	 $("#notepad" ).dialog("close");
	 $("#notepad").dialog( "option", "show", { effect: 'drop', direction: "left" } );
	 $("#notepad").dialog( "option", "hide", { effect: 'drop', direction: "right" } );
	  $(".ui-dialog").css('z-index','10000');
		if ( window.localStorage ) {
			if ( localStorage.getItem(idW) ) {
			  $("#notepad textarea").text(localStorage.getItem(idW));
			}
		} 
		else { 				
			$('#notas').hide();	
		}
				
			$( "#notas" ).click(function(e) {
				jQuery( "div.theDialogNotepad div.ui-dialog-titlebar > span.ui-dialog-title" ).html(TituloNotas);
				jQuery( "div.theDialogNotepad .ui-button-text" ).html(GuardarNotas);
				jQuery( "div.theDialogNotepad #notepad textarea" ).html(AyudaNotas);
				jQuery( "div.theDialogNotepad .ui-dialog-titlebar-close" ).css("display","block");
				if ( window.localStorage ) {
					if ( localStorage.getItem(idW) ) {
						$("#notepad textarea").text(localStorage.getItem(idW));
					}
				}
				jQuery( ".ui-dialog-titlebar-close" ).css("display","block");
			});
			
});