const Promise = require("bluebird");
const interact = require("interactjs");

const Scene_0 = function () {

  var config = null;
  var el = null;
  var scene_el = null;
  var scene = null;
  var self = this;
  var el = null;
  var scene_el = '#container';
  var media;
  var intro;
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var elements_layout = {};

  var initialize = function (options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    resizer = resizer_obj;
    layout = layout_obj;

    return render().then(function () {
      return initActivity();
    });
  };

  var initActivity = function () {

  };

  // Funcion que renderiza la escena, despues de cargar las imagenes
  var render = function () {
    elements_layout = config.elements;
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

      //Poner la clase correspondiente a la pantalla
      $('#container').removeClass();
      $('#container').addClass(config.clase);

      //Dibujar los elementos
      return drawElements(config.elements).then(function () {
        //Se ha terminado de renderizar la escena
        return Promise.delay(100).then(function () {
          interact('.resize-drag')
            .draggable({
              onmove: window.dragMoveListener,
              onend: function (event) {
                // recalculateLayout(event);
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
                // recalculateLayout(event);
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
        });
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

    elements_layout[target.id].pos = {
      x: x,
      y: y
    };
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

  var drawElements = function () {
    return new Promise(function (resolve, reject) {
      _.each(config.elements, function (value, key) {

        if (value.type !== "audio") {
          el = "<div class='resize-drag' id='" + key + "' data-x='" + resizer.getPosition(value.pos).x + "' data-y='" + resizer.getPosition(value.pos).y + "'></div>";
          $(scene_el).append(el);
          $('#' + key).css({
            position: 'absolute',
            top: resizer.getPosition(value.pos).y,
            left: resizer.getPosition(value.pos).x
          });
        }
        if (value.type === "image") {
          setupInitImage(value, key);
        }
      });

      return resolve();
    });
  };

  var setupInitImage = function (obj, k) {
    $('#' + k).css({
      "width": resizer.getSize(obj.size).w,
      "height": resizer.getSize(obj.size).h,
      'background-image': 'url("' + media.getImage(obj.image).src + '")',
      'background-repeat': 'no-repeat',
      'background-size': "contain",
      "background-position": "center center",
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

export default Scene_0;
