const Promise = require("bluebird");

(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

const LayoutController = function() {
  let options = null;
  let model = null;
  let sb = null;

  const attachWindowEvents = () => {
    window.addEventListener("optimizedResize", function() {
      onWindowResize();
    });
  };

  const onWindowResize = () => {
    console.log("resize")
    let viewportWidth = document.documentElement.clientWidth;
    let min_width = 768; // El ancho minimo responsive
    let actual_layout = model.getter('layout');
    if(viewportWidth < min_width && actual_layout === "wide"){
      //setter(prop, value, dispatch)
      model.setter('visible', false, true);
      Promise.delay(500).then(function(){
        model.setter('layout', 'small', false);
        model.setter('animation', 'overlay', true);
      });
    }
    if(viewportWidth > min_width && actual_layout === "small"){
      model.setter('visible', true, true);
      Promise.delay(500).then(function(){
        model.setter('layout', 'wide', false);
        model.setter('animation', 'push', true);
      });
    }
  };


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    attachWindowEvents();
    //onWindowResize();
  };

  const toggleVisibility = () => {
    model.setter('visible', !model.getter('visible'), true);
  };

  const detachWindowEvents = () => {
    window.removeEventListener("optimizedResize");
  };

  const setLanguage = (data) =>{
    //CommonJS.I18n.setLocale(data.lang);
    //location.href =  '/?locale=' + data.lang + '&' + $.param( CommonJS.ApplicationContext.getRequestParams() );
  };


  const destroy = () => {
    model.destroy();
    detachWindowEvents();
  };

  return {
    initialize: initialize,
    destroy: destroy,
    setLanguage: setLanguage,
    toggleVisibility: toggleVisibility
  };
};

export default LayoutController;
