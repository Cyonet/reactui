/**
 * @author 91 2017/08/30
 * @description 弹出层
 */
import classNames from 'classnames';
import Confirm from './Confirm';
import Modal from './Modal';
import { noop } from '../../utils/utils';

Modal.warning = function warning({
  onOk,
  content,
  top = 'center',
  okType = 'danger',
  cancelText = '取消',
  okText = '确定',
  contentClass = 'warning',
  ...other
}) {
  return Confirm({
    onOk,
    content,
    top,
    okType,
    cancelText,
    okText,
    contentClass,
    footerClass: 'confirm-footer',
    ...other,
  });
};

// 避免错误弹窗重复
let ERROR_MODAL_OPEN = false;

Modal.error = ({
  content,
  onOk = noop,
  onCancel = noop,
  okText = '确定',
  top = 'center',
  ...other
}) => {
  if (ERROR_MODAL_OPEN) {
    return false;
  }
  ERROR_MODAL_OPEN = true;
  function handleOk() {
    onOk();
    ERROR_MODAL_OPEN = false;
    return true;
  }
  function handleCancel() {
    onCancel();
    ERROR_MODAL_OPEN = false;
    return true;
  }
  return Confirm({
    ...other,
    okText,
    top,
    content,
    contentClass: 'confirm-error',
    footerClass: 'confirm-footer',
    onOk: handleCancel,
    onCancel: handleOk,
  });
};

Modal.alert = ({
  contentClass,
  content,
  top = 'center',
  ...other
}) => Confirm({
  ...other,
  content,
  top,
  contentClass: classNames('confirm-alert', contentClass),
});
Modal.confirm = Confirm;

export default Modal;
