import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import {
  noop,
  throttle,
} from '../../utils/utils';

class Button extends React.Component {
    state = {
      clicked: false,
    };

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    handleClick = (e, double) => {
      e.preventDefault();
      if (this.props.pop) {
        // 阻止事件传播
        e.stopPropagation();
      }
      const {
        loading,
        disabled,
        onDoubleClick,
        onClick,
      } = this.props;
      if (!loading && !disabled) {
        if (double) {
          onDoubleClick(e);
        } else {
          onClick(e);
        }
        throttle(() => {
          this.setState({ clicked: true }, () => {
            setTimeout(() => {
              if (this.mounted) {
                this.setState({ clicked: false });
              }
            }, 500);
          });
        }, 20);
      }
    }

    render() {
      const {
        type,
        size,
        loading,
        icon,
        text,
        ghost,
        radius,
        children,
        className,
        onClick,
        onDoubleClick,
        width,
        pop,
        ...other
      } = this.props;
      const { clicked } = this.state;
      const buttonStyle = { width: width || null };
      const klass = classNames('btn', `btn-type-${type}`, `btn-size-${size}`, {
        'btn-ghost': ghost,
        'btn-radius': radius,
        'btn-text': text,
        'btn-loaded': loading,
        'btn-clicked': clicked,
      }, className);
      return (
        <button
          className={klass}
          onClick={(e) => {
            this.handleClick(e, false);
          }}
          onDoubleClick={(e) => {
            this.handleClick(e, true);
          }}
          style={buttonStyle}
          {...other}
        >
          { (icon && <Icon className="btn-icon" type={icon} />) || null}
          {children}
          {(loading && <i className="btn-loading" />) || null}
        </button>);
    }
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  text: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'middle', 'small', 'xsmall']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  className: PropTypes.string,
  ghost: PropTypes.bool,
  radius: PropTypes.bool,
  children: PropTypes.node,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  width: PropTypes.number,
  pop: PropTypes.bool,
};

Button.defaultProps = {
  type: 'primary',
  size: 'middle',
  loading: false,
  ghost: false,
  disabled: false,
  icon: '',
  text: false,
  radius: true,
  pop: false,
  children: null,
  className: '',
  width: 0,
  onDoubleClick: noop,
  onClick: noop,
};
export default Button;
