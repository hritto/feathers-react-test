const Promise = require("bluebird");
const interact = require("interactjs");
import R from 'ramda';
import * as Positioning from '../../positioning_helper.js';

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
  var lib = null; //la librería de audio
  var containers = [];
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var elements_layout = {};

  var initialize = function (options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    resizer = resizer_obj;
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
          setAnswersInteractions();
          setQuestionInteractions();
          resolve();
        })
      });
    });
  };

  var setQuestionInteractions = function(){
    var question = R.filter(R.propEq('type', 'question_model'))(config.elements);
    var question_layout, question_position;
    if(!question || R.isEmpty(question)){
      return;
    }
    var edges = questionEdges(question);
    var enabled = getQuestionDragEnable(question);
    interact('.question-resize-drag')
      .draggable({
        enabled: enabled,
        onmove: window.dragMoveListener,
        onend: function (event) {
          recalculateLayout(event);
        }
      })
      .resizable({
        preserveAspectRatio: false,
        edges: edges,
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
  };

  var getQuestionDragEnable = function(question){
    if(question.layout_type === 'other'){
      return true;
    }
    return false;
  };

  var questionEdges = function(question){
    var edges = {
      left: true,
      right: true,
      bottom: true,
      top: true
    };
    if(question && !R.isEmpty(question)){
      var question_layout = question.layout_type;
      var question_position = question.layout_position;
      if (!question_layout || question_layout === 'landscape'){
        edges.left = false;
        edges.right = false;
        if(!question_position || question_position === 'up'){
          edges.top = false;
        }
        if(question_position === 'down'){
          edges.bottom = false;
        }
      }
      if (question_layout === 'portrait'){
        edges.top = false;
        edges.bottom = false;
        if(!question_position || question_position === 'left'){
          edges.left = false;
        }
        if(question_position === 'right'){
          edges.right = false;
        }
      }
    }
    return edges;
  };

  var setAnswersInteractions = function(){
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
  };

  var getNewContainerSize = function(que, w, h){
    var question = que.question;
    if(question.layout_type === 'landscape'){
      return {
        w: 950,
        h: 550 - h
      }
    }
    return {
      w: 950 - w,
      h: 550
    }
  };

  var getNewContainerPos = function(que, w, h){
    var question = que.question;
    if(!question.layout_type || question.layout_type === 'landscape'){
      if(!question.layout_position || question.layout_position === 'up'){
        return {
          x: 0,
          y: $("#question").height()
        }
      }
    }

    if(question.layout_type === 'portrait'){
      if(question.layout_position === 'left'){
        return {
          x: $("#question").outerWidth(),
          y: 0
        }
      }
    }
    return {
      x: 0,
      y: 0
    }
  };

  var recalculateLayout = function (event) {
    var target = event.target;
    if (target.id === 'question') {
      //Recalcular el tamaño del comtendor de clicks
      var question_config = R.filter(R.propEq('type', 'question_model'))(config.elements);
      var question_height = $("#question").outerHeight();
      var question_width = $("#question").outerWidth();
      debugger;
      var container_size = getNewContainerSize(question_config, question_width, question_height);
      var container_pos = getNewContainerPos(question_config, question_width, question_height);
      config.elements_container = {
        size: {
            w: container_size.w,
            h: container_size.h
        },
        pos: {
          x: container_pos.x,
          y: container_pos.y
        }
      }
    }
    var area_size = Positioning.calculateAreaSize(question_config);
    var area_pos = Positioning.calculateAreaPosition(question_config);
    var model_length = !_.isEmpty(question_config) ? 1 : 0;
    var click_elements_count = _.size(elements_layout) - model_length;
    var deck = Positioning.calculateDeck(click_elements_count, area_size);
    var positions = Positioning.calculateCardPositions(elements_layout, deck.size, deck.col, deck.row, click_elements_count, area_size);
    var counter = 0;
    _.each(elements_layout, function(elem, key){
      if(elem.type !== 'question_model'){
        elem.size = {
          w: deck.size,
          h: deck.size
        };
        elem.pos = {
          x: positions.x[counter],
          y: positions.y[counter]
        };
        counter++
      }
    });
    //Quitar la interacción de los elementos
    interact('.resize-drag').unset();
    interact('.question-resize-drag').unset();
    //Volver a pintar la escena
    render();
  };

  function dragMoveListener(event) {
    var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    if (target.id === 'question') {
      return false;
    }

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
    var elem = "<div id='" + k + "' class='question-resize-drag drop-target drop-target" + index + "' data-x='" + resizer.getPosition(el.pos).x + "' data-y='" + resizer.getPosition(el.pos).y + "'></div>";
    var txt = "<div class='q_text'>" + el.text + "</div>";
    if(!$('#'+k) || !$('#'+k).length){
      $(container).append(elem);
    }

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
    }
    img = media.getImage(el.image.image);

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
      // "z-index": 12000
    });
    if (el.text) {
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
  };


  var drawAnswers = function (els) {
    var y = 0,
      min_h = 0,
      max_h = 0,
      drop_y = 0,
      compensa_h = 0,
      pos_dr = [],
      has_question = false;
    if(!$('#drag-elements') || !$('#drag-elements').length){
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
    if(!$('#'+k) || !$('#'+k).length){
      $(container).append(elem);
    }

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
    interact('.question-resize-drag').unset();
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
