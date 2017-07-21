const scene_config = function(){

  const getSceneConfig = () => {
    return {
      "size": { //Tamaño del área de actividad
        "w": 1000,
        "h": 560
      },
      "menu_url": "../../index.html",
      "clase": "pantalla_0",
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
                "w": 400,
                "h": 320
              },
              "pos": {
                "x": 50,
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
        "text": "Hacemos algo en equipo. Empiezan con A.",
        "sound": "titulo0"
      }
    };

  return {
    getSceneConfig: getSceneConfig,
  }
}

export default scene_config;
