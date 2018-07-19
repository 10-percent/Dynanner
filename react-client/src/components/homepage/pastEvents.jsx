import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import PastEventEntry from './pastEventEntry.jsx';

class PastEventsHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
    this.getPastEvents = this.getPastEvents.bind(this);
  }

  componentDidMount() {
    this.getPastEvents();
  }

  getPastEvents() {
    Axios.get('/api/pastEvents')
      .then((response) => {
        this.setState({ events: response.data.slice(-5) });
      })
      .catch((error) => {
        console.error('past event error', error);
      });
  }

  render() {
    return (
      <div>
        <h4 id="past-logs-heading">Your Past Logs</h4>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Link
              className="btn btn-outline-info btn-block work-play-button"
              to={{
                pathname: '/pastEvents',
                state: { category: 'work' },
              }}
            >
              <span className="fa fa-briefcase" /> Work
            </Link>
            <br />
            <Link
              className="btn btn-outline-info btn-block work-play-button"
              to={{
                pathname: '/pastEvents',
                state: { category: 'play' },
              }}
            >
              <span className="fa fa-paper-plane" /> Play
            </Link>
          </div>
        </div>
        <h5 id="recently-completed-heading">Recently Completed</h5>
        <div className="list-group">
          {this.state.events.map((event, i) => (
            <PastEventEntry event={event} key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default PastEventsHome;