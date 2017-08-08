let App = App || {};
import _sa from 'scaleapp';
import Promise from 'bluebird';
import _SaInit from '../core-plugins/init';
import _SaModulesInit from './init';
import CommonJS from './common/current_user.js';
import client from './common/client.js';


(function() {
  'use strict';

  function reportError(error, message) {
    message = message || '';
    console.error(
      'ERROR: ' + message + ' [' + error.toString() + ']\n' +
      '\nName:\t\t' + (error.name || '-') +
      '\nMessage:\t' + (error.message || '-') +
      '\nFile:\t\t\t' + (error.fileName || '-') +
      '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
      '\nLine #:\t\t' + (error.lineNumber || '-') +
      '\nColumn #:\t' + (error.columnNumber || '-') +
      '\n\nStack:\n\n' + (error.stack || '-')
    );
  }

  window.onerror = function(message, filename, lineno, colno, error) {
    error.fileName = error.fileName || filename || null;
    error.lineNumber = error.lineNumber || lineno || null;
    error.columnNumber = error.columnNumber || colno || null;
    reportError(error, 'Uncatched Exception');
  };

  _sa.Core.prototype.log = {
    error: function(exception) {
      reportError(exception, 'scaleApp.error');
      console.error(exception.message);
    },
    info: function(exception) {
      console.info(exception.message);
    },
    warn: function(exception) {
      // console.warn(exception.message);
    }
  };
})();

App.application = () => {
    'use strict';

    let core = null;
    let modules = null;
    let module_config = null;
    let config = null;
    let subscriptions = {
      navigation_menu_click: null,
      logout: null
    };

    const login = () => {
      client.authenticate().then((response) => {
        if(response && response.accessToken){
          CommonJS.CurrentUser.setUserData(response.user);
          //El usuario está registrado
          if(core.promise.isModuleRunning('Login')){
            return core.promise.moduleStop(core, "Login", {
                options: {
                    el: 'app'
                }
            }).then(function(){
              loadApp();
            });
          } else {
            loadApp();
          }
        } else {
          showLogin();
        }
      }).catch((e) => {
        showLogin(e);
      });
    };

    const initialize = (opts) => {
      core = new _sa.Core();
      // Inicializar los plugins del Core
      _SaInit.module.initialize(core);
      // Inicializar modulos
      _SaModulesInit.module.init.initialize(core);

      core.boot();

      // Atender a eventos de modulos
      subscribeEvents();
      login();
    };


    const showLogin = (error = {}) => {
      if(document.querySelectorAll('.login').length) {
        document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
      } else {
        core.promise.moduleStart(core, "Login", {
            options: {
                el: 'app'
            }
        })

      }
    };


    const loadApp = () => {
      //Iniciar la aplicacion de administracion
      core.promise.moduleStart(core, "Layout", {
          options: {
              el: 'app'
          }
      }).then(function(){
        return core.promise.moduleStart(core, "Navigation", {
            options: {
                el: 'menu_items'
            }
        });
      });
    };

    const subscribeEvents = () => {
      //Atender al evento click de los botones del menu
      subscriptions.navigation_menu_click = core.on("layout.navigation.menuClick", _.bind(onNavigationMenuClick));
      subscriptions.start_module = core.on("application.startModule", _.bind(onStartModule));
      subscriptions.stop_module = core.on("application.stopModule", _.bind(onStopModule));
      subscriptions.login = core.on("application.login", _.bind(login));
      subscriptions.logout = core.on("application.logout", _.bind(onlogOut));
    };

    const unsubscribeEvents = () => {
      core.scaleApp.cleanSubscriptions(subscriptions);
    };

    const promiseStopModules = (data) => {
      return core.scaleApp.moduleStop('Layout').then(function(){

      });
    };

    const onStartModule = (opts) => {
      return core.promise.moduleStart(core, opts.module.modules[0], {instanceId: opts.module.instanceIds[0], options: opts});
    };

    const onStopModule = (opts) => {
      return core.promise.moduleStop(core, opts.modules[0], {options: {el: opts.dom[0]}});
    };

    const onNavigationMenuClick = (options) => {
      // Si no hay un módulo anterior a detener
      // (es el primer módulo a cargar)
      //console.log(core.lsInstances());
      if(!options.current){
        //console.log(options.module.route);
        return moduleStart(options.module.modules, options.module.dom, options.module.config, options.module.instanceIds);
      } else {
        /*
         * Los módulos se arrancan/detienen por nombre de instancia (instanceId)
         * NO por nombre del módulo.
         * El/los instanceIds vienen en un array en configuración
         */
        //Detener el módulo actual
        return moduleStop(options.current.modules, options.current.dom, options.current.instanceIds).then(function(){
          //Arrancar el módulo pedido
          //console.log(options.module.route);
          return moduleStart(options.module.modules, options.module.dom, options.module.config, options.module.instanceIds);
        });
      }
    };

    const moduleStop = (modules, dom_els, ids) => {
      let counter = -1;
      let dom = _.clone(dom_els).reverse();
      let instances = _.clone(ids).reverse();
      return Promise.reduce(_.clone(modules).reverse(), function(index, key) {
          counter++;
          return core.promise.moduleStop(core, instances[counter], {options: {el: dom[counter]}});
      }, 0).then(function(){
        return Promise.resolve();
      });
    };

    const moduleStart = (modules, dom_els, config, ids) => {
      let counter = -1;
      let opts;
      return Promise.reduce(modules, function(index, key) {
        counter++;
        opts = _.merge(config[counter],{el: dom_els[counter]});
        return core.promise.moduleStart(core, key, {instanceId: ids[counter], options: opts});
      }, 0).then(function(){
        return Promise.resolve();
      });
    };

    const onlogOut = () => {
      //logout();
    };

    const destroy = () => {
      // Desatender eventos
      unsubscribeEvents();
    };

    return {
        initialize: initialize,
        destroy: destroy
    };
};

module.exports = {
    module: App
};
