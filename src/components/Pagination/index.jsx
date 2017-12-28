import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from '../../utils/utils';
import Button from '../Button';
import Icon from '../Icon';

class Pagination extends React.Component {
  constructor(props) {
    // page初始页 total总条数 onChange点击回调 pageSize 每页条数
    super(props);
    this.pageSize = props.pageSize; // 每页显示条数
    this.delta = 2; // 当前页左右最多显示几个页码
    this.state = {
      current: props.page,
      total: props.total,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.total !==
      this.state.total || nextProps.page !== this.state.current
    ) {
      this.setState({
        total: nextProps.total,
        current: nextProps.page,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.total !== this.props.total || this.state.current !== nextState.current) {
      return true;
    }
    return false;
  }

  createPage() {
    const current = Number(this.state.current) || 1; // 当前页
    const last = Math.ceil(Number(this.state.total) / this.pageSize); // 最后一页
    const { delta } = this;
    let left = current - delta;
    let right = current + delta;
    const rangeWithDots = [];
    let l;
    if (right < (delta * 2) + 1) {
      right = (delta * 2) + 1;
    }
    if (left > last - (delta * 2)) {
      left = last - (delta * 2);
    }
    let highlight;
    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i <= right)) {
        highlight = i === current;
        if (l) {
          if (i - l !== 1) {
            rangeWithDots.push((
              <li
                style={{ float: 'left' }}
                key={`..${i}`}
                className={classNames('pagination-item', 'pagination-disabled')}
              >
                ...
              </li>));
          }
        }
        rangeWithDots.push((
          <li
            className={highlight ? 'pagination-current' : 'pagination-item'}
            key={i}
            role="presentation"
            onClick={() => this.changePage(i)}
          >
            {i}
          </li>));
        l = i;
      }
    }
    return rangeWithDots;
  }

  changePage = (i) => {
    if (
      Number.isNaN(i) ||
      i > Math.ceil(this.state.total / this.pageSize) ||
      i < 1 ||
      i === this.state.current
    ) {
      return;
    }
    this.setState({ current: i }, () => { this.props.onChange(i); });
  }

  goToPage = (e) => {
    const val = this.input.value;
    if (Number(val) > this.state.total) {
      return;
    }
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.changePage(val);
      }
    } else {
      this.changePage(val);
    }
  }

  prev = () => {
    let prev = Number(this.state.current) - 1;
    if (prev < 1) {
      prev = 1;
    }
    this.changePage(prev);
  }

  next = () => {
    let next = Number(this.state.current) + 1;
    if (next > Math.ceil(this.state.total / this.pageSize)) {
      next = Math.ceil(this.state.total / this.pageSize);
    }
    this.changePage(next);
  }

  render() {
    const { current, total } = this.state;
    const { className } = this.props;
    return (
      (total && total > this.pageSize &&
        <div style={{ textAlign: 'center' }} className={className}>
          <ul className="pagination-container">
            <li
              role="presentation"
              onClick={this.prev}
              className={classNames('pagination-item', { 'pagination-disabled': current === 1 })}
            >
              <Icon type="left" />
            </li>
            {this.createPage()}
            <li
              role="presentation"
              onClick={this.next}
              className={
                classNames(
                  'pagination-item',
                  { 'pagination-disabled': current === Math.ceil(total / this.pageSize) },
                  )
              }
            >
              <Icon type="right" />
            </li>
          </ul>
          <div className="'pagination-go'">
            到
            <input
              type="text"
              ref={el => { this.input = el; }}
              className="'pagination-input"
              onKeyUp={this.goToPage}
            />
            页
            <Button
              onClick={this.goToPage}
              className="pagination-ok"
              size="xsmall"
            >
              确定
            </Button>
          </div>
        </div>) ||
      null
    );
  }
}
Pagination.defaultProps = {
  onChange: noop,
  className: '',
  pageSize: 10,
  page: 1,
  total: 0,
};

Pagination.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  total: PropTypes.number,
};
export default Pagination;
