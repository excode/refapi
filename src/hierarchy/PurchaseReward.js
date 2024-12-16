const mongoose = require('../../common/services/mongoose.service').mongoose;
const axios = require('axios');
const funcs = require('../../common/functions/funcs');
const HM = require('./hierarchy.model.js');
const { USER_API_URL, STORE_URL } = process.env;
const RewardModel = require('../../src/reward/reward.model.js');
exports.rewardMerchantPurchase2 = async (
    storeCreatedBy,
    merchantUsername,
    customer,
    _productId,
    transactionId,
    storeName
) => {
  const productId= mongoose.Types.ObjectId( _productId)
    try {
        // Step 1: Send Immediate Response
       

        // Step 2: Fetch Details
        const [introUser, transactionDetails] = await Promise.all([
            fetchUserDetails(storeCreatedBy),
            fetchTransactionDetails(transactionId)
        ]);
        console.log("***************")
        console.log(introUser)
        console.log(transactionDetails)
        console.log("***************")
        // Step 3: Calculate Rewards
        const rewardsData =await calculateRewards({
            introUser,
            transactionDetails,
            productId,
            merchantUsername,
            customer,
            storeName
        });

        // Step 4: Save Rewards
        await saveRewards(rewardsData);
        await postTransactionComplete(transactionId);

        console.log('Rewards processed successfully.');
    } catch (err) {
     // console.log(err)
      //  console.error(err.message || err);
      throw new Error (err.message || 'An error occurred.');
    }
};

async function fetchUserDetails(storeCreatedBy) {
    const url = `${USER_API_URL}/accounts/fp/${storeCreatedBy}`;
    console.log(url)
    const { data } = await axios.get(url);
    if (!data.username) throw new Error('FP-undefined');
    return data.username;
}

async function fetchTransactionDetails(transactionId) {
    const url = `${STORE_URL}/transactions/taskcheck/${transactionId}`;
    console.log(url)
     await axios.get(url);
    if (!data) throw new Error('TRX-undefined');
    return data;
}
async function postTransactionComplete(transactionId) {
  const url = `${STORE_URL}/transactions/taskcompleted/${transactionId}`;
  console.log(url)
  const { data } = await axios.get(url);
 // if (!data) throw new Error('TRX-undefined');
  //return data;
}

async function calculateRewards(params) {
  const {
    introUser,
    transactionDetails,
    productId,
    merchantUsername,
    customer,
    storeName
  }=params;
   
        const company_username="alifpay";
        const pool_username="alifpay_pool";
        const marketing_username="alifpay_marketing";
        const mdr_username="alifpay_mdr";
       
        const main_amount = transactionDetails.amount;
        const amount = transactionDetails.sharingValue;
        let mdr=main_amount*.01;
        mdr=mdr.toFixed(4);
        mdr=Number(mdr);
        let new_amount=amount-mdr;
    
        let community_reward=new_amount*.75;
        let company_reward = new_amount*.25;
        let transactionId = transactionDetails.id
        let rewards=[];
        try {
        
        
         console.log("root")
          const introquery={ contactNumber: introUser,productid:productId }
          const customerquery={ contactNumber: customer,productid:productId ,"infoData.category": { $in: ["FP", "FC"] }};
          //const merchantquery={ contactNumber: merchat_username,productid:productId }
          //console.log(introquery)
          const parentUser = await HM.findOne(introquery);
          console.log("root1")
          const customerUser = await HM.findOne(customerquery);
          console.log("root2")
          console.log(introquery)
          console.log("root")
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
            sourceContactNumber : merchantUsername,
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
            sourceContactNumber : merchantUsername,
            particular : "Cashback Reward:"+storeName,
            type : "3"
    
         };
        rewards.push(company_rewards);
    
    
          if (!parentUser || parentUser["contactNumber"]==="") {    
            console.log(introquery);   
            console.log(parentUser);        
            console.log('Parent user not found');
            throw new Error('Parent user not found')
            //return reject('Parent user not found');
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
                sourceContactNumber : merchantUsername,
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
            sourceContactNumber : merchantUsername,
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
                sourceContactNumber : merchantUsername,
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
                    sourceContactNumber : merchantUsername,
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
                        sourceContactNumber : merchantUsername,
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
                        sourceContactNumber : merchantUsername,
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
            sourceContactNumber : merchantUsername,
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
        sourceContactNumber : merchantUsername,
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
            sourceContactNumber : merchantUsername,
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
                sourceContactNumber : merchantUsername,
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
                    sourceContactNumber : merchantUsername,
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
                    sourceContactNumber : merchantUsername,
                    particular : "Cashback Reward from "+customer,
                    type : "3"
                };
              rewards.push(leftover_upline_reward);
            }
        }
      }
   
  }catch(err){
    //console.log(err)
    throw new Error('Reward-Error');
  }
  return rewards;
}

async function saveRewards(rewards) {
  //console.log(rewards)
 // const data=await RewardModel.InsertMany(rewards);
  return data;
    // Bulk insert rewards or other DB logic
}
 