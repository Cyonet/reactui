import React from 'react';
import propTypes from 'prop-types';
import Dialog from './Dialog';

class WrapDialog extends React.Component {
  shouldComponentUpdate({ visible }) {
    return !!(this.props.visible || visible);
  }
  render() {
    const { visible, ...other } = this.props;
    return visible ? <Dialog {...other} /> : null;
  }
}

WrapDialog.propTypes = {
  visible: propTypes.bool,
};

WrapDialog.defaultProps = {
  visible: false,
};
export default WrapDialog;
