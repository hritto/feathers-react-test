let corePlugins = corePlugins || {};
import * as _sa from "scaleapp";
const Promise = require("bluebird");
const _SaPromises = require("./scaleapp-promises.js");
const _SaUtils = require("./scaleapp-util.js");

corePlugins.init = (function() {
    'use strict';

    const initialize = (core, options) => {
        core.use(_sa.plugins.ls);
        core.use(_SaPromises.module);
        core.use(_SaUtils.module);
    };

    return {
        initialize: initialize
    };
})();

module.exports = {
    module: corePlugins.init
};
