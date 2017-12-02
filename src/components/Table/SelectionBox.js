/**
 * R91 2017/5/10
 * SelectionBox
 * 表格行的选中框。当自定义store的selectedRowKeys改变后通过观察者模式更新当前checkBox状态
 */
import React from 'react';
import {noop} from './utils';
import {Checkbox} from 'components/Form2/Checkbox';

export default class SelectionBox extends React.Component{
  unSubscribe = noop;
  state = {
    checked: this.getCheckState(),
  };

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unSubscribe();
    this.unSubscribe = null;
  }

  subscribe() {
    const { store } = this.props;
    this.unSubscribe = store.subscribe(() => {
      const checked = this.getCheckState();
      this.setState({ checked });
    });
  }

  getCheckState() {
    const { store, rowKey } = this.props;
    return store.getState().selectedRowKeys.indexOf(rowKey) >= 0;
  }

  render() {
    const { disabled, onChange, rowIndex, rowKey, type} = this.props;
    const { checked } = this.state;
    return (
      <Checkbox
        type={type}
        style={{textAlign:'left'}}
        key={`${rowKey}-${rowIndex}`}
        value={checked}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
}


