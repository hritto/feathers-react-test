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
  var media;
  var intro;
  var lib = null; //la librería de audio
  //Contador de errores
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var menu = null;
  var intro_object = null;
  var end_object = null;
  var active_buttons = [];

  //Variables de actividad
  var mobile = null;
  var canvas = null; //canvas
  var context = null; //context
  var clearBtn = null; //borrar el lienzo
  var colorBtn = null;
  var curSize = 20; //grosor de la linea
  var curColor = "#ff0000"; //color inicial de la linea
  var curType = "brush";
  var buttonDown = false;
  var canX;
  var canY;
  var canvasWidth;
  var canvasHeight;
  var bucket = "off";
  var curBrushSizesArr = [5, 10, 20, 30, 40];
  var curSizeCounter = 0;
  //La imagen de calcar
  var img = null;
  var img_size = null;
  var img_pos = null;
  //La imagen de fondo
  var img_back = null;
  var img_back_size = null;
  var img_back_pos = null;
  var _globalCompositeOperation = "source-over";

  var container_contents = '<canvas id="paintBox" ontouchmove="touchMove(event);" ></canvas>';
  container_contents += '<div id="paint_menu">';
  //container_contents +=   '<div id="black" class="color_menu pencil black"></div>';
  container_contents +=   '<div id="blue" class="color_menu pencil blue"></div>';
  //container_contents +=   '<div id="violet" class="color_menu pencil violet"></div>';
  container_contents +=   '<div id="red" class="color_menu pencil red"></div>';
  //container_contents +=   '<div id="orange" class="color_menu pencil orange"></div>';
  //container_contents +=   '<div id="yellow" class="color_menu pencil yellow"></div>';
  //container_contents +=   '<div id="green_light" class="color_menu pencil green_light"></div>';
  //container_contents +=   '<div id="green_dark" class="color_menu pencil green_dark"></div>';
  container_contents +=   '<div id="eraser" class="color_menu eraser"></div>';
  container_contents +=   '<div id="clear" class="color_menu clear"></div>';
  container_contents +=   '<div id="done" class="color_menu done"></div>';
  container_contents += '</div>';


  var eraser = "off";
  var g_curColor = 'rgba(0,0,0,1.0)'; //El color de la goma de borrar
  var colors = { //Configuración de colores
    /*green_dark: '#20C45A',
    green_light: '#C0E256',
    yellow: '#FFF27D',
    orange: '#FFB24D',*/
    red: '#E20613',
    blue: '#4799D6',
    /*violet: '#A957B5',
    black: '#3C3C3B',*/
  };


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

  var promiseShowIntroScene = function(){
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var init_options;
    if (!menu.getAudioEnabled() && config.show_instruction && is_mobile() && config.init_config.show_intro) { //La ventana inicial solo se muestra en dispositivos móviles
      //Hay que mostrar la pantalla inicial
      init_options = config.init_config;
      intro_object = new AnayaInfantil.introWindow(media, lib, resizer);

      return new Promise(function(resolve, reject){
        intro_object.init(init_options).then(function(){
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
        if (value) {
          active_buttons.push(key);
        }
      });
      //iniciar los eventos de los botones visibles
      menu.startButtonsEvents(active_buttons);

      //Iniciar el evento del botón de captura (se hace solo en este tipo de actividad)
      //$( "#btn_camera" ).on('click', openSnapshot);

      //Dibujar los contenedores
      return drawCanvas(config.elements).then(function() {
        return Promise.delay(100).then(function() {
          resolve();
        })
      });
    });

  };

  var openSnapshot = function() {
    var snapshot = canvas.toDataURL("image/png");
    //create a dummy CANVAS
    var destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = canvas.width;
    destinationCanvas.height = canvas.height;

    var destCtx = destinationCanvas.getContext('2d');

    //create a rectangle with the desired color
    destCtx.fillStyle = "#FFFFFF";
    destCtx.fillRect(0, 0, canvas.width, canvas.height);
    var img_obj = new Image();
    img_obj.onload = function() {
      //draw the original canvas onto the destination canvas
      destCtx.drawImage(img_obj, 0, 0);
      //finally use the destinationCanvas.toDataURL() method to get the desired output;
      var final_img = destinationCanvas.toDataURL();
      var win = new AnayaInfantil.snapshotWindow(media, resizer);
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

  var setCanvasDimension = function() {
    canvas.width = $(scene_el).width() - resizer.getSimpleSize(100);
    canvas.height = $(scene_el).height();
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    $(canvas).css('background-color', '#FFF');
    $('#paint_menu').css('width', resizer.getSimpleSize(100));
    drawPaintMenu();
  };

  var drawPaintMenu = function(){
    _.each(colors, function(value, key){
      $('#'+key).css({
        'width': resizer.getSimpleSize(100),
        'height': resizer.getSimpleSize(35),
        'left': resizer.getSimpleSize(-25),
      });
    });

    //la goma
    $('#eraser').css({
      'width': resizer.getSimpleSize(100),
      'height': resizer.getSimpleSize(58),
      'margin-bottom': resizer.getSimpleSize(10),
      'margin-top': resizer.getSimpleSize(10),
    });
    //Limpiar
    $('#clear').css({
      'width': resizer.getSimpleSize(100),
      'height': resizer.getSimpleSize(58),
      'margin-bottom': resizer.getSimpleSize(10),
    });
    //Terminar
    $('#done').css({
      'width': resizer.getSimpleSize(100),
      'height': resizer.getSimpleSize(58),
    });
    initPaintMenuEvents();
    //Inicializar el color por defecto
    activateTool('red');

  };

  var initPaintMenuEvents = function(){
    $('.color_menu').on('click', function(e){
      var val = e.target.id;
      if(val !== 'erase' && val !== 'clear' && val !== 'done'){
        setColor(e.target.id);
        activateTool(e.target.id);
      }
      if(val === 'eraser'){
        activateEraser();
        activateTool('eraser');
      }
      if(val === 'clear'){
        clearCanvas();
      }
      if(val === 'done'){
        //Terminar...?
        openSnapshot();
      }
    });
  };

  var activateTool = function(t){
    _.each($('.color_menu'), function(el){
      $(el).removeClass('active');
    });
    if(t !== 'clear' && t !== 'done'){
      $('#'+t).addClass('active');
    }
  }

  var setColor = function(val){
    curColor = colors[val];
    deActivateEraser();
  };

  var initializeEvents = function() {
    if (mobile) {
      canvas.addEventListener('touchstart', startPaint, false);
      canvas.addEventListener('touchmove', continuePaint, false);
      canvas.addEventListener('touchleave', stopPaint, false);
      canvas.addEventListener('touchend', stopPaint, false);
    } else {
      canvas.addEventListener('mousedown', startPaint, false);
      canvas.addEventListener('mousemove', continuePaint, false);
      canvas.addEventListener('mouseleave', stopPaint, false);
      canvas.addEventListener('mouseup', stopPaint, false);
    }
  };

  var activateEraser = function() {
    if (eraser === "off") {
      eraser = "active";
      _globalCompositeOperation = "destination-out";
    }
  };

  var deActivateEraser = function() {
    eraser = "off";
    _globalCompositeOperation = "source-over";
  };

  var clearCanvas = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;
    drawImage(context);
  }

  var startPaint = function(evt) {

    evt.preventDefault();
    canX = evt.pageX - canvas.offsetParent.offsetLeft;
    canY = evt.pageY - canvas.offsetParent.offsetTop;
    if (curType === "brush") {
      buttonDown = true;
      context.beginPath();
      context.moveTo(canX, canY);

      var radios = curSize * 0.5;
      context.fillStyle = curColor;
      if (eraser === "active") {
        context.fillStyle = g_curColor;
      }
      //Dibujar un pumto
      context.lineWidth = 1;
      context.arc(canX, canY, radios, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      //context.translate(0.5, 0.5);
      //Calcular la posición del cursor relativa al container
      if (mobile) {
        canX = Math.round(evt.targetTouches[0].pageX - canvas.offsetParent.offsetLeft);
        canY = Math.round(evt.targetTouches[0].pageY - canvas.offsetParent.offsetTop);
      } else {
        canX = Math.round(evt.pageX - canvas.offsetParent.offsetLeft);
        canY = Math.round(evt.pageY - canvas.offsetParent.offsetTop);
      }
      context.moveTo(canX, canY);
      drawImage(context);
      context.globalCompositeOperation = _globalCompositeOperation;
    }
  };

  var continuePaint = function(evt) {
    if (buttonDown) {
      if (mobile) {
        context.lineTo(Math.round(evt.touches[0].pageX - canvas.offsetParent.offsetLeft), Math.round(evt.touches[0].pageY - canvas.offsetParent.offsetTop));
      } else {
        context.lineTo(Math.round(evt.pageX - canvas.offsetParent.offsetLeft), Math.round(evt.pageY - canvas.offsetParent.offsetTop));
      }
      context.lineWidth = curSize;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = curColor;
      if (eraser === "active") {
        context.strokeStyle = g_curColor;
      }
      context.stroke();
      drawImage(context);
      context.globalCompositeOperation = _globalCompositeOperation;

    }
  };

  var drawImage = function(ctx) {
    if (config.elements.outline && config.elements.outline.image && img_pos) {
      ctx.globalCompositeOperation = "source-over";
      //Atención a cómo debe dibujarse la imagen (por encima, de momento...)
      //Lo más razonable es que la imagen fuera de una línea más fina que la que se dibuja
      ctx.drawImage(img, img_pos.x, img_pos.y, img_size.w, img_size.h);
      ctx.globalCompositeOperation = _globalCompositeOperation;
    }
    if (config.elements.back && config.elements.back.image && img_back_pos) {
      ctx.globalCompositeOperation = "destination-over";
      //Atención a cómo debe dibujarse la imagen (por encima, de momento...)
      //Lo más razonable es que la imagen fuera de una línea más fina que la que se dibuja
      ctx.drawImage(img_back, img_back_pos.x, img_back_pos.y, img_back_size.w, img_back_size.h);
      ctx.globalCompositeOperation = _globalCompositeOperation;
    }
  };

  var stopPaint = function() {
    drawImage(context);
    buttonDown = false;
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

  var drawCanvasContents = function(){
    return new Promise(function(resolve, reject){
      var container = document.getElementById('container');
      $(container).append(container_contents);
      $(container).css({
        "border": "1px solid #ccc"
      });
      resolve();
    })
  };

  var drawCanvas = function(els) {
    var container = document.getElementById('container');
    var ratio;
    return new Promise(function(resolve, reject) {
      return drawCanvasContents().then(function(){
        //Configurar la superficie de pintado
        mobile = is_mobile();
        canvas = document.getElementById('paintBox');
        context = canvas.getContext('2d');
        clearBtn = document.getElementById('clearBtn');
        setCanvasDimension();
        //Iniciar al escucha de eventos
        initializeEvents();
        //Ver si tiene imagen de calcado
        if (config.elements.outline) {
          img = media.getImage(config.elements.outline.image);
          //Calcular el tamaño
          if (config.elements.outline.size && config.elements.outline.size.w !== 'auto') {
            img_size = resizer.getSize(config.elements.outline.size);
          } else {
            //Calcular el tamaño de la imagen dependiendo del alto
            ratio = $(canvas).height() / img.height;
            img_size = {
              w: img.width * ratio,
              h: $(canvas).height()
            };
          }
          //Calcular la posición
          if (config.elements.outline.pos && config.elements.outline.pos.x !== 'auto') {
            img_pos = resizer.getPosition(config.elements.outline.pos);
          } else {
            //Calcular la posicion de la imagen
            img_pos = {
              x: Math.floor(($(canvas).width() - img_size.w) / 2),
              y: Math.floor(($(canvas).height() - img_size.h) / 2)
            };
          }
          drawImage(context);
        }
        if (config.elements.back) {
          img_back = media.getImage(config.elements.back.image);
          //Calcular el tamaño
          if (config.elements.back.size && config.elements.back.size.w !== 'auto') {
            img_back_size = resizer.getSize(config.elements.back.size);
          } else {
            //Calcular el tamaño de la imagen dependiendo del alto
            ratio = $(canvas).height() / img_back.height;
            img_back_size = {
              w: img_back.width * ratio,
              h: $(canvas).height()
            };
          }
          //Calcular la posición

          if (config.elements.back.pos && config.elements.back.pos.x !== 'auto') {
            img_back_pos = resizer.getPosition(config.elements.back.image.pos);
          } else {
            //Calcular la posicion de la imagen
            img_back_pos = {
              x: Math.floor(($(canvas).width() - img_back_size.w) / 2),
              y: Math.floor(($(canvas).height() - img_back_size.h) / 2)
            };
          }
          drawImage(context);
        }
        resolve();
      });
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
