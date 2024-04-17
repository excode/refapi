const rootPath="../../";
  const PromotionController = require('./promotion.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'title',format:'text',required:true},
{ctrl:'discount',format:'number',required:true,max:70,min:0},
{ctrl:'productid',format:'',required:true},
{ctrl:'validFrom',format:'date',required:true},
{ctrl:'validTill',format:'date',required:true},
{ctrl:'active',format:'boolean',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/promotion', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        PromotionController.insert
      ]);
      
      
    app.post('/promotion/upload/:columnName/:rowId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.promotionInsertPermission(),  // 
        //PermissionMiddleware.jpromotionInsertLimit(),     // 
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        PromotionController.uploadfile
    ]);
        
      app.get('/promotion', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          PromotionController.list
      ]);
      app.get('/promotion/dash', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        PromotionController.findByCreatedAt
    ]);
      app.get('/promotion/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        PromotionController.listAll
    ]);
    app.get('/promotion/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        PromotionController.listSuggestions
    ]);
      app.get('/promotion/:promotionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          PromotionController.getById
      ]);
      app.patch('/promotion/:promotionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          PromotionController.patchById
      ]);
      app.delete('/promotion/:promotionId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          PromotionController.removeById
      ]);
  };
  
    