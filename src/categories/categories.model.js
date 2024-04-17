const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const categoriesSchema = new Schema({
    	createAt : { type: Date,required:true},
			updateAt : { type: Date},
			createBy : { type: String,required:true,default:''},
			updateBy : { type: String},
			active : { type:Boolean,required:true,default:false},
			rank : { type: Number,required:true,default:0,max:1e+50},
			category : { type: String,required:true,default:'',maxLength:50}
});

categoriesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
categoriesSchema.set('toJSON', {
    virtuals: true
});

categoriesSchema.findById = function (cb) {
    return this.model('Categories').find({id: this.id}, cb);
};

const Categories = mongoose.model('Categories', categoriesSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Categories.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.findOne = (query) => {
    return Categories.findOne(query)
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
    return Categories.find(query)
        .then((results) => {
            return results.map(result => {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
                return result;
            });
        });
};
exports.createCategories = (categoriesData) => {
    return new Promise((resolve, reject) => {
    
    const categories = new Categories(categoriesData);
    categories.save(function (err, saved) {
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
    
    

    if(query.createBy){
        let createBy_= queryBuilder_string(query,'createBy');
        _query={..._query,...createBy_}
    }


    if(query.updateBy){
        let updateBy_= queryBuilder_string(query,'updateBy');
        _query={..._query,...updateBy_}
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



    if(query.category){
        let category_= queryBuilder_string(query,'category');
        _query={..._query,...category_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Categories.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, categories) {
                if (err) {
                    reject(err);
                } else {
                    Categories.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: categories , count: total ,perpage:perPage,page:page };
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
    Categories.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, categories) {
                if (err) {
                    reject(err);
                } else {
                resolve(categories);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"category": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Categories.find(_query)
            .exec(function (err, categories) {
                if (err) {
                    reject(err);
                } else {
                    resolve(categories);
                }
            })
    });
};
exports.patchCategories = (id, categoriesData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Categories.findOne(queries, function (err, categories) {
            if (err) reject(err);
            for (let i in categoriesData) {
                categories[i] = categoriesData[i];
            }
            categories.save(function (err, updatedCategories) {
                if (err) return reject(err);
                resolve(updatedCategories);
            });
        });
    })

};

exports.removeById = (categoriesId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:categoriesId}
    return new Promise((resolve, reject) => {
        Categories.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    