import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import {
  Menu,
  MenuItem,
} from './components/Menu';
import Button from './demo/Button';
import Icon from './components/Icon';
import Layout from './demo/Layout';
import MenuDemo from './demo/Menu';
import Upload from './demo/Upload';

const Home = () => (
  <div className="main">
    <h2>首页</h2>
    <p>待建设。。。。。</p>
  </div>);

const Not = () => (<p>404</p>);

export default class App extends React.Component {
  state = {
    active: window.location.pathname || '/',
  };
  handleMenuSelect = () => {

  }
  render() {
    return (
      <Router>
        <div className="warpper">
          <header className="header">
            Header
          </header>
          <div className="container">
            <div className="menu-container">
              <Menu
                onSelect={this.hanleMenuSelect}
                active={this.state.active}
              >
                <MenuItem name="/">
                  <NavLink to="/" >
                    <Icon type="home" />
                    Home 首页
                  </NavLink>
                </MenuItem>
                <MenuItem name="/button">
                  <NavLink to="/button">
                    <Icon type="pause-circle-o" />
                    Button 按钮
                  </NavLink>
                </MenuItem>
                <MenuItem name="/layout">
                  <NavLink to="/layout">
                    <Icon type="switcher" />
                    Layout 布局
                  </NavLink>
                </MenuItem>
                <MenuItem name="/menu">
                  <NavLink to="/menu">
                    <Icon type="menuunfold" />
                    Menu 菜单
                  </NavLink>
                </MenuItem>
                <MenuItem name="/upload">
                  <NavLink to="/upload">
                    <Icon type="cloud-upload-o" />
                    Upload 上传
                  </NavLink>
                </MenuItem>
              </Menu>
            </div>
            <div className="main-container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/button" component={Button} />
                <Route exact path="/menu" component={MenuDemo} />
                <Route exact path="/layout" component={Layout} />
                <Route exact path="/upload" component={Upload} />
                <Redirect from="/btn" to="/button" />
                <Route exact path="**" component={Not} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
