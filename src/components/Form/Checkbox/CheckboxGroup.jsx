import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';
import {
  extract,
  noop,
  isArray,
  inArray,
  getIndex,
  isEmpty,
  NULL,
} from '../../../utils/utils';
import pureDecorator from '../../../utils/pureDecorator';

function pureFormat(v) {
  if (isArray(v)) {
    return v;
  } else if (isEmpty(v)) {
    return [];
  }
  return [v];
}
@pureDecorator
export default class CheckboxGroup extends React.Component {
  static defaultProps = {
    value: NULL,
    defaultValue: NULL,
    onChange: noop,
    ItemRender: Checkbox,
  };
  static propTypes = {
    defaultValue: PropTypes.array,
    ItemRender: PropTypes.element,
    value: PropTypes.array,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };
  static displayName = 'CheckboxGroup';
  constructor(props) {
    super(props);
    this.state = {
      value: pureFormat(props.value || props.defaultValue),
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
    const { state, props } = this;
    const { value } = state;
    const index = getIndex(value, option.value);
    const valueNew = [...value];
    if (index >= 0) {
      valueNew.splice(index, 1);
    } else {
      valueNew.push(option.value);
    }
    if (props.value === NULL) { // 不受控
      this.setState({ value: valueNew });
    }
    props.onChange(valueNew, option);
  };

  checking(value) {
    const { props, state } = this;
    if (props.value !== NULL) {
      return inArray(props.value, value);
    }
    return inArray(state.value, value);
  }
  render() {
    const { props } = this;
    const {
      className,
      options,
      disabled,
      ItemRender,
      size,
    } = props;
    let children = null;
    const other = extract(props, ['children', 'className', 'options', 'onChange', 'ItemRender']);
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
    const classes = classNames(className, 'check-group');
    return (
      <div className={classes} {...other}>
        {children}
      </div>
    );
  }
}
