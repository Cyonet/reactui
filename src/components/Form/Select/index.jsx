import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import trigger from '../../../utils/trigger';
import inReact from '../../../utils/inReact';
import {
  isEmpty,
  UNDFINED,
  TRUE,
  NOT_TRUE,
  noop,
  NULL,
} from '../../../utils/utils';
import pureDecorator from '../../../utils/pureDecorator';

function formatOption(props) {
  if (props.options.length) {
    const _ = [...props.options];
    if (props.placeholder) {
      _.unshift({
        value: '',
        label: props.placeholder,
      });
      return _;
    }
  }
  return [];
}
@pureDecorator
export default class Select extends React.Component {
  static displayName = 'Select';
  state = {
    open: false,
    options: formatOption(this.props),
    select: {},
  };

  componentDidMount() {
    this.deposit();
    this.setDefault(this.props);
    this.remove = trigger('click', (pointer) => {
      if (!inReact(this.selectNode, pointer) && this.state.open) {
        this.setState({ open: false });
      }
    });
  }
  componentWillUnmount() {
    if (this.remove) {
      this.remove();
    }
    this.selectNode = NULL;
  }
  setDefault(props, cd) {
    const { options, defaultValue, isSearch } = props;
    if (!options || !options.length) return;
    const cache = [...options];
    const callback = () => {
      const { onChange } = props;
      const { select } = this.state;
      if (props.defaultChange) {
        onChange(select.value, select, true);
      }
      cd();
    };
    let select;
    if (!isEmpty(defaultValue)) {
      if (isSearch) {
        select = (cache.filter(item => (item.value === defaultValue ||
          item.label === defaultValue || item === defaultValue))[0] || {});
      } else {
        select = (cache.filter(item => (item.value === defaultValue || item === defaultValue))[0] || {});
      }
      select = {
        value: select.value || defaultValue,
        label: select.label || defaultValue,
      };
    } else {
      if (props.placeholder) {
        cache.unshift({
          value: '',
          label: props.placeholder,
        });
      }
      const item = cache[0];
      select = {
        value: item.value !== UNDFINED ? item.value : item,
        label: item.label || item.value || item,
      };
    }
    this.setState({
      options: cache,
      select,
      input: select.label,
    }, () => {
      callback();
    });
  }
  isContorl() {
    return this.props.value !== UNDFINED;
  }
  handleOptionClick = (evt, v) => {
    evt.stopPropagation();
    const {
      onChange,
      disabled,
    } = this.props;
    if (disabled) {
      return false;
    }
    let select = v;
    if (typeof v !== 'object') {
      select = {
        value: select,
        label: select,
      };
    }
    this.setState({
      open: false,
      select,
      input: select.label,
    });
    onChange(select.value, select);
    return this;
  }
  handleClick = (evt) => {
    evt.stopPropagation();
    if (this.props.disabled) {
      return false;
    }
    this.setState({ open: !this.state.open });
    return this;
  };
  handleBlur = (e) => {
    const {
      format,
      onChange,
      disabled,
    } = this.props;
    if (disabled) return;
    const value = format(e.target.value.trim());
    if (isEmpty(value)) { // 输入为空,切换下拉框模式
      const { options } = this.state;
      const select = options[0] || {};
      this.setState({ select, input: select.label });
    } else {
      onChange(value, { label: value, value });
      this.setState({ select: { label: value, value }, input: value });
    }
  }
  handleInput = (e) => {
    const value = e.target.value.trim();
    this.setState({ select: { label: value, value }, input: value });
  }

  render() {
    const {
      select,
      options,
      open,
      input,
    } = this.state;
    const {
      disabled,
      className,
      value,
      search,
      size,
      ...other
    } = this.props;
    let cacheValue = value;
    let selectReal = select;
    if (typeof cacheValue === 'object') {
      cacheValue = cacheValue.label || cacheValue.value;
    }
    const selectValue = this.isContorl() ? cacheValue : (select.value || '');
    if (this.isContorl() || !select.label) {
      selectReal = options.filter(item => item.value === selectValue || item === selectValue)[0] || {};
    }
    return (
      <div
        {...other}
        onClick={this.handleClick}
        ref={(ref) => { this.selectNode = ref; }}
        className={
          classNames(
            'select-warp',
            className,
            { 'select-options-open': open, 'select-disabled': disabled },
        )}
      >
        <div
          className={classNames('select-selection', `select-selection-${size}`)}
        >
          {
            (
              search &&
              (
                <input
                  type="text"
                  className="select-selection-search"
                  value={input}
                  onChange={this.handleInput}
                  onBlur={this.handleBlur}
                />
              )
            )
            || (<div className="select-selection-text">{selectReal.label || selectReal.value}</div>)
          }
          <Icon type="down" className="select-arrow" />
        </div>
        {
          (!disabled &&
            (
              <ul
                className="select-options"
              >
                {
                  options.map((item) => (
                    <li
                      role="option"
                      aria-selected={(item.value || item) === selectReal.value}
                      key={item.value || item}
                      onClick={(e) => this.optionClick(e, item)}
                      aria-value={item.value !== UNDFINED ? item.value : item}
                      className={
                        classNames(
                          'select-option',
                          {
                            'select-option-disabled': item.disabled,
                            'select-option-active': (item.value || item) === selectReal.value,
                          },
                        )
                      }
                    >
                      {item.label || item.value || item}
                    </li>
                  ))}
              </ul>
            )
          ) || NULL
        }
      </div>);
  }
}

Select.defaultProps = {
  defaultChange: TRUE,
  disabled: NOT_TRUE,
  search: NOT_TRUE,
  size: 'small',
  className: '',
  placeholder: '',
  defaultValue: UNDFINED,
  value: UNDFINED,
  format: noop,
  onChange: noop,
};

Select.propTypes = {
  defaultChange: PropTypes.bool,
  search: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'min', 'xsmall']),
  format: PropTypes.func,
  onChange: PropTypes.func,
};
