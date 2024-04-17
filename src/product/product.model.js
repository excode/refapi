const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const funcs =  require("../../common/functions/funcs");
const UF = require('../../lib/fileUpload');
//var ObjectId = require('mongodb').ObjectID;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const productSchema = new Schema({
    	updateAt : { type: Date},
			createBy : { type: String},
			createAt : { type: Date},
			updateBy : { type: String},
			serviceType : { type: Number,required:true,default:0},
			level : { type: Number,required:true,default:0},
			price : { type: Number,required:true,default:0},
			qty : { type: Number,required:true,default:0},
			rewardCondition : { type: Number,required:true,default:0},
			active : { type:Boolean,required:true,default:false},
			totalVotes : { type: Number,required:true,default:0},
			totalRating : { type: Number,required:true,default:0},
			config : funcs.productConfig(),
			mypaId : { type: String,default:''},
			productname : { type: String,required:true,default:''},
			categoryid : {type: Schema.Types.ObjectId, ref: 'Categories'},
			subCatid : { type: String,default:''},
			country : { type: String,required:true,default:''},
			description : { type: String},
			currency : { type: String,required:true,default:''},
			unitName : { type: String,default:''},
			website : { type: String,default:''},
			facebook : { type: String,default:''},
			youtube : { type: String,default:''},
			levelConfig :{type:[funcs.levelConfig()],default:funcs.levelConfigData()},
			photo : { type: String}
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set('toJSON', {
    virtuals: true
});

productSchema.findById = function (cb) {
    return this.model('Product').find({id: this.id}, cb);
};

const Product = mongoose.model('Product', productSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Product.findOne(queries)
       .populate({path:'categoryid',select:'id category'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findOne = (query) => {
    return Product.findOne(query)
        .populate({path:'categoryid',select:'id category'})
        .then((result) => {
            if (result) {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
            }
            return result;
        });
};

exports.find = (query) => {
    return Product.find(query)
        .populate({path:'categoryid',select:'id category'})
        .then((results) => {
            return results.map(result => {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
                return result;
            });
        });
};
exports.createProduct = (productData) => {
    return new Promise((resolve, reject) => {
    
    const product = new Product(productData);
    product.save(function (err, saved) {
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
    
    

    if(query.updateBy){
        let updateBy_= queryBuilder_string(query,'updateBy');
        _query={..._query,...updateBy_}
    }


    if(query.serviceType!=null ){
      if(!isNaN(query.serviceType)){
        let serviceType_= queryBuilder_number(query,'serviceType');
        _query={..._query,...serviceType_}
     }
    }
    if(query.serviceType_array){
        let serviceType_a= queryBuilder_range_array(query,'serviceType',"number");
        _query={..._query,...serviceType_a}
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



    if(query.price!=null ){
      if(!isNaN(query.price)){
        let price_= queryBuilder_number(query,'price');
        _query={..._query,...price_}
     }
    }
    if(query.price_array){
        let price_a= queryBuilder_range_array(query,'price',"number");
        _query={..._query,...price_a}
    }



    if(query.qty!=null ){
      if(!isNaN(query.qty)){
        let qty_= queryBuilder_number(query,'qty');
        _query={..._query,...qty_}
     }
    }
    if(query.qty_array){
        let qty_a= queryBuilder_range_array(query,'qty',"number");
        _query={..._query,...qty_a}
    }



    if(query.rewardCondition!=null ){
      if(!isNaN(query.rewardCondition)){
        let rewardCondition_= queryBuilder_number(query,'rewardCondition');
        _query={..._query,...rewardCondition_}
     }
    }
    if(query.rewardCondition_array){
        let rewardCondition_a= queryBuilder_range_array(query,'rewardCondition',"number");
        _query={..._query,...rewardCondition_a}
    }



    if(query.active!=null){
        _query['active'] = query.active 
    }
            

    if(query.totalVotes!=null ){
      if(!isNaN(query.totalVotes)){
        let totalVotes_= queryBuilder_number(query,'totalVotes');
        _query={..._query,...totalVotes_}
     }
    }
    if(query.totalVotes_array){
        let totalVotes_a= queryBuilder_range_array(query,'totalVotes',"number");
        _query={..._query,...totalVotes_a}
    }



    if(query.totalRating!=null ){
      if(!isNaN(query.totalRating)){
        let totalRating_= queryBuilder_number(query,'totalRating');
        _query={..._query,...totalRating_}
     }
    }
    if(query.totalRating_array){
        let totalRating_a= queryBuilder_range_array(query,'totalRating',"number");
        _query={..._query,...totalRating_a}
    }



    if(query.config){
        let config_= queryBuilder_string(query,'config');
        _query={..._query,...config_}
    }


    if(query.mypaId){
        let mypaId_= queryBuilder_string(query,'mypaId');
        _query={..._query,...mypaId_}
    }


    if(query.productname){
        let productname_= queryBuilder_string(query,'productname');
        _query={..._query,...productname_}
    }


    if(query.subCatid){
        let subCatid_= queryBuilder_string(query,'subCatid');
        _query={..._query,...subCatid_}
    }


    if(query.country){
        let country_= queryBuilder_string(query,'country');
        _query={..._query,...country_}
    }


    if(query.currency){
        let currency_= queryBuilder_string(query,'currency');
        _query={..._query,...currency_}
    }


    if(query.unitName){
        let unitName_= queryBuilder_string(query,'unitName');
        _query={..._query,...unitName_}
    }


    if(query.website){
        let website_= queryBuilder_string(query,'website');
        _query={..._query,...website_}
    }


    if(query.facebook){
        let facebook_= queryBuilder_string(query,'facebook');
        _query={..._query,...facebook_}
    }


    if(query.youtube){
        let youtube_= queryBuilder_string(query,'youtube');
        _query={..._query,...youtube_}
    }


    if(query.levelConfig){
        let levelConfig_= queryBuilder_string(query,'levelConfig');
        _query={..._query,...levelConfig_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Product.find(_query)
            .populate({path:'categoryid',select:'id category'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, product) {
                if (err) {
                    reject(err);
                } else {
                    Product.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: product , count: total ,perpage:perPage,page:page };
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
    Product.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, product) {
                if (err) {
                    reject(err);
                } else {
                resolve(product);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"config": {$regex: search, $options: "i"}},
				{"mypaId": {$regex: search, $options: "i"}},
				{"productname": {$regex: search, $options: "i"}},
				{"subCatid": {$regex: search, $options: "i"}},
				{"country": {$regex: search, $options: "i"}},
				{"currency": {$regex: search, $options: "i"}},
				{"unitName": {$regex: search, $options: "i"}},
				{"website": {$regex: search, $options: "i"}},
				{"facebook": {$regex: search, $options: "i"}},
				{"youtube": {$regex: search, $options: "i"}},
				{"levelConfig": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Product.find(_query)
            .exec(function (err, product) {
                if (err) {
                    reject(err);
                } else {
                    resolve(product);
                }
            })
    });
};
exports.patchProduct = (id, productData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Product.findOne(queries, function (err, product) {
            if (err) reject(err);
            for (let i in productData) {
                product[i] = productData[i];
            }
            product.save(function (err, updatedProduct) {
                if (err) return reject(err);
                resolve(updatedProduct);
            });
        });
    })

};

exports.removeById = (productId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:productId}
    return new Promise((resolve, reject) => {
        Product.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};


    exports.uploadFile = (req) => {
        return new Promise(async(resolve, reject) => {
            let colName = req.params.columnName
           
            let rowId = req.params.rowId
            //let uploadedFileName =req.file.filename;
            UF.uploadFiles(req,rowId,"product").then((va)=>{
                Product.findById(rowId, function (err, product) {
                    if (err) reject(err);
                    product[colName] =va;
                    product.save(function (err, updatedData) {
                        if (err) return reject(err);
                        resolve(va)
                    });
                });
            }).catch((err)=>{
           
            reject(err);
            });
        
           
            
        });
        };
        

    
        exports.listIds = ( createBy ) => {
            var _query={createBy:createBy};
            let sortBy='_id'
            let sortDirection=-1
            let max_limit = 10;
            
            var sortBoj={[sortBy]:sortDirection};
            return new Promise((resolve, reject) => {
            Product.find(_query,{_id:1})
                .limit(max_limit) 
                .sort(sortBoj)
                .exec(function (err, product) {
                        if (err) {
                            reject(err);
                        } else {
                        let ids=[];
                        product.forEach(element => {
                            let id_=element.id
                            ids.push(id_)
                        });
                        resolve(ids);
                        }
                    })
            });
        };