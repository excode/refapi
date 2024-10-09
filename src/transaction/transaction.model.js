const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const transactionSchema = new Schema({
    	createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			amount : { type: Number,required:true,default:0},
			quantity : { type: Number,required:true,default:0},
			rtype : { type: Number,required:true,default:0},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			contactNumber : { type: String,required:true,default:''},
			particular : { type: String,required:true,default:''}
});

transactionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
transactionSchema.set('toJSON', {
    virtuals: true
});

transactionSchema.findById = function (cb) {
    return this.model('Transaction').find({id: this.id}, cb);
};

const Transaction = mongoose.model('Transaction', transactionSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Transaction.findOne(queries)
    .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createTransaction = (transactionData) => {
    return new Promise((resolve, reject) => {
    
    const transaction = new Transaction(transactionData);
    transaction.save(function (err, saved) {
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

    if(query.forced_productid){

     
      let productID_= {productid:{$in:query.forced_productid}}
        _query={..._query,...productID_}
    
       //console.log(productID_)
    }
    if(query.productid){

        query.productid = mongoose.Types.ObjectId( query.productid);
        let productid_ = {productid:query.productid}
          _query = { ..._query, ...productid_ };
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



    if(query.quantity!=null ){
      if(!isNaN(query.quantity)){
        let quantity_= queryBuilder_number(query,'quantity');
        _query={..._query,...quantity_}
     }
    }
    if(query.quantity_array){
        let quantity_a= queryBuilder_range_array(query,'quantity',"number");
        _query={..._query,...quantity_a}
    }



    if(query.rtype!=null ){
      if(!isNaN(query.rtype)){
        let rtype_= queryBuilder_number(query,'rtype');
        _query={..._query,...rtype_}
     }
    }
    if(query.rtype_array){
        let rtype_a= queryBuilder_range_array(query,'rtype',"number");
        _query={..._query,...rtype_a}
    }



    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.particular){
        let particular_= queryBuilder_string(query,'particular');
        _query={..._query,...particular_}
    }

        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }

        //console.log(_query)
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
            try {
        Transaction.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, transaction) {
                if (err) {
                    reject(err);
                } else {
                    Transaction.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: transaction , count: total ,perpage:perPage,page:page };
                        resolve(promises);
                    }).catch((err2)=>{
                        reject(err2);
                    })
                }
            })
        } catch (error) {
            console.error('Error:', error);
          }
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
    Transaction.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, transaction) {
                if (err) {
                    reject(err);
                } else {
                resolve(transaction);
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
				{"particular": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Transaction.find(_query)
            .exec(function (err, transaction) {
                if (err) {
                    reject(err);
                } else {
                    resolve(transaction);
                }
            })
    });
};
exports.patchTransaction = (id, transactionData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Transaction.findOne(queries, function (err, transaction) {
            if (err) reject(err);
            for (let i in transactionData) {
                transaction[i] = transactionData[i];
            }
            transaction.save(function (err, updatedTransaction) {
                if (err) return reject(err);
                resolve(updatedTransaction);
            });
        });
    })

};

exports.removeById = (transactionId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:transactionId}
    return new Promise((resolve, reject) => {
        Transaction.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    