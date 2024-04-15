const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const rewardSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			level : { type: Number,required:true,default:0},
			amount : { type: Number,required:true,default:0},
			status : { type:Boolean,required:true,default:false},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			redeemProductId : { type: String},
			contactNumber : { type: String,required:true,default:''},
			ref : { type: String,required:true,default:''},
			sourceContactNumber : { type: String,required:true,default:''},
			particular : { type: String,required:true,default:''},
			type : { type: String,required:true,default:''}
});

rewardSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
rewardSchema.set('toJSON', {
    virtuals: true
});

rewardSchema.findById = function (cb) {
    return this.model('Reward').find({id: this.id}, cb);
};

const Reward = mongoose.model('Reward', rewardSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Reward.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createReward = (rewardData) => {
    return new Promise((resolve, reject) => {
    
    const reward = new Reward(rewardData);
    reward.save(function (err, saved) {
        if (err) {
            return reject(err);
        }
        resolve(saved)
    });
    });
};

exports.list = (perPage, page , query ) => {
        var _query={};
        let sortBy='_id'
        let sortDirection=-1
        
    if(query.createBy){
        let createBy_= queryBuilder_string(query,'createBy');
        _query={..._query,...createBy_}
    }


        if(query.createAt){
            let createAt_= queryBuilder_date(query,'createAt');
            _query={..._query,...createAt_}
        }
        if(query.createAt_array){
            let createAt_a= queryBuilder_range_array(query,'createAt',"date");
            _query={..._query,...createAt_a}
        }
    
    

    if(query.updateBy){
        let updateBy_= queryBuilder_string(query,'updateBy');
        _query={..._query,...updateBy_}
    }


        if(query.updateAt){
            let updateAt_= queryBuilder_date(query,'updateAt');
            _query={..._query,...updateAt_}
        }
        if(query.updateAt_array){
            let updateAt_a= queryBuilder_range_array(query,'updateAt',"date");
            _query={..._query,...updateAt_a}
        }
    
    

    if(query.level!=null ){
      if(!isNaN(query.level)){
        let level_= queryBuilder_number(query,'level');
        _query={..._query,...level_}
     }
    }
    if(query.level_array){
        let level_a= queryBuilder_range_array(query,'level',"number");
        _query={..._query,...level_a}
    }



    if(query.amount!=null ){
      if(!isNaN(query.amount)){
        let amount_= queryBuilder_number(query,'amount');
        _query={..._query,...amount_}
     }
    }
    if(query.amount_array){
        let amount_a= queryBuilder_range_array(query,'amount',"number");
        _query={..._query,...amount_a}
    }



    if(query.status!=null){
        _query['status'] = query.status 
    }
            

   
    if(query.forced_productid){

     
        let productID_= {productid:{$in:query.forced_productid}}
          _query={..._query,...productID_}
      
         //console.log(productID_)
      }
      if(query.productid){
    
          query.productid = new ObjectId( query.productid);
          let productid_ = {productid:query.productid}
            _query = { ..._query, ...productid_ };
      }


    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.ref){
        let ref_= queryBuilder_string(query,'ref');
        _query={..._query,...ref_}
    }


    if(query.sourceContactNumber){
        let sourceContactNumber_= queryBuilder_string(query,'sourceContactNumber');
        _query={..._query,...sourceContactNumber_}
    }


    if(query.particular){
        let particular_= queryBuilder_string(query,'particular');
        _query={..._query,...particular_}
    }


    if(query.type){
        let type_= queryBuilder_string(query,'type');
        _query={..._query,...type_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Reward.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, reward) {
                if (err) {
                    reject(err);
                } else {
                    Reward.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: reward , count: total ,perpage:perPage,page:page };
                        resolve(promises);
                    }).catch((err2)=>{
                        reject(err2);
                    })
                }
            })
    });
};
exports.listAll = ( query={} ) => {
    var _query={...query};
    let sortBy='_id'
    let sortDirection=-1
    let max_limit = 300;
    if(query.sortBy){
        sortBy = query.sortBy;
    }
    if(query.sortDirection){
        sortDirection = query.sortDirection;
    }
    var sortBoj={[sortBy]:sortDirection};
    return new Promise((resolve, reject) => {
    Reward.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, reward) {
                if (err) {
                    reject(err);
                } else {
                resolve(reward);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"productid": {$regex: search, $options: "i"}},
				{"contactNumber": {$regex: search, $options: "i"}},
				{"ref": {$regex: search, $options: "i"}},
				{"sourceContactNumber": {$regex: search, $options: "i"}},
				{"particular": {$regex: search, $options: "i"}},
				{"type": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Reward.find(_query)
            .exec(function (err, reward) {
                if (err) {
                    reject(err);
                } else {
                    resolve(reward);
                }
            })
    });
};
exports.patchReward = (id, rewardData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Reward.findOne(queries, function (err, reward) {
            if (err) reject(err);
            for (let i in rewardData) {
                reward[i] = rewardData[i];
            }
            reward.save(function (err, updatedReward) {
                if (err) return reject(err);
                resolve(updatedReward);
            });
        });
    })

};

exports.removeById = (rewardId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:rewardId}
    return new Promise((resolve, reject) => {
        Reward.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    