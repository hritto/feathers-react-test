const Promise = require("bluebird");
import signals from 'signals';

const SoundLibrary = () => {

    var bufferArray = [];
    var soundObj = {};

    var context, current_id, playing_timer = null,
        start_time, timer_rate = 200,
        current_duration, timeout_duration, playing_promise = false;

    const on = {
        playing: new signals.Signal(),
        end: new signals.Signal(),
        pause: new signals.Signal(),
        sound_error: new signals.Signal()
    };

    var global_promise_play;
    var sounded = [];

    var init = function(buffer_list, audio_context) {

        context = audio_context;

        //Me guardo la referencia del array de buffers, por si tengo que crear más sources
        //Cada bufferSource puede usarse solo una vez!
        bufferArray = buffer_list;

        //En tablets refrescamos el progress bar cada 1s para evitar sobrecarga...
        if (is_iPad()) {
            timer_rate = 500;
        }
    };

    var createAudio = function(audioname, audioSrc) {
        //No se usa en Web Audio Api
    };

    var play = function(id, array) {

        if (playing_promise) {
            if (array) { //Si es un array de sonidos, solo puede sonar uno a la vez, no hace falta cancelar
                playing_promise = false;
            } else {
                // console.log("Cancelar el timeout ---->");
                global_promise_play.cancel();
            }
        }
        //Guardamos el id que suena
        sounded.push(id);

        playing_promise = true; //Comienza la reproducción

        promisePlaySound(id, array)
        .catch (function(message) {
            on.sound_error.dispatch(getErrorData(message));
        }).then(function(e) {
            return onEndSound(id);
        });
    };

    var promisePlaySound = function(id, array) {

        if (context && bufferArray[id]) {
            var sound_obj = soundObj;

            global_promise_play = new Promise(function(resolve, reject) { //Solo puede haber un promise a la vez...
                try {
                    //Crear el buffer de audio cuando hay que reproducirlo
                    sound_obj[id] = context.createBufferSource();
                    sound_obj[id].buffer = bufferArray[id];

                    sound_obj[id].connect(context.destination);
                    sound_obj[id].onended = resolve;
                    current_duration = sound_obj[id].buffer.duration * 1250;
                    timeout_duration = current_duration + 1000; //tolerancia de timeout

                    current_id = id;
                    start_time = context.currentTime;

                    //Si es un array de sonidos (soundreckon)
                    //nos ahorramos el timer del progress
                    //if (!array) {
                    playing_timer = setTimeout(timeout_trigger, 100);
                    //}

                    //Reproducir ***Patch para viejas versiones de iOS que usan noteOn
                    if (!soundObj[id].start){
                      soundObj[id].start = soundObj[id].noteOn;
                    }
                    sound_obj[id].start(0);
                } catch (e) {
                    //playing_promise = false;
                    return Promise.reject(e.message);
                }
            }).catch(function(err) {
                // console.log("cancel");
            });

            return global_promise_play;
        } else {
            return Promise.reject("El sonido no existe o no se ha cargado correctamente");
        }
    };


    var getErrorData = function(message) {
        var text = message;
        text += "<br>Por favor, pulse el botón para seguir con las actividades.";
        return {
            error: "sound_error",
            modal: {
                text: text,
                btn_txt: "Continuar",
            }
        };
    };

    var onWhilePlaying = function() {

        var total = bufferArray[current_id].duration;

        var data = {
            id: current_id,
            position: context.currentTime - start_time,
            total: total
        };

        //console.log(data.total);
        on.playing.dispatch(data);
    };

    var stop = function(sound) {
        var current_sound = current_id;
        if (sound) {
            current_sound = sound;
        }
        if (current_sound) {
            if (context.currentTime - start_time > 0 && soundObj[current_sound] !== null) {
                //Detener ***Patch para viejas versiones de iOS que usan noteOff
                if (_.isFunction(soundObj[current_sound].stop)) {
                    soundObj[current_sound].stop(0);
                } else {
                    soundObj[current_sound].noteOff(0);
                }
                global_promise_play.cancel();
                onEndSound(current_sound);
            }
        }
    };

    var pause = function() {
        //Ya no se usa...
        if (context.currentTime - start_time > 0 && soundObj[current_id] !== null) {
            //Detener
            if (!soundObj[current_id].stop){
              soundObj[current_id].stop = soundObj[current_id].noteOff;
            }
            soundObj[current_id].stop(0);

            //Reset del audio por si tiene que volver a sonar
            //Ese source ya no sirve...
            soundObj[current_id].onended = null;
            soundObj[current_id] = null;

            // Hay que notificar
            on.pause.dispatch({
                id: current_id
            });

            if (playing_timer) {
                clearTimeout(playing_timer);
                playing_timer = null;
            }
            playing_promise = false;
        }
    };

    var stopAllSounds = function(end) {

        var keys_arr = Object.keys(soundObj);

        if (keys_arr.length) {
            for (var i = 0; i > keys_arr.length; i++) {
                if (soundObj[keys_arr[i]]) {
                    if (context.currentTime - start_time > 0) {
                        //Detener
                        stop(keys_arr[i]);
                    }
                }
            }
        }
        // Fix para web audio api
        // Si han sonado audios simultáneos, asegurarse de que
        // se detienen y se quitan los eventos de todos
        _.each(sounded, function(id) {
            soundObj[id].stop(0);
            onEndSound(id);
        }, this);

        sounded = [];

    };

    var isPlayingSound = function() {
        //Si aún no ha sonado ningún audio
        if (!context) {
            return false;
        }

        if (context.currentTime - start_time > 0 && soundObj[current_id]) {
            return true;
        }
        return false;
    };

    var timeout_trigger = function() {
        if (playing_timer) {
            clearTimeout(playing_timer);
            playing_timer = null;
        }
        onWhilePlaying();
        playing_timer = setTimeout(timeout_trigger, timer_rate);
    };

    var onEndSound = function(sound) {

        var current_sound = current_id;
        if (sound) {
            current_sound = sound;
        }

        if (playing_timer) {
            clearTimeout(playing_timer);
            playing_timer = null;
        }


        //Lo quitamos del array de sonados
        var index = sounded.indexOf(current_sound);
        if (index > -1) {
            sounded.splice(index, 1);
        }

        //Reset del audio por si tiene que volver a sonar
        //Ese source ya no sirve... desuscribimos eventos y borramos la referencia al buffer
        if (soundObj[current_sound]) {
            soundObj[current_sound].onended = null;
            soundObj[current_sound] = null;
        }
        var data = {
            id: current_sound
        };

        // Hay que notificar
        on.end.dispatch(data);
        playing_promise = false;
    };

    var is_iPad = function() {
        if (navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/)) {
            return true;
        }
        return false;
    };


    var destroy = function() {
        console.log("DESTROY SOUND LIBRARY");
        soundObj = {};
        context = null;
        bufferArray = [];
        playing_timer = null;
    };

    return {
        createAudio: createAudio,
        destroy: destroy,
        play: play,
        stop: stop,
        pause: pause,
        stopAllSounds: stopAllSounds,
        on: on,
        isPlayingSound: isPlayingSound,
        init: init
    };

};
export default SoundLibrary;
