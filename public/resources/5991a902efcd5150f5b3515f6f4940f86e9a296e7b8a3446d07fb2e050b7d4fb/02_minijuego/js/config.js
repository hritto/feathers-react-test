NS("AnayaInfantil");

AnayaInfantil.Config = {
  //Zona común a todas las escenas o pantallas
  "media": {
    "images": {
	"uno": "1.png",
	"dos": "2.png",
	"tres": "3.png",
	"cuatro": "4.png",
	  "inicio": "inicio.png",
	  "entrar": "entrar.png",
	  "salir": "salir.png",
      "speaker": "speaker.png"


    },
    "sounds": {
      "titulo": {
        "mp3": "1.mp3",
        "ogg": "1.ogg"
      },
      "titulo2": {
        "mp3": "2.mp3",
        "ogg": "2.ogg"
      },
      "instruccion": {
        "mp3": "3.mp3",
        "ogg": "3.ogg"
      },
      "alegria_r": {
        "mp3": "alegria.mp3",
        "ogg": "alegria.ogg"
      },
      "asco_r": {
        "mp3": "asco.mp3",
        "ogg": "asco.ogg"
      },
      "sorpresa_r": {
        "mp3": "sorpresa.mp3",
        "ogg": "sorpresa.ogg"
      },
      "tristeza_r": {
        "mp3": "tristeza.mp3",
        "ogg": "tristeza.ogg"
      },
	  "1_b": {
        "mp3": "1_b.mp3",
        "ogg": "1_b.ogg"
      },
      "2_b": {
        "mp3": "2_b.mp3",
        "ogg": "2_b.ogg"
      },
      "3_b": {
        "mp3": "3_b.mp3",
        "ogg": "3_b.ogg"
      },
      "4_b": {
        "mp3": "4_b.mp3",
        "ogg": "4_b.ogg"
      },
      "5_b": {
        "mp3": "5_b.mp3",
        "ogg": "5_b.ogg"
      }
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
              "w": 351,
              "h": 212
            },
            "pos": {
              "x": 20,
              "y": 20
            },
            "type": "image",
            "image": "entrar"
          },
      },
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
    "info_config": {
        "text": "",
        "background_image": null,
        "background_color": '#FFF',
        "size": {
          "w": 800,
          "h": 500
        }
      },
    "type": 3, // 0:dNd, 1:click, 2:paint, 3: pantalla estática que acaba sola con timer //
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": false,
      "btn_next": false,
      "btn_info": false,
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
      "sound2": {
        "type": "audio",
        "audio": "titulo2",
      }
    },
    "timer": {
      "time": 5000
    },
    "resolution": {},
    "instruction": {
      "text": "Alegría, tristeza, sorpresa y asco.",
      "sound": "titulo"
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
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
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
      "show_end": false,
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
      },
    },
	"info_config": {
      "text": "<h1>Objetivos de la actividad:</h1><h2>Reconocer el esquema básico de una cara para formarla a partir de piezas o para dibujarla, primero con una plantilla y después sin ella.</h2> <h2>Practicar las técnicas básicas para el manejo de un ordenador o de una tableta que implican psicomotricidad fina: seleccionar una opción, arrastrar y soltar, mover el cursor con precisión, etc.</h2> <h2>Ser capaces de representar el propio aspecto (la cara).</h2>",
      "background_image": null,
      "background_color": '#FFF',
      "size": {
        "w": 800,
        "h": 500
      }
    },
    "type": 4, // 0:dNd, 1:click, 2:paint , 4 memory
    "period": 0,
    "max_turns": 0, //La cantidad de veces que puede darse una carta TODO
    "maxTime": 0, //La cantidad de tiempo que está dada vuelta una carta TODO
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": true,
      "btn_info": true,
    },
    "elements": {
      "cards": [
        {
          "id": "a1",
          "image": "uno",
          "sound": "sorpresa_r",
          "back": null,
          "equal": false
        },
        {
          "id": "a2",
          "image": "uno",
          "sound": "sorpresa_r",
          "back": null,
          "equal": false
        },
        {
          "id": "a3",
          "image": "dos",
          "sound": "asco_r",
          "back": null,
          "equal": false
        },
        {
          "id": "a4",
          "image": "dos",
          "sound": "asco_r",
          "back": null,
          "equal": false
        },
		{
          "id": "a5",
          "image": "tres",
          "sound": "alegria_r",
          "back": null,
          "equal": false
        },
		{
          "id": "a6",
          "image": "tres",
          "sound": "alegria_r",
          "back": null,
          "equal": false
        },
		{
          "id": "a7",
          "image": "cuatro",
          "sound": "tristeza_r",
          "back": null,
          "equal": false
        },
		{
          "id": "a8",
          "image": "cuatro",
          "sound": "tristeza_r",
          "back": null,
          "equal": false
        }
      ]
    },
    "resolution": {
      "a1": {
        "refIDs": [
          "a2"
        ]
      },
      "a2": {
        "refIDs": [
          "a1"
        ]
      },
      "a3": {
        "refIDs": [
          "a4"
        ]
      },
      "a4": {
        "refIDs": [
          "a3"
        ]
      },
      "a5": {
        "refIDs": [
          "a6"
        ]
      },
      "a6": {
        "refIDs": [
          "a5"
        ]
      },
      "a7": {
        "refIDs": [
          "a8"
        ]
      },
      "a8": {
        "refIDs": [
          "a7"
        ]
      }
    },
    "instruction": {
      "text": "Este es el juego de la memoria. Toca o haz clic en dos caras para descubrirlas. Tienes que encontrar parejas de caras iguales.",
      "sound": "instruccion"
    }
  },


  /*-------------Escena 3-----------*/

   {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
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
      "show_end": false,
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
  	  "elements": {},
    },
    "info_config": {
        "text": "",
        "background_image": null,
        "background_color": '#FFF',
        "size": {
          "w": 800,
          "h": 500
        }
      },
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": true,
      "btn_info": true,
    },
    "elements": {
      "question": {
        "id": "question",
        "pos": {
          "x": 10,
          "y": 24
        },
        "size": {
          "w": 920,
          "h": 180
        },
        "image": "speaker",
        "text": "Jugar nos pone alegres. ¿Cuál es la cara de alegría?",
        "text_margin_top": 20,
        "sound": "2_b",
        "type": "question_model"
      },
      "sorpresa": {
        "id": "sorpresa",
        "pos": {
          "x": 10,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "uno",
        "sound": "sorpresa_r",
        "type": "clickable"
      },
      "asco": {
        "id": "asco",
        "pos": {
          "x": 250,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "dos",
        "sound": "asco_r",
        "type": "clickable"
      },
      "alegria": {
        "id": "alegria",
        "pos": {
          "x": 490,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "tres",
        "sound": "alegria_r",
        "type": "clickable"
      },
      "tristeza": {
        "id": "tristeza",
        "pos": {
          "x": 730,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "cuatro",
        "sound": "tristeza_r",
        "type": "clickable"
      }
    },
    "resolution": {
      "asco": false,
      "sorpresa": false,
      "alegria": true,
      "tristeza": false,
    },
    "instruction": {
      "text": "Escucha y toca o haz clic en la cara correcta.",
      "sound": "1_b"
    },
  },




  /*-------------Escena 4-----------*/

   {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
    "show_instruction": false, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
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
      "show_end": false,
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
  	  "elements": {},
    },
    "info_config": {
        "text": "",
        "background_image": null,
        "background_color": '#FFF',
        "size": {
          "w": 800,
          "h": 500
        }
      },
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": true,
      "btn_info": true,
    },
    "elements": {
      "question": {
        "id": "question",
        "pos": {
          "x": 10,
          "y": 24
        },
        "size": {
          "w": 920,
          "h": 180
        },
        "image": "speaker",
        "text": "Si se nos pierde un juguete, nos ponemos tristes. ¿Cuál es la cara de tristeza?",
        "text_margin_top": 20,
        "sound": "3_b",
        "type": "question_model"
      },
      "sorpresa": {
        "id": "sorpresa",
        "pos": {
          "x": 10,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "uno",
        "sound": "sorpresa_r",
        "type": "clickable"
      },
      "asco": {
        "id": "asco",
        "pos": {
          "x": 250,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "dos",
        "sound": "asco_r",
        "type": "clickable"
      },
      "alegria": {
        "id": "alegria",
        "pos": {
          "x": 490,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "tres",
        "sound": "alegria_r",
        "type": "clickable"
      },
      "tristeza": {
        "id": "tristeza",
        "pos": {
          "x": 730,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "cuatro",
        "sound": "tristeza_r",
        "type": "clickable"
      }
    },
    "resolution": {
      "asco": false,
      "sorpresa": false,
      "alegria": false,
      "tristeza": true,
    },
    "instruction": {
      "text": "Escucha y toca o haz clic en la cara correcta.",
      "sound": "1_b"
    },
  },



  /*-------------Escena 5-----------*/

   {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
    "show_instruction": false, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
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
      "show_end": false,
      "background_image": null, //Si se desea, se puede poner una imagen de fondo
  	  "elements": {},
    },
    "info_config": {
        "text": "",
        "background_image": null,
        "background_color": '#FFF',
        "size": {
          "w": 800,
          "h": 500
        }
      },
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": true,
      "btn_info": true,
    },
    "elements": {
      "question": {
        "id": "question",
        "pos": {
          "x": 10,
          "y": 24
        },
        "size": {
          "w": 920,
          "h": 180
        },
        "image": "speaker",
        "text": "Si un perro ladra de repente, nos da una sorpresa. ¿Cuál es la cara de sorpresa?",
        "text_margin_top": 20,
        "sound": "4_b",
        "type": "question_model"
      },
      "sorpresa": {
        "id": "sorpresa",
        "pos": {
          "x": 10,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "uno",
        "sound": "sorpresa_r",
        "type": "clickable"
      },
      "asco": {
        "id": "asco",
        "pos": {
          "x": 250,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "dos",
        "sound": "asco_r",
        "type": "clickable"
      },
      "alegria": {
        "id": "alegria",
        "pos": {
          "x": 490,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "tres",
        "sound": "alegria_r",
        "type": "clickable"
      },
      "tristeza": {
        "id": "tristeza",
        "pos": {
          "x": 730,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "cuatro",
        "sound": "tristeza_r",
        "type": "clickable"
      }
    },
    "resolution": {
      "asco": false,
      "sorpresa": true,
      "alegria": false,
      "tristeza": false,
    },
    "instruction": {
      "text": "Escucha y toca o haz clic en la cara correcta.",
      "sound": "1_b"
    },
  },





  /*-------------Escena 6-----------*/

   {
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": false, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //"back", //La imagen de fondo del escenario (de 1000 x 560)
    "show_instruction": false, //Mostrar la instrucción automáticamente (en móviles, esta opción necesita show_intro = true)
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
	  "image_2": {
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
      "sound2": {
        "type": "audio",
        "audio": "ok_2",
      }
	  },
    },
    "info_config": {
        "text": "",
        "background_image": null,
        "background_color": '#FFF',
        "size": {
          "w": 800,
          "h": 500
        }
      },
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": false,
      "btn_info": true,
    },
    "elements": {
      "question": {
        "id": "question",
        "pos": {
          "x": 10,
          "y": 24
        },
        "size": {
          "w": 920,
          "h": 180
        },
        "image": "speaker",
        "text": "La caca nos da asco. ¿Cuál es la cara de asco?",
        "text_margin_top": 20,
        "sound": "5_b",
        "type": "question_model"
      },
      "sorpresa": {
        "id": "sorpresa",
        "pos": {
          "x": 10,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "uno",
        "sound": "sorpresa_r",
        "type": "clickable"
      },
      "asco": {
        "id": "asco",
        "pos": {
          "x": 250,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "dos",
        "sound": "asco_r",
        "type": "clickable"
      },
      "alegria": {
        "id": "alegria",
        "pos": {
          "x": 490,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "tres",
        "sound": "alegria_r",
        "type": "clickable"
      },
      "tristeza": {
        "id": "tristeza",
        "pos": {
          "x": 730,
          "y": 0
        },
        "size": {
          "w": 200,
          "h": 133
        },
        "image": "cuatro",
        "sound": "tristeza_r",
        "type": "clickable"
      }
    },
    "resolution": {
      "asco": true,
      "sorpresa": false,
      "alegria": false,
      "tristeza": true,
    },
    "instruction": {
      "text": "Escucha y toca o haz clic en la cara correcta.",
      "sound": "1_b"
    },
  },







  ],
};
