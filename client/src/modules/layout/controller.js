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
    let viewportWidth = document.documentElement.clientWidth;
    let min_width = 768; // El ancho minimo responsive
    let actual_layout = model.getLayout();
    if(viewportWidth < min_width && actual_layout === "wide"){
      model.setVisibility(false);
      Promise.delay(500).then(function(){
        model.setLayout("small");
      });
    }
    if(viewportWidth > min_width && actual_layout === "small"){
      model.setVisibility(true);
      Promise.delay(500).then(function(){
        model.setLayout("wide");
      });
    }
  };


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    const feathersClient = feathers()
        .configure(feathers.rest(serverUrl).fetch(fetch))
    const users = feathersClient.service('/users');
    return users.find().then(results => {

      model.setRecords(results.data);
      attachWindowEvents();
      onWindowResize();
      //console.log(model.getRecords());
      /*
      Promise.all([
        users.create({ email: '2jane.doe@gmail.com', password: '11111', role: 'admin' }),
        users.create({ email: '2john.doe@gmail.com', password: '22222', role: 'user' }),
        users.create({ email: '2judy.doe@gmail.com', password: '33333', role: 'user' })
      ]).then(results => {
          console.log('created Jane Doe item\n', results[0]);
          console.log('created John Doe item\n', results[1]);
          console.log('created Judy Doe item\n', results[2]);
          return users.find().then(results => console.log('find all items\n', results));
      }).catch(err => console.log('Error occurred:', err));
      */
    });
  };

  const toggleVisibility = () => {
    model.setVisibility(!model.getVisibility());
  };

  const detachWindowEvents = () => {
    window.removeEventListener("optimizedResize");
  };

  const setLanguage = (data) =>{
    //CommonJS.I18n.setLocale(data.lang);
    //location.href =  '/?locale=' + data.lang + '&' + $.param( CommonJS.ApplicationContext.getRequestParams() );
  };

  const onAddClick = (el) => {
    /*
    model.addUser(
      {id: 4, name: 'Joselin'}
    );
    */
  };

  const setState = (state) => {
    model.setState(state);
  };

  const destroy = () => {
    model.destroy();
    detachWindowEvents();
  };

  return {
    initialize: initialize,
    destroy: destroy,
    setLanguage: setLanguage,
    setState: setState,
    onAddClick: onAddClick,
    toggleVisibility: toggleVisibility
  };
};

export default LayoutController;
