const rootPath="../../";
  const ProductblogController = require('./productblog.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'active',format:'boolean',required:true},
{ctrl:'title',format:'text',required:true},
{ctrl:'details',format:'',required:true},
{ctrl:'productid',format:'',required:true},
{ctrl:'categoryid',format:'',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/productblog', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductblogController.insert
      ]);
      
      
    app.post('/productblog/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.productblogInsertPermission(),  // 
        //PermissionMiddleware.jproductblogInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductblogController.uploadfile
    ]);
        
      app.get('/productblog', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductblogController.list
      ]);
      app.get('/productblog/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductblogController.listAll
    ]);
    app.get('/productblog/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductblogController.listSuggestions
    ]);
      app.get('/productblog/:productblogId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductblogController.getById
      ]);
      app.patch('/productblog/:productblogId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          ProductblogController.patchById
      ]);
      app.delete('/productblog/:productblogId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          ProductblogController.removeById
      ]);
  };
  
    