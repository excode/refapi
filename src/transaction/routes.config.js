const rootPath="../../";
  const TransactionController = require('./transaction.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'amount',format:'number',required:true},
{ctrl:'quantity',format:'number',required:true},
{ctrl:'rtype',format:'int',required:true},
{ctrl:'productid',format:'',required:true},
{ctrl:'contactNumber',format:'phone',required:true},
{ctrl:'particular',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/transaction', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        TransactionController.insert
      ]);
      
      
      app.get('/transaction', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          TransactionController.list
      ]);
      app.get('/transaction/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        TransactionController.listAll
    ]);
    app.get('/transaction/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        TransactionController.listSuggestions
    ]);
      app.get('/transaction/:transactionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          TransactionController.getById
      ]);
      app.patch('/transaction/:transactionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          TransactionController.patchById
      ]);
      app.delete('/transaction/:transactionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          TransactionController.removeById
      ]);
  };
  
    