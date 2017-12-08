import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import getScrollBarSize from '../../utils/scrollbar';
import { noop } from '../../utils/utils';

let openCountZindex = 10000; // z-index
let counter = 0; // 弹出次数
/**
 * 弹出层 基础包装容器。
 * 包括 蒙层, 内容层
 */
class Wrapper extends React.Component {
  componentDidMount() {
    if (this.props.visible) {
      if (!counter) {
        this.addScrollingEffect();
      }
      ++counter;
    }
    ++openCountZindex;
  }
  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      if (nextProps.visible) {
        this.addScrollingEffect();
      } else {
        this.removeScrollingEffect();
      }
    }
  }
  // 禁止或恢复滚动
  componentDidUpdate() {
    if (this.props.visible) {
      if (!counter) {
        this.addScrollingEffect();
      }
      ++counter;
    } else {
      --counter;
      if (!counter) {
        this.removeScrollingEffect();
      }
    }
  }
  // 恢复滚动
  componentWillUnmount() {
    if (this.props.visible) {
      --counter;
      if (!counter) {
        this.removeScrollingEffect();
      }
    }
  }
  // 设置滚动条宽度
  setScrollbar = () => {
    if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
      this.scrollTop = document.body.scrollTop;
    }
  };
  // 检查滚动
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
  // 禁止body 滚动
  addScrollingEffect = () => {
    this.checkScrollbar();
    this.setScrollbar();
    document.body.style.overflow = 'hidden';
  };
  removeScrollingEffect = () => {
    document.body.style.overflow = '';
    this.resetScrollbar();
  };
  // 点击蒙层
  handleClickMask = (e) => {
    e.stopPropagation();
    const { maskClosable, onCancel } = this.props;
    if (maskClosable) {
      onCancel();
    }
  };
  resetScrollbar = () => {
    document.body.scrollTop = this.scrollTop;
    document.body.style.paddingRight = '';
  };
  render() {
    const {
      children,
      animate,
      timeout,
      visible,
      contentClass,
      top,
      style,
      className,
    } = this.props;
    const warpClass = classNames('modal-warpper-body', {
      'modal-warpper-body-hidden': !visible,
      [`${animate}_enter`]: visible,
      [`${animate}_leave`]: !visible,
      'modal-warpper-vertical': top === 'center',
    });
    const warpStyle = top === 'center' ? {} : { position: 'relative', top };
    return (
      <div className={className}>
        <div
          className={classNames('dialog-mask', {
            'modal-warpper-mask-hidden': !visible,
            fade_enter: visible,
            fade_leave: !visible,
          })}
          style={{ animationDuration: '0.3s', zIndex: openCountZindex }}
        />
        <div
          onClick={this.handleClickMask}
          style={{ animationDuration: `${timeout / 1000}s`, zIndex: openCountZindex }}
          className={warpClass}
        >
          <div
            onClick={(e) => { e.stopPropagation(); }}
            className={classNames('modal-warpper-content', contentClass)}
            style={{ ...warpStyle, ...style }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Wrapper.propTypes = {
  visible: propType.bool.isRequired,
  animate: propType.oneOf([
    'fade',
    'zoom',
    'slideDown',
    'slideLeft',
    'slideRight',
    'slideUp',
    'flip',
    'rotate',
    '',
  ]),
  timeout: propType.number,
  onCancel: propType.func,
  children: propType.node,
  className: propType.string,
  contentClass: propType.string,
  top: propType.oneOfType([propType.string, propType.number]),
  maskClosable: propType.bool,
  style: propType.objectOf(propType.oneOfType([propType.string, propType.number])),
};
Wrapper.defaultProps = {
  timeout: 500,
  animate: 'fade',
  onCancel: noop,
  maskClosable: true,
  children: null,
  top: 'center',
  className: '',
  contentClass: '',
  style: {},
};

export default Wrapper;
