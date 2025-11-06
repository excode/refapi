const mongoose = require("../../common/services/mongoose.service").mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const HierarchyModle = require("../../src/hierarchy/hierarchy.model")
const  env  = process.env;
const {
  queryFormatter,
  queryBuilder_string,
  queryBuilder_number,
  queryBuilder_date,
  queryBuilder_array,
  queryBuilder_range_array,
} = require("../../common/functions/queryutilMongo");
const redeemSchema = new Schema({
  createBy: { type: String, required: true, default: "" },
  updateBy: { type: String },
  createAt: { type: Date, required: true },
  updateAt: { type: Date },
  productid: {type: Schema.Types.ObjectId, ref: 'Product'},
  redeemproductid: {type: Schema.Types.ObjectId, ref: 'Redeemoption'},
  quantity: { type: Number, required: true, default: 0 },
  unitprice: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  contactNumber: { type: String, required: true, default: "" },
  sellerNumber: { type: String, required: true, default: "" },
  processed: { type: Boolean, default: false }
});

redeemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
redeemSchema.set("toJSON", {
  virtuals: true,
});

redeemSchema.findById = function (cb) {
  return this.model("Redeem").find({ id: this.id }, cb);
};

const Redeem = mongoose.model("Redeem", redeemSchema);
exports.RedeemModel = Redeem;

exports.findById = (id, extraField) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: id };
  return Redeem.findOne(queries)
    .populate({path:'productid',select:'_id productname'})
    .populate({path:'redeemproductid',select:'_id name'})
    .then((result) => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
};

exports.find = (query) => {
  return Redeem.find(query)
    .populate({path:'productid',select:'_id productname'})
    .populate({path:'redeemproductid',select:'_id name'})
    .then((result) => {
      return result.map(res => {
        res = res.toJSON();
        delete res._id;
        delete res.__v;
        return res;
      });
    })
    .catch((error) => {
      throw error;
    });
};

exports.findOne = (query) => {
  return Redeem.findOne(query)
    .populate({path:'productid',select:'_id productname'})
    .populate({path:'redeemproductid',select:'_id name'})
    .then((result) => {
      if (result) {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
      }
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.createRedeem = (redeemData) => {

  const productid=redeemData.productid;
  
  return new Promise((resolve, reject) => {
    const redeem = new Redeem(redeemData);
    redeem.save(function (err, saved) {
      if (err) {
        return reject(err);
      }
      resolve(saved);
    });
  });
};
exports.createRedeemAlifPay = async (redeemData) => {
  const productid = env.ALIF_PAY_PRODUCT;
  const redeemid = env.ALIF_PAY_REDEEM;
  const amount = redeemData.quantity;
  const contactNumber = redeemData.contactNumber;
  const seller = env.ALIF_PAY_SELLER;
  const min= env.MIN_REDEEM ??30;
  const pid = mongoose.Types.ObjectId(productid);

  //const session = await mongoose.startSession();
  if (amount < min) {
    throw new Error("Minimum redeem amount is "+min );
  }
  try {
   // session.startTransaction();
 
    const Hierarchy = mongoose.model('Hierarchy');
    const Redeem = mongoose.model('Redeem'); // Ensure Redeem model is imported or defined properly
    const matched = { contactNumber: contactNumber, productid: pid };

    // Step 1: Find the user's wallet and check if the reward balance is sufficient
    const wallet = await Hierarchy.findOne(matched); // Correct usage of session
    if (!wallet || wallet.rewardbalance < amount) {
      throw new Error("Insufficient reward balance.");
    }

    // Step 2: Deduct the redeem amount from rewardBalance
    await Hierarchy.updateOne(
      matched,
      { $inc: { rewardbalance: -amount } },
     
    );

    // Step 3: Insert a new record into the Redeem collection
    const newRedeemRecord = await Redeem.create(
      [{
        contactNumber: contactNumber,
        productid: productid,
        redeemproductid: redeemid,
        quantity: amount,
        total: amount,
        createAt: new Date(),
        createBy: redeemData.createBy,
        unitprice: 1,
        sellerNumber: seller,
      }]
     
    );

    // Commit the transaction
    //await session.commitTransaction();

    // Return or log success
    console.log("Redeem record created successfully.");
    return newRedeemRecord;
  } catch (error) {
    // Abort the transaction in case of error
   // await session.abortTransaction();
    console.error("Transaction aborted due to error: ", error.message);
    throw error; // Re-throw the error so that the caller knows it failed
  } finally {
   // session.endSession();
  }
};


exports.latestRedeem = () => {
  const numberOfLatestRedeem = 5;
  return new Promise(async (resolve, reject) => {
    try {
      const latestRedeem = await Redeem.find({})
        .sort({ insertTime: -1 })
        .limit(numberOfLatestRedeem);

      if (latestRedeem.length > 0) {
        resolve(latestRedeem);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};
exports.list = (perPage, page, query) => {
  var _query = {};
  let sortBy = "_id";
  let sortDirection = -1;

  if (query.createBy) {
    let createBy_ = queryBuilder_string(query, "createBy");
    _query = { ..._query, ...createBy_ };
  }

  if (query.updateBy) {
    let updateBy_ = queryBuilder_string(query, "updateBy");
    _query = { ..._query, ...updateBy_ };
  }

  if (query.createAt) {
    let createAt_ = queryBuilder_date(query, "createAt");
    _query = { ..._query, ...createAt_ };
  }
  if (query.createAt_array) {
    let createAt_a = queryBuilder_range_array(query, "createAt", "date");
    _query = { ..._query, ...createAt_a };
  }

  if (query.updateAt) {
    let updateAt_ = queryBuilder_date(query, "updateAt");
    _query = { ..._query, ...updateAt_ };
  }
  if (query.updateAt_array) {
    let updateAt_a = queryBuilder_range_array(query, "updateAt", "date");
    _query = { ..._query, ...updateAt_a };
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
  if (query.redeemproductid) {
    let redeemproductid_ = queryBuilder_string(query, "redeemproductid");
    _query = { ..._query, ...redeemproductid_ };
  }

  if (query.quantity != null) {
    if (!isNaN(query.quantity)) {
      let quantity_ = queryBuilder_number(query, "quantity");
      _query = { ..._query, ...quantity_ };
    }
  }
  if (query.quantity_array) {
    let quantity_a = queryBuilder_range_array(query, "quantity", "number");
    _query = { ..._query, ...quantity_a };
  }

  if (query.unitprice != null) {
    if (!isNaN(query.unitprice)) {
      let unitprice_ = queryBuilder_number(query, "unitprice");
      _query = { ..._query, ...unitprice_ };
    }
  }
  if (query.unitprice_array) {
    let unitprice_a = queryBuilder_range_array(query, "unitprice", "number");
    _query = { ..._query, ...unitprice_a };
  }

  if (query.total != null) {
    if (!isNaN(query.total)) {
      let total_ = queryBuilder_number(query, "total");
      _query = { ..._query, ...total_ };
    }
  }
  if (query.total_array) {
    let total_a = queryBuilder_range_array(query, "total", "number");
    _query = { ..._query, ...total_a };
  }

  if (query.sellerNumber) {
    let sellerNumber_ = queryBuilder_string(query, "sellerNumber");
    _query = { ..._query, ...sellerNumber_ };
  }
  if (query.contactNumber) {
    let contactNumber_ = queryBuilder_string(query, "contactNumber");
    _query = { ..._query, ...contactNumber_ };
  }

  if (query.sortBy) {
    sortBy = query.sortBy;
  }
  if (query.sortDirection) {
    sortDirection = query.sortDirection;
  }
  var sortBoj = { [sortBy]: sortDirection };
  return new Promise((resolve, reject) => {
    Redeem.find(_query)
      .populate({path:'productid',select:'_id productname'})
      .populate({path:'redeemproductid',select:'_id name'})
      .limit(perPage)
      .sort(sortBoj)
      .skip(perPage * page)
      .exec(function (err, redeem) {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          Redeem.countDocuments(_query)
            .exec()
            .then((total) => {
              const promises = {
                docs: redeem,
                count: total,
                perpage: perPage,
                page: page,
              };
              resolve(promises);
            })
            .catch((err2) => {
              console.log(err2)
              reject(err2);
            });
        }
      });
  });
};
exports.listAll = (query = {}) => {
  var _query = { ...query };
  let sortBy = "_id";
  let sortDirection = -1;
  let max_limit = 300;
  if (query.sortBy) {
    sortBy = query.sortBy;
  }
  if (query.sortDirection) {
    sortDirection = query.sortDirection;
  }
  var sortBoj = { [sortBy]: sortDirection };
  console.log(_query)
  return new Promise((resolve, reject) => {
    Redeem.find(_query)
      .limit(max_limit)
      .sort(sortBoj)
      .exec(function (err, redeem) {
        if (err) {
          reject(err);
        } else {
          resolve(redeem);
        }
      });
  });
};
exports.listSuggestions = (query) => {
  var { search, ...queryWithoutSearch } = query;
  var _query = queryWithoutSearch;
  if (search) {
    _query["$or"] = [
      { redeemproductid: { $regex: search, $options: "i" } },
      { sellerNumber: { $regex: search, $options: "i" } },
    ];
  }
  return new Promise((resolve, reject) => {
    Redeem.find(_query).exec(function (err, redeem) {
      if (err) {
        reject(err);
      } else {
        resolve(redeem);
      }
    });
  });
};
exports.patchRedeem = (id, redeemData, extraField = {}) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: id };
  return new Promise((resolve, reject) => {
    Redeem.findOne(queries, function (err, redeem) {
      if (err) reject(err);
      for (let i in redeemData) {
        redeem[i] = redeemData[i];
      }
      redeem.save(function (err, updatedRedeem) {
        if (err) return reject(err);
        resolve(updatedRedeem);
      });
    });
  });
};

exports.removeById = (redeemId, extraField = {}) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: redeemId };
  return new Promise((resolve, reject) => {
    Redeem.findOneAndDelete(queries, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};


exports.temp=async(changeEvent) =>{
  const docId ="1asasasa";// changeEvent.documentKey._id;
  const jwt = require('jsonwebtoken');
  // Correct service name without extra spaces or tab characters
  const serviceName = "Cluster1";
  const database = "winandwings";
  
  //const collection = context.services.get(serviceName).db(database).collection(changeEvent.ns.coll);
  //const collectionRedeem = context.services.get(serviceName).db(database).collection("redeems");

  //const document = changeEvent.fullDocument;
  //console.log(document);
/*
{
"receiver":"ahmad",
"amount":25.00,
"recipient_type":"5",
"remark":"Wallet payment",
"reference":"8",
"cardpin":"224466"
}
*/
  try {
    // Check for insert operation type and that the document is not processed
   // if (changeEvent.operationType === "insert" && !document.processed) {
      
      const url = `https://wallet-uat.alifpay.com.my/mpay/fundtransfer/rewards`;
      const tokenData = {
        "userId": "1aafe2a0-2112-4ed5-8391-ba9c5e6b00d2",
        "email": "kalam.azad@ucode.ai",
        "uid": "117349",
        "name": "Farhan Eesa",
        "username": "eesa",
        "country": "130",
        "mobileno": "601767111111" 
      };
      
      // Use a properly configured secret for JWT
      const jwt_Secret = docId;
      let authtoken = jwt.sign(tokenData, jwt_Secret, { expiresIn: '2m' });
      //console.log(token);
      
      const body = {
        "receiver": "ASASASAS",
        "amount": 3423,
        "reference":"8",
        "remark": "AlifPay CashBack",
        "recipient_type": "5",
        "cardpin": "224466",
        "redeemId": docId
      };

      let mytoken=`Bearer ${authtoken}`
      try {
        const response = await http.post({
          url: url,
          body: JSON.stringify(body),
          headers: { 
            "Content-Type": "application/json",
            "Authorization": mytoken
          }
        });
        
        if (response.statusCode === 200) {
          // Update the document in the redeems collection
          console.log("DONE");
        } else {
          console.log("FAILED");
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        console.error(`Error in API call: ${error}`);
      }
   // }
  } catch (err) {
    console.log(err);
    console.log("error performing mongodb write: ", err.message);
  }
};
