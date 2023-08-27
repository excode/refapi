const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const funcs =  require("../../common/functions/funcs");

const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
const usersSchema = new Schema({
    	lastname : { type: String,required:true,default:'',maxLength:50,minLength:1},
			usertype : { type: Number,required:true,default:0},
			emailOTP : { type: String},
			firstname : { type: String},
			password : { type: String},
			contactNumber : { type: String,required:true,default:'',unique: true ,maxLength:20,minLength:8},
			email : { type: String,required:true,default:'',unique: true },
			emailOTPExpires : { type: Number},
			createBy : { type: String},
			createAt : { type: Date,required:true},
			updateBy : { type: String},
			updateAt : { type: Date},
            webPassword : {type:String,default:0},
            webPasswordExpires : {type:Number,default:0},
            joinDate : {type:Number,default:0},
            syncDocs : {type: Array,default:  funcs.docsList()},
            sync:{type:Number,default:0},
            tcode : { type: String,default:''},
            tlock : {type:String,default:0},
            joinDate : {type:Number,default:0},
            syncDocs : {type: Array,default:  funcs.docsList()},
            webAccess:{type:Number,default:0},
            enableReset: {type:Number,default:0},
            lastLoginDate : {type:Number,default:0}
});

usersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
usersSchema.set('toJSON', {
    virtuals: true
});

usersSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const Users = mongoose.model('Users', usersSchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Users.findOne(queries)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.findByContactNumber = (contactNumber) => {
 return new Promise((resolve, reject) => {
    return Users.findOne({contactNumber: contactNumber}).exec(function (err, data) {
    if (err) {
        reject(err);
    } else {
        if(data){
            resolve(data);
        }else{
            resolve(null);
        }
    }
    })
  });
};

                

exports.findByEmail = (email) => {
 return new Promise((resolve, reject) => {
    return Users.findOne({email: email}).exec(function (err, data) {
    if (err) {
        reject(err);
    } else {
        if(data){
            resolve(data);
        }else{
            resolve(null);
        }
    }
    })
  });
};

                
exports.createUsers = (usersData) => {
    return new Promise(async(resolve, reject) => {
    
        let   contactNumberCHeck =await Users.findOne({"contactNumber":usersData.contactNumber})
          if(contactNumberCHeck ) {
            reject("contactNumber exists");
            return;
          }
        
        let   emailCHeck =await Users.findOne({"email":usersData.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        
    const users = new Users(usersData);
    users.save(function (err, saved) {
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
        
    if(query.lastname){
        let lastname_= queryBuilder_string(query,'lastname');
        _query={..._query,...lastname_}
    }


    if(query.usertype!=null ){
      if(!isNaN(query.usertype)){
        let usertype_= queryBuilder_number(query,'usertype');
        _query={..._query,...usertype_}
     }
    }
    if(query.usertype_array){
        let usertype_a= queryBuilder_range_array(query,'usertype',"number");
        _query={..._query,...usertype_a}
    }



    if(query.emailOTP){
        let emailOTP_= queryBuilder_string(query,'emailOTP');
        _query={..._query,...emailOTP_}
    }


    if(query.firstname){
        let firstname_= queryBuilder_string(query,'firstname');
        _query={..._query,...firstname_}
    }


    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.email){
        let email_= queryBuilder_string(query,'email');
        _query={..._query,...email_}
    }


    if(query.emailOTPExpires!=null ){
      if(!isNaN(query.emailOTPExpires)){
        let emailOTPExpires_= queryBuilder_number(query,'emailOTPExpires');
        _query={..._query,...emailOTPExpires_}
     }
    }
    if(query.emailOTPExpires_array){
        let emailOTPExpires_a= queryBuilder_range_array(query,'emailOTPExpires',"number");
        _query={..._query,...emailOTPExpires_a}
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


        if(query.updateAt){
            let updateAt_= queryBuilder_date(query,'updateAt');
            _query={..._query,...updateAt_}
        }
        if(query.updateAt_array){
            let updateAt_a= queryBuilder_range_array(query,'updateAt',"date");
            _query={..._query,...updateAt_a}
        }
    
    
        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        return new Promise((resolve, reject) => {
        Users.find(_query)
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    Users.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: users , count: total ,perpage:perPage,page:page };
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
    Users.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                resolve(users);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"lastname": {$regex: search, $options: "i"}},
				{"firstname": {$regex: search, $options: "i"}},
				{"contactNumber": {$regex: search, $options: "i"}},
				{"email": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Users.find(_query)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};
exports.patchUsers = (id, usersData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise(async(resolve, reject) => {
        
        if(usersData.contactNumber){
        let   contactNumberCHeck =await Users.findOne({_id:{$ne:id},"contactNumber":usersData.contactNumber})
          if(contactNumberCHeck ) {
            reject("contactNumber exists");
            return;
          }
        }
        
        if(usersData.email){
        let   emailCHeck =await Users.findOne({_id:{$ne:id},"email":usersData.email})
          if(emailCHeck ) {
            reject("email exists");
            return;
          }
        }
        
        Users.findOne(queries, function (err, users) {
            if (err) reject(err);
            for (let i in usersData) {
                users[i] = usersData[i];
            }
            users.save(function (err, updatedUsers) {
                if (err) return reject(err);
                resolve(updatedUsers);
            });
        });
    })

};

exports.removeById = (usersId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:usersId}
    return new Promise((resolve, reject) => {
        Users.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



    