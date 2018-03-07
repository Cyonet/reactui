import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Radio from './Radio';
import {
  extract,
  noop,
  UNDFINED,
} from '../../../utils/utils';

export default class RadioGroup extends React.Component {
  static defaultProps = {
    defaultValue: UNDFINED,
    value: UNDFINED,
    ItemRender: Radio,
    onChange: noop,
  }
  static propTypes = {
    defaultValue: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    ItemRender: PropTypes.element,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || 0,
    };
  }
  getOption() {
    const { options } = this.props;
    if (!options) return [];
    return options.map((option) => {
      if (typeof option !== 'object') {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    });
  }
  handleChange = (option) => {
    const { props } = this;
    if (UNDFINED === props.value) {
      this.setState({ value: option.value });
    }
    props.onChange(option.value, option);
  };
  checking(value) {
    if (UNDFINED === this.props.value) {
      return this.state.value === value;
    }
    return this.props.value === value;
  }
  render() {
    const { props } = this;
    const {
      className,
      options,
      disabled,
      size,
      ItemRender,
      ...other
    } = props;
    let children = null;
    const otherProps = extract(other, [
      'children',
      'defaultValue',
      'value',
      'onChange',
    ]);
    if (options.length) {
      children = this.getOption().map((option) => React.cloneElement(ItemRender, {
        key: option.value,
        size,
        disabled,
        checkedValue: option,
        onChange: this.handleChange,
        value: this.checking(option.value),
      }, option.label));
    }
    const classes = classNames(className, 'radio-group');
    return (
      <div
        className={classes}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
}
