exports.getNowUTC = (deductSecends=0) => {
    var now = new Date;
    var utc_timestamp = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate() , 
    now.getHours(), now.getMinutes(), now.getSeconds()-deductSecends, now.getMilliseconds());

    return utc_timestamp;
};
exports.getTime =()=> {
  return new Date();
};
exports.addDays =(utc_date,daysToAdd)=> {
  var date=new Date(utc_date);
  var _24HoursInMilliseconds = 86400000;
  return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
};
exports.getDaysAgoUTC = (utc_date,days=0) => {
  var ago = this.addDays(utc_date,days)
  var utc_timestamp = Date.UTC(ago.getFullYear(),ago.getMonth(), ago.getDate() , 
  ago.getHours(), ago.getMinutes(), ago.getSeconds(), ago.getMilliseconds());

  return utc_timestamp;
};
exports.randomText =(length)=> {
  var result           = '';
  //var characters       = 'abcdefghjklmnpqrstuvwxyz0123456789';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.handleValidationError=(err, consoleLog = false)=>{
    const messages = []
    console.log("########");
    console.log(err);
    for (let field in err.errors) {
      messages.push(err.errors[field].message)
      consoleLog && console.log(err.errors[field].message)
    }
    //res.status(422).send({ messages })
    return messages.join(",");
  };


exports.randomNumber=(length)=>{
  //return "123456";
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
};

exports.productConfig =()=>{
  return {
    transfer_type: {
      type: Number,
      required:true,
      default:0
    },
    transaction_fees: {
      type: Number,
      required:true,
      default:1.5
    },
   //referral_bonus: {
     // type: Number,
      //required:false
   // },
    min_reward_purchase: {
      type: Number,
      required:true,
      default:1
    },
    redeem_fraction_allowed:{
      type: Boolean,
      required:true,
      default:false
    },
    min_redeem:{
      type: Number,
      required:true,
      default:25
    },
    reward_percentage:{
      type: Number,
      required:true,
      default:5.0
    },
    reward_expires_days:{
      type: Number,
      required:true,
      default:365
    },
    level_1:{
      type: Number,
      required:false,
      default:5
    },
    level_2:{
      type: Number,
      required:false,
      default:2
    },
    level_3:{
      type: Number,
      required:false,
      default:1
    },
    level_4:{
      type: Number,
      required:false,
      default:0.5
    },
    level_5:{
      type: Number,
      required:false,
      default:0.25
    },
  }
};
exports.levelConfig =()=>{
  return {
    name: {
      type: String,
      required:true
    },
    reward: {
      type: Number,
      required:true
    },
    from: {
      type: Number,
      required:true
    },
    to: {
      type: Number,
      required:true
    }
  }
};
exports.levelConfigData =()=> [
    {name:'Basic',from:1000,to:10000,reward:1},
    {name:'Gold',from:10001,to:50000,reward:1.5},
    {name:'Platinum',from:50001,to:500000000,reward:3.0}
  ];
exports.docLastUpdate =()=>{
  return {
    attachments: {
      type: Number,
      default:0
    },
    distributor: {
      type: Number,
      default:0
    },
    hierarchy: {
      type: Number,
      default:0
    },
    redeem: {
      type: Number,
      default:0
    },
    reward: {
      type: Number,
      default:0
    },
    sell: {
      type: Number,
      default:0
    },
    transaction: {
      type: Number,
      default:0
    }
  }
};
exports.docsList =()=>{
const docs = ['files','distributor','hierarchy','redeem','reward','sell','transaction','category'];
var returnObj =[];
docs.forEach(doc=>{
  var obj={
    docName: doc,
    lastUpdate:0,
    sync:0,
  }
  returnObj.push(obj);
});
  return returnObj;
};
exports.docObj =()=>{
  return {
    docName: {
      type: String,
      default:''
    },
    lastUpdate: {
      type: Number,
      default:0
    }
  }
};
exports.docsListProduct =()=>{
  const docs = ['product','productblog','productnews','redeemoption','promotion'];
  var returnObj =[];
  docs.forEach(doc=>{
    var obj={
      docName: doc,
      lastUpdate:0,
      sync:1,
    }
    returnObj.push(obj);
  });
    return returnObj;
  };
  
exports.fileSection =(section)=>{
  const docs = ['profile','sell','redeem','productphotos','category','redeemoption','product','distributor','productblog','productnews','promotion'];
  
    return docs.indexOf(section);
  };
  
exports.locationMap =()=>{
  return {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default:[0,0]
    }
  }
};
