import React from 'react';
import moment from 'moment';

class EventReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { currentReview, currentReviewEvent } = this.props;
    const { pros, cons, journal, photo } = currentReview;
    const { title, description, date } = currentReviewEvent;
    return (
      <div className="flex-column align-items-start">
        <div className="d-flex row justify-space-between">
          <div className="col">
            {/* event name */}
            <h3>{title}</h3>
          </div>          
          <div className="flex-column align-items-end">
            {/* event date */}
            <span className="review-date">{moment(date).format('dddd, MMMM Do')}</span>
          </div>          
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-11 review-event-description">
            {/* event description */}
            <p>{description}</p>
          </div>
        </div>
        {/* pros */}
        <h5>Pros:</h5>
        <ul>
          {pros && pros.map(pro => <li>{pro}</li>)}
        </ul>
        <br />
        {/* cons */}
        <h5>Cons:</h5>
        <ul>
          {cons && cons.map(con => <li>{con}</li>)}
        </ul>
        <br />
        {/* journal */}
        <h5>Journal:</h5>
        <p>{journal}</p>
        {/*Photo*/}
        <h6>Photo:</h6>
        <img src={photo}/>
      </div>
    );
  }
}

export default EventReview;
