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
    model.set('selected_record', opts.options.options.props.record, true);
  };

  const closeModal = () => {
    sb.emit("application.stopModule", {
      modules: ["PreviewResource"],
      dom: ["preview_modal"],
      config: [{}],
      instanceIds: ["PreviewResource"]
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
