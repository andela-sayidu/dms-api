'use strict';

const jwt = require('jsonwebtoken');
const models = require('../models');
const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';

module.exports = {
  isAuthenticated(req, res, next) {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res.status(401).json({
        done: false,
        message: 'Please Login!'
      });
    } else if (authToken) {
      jwt.verify(authToken, secret, function (err, decoded) {
        if (err) {
          return res.status(401)
            .json({
              done: false,
              message: 'Invalid Authentication Details'
            });
        }
        req.decoded = decoded;
        return next();
      });
    }
  },
  isAdmin(req, res, next) {
    models.User.findById(req.decoded.UserId)
      .then((user) => {
        models.Role.findById(user.roleId)
          .then((role) => {
            if (role.dataValues.roleTitle === 'admin') {
              next();
            } else {
              return res.status(403).send({
                message: 'Unauthorised User'
              });
            }
          });
      });
  }
};