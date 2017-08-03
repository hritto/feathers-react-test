const Promise = require("bluebird");
import R from 'ramda'

const PreviewController = function () {
  let options = null;
  let model = null;
  let sb = null;

  //Este modulo recibe un id de actividad para cargar
  const initialize = (opts, mdl) => {
    options = opts;
    model = mdl;
    sb = opts.sb;
    model.set('activity_code', opts.options.options.props.model.activity_code, true);
  };

  const closeModal = () => {
    sb.emit("application.stopModule", {
      title: "Preview",
      icon: "game",
      route: "preview",
      permission: "preview",
      modules: ["Preview"],
      dom: ["preview_modal"],
      config: [{}],
      instanceIds: ["Preview"]
    });

  };

  const handleCancel = () => {
    model.resetFieldsState();
    model.set('state', 'initial', true);
    window.dispatchEvent(new Event('resize'));
  };

  const destroy = () => {
    model.destroy();
  };

  return {
    initialize: initialize,
    closeModal: closeModal,
    handleCancel: handleCancel,
    destroy: destroy
  };
};

export default PreviewController;
