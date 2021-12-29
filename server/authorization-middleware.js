const jwt = require('jsonwebtoken');//eslint-disable-line
const ClientError = require('./client-error');//eslint-disable-line

function authorizationMiddleware(req, res, next) {
  const token = req.get('X-Access-Token');//eslint-disable-line
}

export default authorizationMiddleware;
