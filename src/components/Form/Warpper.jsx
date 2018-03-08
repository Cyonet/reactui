import React from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../utils/utils';

export default Component => (class Warpper extends React.Component {
  static displayName = Component.displayName || Component.name || 'Component';
  static contextTypes = { formItem: PropTypes.any };
  static propTypes = {
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }
  static defaultProps = {
    defaultValue: '',
    onChange: noop,
    onBlur: noop,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  componentDidMount() {
    this.getFormItem().setDefaultValue(this.props.defaultValue).depositReset(this.reset);
  }
  componentWillUnmount() {
    this.getFormItem().depositReset(noop);
  }
  getFormItem() {
    return this.context.formItem;
  }
  // 表单重置
  reset = () => {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }
  handleChange = (v) => {
    const { onChange } = this.props;
    const value = onChange(v);
    this.getFormItem().changeField(value);
    this.setState({ value });
  }
  handleBlur = (v) => {
    const { onBlur } = this.props;
    const value = onBlur(v);
    this.getFormItem().changeField(value);
    this.setState({ value });
  }
  render() {
    const { value } = this.state;
    return React.cloneElement(Component, {
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      value,
    });
  }
});
