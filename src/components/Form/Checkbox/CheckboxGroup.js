/**
 * R91 2017/5/22
 * CheckboxGroup
 */
import React from 'react';
import classNames from 'classnames';
import defaultStyles from './index.less';
import PropTypes from 'prop-types';
import {splitObject, shallowEqual} from 'utils/common';
import FormItemMixin from '../FormItemMixin';
import PureMixin from '../PureMixin';

import Checkbox from '../Checkbox';

@FormItemMixin
@PureMixin
export default class CheckboxGroup extends React.Component{
   static defaultProps = {
     options: [],
     ItemRender: Checkbox,
     itemProps: {},
     format: v => v
   };

   constructor(props) {
     super(props);
     this.state = {
       value: props.value || props.defaultValue || []
     };
   }

   componentDidMount(){
     this.deposit();
     const {format} = this.props;
     this.setDefaultValue(format(this.props.defaultValue));
   }

   componentWillReceiveProps(nextProp){
     if(nextProp.defaultValue != this.props.defaultValue && nextProp.defaultValue !== undefined){
       const {format} = this.props;
       this.setState({value:format(nextProp.defaultValue)});
       this.setDefaultValue(format(nextProp.defaultValue));
     }
   }

   componentWillUnmount(){
     this.unDeposit();
   }

   setCheckedValue = (option)=>{
    const { state } = this;
    const {format} = this.props;
    let index = state.value.indexOf(option.value);
    let value = [...this.state.value];
    if(index >= 0){
      value.splice(index, 1);
    }
    else{
      value.push(option.value);
    }
    value = format(value);
    if(!this.hasValue()){//受控
      this.setState({value});
    }
    //带验证
    this.changeField(value);
    this.props.onChange && this.props.onChange(value, option);
  };

   getOption(){
     const {options} = this.props;
     if(!options)return [];
     return options.map((option)=>{
        if(typeof option !== 'object'){
          return {
            label: option,
            value: option
          };
        }
        return option;
     });
   }

  checking(value){
     const values = (this.hasValue()? this.props.value: this.state.value);
     return values.indexOf(value) >= 0;
   }

   render() {
     const {props} = this;
     const {className, options, disabled, ItemRender=Checkbox, itemProps={}, size} = props;
     let children = props.children;
     const other = splitObject(props, ['children', 'className', 'options', 'onChange', 'ItemRender', 'itemProps']);
     if (options && options.length) {
       children = this.getOption().map((option, index) => {
         return (<ItemRender
           key={index}
           group
           size={size}
           disabled={disabled}
           label={option.label}
           checkedValue={option}
           value={this.checking(option.value)}
           onChange={this.setCheckedValue}
           option={option}
           {...itemProps}
         />);
       });
     }
     const classes = classNames(className, defaultStyles.group);

     return <div className={classes} {...other}>
       {children}
     </div>;
   }

}

CheckboxGroup.propTypes = {
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func,
  format: PropTypes.func,
};