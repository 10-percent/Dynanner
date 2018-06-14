import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ContactEntry = ({ contact }) => {
  return (
    <Link
      className="list-group-item list-group-item-action flex-column align-items-start past-event-entry"
      to={{
        pathname: "/pastEvents",
        state: { reviewEvent: event, category: event.category },
      }}
    >
      <div className="d-flex w-100 justify-content-end">
        <small className="date-row">{moment().format('dddd, MMMM Do')}</small>
      </div>
      <h6 className="mb-1">{contact.name}</h6>
    </Link>
  );
};

export default ContactEntry;
