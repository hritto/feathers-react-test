NS('AnayaInfantil');

var media = null;
var lib = null;
var config = null;
var resizer = null;

AnayaInfantil.endWindow = function(med, li, rez) {
  'use strict';

  media = med;
  lib = li;
  resizer = rez;
  var animations = [];

  var initialize = function(opts){
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)

    var calc_top;
    var calc_left;
    config = opts;
    var sound = null;
    return new Promise(function(resolve, reject){
      $('#init_content').html("");

      if(config.background_image){
        $('#init_content').css("background-image", "url(activity/"+config.background_image+")");
      } else {
        $('#init_content').css("background-image", "none");
      }
      $('#init_content').css("background-color", config.background_color);
      calc_top = (resizer.getOuterBounds().h - resizer.getSize(config.size).h) / 2;
      calc_left = (resizer.getOuterBounds().w - resizer.getSize(config.size).w) / 2;
      $('#init_content').css({
        width: resizer.getSize(config.size).w,
        height: resizer.getSize(config.size).h,
        top: calc_top,
        left: calc_left
      });

      return setUpInitContents(config).then(function(){
        $('#initWindow').css('display','block');
        $('#init_content').animateCss('bounceInUp');

        $('#initWindow').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          //Iniciar las animaciones si las hay
          _.each(animations, function(value){
            $(value).animateSprite('play', 'go');
            $(value).animateSprite('restart');
          });
          if(hasSound(config)){
            sound = getSound(config);
            lib.play(sound);
          }
          $('#initWindow').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
          $('#initWindow').on('click',function(){


            //Redirigir a la aplicación

            $('#initWindow').off('click');
            $('#initWindow').animateCss('fadeOut');
            $('#initWindow').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $('#initWindow').css('display','none');
              $('#initWindow').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
              return resolve();
            });
          });
        });
      });
    });
  };

  var hasSound = function(opts){
    var has = false;
    _.each(opts.elements, function(value){
      if(value.type === "audio"){
        has = true;
      }
    });
    return has;
  };

  var getSound = function(opts){
    var sound = null;
    _.each(opts.elements, function(value){
      if(value.type === "audio"){
        sound = value.audio;
      }
    });
    return sound;
  };


  var setUpInitContents = function(opts){
    var options = opts;
    var el;
    return new Promise(function(resolve, reject){

      _.each(options.elements, function(value, key){

        if(value.type !== "audio"){
          el = "<div id='"+key+"'></div>";
          $('#init_content').append(el);
          $('#'+key).css({
            position: 'absolute',
            top: resizer.getPosition(value.pos).y,
            left: resizer.getPosition(value.pos).x
          });
        }
        if(value.type === "animation"){
          setupInitAnimation(value, key);
          animations.push('#'+key);
        }
        if(value.type === "image"){
          setupInitImage(value, key);
        }
      });

      return resolve();
    });
  };

  var setupInitAnimation = function(obj, k){

    $('#'+k).css({
      "width": obj.size.w,
      "height": obj.size.h,
      'background-image': 'url("'+media.getImage(obj.image).src+'")',
      'background-size': "auto " + obj.size.h + 'px',
      "background-position-x": "0px",
      "-webkit-transform-origin": "top left",
      "transform-origin": "top left",
    });

    $('#'+k).css('transform', 'scale(' + resizer.getSimpleSize(1) + ', ' + resizer.getSimpleSize(1) + ')');

    $('#'+k).animateSprite({
      fps: 25,
      autoplay: false,
      animations: {
        go: obj.frames
      },
      loop: false,
      complete: function() {
        // use complete only when you set animations with 'loop: false'
        $('#'+k).animateSprite('stop');
        $('#'+k).animateSprite('stop');
      }
    });
  };

  var setupInitImage = function(obj, k){
    $('#'+k).css({
      "width": resizer.getSize(obj.size).w,
      "height": resizer.getSize(obj.size).h,
      'background-image': 'url("'+media.getImage(obj.image).src+'")',
      'background-repeat': 'no-repeat',
      'background-size': "contain"
    });

  };

  var destroy = function(){
    $('#init_content').html("");
    config = null;
  };

  return {
    init: initialize,
    destroy: destroy
  }

};
