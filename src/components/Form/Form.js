import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './index.less';

export default class Form extends React.Component{
  fields = [];
  static defaultProps = {
    labelPosition: 'left',
    labelAlign:'left',
    component:'form'
  };
  getChildContext(){
     return {
       form : this
     };
  }
  addField(field){
    this.fields.push(field);
  }
  removeField(field){
    if (field.props.name) {
      this.fields.splice(this.fields.indexOf(field), 1);
    }
  }
  validate(cd){
    return new Promise((resolve, reject)=>{
      let valid = true;
      let count = 0;
      if (this.fields.length === 0 && cd) {
        cd(true);
        resolve(true);
      }
      this.fields.forEach(field => {
        field.validate('', errors => {
          if (errors) {
            valid = false;
          }
          if (++count === this.fields.length) {
            if(typeof cd === 'function'){ cd(valid);}
            if(valid){
              resolve(true);
            }
            else{
              reject(false);
            }
          }
        });
      });
    })

  }

  onChange = (name, value)=> {
     this.props.onChange && this.props.onChange(name, value);
  };

  validateField(name, cd){
    const field = this.fields.filter(field => field.props.name === name)[0];
    field&&field.validate('', cd);
  }

  getFiledValue(name){
    if(name){
      const field = this.fields.filter(field => field.props.name === name)[0];
      return field && field.getValue();
    }
    else{
      return this.getFieldsValue();
    }
  }
  getFieldsValue(names){
    let cache = {};
    if(Array.isArray(names)){
      this.fields.filter(field => names.indexOf(field.props.name) >= 0 ).forEach(field=>{
        cache[field.props.name] = field.getValue();
      });
    }
    else{
      this.fields.forEach(field=>{
        cache[field.props.name] = field.getValue();
      });
    }
    return cache;
  }
  getFieldsDefaultValue(names){
    let cache = {};
    if(Array.isArray(names)){
      this.fields.filter(field => names.indexOf(field.props.name) >= 0 ).forEach(field=>{
        cache[field.props.name] = field.getDefaultValue() || '';
      });
    }
    else{
      this.fields.forEach(field=>{
        cache[field.props.name] = field.getDefaultValue() || '';
      });
    }
    cache.signType='1';
    return cache;
  }
  resetFields(){
    this.fields.forEach(field => {
      field.resetField();
    });
  }
  render(){
    const {component} = this.props;
    const classes = classNames(defaultStyles.form, this.props.className, defaultStyles[`label-text-${this.props.labelAlign}`], defaultStyles[`label-${this.props.labelPosition}`]);
    return React.createElement(component,{className: classes},this.props.children);
  }
}
Form.propTypes = {
  labelPosition: PropTypes.oneOf(['left', 'top', 'inline']),
  labelAlign:PropTypes.oneOf(['left', 'center', 'right']),
  component:PropTypes.string,
  labelWidth:PropTypes.number,
  labelMarginRight:PropTypes.number,
  horizontal: PropTypes.bool //form-item是否水平排列
};
Form.childContextTypes = {
  form: PropTypes.any
};
