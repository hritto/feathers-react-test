const Promise = require("bluebird");
import CommonJS from '../common/current_user.js';
//import feathersServices from '../common/feathers_client';
import client from '../common/client.js';

const LoginController = function () {
  let options = null;
  let model = null;
  let sb = null;
  const users = client.service('users');

  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
  };

  const setCurrentUser = (token, st) => {
    return users.find({
      query: {
        email: st.email
      }
    }).then(results => {
      if (results && results.data) {
        CommonJS.CurrentUser.setUserData(results.data[0]);
        model.set('current_user', results.data[0], true);
        sb.emit("application.login");
      }
    });
  };



  const userAuthenticate = (data) => {
    return new Promise(function (resolve, reject) {
      client.authenticate(data).then(token => {
        resolve(token);
      }).catch((error) => {
        reject(error);
      })
    })
  };


  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    setCurrentUser: setCurrentUser,
    userAuthenticate: userAuthenticate,
    destroy: destroy,
  };
};

export default LoginController;
