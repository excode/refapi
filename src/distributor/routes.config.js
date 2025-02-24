const rootPath="../../";
  const DistributorController = require('./distributor.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'blogTitle',format:'text',required:true},
  {ctrl:'email',format:'email',required:true},
  {ctrl:'state',format:'text',required:true},
  {ctrl:'productid',format:'',required:true},
  {ctrl:'contactNumber',format:'phone',required:true},
  {ctrl:'name',format:'text',required:true},
  {ctrl:'address',format:'text',required:true},
  {ctrl:'city',format:'text',required:true},
  {ctrl:'zipcode',format:'text',required:true,max:10,min:0}

  ];
  exports.routesConfig = function (app) {
      app.post('/distributor', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        DistributorController.insert
      ]);
      
      
      app.get('/distributor', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          DistributorController.list
      ]);
      app.get('/distributor/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        DistributorController.listAll
    ]);
    app.get('/distributor/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        DistributorController.listSuggestions
    ]);
      app.get('/distributor/:distributorId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          DistributorController.getById
      ]);
      app.patch('/distributor/:distributorId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          DistributorController.patchById
      ]);
      app.delete('/distributor/:distributorId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          DistributorController.removeById
      ]);
       app.post('/distributor/upload/:columnName/:rowId', [
              ValidationMiddleware.validJWTNeeded,
              //PermissionMiddleware.productInsertPermission(),  // 
              //PermissionMiddleware.jproductInsertLimit(),     // 
              PermissionMiddleware.minimumPermissionLevelRequired(USER),
              DistributorController.uploadfile
          ]);
  };

  
    