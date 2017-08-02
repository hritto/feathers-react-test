const common_config = {
  "menu_config": {
    "slider": {
      "size": {
        "w": 275,
        "h": 210
      },
      "pos": {
        "x": 0,
        "y": 0
      },
    },
    "botonera": {
      "buttons": {
        "visible": {
          "btn_home": false,
          "btn_redo": false,
          "btn_back": false,
          "btn_next": false,
        },
        "size": {
          "w": 51,
          "h": 54
        },
        "margin_bottom": 15
      },
      "size": {
        "w": 51,
        "h": 'auto'
      },
      "pos": {
        "x": -1,
        "y": 130
      },
    },
    "size": {
      "w": 275,
      "h": 210
    },
    "pos": {
      "x": 0,
      "y": -10
    },
    "collapsed_width": 75,
    "info_window": {
      "size": {
        "w": 1000,
        "h": 560
      }
    },
    "info_bubble": {
      "pos": {
        "x": 310,
        "y": 14
      },
      "size": {
        "w": 560,
        "h": "auto"
      },
      "padding": 40,
      "border_size": 4,
      "font_size": 24,
      "line_height": 36,
      "after": {
        "pos": {
          "x": -25,
          "y": 24
        },
        "border_top_width": 15,
        "border_right_width": 25,
        "border_bottom_width": 15,
        "border_left_width": 0
      },
      "before": {
        "pos": {
          "x": -32,
          "y": 21
        },
        "border_top_width": 19,
        "border_right_width": 29,
        "border_bottom_width": 19,
        "border_left_width": 0
      }
    },
    "rita_menu": {
      "size": {
        "w": 275,
        "h": 200
      },
      "pos": {
        "x": 0,
        "y": 0
      },
      "speaker": {
        "size": {
          "w": 40,
          "h": 40
        },
        "pos": {
          "x": 0,
          "y": 100
        },
        "right": 10
      },
      "arrow": {
        "size": {
          "w": 75,
          "h": 75
        },
        "pos": {
          "x": 0,
          "y": 7
        },
        "right": 0
      }
    }
  },
  "alerts": { //Los carteles de bien o mal
    "size": {
      "w": 408,
      "h": 434
    },
    "ok": [{
        "image":"../assets/images/activities/commons/rita_1.png",
        "size": {
          "w": 330,
          "h": 230
        },
        "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        "sound": "ok_1"
      },{
      "image":"../assets/images/activities/commons/rita_2.png",
      "size": {
        "w": 330,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      "sound": "ok_4"
    },{
      "image":"../assets/images/activities/commons/rita_3.png",
      "size": {
        "w": 330,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      "sound": "ok_3"
    },{
      "image":"../assets/images/activities/commons/rita_4.png",
      "size": {
        "w": 330,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
      "sound": "ok_4"
    }],
    "ko":[{
      "image":"../assets/images/activities/commons/mal_1.png",
      "size": {
        "w": 301,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "sound": "ko_1"
    },{
      "image":"../assets/images/activities/commons/mal_2.png",
      "size": {
        "w": 301,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      "sound": "ko_2"
    },{
      "image":"../assets/images/activities/commons/mal_3.png",
      "size": {
        "w": 301,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
      "sound": "ko_1"
    },{
      "image":"../assets/images/activities/commons/mal_4.png",
      "size": {
        "w": 301,
        "h": 230
      },
      "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
      "sound": "ko_3"
    }],
  },
};

export default common_config;
