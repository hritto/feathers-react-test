const CommonJS = CommonJS || {};

(function() {
    'use strict';
    CommonJS.CurrentUser = {
      config: {
        user_data: null
      },
      getUserData: function() {
        return this.config.user_data;
      },
      setUserData: function(data){
        if(data){
          this.config.user_data = data;
        }
      }
    }
})();

export default CommonJS;
