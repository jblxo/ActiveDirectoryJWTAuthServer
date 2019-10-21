require('dotenv').config();
const jwt = require('./JWTManager');
const bodyParser = require('body-parser');
const randtoken = require('rand-token');
const cors = require('cors');
const express = require('express');
const app = express();
const passport = require('./passport');
const ad = require('./ActiveDirectoryConnector');
const unless = require('express-unless');
const port = 3000;
const refreshTokens = {};
const opts = { failWithError: true };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const checkToken = (req, res, next) => {
  const header = req.headers['x-access-token'] || req.headers['authorization'];
  if (!header)
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  const bearer = header.split(' ');
  const token = bearer[1];
  req.token = token;
  if (jwt.verify(token)) {
    next();
  } else {
    res.status(400).json({ message: 'Invalid Token!' });
  }
};
checkToken.unless = unless;

app.use(
  '/auth',
  checkToken.unless({
    path: ['/auth/login', '/auth/logout', '/auth/refresh']
  })
);

app.post(
  '/auth/login',
  passport.authenticate('ActiveDirectory', opts),
  (req, res) => {
    const user = req.user;
    const refreshToken = randtoken.uid(256);
    refreshTokens[refreshToken] = user.username;
    const token = jwt.sign(user);
    res.status(200).json({
      jwt: token,
      refreshToken
    });
  },
  function(err) {
    res.status(401).json({ error: 'ERROR: ' + JSON.stringify(err) });
  }
);
app.get('/auth/logout', (req, res) => {});

app.get('/auth/refresh', function(req, res) {
  const refreshToken = req.headers.refreshtoken;
  if (refreshToken in refreshTokens) {
    res.status(200).json({ jwt: jwt.sign(refreshTokens[refreshToken]) });
  } else {
    res.status(401);
  }
});

app.get('/auth/profile', (req, res) => {
  const token = jwt.decode(req.token);
  const username = token.payload.username;
  ad.getProfileInfo(username, user => {
    res.status(200).json(user);
  });
});

app.listen(port, () => {
  console.log(`Auth Server is running on http://localhost:${port}`);
});
