import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pureDecorator from '../../../utils/pureDecorator';
import {
  extract,
  UNDFINED,
  noop,
  NOT_TRUE,
  TRUE,
  NULL,
} from '../../../utils/utils';

@pureDecorator
export default class Input extends React.Component {
  static propTypes = {
    // base
    type: PropTypes.string,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    size: PropTypes.oneOf(['large', 'small', 'min', 'xsmall']),
    rows: PropTypes.number,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    prepend: PropTypes.node,
    append: PropTypes.node,
    disabled: PropTypes.bool,
    inner: PropTypes.bool,
    onChange: PropTypes.func,
    displayFormat: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
  static defaultProps = {
    type: 'text',
    className: '',
    rows: 2,
    style: {},
    value: UNDFINED,
    defaultValue: UNDFINED,
    onChange: noop,
    displayFormat: noop,
    onFocus: noop,
    onBlur: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    size: 'small',
    disabled: NOT_TRUE,
    inner: NOT_TRUE,
    prepend: NULL,
    append: NULL,
  };
  static displayName = 'Input';
  constructor(props) {
    super(props);
    this.state = {
      value: props.displayFormat(props.value || props.defaultValue || ''),
      focus: NOT_TRUE,
    };
  }
  handleChange = (e) => {
    const inutValue = e.target.value;
    const { onChange, value } = this.props;
    if (value === UNDFINED) {
      this.setState({ value: inutValue });
    }
    onChange(inutValue);
  };
  handleFocus = (e) => {
    const { onFocus } = this.props;
    onFocus(e);
    this.setState({ focus: TRUE });
  };
  handleBlur = (e) => {
    const { onBlur, value } = this.props;
    const inputValue = e.target.value.trim();
    if (value === UNDFINED) {
      this.setState({ value: inputValue });
    }
    this.setState({ focus: NOT_TRUE });
    onBlur(value, e);
  };
  render() {
    const {
      type,
      size,
      style,
      disabled,
      prepend,
      className,
      append,
      rows,
      onMouseEnter,
      onMouseLeave,
      displayFormat,
      inner,
      ...other
    } = this.props;
    const { focus } = this.state;
    const value = this.porps.value !== UNDFINED ? this.props.value : this.state.value;
    const showValue = focus ? value : displayFormat(value);
    const classes = classNames(
      type === 'textarea' ? 'textarea' : 'input',
      className,
      `input-${size}`, {
        'input-is-disabled': disabled,
        'input-group': prepend || append,
        'input-prepend': !!prepend,
        'input-append': !!append,
        'input-append-inner': !!inner,
      },
    );
    const props = extract(other, [
      'defaultValue',
      'onChange',
      'value',
      'onFocus',
      'onBlur',
    ]);
    if (type === 'textarea') {
      return (
        <div
          data-role="textarea"
          style={style}
          className={classes}
        >
          <textarea
            data-role="textarea"
            className="textarea__inner"
            rows={rows}
            value={showValue}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            {...props}
          />
        </div>
      );
    }
    return (
      <span
        style={style}
        data-role="input"
        className={classes}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        { (prepend && (<div className="input-group-prepend">{prepend}</div>)) || null }
        { (append && (<div className="input-group-append">{append}</div>)) || null }
        <div
          className="input__warpper"
        >
          <input
            type={type}
            value={showValue}
            className="input__inner"
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            {...props}
          />
        </div>
      </span>
    );
  }
}
