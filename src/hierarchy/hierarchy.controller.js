const HierarchyModel = require('./hierarchy.model');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
  const funcs =  require("../../common/functions/funcs");
  
  exports.insert = (req, res) => {
        req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
        //req.body.id=req.jwt.email
        
            HierarchyModel.createHierarchy(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };
  
  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
    //  console.log(req.jwt.productId)
      if(req.jwt.productId){

        req.query={...req.query,forced_productid: req.jwt.productId.map(pid =>  mongoose.Types.ObjectId(pid))}
      }else{
        req.query={...req.query,forced_productid: null}
      }

      //req.query={...req.query,createBy:req.jwt.email,createBy_mode:'equals'}
      //req.query={...req.query,createBy:req.jwt.email}

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
      HierarchyModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.list_projects = (req, res ) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
  
    if(req.query.productId){

      req.query={...req.query,productid: mongoose.Types.ObjectId(req.query.productId)}
    }
    if(req.jwt.username && req.query.xI==undefined){

        req.query={...req.query,introducer: req.jwt.username}
      }else{
        req.query={...req.query,introducer: req.query.xI}
      }
    
   
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    HierarchyModel.list(limit, page,req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
           
            res.status(400).json( {err:err} );
        });
};
  exports.listAll = (req, res ) => {
    req.query={...req.query,forced_productid: req.jwt.productId.map(pid => new ObjectId(pid))}
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
    HierarchyModel.listAll(req.query)
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
    HierarchyModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}

    if(req.jwt.productId){
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
    HierarchyModel.findById(req.params.hierarchyId,filter)
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
      HierarchyModel.patchHierarchy(req.params.hierarchyId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
    filter['productid']= {"in":req.jwt.productId.map(pid => new ObjectId(pid))};
    
    HierarchyModel.removeById(req.params.hierarchyId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.addNewUser = (req, res) => {
    req.body.createBy="AlifPay" 
    req.body.createAt=funcs.getTime()
    console.log(req.body)
    //res.status(200).send(req.body);
    //return;
    HierarchyModel.addNewUser(req.body)

          .then((result)=>{
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.addNewUser2 = (req, res) => {
    req.body.createBy="AlifPay" 
    req.body.createAt=funcs.getTime()
    console.log(req.body)
    //res.status(200).send(req.body);
    //return;
    HierarchyModel.createHierarchy(req.body)

          .then((result)=>{
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.addNewUserCheck = (req, res) => {
   
    HierarchyModel.addNewUserCheck(req.body)

          .then((result)=>{
              res.status(200).json({data:result});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  exports.placement = (req, res) => {
   
    HierarchyModel.placement(req.body)

          .then((result)=>{
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
  
  exports.list_chart = (req, res) => {
    let username=req.jwt.username
    
    if(req.query.xI!=undefined){

        username=req.query.xI
    }
    let key=username+"_chart_"+req.query.productId??"";
    let cVal=myCache.get(key)
    if(cVal){
        console.log("Cached+"+key)
        res.status(200).send(cVal);
    }else{
    HierarchyModel.buildHierarchy(username,req.query.productId)

          .then((result)=>{
            myCache.set( key, result, 60*30 )
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }
  };
  exports.list_chart2 = (req, res) => {
    let username=req.jwt.username
    
    if(req.query.xI!=undefined){

        username=req.query.xI
    }
    let key=username+"_chart2_"+req.query.productId??"";
    let cVal=myCache.get(key)
    if(cVal){
        console.log("Cached+"+key)
        res.status(200).send(cVal);
    }else{
    HierarchyModel.buildHierarchy2(username,req.query.productId)

          .then((result)=>{
            myCache.set( key, result, 60*30 )
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }
  };
  exports.list_level = (req, res) => {

    let username=req.jwt.username
   
    if(req.query.xI!=undefined){

        username=req.query.xI
    }
    let key=username+"_level_"+req.query.productId??"";
    let cVal=myCache.get(key)
    if(cVal){
        console.log("Cached+"+key)
        res.status(200).send(cVal);
    }else{
        HierarchyModel.getUsersIntroducedBy2(username,req.query.productId)

          .then((result)=>{
            myCache.set( key, result, 60*30 )
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }
  };
  exports.list_level2 = (req, res) => {

    let username=req.jwt.username
   
    if(req.query.xI!=undefined){

        username=req.query.xI
    }
    let key=username+"_level2_"+req.query.productId??"";
    let cVal=myCache.get(key)
    if(cVal){
        console.log("Cached+"+key)
        res.status(200).send(cVal);
    }else{
        HierarchyModel.getUsersIntroducedBy(username,req.query.productId)

          .then((result)=>{
            myCache.set( key, result, 60*30 )
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }
  };
  exports.list_level3 = (req, res) => {

    let username=req.jwt.username
   
    if(req.query.xI!=undefined){

        username=req.query.xI
    }
    let key=username+"_level3_"+req.query.productId??"";
    let cVal=myCache.get(key)
    if(cVal){
        console.log("Cached_"+key)
        res.status(200).send(cVal);
    }else{
        HierarchyModel.getUsersIntroducedBy3(username,req.query.productId)

          .then((result)=>{
            myCache.set( key, result, 60*30 )
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
        }
  };
  
  exports.addNewUser3 = (req, res) => {
    req.body.createBy="AlifPay" 
    req.body.createAt=funcs.getTime()
    console.log(req.body)
    //res.status(200).send(req.body);
    //return;
    //root,upline,productId,amount,rewards=[],limit=10
    HierarchyModel.updatePlacements("afia","cjtan","66e665de966efc2edaa97cf0","L")

          .then((result)=>{
              res.status(200).send(result);
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
    