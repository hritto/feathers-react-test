const Promise = require("bluebird");

const LoginController = function() {
  let options = null;
  let model = null;
  let sb = null;

  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
  };



  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    destroy: destroy,
  };
};

export default LoginController;
