const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const UF = require('../../lib/fileUpload');
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const productblogSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			active : { type:Boolean,required:true,default:false},
			rank : { type: Number,required:true,default:0},
			title : { type: String,required:true,default:''},
			details : { type: String},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			categoryid : { type: String},
			country : { type: String},
			photo : { type: String}
});

productblogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productblogSchema.set('toJSON', {
    virtuals: true
});

productblogSchema.findById = function (cb) {
    return this.model('Productblog').find({id: this.id}, cb);
};

const Productblog = mongoose.model('Productblog', productblogSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Productblog.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProductblog = (productblogData) => {
    return new Promise((resolve, reject) => {
    
    const productblog = new Productblog(productblogData);
    productblog.save(function (err, saved) {
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
    
    

    if(query.active!=null){
        _query['active'] = query.active 
    }
            

    if(query.rank!=null ){
      if(!isNaN(query.rank)){
        let rank_= queryBuilder_number(query,'rank');
        _query={..._query,...rank_}
     }
    }
    if(query.rank_array){
        let rank_a= queryBuilder_range_array(query,'rank',"number");
        _query={..._query,...rank_a}
    }



    if(query.title){
        let title_= queryBuilder_string(query,'title');
        _query={..._query,...title_}
    }

    
      if(query.productid){
  
          query.productid = new ObjectId( query.productid);
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
        Productblog.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, productblog) {
                if (err) {
                    reject(err);
                } else {
                    Productblog.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: productblog , count: total ,perpage:perPage,page:page };
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
    Productblog.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, productblog) {
                if (err) {
                    reject(err);
                } else {
                resolve(productblog);
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
        Productblog.find(_query)
            .exec(function (err, productblog) {
                if (err) {
                    reject(err);
                } else {
                    resolve(productblog);
                }
            })
    });
};
exports.patchProductblog = (id, productblogData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Productblog.findOne(queries, function (err, productblog) {
            if (err) reject(err);
            for (let i in productblogData) {
                productblog[i] = productblogData[i];
            }
            productblog.save(function (err, updatedProductblog) {
                if (err) return reject(err);
                resolve(updatedProductblog);
            });
        });
    })

};

exports.removeById = (productblogId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:productblogId}
    return new Promise((resolve, reject) => {
        Productblog.findOneAndDelete(queries, (err) => {
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
            Productblog.findById(rowId, function (err, productblog) {
                if (err) reject(err);
                productblog[colName] =uploadedFileName;
                productblog.save(function (err, updatedData) {
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
                UF.uploadFiles(req,rowId,"productblog").then((va)=>{
                    Productblog.findById(rowId, function (err, productblog) {
                        if (err) reject(err);
                        productblog[colName] =va;
                        productblog.save(function (err, updatedData) {
                            if (err) return reject(err);
                            resolve(va)
                        });
                    });
                }).catch((err)=>{
               
                reject(err);
                });
            
               
                
            });
            };

    