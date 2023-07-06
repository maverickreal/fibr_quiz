const { verify, sign } = require('jsonwebtoken');

class Token{
  static uidToJwt = {};

  static assignToken(user){
      const jwtToken = sign(user.getObj(),
          process.env.JWTSECRETKEY,
          { expiresIn: '7d' }
          );
      user.token = jwtToken;
      Token.uidToJwt[user.userId] = jwtToken;
  }

  static invalidate(userId){
      delete Token.uidToJwt[userId];
  }

  static auth(req, res, next){
      try {
          const jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
          req.user = verify(jwtToken, process.env.JWTSECRETKEY);
          const realToken = Token.uidToJwt[req.user.userId];
          if(realToken!==jwtToken){
              res.status(401).send({ status: 'error', message: 'authentication failed' });
          }
          else{
              next();
          }
      }
      catch (error) {
          console.log(error);
          res.status(401).send({ status: 'error', message: 'authentication failed' });
      }
  }
}

module.exports = Token;