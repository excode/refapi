const rootPath="../../";
  const RedeemoptionController = require('./redeemoption.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'productid',format:'text',required:true},
{ctrl:'name',format:'text',required:true},
{ctrl:'rate',format:'number',required:true},
{ctrl:'active',format:'boolean',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/redeemoption', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RedeemoptionController.insert
      ]);
      
      
    app.post('/redeemoption/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.redeemoptionInsertPermission(),  // 
        //PermissionMiddleware.jredeemoptionInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RedeemoptionController.uploadfile
    ]);
        
      app.get('/redeemoption', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          RedeemoptionController.list
      ]);
      app.get('/redeemoption/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RedeemoptionController.listAll
    ]);
    app.get('/redeemoption/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RedeemoptionController.listSuggestions
    ]);
      app.get('/redeemoption/:redeemoptionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          RedeemoptionController.getById
      ]);
      app.patch('/redeemoption/:redeemoptionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          RedeemoptionController.patchById
      ]);
      app.delete('/redeemoption/:redeemoptionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          RedeemoptionController.removeById
      ]);
  };
  
    