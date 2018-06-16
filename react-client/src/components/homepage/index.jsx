import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import webPush from 'web-push';
import UpcomingEvents from './upcomingEvents.jsx';
import ContactList from './contactList.jsx';
import PhotoGallery from './photos.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: ''
    };
    this.urlB64ToUint8Array = this.urlB64ToUint8Array.bind(this);
    this.handleSWRegistration = this.handleSWRegistration.bind(this);
    this.saveSubscription = this.saveSubscription.bind(this);
  }

  componentDidMount() {
    Axios.get('/api/getCurrentUser')
      .then((response) => {
        this.setState({ currentUser: response.data });
      })
      .catch((error) => {
        console.error('error getting current user', error);
      });
    Notification.requestPermission().then((status) => {
      if (status === 'denied') {
        console.log('The user has blocked notifications.');
      } else if (status === 'granted') {
        console.log('Initializing service worker.');
        this.initializeServiceWorker();
      }
    });
  }

  initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(this.handleSWRegistration)
        .then(this.saveSubscription);
    } else {
      console.log('Service workers aren\'t supported in this browser.');
    }
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  handleSWRegistration(reg) {
    if (reg.installing) {
      console.log('Service worker installing.');
    } else if (reg.waiting) {
      console.log('Service worker installed.');
    } else if (reg.active) {
      console.log('Service worker active.');
    }

    // const swRegistration = reg;
    this.saveSubscription(reg);
  }

  saveSubscription(reg) {
    let subscribeParams = { userVisibleOnly: true };
    const applicationServerKey = this.urlB64ToUint8Array('BBnaIXuSqE8E-boIMUcAYj6RkLHNCJH59KjhDZrwwB-8CzcaBSjSod5RCB1mqw1hiC3lQVJmHSCfnrH8HKvWhbA');
    subscribeParams.applicationServerKey = applicationServerKey;
    console.log(reg);
    const currentPushManager = reg.pushManager
    console.log(currentPushManager);
    currentPushManager.subscribe(subscribeParams)
      .then((subscription) => {
        this.setState({ isSubscribed: true });
        Axios.post('/api/saveSubscription', { subscription })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      });
  }


  render() {
    const { currentUser } = this.state;
    return (
      <div className="body">
        <h3 id="welcome">Welcome back, {currentUser}!</h3>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="row justify-content-center">
                <div className="col-lg-4 align-self-center">
                  <Link to="/addEvent" className="btn btn-outline-info btn-lg btn-block" id="add-event-button">
                    <span className="fa fa-plus" /> Add New Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row row-eq-height justify-content-between">
            <div id="upcoming-col" className="col-lg-8">
              <UpcomingEvents />
            </div>
            <div className="col-lg-4 white-container" id="past-logs-home">
              <ContactList />
            </div>
          </div>
        </div>
        <div>
          <PhotoGallery />
        </div>
      </div>
    );
  }
}

export default Home;
