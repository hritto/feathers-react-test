const Promise = require("bluebird");
import client from '../common/client.js';

const NavigationController = function () {
  let options = null;
  let model = null;
  let sb = null;

  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
  };

  const menuClick = (index) => {
    let current_item = model.get('current_item') || 0;
    let config = model.get('config')
    let next = config[index];
    let current = config[current_item];
    let opts = {
      index: index,
      module: next,
      current: current
    };

    if (current.route === next.route) {
      return;
    } else {
      sb.emit("layout.navigation.menuClick", opts);
    }
    model.set('focus_index', index, false);
    model.set('current_item', index, true);
  }

  const logoutClick = () => {
    client.logout();
    window.location.reload();
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    menuClick: menuClick,
    logoutClick: logoutClick,
    destroy: destroy,
  };
};

export default NavigationController;
