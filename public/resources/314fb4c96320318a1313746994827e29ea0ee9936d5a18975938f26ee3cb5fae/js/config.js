NS("AnayaInfantil");

AnayaInfantil.Config = {
  //Zona común a todas las escenas o pantallas
  "media": {
    "images": {
	"circulo_rojo": "circulo_rojo.png",
	"circulo_amarillo": "circulo_amarillo.png",
	"circulo_azul": "circulo_azul.png",
	"cuadrado_rojo": "cuadrado_rojo.png",
	"cuadrado_amarillo": "cuadrado_amarillo.png",
	"cuadrado_azul": "cuadrado_azul.png",
	"triangulo_rojo": "triangulo_rojo.png",
	"triangulo_amarillo": "triangulo_amarillo.png",
	"triangulo_azul": "triangulo_azul.png",
	"blank": "blank.png",
	
	"fondo": "fondo.png",
	
      "speaker": "speaker.png",
      "entrar": "entrar.png",
      "salir": "salir.png",
      "inicio": "inicio.png",
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
      
	}
  },
  
  //Las escenas: cada elemento del array "code" es la configuración de una escena o pantalla
  "code": [{
      "size": { //Tamaño del área de actividad
        "w": 1000,
        "h": 560
      },
      "menu_url": "../../Nivel1.html",
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
          "w": 560,
          "h": 450
        },
        "elements": {
          "animation_1": {
            "size": {
              "w": 500,
              "h": 410
            },
            "pos": {
              "x": 20,
              "y": 20
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

        }
      },
      "timer": {
        "time": 500
      },
      "resolution": {},
      "instruction": {
        "text": "---",
        "sound": "titulo"
      }
    },
   
  /*................
  .................Escena 1
  */
  {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 700
    },
    "menu_url": "../../Nivel1.html",
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": "fondo", //"back", //La imagen de fondo del escenario (de 1000 x 560)
	"show_instruction": true, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
    "init_config": { //Configuración de la ventana inicial (pre inicio)
      "show_intro": false, //Mostrar la ventana inicial al abrir
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
      "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
      "size": {
        "w": 560,
        "h": 450
      },
      "elements": {
        "animation_1": {
          "size": {
            "w": 500,
            "h": 410
          },
          "pos": {
            "x": 20,
            "y": 20
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
          }
      }
    },

    "type": 0, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "reversible_drag": false, //Indica si es posible quitar los draggables del contenedor y volverlos a la posición inicial
    "drags_container": { //El contenedor de drags (tienen q estar dentro de un div...) La altura se calcula con el espacio que resta
      w: 840,
      h: 0
    },
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": false,

    },
    "elements": {
      "drop-target-1": {
        "id": "drop-target-1",
        "pos": {
          "x": 327,
          "y": 100
        },
        "size": {
          "w": 75,
          "h": 48
        },
        "image": "blank",
        "type": "drop_target"
      },
      "drop-target-2": {
        "id": "drop-target-2",
        "pos": {
          "x": 434,
          "y": 100
        },
        "size": {
          "w": 86,
          "h": 48
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-3": {
        "id": "drop-target-3",
         "pos": {
          "x": 549,
          "y": 100
        },
        "size": {
          "w": 75,
          "h": 48
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-4": {
        "id": "drop-target-4",
        "pos": {
          "x": 293,
          "y": 162
        },
        "size": {
          "w": 96,
          "h": 50
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-5": {
        "id": "drop-target-5",
        "pos": {
          "x": 421,
          "y": 162
        },
        "size": {
          "w": 112,
          "h": 50
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-6": {
        "id": "drop-target-6",
        "pos": {
          "x": 561,
          "y": 162
        },
        "size": {
          "w": 96,
          "h": 50
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-7": {
        "id": "drop-target-7",
        "pos": {
          "x": 256,
          "y": 230
        },
        "size": {
          "w": 114,
          "h": 52
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-8": {
        "id": "drop-target-8",
        "pos": {
          "x": 405,
          "y": 230
        },
        "size": {
          "w": 142,
          "h": 52
        },
        "image": "blank",
        "type": "drop_target"
      },
	  "drop-target-9": {
        "id": "drop-target-9",
        "pos": {
          "x": 579,
          "y": 230
        },
        "size": {
          "w": 113,
          "h": 52
        },
        "image": "blank",
        "type": "drop_target"
      },
      "answer_1": {
        "id": "answer_1",
        "pos": {
          "x": 0,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "circulo_rojo",
        "type": "draggable"
      },
      "answer_2": {
        "id": "answer_2",
        "pos": {
          "x": 100,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "circulo_amarillo",
        "type": "draggable"
      },
      "answer_3": {
        "id": "answer_3",
        "pos": {
          "x": 200,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "circulo_azul",
        "type": "draggable"
      },
      "answer_4": {
        "id": "answer_4",
        "pos": {
          "x": 300,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "cuadrado_rojo",
        "type": "draggable"
      },
	  "answer_5": {
        "id": "answer_5",
        "pos": {
          "x": 400,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "cuadrado_amarillo",
        "type": "draggable"
      },
	  "answer_6": {
        "id": "answer_6",
        "pos": {
          "x": 500,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "cuadrado_azul",
        "type": "draggable"
      },
	  	  "answer_7": {
        "id": "answer_7",
        "pos": {
          "x": 600,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "triangulo_azul",
        "type": "draggable"
      },
	  	  "answer_8": {
        "id": "answer_8",
        "pos": {
          "x": 700,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "triangulo_rojo",
        "type": "draggable"
      },
	  	  "answer_9": {
        "id": "answer_9",
        "pos": {
          "x": 800,
          "y": 0
        },
        "size": {
          "w": 80,
          "h": 80
        },
        "image": "triangulo_amarillo",
        "type": "draggable"
      },



    },
    "resolution": {
      "drop-target-1": {
        "refIDs": [
          "answer_8",
        ]
      },
      "drop-target-2": {
        "refIDs": [
          "answer_1",
        ]
      },
	  "drop-target-3": {
        "refIDs": [
          "answer_4",
        ]
      },
	   "drop-target-4": {
        "refIDs": [
          "answer_9",
        ]
      },
	  "drop-target-5": {
        "refIDs": [
          "answer_2",
        ]
      },
	  "drop-target-6": {
        "refIDs": [
          "answer_5",
        ]
      },
	  "drop-target-7": {
        "refIDs": [
          "answer_7",
        ]
      },
	  "drop-target-8": {
        "refIDs": [
          "answer_3",
        ]
      },
	  "drop-target-9": {
        "refIDs": [
          "answer_6",
        ]
      },
    },
    "instruction": {
      "text": "Arrastra cada figura para ordenarla en el cajón correcto.",
      "sound": "enunciado"
    }

  }
  
  
  
  
  
  
  ],
};
