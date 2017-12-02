import React from 'react';
import PropType from 'prop-types';
import classNames from 'classnames';
import getScrollBarSize from 'utils/getScrollBarSize';
import styles from './Dialog.less';

let openCountZindex = 10000;//z-index
let counter = 0;
//弹出层无类容
export default class Modal extends React.Component {
  componentDidMount() {
    if(this.props.visible){
      if(!counter){
        this.addScrollingEffect();
      }
      ++ counter;
    }
    ++ openCountZindex;
  }
  componentDidUpdate() {
    if (this.props.visible ) {
      if(!counter){
        this.addScrollingEffect();
      }
      ++ counter;

    } else{
      -- counter;
      if(!counter){
        this.removeScrollingEffect();
      }

    }
  }
  componentWillUnmount() {
    if (this.props.visible) {
      -- counter;
      if(!counter){
        this.removeScrollingEffect();
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if('visible' in nextProps){
      if(nextProps.visible){
        this.addScrollingEffect();
      }
      else{
        this.removeScrollingEffect();
      }
    }
  }
  handleClickMask = (e) => {
    e.stopPropagation();
    const {maskClosable, onCancel} = this.props;
    if (maskClosable) {
      onCancel && onCancel();
    }
  };

  setScrollbar = () => {
    if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
      this.scrollTop = document.body.scrollTop;
    }
  };

  addScrollingEffect = () => {
    this.checkScrollbar();
    this.setScrollbar();
    document.body.style.overflow = 'hidden';
  };
  removeScrollingEffect = () => {
    document.body.style.overflow = '';
    this.resetScrollbar();
  };
  close = (e) => {
    this.props.onClose(e);
  };
  checkScrollbar = () => {
    let fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      const documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    if (this.bodyIsOverflowing) {
      this.scrollbarWidth = getScrollBarSize();
    }
  };

  resetScrollbar = () => {
    document.body.scrollTop = this.scrollTop;
    document.body.style.paddingRight = '';
  };
  render() {
    const {children, animate, timeout, visible, bodyClass, top, style} = this.props;
    const warpClass = classNames(styles['dialog-body'], {
      [styles['dialog-body-hidden']]: !visible,
      [`${animate}_enter`]: visible,
      [`${animate}_leave`]: !visible,
      [styles['dialog-vertical']]: top === 'center'
    });
    const warpStyle = top === 'center' ? {} : {position: 'relative', top: top};
    return (<div>
      <div className={
        classNames(styles['dialog-mask'], {
          [styles['dialog-mask-hidden']]: !visible,
          'fade_enter': visible,
          'fade_leave': !visible
        })
      }  style={{animationDuration: '0.3s', zIndex:openCountZindex}}/>
      <div onClick={this.handleClickMask}
           style={{animationDuration: `${timeout / 1000}s`, zIndex:openCountZindex}}
           className={warpClass}>
        <div onClick={(e) => {
          e.stopPropagation();
        }} className={classNames(styles['dialog-wrap'], bodyClass)} style={{...warpStyle, ...style}}>{children}</div>
      </div>
    </div>);
  }
}

Modal.propTypes = {
  visible: PropType.bool.isRequired,
  animate: PropType.oneOf(['fade', 'zoom', 'slideDown', 'slideLeft', 'slideRight', 'slideUp', 'flip', 'rotate', '']),
  timeout: PropType.number
};
Modal.defaultProps = {
  timeout: 500,
  animate: 'fade',
  style: {}
};