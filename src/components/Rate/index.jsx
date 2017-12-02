import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from '../../utils/utils';
/**
 * 评分，支持半分
 * @type {Object}
 */
export default class Rate extends React.Component {
  constructor(props) {
    super(props);
    const { defaultValue, value, allowHalf } = props;
    this.state = {
      value: defaultValue || value || 0,
      hoverValue: undefined,
      allowHalf: allowHalf || (defaultValue % 1 === 0.5),
    };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextprops.defaultValue });
    }
  }

  handleLeave = () => {
    const { disabled } = this.props;
    if (disabled) return;
    this.setState({ hoverValue: undefined });
  };

  handleMove = (index, e) => {
    this.setState({ hoverValue: this.calcValue(index, e) });
  };

  handleClick = (index, e) => {
    const value = this.calcValue(index, e);
    if (this.props.value !== undefined && value !== this.state.value) {
      this.setState({ value });
    }
    this.handleLeave();
    this.props.onChange(value);
  };
  // 计算样式
  calcCls(index) {
    const { type } = this.props;
    const { value, hoverValue, allowHalf } = this.state;
    const startValue = index + 1;
    const realvalue = hoverValue === undefined ? value : hoverValue;
    const commonCls = classNames('rate-item', `icon icon-${type}`);
    if (allowHalf && realvalue + 0.5 === startValue) {
      return classNames(commonCls, 'rate-half');
    }
    return classNames(commonCls, {
      'rate-full': startValue <= realvalue,
      'rate-zero': startValue > realvalue,
    });
  }

  calcValue(value, e) {
    const { disabled } = this.props;
    let calcV = value;
    if (disabled) { return value; }
    if (this.state.allowHalf && e.target.getAttribute('type') === 'half') { // 半分
      calcV += 0.5;
    } else {
      calcV += 1;
    }
    return calcV;
  }

  renderItem() {
    const cache = [];
    const {
      count,
      size,
      type,
    } = this.props;

    for (let i = 0; i < count; i += 1) {
      const props = {
        key: i,
        className: this.calcCls(i),
        style: { fontSize: `${size}px` },
        onMouseMove: e => this.handleMove(i, e),
        onClick: e => this.handleClick(i, e),
      };
      cache.push((
        <li {...props}>
          <span
            style={{ fontSize: `${size}px` }}
            type="half"
            className={classNames('rate-half-area', `icon icon-${type}`)}
          />
        </li>
      ));
    }
    return cache;
  }

  render() {
    const { className } = this.props;
    return (
      <ul
        className={classNames(className, 'rate')}
        onMouseLeave={this.handleLeave}
      >
        { this.renderItem() }
      </ul>);
  }
}

Rate.defaultProps = {
  count: 5,
  type: 'star-o',
  allowHalf: true,
  size: 26,
  className: '',
  defaultValue: 0,
  onChange: noop,
  disabled: false,
  value: undefined,
};

Rate.propTypes = {
  count: PropTypes.number,
  value: PropTypes.number,
  size: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
  allowHalf: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};
