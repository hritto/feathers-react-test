let corePlugins = corePlugins || {};
const _sa = require("scaleapp");
const Promise = require("bluebird");
const _ = require('lodash');


corePlugins.ScaleAppPromises = function(core, options) {
    'use strict';

    /* Inicializar el plugin
     */
    const onPluginInit = (instanceSandbox, options) => {};

    /* Liberar medios
     */
    const onPluginDestroy = () => {};

    const moduleStart = (core, module, options) => {
        return new Promise(function(resolve, reject) {
            core.start(module, options,
                function() {
                    resolve();
                }
            );
        });
    };

    const moduleStop = (core, module, options) => {
        return new Promise(function(resolve, error) {
            console.log("detener " + module);
            core.stop(module, function() {
                resolve();
            });
        });
    };

    const isModuleRunning = (module) => {
        return _.findIndex(core.lsInstances(), function(instance) {
            return instance === module;
        }) >= 0;
    };

    const moduleEmit = (start_event, end_event, data) => {
        return new Promise(function(resolve, reject) {
            var subscription;

            // Subscribirse a cuando el stage haya terminado de mostrar el cast
            subscription = core.on(end_event, function(eventData) {
                subscription.detach();
                resolve(eventData);
            });

            //Esconder la liga (evento)
            core.emit(start_event, data);
        });
    };


    // Extender el core
    _.extend(core, {
        promise: {
            moduleStart: moduleStart,
            moduleStop: moduleStop,
            isModuleRunning: isModuleRunning,
            moduleEmit: moduleEmit
        }
    }, this);

    // Extender el sandbox
    _.extend(core.Sandbox.prototype, {
        promise: {
            moduleStart: moduleStart,
            moduleStop: moduleStop,
            isModuleRunning: isModuleRunning,
            moduleEmit: moduleEmit
        }
    }, this);

    return {
        init: onPluginInit,
        destroy: onPluginDestroy
    };
};

module.exports = {
    module: corePlugins.ScaleAppPromises
};
