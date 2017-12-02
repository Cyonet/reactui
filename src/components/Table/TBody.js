/**
 * R91 2017/5/10
 * TablePanel
 */
import React, {Component} from 'react';
import {isFunction} from 'utils/common';
import {noop} from './utils';
import styles from './index.less';
import classNames from 'classnames';

class Row extends Component{
  unSubscribe = noop;
  state = {
    checked  : false,
    disabled : false
  };
  componentDidMount() {
    this.subscribe();
    this.setRowState(this.props);
  }

  componentWillUnmount() {
    this.unSubscribe();
    this.unSubscribe = null;
  }

  subscribe() {
    const { store, rowState } = this.props;
    if(rowState && store){
      this.unSubscribe = store.subscribe(() => {
        this.setRowState(this.props);
      });
    }
  }

  setRowState(props) {
    const { rowState, record, recordIndex } = props;
    if(rowState){
      const disabled = rowState(record, recordIndex);
      if(typeof disabled === 'object'){
        this.setState({...disabled});
      }
      else{
        this.setState({disabled});
      }
    }
  }

  calcCls(){
    const {checked, disabled} = this.state;
    return classNames(styles.row, this.props.className, {[styles.active]: checked, [styles.disabled]: disabled});
  }

  render() {
    const { children } = this.props;
    return (<tr className={this.calcCls()}>{children}</tr>);
  }
}

function Cell(props) {
  const {column, record, recordIndex, index} = props;
  const __props = {};
  if(column.colSpan === 0 || column.rowSpan === 0){
    return null;
  }
  if(column.colSpan){
    __props.colSpan = column.colSpan;
  }
  if(column.rowSpan){
    __props.rowSpan = column.rowSpan;
  }
  const classes = classNames(
    column.className,
    {
      [styles[column.align||'center']]: true,
      [styles['ellipsis']]: !column.ellipsis}
  );
  return (<td className = {classes} {...__props}>
    { isFunction(column.render) ?
      column.render(record, recordIndex, index, column.dataIndex):
      record[column.dataIndex||column.key]}
  </td>);
}

class TBody extends Component{
  render(){
    const {bodyClass, rowClassName, columns, nodata, store, data, rowState, rowKey} = this.props;

    return <tbody className={classNames(styles['body'], bodyClass)}>
    {
      data.length ?
        data.map((record, recordIndex) => {
          return  (
            <Row
              row={record}
              store={store}
              key={rowKey(record, recordIndex)}
              recordIndex={recordIndex}
              rowState={rowState}
              className={rowClassName}
            >
              {
                columns.map((column, index)=>(<Cell  key={`${column.key}-${recordIndex}`} column={column} index={index} record={record} recordIndex={recordIndex}/>))
              }
             </Row>);
        }):
        (<tr  className={styles['no-data']}>
          <td  colSpan={columns.length}>
            {nodata? nodata : <span><i className='iconfont icon-icon'/>暂无数据</span>}
          </td>
        </tr>)
    }
    </tbody>;
  }
}
export default TBody;