require('dotenv').config({ path: './config/.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const ad = require('./ActiveDirectoryConnector');
const port = process.env.PORT || 3000;

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
        return res.status(401).json({ error: `ERROR: ${err}` });
      }
      if (auth) {
        ad.findUser(username, (err, user) => {
          if (err) {
            return res.status(500).json({ error: err });
          }

          if (!user) {
            res.status(404).json({ error: `User ${username} not found!` });
          } else {
            res.status(200).json({ exists: auth, user, error: '' });
          }
        });
      } else {
        res
          .status(401)
          .json({ exists: auth, error: 'Wrong username or password!' });
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
