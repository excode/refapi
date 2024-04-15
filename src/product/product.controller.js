const ProductModel = require('./product.model');

  const funcs =  require("../../common/functions/funcs");
  
  exports.insert = (req, res) => {
        req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
        //req.body.id=req.jwt.id
        
            ProductModel.createProduct(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      req.query={...req.query,createBy:req.jwt.email}
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
      ProductModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    req.query={...req.query,createBy:req.jwt.email}
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
    ProductModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,createBy:req.jwt.email}
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
    ProductModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
    filter['createBy'] = req.jwt.email

    if(req.jwt.email){
        filter['createBy']= req.jwt.email;
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
    console.log(filter)
    ProductModel.findById(req.params.productId,filter)
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
      ProductModel.patchProduct(req.params.productId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  exports.updateLevelConfig = (req, res) => {
    let levelConfig=req.body;
    let req_={body:{}};
    req_.body.updateBy=req.jwt.email  
    req_.body.updateAt=funcs.getTime()
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
  
  req_.body.levelConfig=levelConfig;
  console.log(req_.body)
    ProductModel.patchProduct(req.params.productId, req_.body,filter)
        .then((result) => {
            res.status(204).send({});
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });

};
exports.updateConfig = (req, res) => {
    let config=req.body;
    let req_={body:{}};
    req_.body.updateBy=req.jwt.email  
    req_.body.updateAt=funcs.getTime()
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
  
  req_.body.config=config;
  console.log(req_.body)
    ProductModel.patchProduct(req.params.productId, req_.body,filter)
        .then((result) => {
            res.status(204).send({});
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });

};

  exports.removeById = (req, res) => {
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
    ProductModel.removeById(req.params.productId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  
exports.uploadfile=(req,res)=>{
    ProductModel.uploadFile(req)
        .then((result) => {
                res.status(201).send( result);
        }).catch((err)=>{

        res.status(400).json( {err :err});
    });
}
        

    