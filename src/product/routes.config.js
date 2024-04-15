const rootPath="../../";
  const ProductController = require('./product.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
  {ctrl:'serviceType',format:'int',required:true},
{ctrl:'level',format:'int',required:true},
{ctrl:'price',format:'number',required:true},
{ctrl:'qty',format:'int',required:true},
{ctrl:'productname',format:'text',required:true},
{ctrl:'categoryid',format:'',required:true},
{ctrl:'country',format:'text',required:true},
{ctrl:'description',format:'',required:true},
{ctrl:'currency',format:'text',required:true},
{ctrl:'unitName',format:'text',required:true},
{ctrl:'website',format:'url',required:false},
{ctrl:'facebook',format:'url',required:false},
{ctrl:'youtube',format:'url',required:false},

  ];
  exports.routesConfig = function (app) {
      app.post('/product', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductController.insert
      ]);
      
      
    app.post('/product/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.productInsertPermission(),  // 
        //PermissionMiddleware.jproductInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductController.uploadfile
    ]);
        
      app.get('/product', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductController.list
      ]);
      app.get('/product/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductController.listAll
    ]);
    app.get('/product/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        ProductController.listSuggestions
    ]);
      app.get('/product/:productId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          ProductController.getById
      ]);
      app.patch('/product/:productId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          ProductController.patchById
      ]);
      app.delete('/product/:productId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          ProductController.removeById
      ]);
      app.patch('/product/levelconfig/:productId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
       // FormValidation.formValidation(formValidationRules,'UPDATE'),
        ProductController.updateLevelConfig
    ]);
    app.patch('/product/config/:productId', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
     // FormValidation.formValidation(formValidationRules,'UPDATE'),
      ProductController.updateConfig
  ]);
  };
  
    