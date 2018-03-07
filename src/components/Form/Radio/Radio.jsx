import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

export default function Radio(props) {
  return (<Checkbox type="radio" {...props} />);
}

Radio.displayName = 'Radio';
