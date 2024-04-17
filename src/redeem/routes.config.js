const rootPath = "../../";
const RedeemController = require("./redeem.controller");
const PermissionMiddleware = require("../../common/middlewares/auth.permission.middleware");
const ValidationMiddleware = require("../../common/middlewares/auth.validation.middleware");
const config = require("../../common/config/env.config");
const FormValidation = require("../../lib/validation");
const ADMIN = config.permissionLevels.ADMIN;
const USER = config.permissionLevels.APP_USER;
const FREE = config.permissionLevels.NORMAL_USER;
const formValidationRules = [
  { ctrl: "productid", format: "", required: true },
  { ctrl: "redeemproductid", format: "text", required: true },
  { ctrl: "quantity", format: "number", required: true },
  { ctrl: "unitprice", format: "number", required: true },
  { ctrl: "total", format: "number", required: true },
  { ctrl: "sellerNumber", format: "phone", required: true },
];
exports.routesConfig = function (app) {
  app.post("/redeem", [
    ValidationMiddleware.validJWTNeeded,
    FormValidation.formValidation(formValidationRules),
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.insert,
  ]);

  app.get("/redeem", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.list,
  ]);

  app.get('/redeem/dash', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.findByCreatedAt
]);

  app.get("/redeem/latest-redeem", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.latestRedeem,
  ]);

  app.get("/redeem/all", [
    //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.listAll,
  ]);
  app.get("/redeem/suggestions", [
    //  Required to Fill UI Component like Auto Complete , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.listSuggestions,
  ]);
  app.get("/redeem/:redeemId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    RedeemController.getById,
  ]);
  app.patch("/redeem/:redeemId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    FormValidation.formValidation(formValidationRules, "UPDATE"),
    RedeemController.patchById,
  ]);
  app.delete("/redeem/:redeemId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    RedeemController.removeById,
  ]);
};
