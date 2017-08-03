NS('AnayaInfantil');

AnayaInfantil.Scene_1 = function() {
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
  var container_drags = 'drag-elements';
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


  //Indica si es posible quitar los draggables del contenedor y volverlos a la posición inicial
  var reversible = false;
  var drake = null; //El objeto encargado de gestionar el drag and drop


  var initialize = function(options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    res_config = res;
    resizer = resizer_obj;

    resolution = new AnayaInfantil.Scene_1.Resolution(res);
    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = AnayaInfantil.app.getMenu();
    reversible = config.reversible_drag;

    return render().then(function() {
      // Crear la escena
      return promiseShowIntroScene().then(function() {
        //Se ha terminado de renderizar la escena
        menu.setActivityType(config.type);
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
          "background-position": "center top",
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

      //Dibujar los contenedores
      return drawContainers(config.elements).then(function() {
        //Dibujar los arrastrables
        return drawDrags(config.elements);
      }).then(function() {
        return Promise.delay(100).then(function() {
          setDraggableOptions(containers_arr);
          resolve();
        })
      });
    });
  };

  var get = function(id) {
    return document.getElementById(id);
  };

  //Settings de la librería de drag and drop
  //más info: https://github.com/bevacqua/dragula
  var setDraggableOptions = function(conts) {
    var d_obj = [];
    _.each(conts, function(val) {
      d_obj.push(get(val));
    });
    return Promise.delay(1000).then(function(){
      drake = dragula(d_obj, {
          revertOnSpill: true,
          direction: 'horizontal',
          moves: function(el, source, handle, sibling) {
            if (reversible) {
              return true;
            } else {
              if (drop_containers_ids.indexOf(source.id) >= 0 || end_drag) {
                return false;
              }
              return true;
            }
          },
        })
        .on('drop', onDropElement)
        .on('over', onOverContainer)
        .on('out', onOutContainer);
    });

  };

  var onOutContainer = function(el, container, source) {
    if (reversible) {
      if (drop_containers_ids.indexOf(container.id) >= 0) {
        $(container).css({
          'border': '3px solid #ccc'
        });
      } else {
        $(container).css({
          'border': '2px solid #FFF'
        });
      }
    } else {
      if (drop_containers_ids.indexOf(container.id) >= 0) {
        $(container).css({
          'border': '2px solid #ccc'
        });
      }
    }
  };

  var onOverContainer = function(el, container, source) {
    if (reversible) {
      $(container).css({
        'border': '2px solid rgb(255, 200, 119)'
      });
    } else {
      if (drop_containers_ids.indexOf(container.id) >= 0) {
        $(container).css({
          'border': '2px solid rgb(255, 200, 119)'
        });
      }
    }
  };

  var onDropElement = function(el, target, source, sibling) {
    if (reversible) {
      // Solo se puede poner elementos correctos en contenedores
      // pero SI se puede volver elementos del contenedor a su posición inicial
      if (target.id !== "drag-elements" && resolution.checkResolution(target, el)) {
        $(el).animateCss("rubberBand");
        lib.play("success");
        checkComplete();
      } else {
        if (target.id === "drag-elements") {
          $(el).animateCss("rubberBand");
        } else {
          drake.cancel();
          $(el).animateCss("shake");
          error_counter++;
          if (error_counter < 3) {
            lib.play("fail");
          } else {
            error_counter = 0;
            //Mostrar cartel
            lib.play("fail");
            return promiseShowResults('signal_ko').then(function() {
              return Promise.resolve();
            });
          }
        }
      }
    } else {
      // Solo se puede poner elementos correctos en contenedores
      // y no se puede volver elementos del contenedor a su posición inicial
      if (target.id !== "drag-elements" && resolution.checkResolution(target, el)) {
        $(el).animateCss("rubberBand");
        lib.play("success");
        checkComplete();
      } else {
        drake.cancel();
        $(el).animateCss("shake");
        error_counter++;
        if (error_counter < 3) {
          lib.play("fail");
        } else {
          error_counter = 0;
          //Mostrar cartel
          lib.play("fail");
          return promiseShowResults('signal_ko').then(function() {
            return Promise.resolve();
          });
        }
      }
    }
  };

  var checkComplete = function() {
    //Controlar que en cada contenedor haya la cantidad correcta de elementos
    //En este caso basta contarlos, puesto que no es posible poner elementos equivocados en el contenedor
    var ok = true;
    var c;
    _.each(containers, function(value) {
      c = get(value.id);
      if (c.children.length !== res_config[value.id].refIDs.length) {
        ok = false;
      }
    });
    if (ok) {
      //Todo OK, mostrar la señal
      return promiseEndOk();
    }
  };

  var drawContainers = function(els) {
    var container = document.getElementById('container');
    var index = 0;
    _.each(els, function(value, key) {
      if (value.type === "drop_target") {
        containers.push(value);
        drop_containers_ids.push(value.id);
      }
    });

    return new Promise(function(resolve, reject) {
      _.each(containers, function(value, key) {
        drawContainerElement(value, value.id, containers.length, container, key);
        index++;
      });
      resolve();
    });
  };

  var getElementSize = function(id) {
    return {
      w: resizer.getSize($('#' + id).width()).w,
      h: resizer.getSize($('#' + id).height()).h
    }
  };

  var getImageSize = function(img) {
    return {
      w: img.width,
      h: img.height
    }
  };

  var drawContainerElement = function(el, k, total, container, index) {
    var elem = "<div id='" + k + "' class='drop-target drop-target" + index + "'></div>";
    var img = media.getImage(el.image);
    $(container).append(elem);
    containers_arr.push(k);

    $('#' + k).css({
      "background-image": "url(" + img.src + ")",
      "background-size": "contain",
      "background-position": "center center",
      "background-repeat": "no-repeat",
      "left": resizer.getPosition(el.pos).x + "px",
      "top": resizer.getPosition(el.pos).y + "px",
      "width": resizer.getSize(el.size).w + "px",
      "height": resizer.getSize(el.size).h + "px",
    });
  };

  var drawDrags = function(els) {
    var y = 0,
      min_h = 0,
      max_h = 0,
      drop_y = 0,
      compensa_h = 0,
      pos_dr = [];
    $('#container').append('<div id="drag-elements"></div>');
    var drags = [];
    _.each(els, function(value, key) {
      if (value.type === "draggable") {
        drags.push(value);
        pos_dr.push(value.pos);
      }
    });

    //Calcular el espacio q nos queda para el contenedor de arrastrables
    drop_y = $("#drop-target-1").position().top + $("#drop-target-1").height();
    max_h = resizer.getActivitySceneConfig().size.h - (drop_y - 20);
    min_h = resizer.getSize(drags[0].size).h + 10;
    compensa_h = (max_h - min_h) / 2;
    y = drop_y + compensa_h;

    //Posicionar el contenedor de elementos arrastrables en el sitio q nos queda
    $("#drag-elements").css({
      "height": min_h,
      "width": "98%", //resizer.getSceneConfig().size.w,
      //"top": y,
	  "bottom": "20px",
      "left": 0 //$("#drop-target-1").position().left
    });
    pos_dr = _.shuffle(pos_dr);
    var c = document.getElementById('drag-elements');
    containers_arr.push("drag-elements");
    return new Promise(function(resolve, reject) {
      _.each(drags, function(value, key) {
        drawDragElement(value, value.id, drags.length, c, key, pos_dr);
      });
      resolve();
    });
  };

  var drawDragElement = function(el, k, total, container, index, pos) {
    var elem_width = resizer.getSize(el.size).w;
    var elem = "<div id='" + k + "'></div>";
    $(container).append(elem);
    $('#' + k).css({
      "width": elem_width,
      "height": elem_width,
      "background-image": "url(" + media.getImage(el.image).src + ")",
      "background-size": "contain",
	  "background-repeat": "no-repeat",
      "left": resizer.getSimpleSize(pos[index].x) + "px",
      "top": resizer.getSimpleSize(pos[index].y) + "px",
    });
  };

  var promiseEndOk = function(elem) {
    return new Promise(function(resolve, reject) {
      Promise.delay(1000).then(function() {
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
      return promiseShowEndScene().then(function(){
        //Avisar a la aplicación que se ha acabado la actividad
        AnayaInfantil.app.endActivity();
      });
    });
  };

  var promiseShowEndScene = function(){
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var end_options, end_object;
    if(config.end_config && config.end_config.show_end){
      //Hay que mostrar la pantalla FINAL
      end_options = config.end_config;
      end_object = new AnayaInfantil.endWindow(media, lib, resizer);
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
    resolution = null;
    return Promise.resolve();
  };


  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};

NS('AnayaInfantil');

AnayaInfantil.Scene_1.Resolution = function(res) {
  'use strict';

  var resolution = res;
  var checkResolution = function(container, element) {
    var c = resolution[container.id];
    if (c.refIDs.indexOf(element.id) >= 0) {
      return true;
    }
    return false;
  };

  var setResolution = function(res) {
    resolution = res;
  }

  return {
    checkResolution: checkResolution,
    setResolution: setResolution
  }

};
