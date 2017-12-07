import React from 'react';
import {
  Menu,
  MenuItem,
  SubMenu,
  MenuGroup,
} from '../components/Menu';
import {
  Row,
  Col,
} from '../components/Layout';

export default function ButtonDemo() {
  return (
    <div className="demo-cart">
      <Row type="flex">
        <Col with={260}>
          <Menu theme="dark">
            <MenuItem name="1">
              测试1
            </MenuItem>
            <SubMenu
              name="2"
              title={<span>子菜单</span>}
            >
              <MenuGroup title={<span>组菜单</span>} >
                <MenuItem name="3">分组3</MenuItem>
                <MenuItem name="4">分组4</MenuItem>
              </MenuGroup>
              <MenuItem name="5">子菜单5</MenuItem>
            </SubMenu>
            <MenuGroup title={<span>组菜单2</span>} >
              <MenuItem name="6">分组6</MenuItem>
              <MenuItem name="7">分组7</MenuItem>
            </MenuGroup>
          </Menu>
        </Col>
        <Col>
          <Menu mode="horizontal">
            <MenuItem name="1">
              测试1
            </MenuItem>
            <SubMenu
              name="2"
              title={<span>子菜单</span>}
            >
              <MenuGroup title={<span>组菜单</span>} >
                <MenuItem name="3">分组3</MenuItem>
                <MenuItem name="4">分组4</MenuItem>
              </MenuGroup>
              <MenuItem name="5">子菜单5</MenuItem>
            </SubMenu>
            <MenuItem name="6">分组6</MenuItem>
            <MenuItem name="7">分组7</MenuItem>
          </Menu>
          <div style={{ padding: '24px 12px' }}>
            <Menu mode="horizontal" theme="dark">
              <MenuItem name="1">
                测试1
              </MenuItem>
              <SubMenu
                name="2"
                title={<span>子菜单</span>}
              >
                <MenuGroup title={<span>组菜单</span>} >
                  <MenuItem name="3">分组3</MenuItem>
                  <MenuItem name="4">分组4</MenuItem>
                </MenuGroup>
                <MenuItem name="5">子菜单5</MenuItem>
              </SubMenu>
              <MenuItem name="6">分组6</MenuItem>
              <MenuItem name="7">分组7</MenuItem>
            </Menu>
          </div>
        </Col>
      </Row>
    </div>);
}
