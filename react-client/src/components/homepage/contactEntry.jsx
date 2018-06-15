import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

function newFunction(person, message) {
  person.phone = person.phone.replace(/\D/ig, '');
  if (person.phone[0] === '1') {
    person.phone = `+${person.phone}`;
  } else {
    person.phone = `+1${person.phone}`;
  }
  const number = person.phone;
  console.log(person.phone);
  Axios.post('/api/sendSMS', { number, message });
}
const ContactEntry = ({ contact }) => (
  <div>
    <div className="d-flex w-100 justify-content-end">
      <small className="date-row">{contact.phone}</small>
    </div>
    <Popup position="right center" className="mb-1" trigger={<a className="contact-button">{contact.name}</a>}>
      <form
        className="message-form"
        onSubmit={(e) => {
          console.log(e.target.message.value);
        newFunction(contact, e.target.message.value);
      }}
      >
        <label className="message-label">Message</label>
        <input className="message-input" name="message" />
        <button
          className="send-message-button"
          to={{
            pathname: '/sendSMS',
            state: { to: contact.phone },
          }}
          value={contact.phone}
        >Send
        </button>
      </form>
    </Popup>
  </div>
);


export default ContactEntry;

