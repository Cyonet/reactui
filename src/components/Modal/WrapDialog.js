import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './Dialog';

export default class WrapDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderContent(this);
  }

  componentDidUpdate() {
    this.renderContent(this);
  }

  shouldComponentUpdate({visible}) {
    return !!(this.props.visible || visible);
  }

  componentWillUnmount() {
    this.removeContent();
  }

  getContainer() {
    const {getContainer} = this.props;
    if (getContainer) {
      return getContainer();
    }
    else if (this.layer) {
      return this.layer;
    }
    else {
      const div = document.createElement('div');
      document.body.appendChild(div);
      return div;
    }
  }

  getContent() {
    const {children, ...other} = this.props;
    return (<Dialog {...other}>
      {children}
    </Dialog>);
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


