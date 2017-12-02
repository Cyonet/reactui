/**
 * Created by r91 on 2017/6/4.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import defaultStyle from './index.less';
import {splitObject, isFunction} from 'utils/common';
import FormItemMixin from '../FormItemMixin';

@FormItemMixin
export default class Input extends React.Component {
  static defaultProps = {
    type: 'text',
    rows: 2,
    size:'small',
  };
  reset = false; //重置
  state = {
    value:this.props.value||this.props.defaultValue||''
  };
  componentDidMount(){
    this.setDefaultValue(this.props.defaultValue);
    this.deposit();
  }
  componentWillReceiveProps(nextProp){
    if(nextProp.defaultValue !== this.props.defaultValue){
      this.setState({value: nextProp.defaultValue});
      this.setDefaultValue(nextProp.defaultValue);
    }
  }
  componentWillUnmount(){
    this.unDeposit();
  }
  value(){
    const {refs} = this;
    if(this.props.type == 'textarea'){
      return refs.textarea.value;
    }
    else{
      return refs.input.value;
    }
  }
  handleChange =(e)=>{
    let value = e.target.value;
    const { onChange, format } = this.props;
    this.changeField(value);
    onChange&&onChange(e, value);
    this.setState({value});
  };
  handleFocus = (e)=>{
    const { onFocus } = this.props;
    if (onFocus) onFocus(e);
  };
  handleBlur = (e)=> {
    const { onBlur, format} = this.props;
    let value = e.target.value.trim();
    if(isFunction(format)){
      value = format(value);
    }
    onBlur&&onBlur(e, value);
    this.blurField(value);
    this.setState({value});
  };
  render(){
    const { type='text', size, style={}, prepend, className, append, rows, onMouseEnter, onMouseLeave, inner,
      ...otherProps
    } = this.props;
    const {value} = this.state;
    const classes = classNames(
      type === 'textarea' ? defaultStyle.textarea : defaultStyle.input,
      className,
      size && defaultStyle[`input-${size}`], {
        [defaultStyle['is-disabled']]: this.props.disabled,
        [defaultStyle['input-group']]: prepend || append,
        [defaultStyle['input-prepend']]: !!prepend,
        [defaultStyle['input-append']]: !!append,
        [defaultStyle['input-append-inner']]: !!inner,
      }
    );

    const other = splitObject(otherProps, ['format', 'defaultValue', 'onChange', 'value', 'onFocus', 'format', 'onBlur', 'style']);
    if (type === 'textarea') {
      return (
        <div   data-role="input" style={style} className={classes}>
          <textarea
            { ...other}
            data-role="textarea"
            ref="textarea"
            className={defaultStyle['textarea__inner']}
            rows={rows}
            value={this.props.value === undefined? value: this.props.value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
      )
    } else {
      return (<span
        style={style}
        data-role="input"
        className={classes}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
          { prepend && <div className={defaultStyle['input-group-prepend']}>{prepend}</div> }
          { append && <div className={defaultStyle['input-group-append']} >{append}</div> }
          <div  className= {defaultStyle['input__warp']}>
            <input { ...other }
                   ref="input"
                   type={type}
                   value={this.props.value === undefined? value: this.props.value}
                   className= {defaultStyle['input__inner']}
                   onChange={this.handleChange}
                   onFocus={this.handleFocus}
                   onBlur={this.handleBlur}
            />
          </div>
        </span>);
    }
  }
}

Input.propTypes = {
  // base
  type: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  inner: PropTypes.bool, // 在append, prepend生效
  defaultValue: PropTypes.any,
  value: PropTypes.any,

  // type !== 'textarea'
  size: PropTypes.oneOf(['large', 'small', 'min', 'xsmall']),
  prepend: PropTypes.node,
  append: PropTypes.node,
  rows: PropTypes.number,

  // event
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

