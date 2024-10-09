const mongoose = require("../../common/services/mongoose.service").mongoose;
const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const res = require("express/lib/response");
const {
  queryFormatter,
  queryBuilder_string,
  queryBuilder_number,
  queryBuilder_date,
  queryBuilder_array,
  queryBuilder_range_array,
} = require("../../common/functions/queryutilMongo");

const sellSchema = new Schema({
  createAt: { type: Date, required: true },
  createBy: { type: String, required: true, default: "" },
  updateBy: { type: String },
  updateAt: { type: Date },
  selltype: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  unitprice: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  productid: {type: Schema.Types.ObjectId, ref: 'Product'},
  sellerNumber: { type: String, required: true, default: "" },
  contactNumber: { type: String, required: true, default: "" },
  isSelfClaim:{type:Boolean,default:false},
  rewarded:{type:Boolean,default:true},
  claimExpires:{type:Number,default:0},
});

sellSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
sellSchema.set("toJSON", {
  virtuals: true,
});

sellSchema.findById = function (cb) {
  return this.model("Sell").find({ id: this.id }, cb);
};

const Sell = mongoose.model("Sell", sellSchema);

exports.SellModel = Sell;

exports.findById = (id, extraField) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: id };
  return Sell.findOne(queries)
  .populate({path:'productid',select:'_id productname'})
  .then((result) => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
};
exports.findOne = (query) => {
  return new Promise((resolve, reject) => {
    Sell.findOne(query, function(err, sell) {
      if (err) {
        reject(err);
      } else {
        resolve(sell);
      }
    });
  });
};

exports.find = (query) => {
  return new Promise((resolve, reject) => {
    Sell.find(query, function(err, sells) {
      if (err) {
        reject(err);
      } else {
        resolve(sells);
      }
    });
  });
};
exports.createSell = (sellData) => {
  return new Promise((resolve, reject) => {
    const sell = new Sell(sellData);
    sell.save(function (err, saved) {
      if (err) {
        return reject(err);
      }
      resolve(saved);
    });
  });
};

exports.latestSell = () => {
  const numberOfLatestSell = 5;
  return new Promise(async (resolve, reject) => {
    try {
      const latestSell = await Sell.find({})
        .sort({ insertTime: -1 })
        .limit(numberOfLatestSell);
      if (latestSell.length > 0) {
        resolve(latestSell);
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
  if (query.createAt) {
    let createAt_ = queryBuilder_date(query, "createAt");
    _query = { ..._query, ...createAt_ };
  }
  if (query.createAt_array) {
    let createAt_a = queryBuilder_range_array(query, "createAt", "date");
    _query = { ..._query, ...createAt_a };
  }

  if (query.createBy) {
    let createBy_ = queryBuilder_string(query, "createBy");
    _query = { ..._query, ...createBy_ };
  }

  if (query.updateBy) {
    let updateBy_ = queryBuilder_string(query, "updateBy");
    _query = { ..._query, ...updateBy_ };
  }

  if (query.updateAt) {
    let updateAt_ = queryBuilder_date(query, "updateAt");
    _query = { ..._query, ...updateAt_ };
  }
  if (query.updateAt_array) {
    let updateAt_a = queryBuilder_range_array(query, "updateAt", "date");
    _query = { ..._query, ...updateAt_a };
  }

  if (query.selltype != null) {
    if (!isNaN(query.selltype)) {
      let selltype_ = queryBuilder_number(query, "selltype");
      _query = { ..._query, ...selltype_ };
    }
  }
  if (query.selltype_array) {
    let selltype_a = queryBuilder_range_array(query, "selltype", "number");
    _query = { ..._query, ...selltype_a };
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
  console.log(_query)
  return new Promise((resolve, reject) => {
    Sell.find(_query)
      .populate({path:'productid',select:'_id productname'})
      .limit(perPage)
      .sort(sortBoj)
      .skip(perPage * page)
      .exec(function (err, sell) {
        if (err) {
          reject(err);
        } else {
          Sell.countDocuments(_query)
            .exec()
            .then((total) => {
              const promises = {
                docs: sell,
                count: total,
                perpage: perPage,
                page: page,
              };
              resolve(promises);
            })
            .catch((err2) => {
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
  return new Promise((resolve, reject) => {
    Sell.find(_query)
      .limit(max_limit)
      .sort(sortBoj)
      .exec(function (err, sell) {
        if (err) {
          reject(err);
        } else {
          resolve(sell);
        }
      });
  });
};
exports.listSuggestions = (query) => {
  var { search, ...queryWithoutSearch } = query;
  var _query = queryWithoutSearch;
  if (search) {
    _query["$or"] = [
      { sellerNumber: { $regex: search, $options: "i" } },
      { contactNumber: { $regex: search, $options: "i" } },
    ];
  }
  return new Promise((resolve, reject) => {
    Sell.find(_query).exec(function (err, sell) {
      if (err) {
        reject(err);
      } else {
        resolve(sell);
      }
    });
  });
};
exports.patchSell = (id, sellData, extraField = {}) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: id };
  return new Promise((resolve, reject) => {
    Sell.findOne(queries, function (err, sell) {
      if (err) reject(err);
      for (let i in sellData) {
        sell[i] = sellData[i];
      }
      sell.save(function (err, updatedSell) {
        if (err) return reject(err);
        resolve(updatedSell);
      });
    });
  });
};

exports.removeById = (sellId, extraField = {}) => {
  var extraQuery = queryFormatter(extraField);
  var queries = { ...extraQuery, _id: sellId };
  return new Promise((resolve, reject) => {
    Sell.findOneAndDelete(queries, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
