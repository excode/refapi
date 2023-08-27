const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const productnewSchema = new Schema({
    	updateBy : { type: String},
			createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateAt : { type: Date},
			active : { type:Boolean,required:true,default:false},
			productid : { type: String},
			title : { type: String,required:true,default:''},
			details : { type: String},
			country : { type: String},
			photo : { type: String}
});

productnewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productnewSchema.set('toJSON', {
    virtuals: true
});

productnewSchema.findById = function (cb) {
    return this.model('Productnew').find({id: this.id}, cb);
};

const Productnew = mongoose.model('Productnew', productnewSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Productnew.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProductnew = (productnewData) => {
    return new Promise((resolve, reject) => {
    
    const productnew = new Productnew(productnewData);
    productnew.save(function (err, saved) {
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
    
    

    if(query.active!=null){
        _query['active'] = query.active 
    }
            

    if(query.title){
        let title_= queryBuilder_string(query,'title');
        _query={..._query,...title_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Productnew.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, productnew) {
                if (err) {
                    reject(err);
                } else {
                    Productnew.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: productnew , count: total ,perpage:perPage,page:page };
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
    Productnew.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, productnew) {
                if (err) {
                    reject(err);
                } else {
                resolve(productnew);
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
        Productnew.find(_query)
            .exec(function (err, productnew) {
                if (err) {
                    reject(err);
                } else {
                    resolve(productnew);
                }
            })
    });
};
exports.patchProductnew = (id, productnewData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Productnew.findOne(queries, function (err, productnew) {
            if (err) reject(err);
            for (let i in productnewData) {
                productnew[i] = productnewData[i];
            }
            productnew.save(function (err, updatedProductnew) {
                if (err) return reject(err);
                resolve(updatedProductnew);
            });
        });
    })

};

exports.removeById = (productnewId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:productnewId}
    return new Promise((resolve, reject) => {
        Productnew.findOneAndDelete(queries, (err) => {
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
            if(req.file.size>1*1024*1024){ // you can chnage the file upload limit
                reject('file_size_too_big');
            }
            let colName = req.params.columnName
            let rowId = req.params.rowId
            let uploadedFileName =req.file.filename;
            Productnew.findById(rowId, function (err, productnew) {
                if (err) reject(err);
                productnew[colName] =uploadedFileName;
                productnew.save(function (err, updatedData) {
                    if (err) return reject(err);
                    resolve(uploadedFileName)
                });
            });
        });
        };
        

    