const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const currenciesSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			minTransaction : { type: Number,required:true,default:0},
			transactionFee : { type: Number,required:true,default:0},
			maxTransaction : { type: Number,required:true,default:0},
			decimal : { type: Number,required:true,default:0,max:99},
			name : { type: String,required:true,default:'',maxLength:20},
			isocode : { type: String,required:true,default:'',maxLength:3},
			cSign : { type: String,required:true,default:'',maxLength:5}
});

currenciesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
currenciesSchema.set('toJSON', {
    virtuals: true
});

currenciesSchema.findById = function (cb) {
    return this.model('Currencies').find({id: this.id}, cb);
};

const Currencies = mongoose.model('Currencies', currenciesSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Currencies.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCurrencies = (currenciesData) => {
    return new Promise((resolve, reject) => {
    
    const currencies = new Currencies(currenciesData);
    currencies.save(function (err, saved) {
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
    
    

    if(query.minTransaction!=null ){
      if(!isNaN(query.minTransaction)){
        let minTransaction_= queryBuilder_number(query,'minTransaction');
        _query={..._query,...minTransaction_}
     }
    }
    if(query.minTransaction_array){
        let minTransaction_a= queryBuilder_range_array(query,'minTransaction',"number");
        _query={..._query,...minTransaction_a}
    }



    if(query.transactionFee!=null ){
      if(!isNaN(query.transactionFee)){
        let transactionFee_= queryBuilder_number(query,'transactionFee');
        _query={..._query,...transactionFee_}
     }
    }
    if(query.transactionFee_array){
        let transactionFee_a= queryBuilder_range_array(query,'transactionFee',"number");
        _query={..._query,...transactionFee_a}
    }



    if(query.maxTransaction!=null ){
      if(!isNaN(query.maxTransaction)){
        let maxTransaction_= queryBuilder_number(query,'maxTransaction');
        _query={..._query,...maxTransaction_}
     }
    }
    if(query.maxTransaction_array){
        let maxTransaction_a= queryBuilder_range_array(query,'maxTransaction',"number");
        _query={..._query,...maxTransaction_a}
    }



    if(query.decimal!=null ){
      if(!isNaN(query.decimal)){
        let decimal_= queryBuilder_number(query,'decimal');
        _query={..._query,...decimal_}
     }
    }
    if(query.decimal_array){
        let decimal_a= queryBuilder_range_array(query,'decimal',"number");
        _query={..._query,...decimal_a}
    }



    if(query.name){
        let name_= queryBuilder_string(query,'name');
        _query={..._query,...name_}
    }


    if(query.isocode){
        let isocode_= queryBuilder_string(query,'isocode');
        _query={..._query,...isocode_}
    }


    if(query.cSign){
        let cSign_= queryBuilder_string(query,'cSign');
        _query={..._query,...cSign_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Currencies.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, currencies) {
                if (err) {
                    reject(err);
                } else {
                    Currencies.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: currencies , count: total ,perpage:perPage,page:page };
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
    Currencies.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, currencies) {
                if (err) {
                    reject(err);
                } else {
                resolve(currencies);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"name": {$regex: search, $options: "i"}},
				{"isocode": {$regex: search, $options: "i"}},
				{"cSign": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Currencies.find(_query)
            .exec(function (err, currencies) {
                if (err) {
                    reject(err);
                } else {
                    resolve(currencies);
                }
            })
    });
};
exports.patchCurrencies = (id, currenciesData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Currencies.findOne(queries, function (err, currencies) {
            if (err) reject(err);
            for (let i in currenciesData) {
                currencies[i] = currenciesData[i];
            }
            currencies.save(function (err, updatedCurrencies) {
                if (err) return reject(err);
                resolve(updatedCurrencies);
            });
        });
    })

};

exports.removeById = (currenciesId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:currenciesId}
    return new Promise((resolve, reject) => {
        Currencies.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    