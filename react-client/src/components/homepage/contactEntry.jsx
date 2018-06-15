import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const ContactEntry = ({ contact }) => {
  return (
    <div
      className="list-group-item list-group-item-action flex-column align-items-start past-event-entry"
      to={{
        pathname: "/sendSMS",
        state: { to: contact.phone },
      }}
      onClick={() => {
        newFunction(contact);
      }}
      value={contact.phone}
    >
      <div className="d-flex w-100 justify-content-end">
        <small className="date-row">{contact.phone}</small>
      </div>
      <h6 className="mb-1">{contact.name}</h6>
    </div>
  );
};

export default ContactEntry;
function newFunction(person) {
  person.phone = person.phone.replace(/\D/ig, '');
  if (person.phone[0] === '1') {
    person.phone = '+' + person.phone;
  } else {
    person.phone = '+1' + person.phone;
  }
  const number = person.phone;
  console.log(person.phone);
  Axios.post('/api/sendSMS', { number })
}

