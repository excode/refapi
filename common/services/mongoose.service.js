const mongoose = require('mongoose');
const config = require('../config/env.config.js');
let count = 0;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
//&retrywrites=false
const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
   
    
    mongoose.connect(config.dbConfig, config.dbOptions).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log(err);
        console.log("==================");
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. '+config.dbConfig, ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
