import React from 'react';
import PropType from 'prop-types';
import classNames from 'classnames';

function Icon({ type, className, ...other }) {
  return <i className={classNames('icon', 'iconfont', `icon-${type}`, className)} {...other} />;
}

Icon.defaultProps = {
  className: '',
};

Icon.propTypes = {
  type: PropType.string.isRequired,
  className: PropType.string,
};

export default Icon;
