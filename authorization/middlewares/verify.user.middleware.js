const UserModel = require("../../src/users/users.model");
const crypto = require("crypto");
const funcs = require("../../common/functions/funcs");
exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.email) {
      errors.push("Missing email field");
    }
    if (!req.body.password) {
      errors.push("Missing password field");
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(",") });
    } else {
      return next();
    }
  } else {
    return res
      .status(400)
      .send({ errors: "Missing email and password fields" });
  }
};
exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByEmail(req.body.email.trim()).then((user) => {
    if (!user) {
      res.status(404).send({ errors: "Invalid Login information" });
    } else {
      let passwordFields = user.password.split("$");
      let salt = passwordFields[0];
      let fcm = req.body.fcm;
      let hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
      // console.log(hash);
      // console.log(passwordFields[1]);
      if (hash === passwordFields[1]) {
        req.body = {
          userId: user.id ? user.id : "",
          email: user.email,
          permissionLevel: user.userType,
          firstname: user.firstname,
          lastname: user.lastname,
          country: user.country,
          mobile: user.mobile,
          webAccess: 0,
        };
        return next();
      } else {
        return res.status(400).send({ errors: "Invalid Login information" });
      }
    }
  });
};
