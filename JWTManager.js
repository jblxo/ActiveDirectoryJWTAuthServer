const fs = require('fs');
const jwt = require('jsonwebtoken');

var privateKEY = fs.readFileSync('./private.key', 'utf8');
var publicKEY = fs.readFileSync('./public.key', 'utf8');

module.exports = {
  sign: (payload, options) => {
    const signOptions = {
      issuer: '',
      subject: '',
      audience: '',
      expiresIn: '5m',
      algorithm: 'RS256'
    };
    return jwt.sign(payload, privateKEY, signOptions);
  },
  verify: (token, options) => {
    var verifyOptions = {
      issuer: '',
      subject: '',
      audience: '',
      expiresIn: '5m',
      algorithm: ['RS256']
    };
    try {
      const resp = jwt.verify(token, publicKEY, verifyOptions);
      return resp ? true : false;
    } catch (err) {
      return false;
    }
  },
  decode: token => {
    return jwt.decode(token, { complete: true });
  }
};
