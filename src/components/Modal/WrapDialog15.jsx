import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import Wrapper from './Wrapper';

class WrapDialog extends React.Component {
  componentDidMount() {
    if (this.props.visible) {
      this.renderContent(this);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.renderContent(this);
    } else {
      this.removeContent(this);
    }
  }
  shouldComponentUpdate({ visible }) {
    return this.props.visible !== visible;
  }
  componentDidUpdate() {
    this.renderContent(this);
  }
  componentWillUnmount() {
    this.removeContent();
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

  renderContent() {
    this.layer = this.getContainer();
    ReactDOM.unstable_renderSubtreeIntoContainer(this, this.getContent(), this.layer);
  }

  render() {
    return null;
  }
}

WrapDialog.propTypes = {
  visible: propTypes.bool,
  getContainer: propTypes.func,
  children: propTypes.node,
};

WrapDialog.defaultProps = {
  visible: false,
  getContainer: null,
  children: null,
};

export default WrapDialog;
