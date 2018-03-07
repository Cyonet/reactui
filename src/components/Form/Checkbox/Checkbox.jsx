import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  extract,
  NOT_TRUE,
  noop,
  UNDFINED,
} from '../../../utils/utils';
import uid from '../../../utils/uid';
import pureDecorator from '../../../utils/pureDecorator';

@pureDecorator
export default class Checkbox extends React.Component {
  static defaultProps = {
    type: 'checkbox',
    checkedValue: NOT_TRUE,
    size: 'normal',
    indeterminate: NOT_TRUE,
    value: UNDFINED,
    defaultValue: NOT_TRUE,
    disabled: NOT_TRUE,
    readOnly: NOT_TRUE,
    onChange: noop,
    className: '',
    name: '',
    style: null,
    children: null,
  };
  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(['checkbox', 'radio']),
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    indeterminate: PropTypes.bool,
    readOnly: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    className: PropTypes.string,
    name: PropTypes.string,
    checkedValue: PropTypes.any,
    onChange: PropTypes.func,
    size: PropTypes.oneOf(['small', 'normal']),
  };
  static displayName = 'Checkbox';

  constructor(props) {
    super(props);
    this.uid = uid();
    this.state = {
      value: props.value || props.defaultValue,
    };
  }
  handleChange = (e) => {
    e.stopPropagation();
    const { onChange, checkedValue } = this.props;
    const { value } = this.state;
    if (this.props.value === UNDFINED) {
      this.setState({ value: !value });
    }
    onChange(checkedValue || !value, !value);
  };
  render() {
    const {
      className,
      name,
      style,
      type,
      disabled,
      readOnly,
      value,
      children,
      indeterminate,
      size,
      ...other
    } = this.props;
    const props = extract(other, [
      'onChange',
      'label',
      'options',
      'option',
      'defaultValue',
      'checked',
      'value',
      'checkedValue',
    ]);
    const classes = classNames(type, `${type}-${size}`, { [`${type}-disabled`]: disabled || readOnly });
    const checked = value !== UNDFINED ? value : this.state.value;
    return (
      <label
        htmlFor={this.uid}
        style={style}
        className={classNames('check-wrapper', className)}
      >
        <span
          className={classes}
        >
          <input
            checked={checked}
            readOnly={readOnly}
            disabled={disabled}
            type={type}
            name={name}
            id={this.uid}
            onChange={this.handleChange}
          />
          <span
            className={classNames('check-inner', { 'check-inner-half': indeterminate && !checked })}
            {...props}
          />
        </span>
        {(children && (<span className="check-text">{children}</span>)) || null}
      </label>
    );
  }
}
