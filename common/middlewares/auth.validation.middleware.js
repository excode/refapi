const jwt = require("jsonwebtoken"),
  secret = require("../config/env.config.js").jwt_secret,
  crypto = require("crypto");
  const ProductModel = require("../../src/product/product.model")
exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body && req.body.refresh_token) {
    return next();
  } else {
    return res.status(400).send({ error: "need to pass refresh_token field" });
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  let b = new Buffer(req.body.refresh_token, "base64");
  let refresh_token = b.toString();
  let hash = crypto
    .createHmac("sha512", req.jwt.refreshKey)
    .update(req.jwt.userId + secret)
    .digest("base64");
  if (hash === refresh_token) {
    req.body = req.jwt;
    return next();
  } else {
    return res.status(400).send({ error: "Invalid refresh token" });
  }
};

exports.validJWTNeeded = async(req, res, next) => {
  let my_secret=secret;
  if(req.headers["project_code"]){
    my_secret=req.headers["project_code"];
  }
 // console.log(my_secret)
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(authorization[1], my_secret);
        if(!req.jwt.productId){
          let productId= await ProductModel.listIds(req.jwt.username.trim());
          req.jwt.productId = productId;
        }
        if(!req.jwt.email){
          
          req.jwt.email = req.jwt.username.trim();
        }
        if(!req.jwt.contactNumber){
          
          req.jwt.contactNumber = req.jwt.username.trim();
        }

        return next();
      }
    } catch (err) {
      console.log(err);
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};
exports.validJWTNeeded2 = (req, res, next) => {
  let my_secret=secret;
  if(req.headers["project_code"]){
    my_secret=req.headers["project_code"];
  }
 // console.log(my_secret)
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(authorization[1], my_secret);

        return next();
      }
    } catch (err) {
      console.log(err);
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};


