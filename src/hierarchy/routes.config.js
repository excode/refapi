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
  const formValidationRules1=[
    {ctrl:'username',format:'',required:true},
    {ctrl:'parentUsername',format:'',required:true},
    {ctrl:'productid',format:'',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/hierarchy', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.insert
      ]);
      app.post('/hierarchy/reg', [
       // ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.insert
      ]);
      
      
      app.get('/hierarchy', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          HierarchyController.list
      ]);
      app.get('/hierarchy/ref', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.list_projects
    ]);
    app.get('/hierarchy/ref/u', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      HierarchyController.list_projects
  ]);
    app.get('/hierarchy/all/level', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      HierarchyController.list_level
  ]);
  app.get('/hierarchy/all/level2', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    HierarchyController.list_level2
]);
app.get('/hierarchy/all/level3', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  HierarchyController.list_level3
]);
app.get('/hierarchy/all/level3/u', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  HierarchyController.list_level_m
]);
    app.get('/hierarchy/all/org_chart', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      HierarchyController.list_chart
    ]);
    app.get('/hierarchy/all/org_chart2', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      HierarchyController.list_chart2
    ]);
    app.get('/hierarchy/all/org_chart2/u', [
      ValidationMiddleware.validJWTNeeded,
      PermissionMiddleware.minimumPermissionLevelRequired(USER),
      HierarchyController.list_chart2_u
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
      
      app.post('/hierarchy/addNew/reg', [
        // ValidationMiddleware.validJWTNeeded,
         //FormValidation.formValidation(formValidationRules1),
         //PermissionMiddleware.minimumPermissionLevelRequired(USER),
         HierarchyController.addNewUser2
       ]);
       app.post('/hierarchy/addNew/reward', [
        // ValidationMiddleware.validJWTNeeded,
         //FormValidation.formValidation(formValidationRules1),
         //PermissionMiddleware.minimumPermissionLevelRequired(USER),
         HierarchyController.addNewUser3
       ]);
       app.post('/hierarchy/check/reg', [
        // ValidationMiddleware.validJWTNeeded,
         //FormValidation.formValidation(formValidationRules1),
         //PermissionMiddleware.minimumPermissionLevelRequired(USER),
         HierarchyController.addNewUserCheck
       ]);
       app.post('/hierarchy/placement/reg', [
        // ValidationMiddleware.validJWTNeeded,
         //FormValidation.formValidation(formValidationRules1),
         //PermissionMiddleware.minimumPermissionLevelRequired(USER),
         HierarchyController.placement
       ]);
      app.post('/hierarchy/addNew', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules1),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        HierarchyController.addNewUser
      ]);
  };
  
    