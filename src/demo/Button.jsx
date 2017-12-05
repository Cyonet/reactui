import React from 'react';
import Button from '../components/Button';

export default function ButtonDemo() {
  return (
    <div className="demo-cart">
      <div className="demo-btn-group">
        <h3>按钮颜色</h3>
        <Button>primary</Button>
        <Button type="success">success</Button>
        <Button type="danger">danger</Button>
        <Button type="warning">warning</Button>
      </div>
      <div className="demo-btn-group">
        <h3>按钮大小</h3>
        <Button>middle</Button>
        <Button size="large">large</Button>
        <Button size="small">small</Button>
        <Button size="xsmall">xsmall</Button>
      </div>
      <div className="demo-btn-group">
        <h3>按钮其他</h3>
        <Button ghost>镂空</Button>
        <Button radius={false}>无圆角</Button>
        <Button icon="loading">icon</Button>
        <Button text>按钮text</Button>
        <Button loading>按钮loading</Button>
        <Button disabled>disabled</Button>
      </div>
    </div>);
}
