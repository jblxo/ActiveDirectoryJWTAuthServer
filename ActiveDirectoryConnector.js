const ActiveDirectory = require('activedirectory');

const config = {
  url: process.env.AD_HOST,
  baseDN: 'dc=spsul,dc=local',
  username: process.env.AD_USER,
  password: process.env.AD_PASS
};

const AD = new ActiveDirectory(config);

module.exports = AD;
