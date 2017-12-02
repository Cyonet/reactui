/**
 * R91 2017/5/22
 * Radio
 */
import React from 'react';
import Checkbox from '../Checkbox';

export default class Radio extends React.Component{
    render(){
        return <Checkbox type="radio" {...this.props}/>;
    }
}

