const router = require('express').Router();
const passport = require('passport');
const path = require('path');
const moment = require('moment');
const controller = require('./controllers');
const db = require('../database/index');

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    accessType: 'offline',
    approvalPrompt: 'force',
  }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    // successRedirect: '/',
    failureRedirect: '/',
  }),
  async (req, res) => {
    await db.User.findOne({ googleId: req.user.googleId }, (err, user) => {
      user.accessCode = req.query.code;
      user.save();
    });
    res.redirect('/');
  },
);

// allows user to refresh page but gets rid of React component functionality?
// router.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'), (error) => {
//     if (error) {
//       res.status(500).send(error);
//     }
//   });
// });

router.get('/addEvent', (req, res) => {
  res.redirect('/');
});

router.get('/pastEvents', (req, res) => {
  res.redirect('/');
});

router.get('/reviewEvent', (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/api/isAuthenticated', (req, res) => {
  const isLoggedIn = !!req.user;

  res.send(isLoggedIn);
});

router.get('/api/getCurrentUser', (req, res) => {
  res.send(req.user.firstName);
});

router.post('/api/saveSubscription', (req, res) => {
  const isValidSaveRequest = (req, res) => {
    if (!req.body || !req.body.endpoint) {
      res.status(400);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: {
          id: 'no-endpoint',
          message: 'Subscription must have an endpoint.',
        },
      }));
      return false;
    }
    return true;
  };

  if (isValidSaveRequest(req, res)) {
    return controller.saveSubscription(req.body.subscription, req.user.googleId)
      .then((newSubscription) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
      })
      .catch((err) => {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message: 'The subscription was received but we were unable to save it to our database.',
          },
        }));
      });
  } else {
    isValidSaveRequest(req, res);
  }
});

router.get('/api/upcomingEvents', (req, res) => {
  const currentUserId = req.user.googleId;
  // const currentUserId = req.query.googleId; // for testing in Postman
  controller.fetchUpcomingEvents(currentUserId, (error, events) => {
    if (error) {
      console.error(error);
    } else {
      const chronological = events.sort((a, b) => {
        const dateA = moment(a.date).unix();
        const dateB = moment(b.date).unix();

        return dateA - dateB;
      });
      res.send(chronological);
    }
  });
});

router.get('/api/pastEvents', (req, res) => {
  const currentUserId = req.user.googleId;
  const category = req.query.category ? req.query.category : null;
  // const currentUserId = req.query.googleId; // for testing in Postman
  controller.fetchPastEvents(currentUserId, category, (error, events) => {
    if (error) {
      console.error(error);
    } else {
      const chronological = events.sort((a, b) => {
        const dateA = moment(a.date).unix();
        const dateB = moment(b.date).unix();

        return dateA - dateB;
      });
      res.send(chronological);
    }
  });
});

router.post('/api/addEvent', async (req, res) => {
  await controller.addEvent(req.user.googleId, req.body.event, () => {
    res.send();
  });
});

router.post('/api/addEventToGoogleCal', async (req, res) => {
  await db.User.findOne({ googleId: req.user.googleId }, async (err, user) => {
    await controller.addEventToGoogleCal(user.refreshToken, req.body.event, user.authCode, user.accessToken, () => {});
  });
  res.send();
});

router.post('/api/updateEvent', async (req, res) => {
  await controller.updateEvent(req.user.googleId, req.body.event, () => {
    res.send();
  });
});

router.post('/api/removeEvent', (req, res) => {
  const currentUserId = req.user.googleId;
  const { eventId } = req.body;
  controller.removeEvent(currentUserId, eventId);
  res.end();
});

router.post('/api/addReview', async (req, res) => {
  await controller.addReview(req.user.googleId, req.body.feedback, req.body.event, (err) => {
    if (err) {
      console.error(err);
    }
    res.send();
  });
});

router.get('/api/getReview', (req, res) => {
  const currentUserId = req.user.googleId;
  // const currentUserId = req.query.googleId; // for testing in Postman
  const { eventId } = req.query;

  controller.fetchReview(currentUserId, eventId, (error, review) => {
    if (error) {
      console.error(error);
    } else {
      res.send(review);
    }
  });
});

router.get('/api/getEmail', async (req, res) => {
  await controller.getEmail(req.user.googleId, (email) => {
    res.send(email);
  });
});

router.post('api/uploadImage', async (req, res) => {
  await db.User.findOne({ googleId: req.user.googleId }, async (err, user) => {
    await controller.uploadImage(user.refreshToken, req.body.event, user.authCode, user.accessToken, () => {});
  });
})


module.exports = router;
