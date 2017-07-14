const Promise = require("bluebird");
const interact = require("interactjs");
import R from 'ramda';

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
      elements_layout = config.elements;
      //Dibujar el fondo, si tiene
      if (config.main_back) {
        var img = media.getImage(config.main_back);
        if(R.type(config.main_back) === 'Object'){
          img = media.getImage(config.main_back.image);
        }
        $("#" + config.scene_el).css({
          "background-image": "url(" + img.src + ")",
          "background-size": "contain",
          "background-position": "center center",
          "background-repeat": "no-repeat",
        });
      }

      ///Poner la clase correspondiente a la pantalla
      $('#container').removeClass();
      $('#container').empty();
      $('#container').addClass(config.clase);
      //Dibujar los contenedores
      return drawQuestion(elements_layout).then(function () {
        //Dibujar los arrastrables
        return drawAnswers(elements_layout);
      }).then(function () {
        return Promise.delay(100).then(function () {
          interact('.resize-drag')
            .draggable({
              onmove: window.dragMoveListener,
              onend: function (event) {
                recalculateLayout(event);
              }
            })
            .resizable({
              preserveAspectRatio: false,
              edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
              },
              onend: function (event) {
                recalculateLayout(event);
              }
            })
            .on('resizemove', function (event) {
              var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

              // update the element's style
              target.style.width = event.rect.width + 'px';
              target.style.height = event.rect.height + 'px';
              elements_layout[target.id].size = {
                w: event.rect.width,
                h: event.rect.height
              };
            });
          resolve();
        })
      });
    });
  };

  var recalculateLayout = function (event) {
    var target = event.target;
    if (target.id === 'question') {
      //Recalcular el tamaño del comtendor de clicks
      var question_height = $("#question").position().top + $("#question").height();
      var max_height_click_container = 550 - question_height;
      $("#drag-elements").css({
        "top": question_height + 20,
        "left": 0,
        "height": 550 - question_height - 40
      });
      //Ver si los elementos han quedado fuera del area de la actividad
      _.each(elements_layout, function (el, key) {
        if (el.type === 'question_model') {
          var img;
          var q_width = $('#question').width() - 40;
          var q_height = $('#question').height() - 20;
          var s;
          var img_name;
          // Ajustar la imagen al contenedor
          if (R.type(el.image) !== 'Object') {
            img = media.getImage(el.image);
            img_name = _.clone(el.image);
          } else {
            img = media.getImage(el.image.image);
            img_name = _.clone(el.image.image);
          }

          s = getImageSize(img.width, img.height, q_width, q_height);
          var image_size = {
            w: s.w,
            h: s.h,
          };
          var image_pos = {
            x: (q_width - image_size.w) / 2,
            y: (q_height - image_size.h) / 2,
          };
          el.image = {
            image: img_name,
            size: image_size,
            pos: image_pos
          }
          $('#question').css({
            "background-size": resizer.getSimpleSize(el.image.size.w) + "px " + resizer.getSimpleSize(el.image.size.h) + "px",
          });
        } else {
          if ($('#' + el.id).position().top > max_height_click_container - 20) {
            el.pos.y = max_height_click_container - 40;
            // update the position attributes
            document.getElementById(el.id).setAttribute('data-y', max_height_click_container - 40);
          }
        }
      });
    }
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
    var elem = "<div id='" + k + "' class='resize-drag drop-target drop-target" + index + "' data-x='" + resizer.getPosition(el.pos).x + "' data-y='" + resizer.getPosition(el.pos).y + "'></div>";
    var txt = "<div class='q_text'>" + el.text + "</div>";
    var img;
    var image_size;
    var image_pos;
    var q_width = $(container).width() - 40;
    var q_height = 60;
    var q_pos_x = 10;
    var q_pos_y = 10;
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
    }
    img = media.getImage(el.image.image);
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
      pos_dr = [],
      has_question = false;
    $('#container').append('<div id="drag-elements"></div>');
    var drags = [];
    _.each(els, function (value, key) {
      if (value.type === "clickable") {
        drags.push(value);
        pos_dr.push(value.pos);
      } else {
        has_question = true;
      }
    });

    //Calcular el espacio q nos queda para el contenedor de arrastrables
    if (has_question) {
      drop_y = $("#question").position().top + $("#question").height();
      max_h = 550 - (drop_y + 40);
      min_h = max_h;
      y = drop_y + 20;
    } else {
      min_h = resizer.getSimpleSize(500);
      y = 10;
    }

    //Posicionar el contenedor de elementos arrastrables en el sitio q nos queda
    $("#drag-elements").css({
      "height": min_h,
      "width": "98%", //resizer.getSceneConfig().size.w,
      "top": y,
      "left": 0, //$("#drop-target-1").position().left
      "border": "1px solid red"
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
    var elem = "<div id='" + k + "' class='resize-drag' data-x='" + resizer.getSimpleSize(pos[index].x) + "' data-y='" + resizer.getSimpleSize(pos[index].y) + "'></div>";
    $(container).append(elem);
    $('#' + k).css({
      "width": resizer.getSize(el.size).w,
      "height": resizer.getSize(el.size).h,
      "background-image": "url(" + media.getImage(el.image).src + ")",
      "background-size": "contain",
      "background-position": "center center",
      "left": resizer.getSimpleSize(pos[index].x) + "px",
      "top": resizer.getSimpleSize(pos[index].y) + "px",
      "border": "1px solid red"
    });

  };

  var destroy = function () {
    interact('.resize-drag').unset();
    return new Promise(function (resolve, reject) {
      $('#container').empty();
      return resolve(elements_layout);
    });
  };

  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};

export default Scene_1;
