import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from '../../utils/utils';
import Icon from '../Icon';
import Button from '../Button';
import WrapDialog from './WrapDialog';

class Modal extends Component {
  handleClose = (e) => {
    e.stopPropagation();
    this.props.onCancel();
  };
  handleOk = (e) => {
    e.stopPropagation();
    this.props.onOk();
  };

  render() {
    const {
      title,
      closeClass,
      top,
      contentClass,
      bodyClass,
      headClass,
      footerClass,
      closable,
      children,
      footer,
      maskClosable,
      cancelText,
      okText,
      ...other
    } = this.props;
    return (
      <WrapDialog
        {...other}
        top={top}
        maskClosable={maskClosable}
        onCancel={this.handleClose}
        bodyClass={classNames('modal-wrapper', bodyClass)}
      >
        <header className={classNames('modal-header', headClass, { 'modal-header-title': title })}>
          <h3 className="modal-titile">{title}</h3>
          { (closable && <Icon
            className={classNames('modal-close', closeClass)}
            onClick={this.handleClose}
            type="close"
          />) || null }
        </header>
        <div className={classNames('modal-content', contentClass)}>{children}</div>
        { footer || (
          <div className={classNames('modal-footer', footerClass)}>
            <Button type="danger" size="small" onClick={this.handleClose}>{cancelText}</Button>
            <Button size="small" onClick={this.handleOk}>{okText}</Button>
          </div>
        ) }
      </WrapDialog>
    );
  }
}
Modal.propTypes = {
  title: PropTypes.node,
  closeClass: PropTypes.string,
  contentClass: PropTypes.string,
  bodyClass: PropTypes.string,
  headClass: PropTypes.string,
  footerClass: PropTypes.string,
  closable: PropTypes.bool,
  footer: PropTypes.node,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  maskClosable: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};

Modal.defaultProps = {
  closable: true,
  maskClosable: false,
  top: 'center',
  cancelText: '取消',
  okText: '确定',
  onCancel: noop,
  style: null,
  children: null,
  footer: null,
  footerClass: undefined,
  headClass: undefined,
  bodyClass: undefined,
  contentClass: undefined,
  closeClass: undefined,
  title: null,
  onOk: noop,
};

export default Modal;
