/* global document */
import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/login/index.jsx';
import Home from './components/homepage/index.jsx';
import AddEvent from './components/addEvent/index.jsx';
import ReviewEvent from './components/reviewEvent/index.jsx';
import PastEvents from './components/pastEvents/index.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    this.getAuth = this.getAuth.bind(this);
  }

  componentDidMount() {
    this.getAuth();
  }

  getAuth() {
    // send GET to server to check if there is an authenticated user
    Axios.get('/api/isAuthenticated')
      .then((response) => {
        this.setState({ isAuthenticated: response.data });
      })
      .catch((error) => {
        console.error('authentication error', error);
      });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return <Login />;
    }
    return (
      <Router>
        <Switch>
          {/* <Route path="/" component={Header} /> */}
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route path="/addEvent" component={AddEvent} />
          <Route path="/pastEvents" component={PastEvents} />
          <Route path="/reviewEvent" component={ReviewEvent} />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render((<App />), document.getElementById('app'));
