import React from 'react';
import PropType from 'prop-types';
import classNames from 'classnames';

function Badge(props) {
  const {
    count,
    overflowCount,
    showZero,
    type,
    dot,
    children,
  } = props;
  const classes = classNames('badge', {
    'badge-not-Warp': !children,
  });
  let badge;
  let badgeClass;
  if (!dot) {
    if (count) {
      badge = count <= overflowCount ? count : `${overflowCount}+`;
    }
    badgeClass = 'badge-count';
  } else {
    badgeClass = 'badge-dot';
  }
  badgeClass = classNames(badgeClass, `badge-${type}`);
  return (
    <span className={classes}>
      {children}
      {
        ((dot || showZero) || badge) && (<sup className={badgeClass} title={badge}>{badge}</sup>) || null
      }
    </span>);
}
Badge.defaultProps = {
  overflowCount: 99,
  showZero: false,
  dot: false,
  type: 'primary',
  children: null,
  count: 0,
};
Badge.propTypes = {
  count: PropType.number,
  overflowCount: PropType.number,
  children: PropType.node,
  showZero: PropType.bool,
  dot: PropType.bool,
  type: PropType.oneOf(['success', 'primary', 'danger', 'warning']),
};

export default Badge;