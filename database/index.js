const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const mongoURI = process.env.URI || 'mongodb://admin:admin1@ds159100.mlab.com:59100/dynanner';
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

const feedbackSchema = mongoose.Schema({
  pros: [],
  cons: [],
  journal: String,
});

const eventSchema = mongoose.Schema({
  title: String,
  category: String,
  tag: String,
  description: String,
  feedback: [feedbackSchema],
  date: String,
  isComplete: Boolean,
}, {
  usePushEach: true,
});

const contactSchema = mongoose.Schema({
  name: String,
  phone: String
}, {
  usePushEach: true,
});

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
}, {
  usePushEach: true,
});

const User = mongoose.model('User', userSchema);
const IEvent = mongoose.model('IEvent', eventSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Contact = mongoose.model('Contact', contactSchema);

module.exports.User = User;
module.exports.IEvent = IEvent;
module.exports.Feedback = Feedback;
module.exports.Contact = Contact;
