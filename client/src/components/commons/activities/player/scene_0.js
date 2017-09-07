import * as _signals from 'signals';
import endWindow from './end_window.js';
import introWindow from './intro_window.js';


const Scene_0 = function() {

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
  var lib = null; //la librería de audio
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var menu = null;
  var intro_object = null;
  var active_buttons = [];
  var animations = [];
  var menu_signals = {
      open: null,
      close: null
  };
  var endActivityCallback = null;


  var initialize = function(options, med, res, resizer_obj, layout_obj, _menu, endActivity) {
    config = options;
    media = med;
    resizer = resizer_obj;
    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = _menu;
    endActivityCallback = endActivity;

    return promiseShowIntroScene().then(function() {
      // Crear la escena
      return render().then(function() {
        //Se ha terminado de renderizar la escena
        menu.setActivityType(config.type);
        //Abrir el menu
        if(config.show_instruction){
          menu.open();
        }
        menu_signals.close = menu.on.close.add(_.bind(initActivity));

        return Promise.resolve();
      })
    });
  };

  var initActivity = function(){
    return Promise.delay(1000).then(function(){
      var sound = null;
      _.each(animations, function(value){
        $(value).animateSprite('play', 'go');
        $(value).animateSprite('restart');
      });
      if(hasSound(config)){
        sound = getSound(config);
        lib.play(sound);
      }

      //Iniciar el timer
      return Promise.delay(config.timer.time).then(function(){
        return showEndActivity();
      });
    });
  };

  var promiseShowIntroScene = function() {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var init_options;
    if (!menu.getAudioEnabled() && config.show_instruction && is_mobile() && config.init_config.show_intro) { //La ventana inicial solo se muestra en dispositivos móviles
      //Hay que mostrar la pantalla inicial
      init_options = config.init_config;
      intro_object = new introWindow(media, lib, resizer);

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
        if(value){
          active_buttons.push(key);
        }
      });
      //iniciar los eventos de los botones visibles
      menu.startButtonsEvents(active_buttons);

      //Dibujar los elementos
      return drawElements(config.elements).then(function() {
        //Se ha terminado de renderizar la escena
        return resolve();
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


  var drawElements = function(){
    return new Promise(function(resolve, reject){
      _.each(config.elements, function(value, key){

        if(!value.audio){
          el = "<div id='"+key+"'></div>";
          $(scene_el).append(el);
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
        if(value.image){
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


  var showEndActivity = function() {
    // Marcar el fin de la actividad
    end = true;
    return destroy().then(function() {
      return promiseShowEndScene().then(function(){
        //Avisar a la aplicación que se ha acabado la actividad
        endActivityCallback();
      });
    });
  };

  var promiseShowEndScene = function(){
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var end_options, end_object;
    if(config.end_config && config.end_config.show_end){
      //Hay que mostrar la pantalla FINAL
      end_options = config.end_config;
      end_object = new endWindow(media, lib, resizer);
      return new Promise(function(resolve, reject){
        end_object.init(end_options).then(function(){
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
    return Promise.resolve();
  };


  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};
export default Scene_0;
