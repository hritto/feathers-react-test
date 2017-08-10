NS('AnayaInfantil');

AnayaInfantil.Scene_4 = function() {
  'use strict';

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


  var initialize = function(options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    res_config = res;
    resizer = resizer_obj;

    resolution = res;
    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = AnayaInfantil.app.getMenu();

    return render().then(function() {
      // Crear la escena
      return promiseShowIntroScene().then(function() {
        //Se ha terminado de renderizar la escena
        //Abrir el menu
        if(config.show_instruction){
          menu.open();
        }
        return Promise.resolve();
      })
    });
  };

  var promiseShowIntroScene = function() {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var init_options;
    if (!menu.getAudioEnabled() && config.show_instruction && is_mobile() && config.init_config.show_intro) { //La ventana inicial solo se muestra en dispositivos móviles
      //Hay que mostrar la pantalla inicial
      init_options = config.init_config;
      intro_object = new AnayaInfantil.introWindow(media, lib, resizer);

      return new Promise(function(resolve, reject) {
        intro_object.init(init_options).then(function() {
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

  var get = function(id) {
    return document.getElementById(id);
  };

  // Funcion que renderiza la escena, despues de cargar las imagenes
  var render = function() {

    //dibujar la escena
    return new Promise(function(resolve, reject) {
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
      _.each(config.buttons_visible, function(value, key) {
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
      return drawQuestion(config.elements).then(function() {
        //Dibujar los arrastrables
        return drawAnswers(config.elements);
      }).then(function() {
        return Promise.delay(100).then(function() {
          resolve();
        })
      });
    });
  };

  //RESOLUCIÓN
  var checkClick = function(e) {
    //Controlar que en cada contenedor haya la cantidad correcta de elementos
    //En este caso basta contarlos, puesto que no es posible poner elementos equivocados en el contenedor
    var ok = false;
    var c = get(e.target.id);
    $('#screenBlocker').css('display', 'block');
    if (resolution[e.target.id]) {
      ok = true;
      //Todo OK, mostrar el check
      $('#' + e.target.id).append("<div class='check_ok'></div>");
      $('#' + e.target.id).append("<div class='respuesta_txt' id='"+e.target.id+"_r'></div>");
      $('#' + e.target.id + "_r").css({
        "height": resizer.getSimpleSize(90) + "px",
      });
      //mostrar la señal
      $('.check_ok').css({
        "width": resizer.getSimpleSize(60) + "px",
        "height": resizer.getSimpleSize(60) + "px",
        "top": resizer.getSimpleSize(-10) + "px",
        "right": resizer.getSimpleSize(-10) + "px"
      });

      $('#' + e.target.id).animateCss('bounce');
      lib.play(e.target.id + "_r"); //Hacer sonar la respuesta

      return Promise.delay(2000).then(function() {
        promiseEndOk();
      });
    } else {
      //Error
      $('#' + e.target.id).animateCss("shake");
      error_counter++;
      if (error_counter < 3) {
        lib.play("fail");
        return Promise.delay(2000).then(function() {
          $('#screenBlocker').css('display', 'none');
        });
      } else {
        error_counter = 0;
        //Mostrar cartel
        lib.play("fail");
        return promiseShowResults('signal_ko').then(function() {
          return Promise.resolve();
        });
      }
    }
  };

  var drawQuestion = function(els) {
    var container = document.getElementById('container');
    _.each(els, function(value, key) {
      if (value.type === "question_model") {
        containers.push(value);
      }
    });

    return new Promise(function(resolve, reject) {
      _.each(containers, function(value, key) {
        drawQuestionElement(value, value.id, containers.length, container, key);
      });
      resolve();
    });
  };

  var drawQuestionElement = function(el, k, total, container, index) {
    var elem = "<div id='" + k + "' class='drop-target drop-target" + index + "'><div class='q_text'>" + el.text + "</div></div>";
    var img = media.getImage(el.image);
    $(container).append(elem);

    $('#' + k).css({
      "background-image": "url(" + img.src + ")",
      "background-size": resizer.getSimpleSize(82) + "px",
      "background-position": "right bottom",
      "background-repeat": "no-repeat",
      "left": resizer.getPosition(el.pos).x + "px",
      "top": resizer.getPosition(el.pos).y + "px",
      "width": resizer.getSize(el.size).w + "px",
      "height": resizer.getSize(el.size).h + "px",
      "vertical-align": "middle",
    });

    $('.q_text').css({
      "width": "96%",
      "height": "auto",
      "text-align": "center",
      "font-size": resizer.getSimpleSize(32) + "px",
      "line-height": resizer.getSimpleSize(62) + "px",
      "vertical-align": "middle",
      "font-weight": "bold",
      "margin-top": resizer.getSimpleSize(el.text_margin_top) + "px"
    });

    $('#question').on('click', function() {
      playQuestion(el.sound);
    });
  };

  var playQuestion = function(sound) {
    $('#question').off('click');
    $('#screenBlocker').css('display', 'block');
    lib.play(sound);
    signals.end = lib.on.end.add(_.bind(onEndSound));
  };

  var onEndSound = function(data) {
    signals.end.detach();
    $('#screenBlocker').css('display', 'none');
    $('#question').on('click', function() {
      playQuestion(data.id);
    });
  };

  var drawAnswers = function(els) {
    var y = 0,
      min_h = 0,
      max_h = 0,
      drop_y = 0,
      compensa_h = 0,
      pos_dr = [];
    $('#container').append('<div id="drag-elements"></div>');
    var drags = [];
    _.each(els, function(value, key) {
      if (value.type === "clickable") {
        drags.push(value);
        pos_dr.push(value.pos);
      }
    });

    //Calcular el espacio q nos queda para el contenedor de arrastrables
    drop_y = $("#question").position().top + $("#question").height();
    max_h = resizer.getActivitySceneConfig().size.h - (drop_y - 20);
    min_h = resizer.getSize(drags[0].size).h + 10;
    compensa_h = (max_h - min_h) / 2;
    y = drop_y + compensa_h;

    //Posicionar el contenedor de elementos arrastrables en el sitio q nos queda
    $("#drag-elements").css({
      "height": min_h,
      "width": "98%", //resizer.getSceneConfig().size.w,
      "top": y,
      "left": 0 //$("#drop-target-1").position().left
    });
    pos_dr = _.shuffle(pos_dr);
    var c = document.getElementById('drag-elements');
    return new Promise(function(resolve, reject) {
      _.each(drags, function(value, key) {
        drawAnswerElement(value, value.id, drags.length, c, key, pos_dr);
      });
      resolve();
    });
  };

  var drawAnswerElement = function(el, k, total, container, index, pos) {
    var elem_width = resizer.getSize(el.size).w;
    var elem = "<div id='" + k + "'></div>";
    $(container).append(elem);
    $('#' + k).css({
      "width": elem_width,
      "height": elem_width,
      "background-image": "url(" + media.getImage(el.image).src + ")",
      "background-size": "contain",
      "left": resizer.getSimpleSize(pos[index].x) + "px",
      "top": resizer.getSimpleSize(pos[index].y) + "px",
    });
    $('#' + k).on('click', checkClick);

  };

  var promiseEndOk = function(elem) {
    return new Promise(function(resolve, reject) {
      Promise.delay(100).then(function() {
        return promiseShowResults('signal_ok').then(function() {
          return Promise.delay(1000).then(function() {
            return showEndActivity();
          });
        });
      });
    });
  };

  var promiseShowResults = function(elem) {
    var audio = menu.getAudioOk();
    var animation = 'ok';
    var animation_elem = '#animation_ok';

    if (elem === 'signal_ko') {
      audio = menu.getAudioKo();
      animation = 'ko'
      animation_elem = '#animation_ko';
    }
    return new Promise(function(resolve, reject) {
      // Hay que mostrar la ventana de evaluacion
      $('#screenBlocker').css('display', 'block');
      $('#' + elem).css({
        'display': 'block'
      });
      $('#' + elem).animateCss('bounceInDown');
      $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('#' + elem).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        lib.play(audio);
        $(animation_elem).animateSprite('play', animation);
        $(animation_elem).animateSprite('restart');

        return Promise.delay(3000).then(function() {
          $('#' + elem).removeClass();
          $(animation_elem).animateSprite('frame', 1);
          $('#' + elem).animateCss('fadeOutUp');
          $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
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


  var showEndActivity = function() {
    // Marcar el fin de la actividad
    end = true;

    return destroy().then(function() {
      return promiseShowEndScene().then(function() {
        //Avisar a la aplicación que se ha acabado la actividad
        AnayaInfantil.app.endActivity();
      });
    });
  };


  var promiseShowEndScene = function() {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var end_options, end_object;
    if (config.end_config && config.end_config.show_end) {
      //Hay que mostrar la pantalla FINAL
      end_options = config.end_config;
      end_object = new AnayaInfantil.endWindow(media, lib, resizer);
      return new Promise(function(resolve, reject) {
        end_object.init(end_options).then(function() {
          end_object.destroy();
          end_object = null;
          return resolve();
        })
      });
    } else {
      return Promise.resolve();
    }

  };

  var is_mobile = function() {
    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
    for (var i in agents) {
      if (navigator.userAgent.toLowerCase().search(agents[i]) > 0) {
        return true;
      }
    }
    return false;
  };

  var destroy = function() {
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
