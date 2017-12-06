import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import Button from './demo/Button';
import Layout from './demo/Layout';
import Menu from './demo/Menu';

const Home = () => (
  <div>
    <NavLink
      to="/layout"
      activeClassName="link-active"
    >
      layout
    </NavLink>
    <NavLink
      activeClassName="link-active"
      to="/button"
    >
      button
    </NavLink>
    <NavLink
      activeClassName="link-active"
      to="/menu"
    >
      menu
    </NavLink>
  </div>);

const Not = () => (<p>404</p>);

export default class App extends React.Component {
  state = {};
  render() {
    return (
      <Router>
        <div className="container">
          <h3>测试</h3>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/button" component={Button} />
            <Route exact path="/menu" component={Menu} />
            <Route exact path="/layout" component={Layout} />
            <Redirect from="/btn" to="/button" />
            <Route exact path="**" component={Not} />
          </Switch>
        </div>
      </Router>
    );
  }
}
