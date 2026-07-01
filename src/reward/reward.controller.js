const RewardModel = require('./reward.model');
//var ObjectId = require('mongodb').ObjectID;
const mongoose = require('../../common/services/mongoose.service').mongoose;
const funcs =  require("../../common/functions/funcs");
const  env  = process.env;
const NodeCache = require("node-cache");
  exports.insert = (req, res) => {
            req.body.createBy=req.jwt.email  
        req.body.createAt=funcs.getTime()
        req.body.id=req.jwt.id
        
            RewardModel.createReward(req.body)
                  .then((result) => {
                          
                    res.status(200).send({id: result.id});
 
                  }).catch((err)=>{
                     
                      res.status(400).json( {err:err} );
                  });
             
     
  };

  exports.findByCreatedAt = (req, res) => {
    RewardModel.find({ createdAt: req.jwt.email })
        .then(response => {
            res.status(200).send({ length: response.length});
        })
        .catch(err => {
            res.status(400).json({ err: err });
        });
  };

  exports.list = (req, res ) => {
      let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
      let page = 0;
      console.log("OUTSIDE")
      if(req.headers["project_code"]){
        console.log("IN-SIDE")
        let project_code =req.headers["project_code"];
        let products_ids = env["P_"+project_code]
        console.log(products_ids)
        console.log(env)
        console.log(project_code)
        if(products_ids){
            console.log("IN-SIDE 2")
        let array =   JSON.parse(products_ids);
        console.log(array)
        console.log(Array.isArray(array))
        req.query={...req.query,'contactNumber_mode':'equals',  'contactNumber':req.jwt.username, forced_productid: array.map(pid => mongoose.Types.ObjectId(pid))}
        }
      }else{
        req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
      }
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
      RewardModel.list(limit, page,req.query)
          .then((result) => {
              res.status(200).send(result);
          }).catch((err)=>{
             
              res.status(400).json( {err:err} );
          });
  };
  exports.listAll = (req, res ) => {
    req.query={...req.query,forced_productid: req.jwt.productId.map(pid => new mongoose.Types.ObjectId(pid))}
    //req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
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
    RewardModel.listAll(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
exports.listSuggestions = (req, res ) => {
    req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
    // req.query={...req.query,forced_productid: req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))}
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
    RewardModel.listSuggestions(req.query)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err)=>{
            res.status(400).json( {err:err} );
        });
};
  
  exports.getById = (req, res) => {
    let filter ={}
    //filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};

    if(req.jwt.productid){
        filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
    }
    /*
      /*
    IMPORTANT
     
    you can put predefined condition here  based on user and role  
    for example 
    
    filter['organizationId'] = req.JWT.userOrganization

    you can also put condition based on user role
    like 
    if(req.JWT.userType>1) 
    filter['organizationId'] = req.JWT.userOrganization //  I
    }
     */
    RewardModel.findById(req.params.rewardId,filter)
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
      filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
      /*
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
      RewardModel.patchReward(req.params.rewardId, req.body,filter)
          .then((result) => {
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  
  };
  
  exports.removeById = (req, res) => {
    let filter ={}
    filter['productid']= {"in":req.jwt.productId.map(pid => mongoose.Types.ObjectId(pid))};
    /*
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
    RewardModel.removeById(req.params.rewardId,filter)
          .then((result)=>{
              res.status(204).send({});
          }).catch((err)=>{
              res.status(400).json( {err:err} );
          });
  };
   
  

    
exports.rewardSummary = async (req, res) => {
    const cache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });
    try {
        const productIds =['66e665de966efc2edaa97cf0'];          // array
        const email = req.jwt.email;                    // user identifier
        const username = req.jwt.contactNumber;         // sourceContactNumber
        const primaryProductId = productIds[0];         // single product for total/top

            console.log("Product IDs:", productIds);
            console.log("Email:", email);
            console.log("Username:", username);
            console.log("Primary Product ID:", primaryProductId);   
        const cacheKey = `rewardv6_summary_${email}`;

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log("✅ Returning REWARD SUMMARY from cache");
            return res.status(200).send(cachedData);
        }
        const EXCLUDED_USERNAMES = [
  "kalam",
  "afia",
  "alifpay",
"afia2345",
"kalamerwe",
"eesa",
    "alifpay_admin",    
"ahmad1",
  "alifpay_marketing",
  "alifpay_pool","alifpay_mdr"

];

        // Run all aggregations in parallel
        const [top, my, total] = await Promise.all([
            RewardModel.topNSumAmountBySourceContactNumber(primaryProductId, 10,EXCLUDED_USERNAMES),
            RewardModel.sumAmountBySourceContactAndProducts(username, productIds,EXCLUDED_USERNAMES),
            RewardModel.sumAmountByProduct(primaryProductId,EXCLUDED_USERNAMES)
        ]);

        const responseData = {
            top: top || [],
            my: my?.[0] || { sourceContactNumber: username, totalAmount: 0 },
            total: total?.[0] || { productid: primaryProductId, totalAmount: 0 }
        };

        cache.set(cacheKey, responseData);
        console.log("✅ REWARD SUMMARY stored in cache");

        return res.status(200).send(responseData);

    } catch (err) {
        return res.status(400).json({ err });
    }
};