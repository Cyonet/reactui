import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import trigger from '../../../utils/trigger';
import FormItemMixin from '../FormItemMixin';
import PureMixin from '../PureMixin';
import {inReact, similarArray, isEmpty, isFunction} from 'utils/common';

function formatOption(props) {
  if(props.options.length){
    const _ = [...props.options];
    if (props.placeholder) {
      _.unshift({
        value: '',
        label: props.placeholder
      });
      return _;
    }
  }
  return [];
}
@FormItemMixin
@PureMixin
export default class Select extends React.Component {
  displayName = 'select';
  state = {
    open: false,
    click: false,
    options: formatOption(this.props),
    select: {}
  };

  componentDidMount() {
    this.deposit();
    this.setDefault(this.props, () => {
      this.setDefaultValue(this.state.select.value);
    });
    this.remove = trigger('click', (pointer) => {
      if (!inReact(ReactDOM.findDOMNode(this), pointer) && this.state.open) {
        this.setState({open: false});
      }
    });
  }
  componentWillUnmount() {
    if (this.remove) {
      this.remove();
    }
  }
  setDefault(props, cd) {
    const {options, defaultValue, isSearch} = props;
    if (!options || !options.length) return;
    let _options = [...options];
    const callback = () => {
      const {onChange} = this.props;
      const {select} = this.state;
      if (this.props.first) {
        onChange && onChange(select.value, select, true);
      }
      cd && cd();
    };

    if (!isEmpty(defaultValue)) {
      let select;
      if(isSearch){
        select = (_options.filter(item=>(item.value == defaultValue || item.label == defaultValue  || item == defaultValue))[0]||{});
      }
      else{
        select = (_options.filter(item=>(item.value == defaultValue || item == defaultValue))[0]||{});
      }

      select = {
          value: select.value || defaultValue,
          label: select.label || defaultValue
      };
      this.setState({
        options: _options,
        select,
        input:select.label
      }, () => {
        callback();
      });
    }
    else {
      if (this.props.placeholder) {
        _options.unshift({
          value: '',
          label: this.props.placeholder
        });
      }
      const item = _options[0];
      const select = {
        value: item.value !== void 0 ? item.value : item,
         label: item.label || item.value || item
      };
      this.setState({
        options: _options,
        select,
        input:select.label
      }, () => {
        callback();
      });
    }
  }

  optionClick = (evt, select) => {
    evt.stopPropagation();
    const {onChange, disabled, isSearch} = this.props;
    if (disabled) {
      return false;
    }
    if(typeof select !== 'object'){
      select = {
        value: select,
        label: select
      };
    }

    if (this.hasValue()) {
      this.setState({
        open: false,
      });
    }
    this.setState({
      open: false,
      select,
      input: select.label
    });
    this.changeField(select.value);
    onChange && onChange(select.value, select);
  }

  selectClick = (evt) => {
    evt.stopPropagation();
    if (this.props.disabled) {
      return false;
    }
    this.setState({open: !this.state.open});
  };
  handleBlur = (e) => {
    const {format, onChange} = this.props;
    let value = e.target.value.trim();
    if(isFunction(format)){
      value = format(value);
    }
    if(value === ''){//输入为空,切换下拉框模式
      const {options} = this.state;
      const select = options[0]||{};
      this.blurField(select.value);
      this.setState({select, input: select.label});
    }
    else{
      this.blurField(value);
      const {onChange, disabled} = this.props;
      onChange && onChange(value, {label:value, value});
      this.setState({select:{label:value, value}, input: value});
    }
  }

  handleInput = (e) => {
    let value = e.target.value;
    //this.blurField(value);
    this.setState({select:{label:value, value}, input: value});
  }

  render() {
    let {select, options, open, input} = this.state;
    const {disabled, className, value, other, isSearch, size} = this.props;
    let cacheValue = value;
    if(typeof  cacheValue === 'object'){
      cacheValue = cacheValue.label || cacheValue.value;
    }
    const __cache = this.hasValue()? cacheValue : (select.value|| '');
    if (this.hasValue() || !select.label) {
      select = options.filter(item => item.value == __cache || item == __cache)[0] || {};
    }
    return <div {...other} onClick={this.selectClick} className={classNames(defaultStyle.warp, className, {
      [defaultStyle.open]: open,
      [defaultStyle.disabled]: disabled
    })}>
      <div className={classNames(defaultStyle.selection, defaultStyle[`selection-${size}`])}>
        {
          isSearch && <input
            type="text"
            className={defaultStyle.input}
            value={input}
            onChange={this.handleInput}
            onBlur={this.handleBlur}
          />
          || <div className={defaultStyle.select}>{select.label || select.value}</div>
        }
        <Icon type="down" className={defaultStyle.arrow}/>
      </div>
      {
        !disabled && options && options.length && <ul className={defaultStyle.dropdown}>
          {options.map((item, index) => <li key={index}
                                            onClick={(e)=>{
                                              this.optionClick(e, item);
                                            }}
                                            value={item.value !== undefined ? item.value : item}
                                            className={classNames(defaultStyle.option, {
                                              [defaultStyle.optionDisabled]: item.disabled,
                                              [defaultStyle.active]: (item.value || item) == select.value
                                            })}>{item.label || item.value || item}</li>)}
        </ul> || null
      }
    </div>;
  }
}

Select.defaultProps = {
  first: true,
  isSearch:false,
  size:'small'
};

Select.propTypes = {
  first: PropTypes.bool,
  defaultValue: PropTypes.any,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  isSearch:PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'min', 'xsmall']),
};
