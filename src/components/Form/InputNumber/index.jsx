import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../Input';
import Icon from '../../Icon';
import Button from '../../Button';
import {
  formatDouble,
  noop,
  NULL,
  NOT_TRUE,
  UNDFINED,
} from '../../../utils/utils';
import pureDecorator from '../../../utils/pureDecorator';
@pureDecorator
export default class InputNumber extends React.Component {
  static defaultProps = {
    max: Infinity,
    min: 0,
    type: 'button',
    name: UNDFINED,
    className: UNDFINED,
    value: 0,
    step: 1,
    dot: 0,
    onChange: noop,
    disabled: NOT_TRUE,
  };
  static propTypes = {
    value: PropTypes.number,
    type: PropTypes.oneOf(['inline', 'button']),
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    dot: PropTypes.number,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.min || 1,
      minusDisabled: false,
      plusDisabled: false,
    };
  }
  componentDidMount() {
    this.computed(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value || nextProps.min !== this.props.min || nextProps.max !== this.props.max) {
      this.computed(nextProps);
    }
  }
  handleBlur = (name, value) => this.handler(name, value);
  handleChange = (value) => this.setState({ value });
  handler = (name, value) => {
    const {
      onChange,
      max,
      min,
      disabled,
      dot,
    } = this.props;
    if (disabled) return;
    this.computed(
      {
        value,
        max,
        min,
        dot,
      },
      (v) => onChange(name, v),
    );
  };
  handleMinus = () => {
    if (this.props.disabled) return;
    const { minusDisabled, value } = this.state;
    if (minusDisabled) return;
    const { step, name } = this.props;
    this.handler(name, value - step);
  };
  handlePlus = () => {
    if (this.props.disabled) return;
    const { plusDisabled, value } = this.state;
    if (plusDisabled) return;
    const { step, name } = this.props;
    this.handler(name, value + step);
  };
  computed(nextProps, callback = noop) {
    const {
      value,
      max,
      min,
      dot,
    } = nextProps;
    let minusDisabled = false;
    let plusDisabled = false;
    let input = value || min;
    if (max <= value) {
      input = max;
      plusDisabled = true;
    }
    if (min >= value) {
      input = min;
      minusDisabled = true;
    }
    input = formatDouble(dot)(input);
    callback(input);
    this.setState({ value: input, plusDisabled, minusDisabled });
  }
  render() {
    const {
      type,
      name,
      className,
      disabled,
    } = this.props;
    const {
      minusDisabled,
      plusDisabled,
      value,
    } = this.state;
    const classes = classnames(className, 'input-number', `input-number-${type}`);
    const InputCompoent = (
      <Input
        className="input-number-inner"
        onBlur={(v) => { this.onBlur(name, v); }}
        disabled={disabled}
        value={value}
        onChange={this.handleChange}
      />);
    let Component = NULL;
    if (type === 'inline') {
      Component = (
        <div className={classes}>
          {InputCompoent}
          <div className="input-number-action">
            <span
              role="button"
              tabIndex="-1"
              aria-disabled={plusDisabled}
              onClick={this.handlePlus}
              className="input-number-plus"
            >
              <Icon type="up" />
            </span>
            <span
              role="button"
              tabIndex="-1"
              aria-disabled={minusDisabled}
              onClick={this.handleMinus}
              className="input-number-minus"
            >
              <Icon type="down" />
            </span>
          </div>
        </div>);
    } else {
      Component = (
        <div className={classes}>
          <Button
            radius={false}
            disabled={disabled || minusDisabled}
            onClick={this.handleMinus}
          >
            <Icon type="minus" />
          </Button>
          { InputCompoent }
          <Button
            radius={false}
            disabled={disabled || plusDisabled}
            onClick={this.handlePlus}
          >
            <Icon type="plus" />
          </Button>
        </div>
      );
    }
    return Component;
  }
}
