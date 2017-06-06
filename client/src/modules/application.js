let App = App || {};
import _sa from 'scaleapp';
import Promise from 'bluebird';
import _SaInit from '../core-plugins/init';
import _SaModulesInit from './init';

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

    const initialize = (opts) => {
      core = new _sa.Core();
      // Inicializar los plugins del Core
      _SaInit.module.initialize(core);
      // Inicializar modulos
      _SaModulesInit.module.init.initialize(core);
      core.boot();

      core.promise.moduleStart(core, "Layout", {
          options: {
              el: 'app'
          }
      }).then(function(){
        core.promise.moduleStart(core, "Users", {
            options: {
                el: 'main_content'
            }
        })
      });
    };

    var destroy = function() {

    };

    return {
        initialize: initialize,
        destroy: destroy
    };
};

module.exports = {
    module: App
};
