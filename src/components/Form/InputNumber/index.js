/**
 * R91 2017/5/10
 * index
 */
import React       from 'react';
import Input       from 'components/Form2/Input';
import Icon        from 'components/Icon/index';
import Button      from 'components/Button2';
import styles      from './index.less';
import classnames  from 'classnames';
import {formatNumber} from 'utils/common';
export default class InputNumber extends React.Component{
  static defaultProps = {
    max      : Infinity,
    min      : 0,
    type     : 'button',
    name     : '',
    value    : 0,
    step     : 1,
    dot      : 0,
    onChange : () =>{},
    disabled : false,
    formatter: null,
    parse    : null
  };
  state = {
    value        : this.props.value || this.props.min || 1,
    warning       : false,
    minusDisable : false,
    plusDisable  : false
  };
  componentDidMount(){
    this.computedDisabled();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value !== this.props.value || nextProps.min !== this.props.min || nextProps.max !== this.props.max){
      this.computedDisabled(nextProps);
    }
  }
  computedDisabled(nextProps){
    let {value, max, min, dot} = nextProps ||this.props;
    let minusDisable = false, plusDisable = false;
    value = value || min;
    if(max <= value){
      value = max;
      plusDisable  = true;

    }
    if(min >= value){
      value = min;
      minusDisable  = true;
    }
    value = +value.toFixed(dot);
    this.setState(()=>{
      return {plusDisable, minusDisable, value};
    });
  }
  onBlur = (name, value)=>{
    this.handler(name, value);
  };
  handleChange = (e, value) => {
    this.setState({value})
  }
  handler = (name, value)=>{
    const {onChange, max, min, disabled, parse, dot, formatter} = this.props;
    value = formatNumber(dot)(value);
    if(name === undefined){
      value = this.state.value;
      name = this.props.name;
    }
    if(disabled)return;
    let minusDisable = false, plusDisable = false, warning = false;
    if(formatter && parse){
      value = parse(value);
    }
    value = value || min;
    if(max <= value){
      value = max;
      plusDisable = warning = true;

    }
    if(min >= value){
      value = min;
      minusDisable = warning = true;
    }
    onChange && onChange(name, value);
    this.setState(()=>{
      return {plusDisable, minusDisable, warning, value};
    });
  };
  clickMinus = ()=> {
    if(this.props.disabled)return;
    const {minusDisable, value} = this.state;
    if (minusDisable) return false;
    const {step, name} = this.props;
    this.handler(name, value - step);
  };
  clickPlus = ()=>{
    if(this.props.disabled)return;
    const {plusDisable, value} = this.state;
    if (plusDisable) return false;
    const {step, name} = this.props;
    this.handler(name, value + step);
  };

  numberCpt(){
    const {type, name, className, min, formatter, disabled = false} = this.props;
    let {inputDisable, minusDisable, plusDisable, warning ,value} = this.state;
    const classes = classnames(className, styles.inputNumber,[styles[type]]);
    const input = <Input className={classnames(styles.input, {[styles[warning]]:warning})}
                         onBlur={(e, value) => {this.onBlur(name, value);}}
                         disabled={disabled||inputDisable}
                         value={value}
                         onChange={this.handleChange}
                         name={name}
                         />;
    let component;
    if(type == 'inline'){
      component = <div className={classes}>
        {input}
        <div className={styles.handlerWarp}>
          <span disabled={plusDisable} onClick={this.clickPlus} className={styles.btnUp}><Icon type="up"/></span>
          <span disabled={minusDisable} onClick={this.clickMinus} className={styles.btnDown}><Icon type="down"/></span>
        </div>
      </div>;
    }
    else{
      component = <div className={classes}>
        <Button radius={false} disabled={disabled || minusDisable} onClick={this.clickMinus}><Icon type="minus"/></Button>
        {input}
        <Button radius={false}  disabled={disabled || plusDisable} onClick={this.clickPlus}><Icon type="plus"/></Button>
      </div>;
    }
    return component;
  }

  render(){
    return this.numberCpt();
  }
}