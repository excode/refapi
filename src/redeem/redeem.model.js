const mongoose = require("../../common/services/mongoose.service").mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
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
  sellerNumber: { type: String, required: true, default: "" }
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
