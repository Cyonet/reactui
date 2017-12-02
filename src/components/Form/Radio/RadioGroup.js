/**
 * R91 2017/5/22
 * RadioGroup
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Radio from './Radio';
import defaultStyles from './index.less';
import {splitObject,shallowEqual, similarArray} from 'utils/common';
import PureMixin from '../PureMixin';
import FormItemMixin from '../FormItemMixin';

@FormItemMixin
@PureMixin
export default class RadioGroup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: props.value || props.defaultValue || 0
    };
  }

  componentDidMount(){
    this.deposit();
    this.setDefaultValue(this.props.defaultValue);
    if(!('defaultValue' in this.props) && this.props.defaultValue !== undefined && this.props.options.length){
      const value = (typeof this.props.options[0] === 'object') ? this.props.options[0].value: this.props.options[0];
      this.setState({value});
      this.changeField(value);
    }
  }
  componentWillReceiveProps(nextProp){
    if('defaultValue' in nextProp){
      if(nextProp.defaultValue != this.props.defaultValue && nextProp.defaultValue !== undefined){
        this.setState({value:nextProp.defaultValue});
        this.setDefaultValue(nextProp.defaultValue);
      }
    }
    else{
      if('options' in nextProp && !similarArray(nextProp.options, this.props.options)){
        const value = (typeof nextProp.options[0] === 'object') ? nextProp.options[0].value: nextProp.options[0];
        this.setState({value});
        this.changeField(value);
      }
    }
  }

  componentWillUnmount(){
    this.unDeposit();
  }

  setCheckedValue = (option)=>{
    const {props} = this;
    if(!this.hasValue()){
      this.setState({value: option.value});
    }
    //带验证
    this.changeField(option.value);
    props.onChange && props.onChange(option.value, option);
  };

  getOption(){
    const {options} = this.props;
    if(!options)return [];
    return options.map((option)=>{
      if(typeof option === 'string'){
        return {
          label: option,
          value: option
        };
      }
      return option;
    });
  }
  checking(value){
    return (this.props.value ||this.state.value) == value;
  }
  render() {
    const {props} = this;
    const {className, options, disabled, size, ItemRender=Radio, itemProps} = props;
    let children = props.children;
    const other = splitObject(props, ['children', 'defaultValue','value','ItemRender', 'itemProps', 'className', 'options', 'onChange']);
    if (options && options.length) {
      children = options.map((option, index) => {
        return <ItemRender key={index}
                         group
                         size={size}
                         disabled={disabled}
                         value={this.checking(option.value)}
                         onChange={this.setCheckedValue}
                         checkedValue={option}
                         label={option.label}
                         {...itemProps}
        />;
      });
    }
    const classes = classNames(className, defaultStyles.group);
    return <div className={classes} {...other}>
      {children}
    </div>;
  }
}

RadioGroup.defaultProps = {
  options: [],
  ItemRender:Radio,
  itemProps:{}
};
RadioGroup.propTypes = {
  defaultValue: PropTypes.any,
  value: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func
};
