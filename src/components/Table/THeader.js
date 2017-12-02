import React from 'react';
import classNames from 'classnames';
import {isArray} from 'utils/common';
import styles from './index.less';

export default function (props) {
  const {headerClass} = props;
  let columns = props.columns
  if(!isArray(columns[0])){
    columns = [columns];
  }
  return (<thead className={classNames(styles['thead'], headerClass)}>
  {columns.map((__columns, __index)=>{
    return (<tr key={__index}>
      {
         __columns.map((column, index)=>{
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
           __props.className = styles[`${column.align||'center'}`];
           __props.key = index;
          return <th  {...__props} style={{width: column.width}}>{ column.title }</th>;
        })
      }
    </tr>);
  })}
  </thead>);
}
