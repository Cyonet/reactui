import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';

class Menu extends React.Component {
  construct() {
    this.state = {};
  }
  renderMenuItem() {
    const { inlineIndent } = this.props;
    return `测试${inlineIndent}`;
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
  inlineIndent: 24,
};

Menu.propTypes = {
  mode: propType.oneOf(['vertical', 'horizontal', 'inline']),
  inlineIndent: propType.number,
};
