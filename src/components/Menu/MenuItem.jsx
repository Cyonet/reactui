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
    } = this.props;
    const active = this.calcIsActive();
    return (
      <li
        role="menuitem"
        aria-selected={active}
        onClick={this.handleClick}
        key={name}
        className={classNames('menu-item', { 'menu-item-active': active })}
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
};

MenuItem.propTypes = {
  children: propType.node,
  onSelect: propType.func,
  name: propType.oneOfType([propType.number, propType.string]).isRequired,
  active: propType.oneOfType([propType.number, propType.string, propType.array]),
};

export default MenuItem;
