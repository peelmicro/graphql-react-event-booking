const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const tokens = authHeader.split(' '); // Authorization: Bearer tokendsdaadadad
  if (tokens.length !=2 || tokens[0]!=='Bearer' || !tokens[1] || tokens[1] === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(tokens[1], 'somesupersecretkey');
  } catch (error) {
    console.log(error);
    req.isAuth = false;
    return next();    
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();        
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}