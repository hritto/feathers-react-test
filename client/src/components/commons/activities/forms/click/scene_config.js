const scene_config_defaults = function(){

  const getSceneConfigStatic = () => {
    return {
      "size": {
        "w": 1000,
        "h": 560
      },
      "menu_url": "",
      "debug": true,
      "main_el": "main",
      "scene_el": "container",
      "main_back": null,
      "show_instruction": true,
      "init_config": {
        "show_intro": true,
        "background_image": null,
        "background_color": '#FFF',
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
      "end_config": {
        "size": {
          "w": 500,
          "h": 400
        },
        "show_end": false,
        "background_image": null,
        "elements": {},
      },
      "type": 0,
      "buttons_visible": {
        "btn_home": true,
        "btn_redo": false,
        "btn_back": false,
        "btn_next": false,
      },
      "elements_container": {
        size: {
            w: 950,
            h: 500
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      "elements": {},
      "timer": {
        "time": 500,
        "visible": false
      },
      "resolution": {},
      "instruction": {
        "text": "Instrucción...",
        "sound": null
      }
    };

  };

    const getSceneConfigClick = () => {
      return {
        "size": {
          "w": 1000,
          "h": 560
        },
        "debug": true,
        "menu_url": "../../index.html",
        "clase": "pantalla_1",
        "main_el": "main",
        "scene_el": "container",
        "main_back": null,
        "show_instruction": true,
        "init_config": {
          "show_intro": false,
          "background_image": null,
          "background_color": '#FFF',
          "size": {
            "w": 800,
            "h": 500
          },
          "elements": {},
        },
        "end_config": {
          "size": {
            "w": 500,
            "h": 400
          },
          "show_end": false,
          "background_image": null,
          "elements": {},
        },
        "type": 1,
        "multiple_answers": true,
        "animate_answers": true,
        "buttons_visible": {
          "btn_home": true,
          "btn_redo": false,
          "btn_back": false,
          "btn_next": false,
          "btn_info": false,
        },
        "elements_container": {
          size: {
              w: 950,
              h: 500
          },
          pos: {
            x: 0,
            y: 0
          }
        },
        "elements": {},
        "resolution": {},
        "instruction": {
          "text": "Intrucción Click...",
          "sound": null
        }
      };
  };

  return {
    getSceneConfigStatic: getSceneConfigStatic,
    getSceneConfigClick: getSceneConfigClick
  };
};

export default scene_config_defaults;
