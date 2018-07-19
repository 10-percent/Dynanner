import React from 'react';


const AttendeeEntry = ({ attendee, removeAttendee }) => (
  <div className="attendee-container">
    <div className="attendee"><button onClick={removeAttendee}>Remove</button>   {attendee}</div>
  </div>
);


export default AttendeeEntry;

