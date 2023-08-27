const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const hierarchySchema = new Schema({
    	updateBy : { type: String},
			updateAt : { type: Date},
			createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			walletbalance : { type: Number,required:true,default:0},
			rewardbalance : { type: Number,required:true,default:0},
			distributor : { type:Boolean,required:true,default:false},
			contactNumber : { type: String,required:true,default:''},
			productid : { type: String},
			introducer : { type: String,required:true,default:''}
});

hierarchySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
hierarchySchema.set('toJSON', {
    virtuals: true
});

hierarchySchema.findById = function (cb) {
    return this.model('Hierarchy').find({id: this.id}, cb);
};

const Hierarchy = mongoose.model('Hierarchy', hierarchySchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Hierarchy.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createHierarchy = (hierarchyData) => {
    return new Promise((resolve, reject) => {
    
    const hierarchy = new Hierarchy(hierarchyData);
    hierarchy.save(function (err, saved) {
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
    
    

    if(query.walletbalance!=null ){
      if(!isNaN(query.walletbalance)){
        let walletbalance_= queryBuilder_number(query,'walletbalance');
        _query={..._query,...walletbalance_}
     }
    }
    if(query.walletbalance_array){
        let walletbalance_a= queryBuilder_range_array(query,'walletbalance',"number");
        _query={..._query,...walletbalance_a}
    }



    if(query.rewardbalance!=null ){
      if(!isNaN(query.rewardbalance)){
        let rewardbalance_= queryBuilder_number(query,'rewardbalance');
        _query={..._query,...rewardbalance_}
     }
    }
    if(query.rewardbalance_array){
        let rewardbalance_a= queryBuilder_range_array(query,'rewardbalance',"number");
        _query={..._query,...rewardbalance_a}
    }



    if(query.distributor!=null){
        _query['distributor'] = query.distributor 
    }
            

    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.introducer){
        let introducer_= queryBuilder_string(query,'introducer');
        _query={..._query,...introducer_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Hierarchy.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                    Hierarchy.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: hierarchy , count: total ,perpage:perPage,page:page };
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
    Hierarchy.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                resolve(hierarchy);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"contactNumber": {$regex: search, $options: "i"}},
				{"introducer": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Hierarchy.find(_query)
            .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hierarchy);
                }
            })
    });
};
exports.patchHierarchy = (id, hierarchyData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Hierarchy.findOne(queries, function (err, hierarchy) {
            if (err) reject(err);
            for (let i in hierarchyData) {
                hierarchy[i] = hierarchyData[i];
            }
            hierarchy.save(function (err, updatedHierarchy) {
                if (err) return reject(err);
                resolve(updatedHierarchy);
            });
        });
    })

};

exports.removeById = (hierarchyId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:hierarchyId}
    return new Promise((resolve, reject) => {
        Hierarchy.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    