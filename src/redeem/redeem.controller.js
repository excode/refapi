const RedeemModel = require("./redeem.model");
//var ObjectId = require('mongodb').ObjectID;
const funcs = require("../../common/functions/funcs");
const  env  = process.env;
const mongoose = require('../../common/services/mongoose.service').mongoose;
exports.insert = (req, res) => {
  req.body.createBy = req.jwt.email;
  req.body.createAt = funcs.getTime();
 // req.body.id = req.jwt.id;

  RedeemModel.createRedeem(req.body)
    .then((result) => {
      res.status(200).send({ id: result.id });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.findByCreatedAt = (req, res) => {
  RedeemModel.find({ createdAt: req.jwt.email })
      .then(response => {
          res.status(200).send({ length: response.length});
      })
      .catch(err => {
          res.status(400).json({ err: err });
      });
};

exports.latestRedeem = (req, res) => {
  //req.query = { ...req.query, id: req.jwt.id };
  RedeemModel.latestRedeem(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  console.log(req.jwt)
  if(req.headers["project_code"]){
    let project_code =req.headers["project_code"];
    let products_ids = env[project_code]
    if(products_ids){
     
    let array = ["66e78d6e54ced7123a184796","66e65f1e2f3ef81b47544c76","66e665de966efc2edaa97cf0"];//  JSON.parse(products_ids);
    console.log(Array.isArray(array))
    req.query={...req.query,'contactNumber_mode':'equals','contactNumber':req.jwt.username, forced_productid: array.map(pid => mongoose.Types.ObjectId(pid))}
    }
  }else{
    req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
  }
  
  //req.query = { ...req.query, id: req.jwt.id };
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
  RedeemModel.list(limit, page, req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
exports.listAll = (req, res) => {
  //req.query={...req.query,createBy:req.jwt.email}
  req.query={...req.query,productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
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
  RedeemModel.listAll(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
exports.listSuggestions = (req, res) => {
  
  req.query={...req.query,createBy:req.jwt.email}
  //req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
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
  RedeemModel.listSuggestions(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.getById = (req, res) => {
  let filter = {};
  //filter['createBy'] = req.jwt.email
  //filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};


  if(req.jwt.productid){
    filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
}
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
  RedeemModel.findById(req.params.redeemId, filter)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
exports.patchById = (req, res) => {
  req.body.updateBy = req.jwt.email;
  req.body.updateAt = funcs.getTime();
  
  let filter = {};
  //filter['createBy'] = req.jwt.email
  filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
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
  RedeemModel.patchRedeem(req.params.redeemId, req.body, filter)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.removeById = (req, res) => {
  let filter = {};
  //filter['createBy'] = req.jwt.email
  filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
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
  RedeemModel.removeById(req.params.redeemId, filter)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
