const rootPath = "../../";
const UsersController = require('./users.controller');
const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
const config = require('../../common/config/env.config');
const FormValidation = require('../../lib/validation');
const ADMIN = config.permissionLevels.ADMIN;
const USER = config.permissionLevels.APP_USER;
const FREE = config.permissionLevels.NORMAL_USER;
const formValidationRules = [
  { ctrl: 'lastname', format: 'text', required: true, max: 50, min: 1 },
  { ctrl: 'usertype', format: 'int', required: true },
  { ctrl: 'firstname', format: 'text', required: false },
  { ctrl: 'password', format: 'password', required: true, max: 20, min: 6 },
  { ctrl: 'contactNumber', format: 'phone', required: true, max: 20, min: 8 },
  { ctrl: 'email', format: 'email', required: true }
];
exports.routesConfig = function (app) {
  app.post('/users', [
    ValidationMiddleware.validJWTNeeded,
    FormValidation.formValidation(formValidationRules),
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.insert
  ]);

  app.post('/users/reg', [
    FormValidation.formValidation(formValidationRules),
    UsersController.reg
  ]);

  app.post('/users/emailOtp', [
    UsersController.createEmailVerifyOtp
  ]);

  app.post('/users/verifyEmailOtp', [
    UsersController.verifyEmailOtp
  ]);

  app.post('/users/resetPasswordInit', [
    UsersController.resetPasswordInit
  ]);

  app.post('/users/resetPasswordFinish', [
    UsersController.resetPasswordFinish
  ]);

  app.post('/users/changePassword', [
    ValidationMiddleware.validJWTNeeded,
    UsersController.changePassword
  ]);


  app.get('/users', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.list
  ]);

  app.get('/users/dash', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.dash
  ]);

  app.get('/users/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.listAll
  ]);
  app.get('/users/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.listSuggestions
  ]);
  app.get('/users/:usersId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    UsersController.getById
  ]);
  app.patch('/users/:usersId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    FormValidation.formValidation(formValidationRules, 'UPDATE'),
    UsersController.patchById
  ]);
  app.delete('/users/:usersId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById
  ]);
};

