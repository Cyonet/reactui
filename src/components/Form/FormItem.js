/**
 * Created by r91 on 2017/6/4.
 */
import React from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import warning from 'warning';
import AsyncValidator from 'async-validator';
import classNames from 'classnames';
import Icon from 'components/Icon';
import {splitObject} from 'utils/common';
import defaultStyle from './index.less';
import PureMixin from './PureMixin';
let form;

@PureMixin
class ItemRender extends React.Component{
  computedStyle(name='width') {
    const {labelPosition,  labelWidth, labelMarginRight} = this.props;
    const ret = {};
    if (labelPosition === 'top') return ret;
    if (name === 'width' && labelWidth) {
      ret[name] = Number(labelWidth);
      if(labelMarginRight){
        ret.marginRight = Number(labelMarginRight);
      }
    }
    else {
      if(labelMarginRight){
        ret.marginLeft = labelWidth + labelMarginRight;
      }
      else{
        ret.marginLeft = labelWidth;
      }
    }
    //水平排列的时候不设置margin-left
    if (form.props.horizontal) {
      ret['marginLeft'] = 0;
    }
    return ret;
  }
  render(){
    const {error, label, align, labelStyle, className, htmlFor, required, validating, errorClass, isShowError=true, ...other} = this.props;
    const _other = splitObject(other,['labelPosition', 'labelWidth', 'labelMarginRight']);
    let horizontal =  form.props.horizontal;
    return (
      <div  className={classNames(defaultStyle['form-item'],className, horizontal?defaultStyle.horizontal:'', {
        [defaultStyle['is-error']]: error !== '',
        [defaultStyle['is-validating']]: validating,
        [defaultStyle['is-required']]: required
      })} {..._other}>
        {
          label && (

            <label
              htmlFor={htmlFor}
              className={classNames(defaultStyle['form-item-label'], defaultStyle[`form-item-label-${align}`, horizontal?defaultStyle.horizontal:''])}
              style={{...this.computedStyle(), ...labelStyle}}>
              {label}：
            </label>
          )
        }
        <div className={classNames(defaultStyle['form-item-content'], horizontal ? defaultStyle.horizontal:'')} style={this.computedStyle('marginLeft')}>
          {this.props.children}
          <CSSTransition
            classNames="rc-fadeUp"
            timeout = {300}
            >
            <p key={isShowError} className={classNames(defaultStyle['form-item-error'], errorClass)}>
              {isShowError && error && (<Icon type="exclamation-circle"/>) || null}
              {isShowError && error || null}
              </p>
          </CSSTransition>
        </div>
      </div>
    );
  }
}
@PureMixin
export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      valid: false,
      validating: false,
    };
    this.value = '';
  }

  form() {
    warning(this.context.form, 'FormItem must be component Form child');
    return this.context.form;
  }

  getChildContext() {
    return {
      formItem: this
    };
  }

  componentDidMount() {
    this.hasName() && this.form().addField(this);
  }

  componentWillUnmount() {
    this.hasName() && this.form().removeField(this);
    this.defaultValue = '';
    this.value = '';
    this.instance = null;
  }
  isDepositForm(){
    return !this.props.unInForm;
  }
  hasName(){
    return !!this.props.name;
  }

  setDefaultValue(value){
    this.value = this.defaultValue = value;
  }

  setValue(value){
    this.value = value;
  }

  getValue(){
    return this.value!== undefined? this.value: this.defaultValue||'';
  }
  getDefaultValue(){
    return this.defaultValue;
  }

  blurField =(value)=>{
    this.setValue(value);
    this.hasName()&&this.validate('blur');
  };

  changeField = (value)=>{
    this.setValue(value);
    this.form().onChange && this.form().onChange(this.props.name, value);
    setTimeout(() => {
      this.validate('change');
    });
  };

  validate(trigger, cb) {
    let {validating, valid, error} = this.state;
    const rules = this.getFilteredRule(trigger);

    if (!rules || rules.length === 0) {
      cb && cb();
      return true;
    }
    validating = true;
    const descriptor = {[this.props.ruleFlag || this.props.name]: rules};
    const validator = new AsyncValidator(descriptor);
    const model = {[this.props.ruleFlag || this.props.name]: this.getValue()};
    validator.validate(model, {firstFields: true}, errors => {
      valid = !errors;
      error = errors ? errors[0].message : '';
      cb && cb(errors);
      validating = false;
    });
    this.setState({validating, valid, error});
  }

  depositError(error){
    this.setState({validating: false, valid: false, error});
  }
  //托管表单相关组件
  deposit(instance){
    this.instance = instance;
  }
  unDeposit(){
    this.instance = null;
  }
  //重置
  resetField() {
    // let {valid, error} = this.state;
    let valid = true;
    let error = '';
    this.value = this.defaultValue||'';
    if(this.instance){
      if(this.instance.displayName === 'select'){
        this.instance.setState({select:{value: this.value}});
      }
      else{
        this.instance.setState({value: this.value});
      }
    }
    this.setState({valid, error});
  }

  getRules() {
    let formRules = this.form().props.rules;
    let selfRuels = this.props.rules;
    formRules = formRules ? formRules[this.props.name] : [];
    return [].concat(selfRuels || formRules || []);
  }

  getFilteredRule(trigger) {
    const rules = this.getRules();
    if(trigger){
      return rules.filter(rule => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
      });
    }
    return rules;

  }


  render() {
    form = this.context.form;
    const {error, validating} = this.state;
    const other = splitObject(this.props, ['component', 'name', 'unInForm', 'rules', 'ruleFlag']);
    const props = {
      labelPosition: this.form().props.labelPosition,
      labelWidth: this.form().props.labelWidth,
      labelMarginRight: this.form().props.labelMarginRight,
      ...other,
      error,
      align: this.props.align || this.form().props.labelAlign|| 'left',
      labelStyle:   {...(this.form().props.labelStyle||{}), ...(this.props.labelStyle||{})},
      validating
    };
    const Component = this.props.component;
    return <Component {...props}>
      {this.props.children}
      </Component>;
  }
}
FormItem.contextTypes = {
  form: PropTypes.any
};

FormItem.defaultProps = {
  required:false,
  component: ItemRender,
};
FormItem.propTypes = {
  name: PropTypes.string,
  ruleFlag: PropTypes.any, //确保验证未被缓存
  rules: PropTypes.array,
  labelWidth: PropTypes.number,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  required: PropTypes.bool,
  htmlFor: PropTypes.string,
  labelStyle:PropTypes.object,
  align:PropTypes.oneOf(['left', 'center', 'right'])
};
FormItem.childContextTypes = {
  formItem: PropTypes.any
};
