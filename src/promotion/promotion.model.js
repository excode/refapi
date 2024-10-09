const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const UF = require('../../lib/fileUpload');
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const promotionSchema = new Schema({
    	updateBy : { type: String},
			createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateAt : { type: Date},
			title : { type: String,required:true,default:''},
			discount : { type: Number,required:true,default:0,max:1e+70},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			validFrom : { type: Date,required:true},
			validTill : { type: Date,required:true},
			active : { type:Boolean,required:true,default:false},
			photo : { type: String},
            isPromocode : { type: Boolean,required:false,default:false},
            promocode : { type: String,required:false,default:""}
});

promotionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
promotionSchema.set('toJSON', {
    virtuals: true
});

promotionSchema.findById = function (cb) {
    return this.model('Promotion').find({id: this.id}, cb);
};

const Promotion = mongoose.model('Promotion', promotionSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Promotion.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findOne = (query) => {
    return Promotion.findOne(query)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            if (result) {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
                return result;
            }
            return null;
        });
};

exports.find = (query) => {
    return Promotion.find(query)
        .populate({path:'productid',select:'_id productname'})
        .then((results) => {
            return results.map(result => {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
                return result;
            });
        });
};
exports.createPromotion = (promotionData) => {
    return new Promise(async(resolve, reject) => {

        if(promotionData.isPromocode) {
            if(promotionData.promocode.trim().length<4){
                reject("Promocode Code cannot be empty or less than 4 characters");
                return;
            }

            let   promoCodeCHeck =await Promotion.findOne({"promocode":promotionData.promocode,productid:promotionData.productid})
           if(promoCodeCHeck){  
            reject("Promocode Code exists for this product");
            return;
           }
        }
    
    const promotion = new Promotion(promotionData);
    promotion.save(function (err, saved) {
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
    
    

        if(query.updateAt){
            let updateAt_= queryBuilder_date(query,'updateAt');
            _query={..._query,...updateAt_}
        }
        if(query.updateAt_array){
            let updateAt_a= queryBuilder_range_array(query,'updateAt',"date");
            _query={..._query,...updateAt_a}
        }
    
    

    if(query.title){
        let title_= queryBuilder_string(query,'title');
        _query={..._query,...title_}
    }


    if(query.discount!=null ){
      if(!isNaN(query.discount)){
        let discount_= queryBuilder_number(query,'discount');
        _query={..._query,...discount_}
     }
    }
    if(query.discount_array){
        let discount_a= queryBuilder_range_array(query,'discount',"number");
        _query={..._query,...discount_a}
    }



        if(query.validFrom){
            let validFrom_= queryBuilder_date(query,'validFrom');
            _query={..._query,...validFrom_}
        }
        if(query.validFrom_array){
            let validFrom_a= queryBuilder_range_array(query,'validFrom',"date");
            _query={..._query,...validFrom_a}
        }
    
    

        if(query.validTill){
            let validTill_= queryBuilder_date(query,'validTill');
            _query={..._query,...validTill_}
        }
        if(query.validTill_array){
            let validTill_a= queryBuilder_range_array(query,'validTill',"date");
            _query={..._query,...validTill_a}
        }
    
    

    if(query.active!=null){
        _query['active'] = query.active 
    }

    
      if(query.productid){
  
          query.productid = mongoose.Types.ObjectId( query.productid);
          let productid_ = {productid:query.productid}
            _query = { ..._query, ...productid_ };
      }
            
        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Promotion.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, promotion) {
                if (err) {
                    reject(err);
                } else {
                    Promotion.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: promotion , count: total ,perpage:perPage,page:page };
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
    Promotion.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, promotion) {
                if (err) {
                    reject(err);
                } else {
                resolve(promotion);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"title": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Promotion.find(_query)
            .exec(function (err, promotion) {
                if (err) {
                    reject(err);
                } else {
                    resolve(promotion);
                }
            })
    });
};
exports.patchPromotion = (id, promotionData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Promotion.findOne(queries, function (err, promotion) {
            if (err) reject(err);
            for (let i in promotionData) {
                promotion[i] = promotionData[i];
            }
            promotion.save(function (err, updatedPromotion) {
                if (err) return reject(err);
                resolve(updatedPromotion);
            });
        });
    })

};

exports.removeById = (promotionId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:promotionId}
    return new Promise((resolve, reject) => {
        Promotion.findOneAndDelete(queries, (err) => {
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
            Promotion.findById(rowId, function (err, promotion) {
                if (err) reject(err);
                promotion[colName] =uploadedFileName;
                promotion.save(function (err, updatedData) {
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
                UF.uploadFiles(req,rowId,"promotion").then((va)=>{
                    Promotion.findById(rowId, function (err, promotion) {
                        if (err) reject(err);
                        promotion[colName] =va;
                        promotion.save(function (err, updatedData) {
                            if (err) return reject(err);
                            resolve(va)
                        });
                    });
                }).catch((err)=>{
               
                reject(err);
                });
            
               
                
            });
            };