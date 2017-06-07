//Helpers de ajuste de tamaños de elementos

const adjustResponsive = () => {
  let main_content = document.getElementById('main_content');
  let main_menu = document.getElementById('main_menu');
  let best_height = Math.max(document.documentElement.clientHeight, main_content.clientHeight) -60;
  main_menu.style.cssText = 'min-height:'+best_height+'px !important';
};


export default adjustResponsive;
