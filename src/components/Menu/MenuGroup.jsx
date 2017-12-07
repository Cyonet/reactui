import React, { Component, cloneElement } from 'react';
import propType from 'prop-types';
import { noop } from '../../utils/utils';
import { getComponentName } from './util';

class MenuGroup extends Component {
  displayName = 'MenuGroup';
  renderMenuItem() {
    const {
      active,
      onSelect,
      children,
      onCollect,
      indent,
    } = this.props;
    return React.Children.map(children, child => {
      const { props } = child;
      onCollect(props.name);
      return cloneElement(child, {
        ...props,
        active,
        onSelect,
        indent,
      }, props.children);
    });
  }
  render() {
    const { title, indent } = this.props;
    return (
      <li className="menu-group">
        <div className="menu-group-title" style={{ paddingLeft: ((2 * indent) / 3) }}>{title}</div>
        <ul className="menu-group-list">
          {this.renderMenuItem()}
        </ul>
      </li>);
  }
}

MenuGroup.defaultProps = {
  onSelect: noop,
  onCollect: noop,
  active: undefined,
  indent: 24,
};

MenuGroup.propTypes = {
  children: propType.arrayOf((propValue, key, componentName) => {
    const name = getComponentName(propValue[key]);
    if (!(name === 'MenuItem')) {
      return new Error(`child of index ${key} type is not MenuItem supplied to ${componentName} . Validation failed.`);
    }
    return true;
  }).isRequired,
  title: propType.node.isRequired,
  onSelect: propType.func,
  onCollect: propType.func,
  indent: propType.number,
  active: propType.oneOfType([propType.number, propType.string]),
};

export default MenuGroup;
