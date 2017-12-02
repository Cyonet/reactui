import React, { Component } from 'react';

class Option extends Component {
    handleChange(item){
        this.props.onChange(item);
    }
    render() {
        let {item, ...otherProps} = this.props;
        return (
            <li {...otherProps} onClick={this.handleChange.bind(this, item)}>{item.label}</li>
        );
    }
}

export default Option;