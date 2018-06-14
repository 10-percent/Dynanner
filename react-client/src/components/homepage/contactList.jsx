import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import PastEventEntry from './pastEventEntry.jsx';

class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
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
        <h4 id="past-logs-heading">Contacts</h4>
        <div className="row justify-content-center">
          <div className="col-lg-8">
          </div>
        </div>
        <div className="list-group">
          {this.state.contacts.map((contact, i) => (
            <PastEventEntry contact={contact} key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default ContactList;