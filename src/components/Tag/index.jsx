import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { noop } from '../../utils/utils';

export default class Tag extends React.Component {
  onClose = (e) => {
    e.stopPropagation();
    const { onClose } = this.props;
    onClose();
  };
  render() {
    const {
      children,
      style,
      className,
      type,
      ghost,
      color,
      closable,
      ...other
    } = this.props;
    const styles = style;
    const classes = classNames('tag', className, {
      [`tag-${type}`]: !ghost && !color,
      [`tag-${type}-ghost`]: ghost && !color,
      'tag-close': closable,
    });
    if (color) {
      styles.color = color;
    }
    return (
      <span
        className={classes}
        style={styles}
        {...other}
      >
        {children}
        { (closable && (
          <Icon
            type="close"
            className="tag-close-icon"
            onClick={this.onClose}
          />)) || null
        }
      </span>);
  }
}
Tag.defaultProps = {
  ghost: false,
  type: 'primary',
  closable: false,
  color: '',
  onClose: noop,
  style: {},
  className: '',
};

Tag.propTypes = {
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  ghost: PropTypes.bool,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};
