module.exports = {
  imageParser: function(img){
    let default_img = '/assets/images/avatar/small/user_min.png';
    if(img && img.indexOf('assets')>=0){
      return img;
    }
    if(img && img.length && img.indexOf('uploads') < 0 ){
      return '/uploads/media/'+img;
    }
    if(img && img.length){
      return img;
    }
    return default_img;
  }
};
