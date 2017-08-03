NS('AnayaInfantil');

AnayaInfantil.media = function(options) {
  'use strict';

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

  var getLoaded = function() {
    return loaded;
  };
  var setLoaded = function(load) {
    loaded = load;
  };

  var media_hash = {};
  //La función de callback a llamar cada vez que se termina de cargar
  //un assets (muestra el progreso)
  var callback = null;

  var setTotal = function(media_hash) {
    total = (Object.keys(media_hash.images).length + Object.keys(media_hash.sounds).length);
  };

  var setSoundBuffer = function(buffer_arr) {
    sound_buffer = buffer_arr;
  };

  var publishProgress = function(callback) {
    var data_p = {
      total: total,
      progress: (getLoaded() * 100) / total,
      loaded: getLoaded()
    };
    callback(data_p);
  };

  var allMedia = function(options) {
    var media_hash;
    var default_assets = {
      images: {
        'no_image': 'no_image.png'
      },
      sounds: {
        'starter': 'halfsec.mp3',
        "success": {
          "mp3": "success.mp3",
          "ogg": "success.ogg"
        },
        "fail": {
          "mp3": "fail.mp3",
          "ogg": "fail.ogg"
        },
        "ok_1": {
          "mp3": "GENIAL.mp3",
          "ogg": "GENIAL.ogg"
        },
        "ok_2": {
          "mp3": "LO_HAS_CONSEGUIDO.mp3",
          "ogg": "LO_HAS_CONSEGUIDO.ogg"
        },
        "ok_3": {
          "mp3": "QUE_BIEN.mp3",
          "ogg": "QUE_BIEN.ogg"
        },
        "ok_4": {
          "mp3": "YA_ESTA.mp3",
          "ogg": "YA_ESTA.ogg"
        },
        "ko_1": {
          "mp3": "INTENTALO_DE_NUEVO.mp3",
          "ogg": "INTENTALO_DE_NUEVO.ogg"
        },
        "ko_2": {
          "mp3": "NO_NO.mp3",
          "ogg": "NO_NO.ogg"
        },
        "ko_3": {
          "mp3": "PRUEBA_OTRA_VEZ.mp3",
          "ogg": "PRUEBA_OTRA_VEZ.ogg"
        }
      }
    };
    media_hash = _.merge(default_assets, options.assets);
    _.each(media_hash.sounds, function(value, key) {
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

  var isIOS7 = function() {
    var deviceAgent = navigator.userAgent.toLowerCase();
    return /(iphone|ipod|ipad).* os 7_/.test(deviceAgent);
  };

  var isAndroidOld = function(){
    var ua = navigator.userAgent;

    if( ua.indexOf("Android") >= 0 ){
      var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
      return androidversion < 4.4;
    }
    return false;
  };

  var canPlayWebApi = function(){
    return (!isIOS7() && !isAndroidOld());
  };



  var loadSoundEngine = function() {
    var sound_engine;
    // Si no se ha creado la librería o si estamos en tablets Android
    // Bug en Chrome de Android... Hay que crear un nuevo AudioContext
    // http://stackoverflow.com/questions/32236156/webaudio-sound-stops-on-chrome-for-android-after-about-2-minutes
    if (!getSoundLibrary() || is_android_Chrome()) {

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      if (typeof window.AudioContext !== 'undefined' && canPlayWebApi()) { //Web Audio API
      //if (false) {
        if (audio_context) {
          try {
            audio_context.close().then(function() {
              audio_context = null;
              audio_context = new AudioContext();
            });
          } catch (err) { // Si no tiene implementado el close()
            audio_context = null;
            audio_context = new AudioContext();
          }
        } else {
          audio_context = null;
          audio_context = new AudioContext();
        }
        sound_engine = new SoundLibrary.Library();
      } else { // Sin Web Audio API
        sound_engine = new SoundLibrary.Tablet();
      }
      return sound_engine;
    } else {
      return getSoundLibrary();
    }
  };

  var loadMedia = function(asset_dirs, media_hash, callback_func) {
    loaded = 0;
    total = 0;
    callback = callback_func;

    media_hash = allMedia({
      asset_dirs: asset_dirs,
      assets: media_hash
    });

    // cargar el motor de sonidos
    sound_object = loadSoundEngine();
    // Calcular el total de medios a cargar
    setTotal(media_hash);
    // Notificar progreso de carga
    publishProgress(callback);

    promiseLoadImage('no_image', 'images/activity/', options).then(function() {
      return loadImages(asset_dirs, media_hash.images, options).then(function() {
        return loadSounds(media_hash.sounds);
      }).then(function() {
        //Inicializar sonidos
        sound_object.init(sound_buffer, audio_context);
        console.log("Cargados sonidos");
      }).done();
    });
  };

  var loadSoundByHtml5Audio = function(key, url) {
    var audio_url = "audio/" + url;
    return new Promise(function(resolve, reject) {
      sounds[key] = sound_object.createAudio(key, audio_url);
      loaded = loaded + 1;
      // Notificar del progreso
      publishProgress(callback);
      return resolve();
    });

  };

  var loadSoundByWebAudioApi = function(key, url, audio_context) {
    var request, url_str, msg;
    var audio_url = "audio/" + url;

    return new Promise(function(resolve, reject) {
      //console.log("1-Request");
      request = new XMLHttpRequest();
      request.onload = function() {
        resolve(request);
      };
      request.onerror = function() {
        reject(getErrorData(key, url, "El sonido no existe o no está disponible en este momento"));
      };
      request.open("GET", audio_url, true);
      request.responseType = "arraybuffer";
      request.send();

    }).then(function(request) {
      return promiseDecodeAudio(request, key, url_str);
    }).then(function(buffer) {
      // Se ha cargado
      sound_buffer[key] = buffer;
      loaded = loaded + 1;
      // Notificar del progreso
      publishProgress(callback);
    });
  };

  var promiseDecodeAudio = function(request, key, url) {
    if (request.status !== 200) {
      return Promise.reject(getErrorData(key, url, "El sonido no existe o no está disponible en este momento (" + request.status + ")"));
    }
    var source, soundBuffer;
    return new Promise(function(resolve, reject) {
      try {
        // Asynchronously decode the audio file data in request.response
        audio_context.decodeAudioData(request.response, function(buffer) {
          return resolve(buffer);
        }, function() { // only on error attempt to sync on frame boundary
          reject(getErrorData(key, url, "El sonido no se ha descargado correctamente."));
        });
      } catch (e) { //Bug Web Audio API http://stackoverflow.com/questions/10365335/decodeaudiodata-returning-a-null-error
        reject(getErrorData(key, url, "El sonido no ha podido decodificarse o no se ha descargado correctamente"));
      }
    });
  };

  var loadSoundPromise = function(key, url, audio_context) {
    var url_str;
    if (_.isString(url)) {
      url_str = url;
    } else {
      if (isFirefox()) {
        url_str = url.ogg;
      } else {
        url_str = url.mp3;
      }
    }

    if (audio_context) {
      return loadSoundByWebAudioApi(key, url_str, audio_context);
    } else { //Viejo sistema de HTML5 Audio
      return loadSoundByHtml5Audio(key, url_str, audio_context);
    }
  };

  var loadSounds = function(sound_hash, result) {

    var p = [];

    p = _.map(sound_hash, function(url, key) {
      return loadSoundPromise(key, url, audio_context);
    });

    return Promise.all(p);
  };

  var imageOnLoad = function(image, key, url) {
    loaded = loaded + 1;

    // Notificar del progreso
    publishProgress(callback);

    // Guardar el tamaño de las imagenes
    var size = {
      w: image.width,
      h: image.height
    };

    images_sizes[key] = size;
    images[key] = image;
  };

  var promiseLoadImage = function(key, url, options) {
    return new Promise(function(resolve, reject) {
      var image = new Image();
      image.onload = function(e) {
        console.log("cargado: " + url);
        image.onload = null;
        resolve({
          image: image,
          key: key,
          url: url
        });
      };
      image.onerror = function() {
        console.log("ERROR: " + url);
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

  var loadImages = function(asset_dirs, images_hash, options) {
    var url;
    return Promise.reduce(Object.keys(images_hash), function(index, key) {
      url = asset_dirs + images_hash[key];
      return promiseLoadImage(key, url, options).then(function(data) {
        imageOnLoad(data.image, data.key, data.url);
      });
    }, 0);
  };

  var getImage = function(key) {
    return images[key];
  };

  var getImages = function() {
    return images;
  };

  var getImageSize = function(key) {
    return images_sizes[key];
  };

  var getSound = function(key) {
    return sounds[key];
  };

  var deleteImage = function(e) {
    var img = e.target;
    img = null;
  };

  var promiseDestroy = function() {
    return new Promise(function(resolve, reject) {
      // Liberando imagenes
      var keys_arr = Object.keys(images),
        i = 0,
        index_key = null;

      images = {};

      // Liberando sonidos
      //sound_object.destroy();
      sounds = {};

      setLoaded(0);
      total = 0;
      resolve();
      console.log("DESTROYED MEDIA");
    });
  };

  var getSoundLibrary = function() {
    return sound_object;
  };

  var isFirefox = function() { //Hack sniffing
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  };

  var is_android_Chrome = function() {
    if (navigator.userAgent.match(/Android/i)) {
      return true;
    }
    return false;
  };

  var getErrorData = function(key, url, message) {
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
