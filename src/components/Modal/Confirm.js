import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import Button from '../Button2';
import styles from './index.less';

export default function confirm({getContainer, onOk, onCancel, okType, okText, cancelType, cancelText, content, footerClass, data, width,...other}) {
  let div;
  if (getContainer) {
    div = getContainer();
  }
  else {
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
    e && e.stopPropagation();
    if(onOk){
      if(onOk(data) !== false){
        setTimeout(close, 0);
      }
    }
    else{
      setTimeout(close, 0);
    }
  }

  function cancel(e) {
    e && e.stopPropagation();
    if(onCancel){
      if(onCancel(data) !== false){
        setTimeout(close, 0);
      }
    }
    else{
      setTimeout(close, 0);
    }
  }
  ReactDOM.render(<Modal
    visible={true}
    onOk={ok}
    onCancel={cancel}
    footer={(cancelText || okText) && (<div className={classNames(styles['confirm-footer'], footerClass)}>
      {okText && <Button key="ok" type={okType || 'primary'} size='middle' onClick={ok}>{okText}</Button> || null}
      {cancelText &&
        <Button type={cancelType || 'default'} size='middle' onClick={cancel}>{cancelText}</Button> || null}
    </div>) || null}
    style={{width: width || 500}}
    {...other}
  >{content} </Modal>, div);

  return {
    close: cancel
  };
}
