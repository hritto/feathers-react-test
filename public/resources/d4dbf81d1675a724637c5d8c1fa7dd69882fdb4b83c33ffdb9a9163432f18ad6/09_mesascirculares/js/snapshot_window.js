NS('AnayaInfantil');



AnayaInfantil.snapshotWindow = function(med, rez) {
  'use strict';

  var media = med;
  var config = {
    "background_color": '#FFF', //Si se desea, se puede poner una imagen de fondo
    "size": {
      "w": 800,
      "h": 500
    }
  };
  var resizer = rez;
  var image = null;

  var initialize = function(img){
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var calc_top;
    var calc_left;
    var size;
    image = img;
    return new Promise(function(resolve, reject){
      $('#snapshot_content').html("");
      $('#snapshot_content').css("background-color", config.background_color);
      calc_top = (resizer.getOuterBounds().h - resizer.getSize(config.size).h) / 2;
      calc_left = (resizer.getOuterBounds().w - resizer.getSize(config.size).w) / 2;
      size = resizer.getSize(config.size);
      $('#snapshot_content').css({
        width: size.w,
        height: size.h,
        top: calc_top,
        left: calc_left
      });

      return setUpInitContents(image).then(function(){
        $('#snapshotWindow').css('display','block');
        $('#snapshot_content').animateCss('bounceInUp');

        $('#snapshotWindow').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $('#snapshotWindow').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
          $('#snapshot_content').removeClass();
          //Escuchar a los eventos de save o discard
          $('#save').on('click', function(){
            //guardar la imagen el local storage
            return saveImagePromise(image).then(function(data){
              if(data === "ok"){
                $('#snapshot_content').addClass('with_close');
                $('#snapshot_content').html("<div class='alert_save_ok'><span class='snapsot_title'>¡La imagen se ha guardado en la galería!</span><br>Puedes acceder a la galería de tus imágenes desde el menú principal...</div>");
                $('.alert_save_ok').css("padding-top", resizer.getSimpleSize(170));
                $('.alert_save_ok').on('click', function(){
                  $('.alert_save_ok').off('click');
                  closeWin(resolve, false);
                });
              } else {
                $('#snapshot_content').html("<div class='alert_save_ko'><span class='snapsot_title'>¡Lo sentimos!</span><br>No hay sufuciente espacio para guardar la imagen...<br>Si lo deseas, puedes borrar imágenes en la galería para tener espacio.</div>");
                $('.alert_save_ko').css("padding-top", resizer.getSimpleSize(170));
                $('.alert_save_ko').on('click', function(){
                  $('.alert_save_ko').off('click');
                  closeWin(resolve, true);
                });
              }
            });
          });

          $('#discard').on('click', function(){
            closeWin(resolve, true);
          });
        });
      });
    });
  };

  var saveImagePromise = function(img){
    var str = localStorage.getItem('image_gallery');
    var hash = {};
    return new Promise(function(resolve, reject){
      //Si el hash existe ya, parsearlo
      if(str && str.length){
        hash = JSON.parse(str);
      }
      //Agregar al hash la imagen creada
      hash['imagen_' + Math.floor(Date.now() / 1000)] = {
        image: img,
        key: 'imagen_' + Math.floor(Date.now() / 1000),
        w: $('#image_snap').width(),
        h: $('#image_snap').height()
      };
      //Guardarla en local storage si hay sitio
      try {
        localStorage.setItem('image_gallery', JSON.stringify(hash));
        return resolve("ok");
      }
      catch(err) {
        return resolve("ko");
      }

    });
  };

  var closeWin = function(done, discard){
    $('#snapshotWindow').animateCss('fadeOut');
    $('#snapshotWindow').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $('#snapshot_content').removeClass();
      $('#snapshotWindow').css('display','none');
      $('#snapshotWindow').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
      return done(discard);
    });
  }

  var setUpInitContents = function(img){
    var el = "<div id='snap'><img id='image_snap' src='"+img+"'><div id='save'></div><div id='discard'></div></div>";
    return new Promise(function(resolve, reject){
      $('#snapshot_content').append(el);
      return resolve();
    });
  };

  var destroy = function(){
    config = null;
    $('#snapshot_content').html("");
  };

  return {
    init: initialize,
    destroy: destroy
  }

};
