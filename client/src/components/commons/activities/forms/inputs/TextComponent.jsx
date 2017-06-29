import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import R from 'ramda'

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: R.view(R.lensPath(R.split('.', this.props.field_map)), this.props.state),
      field: this.props.field_map
    };
    this.handleChange = this.handleChange.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    debugger;
    return this.state.value !== nextState.value ? true : false;
  }

  handleChange(e) {
    let val = e.target.value;

    this.setState((state) => {
      const lens = R.lensProp('value');
      return R.set(lens, val, state)
    });
    //Notificar al padre
    this.props.change(e);

  }

  render() {
    //let config = this.props.props.model.config;
    //let el_config = R.find(R.propEq('name', this.props.campo))(config.fields);
    console.log("render -> " + this.state.field)
    return (
      <Form.Field>
        <label>{this.props.field}</label>
        <Input key={'_' + this.state.field}
          name={this.state.field}
          type='text'
          value={this.state.value}
          onChange={this.handleChange} />
      </Form.Field>
    );
  }
}

export default InputText
