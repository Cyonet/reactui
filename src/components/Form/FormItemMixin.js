/**
 * Created by black on 2017/6/4.
 */
import PropTypes from 'prop-types';
function decorator(component) {
  component.prototype.getFormItem = function(){
    return this.context.formItem;
  };
  component.prototype.setDefaultValue = function(value){
    const {disabled, notIn} = this.props;
    !disabled && !notIn && this.getFormItem() && this.getFormItem().setDefaultValue(value);
  };
  component.prototype.changeField = function (value) {
    const {disabled, notIn} = this.props;
    !disabled && !notIn && this.getFormItem() && this.getFormItem().changeField(value);
  };
  component.prototype.blurField = function (value) {
    const {disabled, notIn} = this.props;
    !disabled && !notIn && this.getFormItem() && this.getFormItem().blurField(value);
  };
  component.prototype.deposit = function () {
    const {notIn} = this.props;
    !notIn && this.getFormItem() && this.getFormItem().deposit(this);
  }
  component.prototype.unDeposit = function () {
    const {notIn} = this.props;
    !notIn && this.getFormItem() && this.getFormItem().unDeposit();
  }
  component.prototype.depositError = function (err) { // 上报错误
    const {notIn} = this.props;
    !notIn && this.getFormItem() && this.getFormItem().depositError(err);
  }
  component.contextTypes = {
    formItem: PropTypes.any
  };
  return component;
}
export default decorator;