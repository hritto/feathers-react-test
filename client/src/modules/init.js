const AppModules = AppModules || {};
const Layout = require('./layout/module.js');
const Login = require('./login/module.js');
const Navigation = require('./navigation/module.js');
const Users = require('./users/module.js');
const Activities = require('./activities/module.js');
const Preview = require('./preview/module.js');
const Resources = require('./resources/module.js');
const PreviewResource = require('./preview_resource/module.js');
const WorkPlans = require('./workplans/module.js');


AppModules.init = (function() {
    "use strict";

    /**
     * Registra todos los módulos de la aplicación Configurations en scaleApp
     */
    var initialize = function(core) {
        // Registrar los modulos en el application
        core.register("Layout", Layout.module);
        core.register("Login", Login.module);
        core.register("Navigation", Navigation.module);
        core.register("Users", Users.module);
        core.register("Activities", Activities.module);
        core.register("Preview", Preview.module);
        core.register("Resources", Resources.module);
        core.register("PreviewResource", PreviewResource.module);
        core.register("WorkPlans", WorkPlans.module);
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
