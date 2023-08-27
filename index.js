
const config = require('./common/config/env.config.js');
var path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
global.appRoot = path.resolve(__dirname);
const PORT = config.port || 8080;
const app = require('./server');
app.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));
    