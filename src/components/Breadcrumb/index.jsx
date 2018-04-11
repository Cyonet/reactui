import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

function calcPropValue(data, index, arr, propName, props = {}) {
  if (props.hasOwnProperty(`${propName}Function`)) return props[`${propName}Function`](data, index, arr);
  return props[propName];
}

function ItemRenderer(props) {
  const { enabled, data, className, style, path, itemProps, Router, ...others } = props;
  const classes = classNames(className, 'breadcrumb-item', { 'breadcrumb-link': enabled });
  return (
    <Router className={classes} style={style} to={enabled ? path : null} {...others}>
      {data.name}
    </Router>
  );
}

export default function Breadcrumb(props) {
  const {
    className,
    style,
    routes,
    params,
    itemProps,
    itemRenderer,
    itemRendererFunction,
    itemClassName,
    itemClassNameFunction,
    itemStyle,
    itemStyleFunction,
    separator,
    separatorFunction,
    header,
    footer,
    width,
    ...other
  } = props;
  const children = [];
  let numRoute = routes.length;
  routes.forEach((data, itemIndex, arr) => {
    let paths = [];
    if (!data.name || !data.label) {
      return;
    }
    // fixed home path
    let path = data.path && data.path.replace(/^\/(?=\w)/, '');
    // params not be must
    if (params) {
      Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, params[key]);
      });
    }
    if (path) {
      paths.push(path);
    }
    let renderProps = {
      key: itemIndex,
      data,
      // onClick:this.onItemClick.bind(this, itemIndex),
      path: paths.join('/'),
      className: this.calcPropValue(data, itemIndex, arr, 'itemClassName'),
      style: this.calcPropValue(data, itemIndex, arr, 'itemStyle'),
    };

    let ItemRendererClass = calcPropValue(data, itemIndex, arr, 'itemRenderer', props) || ItemRenderer;
    children.push(
      <ItemRendererClass
        itemProps={{ ...itemProps, itemIndex }}
        enabled={itemIndex !== numRoute - 1}
        {...renderProps}
      />
    );
    children.push(
      <span key={`separator-${itemIndex}`}>{calcPropValue(data, itemIndex, arr, 'separator', props)}</span>
    );
  });
  children.pop();
  return (
    <div className={classNames('breadcrumb', className)} style={style} {...other}>
      {header}
      {children}
      {footer}
    </div>
  );
}

Breadcrumb.defaultProps = {
  header: <span>您的位置：</span>,
  separator: <Icon className="breadcrumb-separator" type="right" />,
};

Breadcrumb.propTypes = {
  width: PropTypes.number,
};
