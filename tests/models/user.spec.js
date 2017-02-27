'use strict';

const expect = require('chai').expect;
const app = require('../../app');
const models = require('../../server/models');
const fakeData = require('../fakeData');

describe("Model for User Table", () => {
  before((done) => {
    models.Role.create(fakeData.adminRole)
      .then((role) => {
        fakeData.firstUser.roleId = role.dataValues.id;
        done();
      });
  });

  after((done) => {
    models.sequelize.sync({
        force: true
      })
      .then(() => {
        done();
      });
  });

  it('creates a new user', (done) => {
    models.User.create(fakeData.firstUser)
      .then((user) => {
        expect(user.dataValues.username).to.equal('jane_doe');
        expect(user.dataValues.firstName).to.equal('Jane');
        expect(user.dataValues.lastName).to.equal('Doe');
        done();
      })
      .catch((err) => {
        done();
      });
  });

  it('check to ensure that only users with unique username are stored in db', (done) => {
    models.User.create(fakeData.firstUser)
      .then((user) => {
        done();
      })
      .catch((err) => {
        expect(err.errors[0].message).to.equals('username must be unique');
        expect(err.message).to.equals('Validation error');
        done();
      });
  });

  it('check to ensure that only users with unique emails are stored in db', (done) => {
    fakeData.firstUser.username = "uniqueUser";
    models.User.create(fakeData.firstUser)
      .then((user) => {
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeUniqueConstraintError');
        expect(err.errors[0].message).to.equals('email must be unique');
        done();
      });
  });

 it('ensures that users can only be created with a db relation to existing Roles.', (done) => {
    fakeData.secondUser.roleId = 8;
    models.User.create(fakeData.secondUser)
      .then((user) => {
        done();
      })
      .catch((err) => {
        expect(err.name).to.equals('SequelizeForeignKeyConstraintError');
        done();
      });
  });

  it('updates details of an user', (done) => {
    models.User.update({
        firstName: 'Patrick',
        lastName: 'Bull'
      }, {
        where: {
          id: 1
        }
      })
      .then((updateUser) => {
        models.User.findById(1)
          .then((checkUser) => {
            expect(checkUser.dataValues.firstName).to.equals('Patrick');
            expect(checkUser.dataValues.lastName).to.equals('Bull');
            done();
          });
      })
      .catch((err) => {
        done();
      });
  });
});