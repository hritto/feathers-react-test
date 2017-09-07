NS("AnayaInfantil");

AnayaInfantil.Config = {
  //Zona común a todas las escenas o pantallas
  "media": {
    "images": {
	"cole": "mia.jpg",
	"trans": "trans.png",
      "speaker": "speaker.png",
      "entrar": "entrar.png",
      "salir": "salir.png",
      "inicio": "inicio.png",
	  
	  "fondo": "fondo.jpg",
	  
      
	  "back": "back.jpg"
    },
    "sounds": {
      "titulo": {
        "mp3": "titulo.mp3",
        "ogg": "titulo.ogg"
      },
      "enunciado": {
        "mp3": "enunciado.mp3",
        "ogg": "enunciado.ogg"
      },
      
      "error": {
        "mp3": "error.mp3",
        "ogg": "error.ogg"
      },
      
	  

    },
  },
  //Las escenas: cada elemento del array "code" es la configuración de una escena o pantalla
  "code": [{
      "size": { //Tamaño del área de actividad
        "w": 1000,
        "h": 560
      },
      "menu_url": "../../murales.html",
      "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
      "main_el": "main", //Fondo blanco
      "scene_el": "container", //Contenedor de actividades
      "main_back": null, //La imagen de fondo del escenario (de 1000 x 560)
      "show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
      "init_config": { //Configuración de la ventana inicial (pre inicio)
        "show_intro": true, //Mostrar la ventana inicial al abrir
        "background_image": null, //Si se desea, se puede poner una imagen de fondo
        "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
        "size": {
          "w": 500,
          "h": 400
        },
        "elements": {
          "animation_1": {
            "size": {
             "w": 600,
           	 "h": 452
          },
          "pos": {
            "x": 150,
            "y": 10
            },
            "type": "image",
            "image": "entrar"
          }

        }
      },
      "end_config": { //Configuración de la ventana final (post resolucion)
        "size": {
          "w": 500,
          "h": 400
        },
        "show_end": false,
        "background_image": null, //Si se desea, se puede poner una imagen de fondo
        "elements": {},

      },
      "type": 3, // 0:dNd, 1:click, 2:paint, 3: pantalla estática que acaba sola con timer //
      "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
        "btn_home": true,
        "btn_redo": false,
        "btn_back": false,
        "btn_next": false,
      },
      "elements": {
        "image_2": {
        "size": {
          "w": 351,
          "h": 212
        },
        "pos": {
          "x": 320,
          "y": 180
        },
        "type": "image",
        "image": "inicio"
      },
      },
      "timer": {
        "time": 500
      },
      "resolution": {},
      "instruction": {
        "text": "Vamos a jugar, a buscar, en este dibujo de una clase. Si encuentras lo que se dice, tócalo o haz clic sobre ello.",
        "sound": "titulo"
      }
    },
	
	
	
	
	
	
/*------------------------------------------------------*/	
    //Escena 1
/*------------------------------------------------------*/	
	
    {
      "size": { //Tamaño del área de actividad
        "w": 1000,
        "h": 560
      },
      "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
      "menu_url": "../../index.html",
      "main_el": "main", //Fondo blanco
      "scene_el": "container", //Contenedor de actividades
      "main_back": "fondo", //"back", //La imagen de fondo del escenario (de 1000 x 560)
      "show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
      "init_config": { //Configuración de la ventana inicial (pre inicio)
        "show_intro": false, //Mostrar la ventana inicial al abrir
        "background_image": null, //Si se desea, se puede poner una imagen de fondo
        "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
        "size": {
          "w": 800,
          "h": 500
        },
        "elements": {},
      },
      "end_config": { //Configuración de la ventana final (post resolucion)
        "size": {
          "w": 500,
          "h": 400
        },
        "show_end": true,
        "background_image": null, //Si se desea, se puede poner una imagen de fondo
        "elements": {
	  "animation_1": {
            "size": {
              "w": 400,
              "h": 320
            },
            "pos": {
              "x": 50,
              "y": 20
            },
            "type": "image",
            "image": "salir"
          },
          "end_audio": {
            "type": "audio",
            "audio": "ok_2",
          },
	  }
      },
      "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
      "multiple_answers": true, //Si hay más de una respuesta por pantalla, controla todas. Si false, controla que una de las correctas coincida
      "animate_answers": false, //Si las respuestas se animan al hacerles click (OK/KO)
      "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
        "btn_home": true,
        "btn_redo": false,
        "btn_back": true,
        "btn_next": false,
      },
      "elements": {
        "a1": {
          "id": "a1",
          "pos": {
            "x": 140,
            "y": 0
          },
          "size": {
            "w": 148,
            "h": 214
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a2": {
          "id": "a2",
          "pos": {
            "x": 140,
            "y": 237
          },
          "size": {
            "w": 83,
            "h": 252
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a3": {
          "id": "a3",
          "pos": {
            "x": 249,
            "y": 231
          },
          "size": {
            "w": 66,
            "h": 119
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a4": {
          "id": "a4",
          "pos": {
            "x": 271,
            "y": 362
          },
          "size": {
            "w": 68,
            "h": 128
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a5": {
          "id": "a5",
          "pos": {
            "x": 347,
            "y": 245
          },
          "size": {
            "w": 214,
            "h": 66
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a6": {
          "id": "a6",
          "pos": {
            "x": 385,
            "y": 334
          },
          "size": {
            "w": 79,
            "h": 125
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a7": {
          "id": "a7",
          "pos": {
            "x": 476,
            "y": 320
          },
          "size": {
            "w": 310,
            "h": 179
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a8": {
          "id": "a8",
          "pos": {
            "x": 670,
            "y": 200
          },
          "size": {
            "w": 83,
            "h": 109
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		"a9": {
          "id": "a9",
          "pos": {
            "x": 696,
            "y": 8
          },
          "size": {
            "w": 97,
            "h": 181
          },
          "image": "trans",
          "sound": "success",
          "type": "clickable"
        },
		
		
      },
      "resolution": {
        "a1": false,
		"a2": true,
		"a3": false,
		"a4": true,
		"a5": false,
		"a6": false,
		"a7": true,
		"a8": true,
		"a9": true,
        
      },
      "instruction": {
        "text": "---",
        "sound": "enunciado"
      }
    },
	
		
	
	
	
	
	
	
    ],
};
	
	
	
	
	
	
