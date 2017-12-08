import React from 'react';
import WrapDialog15 from './WrapDialog15';
import WrapDialog16 from './WrapDialog16';

const WrapDialog = /$16/.test(React.version) ? WrapDialog16 : WrapDialog15;

export default WrapDialog;
