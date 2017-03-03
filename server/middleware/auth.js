import jwt from 'jsonwebtoken';

import { User, Role } from '../models';

const secret = process.env.JWT_SECRET_TOKEN || 'Keep my secret';

module.exports = {
  isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization || req.headers['x-access-token'];
    if (!authToken) {
      return res.status(401).json({
        done: false,
        message: 'Please Login!',
      });
    } else if (authToken) {
      jwt.verify(authToken, secret, (err, decoded) => {
        if (err) {
          return res.status(401)
            .json({
              done: false,
              message: 'Invalid Authentication Details',
            });
        }
        req.decoded = decoded;
        return next();
      });
    }
  },
  isAdmin(req, res, next) {
    User.findById(req.decoded.UserId)
      .then((user) => {
        Role.findById(user.roleId)
          .then((role) => {
            if (role.dataValues.roleTitle === 'admin') {
              next();
            } else {
              return res.status(401).send({
                message: 'Unauthorised User',
              });
            }
          });
      });
  },
};
