import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import { noop, inArray } from '../../utils/utils';
import { getComponentName } from './util';

class SubMenu extends React.Component {
  displayName = 'SubMenu';
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }
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
  calceIsHoriz() {
    return this.props.mode !== 'horizontal';
  }
  // 收集子类name
  collectNames = (name) => {
    const { togetherActive } = this.props;
    if (togetherActive) this.childNames.push(name);
  }
  handleClickTitle = () => {
    const { onTitleClick, name, onOpenChange } = this.props;
    onOpenChange(name, this.calceIsOpen());
    onTitleClick(name);
  };
  handleMouseEnter = () => {
    if (!this.calceIsHoriz()) {
      this.setState({ hover: true });
    }
  };
  handleMouseLeave = () => {
    if (!this.calceIsHoriz()) {
      this.setState({ hover: false });
    }
  }
  renderList() {
    const {
      active,
      onSelect,
      children,
      togetherActive,
      indent,
    } = this.props;
    return React.Children.map(children, child => {
      const { props } = child;
      const newProps = {
        ...props,
        active,
        onSelect,
        indent: this.calceIsHoriz() ? (2 * indent) : indent,
      };
      const displayName = getComponentName(child);
      if (displayName === 'MenuGroup') {
        if (togetherActive) newProps.onCollect = this.collectNames;
        return React.cloneElement(child, newProps, props.children);
      } else if (displayName === 'MenuItem') {
        this.collectNames(props.name);
        return React.cloneElement(child, newProps, props.children);
      }
      return null;
    });
  }

  render() {
    const {
      title,
      name,
      indent,
      mode,
    } = this.props;
    const expanded = this.calceIsOpen();
    const style = {};
    if (mode !== 'horizontal') {
      style.paddingLeft = indent;
    }
    return (
      <li
        key={name}
        className={classNames(
          'menu-submenu',
          {
            'menu-submenu-open': expanded,
            'menu-submenu-active': this.calceIsActive(),
            'menu-submenu-hover': this.state.hover,
          },
        )}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          aria-expanded={expanded}
          onClick={this.handleClickTitle}
          className="menu-submenu-title"
          style={style}
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
  indent: 24,
  onTitleClick: noop,
  active: undefined,
  mode: 'vertical',
  openSubMenus: [],
};

SubMenu.propTypes = {
  title: propType.node.isRequired,
  name: propType.oneOfType([propType.number, propType.string]).isRequired,
  openSubMenus: propType.arrayOf(propType.oneOfType([propType.string, propType.number])), // 从menu 传递
  children: propType.arrayOf((propValue, key, componentName) => {
    const name = getComponentName(propValue[key]);
    if (!((name === 'MenuItem') || (name === 'MenuGroup'))) {
      return new Error(`child of index ${key} type is not MenuItem or MenuGroup
        supplied to ${componentName} . Validation failed.`);
    }
    return true;
  }).isRequired,
  mode: propType.oneOf(['vertical', 'horizontal']), // 模式
  togetherActive: propType.bool, // 子节点激活是否同步激活
  onSelect: propType.func,
  onOpenChange: propType.func,
  onTitleClick: propType.func,
  indent: propType.number,
  active: propType.oneOfType([propType.number, propType.string]),
};

export default SubMenu;
