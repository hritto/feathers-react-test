module.exports = {

  calculateDeck: function (card_num, area) {
    let t_col, t_row, card_size;
    let w = w = area.h;
    let size = null;
    if(area.w < area.h){
      w = area.w;
    }
    size = function(c, r){
      return Math.min(Math.floor(w / r), Math.floor(w / c));
    };

    switch (card_num) {
      case 12:
        t_col = 4;
        t_row = 3;
        card_size = size(t_col, t_row);
        break;
      case 16:
        t_col = 4;
        t_row = 4;
        card_size = size(t_col, t_row);
        break;
      case 18:
        t_col = 6;
        t_row = 3;
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 20:
        t_col = 5;
        t_row = 4;
        card_size = size(t_col, t_row);
        break;
      case 22:
        t_col = 6;
        t_row = 4;
        card_size = size(t_col, t_row);
        break;
      case 24:
        t_col = 6;
        t_row = 4;
        card_size = size(t_col, t_row);
        break;
      case 26:
        t_col = 7;
        t_row = 4;
        card_size = size(t_col, t_row);
        break;
      case 28:
        t_col = 7;
        t_row = 4;
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 30:
        t_col = 6;
        t_row = 5;
        card_size = size(t_col, t_row);
        break;
      case 32:
        t_col = 8;
        t_row = 4;
        card_size = Math.floor((w - 150) / t_row);
        break;
      case 34:
        t_col = 6;
        t_row = 6;
        card_size = size(t_col, t_row);
        break;
      case 36:
        t_col = 6;
        t_row = 6;
        card_size = size(t_col, t_row);
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
        t_col = Math.ceil(card_num / 2);
        t_row = 2;
        card_size = size(t_col, t_row);
    }

    return {
      col: t_col,
      row: t_row,
      size: card_size
    };

  },
  //La siguiente función crea un array de posiciones x/y, dependiendo del deck, y las mezcla
  calculateCardPositions: function (elements, size, cols, rows, cardsNum, area) {

    let posY = [];
    let posX = [];
    let stepX = 0;
    let stepY = 0;
    let margen = 10;
    let posN;
    let sobraX = (area.w - (size + margen) * cols) / 2;
    let sobraY = (area.h - (size + margen) * rows) / 2;


    if (elements) {
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
      //posY = nonRegularPositions(posY, cardsNum);
      //posX = nonRegularPositions(posX, cardsNum);
    }

    return {
      y: posY,
      x: posX
    }//shuffle(posY, posX);
  },
  nonRegularPositions: function (array, num) {
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

  },

  shuffle: function (array1, array2) { //mezcla los 2 arrays
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
};
