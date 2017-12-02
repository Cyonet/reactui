import React, { Component } from "react";
import Option from "./option";

import { debounce } from "lodash";
import http from "utils/http";
import styles from "./index.less";
class Combo extends Component {
  state = {
    active: false,
    value: "", //选中的值
    label: "",
    options: this.props.options || [] ,//默认选项
    originOptions: this.props.options||[]
  };

  setUnActive = (value) => {
    this.setState({
      active: false
    });
    if(!value) {
        this.setState({
            label: ''
        })
    }
    this.input.blur();
  };
  handleInputClick = e => {
    e.stopPropagation();
    this.input.focus();
    this.setState({
      active: true
    });
  };
  componentDidMount() {
  }
  handleInputChange = e => {
    e.persist();
    this.setState({
      label: e.target.value,
      value: ''
    });
    let { remote } = this.props;
    if (remote) {
      this.debounceFn(e.target.value);
    } else {
      this.filterInput(e.target.value);
    }
  };
  filterInput = (v) => {
    let {originOptions} = this.state;
    let values = [];
    originOptions.forEach((item)=>{
        if (item.label.indexOf(v)>=0) {
            values.push(item);
        }
    });
    this.setState({
        options: values
    })
  };
  getValue() {
      return this.state.value;
  }
  componentWillMount() {
    document.body.addEventListener("click", this.setUnActive, false);
    this.debounceFn = debounce(
      v => {
          let {url} = this.props;
          http.request(url, {
              value: v
          }).then(({data})=>{
            this.setState({
                options: data
            })
          });
      },
      1000,
      {
        leading: true,
        trailing: true
      }
    );
  }
  componentWillUnmount() {
    document.body.removeEventListener("click", this.setUnActive, false);
  }
  handleItemChange = item => {
    this.setState({
      value: item.value,
      label: item.label
    });
    this.setUnActive(item.value);
  }
  handleNoMatch=(e)=>{
    e.stopPropagation();
    this.setUnActive('');
    this.setState({
        value: '',
        options: this.state.originOptions
    })
  }
  render() {
    let { active, options, label, value } = this.state;
    return (
      <div className={styles.comboWrapper}>
        <div
          className={styles.inputBox + " " + (active ? styles.active : "")}
          onClick={this.handleInputClick}
        >
          <input
            className={styles.input}
            ref={el => (this.input = el)}
            value={label}
            onChange={this.handleInputChange}
          />
        </div>
        <ul
          className={styles.list}
          style={{ display: active ? "block" : "none" }}
        >
          {options.map((item, index) => {
            return (
              <Option
                className={
                  styles.listItem +
                  " " +
                  (item.value == value ? styles.active : "")
                }
                item={item}
                key={index}
                onChange={this.handleItemChange}
              />
            );
          })}
          {!options.length ? <li className={styles.listItem} onClick={this.handleNoMatch}>没有匹配项</li> : null}
        </ul>
      </div>
    );
  }
}

export default Combo;
