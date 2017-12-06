import React, { Component, cloneElement } from 'react';
import propType from 'prop-types';
import MenuItem from './MenuItem';
import { noop } from '../../utils/utils';

class MenuGroup extends Component {
  displayName = 'MenuGroup';
  renderMenuItem() {
    const {
      active,
      onSelect,
      children,
      onCollect,
    } = this.props;
    return React.Children.map(children, child => {
      const { props } = child;
      onCollect(props.name);
      return cloneElement(child, { ...props, active, onSelect }, props.children);
    });
  }
  render() {
    const { title } = this.props;
    return (
      <li className="menu-group">
        <div className="menu-group-title">{title}</div>
        <ul className="menu-group-list">
          {this.renderMenuItem()}
        </ul>
      </li>);
  }
}

MenuGroup.defaultProps = {
  onSelect: noop,
  onCollect: noop,
  active: [],
};

MenuGroup.propTypes = {
  children: propType.arrayOf(propType.instanceOf(MenuItem)).isRequired,
  title: propType.node.isRequired,
  onSelect: propType.func,
  onCollect: propType.func,
  active: propType.oneOfType([propType.number, propType.string, propType.array]),
};

export default MenuGroup;
