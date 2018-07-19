import React from 'react';
import Axios from 'axios';
import EventReview from './eventReview.jsx';
import EventsList from './eventsList.jsx';
import Header from '../../header.jsx';

class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      currentReview: '',
      currentReviewEvent: '',
    };
    this.getPastEvents = this.getPastEvents.bind(this);
    this.setCurrentReview = this.setCurrentReview.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const category = this.props.location.state.category;
    this.getPastEvents(category);
    if (this.props.location.state.reviewEvent) {
      const { _id } = this.props.location.state.reviewEvent;
      this.setCurrentReview(_id, this.props.location.state.reviewEvent);
    } else if (this.props.location.state.events) {
      let haveDisplay = false;
      const displayEvent = this.props.location.state.events.reduce((display, event) => {
        if (event.title.toLowerCase() === this.props.location.state.title.toLowerCase() && !haveDisplay) {
          display = event;
          haveDisplay = true;
        }
        return display;
      }, '');
      if (displayEvent) {
        const { _id } = displayEvent;
        this.setCurrentReview(_id, displayEvent);
      } else {
        const display = this.props.location.state.events.filter(event => event.category === this.props.location.state.category);
        if (display.length) {
          const { _id } = display[0];
          this.setCurrentReview(_id, display[0]);
        } else {
          const display = this.props.location.state.events;
          if (display.length) {
            const { _id } = display[0];
            this.setCurrentReview(_id, display[0]);
          }
        }
      }
    }
  }

  getPastEvents(category) {
    Axios.get('/api/pastEvents', {
      params: { category },
    })
      .then((response) => {
        this.setState({ events: response.data });
      })
      .catch((error) => {
        console.error('past event error', error);
      });
  }

  setCurrentReview(eventId, event) {
    this.setState({ currentReviewEvent: event });
    this.props.location.state.category = event.category;
    Axios.get('/api/getReview', {
      params: { eventId },
    })
      .then((response) => {
        this.setState({ currentReview: response.data });
      })
      .catch((error) => {
        console.error('error getting review', error);
      });
  }

  handleChange(event) {
    const category = event.target.value;
    this.getPastEvents(category);
    this.props.location.state.category = category;
  }

  render() {
    const { events, currentReview, currentReviewEvent } = this.state;

    return (
      <div className="body">
      <Header />
        <div className="container-fluid contents">
          <div className="row justify-content-end">
            <div id="work-play-dropdown-col" className="col-lg-4">
              <div className="d-flex row justify-content-center">
                <div className="col-lg-10">
                  {/* work/play drop-down */}
                  <select className="form-control" value={this.props.location.state.category} onChange={this.handleChange}>
                    <option value="work">Work</option>
                    <option value="play">Play</option>
                  </select>
                </div>
              </div>
            </div> 
          </div>
          <div className="row justify-content-between">
            <div id="current-review" className="col-lg-8 white-container">
              {/* currently selected event's review */}
              <EventReview currentReview={currentReview} currentReviewEvent={currentReviewEvent} />
            </div>
            <div className="col-lg-4 white-container">
              {/* list of past events */}
              <EventsList events={events} setCurrentReview={this.setCurrentReview} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PastEvents;
