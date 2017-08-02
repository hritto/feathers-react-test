import * as _signals from 'signals';
import endWindow from './end_window.js';
import introWindow from './intro_window.js';
import R from 'ramda';

const Scene_1 = function () {

  var config = null;
  var el = null;
  var scene_el = null;
  var data = null;
  var scene = null;
  var end_drag = false;

  var self = this;
  var el = null;
  var end = false;
  var scene_el = '#container';
  var media;
  var intro;
  var containers_arr = [];
  var resolution = null;
  var lib = null; //la librería de audio
  //Contador de errores
  var error_counter = 0;
  var res_config = null;
  var containers = [];
  var resizer = null;
  var drop_containers_ids = [];
  var layout = null; //El objeto encargado del layout
  var menu = null;
  var intro_object = null;
  var end_object = null;
  var active_buttons = [];
  //Array de elementos ya resueltos en esta pantalla, si hay más de uno
  var resolved_elements = [];
  var multiple_answers = null; //Si hay más de una respuesta por pantalla

  var animate_answers = null; //Si las respustas se animan (OK o KO)
  var endActivityCallback = null;

  var initialize = function (options, med, res, resizer_obj, layout_obj, _menu, endActivity) {

    config = options;
    media = med;
    res_config = res;
    resizer = resizer_obj;
    endActivityCallback = endActivity;

    resolution = res;
    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = _menu;
    multiple_answers = config.multiple_answers;
    animate_answers = config.animate_answers;


    return render().then(function () {
      // Crear la escena
      return promiseShowIntroScene().then(function () {
        //Se ha terminado de renderizar la escena
        //Abrir el menu
        if (config.show_instruction) {
          menu.open();
        }
        return Promise.resolve();
      })
    });
  };

  var promiseShowIntroScene = function () {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var init_options;
    if (!menu.getAudioEnabled() && config.show_instruction && is_mobile() && config.init_config.show_intro) { //La ventana inicial solo se muestra en dispositivos móviles
      //Hay que mostrar la pantalla inicial
      init_options = config.init_config;
      intro_object = new introWindow(media, lib, resizer);

      return new Promise(function (resolve, reject) {
        intro_object.init(init_options).then(function () {
          //Ya se puede activar el audio
          menu.setAudioEnabled(true);
          intro_object.destroy();
          intro_object = null;
          return resolve();
        })
      });
    } else {
      return Promise.resolve();
    }
  };

  var get = function (id) {
    return document.getElementById(id);
  };

  // Funcion que renderiza la escena, despues de cargar las imagenes
  var render = function () {

    //dibujar la escena
    return new Promise(function (resolve, reject) {
      //Dibujar el fondo, si tiene
      if (config.main_back) {
        var img = media.getImage(config.main_back);
        $("#" + config.scene_el).css({
          "background-image": "url(" + img.src + ")",
          "background-size": "contain",
          "background-position": "center center",
          "background-repeat": "no-repeat",
        });
      }

      //Ver si necesita botones visibles
      _.each(config.buttons_visible, function (value, key) {
        $('#' + key).css({
          "display": value ? "block" : "none"
        });
        if (value) {
          active_buttons.push(key);
        }
      });
      //iniciar los eventos de los botones visibles
      menu.startButtonsEvents(active_buttons);

      //Dibujar los contenedores
      return drawQuestion(config.elements).then(function () {
        //Dibujar los arrastrables
        return drawAnswers(config.elements);
      }).then(function () {
        return Promise.delay(100).then(function () {
          resolve();
        })
      });
    });
  };

  var getSound = function (id) {
    var s = _.find(config.elements, function (value, key) {
      return value.id === id;
    })
    if (s && s.sound) {
      return s.sound;
    }
    return false;
  };

  //RESOLUCIÓN
  var checkClick = function (e) {
    //Controlar que en cada contenedor haya la cantidad correcta de elementos
    //En este caso basta contarlos, puesto que no es posible poner elementos equivocados en el contenedor
    var ok = false;
    var c = get(e.target.id);
    var sound;
    var timer = 500;
    $('#screenBlocker').css('display', 'block');
    if (resolution[e.target.id]) {
      ok = true;
      resolved_elements.push(e.target.id);
      //Todo OK, mostrar el check
      $('#' + e.target.id).append("<div class='check_ok'></div>");
      //mostrar la señal
      $('.check_ok').css({
        "width": resizer.getSimpleSize(60) + "px",
        "height": resizer.getSimpleSize(60) + "px",
        "top": resizer.getSimpleSize(-10) + "px",
        "right": resizer.getSimpleSize(-10) + "px"
      });
      if (animate_answers) {
        $('#' + e.target.id).animateCss('bounce');
      }

      sound = getSound(e.target.id);
      if (sound) { //Si la respuesta tiene un sonido especial
        lib.play(sound); //Hacer sonar la respuesta
      } else { //Hacer sonar el sonido de OK por defecto
        lib.play("success");
      }
      return Promise.delay(2000).then(function () {
        //Si hay varias respuestas, ver si ya se han respondido todas las necesarias
        if (multiple_answers) {
          if (checkResolutionCompete()) {
            promiseEndOk();
          } else {
            $('#screenBlocker').css('display', 'none');
          }
        } else {
          promiseEndOk();
        }
      });
    } else {
      //Error
      if (animate_answers) {
        $('#' + e.target.id).animateCss("shake");
      }
      error_counter++;
      if (error_counter < 3) {
        lib.play("fail");
        return Promise.delay(2000).then(function () {
          $('#screenBlocker').css('display', 'none');
        });
      } else {
        error_counter = 0;
        //Mostrar cartel
        lib.play("fail");
        return promiseShowResults('signal_ko').then(function () {
          return Promise.resolve();
        });
      }
    }
  };

  var checkResolutionCompete = function () {
    var els_ok = [];
    _.each(resolution, function (val, key) {
      if (val) {
        els_ok.push(key);
      }
    });
    if (els_ok.length === resolved_elements.length) {
      return true;
    }
    return false;
  }

  var drawQuestion = function (els) {
    var container = document.getElementById('container');
    _.each(els, function (value, key) {
      if (value.type === "question_model") {
        containers.push(value);
      }
    });

    return new Promise(function (resolve, reject) {
      _.each(containers, function (value, key) {
        drawQuestionElement(value, value.id, containers.length, container, key);
      });
      resolve();
    });
  };

  var getImageSize = function (iwidth, iheight, q_width, q_height) {
    var config = {
      w: null,
      h: null
    };

    var ratio = q_height / iheight;

    // if (iheight > q_height) {
    config.h = iheight * ratio;
    config.w = iwidth * ratio;
    // }
    return config;
  };

  var drawQuestionElement = function (el, k, total, container, index) {

    var elem = "<div id='" + k + "' class='drop-target drop-target" + index + "'></div>";
    var img;
    var image_size;
    var image_pos;
    var q_width = resizer.getSimpleSize(el.size.w);
    var q_height = resizer.getSimpleSize(el.size.h);
    var q_pos_x = resizer.getSimpleSize(el.pos.x);
    var q_pos_y = resizer.getSimpleSize(el.pos.y);
    var s;

    if (R.type(el.image) !== 'Object') {
      // Ajustar la imagen al contenedor
      img = media.getImage(el.image);
      s = getImageSize(img.width, img.height, q_width, q_height);
      image_size = {
        w: s.w,
        h: s.h,
      };
      image_pos = {
        x: (q_width - image_size.w) / 2,
        y: (q_height - image_size.h) / 2,
      };
      el.image = {
        image: el.image,
        size: image_size,
        pos: image_pos
      }
    } else {
      img = media.getImage(el.image.image);
    }

    $(container).append(elem);

    $('#' + k).css({
      "background-image": "url(" + img.src + ")",
      // "background-size": resizer.getSimpleSize(el.image.size.w) + "px " + resizer.getSimpleSize(el.image.size.h) + "px",
      "background-size": 'contain',
      "background-position": "center",
      "background-repeat": "no-repeat",
      "left": resizer.getPosition(el.pos).x + "px",
      "top": resizer.getPosition(el.pos).y + "px",
      "width": resizer.getSize(el.size).w + "px",
      "height": resizer.getSize(el.size).h + "px",
      "vertical-align": "middle",
      "z-index": 12000,
      "cursor": "pointer"
    });
    //Si tiene texto
    if (el.text) {
      var txt = "<div class='q_text'>" + el.text + "</div>";
      $("#" + k).append(txt);
      $('.q_text').css({
        // modificado para contener solo una letra
        "width": "75%",
        "height": "auto",
        "text-align": "center",
        // modificado en diciembre
        "font-size": resizer.getSimpleSize(65) + "px",
        "line-height": resizer.getSimpleSize(70) + "px",
        "vertical-align": "middle",
        "font-weight": "bold",
        "margin-top": resizer.getSimpleSize(el.text_margin_top) + "px"
      });
    }

    $('#question').on('click', function () {
      playQuestion(el.sound);
    });
  };

  var playQuestion = function (sound) {
    $('#question').off('click');
    $('#screenBlocker').css('display', 'block');
    lib.play(sound);
    _signals.end = lib.on.end.add(_.bind(onEndSound));
  };

  var onEndSound = function (data) {
    _signals.end.detach();
    $('#screenBlocker').css('display', 'none');
    $('#question').on('click', function () {
      playQuestion(data.id);
    });
  };

  var drawAnswers = function (els) {
    var y = 0,
      min_h = 0,
      max_h = 0,
      drop_y = 0,
      compensa_h = 0,
      pos_dr = [],
      has_question = false;
    if (!$('#drag-elements') || !$('#drag-elements').length) {
      $('#container').append('<div id="drag-elements"></div>');
    }
    var drags = [];
    _.each(els, function (value, key) {
      if (value.type === "clickable") {
        drags.push(value);
        pos_dr.push(value.pos);
      } else {
        has_question = true;
      }
    });

    $("#drag-elements").css({
      "height": resizer.getSimpleSize(config.elements_container.size.h),
      "width": resizer.getSimpleSize(config.elements_container.size.w),
      "top": resizer.getSimpleSize(config.elements_container.pos.y),
      "left": resizer.getSimpleSize(config.elements_container.pos.x),
    });
    //pos_dr = _.shuffle(pos_dr);
    var c = document.getElementById('drag-elements');
    return new Promise(function (resolve, reject) {
      _.each(drags, function (value, key) {
        drawAnswerElement(value, value.id, drags.length, c, key, pos_dr);
      });
      resolve();
    });
  };

  var drawAnswerElement = function (el, k, total, container, index, pos) {
    $(container).append("<div id='" + k + "'></div>");
    $('#' + k).css({
      "width": resizer.getSize(el.size).w,
      "height": resizer.getSize(el.size).h,
      "background-image": "url(" + media.getImage(el.image).src + ")",
      "background-size": "contain",
      "background-position": "center center",
      "left": resizer.getSimpleSize(pos[index].x) + "px",
      "top": resizer.getSimpleSize(pos[index].y) + "px",
      "cursor": "pointer"
    });
    $('#' + k).on('click', checkClick);
  };

  var promiseEndOk = function (elem) {
    return new Promise(function (resolve, reject) {
      Promise.delay(100).then(function () {
        return promiseShowResults('signal_ok').then(function () {
          return Promise.delay(1000).then(function () {
            return showEndActivity();
          });
        });
      });
    });
  };

  var promiseShowResults = function (elem) {
    var audio = menu.getAudioOk();
    var animation = 'ok';
    var animation_elem = '#animation_ok';

    if (elem === 'signal_ko') {
      audio = menu.getAudioKo();
      animation = 'ko'
      animation_elem = '#animation_ko';
    }
    return new Promise(function (resolve, reject) {
      // Hay que mostrar la ventana de evaluacion
      $('#screenBlocker').css('display', 'block');
      $('#' + elem).css({
        'display': 'block'
      });
      $('#' + elem).animateCss('bounceInDown');
      $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $('#' + elem).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        lib.play(audio);
        $(animation_elem).animateSprite('play', animation);
        $(animation_elem).animateSprite('restart');

        return Promise.delay(3000).then(function () {
          $('#' + elem).removeClass();
          $(animation_elem).animateSprite('frame', 1);
          $('#' + elem).animateCss('fadeOutUp');
          $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('#' + elem).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            $('#' + elem).css('display', 'none');


            $('#screenBlocker').css('display', 'none');
            //Preparar la siguiente animación del sprite para el tipo correspondiente (ok o ko)
            menu.setAlertsSprites(animation);
            return resolve();
          });
        });

      });
    });
  };


  var showEndActivity = function () {
    // Marcar el fin de la actividad
    end = true;

    return destroy().then(function () {
      return promiseShowEndScene().then(function () {
        //Avisar a la aplicación que se ha acabado la actividad
        endActivityCallback();
      });
    });
  };


  var promiseShowEndScene = function () {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var end_options, end_object;
    if (config.end_config && config.end_config.show_end) {
      //Hay que mostrar la pantalla FINAL
      end_options = config.end_config;
      end_object = new endWindow(media, lib, resizer);
      return new Promise(function (resolve, reject) {
        end_object.init(end_options).then(function () {
          end_object.destroy();
          end_object = null;
          return resolve();
        })
      });
    } else {
      return Promise.resolve();
    }

  };

  var is_mobile = function () {
    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
    for (var i in agents) {
      if (navigator.userAgent.toLowerCase().search(agents[i]) > 0) {
        return true;
      }
    }
    return false;
  };

  var destroy = function () {
    $('#container').empty();
    resolution = null;
    return Promise.resolve();
  };


  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};
export default Scene_1;
