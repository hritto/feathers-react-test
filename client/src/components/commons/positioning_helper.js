module.exports = {

  calculateAreaSize: function (model) {
    if(!model || _.isEmpty(model)){
      return {
        w: 950,
        h: 550
      };
    }
    if (model.question.layout_type === 'landscape'){
      //Si tiene definido un tamaño, usarlo
      if (model.question.size.h) {
        return {
          w: 950,
          h: 550 - model.question.size.h
        };
      }
      return {
        w: 950,
        h: 550
      };
    }
    if (model.question.layout_type === 'portrait'){
      //Si tiene definido un tamaño, usarlo
      if (model.question.size.w) {
        return {
          w: 950 - model.question.size.w,
          h: 550
        };
      }
      return {
        w: 850,
        h: 550
      };
    }
    return {
      w: 950,
      h: 550
    };
  },
  calculateAreaPosition: function (model) {
    if(!model || _.isEmpty(model) || model.question.layout_type === 'other'){
      return {
        w: 0,
        y: 0
      };
    }
    if (model.question.layout_position === 'up'){
      //Si tiene definido un tamaño, usarlo
      if (model.question.size.h) {
        return {
          x: 0,
          y: model.question.size.h
        };
      }
      return {
        x: 0,
        y: 100
      };
    }
    if (model.question.layout_position === 'left'){
      //Si tiene definido un tamaño, usarlo
      if (model.question.size.w) {
        return {
          x: model.question.size.w,
          y: 0
        };
      }
      return {
        x: 0,
        y: 850
      };
    }
    return {
      x: 0,
      y: 0
    };
  },
  // Calcula la posisción de los elementos dentro del área
  calculateDeck: function (card_num, area) {
    let t_col, t_row, card_size;
    let w = area.w;
    let size = null;
    let quantity = card_num;
    size = function(c, r){
      //Si el ancho es menor que el alto, tengo que asegurarme que entren 2 columnas en el ancho
      //Si el alto es menor que el ancho, tengo que asegurarme que entren 2 columnas en el alto
      var s =  Math.floor(w / c);
      //Si con el tamaño máximo de 2 columnas multiplicado por la cantidad de elementos por fila no entra,
      //agrego un elemento más ficticio...
      if((((s * c) + (20 * c)) > area.w) || (((s * r) + (20 * r)) > area.h)){
        s = Math.floor(w / (c+2));
      }
      return s;
    };

    switch (card_num) {
      case 12:
        t_col = 4;
        t_row = 3;
        if(area.w < area.h){
          t_col = 3;
          t_row = 4;
        }
        card_size = size(t_col, t_row);
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
        if(area.w < area.h){
          t_col = 3;
          t_row = 6;
        }
        card_size = Math.floor((w - 100) / t_row);
        break;
      case 20:
        t_col = 5;
        t_row = 4;
        if(area.w < area.h){
          t_col = 4;
          t_row = 5;
        }
        card_size = size(t_col, t_row);
        break;
      case 22:
        t_col = 6;
        t_row = 4;
        if(area.w < area.h){
          t_col = 4;
          t_row = 6;
        }
        card_size = size(t_col, t_row);
        break;
      case 24:
        t_col = 6;
        t_row = 4;
        if(area.w < area.h){
          t_col = 4;
          t_row = 6;
        }
        card_size = size(t_col, t_row);
        break;
      default:
        t_col = Math.ceil(card_num / 2);
        t_row = 2;
        if(area.w < area.h){
          t_col = 2;
          t_row = Math.ceil(card_num / 2);
        }
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

    return {
      y: posY,
      x: posX
    }
  }
};
