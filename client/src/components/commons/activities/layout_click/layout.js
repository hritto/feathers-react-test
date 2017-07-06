const Layout = (options, common_options, main_app) => {

  var animation_timer = null;
  var media = null;
  var config = options;
  var resizer = null;
  var $main_el = null;
  var $scene_el = null;
  var ratio = null;
  var menu = null;
  var common_config = common_options;
  var app = main_app;

  var initialize = function (resizer_obj) {

    resizer = resizer_obj;
    $main_el = $('#' + config.main_el);
    $scene_el = $('#' + config.scene_el);

    return initializeWindow().then(function () {
      return Promise.resolve();
    });
  };

  var initializeWindow = function () {
    return new Promise(function (resolve, reject) {
      windowResize();
      resolve();
    });
  };

  var windowResize = function (e) {
    //Set main position
    var outer = resizer.getSceneConfig();
    var inner = resizer.getActivitySceneConfig();
    $main_el.css({
      'width': outer.size.w,
      'height': outer.size.h,
      'top': outer.pos.y,
      'left': outer.pos.x
    });
    $scene_el.css({
      'width': inner.size.w,
      'height': inner.size.h,
      'top': inner.pos.y,
      'left': inner.pos.x
    });
  };


  var destroy = function (done) {

  };

  return {
    init: initialize,
    destroy: destroy
  };
};

export default Layout;
