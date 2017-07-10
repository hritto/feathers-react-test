const Promise = require("bluebird");

const media = (options) => {

  // Array de los objetos imagenes
  var images = {};

  // Guardar los tamaños de las imagenes
  var images_sizes = {};

  // Array de los objetos sonido
  var sounds = {};

  // Objeto encargado de la gestion de sonido
  var sound_object = null;

  //Array de buffers de audio
  var sound_buffer = [];
  var audio_context = null;

  // Archivos cargados
  var loaded = 0;

  // Total de mendios a cargar
  var total = 0;

  var getLoaded = function () {
    return loaded;
  };
  var setLoaded = function (load) {
    loaded = load;
  };

  var media_hash = {};
  //La función de callback a llamar cada vez que se termina de cargar
  //un assets (muestra el progreso)
  var callback = null;

  var setTotal = function (media_hash) {
    total = Object.keys(media_hash.images).length;
  };

  var setSoundBuffer = function (buffer_arr) {
    sound_buffer = buffer_arr;
  };

  var publishProgress = function (callback) {
    var data_p = {
      total: total,
      progress: (getLoaded() * 100) / total,
      loaded: getLoaded()
    };
    callback(data_p);
  };

  var allMedia = function (options) {
    var media_hash;
    var default_assets = {
      images: {
        'no_image': 'no_image.png'
      },
      sounds: {}
    };
    media_hash = _.merge(default_assets, options.assets);
    _.each(media_hash.sounds, function (value, key) {
      if (_.isString(value)) {
        media_hash.sounds[key] = value;
      } else {
        if (value.mp3) {
          media_hash.sounds[key].mp3 = value.mp3;
        }
        if (value.ogg) {
          media_hash.sounds[key].ogg = value.ogg;
        }
      }
    }, this);
    return media_hash;
  };

  var isIOS7 = function () {
    var deviceAgent = navigator.userAgent.toLowerCase();
    return /(iphone|ipod|ipad).* os 7_/.test(deviceAgent);
  };

  var isAndroidOld = function () {
    var ua = navigator.userAgent;

    if (ua.indexOf("Android") >= 0) {
      var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8));
      return androidversion < 4.4;
    }
    return false;
  };

  var loadMedia = function (asset_dirs, media_hash, callback_func) {
    loaded = 0;
    total = 0;
    callback = callback_func;

    media_hash = allMedia({
      asset_dirs: asset_dirs,
      assets: media_hash
    });

    // Calcular el total de medios a cargar
    setTotal(media_hash);
    // Notificar progreso de carga
    publishProgress(callback);
    return loadImages(asset_dirs, media_hash.images, options);
    /*promiseLoadImage('no_image', 'uploads/media/', options).then(function () {
      return loadImages(asset_dirs, media_hash.images, options);
    });*/
  };

  var imageOnLoad = function (image, key, url) {
    loaded = loaded + 1;
    // Notificar del progreso
    publishProgress(callback);
    console.log(key);
    // Guardar el tamaño de las imagenes
    var size = {
      w: image.width,
      h: image.height
    };

    images_sizes[key] = size;
    images[key] = image;
  };


  var promiseLoadImage = function (key, url, options) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function (e) {
        image.onload = null;
        resolve({
          image: image,
          key: key,
          url: url
        });
      };
      image.onerror = function () {
        resolve({
          image: getImage('no_image'),
          key: key,
          url: url
        });
        image.onerror = null;
      };
      image.src = url;
    });
  };

  var loadImages = function (asset_dirs, images_hash, options) {
    var url;
    return Promise.reduce(Object.keys(images_hash), function (index, key) {
      url = asset_dirs + images_hash[key];
      return promiseLoadImage(key, url, options).then(function (data) {
        imageOnLoad(data.image, data.key, data.url);
        return true;
      });
    }, 0);
  };

  var getImage = function (key) {
    return images[key];
  };

  var getImages = function () {
    return images;
  };

  var getImageSize = function (key) {
    return images_sizes[key];
  };

  var getSound = function (key) {
    return sounds[key];
  };

  var deleteImage = function (e) {
    var img = e.target;
    img = null;
  };

  var promiseDestroy = function () {
    return new Promise(function (resolve, reject) {
      // Liberando imagenes
      var keys_arr = Object.keys(images),
        i = 0,
        index_key = null;
      images = {};
      sounds = {};
      setLoaded(0);
      total = 0;
      return resolve();
    });
  };

  var getSoundLibrary = function () {
    return sound_object;
  };

  var isFirefox = function () { //Hack sniffing
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  };

  var is_android_Chrome = function () {
    if (navigator.userAgent.match(/Android/i)) {
      return true;
    }
    return false;
  };

  var getErrorData = function (key, url, message) {
    var text = "Fallo al decodificar sonido: " + url + ".";
    text += "<br>" + message + ".";
    text += "<br>Por favor, pulse el botón para seguir con las actividades.";
    return {
      key: key,
      url: url,
      error: "sound_error",
      modal: {
        text: text,
        btn_txt: "Continuar",
      }
    };
  };

  return {
    loadMedia: loadMedia,
    getImage: getImage,
    getImageSize: getImageSize,
    getImages: getImages,
    promiseDestroy: promiseDestroy,
    getSoundLibrary: getSoundLibrary
  };
};

export default media;
