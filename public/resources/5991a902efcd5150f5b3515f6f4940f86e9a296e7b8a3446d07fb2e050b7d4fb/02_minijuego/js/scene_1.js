NS('AnayaInfantil');

AnayaInfantil.Scene_1 = function() {
  'use strict';

  var config = null;
  var el = null;
  var scene = null;
  var showIntro;
  var el = null;
  var end = false;
  var container_drags = 'drag-elements';
  var media;
  var intro;
  var resolution = null;
  var lib = null; //la librería de audio
  //Contador de errores
  var error_counter = 0;
  var containers = [];
  var resizer = null;
  var layout = null; //El objeto encargado del layout
  var sounding = null;

  //Suscripciones de audio
  var signals = {
    playing: null,
    end: null,
    pause: null,
    sound_error: null
  };

  var cardsArr = []; //las cartas
  var current_pair = [];
  var current_pair_id = [];
  var solved_cards = []; //Array de cartas que se han resuelto
  var turned_cards = []; //Array de cartas que se han girando al menos una vez
  var card_timer;
  // Objeto encargado de la resolucion
  var resolution_object = null;
  var menu = null;
  var intro_object = null;
  var end_object = null;
  var active_buttons = [];

  var initialize = function(options, med, res, resizer_obj, layout_obj) {

    config = options;
    media = med;
    resizer = resizer_obj;

    lib = media.getSoundLibrary();
    layout = layout_obj;
    menu = AnayaInfantil.app.getMenu();

    return initCards(config).then(function() {
      return render().then(function() {
        // Crear la escena
        return promiseShowIntroScene().then(function() {
          //Se ha terminado de renderizar la escena
          //Abrir el menu
          if(config.show_instruction){
            menu.open();
          }
          return Promise.resolve();
        })
      });
    });
  };

  var promiseShowIntroScene = function() {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var init_options;
    if (!menu.getAudioEnabled() && config.show_instruction && is_mobile() && config.init_config.show_intro) { //La ventana inicial solo se muestra en dispositivos móviles
      //Hay que mostrar la pantalla inicial
      init_options = config.init_config;
      intro_object = new AnayaInfantil.introWindow(media, lib, resizer);

      return new Promise(function(resolve, reject) {
        intro_object.init(init_options).then(function() {
          //Ya se puede activar el audio
          menu.setAudioEnabled(true);
          intro_object.destroy();
          intro_object = null;
          return resolve();
        })
      });
    } else {
      return Promise.resolve();
    }
  };

  var initCards = function(data) {
    // Creo las cartas y las mezclo
    var i = 0;
    var posY = 0;
    var posX = 0;
    var cardNum = data.elements.cards.length;
    var cols = calculateDeck(cardNum).col;
    var rows = calculateDeck(cardNum).row;
    var cardSize = calculateDeck(cardNum).size;
    var imgCardBack = null;
    var audio_image = null;
    var cardElement = null;
    var cardPositions = null;
    var cardID = null;
    var card = null;
    var cardType = null;
    if (cardSize > 240) {
      cardSize = 240;
    }
    //calculo las posiciones de las cartas dependiendo del deck y del tamaño de la carta
    cardPositions = calculateCardPositions(data, cardSize, cols, rows);

    return new Promise(function(resolve, reject) {
      _.each(data.elements.cards, function(value) {

        //las posiciones
        posX = cardPositions.x[i];
        posY = cardPositions.y[i];
        if (value.back) {
          imgCardBack = media.getImage(value.back);
        }

        if (value.sound) {
          cardElement = value.sound;
          cardType = 2;
          if (value.image && value.image !== "speaker") { //Si tiene una imagen que no es la imagen por defecto
            audio_image = media.getImage(value.image);
          } else {
            audio_image = media.getImage("speaker");
          }
        } else {
          if (value.image) {
            cardElement = sb.media.getImage(value.image);
            cardType = 0;
          } else {
            cardElement = value.text;
            cardType = 1;
          }
        }
        cardID = value.id;
        card = new AnayaInfantil.Card(config.scene_el, cardElement, i, posX, posY, cardSize, imgCardBack, cardID, cardType, audio_image, media, resizer, lib);

        cardsArr.push(card);
        i++;
      }, this);

      return resolve();
    });
  };


  var calculateDeck = function(card_num) {
    var t_col, t_row, card_size;
    var w = resizer.getActivitySceneConfig().size.w - resizer.getSimpleSize(200);

    switch (card_num) {
      case 12:
        t_col = 4;
        t_row = 3;
        card_size = Math.floor(w / t_row);
        break;
      case 16:
        t_col = 4;
        t_row = 4;
        card_size = Math.floor(w / t_row);
        break;
      case 18:
        t_col = 6;
        t_row = 3;
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 20:
        t_col = 5;
        t_row = 4;
        card_size = Math.floor(w / t_row);
        break;
      case 22:
        t_col = 6;
        t_row = 4;
        card_size = Math.floor(w / t_row);
        break;
      case 24:
        t_col = 6;
        t_row = 4;
        card_size = Math.floor(w / t_row);
        break;
      case 26:
        t_col = 7;
        t_row = 4;
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 28:
        t_col = 7;
        t_row = 4;
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 30:
        t_col = 6;
        t_row = 5;
        card_size = Math.floor(w / t_row);
        break;
      case 32:
        t_col = 8;
        t_row = 4;
        card_size = Math.floor((w - 150) / t_row);
        break;
      case 34:
        t_col = 6;
        t_row = 6;
        card_size = Math.floor(w / t_row);
        break;
      case 36:
        t_col = 6;
        t_row = 6;
        card_size = Math.floor(w / t_row);
        break;
      case 38:
        t_col = 8;
        t_row = 5;
        card_size = Math.floor((w - 130) / t_row);
        break;
      case 40:
        t_col = 8;
        t_row = 5;
        card_size = Math.floor((w - 130) / t_row);
        break;

      default:
        t_col = card_num / 2;
        t_row = 2;
        card_size = Math.floor(w / t_col);
    }

    return {
      col: t_col,
      row: t_row,
      size: card_size
    };

  };


  //La siguiente función crea un array de posiciones x/y, dependiendo del deck, y las mezcla
  var calculateCardPositions = function(data, size, cols, rows) {

    var posY = [];
    var posX = [];
    var stepX = 0;
    var stepY = 0;
    var margen = 10;
    var posN;
    var sobraX = (resizer.getActivitySceneConfig().size.w - (size + margen) * cols) / 2;
    var sobraY = (resizer.getActivitySceneConfig().size.h - (size + margen) * rows) / 2;
    var cardsNum;

    if (data.elements.cards) {
      cardsNum = data.elements.cards.length;
      posN = sobraX;

      for (var j = 0; j < rows; j++) { //cada fila
        for (var i = 0; i < cols; i++) { //cada columna
          posN = margen + stepX + sobraX;
          posX.push(posN);
          posY.push(stepY + sobraY);
          stepX += size + margen;
        }
        stepX = 0;
        stepY += (size + margen);
      }
    }

    if (cardsNum === 22 || cardsNum === 26 || cardsNum === 34 || cardsNum === 38) {
      posY = nonRegularPositions(posY, cardsNum);
      posX = nonRegularPositions(posX, cardsNum);
    }

    var positions = shuffle(posY, posX);
    return positions;
  };

  var nonRegularPositions = function(array, num) {
    array.shift();
    switch (num) {
      case 22:
        array.splice(4, 1);
        break;
      case 26:
        array.splice(5, 1);
        break;
      case 34:
        array.splice(4, 1);
        break;
      case 38:
        array.splice(6, 1);
        break;
    }

    return array;

  };

  function shuffle(array1, array2) { //mezcla los 2 arrays
    var currentIndex = array1.length,
      temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array1[currentIndex];
      array1[currentIndex] = array1[randomIndex];
      array1[randomIndex] = temporaryValue;

      temporaryValue = array2[currentIndex];
      array2[currentIndex] = array2[randomIndex];
      array2[randomIndex] = temporaryValue;
    }

    return {
      y: array1,
      x: array2
    };
  }


  var eventDisableHandler = function() {
    _.each(cardsArr, function(card_obj) {
      card_obj.detachEvents();
    }, this);
  };

  var eventEnableHandler = function() {
    _.each(cardsArr, function(card_obj) {
      card_obj.attachEvents();
    }, this);
  };

  // Funcion que renderiza la escena, despues de cargar las imagenes
  var render = function() {

    //dibujar la escena
    return new Promise(function(resolve, reject) {
      //Dibujar el fondo, si tiene
      if (config.main_back) {
        var img = media.getImage(config.main_back);
        $("#" + config.scene_el).css({
          "background-image": "url(" + img.src + ")",
          "background-size": "contain",
          "background-position": "center center",
          "background-repeat": "no-repeat",
        });
      }

      //Ver si necesita botones visibles
      _.each(config.buttons_visible, function(value, key) {
        $('#' + key).css({
          "display": value ? "block" : "none"
        });
        if (value) {
          active_buttons.push(key);
        }
      });
      //iniciar los eventos de los botones visibles
      menu.startButtonsEvents(active_buttons);

      var j = 0;
      //si hay cartas, las agrego al layer

      resolution_object = new AnayaInfantil.Resolution(cardsArr, config.resolution, config.max_turns);

      if (cardsArr) {
        _.each(cardsArr, function(value) {
          //inicializar monitoreo de las cartas
          value.initialize(cardEventHandler, eventEnableHandler, eventDisableHandler);
        }, this);

      }

      return Promise.delay(100).then(function() {
        resolve();
      });
    });
  };

  //handler de los eventos de las cartas (lógica del juego)
  var cardEventHandler = function(card, name) {

    var is_card_ok = false;

    var period_turn = config.period * 1000; //el tiempo límite que podemos tener dado vuelta un par de cartas
    var max_turns = config.max_turns; //la cantidad de veces que puedo girar una carta
    var c = 0,
      k = 0;

    if (include(current_pair_id, card)) { //si es carta que ya se está mostrando
      return;
    }

    if (!end) {
      current_pair.push(name);
      current_pair_id.push(card);
      //Guardo la carta que se ha  girado
      //Si una carta se da vuelta más de dos veces sin resolver el par se cuenta como error
      turned_cards.push(name);
      resolution_object.setTotalClicks(turned_cards.length);

      if (current_pair.length > 2) { //estoy mostrando ya dos cartas, escondo las dos que había
        //reset
        current_pair_id.pop(); //la tercera carta
        if (card_timer) {
          clearTimeout(card_timer);
        }
        _.each(current_pair_id, function(value, index) {
          cardsArr[current_pair_id[index]].resetCard();
        }, this);

        current_pair = [];
        current_pair_id = [];
        //restart
        current_pair.push(name);
        current_pair_id.push(card);
        c = 0;
      }

      cardsArr[card].showCardAnimated();

      if (current_pair.length > 1) { //segunda carta

        //busco el par
        is_card_ok = resolution_object.checkResult(current_pair);

        if (is_card_ok) { //carta correcta

          _.each(current_pair_id, function(value, index) {
            solved_cards.push(current_pair_id[index]);
          }, this);

          resolution_object.updateResults(cardsArr, solved_cards, turned_cards);

          _.each(current_pair_id, function(value, index) {
            cardsArr[current_pair_id[index]].matchedCard(true);
          }, this);

          current_pair = [];
          current_pair_id = [];


          if (solved_cards.length === cardsArr.length) { //fin de la actividad
            return Promise.delay(1000).then(function() {
              return promiseEndOk();
            })
          }

        } else { //incorrecta

          resolution_object.updateResults(cardsArr, solved_cards, turned_cards);

          if (period_turn > 0 && !end) { //si es cero, no hay tiempo límite
            c = 0;
            card_timer = setTimeout(function() {
              _.each(current_pair_id, function(value) {
                cardsArr[current_pair_id[c]].resetCard();
                c++;
              }, this);

              current_pair = [];
              current_pair_id = [];
              c = 0;
            }, period_turn);
          }
        }
      }
    }
    //actualizar la capa de resultados
    //menu_layer.drawResults();
  };



  function include(arr, obj) { //not supported in IE8 (also canvas...)
    return (arr.indexOf(obj) !== -1);
  }




  var promiseEndOk = function(elem) {
    return new Promise(function(resolve, reject) {
      Promise.delay(2000).then(function() {
        return promiseShowResults('signal_ok').then(function() {
          return Promise.delay(1000).then(function() {
            return showEndActivity();
          });
        });
      });
    });
  };

  var promiseShowResults = function(elem) {
    var audio = menu.getAudioOk();
    var animation = 'ok';
    var animation_elem = '#animation_ok';

    if (elem === 'signal_ko') {
      audio = menu.getAudioKo();
      animation = 'ko'
      animation_elem = '#animation_ko';
    }
    return new Promise(function(resolve, reject) {
      // Hay que mostrar la ventana de evaluacion
      $('#screenBlocker').css('display', 'block');
      $('#' + elem).css({
        'display': 'block'
      });
      $('#' + elem).animateCss('bounceInDown');
      $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('#' + elem).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        lib.play(audio);
        $(animation_elem).animateSprite('play', animation);
        $(animation_elem).animateSprite('restart');

        return Promise.delay(3000).then(function() {
          $('#' + elem).removeClass();
          $(animation_elem).animateSprite('frame', 1);
          $('#' + elem).animateCss('fadeOutUp');
          $('#' + elem).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('#' + elem).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            $('#' + elem).css('display', 'none');


            $('#screenBlocker').css('display', 'none');
            //Preparar la siguiente animación del sprite para el tipo correspondiente (ok o ko)
            menu.setAlertsSprites(animation);
            return resolve();
          });
        });

      });
    });
  };


  var showEndActivity = function() {
    // Marcar el fin de la actividad
    end = true;

    return destroy().then(function() {
      return promiseShowEndScene().then(function() {
        //Avisar a la aplicación que se ha acabado la actividad
        AnayaInfantil.app.endActivity();
      });
    });
  };

  var promiseShowEndScene = function() {
    //CONFIGURACIÓN DE LA PANTALLA INICIAL (COMENZAR)
    var end_options, end_object;
    if (config.end_config && config.end_config.show_end) {
      //Hay que mostrar la pantalla FINAL
      end_options = config.end_config;
      end_object = new AnayaInfantil.endWindow(media, lib, resizer);
      return new Promise(function(resolve, reject) {
        end_object.init(end_options).then(function() {
          end_object.destroy();
          end_object = null;
          return resolve();
        })
      });
    } else {
      return Promise.resolve();
    }

  };

  var is_mobile = function() {
    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
    for (var i in agents) {
      if (navigator.userAgent.toLowerCase().search(agents[i]) > 0) {
        return true;
      }
    }
    return false;
  };

  var destroy = function() {
    $('#container').empty();
    resolution = null;
    return Promise.resolve();
  };


  return {
    initialize: initialize,
    render: render,
    destroy: destroy
  };
};


NS('AnayaInfantil');

/* Este modulo recibe un array de elementos ya resueltos y su supuesta
 * resolucion.
 * Y asigna a cada uno de los elementos un estado de resolucion
 *  0 : Indefinido (no entra en la resolucion)
 *  1 : Correcto
 *  2 : Erroneo
 *  3 : Omitido
 */
AnayaInfantil.Resolution = function(els, res, max_turns) {
  'use strict';

  var elements = els; // las cartas
  var resolution = res;
  var expectedCard;
  var totalClicks = null;
  var max_turns_card = max_turns; //La cant. de veces que puede ser girada una carta 0=todas las que quiera

  //Función que controla si las dos cartas que se le pasan forman par
  var checkResult = function(cards) {

    _.each(resolution, function(value, key) {

      if (key === cards[0]) {
        expectedCard = value.refIDs[0];
      }

    }, this);

    return cards[1] === expectedCard;

  };

  var setTotalClicks = function(clicks) {
    totalClicks = clicks;
  };

  var getTotalClicks = function() {
    return totalClicks;
  };


  var getPair = function(id) {
    var pair;
    _.each(resolution, function(value, key) {

      if (key === id) {
        pair = value.refIDs[0];
      }

    }, this);
    return pair;
  };

  var getCard = function(name) {
    var card;
    _.each(elements, function(value) {
      if (value.getName() === name) {
        card = value;
      }
    }, this);
    return card;
  };


  var updateResults = function(cardsArr, solved_cards, turned_cards) {
    var state;
    var check = 3;
    var counts = null,
      counts_pair = null;
    var pair, pair_card_element;

    _.each(cardsArr, function(value) {

      check = value.getResolutionState() || 3;

      //inicializo/actualizo el flag ResolutionState al objeto elements (card)
      //con el estado de resolucion 1=ok, 2=fail, 3=omission
      if (include(solved_cards, value.getId())) {
        check = 1;
      }

      //Pero si la carta ha sido dada vuelta más de dos veces, es un error, aunque esté bien la resolución!
      //Además, si una carta del par está mal, porque la ha dado vuelta más veces de las permitidas,
      //Ambas cartas están mal
      if (max_turns_card > 0) {
        counts = checkOccurencies(turned_cards, value.getName());
        //Busco la otra carta del par
        pair = getPair(value.getName());
        //Cuento si ha sido volteada más veces de lo permitido
        counts_pair = checkOccurencies(turned_cards, pair);

        if (counts > max_turns_card || counts_pair > max_turns_card) {
          check = 2; //Error
          pair_card_element = getCard(pair);
          pair_card_element.setResolutionState(check);
        }

      }
      value.setResolutionState(check);
      check = 3;
    }, this);

    return cardsArr;

  };

  //Función que devuelve cuántas veces ha sido girada una carta
  var checkOccurencies = function(turned, card_turned) {

    var arr = turned;
    var counts = {};

    for (var i = 0; i < arr.length; i++) {
      var num = arr[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts[card_turned];
  };




  function include(arr, obj) { //not supported in IE8 (also canvas...)
    return (arr.indexOf(obj) !== -1);
  }

  var evaluateResults = function(va, vaSol) {

    if (va === "") {
      return 3;
    }
    if (va !== vaSol) {
      return 2;
    }
    if (va === vaSol) {
      return 1;
    }

  };


  var getResults = function() {

    var correct = countCorrectElementsResult() / 2,
      fails = countErrorElementsResult() / 2,
      omissions = countOmissionElementsResult() / 2,
      total = countTotalElementsResult() / 2,
      evaluation = getEvaluation(),
      total_clicks = getTotalClicks();

    return {
      total: total,
      correct: correct,
      fails: fails,
      omissions: omissions,
      evaluation: evaluation,
      total_clicks: total_clicks
    };
  };

  var updateState = function() {

  };


  // Contar el numero de elementos con acierto

  var countCorrectElementsResult = function() {

    return countElementsResult(1);
  };

  // Contar el numero de elementos con error

  var countErrorElementsResult = function() {
    return countElementsResult(2);
  };

  // Contar el numero de elementos con omision

  var countOmissionElementsResult = function() {
    return countElementsResult(3);
  };

  var countElementsResult = function(result) {
    var count = 0;
    _.each(elements, function(element) {

      var element_state = element.getResolutionState();
      if (element_state === result) {
        count++;
      }
    });
    return count;
  };


  // Contar el numero de resultados del ejercicio

  var countTotalElementsResult = function() {

    return elements.length;
  };

  // La siguiente funcion devuelve un resultado de 0 a 100

  var getEvaluation = function() {
    var aciertos = countCorrectElementsResult(),
      fallos = countErrorElementsResult(),
      omisiones = countOmissionElementsResult(),
      total = countTotalElementsResult(),
      total_clicks = getTotalClicks(),
      suma = aciertos - (fallos + omisiones);

    // Si el total es cero, devolver 100
    if (total === 0) {
      return 100;
    }

    if (suma < 0) {
      suma = 0;
    }

    // Calcular el porcentaje
    return parseInt((suma * 100) / total, 10);
  };


  return {
    updateResults: updateResults,
    countCorrectElementsResult: countCorrectElementsResult,
    countErrorElementsResult: countErrorElementsResult,
    countOmissionElementsResult: countOmissionElementsResult,
    getResults: getResults,
    checkResult: checkResult,
    setTotalClicks: setTotalClicks
  };

};
