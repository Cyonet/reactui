/**
 * Created by Administrator on 2016/12/26.
 */
import React from "react";
import Button from "../Button";
import Input from "../Form/Input";
import Icon from "../Icon";
import defaultStyle from "./index.less";

export default class Pagination extends React.Component {
  state = {
    current: this.props.page,
    inited: false,
    total: this.props.total
  };
  constructor(props) {
    //props 
    //page初始页 total总条数 onChange点击回调 pageSize 每页条数
    super(props);
    this.pageSize = props.pageSize; //每页显示条数
    this.total = this.state.total; //数据总条数
    this.delta = 2; //当前页左右最多显示几个页码
  }
  componentDidMount() {
    this.setState({
      inited: true
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.total !==
      this.state.total || nextProps.page != this.state.current
    ) {
      this.setState({
        total: nextProps.total,
        current: nextProps.page
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.total!=this.props.total||this.state.current!=nextState.current) {
      return true;
    }else{
      return false;
    }
  }
  
  createPage() {
    var current = Number(this.state.current) || 1, //当前页
      last = Math.ceil(Number(this.state.total) / this.pageSize), //最后一页
      delta = this.delta,
      left = current - delta,
      right = current + delta,
      range = [],
      rangeWithDots = [],
      l;
    if (right < delta * 2 + 1) {
      right = delta * 2 + 1;
    }
    if (left > last - delta * 2) {
      left = last - delta * 2;
    }
    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i <= right)) {
        range.push(i);
      }
    }
    let highlight;
    for (let i of range) {
      highlight = i == current ? true : false;
      if (l) {
        if (i - l !== 1) {
          rangeWithDots.push(
            <li
              style={{
                float: "left"
              }}
              key={".." + i}
              className={defaultStyle.normal + " " + defaultStyle.disabled}
            >
              ...
            </li>
          );
        }
      }
      rangeWithDots.push(
        <li
          className={highlight ? defaultStyle.current : defaultStyle.normal}
          key={i}
          onClick={this.changePage.bind(this, i)}
        >
          {i}
        </li>
      );
      l = i;
    }
    return rangeWithDots;
  }
  changePage(i) {
    if (
      isNaN(i) ||
      i > Math.ceil(this.state.total / this.pageSize) ||
      i < 1 ||
      i == this.state.current
    ) {
      return;
    }
    this.setState(
      {
        current: i
      },
      function() {
        this.props.onChange && this.props.onChange(i);
      }
    );
  }
  goToPage(e) {
    let val = this.input.value;
    if (Number(val)>this.state.total) {
      return;
    }
    if (e.keyCode) {
      if (e.keyCode==13) {
        this.changePage(val);
      }
    }else{
      this.changePage(val);
    }
  }
  prev() {
    let prev = Number(this.state.current) - 1;
    if (prev < 1) {
      prev = 1;
    }
    this.changePage(prev);
  }
  next() {
    let next = Number(this.state.current) + 1;
    if (next > Math.ceil(this.state.total / this.pageSize)) {
      next = Math.ceil(this.state.total / this.pageSize);
    }
    this.changePage(next);
  }
  render() {
    let { current, total } = this.state;
    const { className } = this.props;
    return (
      (total && total>this.pageSize &&
        <div style={{ textAlign: "center" }} className={className}>
          <ul className={defaultStyle.pageContainer}>
            <li
              onClick={this.prev.bind(this)}
              className={
                defaultStyle.normal +
                " " +
                (this.state.current == 1 ? defaultStyle.disabled : "")
              }
            >
              <Icon type="left" />
            </li>
            {this.createPage()}
            <li
              onClick={this.next.bind(this)}
              className={
                defaultStyle.normal +
                " " +
                (this.state.current == Math.ceil(total / this.pageSize)
                  ? defaultStyle.disabled
                  : "")
              }
            >
              <Icon type="right" />
            </li>
          </ul>
          <div className={defaultStyle.goTo}>
            跳转到
            <input
              type="text"
              ref={el => (this.input = el)}
              className={defaultStyle.pageInput}
              onKeyUp={this.goToPage.bind(this)}
            />
            页
            <Button
              onClick={this.goToPage.bind(this)}
              className={defaultStyle.pageNum}
              size="xsmall"
              type="defaultGray"
              style={{
                width: "60px",
                marginLeft: "10px"
              }}
            >
              确定
            </Button>
          </div>
        </div>) ||
      null
    );
  }
}
