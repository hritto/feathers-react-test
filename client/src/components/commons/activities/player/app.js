import Layout from './layout.js';
import Media from './media.js';
import Menu from './menu.js';
import endWindow from './end_window.js';
import introWindow from './intro_window.js';
import Scene_0 from './scene_0.js'; //Estatica
import Scene_1 from './scene_1.js'; //Click
const Promise = require("bluebird");

const Player = (opts, common_conf) => {

  var self = this;
  var config = opts;
  var common_config = common_conf;
  var layout = null;
  var media = null;
  var scene = null;
  var scenes = [];
  var current_scene = 0; //Contador de pantallas
  var current_resolution = null;
  var scenes_objs = [];
  var scene_config = null;
  var resizer = null; //El módulo que se encarga de calcular tamaños y posiciones
  var instruction = null;
  var menu = null;
  var ok_index = _.sample([0, 1, 2, 3]);
  var ko_index = _.sample([0, 1, 2, 3]);
  if (ko_index === 3) {
    ko_index = 0;
    ok_index = 0;
  }


  var initialize = function () {
    setLoader();
    _.each(config.code, function (sc, i) {
      scenes.push(sc);
    });
    resizer = VivitBooks.Resizer;
    scene_config = config.code[current_scene];
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
      initActivity();
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

  var reloadActivity = function () {
    return new Promise(function (resolve, reject) {
      scene.destroy().then(function () {
        initActivity();
        resolve();
      });
    });
  };

  var initNextActivity = function () {
    current_scene++;
    if (current_scene === scenes.length) {
      //Ya no quedan pantallas
      endAllActivities();
      return;
    }

    return new Promise(function (resolve, reject) {
      scene.destroy().then(function () {
        initActivity();
        resolve();
      });
    });
  };

  var initPrevActivity = function () {
    current_scene--;
    if (current_scene < 0) {
      //Ya no quedan pantallas
      //Redirigir donde indica la configuración
      window.location = scenes[0].menu_url;
    }

    return new Promise(function (resolve, reject) {
      scene.destroy().then(function () {
        initActivity();
        resolve();
      });
    });
  };

  var initActivity = function () {
    var sc_config = scenes[current_scene];
    if (menu) {
      //Reiniciar el menú
      ok_index = menu.getOkIndex();
      ko_index = menu.getKoIndex();
      menu.destroy();
      menu = null;
    }
    menu = new Menu(
      common_config.menu_config,
      resizer,
      scene_config.instruction,
      common_config.alerts,
      common_config,
      scene_config,
      ok_index,
      ko_index,
      initPrevActivity,
      endAllActivities,
      reloadActivity,
      initNextActivity
    );
    menu.init();
    menu.setMedia(media);

    if (sc_config.type === 0) {
      scene = new Scene_0();
    }
    if (sc_config.type === 1) {
      scene = new Scene_1();
    }
    current_resolution = sc_config.resolution;
    menu.setInstruction(sc_config.instruction);
    //Quitar el loader
    $(".loader_div > div").remove();
    $(".loader_div").css("opacity", 0);
    $(".loader_div").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
      // your event handler
      $(".loader_div").remove();
    });

    scene.initialize(sc_config, media, current_resolution, resizer, layout, menu, endActivity).then(function () {
      //Se ha terminado de renderizar la escena,
    });
  };

  var endActivity = function () {
    scene = null;
    current_scene++;
    //Si se han acabado las pantallas
    if (current_scene === scenes.length) {
      endAllActivities();
    } else {
      initActivity();
    }
  };

  var endAllActivities = function () {
    console.log("terminadas todas");
    //Redirigir donde indica la configuración
    // Esto... ???????
    // window.location = scenes[0].menu_url;
    alert("Actividad Terminada");
  };

  var getMenu = function () {
    return menu;
  };

  var destroy = function (done) {

  };

  return {
    init: initialize,
    destroy: destroy,
    initActivity: initActivity,
    endActivity: endActivity,
    endAllActivities: endAllActivities,
    getMedia: getMedia,
    reloadActivity: reloadActivity,
    initNextActivity: initNextActivity,
    initPrevActivity: initPrevActivity,
    getMenu: getMenu
  };
};

export default Player;
