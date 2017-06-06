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
  const MIN_WIDTH = 768; // El ancho minimo responsive

  const attachWindowEvents = () => {
    window.addEventListener("optimizedResize", function() {
      onWindowResize();
    });
  };

  const onWindowResize = () => {
    let viewportWidth = document.documentElement.clientWidth;
    let actual_layout = model.get('animation');
    adjustResponsiveContents();
    if(viewportWidth < MIN_WIDTH && actual_layout === "push"){
      //setter(prop, value, dispatch)
      model.set('visible', false, true);
      Promise.delay(500).then(function(){
        model.set('animation', 'overlay', true);
      });
    }
    if(viewportWidth > MIN_WIDTH && actual_layout === "overlay"){
      model.set('visible', true, true);
      Promise.delay(500).then(function(){
        model.set('animation', 'push', true);
      });
    }
  };


  const adjustResponsiveContents = () => {
    let viewportWidth = document.documentElement.clientWidth;
    let relative_menu = 180; //El ancho del menú + 20px de margen
    let main_content = document.getElementById('main_content');
    if(!model.get('visible')){
      relative_menu = 30;
    }
    main_content.style.width = viewportWidth - relative_menu + "px"	;
  };

  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    attachWindowEvents();
    adjustResponsiveContents();
  };

  const toggleVisibility = () => {
    model.set('visible', !model.get('visible'), true);
    if(model.get('animation') === 'push'){
      adjustResponsiveContents();
    }
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
