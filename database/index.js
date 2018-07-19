const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const mongoURI = process.env.URI;
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

const feedbackSchema = mongoose.Schema({
  pros: [],
  cons: [],
  journal: String,
  photo: String
});

const eventSchema = mongoose.Schema({
  title: String,
  category: String,
  tag: String,
  description: String,
  feedback: [feedbackSchema],
  date: String,
  isComplete: Boolean,
  attendees: Array,
  lng: Number,
  lat: Number
}, {
  usePushEach: true,
});

const attendeeSchema = mongoose.Schema({
  email: String,
}, {
  usePushEach: true,
});

const contactSchema = mongoose.Schema({
  name: String,
  phone: String
}, {
  usePushEach: true,
});

const photoSchema = mongoose.Schema({
  src: String,
  id: String,
}, {
  usePushEach: true,
})

const userSchema = mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  authCode: String,
  email: { type: String, required: true, unique: true },
  name: String,
  firstName: String,
  events: [eventSchema],
  contacts: [contactSchema],
  photos: [photoSchema],
}, {
  usePushEach: true,
});

const User = mongoose.model('User', userSchema);
const IEvent = mongoose.model('IEvent', eventSchema);
const Attendee = mongoose.model('Attendee', attendeeSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Photo = mongoose.model('Photo', photoSchema);

module.exports.User = User;
module.exports.IEvent = IEvent;
module.exports.Feedback = Feedback;
module.exports.Attendee = Attendee;
module.exports.Contact = Contact;
module.exports.Photo = Photo;