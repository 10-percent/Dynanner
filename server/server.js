const express = require('express');
const routes = require('./routes');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('../database/index');
const dotenv = require('dotenv').config();
const controller = require('./controllers');

const app = express();
const pathway = path.join(__dirname, '/../react-client/dist');
const sw = path.join(__dirname, '/../react-client');
app.use(express.static(pathway));
app.use(express.static(sw));
app.use(cookieParser('wearekumquat'));
app.use(session({ secret: 'wearekumquat' }));
app.use(bodyParser.json({ limit: 52428800 }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use('google', new GoogleStrategy({
  immediate: true,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/contacts'],
}, async (accesstoken, refreshtoken, params, profile, done) => {
  try {
    // check whether current user exists in db
    const existingUser = await db.User.findOne({ googleId: profile.id });
    let newUser = null;
    // create new user if current user is not in db
    if (!existingUser) {
      newUser = new db.User({
        refreshToken: refreshtoken,
        accessToken: accesstoken,
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        firstName: profile.name.givenName,
      });
      await newUser.save();
    } else {
      await db.User.findOne({ googleId: profile.id }, (err, user) => {
        user.token = refreshtoken;
        user.save();
      });
    }
    // get events from google calendar
    await controller.getEvents(accesstoken, (events) => {
      const calEvents = JSON.parse(events).items.slice(-5);
      calEvents.forEach(async (event) => {
        await controller.addEvent(profile.id, {
          title: event.summary,
          description: event.description,
          date: event.start.dateTime,
          location: event.location
        }, () => {});
      });
    });
    // get contacts from google people
    await controller.getContacts(accesstoken, (people) => {
      const contacts = JSON.parse(people).connections;
      if (!contacts) {
        console.log('no contacts');
      } else {
        const contactList = contacts.map(contact => contact);
        contactList.forEach(async (contact) => {
          await controller.addContact(profile.id, contact);
        }, () => {});
      }
    });

    await controller.getPhotos(accesstoken, (photo) => {
      const photos = JSON.parse(photo);
      if (!photos.mediaItems) {
        console.log('No Photos!');
      } else {
        const photoList = photos.mediaItems.map(photo => photo)
        photoList.forEach(async (photo) => {
          await controller.addPhotos(photo, profile.id)
        })
      }
    });

    if (existingUser) {
      return done(null, existingUser);
    }
    done(null, newUser);
  } catch (error) {
    done(error, false, error.message);
  }
}));

// const vapidKeys = {
//   publicKey: process.env.VAPID_PUBLIC_KEY,
//   privateKey: process.env.VAPID_PRIVATE_KEY,
// };

// webPush.setVapidDetails(
//   'mailto:emilyyu518@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey,
// );

app.use('/', routes);

module.exports = app;
