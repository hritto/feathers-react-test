const Promise = require("bluebird");

const Scene_1 = () => {
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
  var resolved_elements = [];
  var multiple_answers = null; //Si hay más de una respuesta por pantalla
  var animate_answers = null; //Si las respustas se animan (OK o KO)
  var menu_signals = {
    open: null,
    close: null
  };
  var auto_play_sound = null;

  var initialize = function (options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    res_config = res;
    resizer = resizer_obj;

    resolution = res;
    layout = layout_obj;
    multiple_answers = config.multiple_answers;
    animate_answers = config.animate_answers;


    return render().then(function () {
      // Crear la escena
      return Promise.resolve();
    });
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
      //menu.startButtonsEvents(active_buttons);
      //Poner la clase correspondiente a la pantalla
      $('#container').removeClass();
      $('#container').addClass(config.clase);
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

  var drawQuestionElement = function (el, k, total, container, index) {

    var elem = "<div id='" + k + "' class='drop-target drop-target" + index + "'></div>";
    var txt = "<div class='q_text'>" + el.text + "</div>";
    var img = media.getImage(el.image.image);
    $(container).append(elem);
    if (el.text) {
      $("#" + k).append(txt);
    }

    $('#' + k).css({
      "background-image": "url(" + img.src + ")",
      "background-size": resizer.getSimpleSize(el.image.size.w) + "px " + resizer.getSimpleSize(el.image.size.h) + "px",
      "background-position": "center",
      "background-repeat": "no-repeat",
      "left": resizer.getPosition(el.pos).x + "px",
      "top": resizer.getPosition(el.pos).y + "px",
      "width": resizer.getSize(el.size).w + "px",
      "height": resizer.getSize(el.size).h + "px",
      "vertical-align": "middle",
    });

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
  };


  var drawAnswers = function (els) {
    var y = 0,
      min_h = 0,
      max_h = 0,
      drop_y = 0,
      compensa_h = 0,
      pos_dr = [];
    $('#container').append('<div id="drag-elements"></div>');
    var drags = [];
    _.each(els, function (value, key) {
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
    return new Promise(function (resolve, reject) {
      _.each(drags, function (value, key) {
        drawAnswerElement(value, value.id, drags.length, c, key, pos_dr);
      });
      resolve();
    });
  };

  var drawAnswerElement = function (el, k, total, container, index, pos) {
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
