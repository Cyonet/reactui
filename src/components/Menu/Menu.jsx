import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';

class Menu extends React.Component {
  construct() {
    this.state = {};
  }
  renderMenuItem() {
    return `测试`;
  }

  render() {
    const { mode } = this.props;
    const classes = classNames('menu', `menu-${mode}`);
    return (
      <ul
        role="menu"
        className={classes}
      >
        {this.renderMenuItem()}
      </ul>);
  }
}

Menu.defaultProps = {
  mode: 'vertical',
  active: undefined,
  openMenus: [],
  accordion: false,
  width: 240,
};

Menu.propTypes = {
  mode: propType.oneOf(['vertical', 'horizontal', 'inline']), // 模式
  active: propType.oneOfType([propType.string, propType.number]), // 激活菜单
  openMenus: propType.arrayOf(propType.oneOfType([propType.string, propType.number])), // 展开菜单
  accordion: propType.bool, // 开启手风琴风格。只能展开一个
  width: propType.number, // 宽度
};
