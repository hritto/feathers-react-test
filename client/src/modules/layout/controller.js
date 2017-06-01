const LayoutController = function() {
  let options = null;
  let model = null;
  let sb = null;


  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    const feathersClient = feathers()
        .configure(feathers.rest(serverUrl).fetch(fetch))
    const users = feathersClient.service('/users');
    return users.find().then(results => {

      model.setRecords(results.data);
      //console.log(model.getRecords());
    });
    /*
    Promise.all([
      users.create({ email: '2jane.doe@gmail.com', password: '11111', role: 'admin' }),
      users.create({ email: '2john.doe@gmail.com', password: '22222', role: 'user' }),
      users.create({ email: '2judy.doe@gmail.com', password: '33333', role: 'user' })
    ])
      .then(results => {
        console.log('created Jane Doe item\n', results[0]);
        console.log('created John Doe item\n', results[1]);
        console.log('created Judy Doe item\n', results[2]);

        return users.find()
          .then(results => console.log('find all items\n', results));
      })
      .catch(err => console.log('Error occurred:', err));
      */
  };



  const setLanguage = (data) =>{
    //CommonJS.I18n.setLocale(data.lang);
    //location.href =  '/?locale=' + data.lang + '&' + $.param( CommonJS.ApplicationContext.getRequestParams() );
  };

  const onAddClick = (el) => {
    /*
    model.addUser(
      {id: 4, name: 'Joselin'}
    );
    */
  };

  const setState = (state) => {
    model.setState(state);
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    destroy: destroy,
    setLanguage: setLanguage,
    setState: setState,
    onAddClick: onAddClick
  };
};

export default LayoutController;
