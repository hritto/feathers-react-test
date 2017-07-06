var VivitBooks = VivitBooks || {};

VivitBooks.Resizer = (function () {
  'use strict';


  //Los datos de la escena, con los datos en pixels
  var options = null;
  //Aquí se guardan los datos reales q dependen del dispositivo
  var config = {
    bounds: { //El tamaño del viewport
      w: 0,
      h: 0
    },
    ratio: 0,
    scene: { //El rectángulo blanco
      size: {
        w: 0,
        h: 0,
      },
      pos: {
        x: 0,
        y: 0
      }
    },
    activity_scene: { //El área donde se pinta la actividad
      size: {
        w: 0,
        h: 0,
      },
      pos: {
        x: 0,
        y: 0
      }
    }
  };

  var initialize = function (opts) {

    options = opts;
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

    var ratio_y, ratio_x;

    return new Promise(function (resolve, reject) {
      //Iniciar la canfiguración
      config.bounds.w = Math.min(x, 1200);
      config.bounds.h = Math.min(x, 550);
      ratio_y = config.bounds.h / (options.size.h + 50);
      ratio_x = config.bounds.w / (options.size.w + 50);
      if (options.debug) {
        config.ratio = 1; //calculate ratio
      } else {
        config.ratio = Math.min(ratio_y, ratio_x); //calculate ratio
      }


      config.scene.size.w = config.bounds.w - 20;
      config.scene.size.h = config.bounds.h - 20;
      config.scene.pos.x = 10;
      config.scene.pos.y = 10;

      config.activity_scene.size = getSize({
        w: parseInt(options.size.w, 10) - 50, //los márgenes del main + la posición del main + 10 de margen
        h: parseInt(options.size.h, 10) - 50
      });

      config.activity_scene.pos.x = ((config.bounds.w - config.activity_scene.size.w) / 2);
      config.activity_scene.pos.y = ((config.bounds.h - config.activity_scene.size.h) / 2);

      return resolve();
    });
  };

  var getOriginActivityPoint = function () {
    return {
      x: config.activity_scene.pos.x + 10,
      y: config.activity_scene.pos.y + 10
    }
  };

  var getOriginMainPoint = function () {
    return {
      x: config.activity_scene.pos.x + 10,
      y: config.activity_scene.pos.y + 10
    }
  };

  var getSize = function (elem_size) { // recibe {w: n, h: n}
    return {
      w: elem_size.w * config.ratio,
      h: elem_size.h * config.ratio,
    };
  };

  var getSimpleSize = function (size) { // recibe {w: n, h: n}
    return size * config.ratio;
  };

  var getPosition = function (elem_pos) { // recibe {x: n, y: n}
    return {
      x: (elem_pos.x * config.ratio),
      y: (elem_pos.y * config.ratio),
    };
  };

  var getSceneConfig = function () {
    return config.scene;
  };

  var getActivitySceneConfig = function () {
    return config.activity_scene;
  };

  var getOuterBounds = function () {
    return config.bounds;
  };

  return {
    getSize: getSize,
    getPosition: getPosition,
    init: initialize,
    getOuterBounds: getOuterBounds,
    getSceneConfig: getSceneConfig,
    getActivitySceneConfig: getActivitySceneConfig,
    getOriginActivityPoint: getOriginActivityPoint,
    getSimpleSize: getSimpleSize
  };

})();
