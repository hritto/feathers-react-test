let corePlugins = corePlugins || {};
const _sa = require("scaleapp");
const Promise = require("bluebird");

corePlugins.ScaleUtil = function(core, options) {
    'use strict';

    const detachSubscriptions = (subs) => {
        //_.each(subs, detachSubscription);
        var keys = Object.keys(subs);
        for (var i = 0; i < _.size(subs); i++) {

            if (subs[keys[i]]) {
                subs[keys[i]].detach();
                subs[keys[i]] = null;
            }
        }
        keys = null;
    };

    const detachSubscription = (subscription) => {
        if (subscription) {
            subscription.detach();
            subscription = null;
        }
    };

    // Extender el core
    _.extend(core, {
        util: {
            detachSubscriptions: detachSubscriptions,
            detachSubscription: detachSubscription
        }
    }, this);

    // Extender el sandbox
    _.extend(core.Sandbox.prototype, {
        util: {
            detachSubscriptions: detachSubscriptions,
            detachSubscription: detachSubscription
        }
    }, this);
};

module.exports = {
    module: corePlugins.ScaleUtil
};
