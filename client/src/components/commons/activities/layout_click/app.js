import common_config from './common_config.js';
import Layout from './layout.js';
import Media from './media.js';
import scene_0 from './scene_0.js'; //Estatica
import scene_1 from './scene_1.js'; //Click
const Promise = require("bluebird");

// APP
const LayoutClickPreview = (opts, common_conf, s_index) => {
  'use strict';

  var config = opts;
  var common_config = common_conf;
  var layout = null;
  var media = null;
  var scene = null;
  var scenes = [];
  var current_scene = s_index; //Contador de pantallas
  var scenes_objs = [];
  var scene_config = null;
  var resizer = null; //El módulo que se encarga de calcular tamaños y posiciones

  var initialize = function () {
    setLoader();
    _.each(config.code, function (sc, i) {
      scenes.push(sc);
    });
    resizer = VivitBooks.Resizer;
    scene_config = config.code[current_scene];
    scene_config.debug = true;
    layout = new Layout(scene_config, common_config);
    resizer.init(scene_config).then(function () {
      layout.init(resizer).then(function () {
        loadMedia(config);
      });
    });
  };

  var setLoader = function () {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

    $(".loader_div > div").css({
      "top": (y / 2) - 40,
      "left": (x / 2) - 40,
    });

    $(".dial").knob({
      "min": 0,
      "max": 100,
      "fgColor": "rgb(232, 94, 2)",
      "skin": "tron",
      "width": 80,
      "height": 80
    });
  };

  var loadAssets = function (data) {
    var p = data;
    if (!data) {
      p = {
        progress: 0
      };
    }
    if (data && data.loaded < data.total) {
      renderProgress(p.progress);
    } else {
      setMedia(media);
      setTimeout(function () {
        initActivity();
      }, 1000);
    }
  };


  var loadMedia = function (opts) {
    var asset_dirs = "uploads/media/";
    media = new Media(opts);
    media.loadMedia(
      asset_dirs,
      opts.media,
      loadAssets //Callback para cada medio que se carga
    );
  };

  var renderProgress = function (p) {
    $('.dial').val(p).trigger('change');
  };

  var getMedia = function () {
    return media;
  };

  var setMedia = function (m) {
    media = m;
  };

  var initActivity = function () {
    var sc_config = scenes[current_scene];
    if (sc_config.type === 1) {
      scene = new scene_1;
    }
    if (sc_config.type === 0) {
      scene = new scene_0;
    }
    //Quitar el loader
    $(".loader_div > div").remove();
    $(".loader_div").css("opacity", 0);
    $(".loader_div").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
      // your event handler
      $(".loader_div").remove();
    });

    scene.initialize(sc_config, media, null, resizer, layout).then(function () {
      //Se ha terminado de renderizar la escena,
    });
  };

  var destroy = function (done) {
    return scene.destroy().then(function(){
      scene = null;
      debugger;
      media.promiseDestroy().then(function(){
        debugger;
        return true;
      });
    })
  };

  return {
    init: initialize,
    destroy: destroy,
    initActivity: initActivity,
    getMedia: getMedia,
  };
};

export default LayoutClickPreview;
