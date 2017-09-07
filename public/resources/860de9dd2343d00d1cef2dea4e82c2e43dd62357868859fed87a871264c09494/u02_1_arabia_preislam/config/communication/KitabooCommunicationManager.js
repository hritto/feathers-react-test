// Archivo KitabooCommunicationManager.js v1.0 - Actualizado el 28/02/2015

 /*
  * @author      Hurix Systems
  * @version     1.1.1*/

 /** ********************************** **/
 /** KitabooCommunication  **/
 /** ********************************** **/



//alert('api base domain: ' + dName);



 function KitabooCommunication() {}
 KitabooCommunication.availeble; /* true or false */
 KitabooCommunication.result = 0; /* (correctAnswerCount * 100/totalNumberOfQuestion) */
 //KitabooCommunication.user_responce = ""; /* "page1%page2" user visited pages befour close */
 KitabooCommunication.totalNumberOfQuestion = 0; /* total number of pages in the package */
 KitabooCommunication.type = "";

 KitabooCommunication.sendDataToKitaboo = function() {
     /*If needed, the student's response can be saved in student_response property.
      * If more than one response then it should be separated by '%' character
      * E.g. If user has solved 2 questions then student_response can be - 'chk1_cb%chk3_cb', where chk1_cb & chk1_cb can be instance name of the checkboxes
      */
     if (window.console) console.log(" Dictera Activity is sending score to kitaboo as correctQuestionCount : " + ActivityAssesmentInfo.correctAnswersCount);
     if (window.console) console.log(" TotalNumberOfAssessmentQuestion : " + ActivityAssesmentInfo.totalNumberOfAssessmentQuestion);
     KitabooCommunicationManager.sendActivityData(ActivityAssesmentInfo.correctAnswersCount, "", ActivityAssesmentInfo.totalNumberOfAssessmentQuestion, "");
     KitabooCommunicationManager.closeActivityJSCallBack();
 }

 KitabooCommunication.checkIsKitabooCommunicationAvailable = function() /*Boolean*/ {
     /*try{*/
     /* 	HERE WE ARE CHECKING FOR HTML kitaoo Player AVILEBLITY BY CHECKING VALUE OF <isHurix> VARIBALE */
     //var _isHTMLKitabooPlayer = KitabooCommunicationManager.getFlexApp().isHurix;
     /* if (String(_isHTMLKitabooPlayer).toUpperCase() == "TRUE" || _isHTMLKitabooPlayer == true) {
         KitabooCommunication.type = "html";
         return true;
     } else {
         /* this condition will check 
						flash version of Kitaboo player is currentally availeble or not
						and send true or false 
						BY CHECKING closeActivityJSCallBack FUNCTION INSIDE KITABOO FLASH PALYER 
					*/
     /*var _isFlashKitabooPlayer = KitabooCommunicationManager.getFlexApp().closeActivityJSCallBack;
         if (_isFlashKitabooPlayer != null && _isFlashKitabooPlayer != undefined) {
             KitabooCommunication.type = "flash"
             return true;
         } else {
             KitabooCommunication.type = "marsipual"
             return true;
         }
     }*/

     if (KitabooCommunicationManager.getFlexApp().topWindow) {
         if (KitabooCommunicationManager.getFlexApp().topWindow.closeActivityJSCallBack) {
             KitabooCommunication.type = "html";
             return true;
         }
     } else if (KitabooCommunicationManager.getFlexApp().closeActivityJSCallBack) {
         if (KitabooCommunicationManager.getFlexApp().closeActivityJSCallBack) {
             KitabooCommunication.type = "flash";
             return true;
         }
     } else if (getParameterByName('token') != "") {
         KitabooCommunication.type = "ipadAndroid";
         return true;
     } else if (typeof(winMarsupialInfo) != "undefined") {
         KitabooCommunication.type = "window";
         return true;

     } else {
         return false;
     }

 }

 function loadWinData() {

     var fileref = document.createElement('script')
     fileref.setAttribute("type", "text/javascript")
     fileref.setAttribute("src", "marsupial.js")
     if (typeof fileref != "undefined")
         document.getElementsByTagName("head")[0].appendChild(fileref)
 }

 function getParameterByName(name) {
     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
         results = regex.exec(location.search);
     return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
 }

 function KitabooCommunicationManager() {}

 //This is a simple function which sends activity data to the eBook
 KitabooCommunicationManager.sendActivityData = function(result, student_response, totalNumberOfQuestion) {

     //alert('came in' + (KitabooCommunicationManager.getFlexApp()).isHurix); check whether its running from kitaboo

     if (window.console) console.log("KitabooCommunicationManager---- data recived from dictera activity as correctQuestionCount : " + result + " :: " + "totalNumberOfQuestion : " + totalNumberOfQuestion);


     //variable holds the value of activity result and student response that will be sent to the book, which in turn will send it to the LMS
     //define an object with 2 properties - result and student_response
     var objSend = {
         result: '',
         student_response: ''
     };
     //calculate score of the activity in percentage i.e. (score/no. of questions)*100
     objSend.result = (result / totalNumberOfQuestion) * 100;
     //If needed, the student's response can be saved in student_response property. 
     //If more than one response then it should be separated by '%' character
     //E.g. If user has solved 2 questions then student_response can be - 'chk1_cb%chk3_cb', where chk1_cb & chk1_cb can be instance name of the checkboxes 
     objSend.student_response = student_response !== undefined && student_response !== '' ? student_response : '';

     if (KitabooCommunication.checkIsKitabooCommunicationAvailable()) {
         if (KitabooCommunication.type == "html" || KitabooCommunication.type == "flash") {
             if (KitabooCommunicationManager.getFlexApp().topWindow)
                 KitabooCommunicationManager.getFlexApp().topWindow.activityJSCallBack(objSend);
             else {
                 if (KitabooCommunicationManager.getFlexApp().activityJSCallBack)
                     KitabooCommunicationManager.getFlexApp().activityJSCallBack(objSend);
             }
         } else {
             KitabooCommunicationManager.sendToMarsupial(objSend.result);
         }
         /*SCORM:END*/
     }
 }
 // This function returns the appropriate reference,
 // depending on the browser.
 KitabooCommunicationManager.getFlexApp = function() {
     //Get the reference so activeX or Plugin. flexApp is id/name of OBJECT/EMBED tags
     //alert(window.parent.window.opener.document);
     loadWinData();
     try {
         if ($('body').hasClass('ie')) {
             if (window.top.window.document !== null && window.top.window.document[appName] != null) {
                 return {
                     isHurix: window.top.window.document[appName].isHurix,
                     topWindow: window.top.window.document[appName]
                 };
             } else if (window.parent.window.opener !== null && window.parent.window.document.getElementById(appName) != null) {
                 return {
                     isHurix: window.parent.window.document.getElementById(appName).isHurix,
                     topWindow: window.parent.window.document.getElementById(appName)
                 };
             } else if (window.top.window !== null) {
                 if (window.top.window.isHurix == undefined) {
                     return window.parent.window.parent.window.document.getElementsByTagName('iframe')[0].contentWindow.window
                 } else {
                     return window.top.window; // Used when activity is interacting with HTML
                 }
             }

         } else {
             if (window.top.window.document !== null && window.top.window.document[appName] != null) {
                 return {
                     isHurix: window.top.window.document[appName].isHurix,
                     topWindow: window.top.window.document[appName]
                 };
             } else if (window.parent.window.opener !== null && window.parent.window.opener.document[appName] != null) {
                 return {
                     isHurix: window.parent.window.document.getElementById(appName).isHurix,
                     topWindow: window.parent.window.document.getElementById(appName)
                 };
             } else if (window.top.window[0][2] && window.top.window[0][2].document[appName] != null) {
                 return {
                     isHurix: window.top.window[0][2].document[appName].isHurix,
                     topWindow: window.top.window[0][2].document[appName]
                 }; // Used when activity is interacting with HTML
             } else if (window.top.window[2] && window.top.window[2].document[appName] != null) {
                 //console.log('window.top.window.opener.window');
                 return {
                     isHurix: window.top.window[2].isHurix,
                     topWindow: window.top.window[2].document[appName]
                 }; // Used when activity is interacting with HTML
             } else if (window.top.window.opener !== null) {
                 // This was done for Algaida Player where window.top.window.opener supposed to be null but it is not.
                 // BEWARE: This sometimes throws cross-domain error in case the opener belongs to different DOMAIN.
                 // So we handle it in the catch-statement.				 
                 // @author: AmitG<amit.gharat@hurix.com>
                 // @date: 22nd May 2014
                 // return window.top.window.opener.window; // Used when activity is interacting with HTML
                 return window.top.window.isHurix == undefined ? window.top.window.opener.window : window.top.window; // Used when activity is interacting with HTML
             } else {
                 //console.log('window.top.window');
                 if (window.top.window.isHurix == undefined) {
                     return window.parent.window.parent.window.document.getElementsByTagName('iframe')[0].contentWindow.window
                 } else {
                     return window.top.window; // Used when activity is interacting with HTML
                 }

             }
         }
     } catch (e) {
         if ($.isEmptyObject(e) || e.code === 18) {
			/*In case of cross domain iframe trying to access parent window it able to access then it will return window data on 			topWindow else flow goes on catch block and topWindow will be null to handle exception
				@Edited by: Nitin Chandrakar [M1158]
				*/
			try
			{
				if(window.top.window.isHurix)
				{
					return{isHurix: true,topWindow: window.top.window};	
				}
			}
			catch(e)
			{
				return{isHurix: true,topWindow:null};
			}
            /* return window.top.window.isHurix == undefined ? {
                 isHurix: true,
                 topWindow: null
             } : window.top.window;*/
         } else {
             return {
                 isHurix: true,
                 topWindow: null
             };
         }
     }

 }

 /** 
  * This is a simple function which sends final activity data to the server
  * call this function before closing the browser (onbeforeunload)
  **/
 KitabooCommunicationManager.closeActivityJSCallBack = function() {
     if (window.console) console.log("KitabooCommunicationManager ---- closeActivityJSCallBack called from Dictera activity");
     //Get the reference so activeX or Plugin. flexApp is id/name of OBJECT/EMBED tags
     if (KitabooCommunicationManager.getFlexApp().topWindow)
         KitabooCommunicationManager.getFlexApp().topWindow.closeActivityJSCallBack();
     else {
         if (KitabooCommunicationManager.getFlexApp().closeActivityJSCallBack) {
             KitabooCommunicationManager.getFlexApp().closeActivityJSCallBack();
         }
     }
 }

 /*this function will read information from app data and send request to marsupial*/
 KitabooCommunicationManager.sendToMarsupial = function(score) {
     var activityData = {};
     var usuario_sessionId;
     var password_password;
     var serviceUrl;

     if (getParameterByName('token') != "") { /*When activity open from native app or offile*/
         var queryStringInfo = getParameterByName('token');

         queryStringInfo = queryStringInfo.replace('"{', '{').replace('}"', '}');
         queryStringInfo = queryStringInfo.replace("'{", '{').replace("}'", '}');

         var queryStringInfoObj = JSON.parse(queryStringInfo);

         /*below information get from token*/
         activityData.credenciales = queryStringInfoObj.credenciales;
         activityData.ISBN = queryStringInfoObj.ISBN;
         activityData.idUsuario = queryStringInfoObj.idUsuario;
         activityData.idCentro = queryStringInfoObj.idCentro;
         activityData.url = queryStringInfoObj.url;
         activityData.idUnidad = queryStringInfoObj.idUnidad;
         activityData.idActividad = queryStringInfoObj.idActividad;
         activityData.selloId = queryStringInfoObj.selloId;

         /*below information get from activity*/
         activityData.fechaHoraInicio = queryStringInfoObj.startDateTime; //ActivityAssesmentInfo.startTimeDate;
         activityData.duracion = Math.ceil(((new Date().getTime()) - parseInt(queryStringInfoObj.startTime)) / 1000);
         activityData.calificacion = Math.ceil(score);
         activityData.intentos = 1;

         usuario_sessionId = queryStringInfoObj.idUsuario;
         password_password = queryStringInfoObj.password;
         serviceUrl = queryStringInfoObj.serviceUrl;
         KitabooCommunicationManager.sendScoreToMarsupial(usuario_sessionId, password_password, serviceUrl, activityData);
     } else if (getParameterByName('sessionId') != "") { /*When activity open from online*/
         usuario_sessionId = getParameterByName('sessionId');
         password_password = LMSCommunicator.encryptData(usuario_sessionId); // – this value will generate by doing SHA1 encryption of sessionId (received in step #1) using MARSUPIAL_COMMON_KEY (we need to do this encryption in JavaScript)		
         serviceUrl = 'http://marsupial-anaya.edistribucion.es/marsupialws/anaya/seguimiento/guardarTablet';

         activityData.idUnidad = ActivityAssesmentInfo.marsupialData.unidad.id; // TOC id**
         activityData.idActividad = ActivityAssesmentInfo.marsupialData.unidad.activity.id; // Activity id
         activityData.fechaHoraInicio = ActivityAssesmentInfo.startTimeDate; // activity start date & time
         activityData.duracion = Math.ceil(ActivityAssesmentInfo.startTime - (new Date().getTime())); // difference start time & end time
         activityData.calificacion = Math.ceil(score); // student result
         activityData.intentos = 1; // no of attempts@ default 1
         KitabooCommunicationManager.sendScoreToMarsupial(usuario_sessionId, password_password, serviceUrl, activityData);
     } else {
         if ((KitabooCommunication.type == "window")) {
             activityData.credenciales = winMarsupialInfo.credenciales;
             activityData.ISBN = winMarsupialInfo.ISBN;
             activityData.idUsuario = winMarsupialInfo.idUsuario;
             activityData.idCentro = winMarsupialInfo.idCentro;
             activityData.url = winMarsupialInfo.url;
             activityData.idUnidad = winMarsupialInfo.idUnidad;
             activityData.idActividad = winMarsupialInfo.idActividad;
             activityData.selloId = winMarsupialInfo.selloId;

             /*below information get from dictera activity*/
             activityData.fechaHoraInicio = winMarsupialInfo.startDateTime; //ActivityAssesmentInfo.startTimeDate;
             activityData.duracion = Math.ceil(((new Date().getTime()) - parseInt(winMarsupialInfo.startTime)) / 1000);
             activityData.calificacion = Math.ceil(score);
             activityData.intentos = 1;

             usuario_sessionId = winMarsupialInfo.idUsuario;
             password_password = winMarsupialInfo.password;
             serviceUrl = winMarsupialInfo.serviceUrl;

             KitabooCommunicationManager.sendScoreToMarsupial(usuario_sessionId, password_password, serviceUrl, activityData);
         } else {
             return;
         }

     }
 }
 /**
     * This is a simple function which sends final activity data to the server
     * all activity needs to call this function and pass below mention arguments
     * to send activity data to Server.
     *
     * @param _sessionId   session id as user id
     * @param _password    encrypted password
 
     ********* activityData must be as below to send marsupial service ***********
    *
     * @param _activityData activity data Object {
     *                          activityData.idUnidad = idUnidad_tocID; // TOC id
     *                          activityData.idActividad = idActividad_ActivityId; // Activity id
     *                          activityData.fechaHoraInicio = fechaHoraInicio_dateStartTime;// activity start date & time
     *                          activityData.duracion = duracion_TotalTimeSpend; // difference start time & end time
     *                          activityData.calificacion = calificacion_rate; // student result
     *                          activityData.intentos = intentos_attempts; // no of attempts@ default 1
     *        }
     *
     * @return          <code>true</code> data send to LMS successfully;
     *                            <code>false</code> otherwise.
     * @see             sendActivityData
     * @see             closeActivityJSCallBack
     * @since           1.0
     */
 KitabooCommunicationManager.sendScoreToMarsupial = function(_sessionId, _password, _serviceUrl, _activityData) /* _uid:string, _password:string, _data:Object (key:value) */ {
     var serviceURL;

     serviceURL = _serviceUrl;

     $.ajax({
         type: "POST",
         dataType: 'jsonp', //use jsonp data type in order to perform cross domain ajax
         crossDomain: true,
         url: serviceURL,
         data: {
             usuario: _sessionId,
             password: _password,
             data: JSON.stringify(_activityData)
         },
         cache: false,
         jsonpCallback: "localJsonpCallback",
         statusCode: {
             404: function() {
                 console.log("page not found");
                 return false;
             }
         },
         success: function(data) {
             console.log('success Data', data)
         }
     }).done(function(msg) {
         return true;
     }).error(function(errormessage) {
         console.log("error :" + errormessage.statusText);
         return false;
     }).fail(function() {
         return false;
     });

     function localJsonpCallback(data) {

     }
 }
