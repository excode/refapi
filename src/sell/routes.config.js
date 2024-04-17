const rootPath = "../../";
const SellController = require("./sell.controller");
const PermissionMiddleware = require("../../common/middlewares/auth.permission.middleware");
const ValidationMiddleware = require("../../common/middlewares/auth.validation.middleware");
const config = require("../../common/config/env.config");
const FormValidation = require("../../lib/validation");
const ADMIN = config.permissionLevels.ADMIN;
const USER = config.permissionLevels.APP_USER;
const FREE = config.permissionLevels.NORMAL_USER;
const formValidationRules = [
  { ctrl: "quantity", format: "number", required: true },
  { ctrl: "unitprice", format: "number", required: true },
  { ctrl: "total", format: "number", required: true },
  { ctrl: "productid", format: "", required: true },
  { ctrl: "sellerNumber", format: "phone", required: true },
  { ctrl: "contactNumber", format: "phone", required: true },
];
exports.routesConfig = function (app) {
  app.post("/sell", [
    ValidationMiddleware.validJWTNeeded,
    FormValidation.formValidation(formValidationRules),
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.insert,
  ]);

  app.get("/sell", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.list,
  ]);
  app.get('/sell/dash', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.findByCreatedAt
]);
  app.get("/sell/all", [
    //  Required to Fill UI Component like Dropdown ,List , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.listAll,
  ]);

  app.get("/sell/latest-sell", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.latestSell,
  ]);

  app.get("/sell/suggestions", [
    //  Required to Fill UI Component like Auto Complete , can be disabled if not required
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.listSuggestions,
  ]);
  app.get("/sell/:sellId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    SellController.getById,
  ]);
  app.patch("/sell/:sellId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    FormValidation.formValidation(formValidationRules, "UPDATE"),
    SellController.patchById,
  ]);
  app.delete("/sell/:sellId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    SellController.removeById,
  ]);
};
