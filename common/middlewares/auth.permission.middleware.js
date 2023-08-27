const UserModel= require('../../src/users/users.model');
const funcs =  require("../../common/functions/funcs");
crypto = require('crypto');

exports.minimumPermissionLevelRequired = (required_permission_level) => {
   
    return (req, res, next) => {
        return next();
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

exports.userExists= ()=>{
     
    return async (req,res,next)=> {
          req.body.email = req.body.email.trim();
          const key=req.body.email;
       
          var  user=await  UserModel.findByContactNumber(key,3);
          
        console.log(user);
        if(user==null){
            
            req.body.joinDate=funcs.getNowUTC();
            return next();
        }else{
            console.log("ALREADY HAVE");
          
            return res.status(401).send({"error":"user_exists"});
            
        
         }

      
    };
};
