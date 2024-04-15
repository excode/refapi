const { SellModel } = require("../sell/sell.model");
const { RedeemModel } = require("../redeem/redeem.model");

function aggregateData(model) {
  return model
    .aggregate([
      {
        $match: {
          insertTime: { $exists: true }, // Filter out documents without insertTime
        },
      },
      {
        $addFields: {
          year: { $year: { $toDate: "$insertTime" } }, // Extract year
          // month: { $month: { $toDate: "$insertTime" } }, // Extract month
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          totalQuantity: { $sum: "$quantity" },
          totalPrice: { $sum: "$total" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ])
    .exec()
    .catch((error) => {
      console.error("Error in aggregation:", error);
      throw error; // Rethrow the error to propagate it to the caller
    });
}

exports.sellRedeemDataMonthWise = () => {
  return Promise.all([
    // aggregateData(SellModel),
    aggregateData(RedeemModel),
    aggregateData(RedeemModel),
  ]).then(([sellData, redeemData]) => {
    // Merge and return the data
    console.log({ sellData });
    return { sellData, redeemData };
  });
};
