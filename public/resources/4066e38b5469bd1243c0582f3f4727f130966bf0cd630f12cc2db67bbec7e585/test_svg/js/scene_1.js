var cvd = function() {
  var output = '';
  var that = {};
  var oldFuncs;;

  var caller = function(prop) {
    return function() {
      var args = '',
        str = '';
      for (var i = 0; i < arguments.length; i++) {
        args += arguments[i];
        if (i !== arguments.length - 1) {
          args += ',';
        }
      }
      str = 'ctx.' + prop + '(' + args + ');';
      output += str + '\n';
    };
  };

  that.overrideFuncs = function() {
    oldFuncs = {};
    for (var prop in CanvasRenderingContext2D.prototype) {
      if (CanvasRenderingContext2D.prototype.hasOwnProperty(prop)) {
        try {
          var oldFunc = CanvasRenderingContext2D.prototype[prop];
          if ((typeof oldFunc == 'function') && (prop !== 'createLinearGradient') && (prop !== 'createRadialGradient')) {
            oldFuncs[prop] = oldFunc;
            CanvasRenderingContext2D.prototype[prop] = caller(prop);
          }
        } catch (e) {}
      }
    }
  }

  that.restoreFuncs = function() {
    for (var key in oldFuncs) {
      if (oldFuncs.hasOwnProperty(key)) {
        CanvasRenderingContext2D.prototype[key] = oldFuncs[key];
      }
    }
  }

  that.logCommand = function(command) {
    output += command + ';\n';
  }
  that.getOutput = function() {
    return output;
  }

  that.clearOutput = function() {
    output = '';
  };
  return that;
}();



NS('AnayaInfantil');

AnayaInfantil.Scene_0 = function() {
  'use strict';

  var config = null;
  var el = null;
  var data = null;
  var end = false;
  var scene_el = '#container';
  var media;
  var lib = null; //la librería de audio
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var menu = null;
  var intro_object = null;
  var end_object = null;
  var active_buttons = [];
  var mobile = null;
  var viewportWidth = null;
  var viewportHeight = null;
  var stage = null;
  var layer = null;
  var current_color = null;

  var container_contents = '<div id="paint_menu">';
  container_contents +=   '<div id="black" class="color_menu pencil black"></div>';
  container_contents +=   '<div id="blue" class="color_menu pencil blue"></div>';
  container_contents +=   '<div id="violet" class="color_menu pencil violet"></div>';
  container_contents +=   '<div id="red" class="color_menu pencil red"></div>';
  container_contents +=   '<div id="orange" class="color_menu pencil orange"></div>';
  container_contents +=   '<div id="yellow" class="color_menu pencil yellow"></div>';
  container_contents +=   '<div id="green_light" class="color_menu pencil green_light"></div>';
  container_contents +=   '<div id="green_dark" class="color_menu pencil green_dark"></div>';
  container_contents +=   '<div id="eraser" class="color_menu eraser"></div>';
  container_contents +=   '<div id="done" class="color_menu done"></div>';
  container_contents += '</div>';




  var initialize = function(options, med, res, resizer_obj, layout_obj) {
    config = options;
    media = med;
    resizer = resizer_obj;
    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = AnayaInfantil.app.getMenu();

    return render().then(function() {
      // Crear la escena
      return promiseShowIntroScene().then(function() {
        //Se ha terminado de renderizar la escena
        menu.setActivityType(config.type);
        //Abrir la instrucción
        if (config.show_instruction) {
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
          menu.setAudioEnabled(true);
          intro_object.destroy();
          intro_object = null;
          return resolve();
        });
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
        if (value) {
          active_buttons.push(key);
        }
      });
      //iniciar los eventos de los botones visibles
      menu.startButtonsEvents(active_buttons);

      return drawCanvas(config.elements).then(function() {
        return Promise.delay(100).then(function() {
          resolve();
        })
      });
    });

  };

  var openSnapshot = function() {
    var canvas, snapshot, destinationCanvas, destCtx, img_obj, final_img, win;
    canvas = document.getElementsByTagName('canvas')[0];
    snapshot = canvas.toDataURL("image/png");
    //create a dummy CANVAS
    destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = resizer.getSimpleSize(583);
    destinationCanvas.height = resizer.getSimpleSize(509);
    destCtx = destinationCanvas.getContext('2d');

    //create a rectangle with the desired color
    destCtx.fillStyle = "#FFFFFF";
    destCtx.fillRect(0, 0, destinationCanvas.width, destinationCanvas.height);
    //Cargar la imagen en el nuevo canvas
    img_obj = new Image();
    img_obj.onload = function() {
      destCtx.drawImage(img_obj, 0, 0);
      final_img = destinationCanvas.toDataURL();
      win = new AnayaInfantil.snapshotWindow(media, resizer);
      return win.init(final_img).then(function(data) {
        destinationCanvas = null;
        img_obj = null;
        win.destroy();
        win = null;
        showEndActivity();
      });
    };
    img_obj.src = snapshot;
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

  var getDrawFuncFromSvg = function(el) {
    var str = el.outerHTML;
    if (!str.length) return;
    cvd.overrideFuncs();
    cvd.clearOutput();
    canvg('temp', str);
    var out = cvd.getOutput();
    cvd.restoreFuncs();
    return out;
  };

  var getElementFromSvg = function(func, layer, opts) {

    var foo = func + "\n" + " ctx.fillStrokeShape(this);"
    var element = new Kinetic.Shape({
      x: 0,
      y: 0,
      fill: opts.fill,
      name: opts.code,
      // a Kinetic.Canvas renderer is passed into the drawFunc function<br>
      drawFunc: function(ctx) {
        eval(foo);
      },
      opacity: 0.1
    });

    //Añadir a la capa
    layer.add(element);

    element.on("click", function(evt) {
      onClick(this, layer);
    });
  };

  var onClick = function(el, layer){
    debugger;
    if(current_color === el.getFill()){
      el.setOpacity(1);
      layer.draw();
    } else {
      //mal
    }
  };

  var nodeMarkup = function(node, search_node, layer) {
    var opts = {};
    if (node.childNodes.length) {
      for (var index = 0; index < node.childNodes.length; index++) {
        if (node.childNodes[index].tagName == 'path') {
          console.log(node.childNodes[index].getAttribute('fill'));
          opts.fill = node.childNodes[index].getAttribute('fill');
          opts.code = node.childNodes[index].getAttribute('color_num');
          getElementFromSvg(getDrawFuncFromSvg(node.childNodes[index]), layer, opts);
        } else {
          nodeMarkup(node.childNodes[index], search_node, layer);
        }
      }
    }
  };


  var drawCanvas = function(els) {
    var container = document.getElementById('container');
    var ratio;
    var img;
    return new Promise(function(resolve, reject) {
      stage = new Kinetic.Stage({
        container: 'container',
        width: $("#container").width(),
        height: $("#container").height()
      });
      layer = new Kinetic.Layer();
      stage.add(layer);
      var s = new XMLSerializer().serializeToString(document.getElementById("Layer_2"));
      var parser = new DOMParser();
      var doc = parser.parseFromString(s, "image/svg+xml");
      console.log(doc.documentElement.children)
        //var a = traverse(doc.documentElement, "path");
      var a = nodeMarkup(doc, "path", layer);
      /**

        */

      //Agregar el botón ok
      var ok_button = new Kinetic.Image({
        id: "ok_button",
        x: resizer.getSimpleSize(612),
        y: resizer.getSimpleSize(447),
        width: resizer.getSimpleSize(105),
        height: resizer.getSimpleSize(61),
        image: media.getImage("done"),
        draggable: false
      });
      layer.add(ok_button);
      //Añadir el evento al botón para la captura
      ok_button.on("click touch", function(evt) {
        ok_button.off("click touch");
        openSnapshot();
      });
      layer.draw();
      resolve();
    });
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

  var destroy = function() {
    $(scene_el).empty();
    $(scene_el).css({
      "border": "0 none"
    });
    return Promise.resolve();
  };


  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};
