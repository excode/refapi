const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const funcs =  require("../../common/functions/funcs");
const RewardModel = require('../../src/reward/reward.model.js');
const axios = require('axios');
const env=process.env;
const HM = require('./hierarchy.model.js');
exports.rewardMerchantPurchase2=(storeCreatedBy,merchat_username,customer,_productId,transactionId,storeName) =>{
    const productId= mongoose.Types.ObjectId( _productId)
    let intro_username="";
    return new Promise((resolve, reject) => {
      res.status(200).send('Request received. Processing in the background.');
      (async () => {
    try {
        
        const check_url=env.USER_API_URL+"/accounts/fp/"+storeCreatedBy;
        const response = await axios.get(check_url);
        if(response.status!=200 || response.data.username==undefined){
            return reject("FP-undefined");
     
        }
        intro_username=response.data.username;
       
       // const check_url=env.USER_API_URL+"/accounts/fp/"+storeCreatedBy;
         const check_url_trx=env.STORE_URL+"/transactions/taskcheck/"+transactionId;
         const response2 = await axios.get(check_url_trx);

         if(response2.status!=200 || response2.data==undefined){
            return reject("TRX-undefined");
            
        }
       
      
    const company_username="alifpay";
    const pool_username="alifpay_pool";
    const marketing_username="alifpay_marketing";
    const mdr_username="alifpay_mdr";
    /*
"amount": 10,
  "sharingValue": 0.5,
    */
    const main_amount = response2.data.amount;
    const amount = response2.data.sharingValue;
    let mdr=main_amount*.01;
    mdr=mdr.toFixed(4);
    mdr=Number(mdr);
    let new_amount=amount-mdr;

    let community_reward=new_amount*.75;
    let company_reward = new_amount*.25;

    let rewards=[];
    try {
    

    //console.log(root)
      const introquery={ contactNumber: intro_username,productid:productId }
      const customerquery={ contactNumber: customer,productid:productId ,"infoData.category": { $in: ["FP", "FC"] }};
      //const merchantquery={ contactNumber: merchat_username,productid:productId }
      //console.log(introquery)
      const parentUser = await HM.findOne(introquery);
      const customerUser = await HM.findOne(customerquery);
      console.log(introquery)
      const time = funcs.getTime();
      const mdr_rewards={
            
        createBy : 'ALIF-PAY',
        createAt : time,
        level :0 ,
        amount : mdr, //20% of community_reward
        status : 0,
        productid : productId,
        contactNumber :  mdr_username,
        ref : transactionId,
        sourceContactNumber : merchat_username,
        particular : "Cashback Reward:"+storeName,
        type : "3"

     };
    rewards.push(mdr_rewards);
      const company_rewards={
            
        createBy : 'ALIF-PAY',
        createAt : time,
        level :0 ,
        amount : company_reward, //20% of community_reward
        status : 0,
        productid : productId,
        contactNumber :  company_username,
        ref : transactionId,
        sourceContactNumber : merchat_username,
        particular : "Cashback Reward:"+storeName,
        type : "3"

     };
    rewards.push(company_rewards);


      if (!parentUser || parentUser["contactNumber"]==="") {    
        console.log(introquery);   
        console.log(parentUser);        
        console.log('Parent user not found');
        return reject('Parent user not found');
      }else{
       
       if(customerUser){
         let amount_10 =community_reward*.1;
         let amount_20 =community_reward*.2;
         amount_20=amount_20.toFixed(4);
         amount_10=amount_10.toFixed(4);
         amount_10=Number(amount_10);
         amount_20=Number(amount_20);
        const merchant_introducer_reward={
            
            createBy : 'ALIF-PAY',
            createAt : time,
            level :0 ,
            amount : amount_10, //20% of community_reward
            status : 0,
            productid : productId,
            contactNumber :  parentUser["contactNumber"],
            ref : transactionId,
            sourceContactNumber : merchat_username,
            particular : "Cashback Reward:"+storeName,
            type : "3"
    
         };
    rewards.push(merchant_introducer_reward);
    const pool_reward={
            
        createBy : 'ALIF-PAY',
        createAt : time,
        level :0 ,
        amount : amount_10, //20% of community_reward
        status : 0,
        productid : productId,
        contactNumber :  pool_username,
        ref : transactionId,
        sourceContactNumber : merchat_username,
        particular : "Cashback Reward:"+storeName,
        type : "3"

     };
        rewards.push(pool_reward);
        const marketing_reward={  
            createBy : 'ALIF-PAY',
            createAt : time,
            level :0 ,
            amount : amount_10, //20% of community_reward
            status : 0,
            productid : productId,
            contactNumber :  marketing_username,
            ref : transactionId,
            sourceContactNumber : merchat_username,
            particular : "Cashback Reward:"+storeName,
            type : "3"
        };
        rewards.push(marketing_reward);
          
        const customer_reward={
            
                createBy : 'ALIF-PAY',
                createAt : time,
                level :0 ,
                amount : amount_20, //20% of community_reward
                status : 0,
                productid : productId,
                contactNumber :  customer,
                ref : transactionId,
                sourceContactNumber : merchat_username,
                particular : "Cashback Reward:"+storeName,
                type : "3"
        
            };
        rewards.push(customer_reward);
        
        let parent = customerUser["introducer"];
        const MAX_LEVEL=5;
        for(var i=0;i<MAX_LEVEL;i++){
           
            let query={ contactNumber: parent,productid:productId } ;
            let introCusUser = await HM.findOne(query);
            if(introCusUser){
                let into_upline_reward={
                    createBy : 'ALIF-PAY',
                    createAt : time,
                    level :i+1 ,
                    amount : amount_10, //20% of community_reward
                    status : 0,
                    productid : productId,
                    contactNumber :  introCusUser["contactNumber"],
                    ref :transactionId,
                    sourceContactNumber : merchat_username,
                    particular : "Cashback Reward from "+customer,
                    type : "3"
                };
              rewards.push(into_upline_reward);
              parent = introCusUser["introducer"];
            }else{
                let remain_level= MAX_LEVEL-i;
                let leftover_upline_reward={
                    createBy : 'ALIF-PAY',
                    createAt : time,
                    level :i+1 ,
                    amount : amount_10*remain_level, //20% of community_reward
                    status : 0,
                    productid : productId,
                    contactNumber :  marketing_username,
                    ref : transactionId,
                    sourceContactNumber : merchat_username,
                    particular : "Cashback Reward from "+customer,
                    type : "3"
                };
              rewards.push(leftover_upline_reward);
            }


        }
        
        
    }else{
     // CUSTOMER IS NOT A FINTECH/COMMUNITY PATNER 
      
     
    let amount_20 =community_reward*.2;
    amount_20=amount_20.toFixed(4);
    amount_20=Number(amount_20)
    const merchant_introducer_reward={
        
        createBy : 'ALIF-PAY',
        createAt : time,
        level :0 ,
        amount : amount_20, //20% of community_reward
        status : 0,
        productid : productId,
        contactNumber :  parentUser["contactNumber"],
        ref : transactionId,
        sourceContactNumber : merchat_username,
        particular : "Cashback Reward:"+storeName,
        type : "3"

     };
rewards.push(merchant_introducer_reward);
const pool_reward={
        
    createBy : 'ALIF-PAY',
    createAt : time,
    level :0 ,
    amount : amount_20, //20% of community_reward
    status : 0,
    productid : productId,
    contactNumber :  pool_username,
    ref : transactionId,
    sourceContactNumber : merchat_username,
    particular : "Cashback Reward:"+storeName,
    type : "3"

 };
    rewards.push(pool_reward);
    const marketing_reward={  
        createBy : 'ALIF-PAY',
        createAt : time,
        level :0 ,
        amount : amount_20, //20% of community_reward
        status : 0,
        productid : productId,
        contactNumber :  marketing_username,
        ref : transactionId,
        sourceContactNumber : merchat_username,
        particular : "Cashback Reward:"+storeName,
        type : "3"
    };
    rewards.push(marketing_reward);
      
    const customer_reward={
        
            createBy : 'ALIF-PAY',
            createAt : time,
            level :0 ,
            amount : amount_20, //20% of community_reward
            status : 0,
            productid : productId,
            contactNumber :  customer,
            ref : transactionId,
            sourceContactNumber : merchat_username,
            particular : "Cashback Reward:"+storeName,
            type : "3"
    
        };
    rewards.push(customer_reward);
    
    let parent = parentUser["introducer"];

       
        let query={ contactNumber: parent,productid:productId } ;
        let introCusUser = await HM.findOne(query);
        if(introCusUser){
            let into_upline_reward={
                createBy : 'ALIF-PAY',
                createAt : time,
                level :1 ,
                amount : amount_20, //20% of community_reward
                status : 0,
                productid : productId,
                contactNumber :  introCusUser["contactNumber"],
                ref : transactionId,
                sourceContactNumber : merchat_username,
                particular : "Cashback Reward from "+customer,
                type : "3"
            };
          rewards.push(into_upline_reward);
          
        }else{
          
            let leftover_upline_reward={
                createBy : 'ALIF-PAY',
                createAt : time,
                level :1 ,
                amount : amount_20, //20% of community_reward
                status : 0,
                productid : productId,
                contactNumber :  marketing_username,
                ref : transactionId,
                sourceContactNumber : merchat_username,
                particular : "Cashback Reward from "+customer,
                type : "3"
            };
          rewards.push(leftover_upline_reward);
        }
    }
}
   
     const done_url_trx=env.STORE_URL+"/transactions/taskcompleted/"+transactionId;
     const response3 = await axios.get(done_url_trx);

         if(response3.status==204){
            await RewardModel.InsertMany(rewards);
            //console.log(rewards)
            return resolve(rewards);
            
        }else{
            return reject("failed 1");
        }

    //return rewards;
    } catch (error) {
        console.error( error);
        return reject("failed 2");
      }
    
    } catch (error) {
        return reject("Error fetching data");
       
      }
    })();
    });
}