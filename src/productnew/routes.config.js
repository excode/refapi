const rootPath="../../";
  const ProductnewController = require('./productnew.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'active',format:'boolean',required:true},
{ctrl:'productid',format:'',required:true},
{ctrl:'title',format:'text',required:true},
{ctrl:'details',format:'',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/productnew', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductnewController.insert
      ]);
      
      
    app.post('/productnew/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.productnewInsertPermission(),  // 
        //PermissionMiddleware.jproductnewInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductnewController.uploadfile
    ]);
        
      app.get('/productnew', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductnewController.list
      ]);
      app.get('/productnew/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductnewController.listAll
    ]);
    app.get('/productnew/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductnewController.listSuggestions
    ]);
      app.get('/productnew/:productnewId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductnewController.getById
      ]);
      app.patch('/productnew/:productnewId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          ProductnewController.patchById
      ]);
      app.delete('/productnew/:productnewId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          ProductnewController.removeById
      ]);
  };
  
    