import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import MenuItem from './MenuItem';
import MenuGroup from './MenuGroup';
import { noop, inArray } from '../../utils/utils';

class SubMenu extends React.Component {
  displayName = 'SubMenu';
  componentWillUnmount() {
    this.childNames = null;
  }
  childNames = [];
  calceIsOpen() {
    const { openSubMenus, name } = this.props;
    return inArray(openSubMenus, name);
  }
  calceIsActive() {
    const { active, togetherActive } = this.props;
    return togetherActive && inArray(this.childNames, active);
  }
  // 收集子类name
  collectNames(name) {
    const { togetherActive } = this.props;
    if (togetherActive) this.childNames.push(name);
  }
  handleClickTitle = () => {
    const { onTitleClick, name, onOpenChange } = this.props;
    onOpenChange(name, this.calceIsOpen());
    onTitleClick(name);
  };
  renderList() {
    const {
      active,
      onSelect,
      children,
      togetherActive,
    } = this.props;
    return React.Children.map(children, child => {
      const { props, displayName } = child;
      const newProps = { ...props, active, onSelect };
      if (displayName === 'MenuGroup') {
        if (togetherActive) newProps.onCollect = this.collectNames;
        return React.cloneElement(child, newProps, props.children);
      }
      this.collectNames(props.name);
      return React.cloneElement(child, newProps, props.children);
    });
  }

  render() {
    const { title, name } = this.props;
    const expanded = this.calceIsOpen();
    return (
      <li
        key={name}
        className={classNames(
          'menu-submenu',
          { 'menu-submenu-open': expanded, 'menu-submenu-active': this.calceIsActive() },
        )}
      >
        <div
          aria-expanded={expanded}
          onClick={this.handleClickTitle}
          className="menu-submenu-title"
        >
          {title}
          <i className="menu-submenu-arrow" />
        </div>
        <ul className="menu-submenu-list">
          {this.renderList()}
        </ul>
      </li>
    );
  }
}

SubMenu.defaultProps = {
  togetherActive: true,
  onSelect: noop,
  onOpenChange: noop,
  onTitleClick: noop,
  active: [],
  openSubMenus: [],
};

SubMenu.propTypes = {
  title: propType.node.isRequired,
  name: propType.oneOfType([propType.number, propType.string]).isRequired,
  openSubMenus: propType.arrayOf(propType.oneOfType([propType.string, propType.number])), // 从menu 传递
  children: propType.arrayOf(propType.oneOfType([
    propType.instanceOf(MenuItem),
    propType.instanceOf(MenuGroup)])).isRequired,
  togetherActive: propType.bool, // 子节点激活是否同步激活
  onSelect: propType.func,
  onOpenChange: propType.func,
  onTitleClick: propType.func,
  active: propType.oneOfType([propType.number, propType.string, propType.array]),
};
