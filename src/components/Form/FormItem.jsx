import React from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import warning from 'warning';
import AsyncValidator from 'async-validator';
import classNames from 'classnames';
import Icon from '../Icon';
import {
  extract,
  NULL,
  UNDFINED,
  noop,
  isFunction,
} from '../../utils/utils';
import pureDecorator from '../../utils/pureDecorator';

function computedStyle(props, name = 'width') {
  const {
    labelPosition,
    labelWidth,
    labelMarginRight,
    horizontal,
  } = props;
  const ret = {};
  if (labelPosition === 'top') return ret;
  if (name === 'width' && labelWidth) {
    ret[name] = Number(labelWidth);
    if (labelMarginRight) {
      ret.marginRight = Number(labelMarginRight);
    }
  } else if (labelMarginRight) {
    ret.marginLeft = labelWidth + labelMarginRight;
  } else {
    ret.marginLeft = labelWidth;
  }
  // 水平排列的时候不设置margin-left
  if (horizontal) {
    ret.marginLeft = 0;
  }
  return ret;
}
function ItemRender(props) {
  const {
    error,
    label,
    align,
    labelStyle,
    className,
    htmlFor,
    required,
    validating,
    errorClass,
    isShowError,
    horizontal,
    children,
    ...other
  } = props;
  const propsNew = extract(other, [
    'labelPosition',
    'labelWidth',
    'labelMarginRight',
  ]);
  return (
    <div
      className={
        classNames(
          'form-item',
          className,
          {
            'form-item-horizontal': horizontal,
            'form-item-error': !error,
            'form-item-validating': validating,
            'form-item-required': required,
          },
        )}
      {...propsNew}
    >
      {
        (label &&
        (
          <label
            htmlFor={htmlFor}
            className={
              classNames(
                'form-item-label',
                `form-item-label-${align}`,
                {
                  'form-item-label-horizontal': horizontal
                },
              )
            }
            style={{ ...computedStyle(props), ...labelStyle }}
          >
            { label }：
          </label>
        )) || NULL
      }
      <div
        className="form-item-content"
        style={computedStyle(props, 'marginLeft')}
      >
        { children }
        <CSSTransition
          classNames="fadeUp"
          timeout={300}
        >
          <p
            key={isShowError}
            className={classNames('form-item-error', errorClass)}
          >
            { ((isShowError && error) && (<Icon type="exclamation-circle" />)) || NULL }
            { (isShowError && error) || NULL }
          </p>
        </CSSTransition>
      </div>
    </div>
  );
}
@pureDecorator
export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      valid: false,
      validating: true,
    };
    this.value = undefined;
  }
  getChildContext() {
    return {
      formItem: this,
    };
  }

  componentDidMount() {
    if (this.hasName()) this.form().addField(this);
  }
  componentWillUnmount() {
    if (this.hasName()) this.form().removeField(this);
    this.defaultValue = '';
    this.value = UNDFINED;
    this.resetFunc = noop;
  }
  getFilteredRule(trigger, _rules) {
    const rules = this.getRules(_rules);
    if (trigger) {
      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
    }
    return rules;
  }
  // 获取验证规则
  getRules(rules) {
    if (rules) {
      return rules[this.props.name] || [];
    }
    const formRules = this.form().props.rules;
    const selfRules = this.props.rules || [];
    const newRules = formRules ? formRules[this.props.name] || [] : [];
    return [].concat(selfRules, newRules);
  }
  // 设置默认值
  setDefaultValue(value) {
    this.defaultValue = value;
  }
  // 设置真实值
  setValue(value) {
    this.value = value;
  }
  // 获取真实值
  getValue() {
    return this.value !== UNDFINED ? this.value : this.defaultValue;
  }
  // 获取默认值
  getDefaultValue() {
    return this.defaultValue;
  }
  // 忽略此Form Item 用于只用到布局
  isIgnore() {
    return this.props.ignore;
  }
  // 判断是否有name, 无name不托管
  hasName() {
    return !!this.props.name;
  }
  // onBlur触发
  blurField = (value) => {
    this.setValue(value);
    if (this.hasName()) this.validate('blur');
  };
  // onChange触发
  changeField = (value) => {
    this.setValue(value);
    this.form().onChange(this.props.name, value);
    setTimeout(() => {
      this.validate('change');
    });
  };
  // 验证
  validate(trigger, cb, _rules) {
    let { validating, valid, error } = this.state;
    const rules = this.getFilteredRule(trigger, _rules);

    if (!rules || rules.length === 0) {
      if (isFunction(cb)) {
        return cb();
      }
      return true;
    }
    validating = true;
    const descriptor = { [this.props.ruleFlag || this.props.name]: rules };
    const validator = new AsyncValidator(descriptor);
    const model = { [this.props.ruleFlag || this.props.name]: this.getValue() };
    validator.validate(model, { firstFields: true }, errors => {
      valid = !errors;
      error = errors ? errors[0].message : '';
      if (isFunction(cb)) {
        cb(errors);
      }
      validating = false;
    });
    this.setState({ validating, valid, error });
    return validating;
  }
  // 托管表单相关组件的回调 reset
  depositReset(func) {
    this.resetFunc = func;
  }
  // 重置表单项
  resetField() {
    const valid = true;
    const error = '';
    this.value = this.defaultValue || '';
    this.resetFunc();
    this.setState({ valid, error });
  }
  form() {
    warning(this.context.form, 'FormItem must be component Form child');
    return this.context.form;
  }

  render() {
    const { error, validating } = this.state;
    const other = extract(this.props, ['component', 'name', 'unInForm', 'rules', 'ruleFlag']);
    const props = {
      labelPosition: this.form().props.labelPosition,
      labelWidth: this.form().props.labelWidth,
      labelMarginRight: this.form().props.labelMarginRight,
      horizontal: this.form().props.horizontal,
      ...other,
      error,
      align: this.props.align || this.form().props.labelAlign || 'left',
      labelStyle: { ...(this.form().props.labelStyle || {}), ...(this.props.labelStyle || {}) },
      validating,
    };
    const Component = this.props.component;
    return (
      <Component {...props}>
        { this.props.children }
      </Component>
    );
  }
}
FormItem.contextTypes = {
  form: PropTypes.any,
};

FormItem.defaultProps = {
  required: false,
  ignore: false,
  component: ItemRender,
  children: NULL,
};
FormItem.propTypes = {
  name: PropTypes.string,
  ruleFlag: PropTypes.any,
  rules: PropTypes.array,
  labelWidth: PropTypes.number,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  required: PropTypes.bool,
  ignore: PropTypes.bool,
  children: PropTypes.node,
  htmlFor: PropTypes.string,
  labelStyle: PropTypes.object,
  align:PropTypes.oneOf(['left', 'center', 'right'])
};
FormItem.childContextTypes = {
  formItem: PropTypes.any,
};
