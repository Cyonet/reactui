import React from 'react';
import propType from 'prop-types';
import classNames from 'classnames';

class MenuItem extends React.Component {
  state = {
    active: false,
  }

  handleClick = () => {

  };

  render() {
    const {
      children,
      name,
    } = this.props;
    const { active } = this.state;
    return (
      <li
        role="menuitem"
        aria-selected={active}
        onClick={this.handleClick}
      >
        {children}
      </li>
    )
  }
}
MenuItem.defaultProps = {
  children: null,
};

MenuItem.propTypes = {
  children: propType.node,
  name: propType.oneOfType([propType.number, propType.string]).isRequired
}
