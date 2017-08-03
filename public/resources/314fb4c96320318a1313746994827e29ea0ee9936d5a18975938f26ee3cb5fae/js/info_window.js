NS('AnayaInfantil');

AnayaInfantil.infoWindow = function(rez) {
  'use strict';

  var config = null;
  var resizer = null;
  var synched_element = null;
  resizer = rez;
  var animations = [];

  var initialize = function(opts){

    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    config = opts;
    var calc_top;
    var calc_left;
    return new Promise(function(resolve, reject){
      $('#info_content').html("");

      if(config.background_image){
        $('#info_content').css("background-image", "url(activity/"+config.background_image+")");
      }
      $('#info_content').css("background-color", config.background_color);
      calc_top = (resizer.getOuterBounds().h - resizer.getSize(config.size).h) / 2;
      calc_left = (resizer.getOuterBounds().w - resizer.getSize(config.size).w) / 2;
      $('#info_content').css({
        width: resizer.getSize(config.size).w,
        height: resizer.getSize(config.size).h,
        top: calc_top,
        left: calc_left
      });

      return setUpInitContents(config).then(function(){
        $('#infoModal').css('display','block');
        $('#info_content').animateCss('bounceInUp');
        $('#infoModal').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $('#infoModal').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
          $('#info_content').removeClass();

          $('#infoModal').off('click').on('click',function(){
            $('#infoModal').animateCss('fadeOut');
            $('#infoModal').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $('#info_content').removeClass();
              $('#infoModal').css('display','none');
              $('#infoModal').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
              return resolve();
            });
          });
        });
      });
    });
  };

  var setUpInitContents = function(opts){
    var options = opts;
    var el;
    return new Promise(function(resolve, reject){
      $('#info_content').html("<div id='content_info'>"+options.text+"</div>");
      $('#content_info').css("font-size", Math.ceil(resizer.getSimpleSize(18)) + "px");
      $('#content_info').css("line-height", Math.ceil(resizer.getSimpleSize(28)) + "px");
      return resolve();
    });
  };

  var destroy = function(){
    config = null;
    $('#info_content').html("");
  };

  return {
    init: initialize,
    destroy: destroy
  }

};
