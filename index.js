require('dotenv').config({ path: './config/.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const ad = require('./ActiveDirectoryConnector');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post(
  '/auth/login',
  (req, res) => {
    const { username, password } = req.body;
    ad.authenticate(username, password, function(err, auth) {
      if (err) {
        res.status(401).json({ error: 'ERROR: ' + JSON.stringify(err) });
        return;
      }
      if (auth) {
        res.status(200).json({ exist: auth, error: '' });
      } else {
        res
          .status(401)
          .json({ exist: auth, error: 'Wrong username or password!' });
      }
    });
  },
  err =>
    res.status(500).json({
      status: 500,
      error: err.toString()
    })
);

app.listen(port, () => {
  console.log(`Auth Server is running on http://localhost:${port}`);
});
