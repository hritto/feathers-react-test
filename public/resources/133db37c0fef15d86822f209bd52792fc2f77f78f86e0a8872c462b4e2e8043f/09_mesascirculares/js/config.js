NS("AnayaInfantil");

AnayaInfantil.Config = {
  //Zona común a todas las escenas o pantallas
  "media": {
    "images": {
      "outline": "smile.png",
      "back": "back.png",
      "inicio": "inicio.png",
	 "entrar": "entrar.png",
	  "salir": "salir.png"
    },
    "sounds": {
      "titulo": {
        "mp3": "audio_2.mp3",
        "ogg": "audio_2.ogg"
      },
	  "audio1": {
        "mp3": "audio_1.mp3",
        "ogg": "audio_1.ogg"
      },

      "pre_titulo": {
        "mp3": "pre_titulo.mp3",
        "ogg": "pre_titulo.ogg"
      }
    }
  },
  //Las escenas: cada elemento del array "code" es la configuración de una escena o pantalla
  "code": [{
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "menu_url": "../../index.html",
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
    "show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
    "init_config": { //Configuración de la ventana inicial (pre inicio)
      "show_intro": true, //Mostrar la ventana inicial al abrir
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
      "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
      "size": {
        "w": 800,
        "h": 500
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
		"audioa": {
          "type": "audio",
          "audio": "audio1",
        },

    },
    "timer": {
      "time": 5000
    },
    "resolution": {},
    "instruction": {
      "text": "Nos sentamos en círculo. Las mesas redondas.",
      "sound": "pre_titulo"
    }
  },
  //Escena 2
  {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //La imagen de fondo del escenario (de 1000 x 560)
    "show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
    "init_config": { //Configuración de la ventana inicial (pre inicio)
      "show_intro": false, //Mostrar la ventana inicial al abrir
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
      "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
      "size": {
        "w": 800,
        "h": 500
      },
      "elements": {}
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
            "audio": "starter",
          }
      }
    },
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": false,
    },
    "elements": {

     /* "back": {//Si tiene una imagen para "calcar"
        "image": "outline",
        "size": {
          "w": "auto", //Se puede poner un tamaño (relativo al área de pintado)
          "h": "auto"  //De lo contrario, la ajusta
        },
        "pos": {
          "x": "auto", //Se puede poner una posición (relativo al área de pintado)
          "y": "auto"  //De lo contrario la centra
        }
      },*/
      "back": {//Si tiene una imagen de fondo
        "image": "back",
        "size": {
          "w": "auto", //Se puede poner un tamaño (relativo al área de pintado)
          "h": "auto"  //De lo contrario, la ajusta
        },
        "pos": {
          "x": "auto", //Se puede poner una posición (relativo al área de pintado)
          "y": "auto"  //De lo contrario la centra
        }
      }
    },
    "resolution": {},
    "instruction": {
      "text": "Aquí hay varias mesas. Colorea de rojo las mesas con forma de círculo. Cuando creas que ya está, pulsa el botón.",
      "sound": "titulo"
    }
  }],
};
