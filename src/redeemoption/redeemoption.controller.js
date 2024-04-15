const RedeemoptionModel = require('./redeemoption.model');
var ObjectId = require('mongodb').ObjectID;
const funcs =  require("../../common/functions/funcs");
  
  exports.insert = (req, res) => {
        req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
        //req.body.id=req.jwt.id
        
            RedeemoptionModel.createRedeemoption(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      
      req.query={...req.query,createBy: req.jwt.email,createBy_mode:'equals'};
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
      RedeemoptionModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    //req.query={...req.query,createBy: req.jwt.email,createBy_mode:'equals'};
    req.query={...req.query,productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
    RedeemoptionModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,forced_productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
    RedeemoptionModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
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
    RedeemoptionModel.findById(req.params.redeemoptionId,filter)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.patchById = (req, res) => {
      req.body.updateBy=req.jwt.email  
        req.body.updateAt=funcs.getTime()
      let filter ={}
      filter['createBy'] = req.jwt.email
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
      RedeemoptionModel.patchRedeemoption(req.params.redeemoptionId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
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
    RedeemoptionModel.removeById(req.params.redeemoptionId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  
exports.uploadfile=(req,res)=>{
    RedeemoptionModel.uploadFile(req)
        .then((result) => {
                res.status(201).send( result);
        }).catch((err)=>{

        res.status(400).json( {err :err});
    });
}
        

    