import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import Button from '../Button';

function alwayTrue() {
  return true;
}

export default function confirm({
  getContainer,
  onOk = alwayTrue,
  onCancel = alwayTrue,
  okType = 'primary',
  okText,
  cancelType = 'default',
  cancelText,
  content,
  footerClass,
  data,
  width = 500,
  ...other
}) {
  let div;
  if (getContainer) {
    div = getContainer();
  } else {
    div = document.createElement('div');
    document.body.appendChild(div);
  }
  function close() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (!getContainer && unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
      div = null;
    }
  }

  function ok(e) {
    e.stopPropagation();
    if (onOk(data) === true) {
      setTimeout(close, 0);
    }
  }

  function cancel(e) {
    e.stopPropagation();
    if (onCancel(data) === true) {
      setTimeout(close, 0);
    }
  }
  ReactDOM.render((
    <Modal
      visible="visible"
      onOk={ok}
      onCancel={cancel}
      footer={
        (
          (cancelText || okText) &&
          (
            <div className={classNames('confirm-footer', footerClass)}>
              {
                 (
                   okText &&
                   (
                     <Button key="ok" type={okType} size="middle" onClick={ok}>
                       {okText}
                     </Button>)) || null
              }
              {
                (
                  cancelText &&
                  (
                    <Button type={cancelType} size="middle" onClick={cancel}>
                      {cancelText}
                    </Button>)) || null
              }
            </div>)
          ) || null
        }
      style={{ width }}
      {...other}
    >
      {content}
    </Modal>), div);

  return { close: cancel };
}
