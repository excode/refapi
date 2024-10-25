const HierarchyModel = require('./hierarchy/hierarchy.model');
const mongoose = require('../common/services/mongoose.service').mongoose;
exports.test=() =>{
    return new Promise(async(resolve, reject) => {
        const productID= mongoose.Types.ObjectId( "66e665de966efc2edaa97cf0")
    let myrewards=[]
    let rewards = await HierarchyModel.rewardUplines("alwinsuccess","safinatee",productID,2,myrewards,10);
    resolve(rewards);
    });

};

exports.test().then(data=>{
    console.log(data)
});