/**
 * @author 91 2017/08/30
 * @description 弹出层
 */
import React from 'react';
import classNames from 'classnames';
import Confirm from './Confirm';
import Modal from './Modal';
import styles from './index.less';

Modal.warning = function (config) {
  return Confirm({
    ...config,
    contentClass:config.contentClass||styles.warning,
    footerClass: styles.warningFooter,
    top:config.top||'center',
    okType:config.okType ||'danger',
    onOk:config.onOk,
    content:config.content,
    cancelText:config.cancelText || '取消',
    okText:config.okText ||config.confirmText|| '确定',
  });
};

//避免弹窗重复
let ERROR_MODAL_OPEN = false;
Modal.error = function (config) {
  if(ERROR_MODAL_OPEN)return;
  ERROR_MODAL_OPEN = true;
  function onOk() {
    config.onOk && config.onOk();
    ERROR_MODAL_OPEN = false;
  }
  function onCancel() {
    config.onCancel && config.onCancel();
    ERROR_MODAL_OPEN = false;
  }
  return Confirm({
    ...config,
    okText:config.okText ||config.confirmText|| '确定',
    contentClass: styles.error,
    footerClass: styles.errorFooter,
    top:config.top||'center',
    content:config.content,
    onOk,
    onCancel
  });
};

Modal.alert = function (config) {
  return Confirm({
    ...config,
    content:config.content,
    top:config.top||'center',
    contentClass: classNames(styles.alert, config.contentClass),
  });
};
Modal.confirm = Confirm;

export default Modal;