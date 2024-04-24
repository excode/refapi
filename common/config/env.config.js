require('dotenv').config();
const  env  = process.env;
//console.log(env.DB_HOST)
let  host = env.DB_HOST || "localhost";
let  port = env.DB_PORT || "27017";
let  user = env.DB_USER || "winandwings";
let  pass = env.DB_PASSWORD|| "123456";
let  db_name = env.DB_NAME|| "winandwings";
    module.exports = {
        "port": 8080,
        "jwt_secret": "654321",
        "jwt_expiration_in_seconds": 6000,
        "environment": "dev",
        "permissionLevels": {
            "NORMAL_USER": 3,
            "ADMIN_USER": 2,
            "SUPER_ADMIN": 1
        },
        "postmark":"feffdb2f-233d-44a1-984b-a2a361394b85",
        "dbConfig":"mongodb+srv://"+user+":"+pass+"@"+host+"/"+db_name+"?retryWrites=true&w=majority", 
        //let url ="mongodb+srv://mypaaa:MYpaaaHelpMeAllah*^@cluster1.omck1.mongodb.net/winandwings?retryWrites=true&w=majority";
        //"dbConfig":"mongodb://"+host+":"+port+"/winandwings", 
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
    