import React from 'react';
import {
  Row,
  Col,
} from '../components/Layout';

export default class Layout extends React.Component {
  state = {}
  render() {
    return (
      <div className="demo-cart">
        <Row className="demo-row">
          <Col span={12}>
            <div className="demo-row-red">12</div>
          </Col>
          <Col span={12}>
            <div className="demo-row-blue">12</div>
          </Col>
        </Row>
        <Row className="demo-row">
          <Col span={8}>
            <div className="demo-row-red">6</div>
          </Col>
          <Col span={8}>
            <div className="demo-row-blue">8</div>
          </Col>
          <Col span={8}>
            <div className="demo-row-yellow">8</div>
          </Col>
        </Row>
        <Row className="demo-row">
          <Col span={6}>
            <div className="demo-row-red">6</div>
          </Col>
          <Col span={6}>
            <div className="demo-row-blue">6</div>
          </Col>
          <Col span={6}>
            <div className="demo-row-yellow">6</div>
          </Col>
          <Col span={6}>
            <div className="demo-row-red">6</div>
          </Col>
        </Row>
        <Row gutter={20} className="demo-row">
          <Col span={12}>
            <div className="demo-row-red">12 gutter 20</div>
          </Col>
          <Col span={12}>
            <div className="demo-row-blue">12 gutter 20</div>
          </Col>
        </Row>
        <Row gutter={20} type="flex" className="demo-row">
          <Col span={12}>
            <div className="demo-row-blue">12 flex gutter 20</div>
          </Col>
          <Col span={12}>
            <div className="demo-row-red">12 flex gutter 20</div>
          </Col>
        </Row>
        <Row gutter={20} className="demo-row">
          <Col span={6} push={18}>
            <div className="demo-row-red">6 push 18</div>
          </Col>
          <Col span={18} pull={6}>
            <div className="demo-row-blue">18 pull 6</div>
          </Col>
        </Row>
        <Row className="demo-row">
          <Col span={6} offset={3}>
            <div className="demo-row-red">6 offset 3</div>
          </Col>
          <Col span={6} offset={6}>
            <div className="demo-row-blue">6 offset 6</div>
          </Col>
          <Col span={2} offset={1}>
            <div className="demo-row-red">2 offset 1</div>
          </Col>
        </Row>
      </div>);
  }
}
