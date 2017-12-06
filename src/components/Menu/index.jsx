import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import { noop, unique, extract } from '../../utils/utils';
import MenuItem from './MenuItem';
import MenuGroup from './MenuGroup';
import SubMenu from './SubMenu';
import { getComponentName } from './util';

function formatOpens(openSubMenus, accordion) {
  if (accordion) return openSubMenus.slice(0, 1);
  return unique(openSubMenus);
}
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      openSubMenus: formatOpens(props.openSubMenus, props.accordion),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { active, openSubMenus } = nextProps;
    if (active !== this.props.active && active) {
      this.setState({ active });
    }
    if (openSubMenus !== this.props.openSubMenus && openSubMenus) {
      this.setState({ openSubMenus: formatOpens(openSubMenus, this.props.accordion) });
    }
  }
  handleSelect = (active) => {
    const { onSelect } = this.props;
    onSelect(active);
    this.setState({ active });
  };
  handleClickSubMenu = (name, isOpen) => {
    const { onOpenChange, accordion } = this.props;
    let opens = null;
    if (accordion) { // 手风琴只能同时一个展开
      if (isOpen) {
        opens = [];
      } else {
        opens = [name];
      }
    } else {
      opens = [...this.state.openSubMenus];
      if (isOpen) {
        const index = opens.indexOf(name);
        opens.splice(index, 1);
      } else {
        opens.push(name);
      }
    }
    onOpenChange(opens, name, !isOpen);
    this.setState({ openSubMenus: opens });
  };
  renderMenuItem() {
    const {
      active,
      openSubMenus,
    } = this.state;
    return React.Children.map(this.props.children, child => {
      const { props } = child;
      const newProps = {
        ...props,
        active,
        onSelect: this.handleSelect,
      };
      delete newProps.children;
      const displayName = getComponentName(child);
      if (displayName === 'MenuGroup') {
        return React.cloneElement(child, newProps, props.children);
      } else if (displayName === 'MenuItem') {
        return React.cloneElement(child, newProps, props.children);
      } else if (displayName === 'SubMenu') {
        newProps.openSubMenus = openSubMenus;
        newProps.onOpenChange = this.handleClickSubMenu;
        return React.cloneElement(child, newProps, props.children);
      }
      return null;
    });
  }

  render() {
    const {
      mode,
      theme,
      className,
      ...other
    } = this.props;
    const classes = classNames('menu', `menu-${theme}`, `menu-${mode}`, className);
    const otherProps = extract(other, ['active', 'openSubMenus', 'accordion', 'onSelect', 'onOpenChange']);
    return (
      <ul
        role="menu"
        className={classes}
        {...otherProps}
      >
        {this.renderMenuItem()}
      </ul>);
  }
}

Menu.defaultProps = {
  mode: 'vertical',
  active: undefined,
  openSubMenus: [],
  accordion: false,
  className: undefined,
  onSelect: noop,
  onOpenChange: noop,
  theme: 'light',
};

Menu.propTypes = {
  mode: propType.oneOf(['vertical', 'horizontal']), // 模式
  theme: propType.oneOf(['light', 'dark']), // 模式
  active: propType.oneOfType([propType.string, propType.number]), // 激活菜单
  openSubMenus: propType.arrayOf(propType.oneOfType([propType.string, propType.number])), // 展开菜单
  accordion: propType.bool, // 开启手风琴风格。只能展开一个
  className: propType.string,
  onSelect: propType.func,
  onOpenChange: propType.func,
  children: propType.arrayOf((propValue, key, componentName) => {
    const name = getComponentName(propValue[key]);
    if (!((name === 'MenuItem') || (name === 'SubMenu') || (name === 'MenuGroup'))) {
      return new Error(`child of index ${key} type is not MenuItem or SubMenu or MenuGroup
        supplied to ${componentName} . Validation failed.`);
    }
    return true;
  }).isRequired,
};

export default Menu;
export {
  Menu,
  MenuItem,
  SubMenu,
  MenuGroup,
};
