require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const ad = require('./ActiveDirectoryConnector');

const port = 3000;

app.use(express.json());
app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  if ((username, password)) {
    ad.authenticate(username, password, function(err, auth) {
      if (err) {
        res.status(401).json({ error: 'ERROR: ' + JSON.stringify(err) });
        return;
      }
      if (auth) {
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
        res.status(200).json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
        return;
      } else {
        res.status(401).json({
          success: false,
          message: 'Incorrect username or password'
        });
        return;
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`Auth Server is running on http://localhost:${port}`);
});
