const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const UF = require('../../lib/fileUpload');
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const redeemoptionSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			name : { type: String,required:true,default:''},
			rate : { type: Number,required:true,default:0},
			active : { type:Boolean,required:true,default:false},
			photo : { type: String}
});

redeemoptionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
redeemoptionSchema.set('toJSON', {
    virtuals: true
});

redeemoptionSchema.findById = function (cb) {
    return this.model('Redeemoption').find({id: this.id}, cb);
};

const Redeemoption = mongoose.model('Redeemoption', redeemoptionSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Redeemoption.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createRedeemoption = (redeemoptionData) => {
    return new Promise((resolve, reject) => {
    
    const redeemoption = new Redeemoption(redeemoptionData);
    redeemoption.save(function (err, saved) {
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
    
    

      
          if(query.productid){
      
              query.productid = new ObjectId( query.productid);
              let productid_ = {productid:query.productid}
                _query = { ..._query, ...productid_ };
          }


    if(query.name){
        let name_= queryBuilder_string(query,'name');
        _query={..._query,...name_}
    }


    if(query.rate!=null ){
      if(!isNaN(query.rate)){
        let rate_= queryBuilder_number(query,'rate');
        _query={..._query,...rate_}
     }
    }
    if(query.rate_array){
        let rate_a= queryBuilder_range_array(query,'rate',"number");
        _query={..._query,...rate_a}
    }



    if(query.active!=null){
        _query['active'] = query.active 
    }
            
        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Redeemoption.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, redeemoption) {
                if (err) {
                    reject(err);
                } else {
                    Redeemoption.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: redeemoption , count: total ,perpage:perPage,page:page };
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
    console.log(_query)
    var sortBoj={[sortBy]:sortDirection};
    return new Promise((resolve, reject) => {
    Redeemoption.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, redeemoption) {
                if (err) {
                    reject(err);
                } else {
                resolve(redeemoption);
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
				{"name": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Redeemoption.find(_query)
            .exec(function (err, redeemoption) {
                if (err) {
                    reject(err);
                } else {
                    resolve(redeemoption);
                }
            })
    });
};
exports.patchRedeemoption = (id, redeemoptionData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Redeemoption.findOne(queries, function (err, redeemoption) {
            if (err) reject(err);
            for (let i in redeemoptionData) {
                redeemoption[i] = redeemoptionData[i];
            }
            redeemoption.save(function (err, updatedRedeemoption) {
                if (err) return reject(err);
                resolve(updatedRedeemoption);
            });
        });
    })

};

exports.removeById = (redeemoptionId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:redeemoptionId}
    return new Promise((resolve, reject) => {
        Redeemoption.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};


    exports.uploadFile2 = (req) => {
        return new Promise(async(resolve, reject) => {
            if(req.file.size>1*1024*1024){ // you can chnage the file upload limit
                reject('file_size_too_big');
            }
            let colName = req.params.columnName
            let rowId = req.params.rowId
            let uploadedFileName =req.file.filename;
            Redeemoption.findById(rowId, function (err, redeemoption) {
                if (err) reject(err);
                redeemoption[colName] =uploadedFileName;
                redeemoption.save(function (err, updatedData) {
                    if (err) return reject(err);
                    resolve(uploadedFileName)
                });
            });
        });
        };
        

        exports.uploadFile = (req) => {
            return new Promise(async(resolve, reject) => {
                let colName = req.params.columnName
               
                let rowId = req.params.rowId
                //let uploadedFileName =req.file.filename;
                UF.uploadFiles(req,rowId,"redeemoption").then((va)=>{
                    Redeemoption.findById(rowId, function (err, redeemoption) {
                        if (err) reject(err);
                        redeemoption[colName] =va;
                        redeemoption.save(function (err, updatedData) {
                            if (err) return reject(err);
                            resolve(va)
                        });
                    });
                }).catch((err)=>{
               
                reject(err);
                });
            
               
                
            });
            };