/**
 * R91 2017/5/10
 * TablePanel
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { isFunction } from '../../utils/utils';
import { noop } from './utils';
import styles from './index.less';

class Row extends Component {
  state = {
    checked: false,
    disabled: false,
  };
  componentDidMount() {
    this.subscribe();
    this.setRowState(this.props);
  }
  componentWillUnmount() {
    this.unSubscribe();
    this.unSubscribe = null;
  }
  setRowState(props) {
    const { rowState, record, recordIndex } = props;
    const disabled = rowState(record, recordIndex);
    if (typeof disabled === 'object') {
      this.setState({ ...disabled });
    } else {
      this.setState({ disabled });
    }
  }
  subscribe() {
    const { store, rowState } = this.props;
    if (rowState && store) {
      this.unSubscribe = store.subscribe(() => {
        this.setRowState(this.props);
      });
    }
  }
  calcCls() {
    const { checked, disabled } = this.state;
    return classNames(styles.row, this.props.className, { [styles.active]: checked, [styles.disabled]: disabled });
  }
  unSubscribe = noop;
  handleClick = (e) => {
    e.stopPropagation();
    const { onClick, record, recordIndex } = this.props;
    onClick(record, recordIndex);
  }
  render() {
    const { children } = this.props;
    const { checked, disabled } = this.state;
    return (
      <tr
        onClick={ this.handleClick }
        aria-checked={checked}
        aria-disabled={disabled}
        className={this.calcCls()}
      >
        {children}
      </tr>);
  }
}

function Cell(props) {
  const {
    column,
    record,
    recordIndex,
    index,
    onCellClick,
  } = props;
  const cache = {};
  if (column.colSpan === 0 || column.rowSpan === 0) {
    return null;
  }
  if (column.colSpan) {
    cache.colSpan = column.colSpan;
  }
  if (column.rowSpan) {
    cache.rowSpan = column.rowSpan;
  }
  const classes = classNames(
    column.className,
    {
      [styles[column.align || 'center']]: true,
      [styles.ellipsis]: !column.ellipsis,
    },
  );
  function hanleCellClick(e) {
    if (onCellClick) {
      e.stopPropagation();
      onCellClick(record[column.dataIndex || column.key], (column.dataIndex || column.key), index, record, recordIndex );
    }
  }
  return (
    <td
      className={classes}
      {...cache}
      onClick={hanleCellClick}
      style={{ width: column.width || 'auto'}}
    >
      {isFunction(column.render) ?
        column.render(record, recordIndex, index, column.dataIndex || column.key) :
        record[column.dataIndex || column.key]}
    </td>);
}

function TBody(props) {
  const {
    bodyClass,
    rowClassName,
    columns,
    nodata,
    store,
    data,
    rowState,
    rowKey,
    onRowClick,
  } = props;
  return (
    <tbody
      className={classNames(styles.body, bodyClass)}
    >
    {
      data.length ?
        data.map((record, recordIndex) => (
          <Row
            record={record}
            store={store}
            key={rowKey(record, recordIndex)}
            recordIndex={recordIndex}
            rowState={rowState}
            className={rowClassName}
            onClick={onRowClick}
          >
            {
              columns.map((column, index) => (
                <Cell
                  key={isFunction(column.key) ? column.key(record, recordIndex) : `${column.key}-${recordIndex}`}
                  column={column}
                  index={index}
                  record={record}
                  recordIndex={recordIndex}
                />))
            }
          </Row>
        )) :
        (
          <tr className={styles['no-data']}>
            <td colSpan={columns.length}>
              {nodata || <span><i className="iconfont icon-icon" />暂无数据</span>}
            </td>
          </tr>
        )
    }
    </tbody>);
}

export default TBody;
