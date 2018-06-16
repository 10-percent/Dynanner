import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import PastEvents from '../pastEvents/index.jsx';
import MyMapComponent from './map.js';
import Axios from 'axios';
import config from './../../../../config.json';


class AddEvent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      category: 'work',
      title: 'event',
      // date: {},
      description: 'just do it',
      calSrc: '',
      events: [],
      redirect: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.getPastEvents = this.getPastEvents.bind(this);
  }
  // small change
  componentDidMount() {
    this.getEmail();
    this.getPastEvents();
  }

  getPastEvents(category) {
    Axios.get('/api/pastEvents', {
      params: { category },
    })
      .then((response) => {
        console.log(response.data);
        this.setState({ events: response.data });
      })
      .catch((error) => {
        console.error('past event error', error);
      });
  }

  getEmail() {
    axios.get('/api/getEmail')
      .then((email) => {
        const emailUserCal = email.data.replace('@', '%40');
        const calSrc = `https://calendar.google.com/calendar/embed?src=${emailUserCal}&ctz=America%2FChicago`;
        this.setState({ calSrc });
      })
      .catch((error) => { console.log(`Error trying to get user's email: ${error}`); });
  }

  handleSubmit() {
    this.refs.title.value = '';
    this.refs.description.value = '';

    axios.post('/api/addEvent', {
      event: {
        category: this.state.category,
        title: this.state.title,
        date: this.state.date.toISOString(true),
        description: this.state.description,
      },
    })
      .then(() => {
        axios.post('/api/addEventToGoogleCal', {
          event: {
            category: this.state.category,
            title: this.state.title,
            date: this.state.date,
            description: this.state.description,
          },
        });
      })
      .then(() => {
        // trigger redirect to '/pastEvents'
        this.setState({ redirect: true });
        // this is a change
      })
      .catch((error) => {
        console.log(`Error from axios post addEvent: ${error}`);
      });
  }

  handleChange(event) {
    const { name } = event.target;
    this.setState({
      [name]: event.target.value,
    });
  }

  changeDate(date) {
    this.setState({ date });
  }

  render() {
    const { redirect, calSrc } = this.state;
    return (
      <div className="body">

        <div className="row justify-content-around">

          <div className="form col-4">
            <h2>Add an Event</h2>
            <div className="form-group">
              <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" name="category" onChange={this.handleChange} value={this.state.category}>
                <option value="work">work</option>
                <option value="play">play</option>
              </select>
            </div>

            <div className="form-group">
              <h6>Title</h6>
              <input className="form-control" type="text" onChange={this.handleChange} name="title" ref="title" />
            </div>

            <div className="form-group">
              <div>
                <h6>Date</h6>
                <DatePicker
                  className="form-control"
                  selected={this.state.date}
                  onChange={this.changeDate}
                  placeholderText="Click to select date."
                  minDate={moment()}
                  maxDate={moment().add(100, 'years')}
                  isClearable
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="LLL"
                  timeCaption="time"
                />
              </div>

            </div>

            <div className="form-group">
              <div>
                <h6>Description</h6>
                <input className="form-control" type="text" onChange={this.handleChange} name="description" ref="description" />
              </div>
            </div>

            <button className="btn btn-outline-info" type="submit" onClick={this.handleSubmit}>
              Submit
            </button>

          </div>

          <div className="col-7">
            <iframe title="user-calendar" src={calSrc} width="800" height="600" frameBorder="0" scrolling="no" />
          </div>

        </div>

        {redirect && (
          <Redirect to={{ pathname: '/pastEvents', state: { category: this.state.category, title: this.state.title, events: this.state.events } }} component={PastEvents} />
        )}
        <div className="search-event">
          <h4 >Search for Your Event</h4>
          <input className="geo-input" />
          <button className="btn btn-outline-info">Search</button>
        </div>
        <MyMapComponent
          isMarkerShown
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleMapsAPI}&callback=initMap`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
      </div>
    );
  }
}

export default AddEvent;
