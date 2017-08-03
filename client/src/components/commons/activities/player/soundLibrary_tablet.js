const Promise = require("bluebird");
import signals from 'signals';

const SoundLibrary_Tablet = () => {

    var soundObj = {};
    //El objeto de audio (único) que reproduce todos los sonidos reciclándose
    var t_audio;
    //El id del audio que se está sonando, se actualiza cada vez que se llama al play
    var current_id;
    var is_array = false;
    const on = {
        playing: new signals.Signal(),
        end: new signals.Signal(),
        pause: new signals.Signal(),
        sound_error: new signals.Signal()
    };
    var error_emit = null;

    var onError = function(e) {

        if (t_audio) {
            dettachEvents(t_audio);
        }

        if (!error_emit) {
            error_emit = e;
            var data = {
                error: "sound_error",
                text: "Se ha producido un error al cargar un audio.<br>Por favor, pulse el botón para volver a cargar la actividad.",
                btn_txt: "Recargar"
            };

            on.sound_error.dispatch(data);
        }
    };

    var play = function(id, array) {

        is_array = array;

        var url = soundObj[id];
        //La url del sonido que tiene que sonar

        try {
            //Actualizar el sonido que está sonando
            current_id = id;

            if (id && url) { //Si hay un sonido a reproducir y si existe una url que le corresponde

                if (t_audio.src !== url) {
                    t_audio.src = url;
                } else {
                    t_audio.currentTime = 0.1;
                }

                if (t_audio.buffered.length > 0) {
                    t_audio.lastBuffered = t_audio.buffered.end(t_audio.buffered.length - 1);
                }

                //t_audio.addEventListener('canplaythrough', function() {

                t_audio.play();

                // Atamos eventos al objeto de audio (siempre el mismo)
                attachEvents(t_audio);

                //}, false);


            } else {
                //No hay audio asignado o no me ha llegado
                console.log("NO HAY AUDIO A REPRODUCIR");
                //Saltamos al siguiente de la lista (si hay)
                onEndSound(true);
            }

        } catch (e) {
            //Notificar el error
            onError(e);
        }
    };

    var playSound = function() {
        console.log("canplay");

        t_audio.play();

        // Atamos eventos al objeto de audio (siempre el mismo)
        attachEvents(t_audio);
    };



    var stop = function(id) {

        var data = {
            id: current_id
        };

        if (!is_array) {
            // Hay que notificar
            on.end.dispatch(data);
        }

        dettachEvents(t_audio);

        t_audio.pause();

        try {
            t_audio.currentTime = 0.1;
        } catch (e) {
            //Notificar el error
            onError(e);
        }



    };

    var pause = function(id) {

        if (isPlaying(t_audio)) {
            t_audio.pause();
        }

        dettachEvents(t_audio);
        var data = {
            id: current_id
        };

        if (!is_array) {
            // Hay que notificar
            on.pause.dispatch(data);
        }
    };

    var onWhilePlaying = function(e) {
        var audio_duration;

        if (this.duration === Infinity) {
            audio_duration = this.lastBuffered;
        } else {
            audio_duration = this.duration;
        }

        var data = {
            id: current_id,
            position: this.currentTime,
            total: audio_duration
        };

        // Hay que notificar
        on.playing.dispatch(data);
    };

    var onEndSound = function(e) {
        //console.log("terminado: " + current_id);

        dettachEvents(t_audio);

        var data = {
            id: current_id
        };

        try {
            t_audio.currentTime = 0.1;
        } catch (e) {
            //Notificar el error
            onError(e);
        }

        // Hay que notificar
        on.end.dispatch(data);

    };

    var onEndSoundbyPause = function(e) {
        //console.log("terminado: " + current_id);

        dettachEvents(t_audio);

        var data = {
            id: current_id
        };

        // Hay que notificar
        on.end.dispatch(data);
    };


    /*
  Eventos
  */
    var attachEvents = function(sound) {

        // Atamos eventos directamente al objeto sonido
        sound.addEventListener("error", onError, false);
        sound.addEventListener("timeupdate", onWhilePlaying, false);
        sound.addEventListener("ended", onEndSound, false);
    };

    var dettachEvents = function(sound) {
        sound.removeEventListener("error", onError);
        sound.removeEventListener("timeupdate", onWhilePlaying);
        sound.removeEventListener("ended", onEndSound, false);
    };



    var isPlaying = function(id) {
        try {
            if (t_audio) {
                var current_url = t_audio.src;
                var id_url = id.src;
                if (current_url === id_url) {
                    if (!t_audio.paused) {
                        return 1;
                    }
                }
            }
        } catch (e) {
            //Notificar el error
            onError(e);
        }
        return 0;
    };

    var isPlayingSound = function(id) {
        try {
            if (t_audio) {
                var current_url = t_audio.src;
                var id_url = soundObj[id].src;

                if (current_url === id_url) {
                    if (!t_audio.paused) {
                        return 1;
                    }
                }
            }
        } catch (e) {
            //Notificar el error
            onError(e);
        }
        return 0;
    };

    var stopAllSounds = function() {
        stop(t_audio);
    };



    /*
  Funciones de Creación/destrucción de audios
  */
    var createAudio = function(audioname, audioSrc) {

        if (!$('#audioWrapper').length) {
            $('body').append('<div id="audioWrapper"></div>');
        }

        if (!soundObj) {
            soundObj = {};
        }

        soundObj[audioname] = audioSrc;

        if (!$("#t_audio").length) {
            $('#audioWrapper').append('<audio id="t_audio" preload="auto" src="' + audioSrc + '"></audio>');
            $("#audioWrapper").hide();
        }

        t_audio = document.getElementById("t_audio");


        return soundObj[audioname];
    };

    var destroy = function() {
        $("#t_audio").remove();
        $('#audioWrapper').html('');
        $('#audioWrapper').remove();

        soundObj = {};
    };


    var init = function(buffer_list, audio_context) {


    };

    return {
        createAudio: createAudio,
        destroy: destroy,
        play: play,
        stop: stop,
        pause: pause,
        stopAllSounds: stopAllSounds,
        on: signals,
        isPlayingSound: isPlayingSound,
        init: init
    };

};

export default SoundLibrary_Tablet;
