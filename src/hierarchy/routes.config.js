const rootPath="../../";
  const HierarchyController = require('./hierarchy.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'distributor',format:'boolean',required:true},
{ctrl:'contactNumber',format:'phone',required:true},
{ctrl:'productid',format:'',required:true},
{ctrl:'introducer',format:'phone',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/hierarchy', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.insert
      ]);
      
      
      app.get('/hierarchy', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          HierarchyController.list
      ]);
      app.get('/hierarchy/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.listAll
    ]);
    app.get('/hierarchy/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.listSuggestions
    ]);
      app.get('/hierarchy/:hierarchyId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          HierarchyController.getById
      ]);
      app.patch('/hierarchy/:hierarchyId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          HierarchyController.patchById
      ]);
      app.delete('/hierarchy/:hierarchyId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          HierarchyController.removeById
      ]);
  };
  
    