import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const PREFIX = 'row';

function gutterStyle(gutter, sign = 1, type = 'padding') {
  return gutter > 0 ? { [`${type}Left`]: (gutter / 2) * sign, [`${type}Right`]: (gutter / 2) * sign } : {};
}

function Row(props) {
  const {
    gutter,
    className,
    children,
    type,
    tag,
    justify,
    align,
    style,
    direction,
  } = props;
  let classes;
  if (type === 'flex') {
    classes = classNames(className, {
      [`${PREFIX}-flex`]: true,
      [`${PREFIX}-${justify}`]: justify,
      [`${PREFIX}-${align}`]: align,
      [`${PREFIX}-${direction}`]: direction,
    });
  } else {
    classes = classNames(className, `${PREFIX}`);
  }
  const rowStyle = { ...style, ...gutterStyle(gutter, -1, 'margin') };
  const cols = React.Children.map(children, (col) => {
    if (React.isValidElement(col)) {
      return React.cloneElement(col, {
        type,
        style: { ...col.props.style, ...gutterStyle(gutter) },
      });
    }
    return null;
  });
  return React.createElement(tag, { className: classes, style: rowStyle }, cols);
}

Row.defaultProps = {
  gutter: 0,
  tag: 'div',
  className: '',
  type: '',
  children: null,
  align: 'top',
  justify: 'start',
  style: {},
  direction: 'column',
};

Row.propTypes = {
  gutter: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  type: PropTypes.oneOf(['', 'flex']), // flex
  children: PropTypes.node,
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  direction: PropTypes.oneOf(['column', 'row', 'column-reverse', 'row-reverse']),
  tag: PropTypes.string,
};

export default Row;
