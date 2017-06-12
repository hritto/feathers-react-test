import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import R from 'ramda'

class SimpleUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      field: this.props.campo,
      photo_content_type: ''
    };
    this.readURL = this.readURL.bind(this);
    this.fileSelected = this.fileSelected.bind(this);
  }

  isBase64(str) {
    return str.indexOf('base64') > 0;
  }

  fileSelected(e) {
    let file = e.target.files[0];
    this.readURL(e.target);
  }

  readURL(input) {
    let self = this;
    let ext, url, size;
    if (input.files && input.files[0]) {
      url = input.value;
      size = input.size;
      // Controlar que seea una imagen
      ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      // El máximo de subida de ficheros de este tipo es de 2MB
      if ((ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg") && size < 2097152) {
        let reader = new FileReader();
        reader.onload = function (e) {
          self.setState({
            value: e.target.result,
            photo_content_type: 'image/' + ext
          });
          self.props.changePhoto(self.state);
        }
        reader.readAsDataURL(input.files[0]);
      } else {
        alert('photo_validation problem');
        self.setState({
          photo: null,
          photo_content_type: null
        });
        $('#file').val('');
      }
    }
  }

  render() {

    let photo_preview = '';
    let url64 = '';
    if(this.state.value){
      if(!this.isBase64(this.state.value)){
        url64 = 'data:'+this.state.photo_content_type+';base64,'+this.state.value;
      } else {
        url64 = this.state.value;
      }
      photo_preview = <div key={'image_prev'} className='photo_preview_container'><img src={url64} className='photo_preview' key={'image_prev_img'} /></div>
    }

    let config = this.props.props.model.config;
    let el_config = R.find(R.propEq('name', this.props.campo))(config.fields);

    return (
      <Form.Field>
        <label>{el_config.label}</label>
        {photo_preview}
        <Input key={'_'+this.state.field}
            name={this.state.field}
            type='file'
            ref='file'
            id="photo"
            onChange={this.fileSelected} />
      </Form.Field>
    );
  }
}

export default SimpleUpload
