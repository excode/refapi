const AnalyticsModel = require("./analytics.model");

// const funcs = require("../../common/functions/funcs");

exports.chartData = (req, res) => {
  req.query = { ...req.query, id: req.jwt.id };

  AnalyticsModel.sellRedeemDataMonthWise()
    .then((result) => {
      res.status(200).send([
        {
          label: "Sell",
          data: [
            { timestamp: "2023-01", value: 5005 },
            { timestamp: "2023-02", value: 1500 },
            { timestamp: "2023-03", value: 500 },
            { timestamp: "2023-04", value: 9500 },
            { timestamp: "2023-05", value: 3100 },
            { timestamp: "2023-06", value: 6100 },
            { timestamp: "2023-07", value: 100 },
            { timestamp: "2023-08", value: 3910 },
            { timestamp: "2023-09", value: 8800 },
            { timestamp: "2023-10", value: 2300 },
            { timestamp: "2023-11", value: 7931 },
            { timestamp: "2023-12", value: 1509 },
          ],
        },
        {
          label: "Redeem",
          data: [
            { timestamp: "2023-01", value: 9905 },
            { timestamp: "2023-02", value: 3500 },
            { timestamp: "2023-03", value: 7500 },
            { timestamp: "2023-04", value: 1200 },
            { timestamp: "2023-05", value: 5500 },
            { timestamp: "2023-06", value: 3500 },
            { timestamp: "2023-07", value: 4900 },
            { timestamp: "2023-08", value: 7200 },
            { timestamp: "2023-09", value: 6100 },
            { timestamp: "2023-10", value: 2900 },
            { timestamp: "2023-11", value: 5900 },
            { timestamp: "2023-12", value: 2000 },
          ],
        },
      ]);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};
