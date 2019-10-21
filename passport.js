const passport = require('passport');
const ad = require('./ActiveDirectoryConnector');
const ActiveDirectoryStrategy = require('passport-activedirectory');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new ActiveDirectoryStrategy(
    {
      integrated: false,
      ldap: ad
    },
    function(profile, ad, done) {
      ad.isUserMemberOf(profile._json.dn, 'AccessGroup', function(
        err,
        isMember
      ) {
        if (err) return done(err);
        return done(null, { username: profile._json.mail });
      });
    }
  )
);

module.exports = passport;
