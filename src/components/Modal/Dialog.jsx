import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import Wrapper from './Wrapper';

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.layer = this.getContainer();
    this.modalRoot = props.getRoot();
  }
  componentDidMount() {
    this.modalRoot.appendChild(this.layer);
  }
  componentWillUnmount() {
    this.modalRoot.removeChild(this.layer);
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

  removeContent() {
    if (this.layer) {
      ReactDOM.unmountComponentAtNode(this.layer);
      this.layer.parentNode.removeChild(this.layer);
      this.layer = null;
    }
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
Dialog.propTypes = {
  getContainer: propTypes.func,
  getRoot: propTypes.func,
  children: propTypes.node,
};

Dialog.defaultProps = {
  getContainer: null,
  getRoot: () => document.body,
  children: null,
};

export default Dialog;
