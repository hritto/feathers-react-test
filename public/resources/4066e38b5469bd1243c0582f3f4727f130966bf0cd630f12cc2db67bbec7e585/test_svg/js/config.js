NS("AnayaInfantil");

AnayaInfantil.Config = {
  //Zona común a todas las escenas o pantallas
  "media": {
    "images": {
      "sf": "sf.png",
      "ara_1": "ara_1.png",
      "ara_2": "ara_2.png",
      "ara_3": "ara_3.png",
      "ara_4": "ara_4.png",
      "cala_1": "cala_1.png",
      "cala_2": "cala_2.png",
      "mur_1": "mur_1.png",
      "mur_2": "mur_2.png",
      "mur_3": "mur_3.png",
      "esq": "esq.png",
      "esc": "esc.png",
      "inicio": "inicio.png",
  	  "entrar": "entrar.png",
  	  "salir": "salir.png",
      "done": "done.png"
    },
    "sounds": {
      "titulo": {
        "mp3": "titulo.mp3",
        "ogg": "titulo.ogg"
      },
      "instruccion": {
        "mp3": "instruccion.mp3",
        "ogg": "instruccion.ogg"
      }
    }
  },
  //Las escenas: cada elemento del array "code" es la configuración de una escena o pantalla
  "code": [{
    "size": { //Tamaño del área de actividad
      "w": 1000,
      "h": 560
    },
    "debug": true, //Este flag indica si estamos en modo debug. Si es true, el radio de render es 1 (no se ajusta)
    "menu_url": "../../index.html",
    "main_el": "main", //Fondo blanco
    "scene_el": "container", //Contenedor de actividades
    "main_back": null, //La imagen de fondo del escenario (de 1000 x 560)
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
    "type": 1, // 0:dNd, 1:click, 2:paint // En realidad, eso lo define la escena
    "buttons_visible": { //La configuracion de visiblidad de los botones para esta pantalla
      "btn_home": true,
      "btn_redo": false,
      "btn_back": true,
      "btn_next": false,
    },
    "elements": {
      
    },
    "resolution": {},
    "instruction": {
      "text": "Decora esta habitación para la fiesta de Halloween. Arrastra los adornos terroríficos y colócalos donde más te guste. Cuando hayas acabado, pulsa el botón.",
      "sound": "instruccion"
    }
  }],
};
