const ActiveDirectory = require('activedirectory');

const config = {
  url: process.env.AD_HOST,
  baseDN: 'dc=spsul,dc=local',
  username: process.env.AD_USER,
  password: process.env.AD_PASS
};

const AD = new ActiveDirectory(config);

AD.getProfileInfo = (username, callback) => {
  AD.findUser(username, (err, user) => {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if (!user) {
      res.status(200).json({ message: `User: ${username} not found.` });
      return;
    } else {
      const { displayName, mail } = user;
      AD.getGroupMembershipForUser(username, (err, groups) => {
        if (err) {
          console.log('ERROR: ' + JSON.stringify(err));
          return;
        }
        callback({
          displayName,
          mail,
          groups: groups.map(g => g.cn)
        });
      });
    }
  });
};

module.exports = AD;
