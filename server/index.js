var cors = require('cors')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');   
const config = require('../common/config/env.config.js');     
const AuthorizationRouter = require('../authorization/routes.config');
const UsersRouter = require('../src/users/routes.config');
const CategoriesRouter = require('../src/categories/routes.config');
const CurrenciesRouter = require('../src/currencies/routes.config');
const DistributorRouter = require('../src/distributor/routes.config');
const HierarchyRouter = require('../src/hierarchy/routes.config');
const ProductRouter = require('../src/product/routes.config');
const ProductblogRouter = require('../src/productblog/routes.config');
const ProductnewRouter = require('../src/productnew/routes.config');
const PromotionRouter = require('../src/promotion/routes.config');
const RedeemoptionRouter = require('../src/redeemoption/routes.config');
const RedeemRouter = require('../src/redeem/routes.config');
const RewardRouter = require('../src/reward/routes.config');
const SellRouter = require('../src/sell/routes.config');
const TransactionRouter = require('../src/transaction/routes.config');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const PORT = config.port || 8080;
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});
        
    
app.use(cors({
    origin:['http://localhost:8080'], 
    credentials:true
}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "WinAndWings API",
        version: "1.0.1",
        description: "WinAndWings API",
      },
      servers: [
        {
          url: "http://localhost:"+PORT,
        },
      ],
    },
    apis: ["./docs/*.yaml"],
  };
  
  const specs = swaggerJsDoc(options);
  app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.json())


    
function postTrimmer(req, res, next) {
    
    if (req.method === 'POST' || req.method === 'PATCH') {
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof(value) === 'string')
                req.body[key] = value.trim();
        }
    }
    if (req.method === 'GET') {
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof(value) === 'string')
                req.query[key] = value.trim();
        }
    }
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,  uniqueSuffix+'.'+file.originalname)
    }
    })
    
const multerMid = multer({
    storage: storage,
    // dest: 'files/',
    limits: {
        // no larger than 5mb.
        fileSize: 2 * 1024 * 1024,
    },
    });
app.use(multerMid.single('uploadFile'));
app.use(postTrimmer);
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
CategoriesRouter.routesConfig(app);
CurrenciesRouter.routesConfig(app);
DistributorRouter.routesConfig(app);
HierarchyRouter.routesConfig(app);
ProductRouter.routesConfig(app);
ProductblogRouter.routesConfig(app);
ProductnewRouter.routesConfig(app);
PromotionRouter.routesConfig(app);
RedeemoptionRouter.routesConfig(app);
RedeemRouter.routesConfig(app);
RewardRouter.routesConfig(app);
SellRouter.routesConfig(app);
TransactionRouter.routesConfig(app);
app.use(express.static('uploads'))
module.exports = app;