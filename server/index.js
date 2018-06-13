const app = require('./server.js');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log('listening on port ', port);
});
