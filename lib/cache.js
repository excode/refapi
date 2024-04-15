const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 });

exports.verifyCache = (req, res, next) => {
    try {
      const { list_name } = req.params;
      console.log(list_name);
      if (cache.has(list_name)) {
        console.log("Cached DATA:"+list_name);
        return res.status(200).json(cache.get(list_name));
      }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  };

  exports.setListName = (listName) => {
   
    return function(req, res, next) {
        req.params.list_name = listName;
         next();
      }
    
  };
  

  exports.setCache = (listName,data) => {
   
    cache.set(listName, data);
         
    
  };
  exports.resetCache = (listName) => {
   
    cache.del(listName);
         
    
  };