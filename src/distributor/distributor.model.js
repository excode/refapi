const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const funcs =  require("../../common/functions/funcs");

const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")

const distributorSchema = new Schema({
    	    createBy : { type: String,required:true,default:''},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
			location : funcs.locationMap(),
			blogTitle : { type: String,required:true,default:''},
			category : { type: String},
			currency : { type: String},
			telephone : { type: String,required:true,default:''},
			email : { type: String,required:true,default:''},
			state : { type: String,required:true,default:''},
			active : { type:Boolean,required:true,default:false},
			sync : { type: Number,required:true,default:0},
			rank : { type: Number,required:true,default:0},
			productid : {type: Schema.Types.ObjectId, ref: 'Product'},
			contactNumber : { type: String,required:true,default:''},
			name : { type: String,required:true,default:''},
			address : { type: String,required:true,default:''},
			city : { type: String,required:true,default:''},
			zipcode : { type: String,required:true,default:'',maxLength:10},
			country : { type: String,required:true,default:''},
			productname : { type: String,required:true,default:''},
			serviceType : { type: Number,required:true,default:0}
            
});

distributorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
distributorSchema.set('toJSON', {
    virtuals: true
});

distributorSchema.findById = function (cb) {
    return this.model('Distributor').find({id: this.id}, cb);
};

const Distributor = mongoose.model('Distributor', distributorSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    console.log(queries)
    return Distributor.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createDistributor = (distributorData) => {
    return new Promise(async(resolve, reject) => {
    

        let   contactNumberCHeck =await Distributor.findOne({"contactNumber":distributorData.contactNumber,productid:distributorData.productid})
        if(contactNumberCHeck ) {
          reject("contactNumber exists for this product");
          return;
        }
      
      let   emailCHeck =await Distributor.findOne({"email":distributorData.email,productid:distributorData.productid})
        if(emailCHeck ) {
          reject("email exists for this product");
          return;
        }
      

        
        

    const distributor = new Distributor(distributorData);
    distributor.save(function (err, saved) {
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
    
    

    if(query.location){
        let location_= queryBuilder_string(query,'location');
        _query={..._query,...location_}
    }


    if(query.blogTitle){
        let blogTitle_= queryBuilder_string(query,'blogTitle');
        _query={..._query,...blogTitle_}
    }


    if(query.telephone){
        let telephone_= queryBuilder_string(query,'telephone');
        _query={..._query,...telephone_}
    }


    if(query.email){
        let email_= queryBuilder_string(query,'email');
        _query={..._query,...email_}
    }


    if(query.state){
        let state_= queryBuilder_string(query,'state');
        _query={..._query,...state_}
    }


    if(query.active!=null){
        _query['active'] = query.active 
    }
            

    if(query.sync!=null ){
      if(!isNaN(query.sync)){
        let sync_= queryBuilder_number(query,'sync');
        _query={..._query,...sync_}
     }
    }
    if(query.sync_array){
        let sync_a= queryBuilder_range_array(query,'sync',"number");
        _query={..._query,...sync_a}
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



    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.name){
        let name_= queryBuilder_string(query,'name');
        _query={..._query,...name_}
    }


    if(query.address){
        let address_= queryBuilder_string(query,'address');
        _query={..._query,...address_}
    }


    if(query.city){
        let city_= queryBuilder_string(query,'city');
        _query={..._query,...city_}
    }


    if(query.zipcode){
        let zipcode_= queryBuilder_string(query,'zipcode');
        _query={..._query,...zipcode_}
    }


    if(query.country){
        let country_= queryBuilder_string(query,'country');
        _query={..._query,...country_}
    }


    if(query.productname){
        let productname_= queryBuilder_string(query,'productname');
        _query={..._query,...productname_}
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

       console.log("Assss")
        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Distributor.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, distributor) {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    Distributor.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: distributor , count: total ,perpage:perPage,page:page };
                        resolve(promises);
                    }).catch((err2)=>{
                        console.log(err2)
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
    Distributor.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, distributor) {
                if (err) {
                    reject(err);
                } else {
                resolve(distributor);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"location": {$regex: search, $options: "i"}},
				{"blogTitle": {$regex: search, $options: "i"}},
				{"telephone": {$regex: search, $options: "i"}},
				{"email": {$regex: search, $options: "i"}},
				{"state": {$regex: search, $options: "i"}},
				{"contactNumber": {$regex: search, $options: "i"}},
				{"name": {$regex: search, $options: "i"}},
				{"address": {$regex: search, $options: "i"}},
				{"city": {$regex: search, $options: "i"}},
				{"zipcode": {$regex: search, $options: "i"}},
				{"country": {$regex: search, $options: "i"}},
				{"productname": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Distributor.find(_query)
            .exec(function (err, distributor) {
                if (err) {
                    reject(err);
                } else {
                    resolve(distributor);
                }
            })
    });
};
exports.patchDistributor = (id, distributorData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Distributor.findOne(queries, function (err, distributor) {
            if (err) reject(err);
            for (let i in distributorData) {
                distributor[i] = distributorData[i];
            }
            distributor.save(function (err, updatedDistributor) {
                if (err) return reject(err);
                resolve(updatedDistributor);
            });
        });
    })

};

exports.removeById = (distributorId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:distributorId}
    return new Promise((resolve, reject) => {
        Distributor.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    