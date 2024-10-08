require('dotenv').config();
const  env  = process.env;
//console.log(env.DB_HOST)
let  host = env.DB_HOST || "localhost";
let  port = env.DB_PORT || "27017";
let  user = env.DB_USER || "winandwings";
let  pass = env.DB_PASSWORD|| "123456";
let  db_name = env.DB_NAME|| "winandwings";
    module.exports = {
        "port": env.PORT ||8080,
        "jwt_secret": "654321",
        "jwt_expiration_in_seconds": 6000,
        "environment": "dev",
        "permissionLevels": {
            "NORMAL_USER": 3,
            "ADMIN_USER": 2,
            "SUPER_ADMIN": 1
        },
        "postmark":env.POSTMARK,
        "dbConfig":"mongodb+srv://"+user+":"+pass+"@"+host+"/"+db_name+"?retryWrites=true&w=majority", 
        
        "dbOptions":{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false, // If not connected, return errors immediately rather than waiting for reconnect
          }
        //   "dbOptions":{
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true,
        //     autoIndex: false, // Don't build indexes
        //     reconnectTries: 30, // Retry up to 30 times
        //     reconnectInterval: 500, // Reconnect every 500ms
        //     poolSize: 10, // Maintain up to 10 socket connections
        //     // If not connected, return errors immediately rather than waiting for reconnect
        //     bufferMaxEntries: 0
        //     }
    
    };
    