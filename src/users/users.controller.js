const UsersModel = require('./users.model');
const ProductModel = require('../product/product.model');
const PromotionModel = require('../promotion/promotion.model');
const RedeemModel = require('../redeem/redeem.model');
const ReawardModel = require('../reward/reward.model');
const SellModel = require('../sell/sell.model');
const HierarchyModel = require('../hierarchy/hierarchy.model');
const crypto = require('crypto');
  const funcs =  require("../../common/functions/funcs");
  const email = require("../../common/functions/email");
  
exports.reg = (req, res) => {

    req.body.createBy="REG"
req.body.createAt=funcs.getTime()
password=funcs.randomNumber(6); 
req.body.password=  password.toString()  
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
    UsersModel.createUsers(req.body)
          .then((result) => {
            const contents = {
                name: req.body.firstname,
                code: password,
                product_url: ""
            };
            email.sendEmail(req.body.email, "ucode-1", contents).then(done => {
                res.status(200).send("User Registered.Please Check Email for Password");
            }).catch((err1) => {
                console.log(err1);
                mes = funcs.handleValidationError(err1);
                res.status(400).json({ errors: err1 });
            });
           

          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
     

};

  exports.insert = (req, res) => {
            req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
        req.body.id=req.jwt.id
        password=funcs.randomNumber(6); 
req.body.password=  password.toString() 
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
            UsersModel.createUsers(req.body)
                  .then((result) => {
                    const contents = {
                        name: req.body.firstname,
                        code: password,
                        product_url: ""
                    };
                    email.sendEmail(req.body.email, "ucode-1", contents).then(done => {
                        res.status(200).send({id: result.id,Message: "User Registered.Please Check Email for Password"}
                           );
                    }).catch((err1) => {
                        console.log(err1);
                        mes = funcs.handleValidationError(err1);
                        res.status(400).json({ errors: err1 });
                    }); 
                    //res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  

exports.createEmailVerifyOtp = (req, res) => {
    console.log("email:"+req.body.email)
    // Generate a random 6 digit number for OTP
    let otp = Math.floor(100000 + Math.random() * 900000);
    // Set OTP expiry time to 5 minutes from now
    const expiredate = new Date();
    expiredate.setMinutes(expiredate.getMinutes() + 5);
    UsersModel.createEmailVerifyOtp(req.body.email,otp,expiredate)
        .then((result) => {
            const contents = {
                name: result.firstname,
                code: otp,
                product_url: ""
            };
            email.sendEmail(req.body.email, "ucode-1", contents).then(done => {
                res.status(200).send({Message: "Send verify Email Otp"}
                   );
            }).catch((err1) => {
                console.log(err1);
                mes = funcs.handleValidationError(err1);
                res.status(400).json({ errors: err1 });
            }); 
            //res.status(200).send(result.emailVerifyOtp);
        }).catch((err) => {
            res.status(400).json({ err: err });
        });
};

exports.verifyEmailOtp = (req, res) => {
    UsersModel.verifyEmailOtp(req.body.email, req.body.otp)
        .then((result) => {
            res.status(200).send("Verified");
        }).catch((err) => {
            res.status(400).json({ err: err });
        });
};

exports.resetPasswordInit = (req, res) => {
    let randomOtp = Math.floor(100000 + Math.random() * 900000); 
        let otpExpiredate = new Date();
        otpExpiredate.setMinutes(otpExpiredate.getMinutes() + 5); 
    UsersModel.resetPasswordInit(req.body.email,randomOtp,otpExpiredate)
        .then((result) => {
            const contents = {
                name: result.firstname,
                code: randomOtp,
                product_url: ""
            };
            email.sendEmail(req.body.email, "ucode-1", contents).then(done => {
                res.status(200).send({Message: "Send Forgot Password Email Otp"}
                   );
            }).catch((err1) => {
                console.log(err1);
                mes = funcs.handleValidationError(err1);
                res.status(400).json({ errors: err1 });
            }); 
            //res.status(200).send(result.forgotPasswordOtp);
        }).catch((err) => {
            res.status(400).json({ err: err });
        });
};

exports.resetPasswordFinish = (req, res) => {
    UsersModel.resetPasswordFinish(req.body.email, req.body.otp, req.body.newPassword)
        .then((result) => {
            res.status(200).send("Password Reseted");
        }).catch((err) => {
            res.status(400).json({ err: err });
        });
};

exports.changePassword = (req, res) => {
    UsersModel.changePassword(req.jwt.email, req.body.oldPassword, req.body.newPassword)
        .then((result) => {
            res.status(200).send("Password Change Succesfully");
        }).catch((err) => {
            res.status(400).json({ err: err });
        });
};

exports.dash = (req, res) => {
    const email = req.jwt.email;
    console.log("email:"+email);
    Promise.all([
        ProductModel.find({ createBy: email }),
        PromotionModel.find({ createBy: email }),
        RedeemModel.find({ createBy: email }),
        ReawardModel.find({ createBy: email }),
        SellModel.find({ createBy: email }),
        HierarchyModel.find({ createBy: email })
    ])
    .then(results => {
        //const counts = results.map(result => result);
        const counts = results.map(result => result.length);
       
        res.status(200).send({
            productCount: counts[0],
            promotionCount: counts[1],
            redeemCount: counts[2],
            rewardCount: counts[3],
            sellCount: counts[4],
            customerCount: counts[5],
        });
    })
    .catch(err => {
        res.status(400).json({ err: err });
    });
};


  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query={...req.query,id:req.jwt.id}
       /*
        IMPORTANT
        you can put predefined condition here  based on user and role  
        for example 
        req.query.createBy = req.jwt.email
        req.query.organizationId = req.JWT.userOrganization

        you can also put condition based on user role
        like 
        if(req.JWT.userType>1) 
        req.query.organizationId = req.JWT.userOrganization //  I
        }
        */
      if (req.query) {
          if (req.query.page) {
              req.query.page = parseInt(req.query.page);
              page = Number.isInteger(req.query.page) ? req.query.page : 0;
          }
      }
      UsersModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    req.query={...req.query,id:req.jwt.id}
    /*
        IMPORTANT
        you can put predefined condition here  based on user and role  
        for example 
        req.query.createBy = req.jwt.email
        req.query.organizationId = req.JWT.userOrganization

        you can also put condition based on user role
        like 
        if(req.JWT.userType>1){ 
        req.query.organizationId = req.JWT.userOrganization //  I
        }
     */
    UsersModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,id:req.jwt.id}
    /*
    IMPORTANT
    HERE  "serach" query parameter is reserved for keword searh  
    you can put predefined condition here  based on user and role  
    for example 
    req.query.createBy = req.jwt.email
    req.query.organizationId = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    req.query.organizationId = req.JWT.userOrganization //  I
    }
     */
    UsersModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    filter['createBy'] = req.jwt.email
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
    UsersModel.findById(req.params.usersId,filter)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.patchById = (req, res) => {
      req.body.updateBy=req.jwt.email  
        req.body.updateAt=funcs.getTime() 
// Hashing  password data 
if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
}
      let filter ={}
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    filter['createBy'] = req.jwt.email
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
      UsersModel.patchUsers(req.params.usersId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    filter['createBy'] = req.jwt.email
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
    UsersModel.removeById(req.params.usersId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  

    