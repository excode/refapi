const rootPath="../../";
  const CurrenciesController = require('./currencies.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'minTransaction',format:'number',required:true},
{ctrl:'transactionFee',format:'number',required:true},
{ctrl:'maxTransaction',format:'number',required:true},
{ctrl:'decimal',format:'int',required:true,max:2,min:0},
{ctrl:'name',format:'text',required:true,max:20,min:0},
{ctrl:'isocode',format:'text',required:true,max:3,min:0},
{ctrl:'cSign',format:'text',required:true,max:5,min:0}
  ];
  exports.routesConfig = function (app) {
      app.post('/currencies', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CurrenciesController.insert
      ]);
      
      
      app.get('/currencies', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CurrenciesController.list
      ]);
      app.get('/currencies/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CurrenciesController.listAll
    ]);
    app.get('/currencies/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CurrenciesController.listSuggestions
    ]);
      app.get('/currencies/:currenciesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CurrenciesController.getById
      ]);
      app.patch('/currencies/:currenciesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          CurrenciesController.patchById
      ]);
      app.delete('/currencies/:currenciesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          CurrenciesController.removeById
      ]);
  };
  
    