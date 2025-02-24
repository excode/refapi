const DistributorModel = require('./distributor.model');
const ProductModel =  require("../product/product.model");
const CategoryModel =  require("../categories/categories.model");
const HierarchyModel =  require("../hierarchy/hierarchy.model");
const UsersModel =  require("../users/users.model");
const funcs =  require("../../common/functions/funcs");

  exports.insert = async(req, res) => {
        req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
       //req.body.id=req.jwt.id
       const product=await ProductModel.findById(req.body.productid);
       
        if(product){
        const category=await CategoryModel.findById(product.categoryid)
               
        req.body.productname= product.productname;
        req.body.serviceType=product.serviceType
        req.body.category = category.category
        req.body.currency=product.currency
        req.body.country=product.country
        // console.log(req.body);
         //return;
            DistributorModel.createDistributor(req.body)
                  .then((result) => {
                    //await HierarchyModel.addWallets(req.jwt.contactNumber,req.body.contactNumber,req.body.productid,1);
                   // await UsersModel.updateSyncTime([req.body.contactNumber],["distributor","hierarchy"]);
                    HierarchyModel.addWallets(req.jwt.contactNumber,req.body.contactNumber,req.body.productid,req,1).then((r)=>{
                        UsersModel.updateSyncTime([req.body.contactNumber],["distributor","hierarchy"]).then((r)=>{
                           
                               // console.log(result);
                              // HierarchyModel.updateSyncTime(req.body.productid,"product").then((r)=>{
                                res.status(200).send({id: result.id});
                               // })
                            
                        });
                    });      
                   
 
                  }).catch((err)=>{
                     
                      res.status(500).json( {err:err} );
                  });

                }else{
                    res.status(500).json( {err:"Product not valid"} );
                }
             
     
  };
  
  exports.list =async (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      console.log(req.jwt)
      const ids= await ProductModel.listIds(req.jwt.email);
      console.log(ids)
      req.query={...req.query,createBy:req.jwt.email,createBy_mode:"equals"}
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
      DistributorModel.list(limit, page,req.query)
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
    DistributorModel.listAll(req.query)
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
    DistributorModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
    if(req.jwt.email){
    filter['createBy'] = req.jwt.email
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
    DistributorModel.findById(req.params.distributorId,filter)
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
      DistributorModel.patchDistributor(req.params.distributorId, req.body,filter)
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
    DistributorModel.removeById(req.params.distributorId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  
exports.uploadfile=(req,res)=>{
    DistributorModel.uploadFile(req)
        .then((result) => {
                res.status(201).send( result);
        }).catch((err)=>{

        res.status(400).json( {err :err});
    });
}
        
    