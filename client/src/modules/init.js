const AppModules = AppModules || {};
const Layout = require('./layout/module.js');
const Navigation = require('./navigation/module.js');
const Users = require('./users/module.js');
const Activities = require('./activities/module.js');


AppModules.init = (function() {
    "use strict";

    /**
     * Registra todos los módulos de la aplicación Configurations en scaleApp
     */
    var initialize = function(core) {
        // Registrar los modulos en el application
        core.register("Layout", Layout.module);
        core.register("Navigation", Navigation.module);
        core.register("Users", Users.module);
        core.register("Activities", Activities.module);
    };

    var destroy = function(){

    };

    return {
        initialize: initialize,
        destroy: destroy
    };
})();

module.exports = {
    module: AppModules
};
