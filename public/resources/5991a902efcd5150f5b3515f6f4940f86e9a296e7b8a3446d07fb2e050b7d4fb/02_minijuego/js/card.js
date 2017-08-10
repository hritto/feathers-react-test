NS("AnayaInfantil");

//Este objeto se encarga de crear las cartas.

AnayaInfantil.Card = function(scene_e, cardElement, id, posX, posY, size_card, imgCardBack, cardID, cardType, imageAudio, med, resize, li) {
  'use strict';

  var pos = {
    x: posX,
    y: posY
  };
  // Flag que induca que una carta está siendo mostrada
  var showing = false;
  var size = size_card;
  var idCard = id;
  var nameCard = cardID;
  //cardType = 0:image, 1:text, 2, audio
  var type = cardType;
  var imgX = 0;
  var imgY = 0;
  var sound = null;
  var timer_turn;
  var resolution = 0;
  // Flag que induca que una carta ha sido resuelta
  var matched = false;
  var cardSize = size;
  var callback;
  var card_element = cardElement;
  // Callbacks para activar/desactivar todas
  // las cartas mientras se ejecuta la animación
  var eventEnable = null;
  var eventDisable = null;

  var media = med;
  var resizer = resize;
  var lib = li;

  var scene_el = scene_e;
  var card = null;
  var back = imgCardBack;
  var image_card = null;

  // Imagenes
  var image_tick = {
    correct: media.getImage('correct')
  };

  //Suscripciones de audio
  var signals = {
    playing: null,
    end: null,
    pause: null,
    sound_error: null
  };

  //Callback del click sobre una carta
  var cardClick = function(e) {
    //Si la carta está resulta
    if (matched) {
      return false;
    }

    //Si la carta está siendo mostrada
    if (showing) {
      return false;
    }
    // Deshabilitar los eventos de click sobre todas las cartas
    // hasta que termine la animación
    eventDisable();
    callback(idCard, nameCard);
  };

  var initialize = function(cardEventHandler, eEnable, eDisable) {

    callback = cardEventHandler;
    eventEnable = eEnable;
    eventDisable = eDisable;
    image_card = card_element;

    if (imageAudio) {
      image_card = imageAudio;
    }

    switch (type) {
      case 0:
        card = createImageCard();
        break;
      case 2:
        card = createAudioCard();
        break;
    }

    attachEvents();

  };

  var attachEvents = function() {
    $('#' + nameCard).on('click tap', cardClick);
  };

  var detachEvents = function() {
    $('#' + nameCard).off('click tap', cardClick);
  };

  var createAudioCard = function() {

    var card = "<div id='" + nameCard + "' class='card'></div>";
    $('#' + scene_el).append(card);

    $('#' + nameCard).css({
      "background-size": "contain",
      "background-repeat": "no-repeat",
      "left": pos.x + "px",
      "top": pos.y + "px",
      "width": size + "px",
      "height": size + "px"
    });

    if (back) {
      $('#' + nameCard).css({
        "background-image": "url(" + back.src + ")",
        "background-color": "#fff"
      });
    } else {
      $('#' + nameCard).css({
        "background-image": "none",
        "background-color": "#5e9ac0"
      });
    }

    return card;
  };

  var createImageCard = function() {

    var card = "<div id='" + nameCard + "' class='card'></div>"
    $('#' + scene_el).append(card);

    $('#' + nameCard).css({
      "background-size": "contain",
      "background-repeat": "no-repeat",
      "left": resizer.getPosition(pos).x + "px",
      "top": resizer.getPosition(pos).y + "px",
      "width": resizer.getSize(size).w + "px",
      "height": resizer.getSize(size).h + "px"
    });

    if (back) {
      $('#' + nameCard).css({
        "background-image": "url(" + back.src + ")",
        "background-color": "#fff"
      });
    } else {
      $('#' + nameCard).css({
        "background-image": "none",
        "background-color": "#5e9ac0"
      });
    }
    return card;
  };


  var matchedCard = function(is_second) {
    detachEvents();
    matched = true;
    timer_turn = setTimeout(function() {
      setCardResult();
    }, 500);
  };

  var setCardResult = function() {
    if (timer_turn) {
      clearTimeout(timer_turn);
      timer_turn = null;
    }
    if (matched) {
      switch (resolution) {
        case 1:
          // Correcto
          drawCorrect();
          break;
        case 2:
          // Error
          drawError();
          break;
      }
    }
  };

  var drawCorrect = function() {
    $('#' + nameCard).css("opacity", "0.7");
    $('#' + nameCard).append("<div class='check_ok'></div>");
    //mostrar la señal
    $('.check_ok').css({
      "width": resizer.getSimpleSize(60) + "px",
      "height": resizer.getSimpleSize(60) + "px",
      "top": resizer.getSimpleSize(-10) + "px",
      "right": resizer.getSimpleSize(-10) + "px"
    });
  };

  var drawError = function(element) {
    $('#' + nameCard).css("opacity", "0.7");
    $('#' + nameCard).append("<div class='check_ko'></div>");
    //mostrar la señal
    $('.check_ko').css({
      "width": resizer.getSimpleSize(60) + "px",
      "height": resizer.getSimpleSize(60) + "px",
      "top": resizer.getSimpleSize(-10) + "px",
      "right": resizer.getSimpleSize(-10) + "px"
    });
  };

  var resetCard = function() {
    showing = false;
    //card.hide();
    //cardBack.show();
    $('#' + nameCard).addClass("card_animate");
    $('#' + nameCard).on('transitionend webkitTransitionEnd oTransitionEnd', function() {
      $('#' + nameCard).off('transitionend webkitTransitionEnd oTransitionEnd');
      if (back) {
        $('#' + nameCard).css({
          "background-image": "url(" + back.src + ")",
        });
      } else {
        $('#' + nameCard).css({
          "background-image": "none",
          "background-color": "#5e9ac0"
        });
      }
      $('#' + nameCard).removeClass("card_animate");
    });
  };

  var showCardAnimated = function() {

    showing = true;
    //$('#'+id).css("opacity", "0.7");

    $('#' + nameCard).addClass("card_animate");
    $('#' + nameCard).on('transitionend webkitTransitionEnd oTransitionEnd', function() {
      $('#' + nameCard).off('transitionend webkitTransitionEnd oTransitionEnd');
      $('#' + nameCard).css({
        "background-image": "url(" + image_card.src + ")",
        "background-size": "contain",
        "background-color": "#fff"
      });
      $('#' + nameCard).removeClass("card_animate");
      $('#' + nameCard).on('transitionend webkitTransitionEnd oTransitionEnd', function() {
        $('#' + nameCard).off('transitionend webkitTransitionEnd oTransitionEnd');

        //Reproducir el audio
        lib.stopAllSounds();
        lib.play(card_element);
        signals.end = lib.on.end.add(_.bind(onEndSound));
      });
    });



  };

  var onEndSound = function(data) {
    signals.end.detach();
    eventEnable();
  };

  var setResolutionState = function(state) {
    resolution = state;
  };

  var getResolutionState = function() {
    return resolution;
  };

  var getId = function() {
    return id;
  };

  var getName = function() {
    return nameCard;
  };

  var getSize = function() {
    return cardSize;
  };

  var getCard = function() {
    return $('#' + nameCard);
  }

  var destroy = function() {

  };

  return {
    getCard: getCard,
    initialize: initialize,
    resetCard: resetCard,
    matchedCard: matchedCard,
    showCardAnimated: showCardAnimated,
    setResolutionState: setResolutionState,
    getResolutionState: getResolutionState,
    getId: getId,
    getName: getName,
    getSize: getSize,
    destroy: destroy,
    attachEvents: attachEvents,
    detachEvents: detachEvents
  };
};
