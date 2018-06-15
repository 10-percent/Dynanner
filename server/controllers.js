const request = require('request');
const db = require('../database/index');
const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const twilio = require('twilio');
const authToken = process.env.TWILI_AUTH_TOKEN;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const client = new twilio(process.env.accountSID, process.env.account_auth_token);

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  '/auth/google/callback',
);

const getEvents = async (token, callback) => {
  const options = {
    method: 'GET',
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    qs: {
      access_token: token, singleEvents: true, orderBy: 'startTime',
    },
  };
  await request(options, (error, response, body) => {
    if (error) { console.log(`Error regarding GET request to google-calendar API: ${error}`); }
    callback(body);
  });
};
// working text send

const getContacts = async (token, callback) => {
  const options = {
    method: 'GET',
    url: 'https://people.googleapis.com/v1/people/me/connections',
    Accept: 'application/json',
    qs: {
      access_token: token,
      personFields: 'names,phoneNumbers',
      sortOrder: 'First_Name_Ascending',
    },
  };
  await request(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      callback(body);
    }
  });
};

const addEventToGoogleCal = async (refreshtoken, event, authCode, accesstoken, callback) => {
  oauth2Client.setCredentials({
    access_token: accesstoken,
    refresh_token: refreshtoken,
  });
  oauth2Client.refreshAccessToken((err, tokens) => {
    const options = {
      method: 'POST',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      headers:
        {
          Authorization: `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
      body:
        {
          summary: event.title,
          description: event.description,
          start: { dateTime: event.date, timeZone: 'America/Chicago' },
          end: { dateTime: event.date, timeZone: 'America/Chicago' },
        },
      json: true,
    };
    request(options, (error, response, body) => {
      if (error) { console.log(`Error trying to add event to google calendar: ${error}`); }
      callback();
    });
  });
};

const saveSubscription = (subscription, userGoogleId) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ googleId: userGoogleId }, (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      user.subscription = subscription;
      user.save();
      resolve(user.subscription);
    });
  });
};

const addEvent = async (id, event, callback) => {
  await db.User.findOne({ googleId: id }, async (err, user) => {
    const existingEvent = user.events.reduce((doesExist, e) => {
      if (e.title === event.title && e.description === event.description) {
        doesExist = true;
      }
      return doesExist;
    }, false);
    if (!existingEvent) {
      const newEvent = new db.IEvent({
        title: event.title || '',
        category: event.category || '',
        date: event.date || 'you will know when the time is right',
        description: event.description || '',
        isComplete: event.isComplete || false,
      });
      user.events.push(newEvent);
      await user.save();
    }
    callback(user);
  });
};

const addContact = async (id, person, callback) => {
  const contactName = person.names[0].displayName;
  const contactNumber = person.phoneNumbers[0].value;
  await db.User.findOne({ googleId: id }, async (err, user) => {
    const existingContact = user.contacts.reduce((doesExist, user) => {
      if (user.name === contactName) {
        doesExist = true;
      }
      return doesExist;
    }, false);
    if (!existingContact) {
      const newContact = new db.Contact({
        name: contactName || '',
        phone: contactNumber
      });
      user.contacts.push(newContact);
      await user.save();
    }
  });
};

const updateEvent = async (id, event, callback) => {
  await db.User.findOne({ googleId: id }, async (err, user) => {
    user.events.forEach((e) => {
      if (e.description === event.description) {
        if (event.title) { e.title = event.title; }
        if (event.category) { e.category = event.category; }
        if (event.date) { e.date = event.date; }
        user.save();
      }
    });
    callback();
  });
};

const addReview = async (id, feedback, event, callback) => {
  await db.User.findOne({ googleId: id }, async (err, user) => {
    if (err) {
      callback(err);
    } else {
      const reviewedEvent = user.events.id(event._id);
      const newFeedback = new db.Feedback({
        pros: feedback.pros.reduce((allPros, pro) => {
          allPros.push(pro);
          return allPros;
        }, []),
        cons: feedback.cons.reduce((allCons, con) => {
          allCons.push(con);
          return allCons;
        }, []),
        journal: feedback.journal,
      });
      reviewedEvent.feedback.push(newFeedback);
      reviewedEvent.category = event.category;
      reviewedEvent.isComplete = true;
      user.save();
      callback(null);
    }
  });
};

const removeEvent = (currentUserId, eventId) => {
  db.User.findOne({ googleId: currentUserId }, (error, user) => {
    if (error) {
      throw error;
    } else {
      user.events.id(eventId).remove();
      user.save((err) => {
        if (err) {
          throw err;
        } else {
          console.log('event removed!');
        }
      });
    }
  });
};

const getEmail = async (id, callback) => {
  await db.User.findOne({ googleId: id }, async (err, user) => {
    callback(user.email);
  });
};

const fetchUpcomingEvents = (currentUserId, callback) => {
  // find user model that matches current user's google ID
  db.User.findOne({ googleId: currentUserId }, (error, user) => {
    if (error) {
      callback(error, null);
    } else {
      // go into their events sub-collection and find all events where isComplete: false
      const events = user.events.filter(event => event.isComplete === false);
      callback(null, events);
    }
  });
};

const fetchPastEvents = (currentUserId, category, callback) => {
  // find user model that matches current user's google ID
  db.User.findOne({ googleId: currentUserId }, (error, user) => {
    if (error) {
      callback(error, null);
    } else {
      // go into their events sub-collection and find all events where isComplete: true
      // if there is a category, account for that
      // otherwise, just fetch all events
      let events;
      if (category) {
        events = user.events.filter(event => ((event.isComplete === true) && (event.category === category)));
        callback(null, events);
      } else {
        events = user.events.filter(event => event.isComplete === true);
        callback(null, events);
      }
    }
  });
};

const fetchReview = (currentUserId, eventId, callback) => {
  db.User.findOne({ googleId: currentUserId }, (error, user) => {
    if (error) {
      callback(error, null);
    } else {
      const review = user.events.id(eventId).feedback[0];
      callback(null, review);
    }
  });
};

const fetchContacts = (currentUserId, callback) => {
  db.User.findOne({ googleId: currentUserId }, (error, user) => {
    if (error) {
      callback(error, null);
    } else {
      const contacts = user.contacts;
      callback(contacts);
    }
  });
};

const uploadImage = async (refreshtoken, image, authCode, accesstoken, callback) => {
  oauth2Client.setCredentials({
    access_token: accesstoken,
    refresh_token: refreshtoken,
  });
  oauth2Client.refreshAccessToken((err, tokens) => {
    const options = {
      method: 'POST',
      url: 'https://photoslibrary.googleapis.com/v1/uploads',
      headers:
        {
          Authorization: `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/octet-stream',
        },
        body: {
          media_binary_data: image
        }
    };
    request(options, (error, response, body) => {
      if (error) { console.log(`Error trying to upload image: ${error}`); }
      callback();
    });
  });
};

const sendText = (currentUserId, number, message) => {
  client.messages.create({
    body: `You got a message From ${currentUserId}about your next event!:\n ${message}`,
    to: number,
    from: '+18327803325'
  })
  .then((message) => { console.log(message.sid) })
};

const getAlbums = (token, callback) => {
  const options = {
    method: 'POST',
    url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
    Accept: 'application/json',
    qs: {
      access_token: token,
    },
  };
  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      callback(body);
    }
  });
}

module.exports.sendText = sendText;
module.exports.getEvents = getEvents;
module.exports.saveSubscription = saveSubscription;
module.exports.addEvent = addEvent;
module.exports.getEmail = getEmail;
module.exports.updateEvent = updateEvent;
module.exports.addReview = addReview;
module.exports.removeEvent = removeEvent;
module.exports.fetchUpcomingEvents = fetchUpcomingEvents;
module.exports.fetchPastEvents = fetchPastEvents;
module.exports.fetchReview = fetchReview;
module.exports.addEventToGoogleCal = addEventToGoogleCal;
module.exports.getContacts = getContacts;
module.exports.addContact = addContact;
module.exports.uploadImage = uploadImage;
module.exports.fetchContacts = fetchContacts;
module.exports.getAlbums = getAlbums;
