import React from 'react';
import classNames from 'classnames';
import { isArray } from '../../utils/common';
import styles from './index.less';

export default function THeader(props) {
  const { headerClass } = props;
  let { columns } = props;
  if (!isArray(columns[0])) {
    columns = [columns];
  }
  return (
    <thead
      className={classNames(styles.thead, headerClass)}
    >
      {
        columns.map((__columns, __index) => (
          <tr key={__index}>
            {
              __columns.map((column, index) => {
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
              cache.className = classNames(styles[`${column.align || 'center'}`], column.headerClass);
              cache.key = index;
              return <th {...cache} style={{ width: column.width }}>{column.title}</th>;
            })
            }
          </tr>))
      }
    </thead>);
}
