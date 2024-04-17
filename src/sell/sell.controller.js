const SellModel = require("./sell.model");
var ObjectId = require('mongodb').ObjectID;
const funcs = require("../../common/functions/funcs");

exports.insert = (req, res) => {
  req.body.createBy = req.jwt.email;
  req.body.createAt = funcs.getTime();
  req.body.id = req.jwt.id;

  SellModel.createSell(req.body)
    .then((result) => {
      res.status(200).send({ id: result.id });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
exports.findByCreatedAt = (req, res) => {
  SellModel.find({ createdAt: req.jwt.email })
      .then(response => {
          res.status(200).send({ length: response.length});
      })
      .catch(err => {
          res.status(400).json({ err: err });
      });
};
exports.latestSell = (req, res) => {
  req.query = { ...req.query, id: req.jwt.id };
  SellModel.latestSell(req.query)
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
  //req.query={...req.query,force_productid:new ObjectId(req.jwt.productId[1]),productid_mode:'equals'}
  //req.query={...req.query,productid:req.jwt.productId[1],productid_mode:'equals'}
  req.query={...req.query,forced_productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
  SellModel.list(limit, page, req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.listAll = (req, res) => {
  req.query={...req.query,force_productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
  SellModel.listAll(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
exports.listSuggestions = (req, res) => {
  req.query={...req.query,force_productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
  SellModel.listSuggestions(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.getById = (req, res) => {
  let filter = {};
  //filter['productid']= {"in":req.jwt.productId.map(pid => new ObjectId(pid))};
  if(req.jwt.productid){
    filter['productid']= {"in":req.jwt.productId.map(pid => new ObjectId(pid))};
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
  SellModel.findById(req.params.sellId, filter)
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
  filter['productid']= {"in":req.jwt.productId.map(pid => new ObjectId(pid))};
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
  SellModel.patchSell(req.params.sellId, req.body, filter)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.removeById = (req, res) => {
  let filter = {};
  filter['productid']= {"in":req.jwt.productId.map(pid => new ObjectId(pid))};
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
  SellModel.removeById(req.params.sellId, filter)
    .then((result) => {
      res.status(204).send({});
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
