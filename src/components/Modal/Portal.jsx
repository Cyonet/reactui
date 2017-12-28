import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import Wrapper from './Wrapper';

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.layer = this.getContainer();
    this.modalRoot = props.getRoot();
  }
  componentWillUnmount() {
    this.modalRoot.removeChild(this.layer);
    this.modalRoot = null;
    this.layer = null;
  }

  getContainer() {
    const { getContainer } = this.props;
    if (getContainer) {
      return getContainer();
    } else if (this.layer) {
      return this.layer;
    }
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
  }

  getContent() {
    const { children, ...other } = this.props;
    return (<Wrapper {...other}>{children}</Wrapper>);
  }
  render() {
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.getContent(),
      // A DOM element
      this.layer,
    );
  }
}
Portal.propTypes = {
  getContainer: propTypes.func,
  getRoot: propTypes.func,
  children: propTypes.node,
};

Portal.defaultProps = {
  getContainer: null,
  getRoot: () => document.body,
  children: null,
};

export default Portal;
