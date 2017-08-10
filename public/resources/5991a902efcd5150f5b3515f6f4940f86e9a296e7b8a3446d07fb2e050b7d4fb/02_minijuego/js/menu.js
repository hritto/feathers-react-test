
NS('AnayaInfantil');

AnayaInfantil.Menu = function(opts, resizer_obj, ins, al, co, sc, ok_index, ko_index) {
  'use strict';

  var config = opts;
  var resizer = resizer_obj;
  var collapsed_width = resizer.getSimpleSize(config.collapsed_width);
  var is_open = false;
  var media = null;
  var instruction = ins;
  var alerts = al;

  var current_sprite_ok = ok_index;
  var current_sprite_ko = ko_index;
  var current_audio_ok = null;
  var current_audio_ko = null;

  var common = co;
  var sc_config = sc;
  var sound = null; // El audio de la instrucción
  var act_buttons = null;
  var audio_enabled = false; //Si se puede reproducir audio
  var activity_type = null;

  //Suscripciones de audio
  var signals = {
      playing: null,
      end: null,
      pause: null,
      sound_error: null
  };
  //Señales de menu
  var menu_signals = {
      open: new Signal(),
      close: new Signal()
  };

  var initialize = function() {

    setPosSize('#menu', resizer.getSize(config.size), resizer.getPosition(config.pos));
    setPosSize('.slider', resizer.getSize(config.slider.size), resizer.getPosition(config.slider.pos));
    setPosSize('.rita_menu', resizer.getSize(config.rita_menu.size), resizer.getPosition(config.rita_menu.pos));
    setPosSize('.btns', resizer.getSize(config.botonera.size), resizer.getPosition(config.botonera.pos));
    $('#arrow').css({
      'right': resizer.getSimpleSize(config.rita_menu.arrow.right),
      'top': resizer.getSimpleSize(config.rita_menu.arrow.pos.y),
      'width': resizer.getSize(config.rita_menu.arrow.size).w,
      'height': resizer.getSize(config.rita_menu.arrow.size).h,
      'background-size': resizer.getSimpleSize(19) + "px " + resizer.getSimpleSize(35) + "px"
    });

    //La burbuja de la consigna
    setPos('#bubble', resizer.getPosition(config.info_bubble.pos));
    $('#bubble').css({
      'width': '60%',
      'height': 'auto',
      "padding": resizer.getSimpleSize(config.info_bubble.padding),
      "border-width": resizer.getSimpleSize(config.info_bubble.border_size),
      "font-size": Math.ceil(resizer.getSimpleSize(config.info_bubble.font_size)) + "px",
      "line-height": Math.ceil(resizer.getSimpleSize(config.info_bubble.line_height)) + "px"
    });

    //Los botones
    _.each(config.botonera.buttons.visible, function(value, key) {
      $('#' + key).css({
        "display": value ? "block" : "none",
        "margin-bottom": config.botonera.buttons.margin_bottom
      });
      setSize('#' + key, resizer.getSize(config.botonera.buttons.size));
      //Posicionar el botón de siguiente
      if(key === "btn_next"){
        $('#' + key).css({
          "position": "absolute",
          "left": resizer.getSceneConfig().size.w - resizer.getSimpleSize(config.botonera.buttons.size.w) + 2,
          "top": resizer.getSimpleSize(70)
        });
      }
    });

    //Las señales de bien o mal
    var signal_size = resizer.getSize({
      w: alerts.size.w,
      h: alerts.size.h
    });

    $('#signal_ko, #signal_ok').css({
      'width': signal_size.w,
      'height': signal_size.h,
      'left': (resizer.getOuterBounds().w - signal_size.w) / 2
    });

    $('#signal_ko, #signal_ok').css({
      'display': 'none'
    });

    setAlertsSprites();

    return Promise.delay(100).then(function() {
      if(!sc_config.init_config && !sc_config.init_config.show_intro){
        closeMenu();
      }
    });
  };

  var getAudioOk = function(){
    return current_audio_ok;
  };

  var getAudioKo = function(){
    return current_audio_ko;
  };

  var getOkIndex = function(){
    return current_sprite_ok;
  };
  var getKoIndex = function(){
    return current_sprite_ko;
  };

  var setAlertsSprites = function(signal){
    //Inicializar las primeras animaciones del array de ok y ko
    var sprite_ok;
    var sprite_ko;

    if(signal === "ok"){
      current_sprite_ok++;
    }

    if(signal === "ko"){
      current_sprite_ko++;
    }
    //console.log("ko:" + current_sprite_ko + " ok:" + current_sprite_ok);
    if(current_sprite_ok >= alerts.ok.length){
      current_sprite_ok = 0;
    }

    if(current_sprite_ko >= alerts.ko.length){
      current_sprite_ko = 0;
    }

    sprite_ok = alerts.ok[current_sprite_ok];
    current_audio_ok = sprite_ok.sound;
    sprite_ko = alerts.ko[current_sprite_ko];
    current_audio_ko = sprite_ko.sound;

    $('#signal_ok').html("").append('<div id="animation_ok"></div>');
    $('#signal_ko').html("").append('<div id="animation_ko"></div>');

    $('#animation_ko').css({
      'width': sprite_ko.size.w,
      'height': sprite_ko.size.h,
      'position': 'relative',
      'top': resizer.getSimpleSize((alerts.size.h - sprite_ko.size.h) / 2) + "px",
      'left': resizer.getSimpleSize((alerts.size.w - sprite_ko.size.w) / 2) + "px",
      'background-image': 'url("images/'+sprite_ko.image+'")',
      'background-size': "auto " + sprite_ko.size.h + 'px'
    });

    $('#animation_ok').css({
      'width': sprite_ok.size.w,
      'height': sprite_ok.size.h,
      'position': 'relative',
      'top': resizer.getSimpleSize((alerts.size.h - sprite_ok.size.h) / 2) + "px",
      'left': resizer.getSimpleSize((alerts.size.w - sprite_ok.size.w) / 2) + "px",
      'background-image': 'url("images/'+sprite_ok.image+'")',
      'background-size': "auto " + sprite_ok.size.h + 'px'
    });

    $('#animation_ok').css('transform', 'scale(' + resizer.getSimpleSize(1) + ', ' + resizer.getSimpleSize(1) + ')');
    $('#animation_ko').css('transform', 'scale(' + resizer.getSimpleSize(1) + ', ' + resizer.getSimpleSize(1) + ')');

    initAnimationSprite(sprite_ok,sprite_ko);
  };

  var initAnimationSprite = function(ok,ko) {
    $("#animation_ok, #animation_ko").animateSprite({
      fps: 25,
      autoplay: false,
      animations: {
        ok: ok.frames,
        ko: ko.frames
      },
      loop: false,
      complete: function() {
        // use complete only when you set animations with 'loop: false'
        $('#animation_ko').animateSprite('stop');
        $('#animation_ok').animateSprite('stop');
      }
    });
  };

  var setPosSize = function(el, size, pos) {
    setSize(el, size);
    setPos(el, pos);
  };

  var setSize = function(el, size) {
    $(el).css({
      'width': size.w,
      'height': size.h
    });
  }

  var setPos = function(el, pos) {
    $(el).css({
      'top': pos.y,
      'left': pos.x
    });
  };

  var startMenuEvents = function() {
    if (!is_open) {
      $('#arrow').off('click').on('click', openMenu);
    }
  };

  var stopMenuEvents = function() {
    $('#arrow').off('click');
  };

  var openMenu = function() {
    stopMenuEvents();
    stopButtonsEvents();
    if(!instruction.text){
      return;
    }
    $('#screenBlocker').css('display', 'block');
    $('#menu').css('width', resizer.getSize(config.size).w);
    $('#arrow').removeClass('right');
    $('#arrow').addClass('left');
    var $slider = $('.slider');
    var distance = 0 - resizer.getSimpleSize(config.slider.size.w);
    $slider.css('transform', 'translate3d(' + 0 + 'px,0,0)');
    $slider.on('webkitTransitionEnd MozTransitionEnd oTransitionEnd msTransitionEnd transitionend', function(e) {
      $slider.off('webkitTransitionEnd MozTransitionEnd oTransitionEnd msTransitionEnd transitionend');

      is_open = true;
      showInstruction();
    });
  };

  var closeMenu = function() {
    stopMenuEvents();
    $('#arrow').removeClass('left');
    $('#arrow').addClass('right');
    var $slider = $('.slider');
    var distance = 0 - resizer.getSimpleSize(config.slider.size.w - 60);
    $slider.css('transform', 'translate3d(' + distance + 'px,0,0)');
    $slider.on('webkitTransitionEnd MozTransitionEnd oTransitionEnd msTransitionEnd transitionend', function(e) {
      $slider.off('webkitTransitionEnd MozTransitionEnd oTransitionEnd msTransitionEnd transitionend');
      $('#screenBlocker').css('display', 'none');
      is_open = false;
      return Promise.delay(500).then(function() {
        $('#menu').css('width', collapsed_width);
        if (activity_type !== 3){
          startMenuEvents();
        }
        startButtonsEvents();
      })
    });
  };

  var showInstruction = function() {
    console.log("abrir instrucción");
    sound = instruction.sound;
    var intro = instruction.text;
    var lib = media.getSoundLibrary();
    var $info = $('#infoWindow');
    var $bubble = $('#bubble');
    if(intro){
      return new Promise(function(resolve, reject) {
        $bubble.html(intro);
        $info.css('display', 'block');
        $bubble.animateCss('bounceInDown');
        if (sound) {
          lib.stopAllSounds();
          signals.end = lib.on.end.add(_.bind(closeInstruction));
          lib.play(sound);
        } else {
          return Promise.delay(3000).then(function(){
            closeInstruction();
          });
        }

      });
    } else {
      startMenuEvents();
    }
  };

  var closeInstruction = function(data){

    var $info = $('#infoWindow');
    if(signals.end && signals.end.isBound()){
      signals.end.detach();
    }
    sound = null;
    return Promise.delay(500).then(function(){
      $info.removeClass();
      $info.animateCss('fadeOut');
      $info.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $info.off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        $info.css('display', 'none');
        closeMenu();
        // Hay que notificar
        menu_signals.close.dispatch({
          is_open: false
        });
        return Promise.resolve();
      });
    });
  };

  var setMedia = function(m) {
    media = m;
  };

  var setInstruction = function(ins){
    instruction = ins;
  }

  var startButtonsEvents = function(active_buttons) {
    //Activar los botones
    if(active_buttons){
      act_buttons = active_buttons;
    }

    _.each(act_buttons, function(value) {
      if(value==="btn_home"){
        $('#'+value).on('click', triggerHomeAction);
      }
      if(value==="btn_redo"){
        $('#'+value).on('click', triggerRedoAction);
      }
      if(value==="btn_back"){
        $('#'+value).on('click', triggerBackAction);
      }
      if(value==="btn_next"){
        $('#'+value).on('click', triggerNextAction);
      }
      if(value==="btn_info"){
        $('#'+value).on('click', triggerInfoAction);
      }
    });

  };

  var stopButtonsEvents = function() {
    //Desactivar los botones
    _.each(act_buttons, function(value) {
      if(value==="btn_home"){
        $('#'+value).off('click', triggerHomeAction);
      }
      if(value==="btn_redo"){
        $('#'+value).off('click', triggerRedoAction);
      }
      if(value==="btn_back"){
        $('#'+value).off('click', triggerBackAction);
      }
      if(value==="btn_next"){
        $('#'+value).off('click', triggerNextAction);
      }
      if(value==="btn_info"){
        $('#'+value).off('click', triggerInfoAction);
      }
    });
  };

  var triggerBackAction = function(e){
    $('#'+e.target.id).off('click');
    AnayaInfantil.app.initPrevActivity();
  };

  var triggerHomeAction = function(e){
    $('#'+e.target.id).off('click');
    AnayaInfantil.app.endAllActivities();
  };

  var triggerRedoAction = function(e){
    $('#'+e.target.id).off('click');
    AnayaInfantil.app.reloadActivity();
  };

  var triggerNextAction = function(e){
    $('#'+e.target.id).off('click');
    AnayaInfantil.app.initNextActivity();
  };

  var triggerInfoAction = function(e){
    //$('#'+e.target.id).off('click');
    AnayaInfantil.app.promiseShowInfoWindow();
  };

  var getAudioEnabled = function(){
    return audio_enabled;
  };

  var setAudioEnabled = function(enabled){
    audio_enabled = enabled;
  };

  var setActivityType = function(type){
    activity_type = type;
  };

  var destroy = function() {
    stopButtonsEvents();
    signals = {
        playing: null,
        end: null,
        pause: null,
        sound_error: null
    };
  };

  return {
    init: initialize,
    open: openMenu,
    close: closeMenu,
    startMenuEvents: startMenuEvents,
    setMedia: setMedia,
    setAlertsSprites: setAlertsSprites,
    setInstruction: setInstruction,
    startButtonsEvents: startButtonsEvents,
    stopButtonsEvents: stopButtonsEvents,
    on: menu_signals,
    getAudioEnabled: getAudioEnabled,
    setAudioEnabled: setAudioEnabled,
    setActivityType: setActivityType,
    getOkIndex: getOkIndex,
    getKoIndex: getKoIndex,
    getAudioKo: getAudioKo,
    getAudioOk: getAudioOk,
    destroy: destroy
  }

};
