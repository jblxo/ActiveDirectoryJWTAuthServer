require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const ad = require('./ActiveDirectoryConnector');

const port = 3000;

app.use(express.json());

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  ad.authenticate(username, password, function(err, auth) {
    if (err) {
      res.status(401).json({ error: 'ERROR: ' + JSON.stringify(err) });
      return;
    }

    if (auth) {
      const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
      res.status(200).json({ error: '' });
    } else {
      res.status(401).json({ error: 'Authentication failed!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Auth Server is running on http://localhost:${port}`);
});
