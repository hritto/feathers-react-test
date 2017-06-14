module.exports = {
  validateField: function(data, name, config){
    let is_valid = true;
    if(config){
      let validations = config.validation;
      _.each(config.validation, function(validate, key){
        //Regla para required
        if(key ==='required'){
          if(!data || (data && data.trim() === '')){
            is_valid = false;
          }
        }
        //Regla para email
        if(key ==='email'){
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          is_valid = re.test(data);
        }
      });
    }
    return is_valid;
  },
}
