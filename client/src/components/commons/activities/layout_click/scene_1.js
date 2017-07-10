const Promise = require("bluebird");
const interact = require("interactjs");

const Scene_1 = () => {
  'use strict';

  var config = null;
  var el = null;
  var scene_el = null;
  var data = null;
  var scene = null;
  var el = null;
  var scene_el = '#container';
  var media;
  var intro;
  var containers_arr = [];
  var resolution = null;
  var lib = null; //la librería de audio
  var containers = [];
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var elements_layout = {};

  var initialize = function (options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    resizer = resizer_obj;

    resolution = res;
    layout = layout_obj;

    return render();
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

      ///Poner la clase correspondiente a la pantalla
      $('#container').removeClass();
      $('#container').addClass(config.clase);
      //Dibujar los contenedores
      return drawQuestion(config.elements).then(function () {
        //Dibujar los arrastrables
        return drawAnswers(config.elements);
      }).then(function () {
        return Promise.delay(100).then(function () {
          interact('.resize-drag')
            .draggable({
              onmove: window.dragMoveListener
            })
            .resizable({
              preserveAspectRatio: false,
              edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
              }
            })
            .on('resizemove', function (event) {
              var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

              // update the element's style
              target.style.width = event.rect.width + 'px';
              target.style.height = event.rect.height + 'px';

              if (!elements_layout[target.id]) {
                elements_layout[target.id] = {};
              }

              elements_layout[target.id].size = {
                w: event.rect.width,
                h: event.rect.height
              };

              console.log("element: " + target.id);
              console.log("x: " + x);
              console.log("y: " + y);
              console.log("w: " + event.rect.width);
              console.log("h: " + event.rect.height);
            });
          resolve();
        })
      });
    });
  };

  function dragMoveListener(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    $('#' + target.id).css('left', x + 'px');
    $('#' + target.id).css('top', y + 'px');

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    if (!elements_layout[target.id]) {
      elements_layout[target.id] = {};
    }

    elements_layout[target.id].pos = {
      x: x,
      y: y
    };
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

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

    var elem = "<div id='" + k + "' class='resize-drag drop-target drop-target" + index + "' data-x='" + resizer.getPosition(el.pos).x + "' data-y='" + resizer.getPosition(el.pos).y + "'></div>";
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
      "z-index": 12000
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
    if ($("#question") && $("#question").length) {
      drop_y = $("#question").position().top + $("#question").height();
      max_h = 550 - (drop_y - 20);
      min_h = max_h;
      compensa_h = (max_h - min_h) / 2;
      y = drop_y + compensa_h;
    } else {
      min_h = resizer.getSimpleSize(500);
      y = 10;
    }

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
    var elem = "<div id='" + k + "' class='resize-drag' data-x='" + resizer.getSimpleSize(pos[index].x) + "' data-y='" + resizer.getSimpleSize(pos[index].y) + "'></div>";
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
    return Promise.resolve(elements_layout);
  };

  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};

export default Scene_1;
