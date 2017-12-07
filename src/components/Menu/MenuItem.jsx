import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import { noop } from '../../utils/utils';

class MenuItem extends React.Component {
  displayName = 'MenuItem';
  calcIsActive() {
    const { active, name } = this.props;
    return active === name;
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onSelect, name } = this.props;
    onSelect(name);
  };

  render() {
    const {
      children,
      name,
      indent,
      mode,
    } = this.props;
    const active = this.calcIsActive();
    const style = {};
    if (mode !== 'horizontal') {
      style.paddingLeft = indent;
    }
    return (
      <li
        role="menuitem"
        aria-selected={active}
        onClick={this.handleClick}
        key={name}
        className={classNames('menu-item', { 'menu-item-acitve': active })}
        style={style}
      >
        {children}
      </li>
    );
  }
}
MenuItem.defaultProps = {
  children: null,
  active: undefined,
  onSelect: noop,
  indent: 24,
  mode: 'vertical',
};

MenuItem.propTypes = {
  children: propType.node,
  onSelect: propType.func,
  indent: propType.number,
  mode: propType.oneOf(['vertical', 'horizontal']),
  name: propType.oneOfType([propType.number, propType.string]).isRequired,
  active: propType.oneOfType([propType.number, propType.string, propType.array]),
};

export default MenuItem;
