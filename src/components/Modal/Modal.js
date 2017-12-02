import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import Button from '../Button';
import WrapDialog from './WrapDialog';

import styles from './Modal.less';

export default class Modal extends Component {
  handleClose = (e) => {
    e && e.stopPropagation();
    const {onCancel} = this.props;
    onCancel && onCancel();
  };

  handleCancel = (e) => {
    e && e.stopPropagation();
    const {onCancel} = this.props;
    onCancel && onCancel();
  };
  handleOk = (e) => {
    e && e.stopPropagation();
    const {onOk} = this.props;
    onOk && onOk();
  };

  render() {
    const {
      title,
      closeClass,
      top,
      contentClass,
      bodyClass,
      headClass,
      style,
      footerClass,
      closable,
      children,
      footer,
      maskClosable,
      cancelText,
      okText,
      ...other
    } = this.props;
    const defaultFooter = footer === undefined ? [
      <Button key="cancel" type="primaryGray" size="small" onClick={this.handleCancel}
              className={styles['button']}>{cancelText}</Button>,
      <Button key="ok" type="primaryBlue" size="small" onClick={this.handleOk}
              className={styles['button']}>{okText}</Button>
    ] : footer;
    return (<WrapDialog {...other} style={style} top={top} maskClosable={maskClosable} onCancel={this.handleClose}
                        bodyClass={classNames(styles['wrapperClass'], bodyClass)}>
      <div className={classNames(styles['header'], headClass, {[styles['header-title']]: title})}>
        <h3 className={styles['title']}>{title}</h3>
        {closable && (
          <Icon className={classNames(styles['close'], closeClass)} onClick={this.handleClose} type="close"/>) || null}
      </div>
      <div className={classNames(styles['content'], contentClass)}>{children}</div>
      {defaultFooter && (<div className={classNames(styles['footer'], footerClass)}>
        {defaultFooter}
      </div>) || null}
    </WrapDialog>);
  }
}
Modal.propTypes = {
  title: PropTypes.any,
  closeClass: PropTypes.string,
  contentClass: PropTypes.string,
  bodyClass: PropTypes.string,
  headClass: PropTypes.string,
  footerClass: PropTypes.string,
  closable: PropTypes.bool,
  footer: PropTypes.any,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  maskClosable: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Modal.defaultProps = {
  closable: true,
  maskClosable: false,
  top: 'center',
  cancelText:'取消',
  okText:'确定'
};