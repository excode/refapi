const AnalyticsController = require("./analytics.controller");
const PermissionMiddleware = require("../../common/middlewares/auth.permission.middleware");
const ValidationMiddleware = require("../../common/middlewares/auth.validation.middleware");
const config = require("../../common/config/env.config");
const ADMIN = config.permissionLevels.ADMIN;
const USER = config.permissionLevels.APP_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
  app.get("/analytics", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    AnalyticsController.chartData,
  ]);
};
