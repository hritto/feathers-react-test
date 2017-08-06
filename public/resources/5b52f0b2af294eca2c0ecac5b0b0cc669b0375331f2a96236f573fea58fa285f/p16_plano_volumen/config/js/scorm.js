// Archivo scorm.js v1.0 - Actualizado el 28/02/2015

var alumno;
var alumnoID;
var aprobado=false;
var pantallaActualScorm=0;
var pantallaTotalScorm=1;
var puntuacionScoAcumulada=0;
var puntPantalla = 1;
var mensajeFinalSCO="";
var contadorPantallasOk = 0;


PackageType.SCORM_1_2 = "SCORM 1.2";
PackageType.SCORM_2004 = "SCORM 2004";
PackageType.SCORM_2004_SUMMARY = "SCORM 2004 With Summary";
PackageType.SCORM_1_2_SUMMARY = "SCORM 1.2 With Summary";
PackageType.CommonCartridge_1_1 = "Common Cartridge 1.1";
PackageType.CommonCartridge_1_2 = "Common Cartridge 1.2";
PackageType.EPUB = "EPUB";
PackageType.HTML = "HTML";
PackageType.MARSUPIAL_LMS = "MARSUPIAL";
PackageType.GODIVA_CMS = "GODIVA CMS";

LMSCommunicator._PackageCommunicationVersion = PackageType.SCORM_1_2;
LMSCommunicator._isLMSInitialized = false;

function SCORM_GrabAPI(){return false};
function Start(){return false};
function PackageType() {}
function LMSCommunicator() {}
function ScormObj(pantallas){} 


document.onreadystatechange = function(){
	if (document.readyState == 'complete'){
		Scorm_start();
	}
}

function Scorm_start(){

	var SCORM_iniciado = Scorm_conectado();
	if (window.console) console.log("Scorm conectado, LMS inicializado: " + SCORM_iniciado);

	if( SCORM_iniciado ){
		LMSSetValue("cmi.core.lesson_status", "browsed");
	}
		
}

function Scorm_conectado(){

	var SCORM_iniciado = LMSCommunicator.initializeLMS();
	return SCORM_iniciado;

}

LMSCommunicator.initializeLMS = function() {

    if (! LMSCommunicator._isLMSInitialized ) {
        var initializationStatus = false;

        if (LMSCommunicator._PackageCommunicationVersion == PackageType.SCORM_1_2 || LMSCommunicator._PackageCommunicationVersion == PackageType.SCORM_1_2_SUMMARY) {
	
            initializationStatus = LMSInitialize();
            if (initializationStatus == "true" || initializationStatus == true) {
                initializationStatus = true;
            }
        }
        LMSCommunicator._isLMSInitialized = initializationStatus;
	}

    return LMSCommunicator._isLMSInitialized;
}


function ScormCalcularPuntPantalla(totalPantallas){
	puntPantalla= 100/totalPantallas;
	return puntPantalla;
}

function gestionarSCO(totalPantallas, pantallaActual, puntuacionActual, textoLibre){

	pantallaActualScorm = pantallaActual;
	pantallaTotalScorm = totalPantallas;
	if (window.console) console.log('Entrando en evaluar la actividad');
	if (!textoLibre || textoLibre == undefined){textoLibre="";}
	
	puntuacionScoAcumulada+=(puntuacionActual*ScormCalcularPuntPantalla(totalPantallas));
	contadorPantallasOk = contadorPantallasOk + puntuacionActual;

	if ((pantallaActual==totalPantallas)&&(pantallaActual)){			
		try{
			KitabooCommunicationManager.sendActivityData(contadorPantallasOk,textoLibre,totalPantallas);
			if (window.console) console.log('Mandando información a Kitaboo');
		}catch(err){
		 	if (window.console) console.log('No se puede mandar información a Kitaboo');
		}

		var SCORM_GrabAPI = LMSCommunicator.initializeLMS(PackageType());
		if (! Scorm_conectado() ) return false;
		
		evaluarSco(puntuacionScoAcumulada);
		if(puntuacionScoAcumulada<100){
			fallado();
		}else{
			acertado();
		}

		mensajeFinalSCO= "";
		alcanzadoFinal();

		recogerEstadoEvSCO();
		recogerEstadoVisitSCO();
		recogerEstadoModoSCO();
		recogerTiempoAcumulado();
		recogerTiempoSesion();
		recogerLocalizacion();

		grabarDatosSco();
	}
}

function bienvenidaSco(){
	return;
}
function marcarNav(){
	loc = window.location.href;
	SetBookmark(loc.substring(loc.toLowerCase().lastIndexOf("/scormcontent/")+14, loc.length));
	grabarDatosSco();
}
function grabarDatosSco(){
	LMSCommit();
}
function establecerIdioma(idioma){
	LMSSetValue("cmi.student_preference.language", idioma);
	grabarDatosSco();
}
function recogerIdioma(){
	return LMSGetValue("cmi.student_preference.language");
}
function alcanzadoFinal(){
	grabarDatosSco();
}
function hacerComentario(cadena){
	return LMSGetValue("cmi.comments");
}
function recogerComentario(){
	return LMSGetValue("cmi.comments");
}
function recogerComentarioLMS(){
	return LMSGetValue("cmi.comments_from_lms");
}
function evaluarSco(nota){
	LMSSetValue("cmi.core.score.min", "0");
	LMSSetValue("cmi.core.score.max", "100");
	LMSSetValue("cmi.core.score.raw", nota);
}
function recogerEstadoEvSCO(){
/*cmi.core.lesson_status
?	passed: El n?mero necesario de objetivos en el SCO han sido aprobados o se logr? la puntuaci?n para aprobar. 
?	completed: El SCO puede o no puede ser aprobado pero todos sus contenidos pueden haber sido vistos por el estudiante. Esto es lo que indica la variable completed.
?	failed: El estudiante ha suspendido los contenidos del SCO. En cambio esto no obliga a que todos los contenidos hayan sido vistos. 
?	incomplete: El SCO ha sido empezado pero no terminado
?	browsed: El estudiante ya ha lanzado el LMS antes.
?	not attempted: significa que el estudiante hizo un intento de cargar el curso pero por alguna raz?n el curso ni siquiera ha sido empezado. Quiz?s el alumno tan s?lo ha leido el ?rbol de contenidos y decidi? que no estaba preparado para afrontar el curso. Cualquier algoritmo del SCO puede ser usado para cambiar el valor ?not attempted? a ?incomplete?
*/
	estado=LMSGetValue("cmi.core.lesson_status");
	switch (estado) {
		case (1):
			estadoE = "Acertado";
			break;
		case (2):
			estadoE = "Completado";
			break;
		case (3):
			estadoE = "Fallado";
			break;
		case (4):
			estadoE = "Incompleto";
			break;
		case (5):
			estadoE = "Visto";
			break;
		case (6):
			estadoE = "No intentado";
			break;
		default:
			estadoE="";
		}
		return estadoE;
}

function acertado(){
	LMSSetValue("cmi.core.lesson_status", "passed");
}
function fallado(){
	LMSSetValue("cmi.core.lesson_status", "failed");
}

/*cmi.core.exit
?	"time-out": Indica que el SCO finaliz? la aplicaci?n porque ha pasado un tiempo excesivo o el tiempo m?ximo dado ha sido excedido. Este tiempo se puede encontrar en el manifiesto(adlcp:maxtimeallowed ).
?	 "suspend": Indica que el estudiante sale del SCO con intenci?n de continuar m?s tarde en el mismo punto donde lo dej?.
?	 "logout": Indica que el estudiante sali? de la aplicaci?n desde dentro del SCO en lugar de volver al LMS para salir. Esto implica que el SCO pas? el control al LMS y el LMS autom?ticamente retir? al estudiante de la aplicaci?n ? despu?s de actualizar los valores correspondientes en el modelo de datos- 
?	"" : Se usa para representar un estado normal de salida. 
*/
function salirSCOSinTerminar(){
	salirSCOFinalizado();
	return true;
}
function salirSCOFinalizado(){
	if(pantallaActualScorm == pantallaTotalScorm){
		LMSSetValue("cmi.core.exit", "logout");

		try{
			KitabooCommunicationManager.closeActivityJSCallBack();
			if (window.console) console.log('Mandando información a Kitaboo!!!!');
		}catch(err){
		 	if (window.console) console.log('No puede mandar información a Kitaboo');;
		}
	}else if(pantallaActualScorm != pantallaTotalScorm){
		LMSSetValue("cmi.core.exit", "suspend");
	}
	
	LMSFinish();
	grabarDatosSco();
}
function salirSCOSinCambios(){
	LMSSetValue("cmi.core.exit", "suspend");
	LMSFinish();
	grabarDatosSco();
}

function recogerEstadoVisitSCO(){
/*cmi.core.entry
?	"ab-initio": Esto indica que es la primera vez que un estudiante entra al SCO. Puesto que un estudiante podr?a haber pasado todos los objetivos de un SCO haciendo un pre-test, el valor ?not attempted en lesson_status no es un indicador fiable. Esto significar?a que un SCO podr?a ser aprobado sin que el estudiante ni siquiera lo haya visto antes. 
?	"resume": Indica que el estudiante ha estado en el SCO con anterioridad. El estudiante est? empezando de nuevo un SCO visitado.
?	 "": La cadena vac?a se usa para representar una entrada del estudiante en el SCO que no es ninguna de las anteriores.

*/
	estado=LMSGetValue("cmi.core.entry");
	switch (estado) {
		case (2):
			estadoV = "Primera visita";
			break;
		case (3):
			estadoV = "Visitado";
			break;
		case (1):
			estadoV = "Normal";
			break;
		default:
			estadoV="";
		}
		return estadoV;
}

function recogerEstadoModoSCO(){
/*"cmi.mode"
?	"browse": El estudiante quiere hacer una vista previa pero no necesariamente ser evaluado.
?	"normal": indica que el SCO se debe comportar de forma que el alumno sea evaluado.
?	"review": El estudiante ya ha visto el contenido almenos una vez y ha sido evaluado. 
*/
	estado=LMSGetValue("cmi.mode");
	switch (estado) {
		case (2):
			estadoM = "Vista previa";
			break;
		case (1):
			estadoM = "Evaluación";
			break;
		case (3):
			estadoM = "Repaso";
			break;
		default:
			estadoM="";
		}
		return estadoM;
}
function LMS_EvaluaAlAlumno(){
/*?"cmi.credit "
	?credit?.  Significa  que el estudiante va a ser evaluado. El LMS le dice al SCO que los datos que el SCO manda al LMS son para ser evaluados.
?	 ?no-credit?.  Significa  que el estudiante no va a ser evaluado. El LMS le dice al SCO que los datos que el SCO manda al LMS no los utiliza para evaluar al estudiante.
*/
	modoEV=LMSGetValue("cmi.core.credit");
	return modoEV;
}

function recogerTiempoAcumulado(){
/*cmi.core.total_time Tiempo acumulado de todas las sesiones de un estudiante en el SCO. */
	//t= GetPreviouslyAccumulatedTime();
	//return ConvertDateToCMITime(t);
	LMSGetValue("cmi.core.total_time");
}

function recogerTiempoSesion(){
	LMSGetValue("cmi.core.session_time");

}

function recogerLocalizacion(){
	LMSGetValue("cmi.core.lesson_location");

}
function grabarTiempoSesion(tiempo){
/*cmi.core.session_time 
Es la cantidad de horas, minutos y segundos que el estudiante ha pasado con el SCO en el momento en que lo abandona, es decir, el tiempo de la sesi?n en un s?lo uso del SCO.  */
	//SetSessionTime(intMilliseconds);
	LMSSetValue("cmi.core.session_time",intMilliseconds);
}


