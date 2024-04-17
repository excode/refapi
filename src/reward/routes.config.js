const rootPath="../../";
  const RewardController = require('./reward.controller');
  const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
  const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
  const config = require('../../common/config/env.config');
  const FormValidation = require('../../lib/validation');
  const ADMIN = config.permissionLevels.ADMIN;
  const USER = config.permissionLevels.APP_USER;
  const FREE = config.permissionLevels.NORMAL_USER;
  const formValidationRules=[
    {ctrl:'level',format:'int',required:true},
{ctrl:'amount',format:'number',required:true},
{ctrl:'status',format:'boolean',required:true},
{ctrl:'productid',format:'text',required:true},
{ctrl:'redeemProductId',format:'',required:true},
{ctrl:'contactNumber',format:'phone',required:true},
{ctrl:'ref',format:'text',required:true},
{ctrl:'sourceContactNumber',format:'phone',required:true},
{ctrl:'particular',format:'text',required:true},
{ctrl:'type',format:'text',required:true}
  ];
  exports.routesConfig = function (app) {
      app.post('/reward', [
        ValidationMiddleware.validJWTNeeded,
        FormValidation.formValidation(formValidationRules),
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RewardController.insert
      ]);
      
      
      app.get('/reward', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          RewardController.list
      ]);
      app.get('/reward/dash', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RewardController.findByCreatedAt
    ]);
      app.get('/reward/all', [   //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RewardController.listAll
    ]);
    app.get('/reward/suggestions', [   //  Required to Fill UI Component like Auto Complete , can be disabled if not required
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(USER),
        RewardController.listSuggestions
    ]);
      app.get('/reward/:rewardId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          RewardController.getById
      ]);
      app.patch('/reward/:rewardId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(USER),
          FormValidation.formValidation(formValidationRules,'UPDATE'),
          RewardController.patchById
      ]);
      app.delete('/reward/:rewardId', [
          ValidationMiddleware.validJWTNeeded,
          PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
          RewardController.removeById
      ]);
  };
  
    