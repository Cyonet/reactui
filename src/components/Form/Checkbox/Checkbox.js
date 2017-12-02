import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PureMixin from '../PureMixin';
import {splitObject} from 'utils/common';
import defaultStyle from './index.less';
import FormItemMixin from '../FormItemMixin';

@FormItemMixin
@PureMixin
export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.value|| this.props.defaultValue||false
    };
  }
  componentDidMount(){
    this.deposit();
    if(!this.props.group){
      this.setDefaultValue(this.props.defaultValue);
    }
  }
  componentWillReceiveProps(nextProps) {
    if('defaultValue' in nextProps && nextProps.defaultValue != this.props.defaultValue){
      this.setState({checked: nextProps.defaultValue});
      if(!this.props.group){
        this.setDefaultValue(nextProps.defaultValue);
      }
    }
  }
  componentWillUnmount(){
    this.unDeposit();
  }

  change = (e)=>{
    e.stopPropagation();
    const {onChange, group, checkedValue} = this.props;
    if(!group){
      this.changeField(!this.state.checked && checkedValue ||'');
    }
    if(!this.hasValue()){
      this.setState({checked: !this.state.checked});
      onChange && onChange(checkedValue||!this.state.checked, !this.state.checked);
    }
    else{
      onChange && onChange(checkedValue||!this.props.value, !this.props.value);
    }
  };
  render() {
    const {
      className,
      name,
      style,
      type='checkbox',
      disabled = false,
      readOnly = false,
      label,
      value,
      children,
      indeterminate,
      size,
      ...other
    } = this.props;
    let _other = splitObject(other,['onChange','label','options', 'option', 'defaultValue','group', 'checked', 'value','checkedValue']);

    let classes = classNames(defaultStyle[type], defaultStyle[size],
       {
        [defaultStyle.disabled]: disabled || readOnly,
       });
    const checked = this.hasValue()? value: this.state.checked;
    return (<label style={style} className={classNames(defaultStyle.warp, className)}>
        <span className={classes}>
           <input checked={checked}
                  readOnly={readOnly}
                  disabled={disabled}
                  type={type}
                  name={name}
                 onChange={this.change}/>
           <span className={classNames(defaultStyle.inner, {
             [defaultStyle.halfCheck]: indeterminate && !checked
           })} {..._other}/>
        </span>
        {label && <span className={defaultStyle.text}>{label}</span>}
        {children && <span className={defaultStyle.text}>{children}</span>}
      </label>);
  }
}

Checkbox.defaultProps = {
  label: '',
  checkedValue:false,
  size:'normal',
  type:'checkbox',
  indeterminate:false
};

Checkbox.propTypes = {
  label: PropTypes.any,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  readOnly: PropTypes.bool,
  checkedValue: PropTypes.any,
  size:PropTypes.oneOf(['small','normal'])
};
