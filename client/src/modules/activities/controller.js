const Promise = require("bluebird");
import ResponsiveHelper from '../common/responsive_helpers.js';
import feathersServices from '../common/feathers_client';

const ActivitiesController = function() {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    ResponsiveHelper();
    return feathersServices.activities.find().then(results => {
      model.set('records', results.data, true);
    });
    /*
    //Seed
    var act_data = {
      name: 'Actividad Test',
      activity_type:'click',
      level: 1,
      published: true,
      code_id: '6IZHe1gFlVfWvBbn' 
    };
    Promise.all([
        feathersServices.activities.create(act_data),
      ]).then(results => {
          console.log('created Jane Doe item\n', results[0]);
          return feathersServices.activities.find().then(results => console.log('find all items\n', results));
      }).catch(err => console.log('Error occurred:', err));
    */
  };

  const itemClick = (opts) => {
    if(opts.action === 'update'){
      updClick(opts);
    }

    if(opts.action === 'create'){
      addClick(opts);
    }

    if(opts.action === 'delete'){
      setSelectedRecord(opts, getLocalRecord(opts), false);
      model.set('state', opts.action, true);
    }
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    itemClick: itemClick,
    destroy: destroy
  };
};

export default ActivitiesController;
