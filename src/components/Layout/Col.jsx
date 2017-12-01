import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isNumeric } from '../../utils/utils';

const DEFAULT_VALUE = 0;
const PREFIX = 'col';

function merger(o, name, classes) {
  if (isNumeric(o)) {
    if (o) {
      return classNames(classes, `${PREFIX}-${name}-${o}`);
    }
    return classes;
  }
  return classNames(classes, {
    [`${PREFIX}-${name}-${o.span}`]: o.span !== DEFAULT_VALUE,
    [`${PREFIX}-${name}-offset-${o.offset}`]: o.offset !== DEFAULT_VALUE,
    [`${PREFIX}-${name}-push-${o.push}`]: o.push !== DEFAULT_VALUE,
    [`${PREFIX}-${name}-pull-${o.pull}`]: o.pull !== DEFAULT_VALUE,
  });
}

function Col(props) {
  const {
    tag,
    children,
    className,
    offset,
    push,
    span,
    style,
    pull,
    width,
    xs,
    sm,
    md,
    lg,
  } = props;
  let classes = classNames(className, PREFIX);
  const colStyles = style;
  if (width) {
    colStyles.width = `${width}px`;
    if (offset) {
      colStyles.marginLeft = `${offset}px`;
    }
    if (pull) {
      colStyles.position = 'relative';
      colStyles.right = `${pull}px`;
      classes = classNames(classes, `${PREFIX}-pull`);
    }
    if (push) {
      colStyles.position = 'relative';
      colStyles.left = `${push}px`;
      classes = classNames(classes, `${PREFIX}-push`);
    }
  } else {
    classes = classNames(classes, {
      [`${PREFIX}-${span}`]: span !== DEFAULT_VALUE,
      [`${PREFIX}-offset-${offset}`]: offset !== DEFAULT_VALUE,
      [`${PREFIX}-push-${push}`]: push !== DEFAULT_VALUE,
      [`${PREFIX}-push`]: push !== DEFAULT_VALUE,
      [`${PREFIX}-pull`]: pull !== DEFAULT_VALUE,
      [`${PREFIX}-pull-${pull}`]: pull !== DEFAULT_VALUE,
    });
    if (xs) {
      classes = merger(xs, 'xs', classes);
    }
    if (sm) {
      classes = merger(sm, 'sm', classes);
    }
    if (md) {
      classes = merger(md, 'md', classes);
    }
    if (lg) {
      classes = merger(lg, 'lg', classes);
    }
  }
  return React.createElement(tag, {
    className: classes,
    style: colStyles,
  }, children);
}

Col.defaultProps = {
  tag: 'div',
  className: '',
  children: null,
  style: {},
  xs: 0,
  sm: 0,
  md: 0,
  lg: 0,
  span: 0,
  offset: 0,
  width: 0,
  push: 0,
  pull: 0,
};
Col.propTypes = {
  tag: PropTypes.string,
  span: PropTypes.number,
  offset: PropTypes.number,
  width: PropTypes.number,
  push: PropTypes.number,
  pull: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  xs: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  sm: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  md: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  lg: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

export default Col;

