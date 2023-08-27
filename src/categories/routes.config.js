const rootPath="../../";
  const CategoriesController = require('./categories.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'active',format:'boolean',required:true},
{ctrl:'rank',format:'int',required:true,max:50,min:0},
{ctrl:'category',format:'text',required:true,max:50,min:0}
  ];
  exports.routesConfig = function (app) {
      app.post('/categories', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CategoriesController.insert
      ]);
      
      
      app.get('/categories', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CategoriesController.list
      ]);
      app.get('/categories/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CategoriesController.listAll
    ]);
    app.get('/categories/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        CategoriesController.listSuggestions
    ]);
      app.get('/categories/:categoriesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          CategoriesController.getById
      ]);
      app.patch('/categories/:categoriesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          CategoriesController.patchById
      ]);
      app.delete('/categories/:categoriesId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          CategoriesController.removeById
      ]);
  };
  
    