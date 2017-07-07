const Promise = require("bluebird");

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
        return resolve();
      });
    });
  };

  var drawElements = function () {
    return new Promise(function (resolve, reject) {
      _.each(config.elements, function (value, key) {

        if (value.type !== "audio") {
          el = "<div id='" + key + "'></div>";
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
      'background-size': "contain"
    });
  };

  var destroy = function () {
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
