import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';
import customizeStore from './customizeStore';
import {
  shallowEqual,
  isFunction,
  noop,
} from '../../utils/common';
import pureDecorator from '../../utils/pureDecorator';
import { stopPropagation } from './utils';
import Theader from './THeader';
import SelectionBox from './SelectionBox';
import SelectionCheckboxAll from './SelectionAllBox';
import TBody from './TBody';

const CHECK_TYPE_RADIO = 'radio';

@pureDecorator
class Table extends Component {
  constructor(props) {
    super(props);
    this.CheckboxPropsCache = {};
    // 添加观察者
    this.store = customizeStore({
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
    });
  }
  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.CheckboxPropsCache = {};
    }
    const rowSelectionCache = nextProps.rowSelection;
    const { rowSelection } = this.props;
    // 设置默认选中项
    if (rowSelection) {
      if (rowSelection.defaultSelectedKeys &&
        !shallowEqual(rowSelectionCache.defaultSelectedKeys, rowSelection.defaultSelectedKeys)) {
        this.store.setState({
          selectedRowKeys: [...(rowSelectionCache.defaultSelectedKeys || [])],
        });
      }
      if (rowSelection.getCheckboxProps !== rowSelectionCache.getCheckboxProps) {
        this.CheckboxPropsCache = {};
      }
    }
  }
  componentWillUnmount() {
    this.CheckboxPropsCache = null;
    this.store = null;
  }
  // 过滤掉不可用的项
  getCheckboxPropsByItem = (record, index) => {
    const { rowSelection } = this.props;
    const key = this.getRecordKey(record, index);
    // 缓存
    if (!this.CheckboxPropsCache[key]) {
      this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps ? rowSelection.getCheckboxProps(record) : true;
    }
    return this.CheckboxPropsCache[key];
  };
  // 获取key值将用于选中或作为每行的props
  getRecordKey = (record, index) => {
    const { rowKey } = this.props;
    const recordKey = isFunction(rowKey) ?
      rowKey(record, index) : record[rowKey];
    return recordKey === undefined ? index : recordKey;
  };
  // 设置选中列表
  setSelectedRowKeys(selectedRowKeys, {
    selectWay,
    record,
    checked,
    turnChangeKeys,
  }) {
    const { rowSelection = {} } = this.props;
    if (!('selectedRowKeys' in rowSelection)) {
      this.store.setState({ selectedRowKeys });
    }
    const { data = [] } = this.props;
    // 减少没必要的计算
    if (!rowSelection.onChange && !rowSelection[selectWay]) {
      return;
    }
    const selectedRows = data.filter((row, i) => selectedRowKeys.indexOf((this.getRecordKey(row, i))) >= 0);
    if (rowSelection.onChange) {
      rowSelection.onChange(selectedRows, selectedRowKeys);
    }
    if (selectWay === 'onSelect' && rowSelection.onSelect) {
      rowSelection.onSelect(record, checked, selectedRows);
    } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
      const changeRows = data.filter((row, i) => turnChangeKeys.indexOf(this.getRecordKey(row, i)) >= 0);
      rowSelection.onSelectAll(checked, selectedRows, changeRows);
    }
  }
  getRowState = (row, index) => {
    if ('rowSelection' in this.props) {
      const noDisabled = this.getCheckboxPropsByItem(row, index);
      let active = false;
      if (noDisabled) {
        active = this.store.getState().selectedRowKeys.indexOf(this.getRecordKey(row, index)) >= 0;
      }
      return { disabled: !noDisabled, active };
    }
    return {};
  };
  // 矫正表头配置
  flatSelection() {
    const { rowSelection, columns, data = [] } = this.props;
    if (rowSelection) {
      const filterData = data.filter((record, index) => {
        if (rowSelection.getCheckboxProps) {
          return this.getCheckboxPropsByItem(record, index);
        }
        return true;
      });
      const selectionColumn = {
        key: rowSelection.key ? rowSelection.key : 'selection-column',
        render: this.renderSelectionBox(),
        className: rowSelection.className,
        headerClass: rowSelection.headerClass,
        width: rowSelection.width,
      };
      const checkboxAllDisabled = !filterData.length;
      selectionColumn.title = (
        <div className={classNames(styles.selectAll)}>
          {
            (rowSelection.type !== CHECK_TYPE_RADIO && (
              <SelectionCheckboxAll
                store={this.store}
                data={filterData}
                getRecordKey={this.getRecordKey}
                disabled={checkboxAllDisabled}
                onSelect={this.handleSelectRow}
                changeState={this.changeSelectAllState}
              />)) || null
          }
          {rowSelection.text || ''}
        </div>
      );
      if (rowSelection.hasFooter) { // 底部也有全选场景
        selectionColumn.footer = (rowSelection.type !== CHECK_TYPE_RADIO && (
          <SelectionCheckboxAll
            store={this.store}
            data={filterData}
            getRecordKey={this.getRecordKey}
            disabled={checkboxAllDisabled}
            onSelect={this.handleSelectRow}
          />)) || null;
      }
      if (columns[0] && columns[0].key === 'selection-column') {
        columns[0] = selectionColumn;
      } else {
        columns.unshift(selectionColumn);
      }
    }
    return columns;
  }
  // 表头check
  changeSelectAllState = (checked) => {
    const { rowSelection: { type, changeAll } } = this.props;
    if (type !== CHECK_TYPE_RADIO) {
      if (changeAll) changeAll(checked);
    }
  };
  // 选中处理
  handleSelect = (record, rowIndex, rowKey, checked) => {
    const { rowSelection } = this.props;
    let { selectedRowKeys } = this.store.getState();
    const key = rowKey || this.getRecordKey(record, rowIndex);
    if (rowSelection.type === CHECK_TYPE_RADIO) { // radio
      selectedRowKeys = [key];
    } else if (checked) {
      selectedRowKeys.push(key);
    } else {
      selectedRowKeys = selectedRowKeys.filter((i) => key !== i);
    }
    this.setSelectedRowKeys(selectedRowKeys, {
      selectWay: 'onSelect',
      record,
      rowIndex,
      checked,
    });
  };
  // 全选
  handleSelectRow = (selectionKey) => {
    const { data = [] } = this.props;
    const { selectedRowKeys } = this.store.getState();
    // 选中的项
    const checkedKeys = data.filter((record, i) =>
      this.getCheckboxPropsByItem(record, i)).map((record, i) => this.getRecordKey(record, i));
    // 本轮次选中的项
    const turnChangeKeys = [];
    let selectWay = '';
    let checked;
    // handle default selection
    switch (selectionKey) {
      case 'all': // 全选
        checkedKeys.forEach(key => {
          if (selectedRowKeys.indexOf(key) < 0) {
            selectedRowKeys.push(key);
            turnChangeKeys.push(key);
          }
        });
        selectWay = 'onSelectAll';
        checked = true;
        break;
      case 'removeAll': // 取消选中
        checkedKeys.forEach(key => {
          if (selectedRowKeys.indexOf(key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
            turnChangeKeys.push(key);
          }
        });
        selectWay = 'onSelectAll';
        checked = false;
        break;
      default:
        break;
    }
    this.setSelectedRowKeys(selectedRowKeys, {
      selectWay,
      checked,
      turnChangeKeys,
    });
  };
  // checkBox的render
  renderSelectionBox = () => (record, index) => {
    const { rowSelection } = this.props;
    const rowKey = this.getRecordKey(record, index); // 从 1 开始
    const disabled = this.getCheckboxPropsByItem(record, index);
    if (!disabled) {
      if (isFunction(rowSelection.render)) {
        return rowSelection.render(record, index);
      }
      return rowSelection.render;
    }
    return (
      <SelectionBox
        store={this.store}
        rowIndex={index}
        type={rowSelection.type}
        rowKey={rowKey}
        disabled={!disabled}
        onClick={stopPropagation}
        onChange={(name, value) => {
          this.handleSelect(record, index, rowKey, value);
        }}
      />
    );
  };
  renderBody(columns) {
    // 待优化，TR 抽象为React Component,注册到store之中来更改TR的状态
    const {
      bodyClassName,
      rowClassName,
      data = [],
      rowSelection,
      rowState,
      nodata,
      onRowClick,
    } = this.props;
    return (
      <TBody
        store={rowSelection ? this.store : null}
        rowState={rowSelection ? this.getRowState : rowState}
        columns={columns}
        bodyClass={classNames(styles.tbody, bodyClassName)}
        data={data}
        rowKey={this.getRecordKey}
        nodata={nodata}
        rowClassName={rowClassName}
        onRowClick={onRowClick}
      />);
  }
  renderLoaded() {
    const { loadRender } = this.props;
    return (
      <div className={styles.loaded} style={{ display: 'block' }}>
        <div className={styles.mask} />
        <div>
          {(loadRender && loadRender()) || (
            <div className={styles.loadBox}>
              <div className={styles.loader} />
            </div>)
          }
        </div>
      </div>);
  }
  render() {
    const {
      loading,
      className,
      klassName,
      data,
      renderFooter,
      showHeader = true,
      headerClassName,
      bordered,
    } = this.props;
    const columns = this.flatSelection();
    let renderColums = columns;
    if (Array.isArray(columns[0])) {
      renderColums = columns[columns.length - 1];
    }
    return (
      <div className={classNames(styles.container, klassName)}>
        <table className={classNames(className, styles.table, { [styles.bordered]: bordered })}>
          { (showHeader && <Theader columns={columns} headerClass={headerClassName} />) || null}
          {this.renderBody(renderColums)}
        </table>
        { (data && data.length && renderFooter && renderFooter(renderColums)) || null}
        { (loading && this.renderLoaded()) || null}
      </div>);
  }
}
Table.propTypes = {
  data: PropTypes.array, // 数据
  rowSelection: PropTypes.shape({
    type: PropTypes.oneOf(['radio', 'checkbox']), // 多选/单选，checkbox or radio
    selectedRowKeys: PropTypes.array, // 指定选中项的 key 数组，需要和 onChange 进行配合
    onChange: PropTypes.func, // 选中项发生变化的时的回调
    onSelect: PropTypes.func, // 用户手动选择/取消选择某列的回调
    onSelectAll: PropTypes.func, // 用户手动选择/取消选择所有列的回调
    hideSelections: PropTypes.func, // 去掉『全选』默认选项
    title: PropTypes.string, // 表头文字
  }),
  // columns: PropTypes.isRequired.oneOfType(
  //   [PropTypes.arrayOf(PropTypes.shape(Column)), PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape(Column)))]
  // ), //列表配置项
  showHeader: PropTypes.bool, // 是否显示表头
  // title: PropTypes.any, // 表格标题
  bordered: PropTypes.bool, // 是否展示外边框和列边框
  // onRowDoubleClick: PropTypes.func, // 双击行时触发
  rowState: PropTypes.func, // 选择框的默认属性配置
  // onRowClick: PropTypes.func, // 点击行时触发
  rowKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]), // 表格行 key 的取值，可以是字符串或一个函数,字符串为数据行的key
  loading: PropTypes.bool, // 页面是否加载中
  rowClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]), // 表格行的类名
  headerClassName: PropTypes.string, // 表投的类名
  bodyClassName: PropTypes.string, // 表投的类名
  className: PropTypes.string, // 表格类名
  nodata: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 无数据提示信息
  onRowClick: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 列表表头
    key: PropTypes.string, // 列数据key,默认为
    dataIndex: PropTypes.string, // 数据项
    render: PropTypes.func, // 单元格渲染
    colSpan: PropTypes.number, // 表头横向合并
    rowSpan: PropTypes.number, // 表头纵向合并
    width: PropTypes.number, // 列宽
    className: PropTypes.string, // 单元格类名
    onCellClick: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
  })).isRequired, // 无数据提示信息
};

Table.defaultProps = {
  loading: false,
  data: [],
  rowSelection: null,
  rowKey: '',
  rowState: noop,
  showHeader: true,
  bordered: false,
  rowClassName: '',
  headerClassName: '',
  bodyClassName: '',
  className: '',
  nodata: '',
  onRowClick: noop,
};
export default Table;
