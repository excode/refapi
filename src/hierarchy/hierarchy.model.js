const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
//var ObjectId = require('mongodb').ObjectID;
const funcs =  require("../../common/functions/funcs");
jwt = require("jsonwebtoken");
const jwtSecret = require("../../common/config/env.config.js").jwt_secret
const RewardModel = require('../../src/reward/reward.model.js');
const {queryFormatter,queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array} = require("../../common/functions/queryutilMongo")
    const infoSchema = new Schema({
        leftTotal:{ type: Number,default:0},
        rightTotal:{ type: Number,default:0},
        leftCurrent:{ type: Number,default:0},
        rightCurrent:{ type: Number,default:0},
        total:{ type: Number,default:0},
        totalCurrent:{ type: Number,default:0},
        currentMonth:{ type: Number,default:0},
        currentYear:{ type: Number,default:0},
        placementDone:{ type: Boolean,default:false},
        placementRequired:{ type: Boolean,default:false},
        price:{ type: Number,default:0},
        category:{ type: String,default:"FP"},
        directReferral:{ type: Number,default:0},
    });
    const hierarchySchema = new Schema({
    updateBy : { type: String},
    updateAt : { type: Date},
    createBy : { type: String,default:''},
    createAt : { type: Date},
    walletbalance : { type: Number,required:true,default:0},
    rewardbalance : { type: Number,required:true,default:0},
    distributor : { type:Boolean,required:true,default:false},
    contactNumber : { type: String,required:true,default:''},
    productid : {type: Schema.Types.ObjectId, ref: 'Product'},
    category : {type: String,default:''},
    introducer : { type: String,default:''},
    position : { type: String,default:''},
    upline : { type: String,default:''},
    leftChild:{ type: String,default:null},
    rightChild:{ type: String,default:null},

    lastPositionPlacement:{ type: String,default:null},
    infoData:{type:infoSchema,default:null}
});

hierarchySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
hierarchySchema.set('toJSON', {
    virtuals: true
});

hierarchySchema.findById = function (cb) {
    return this.model('Hierarchy').find({id: this.id}, cb);
};

const Hierarchy = mongoose.model('Hierarchy', hierarchySchema);


exports.findById = (id,extraField) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return Hierarchy.findOne(queries)
        .populate({path:'productid',select:'_id productname'})
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};
exports.find = (query) => {
    return new Promise((resolve, reject) => {
        Hierarchy.find(query, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        Hierarchy.findOne(query, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
exports.createHierarchy = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   uplineCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.introducer,productid:productID})
    if(!uplineCheck ) {
        reject("introducer not exists");
        return;
    }
    let   regCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.contactNumber,productid:productID})
    if(regCheck ) {
        reject("user already exists");
        return;
    }
    
    const hierarchy = new Hierarchy(hierarchyData);
    hierarchy.save(function (err, saved) {
        if (err) {
            return reject(err);
        }
        
        resolve(saved)
    });
    });
};

exports.addNewUserCheck = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   uplineCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.introducer,productid:productID})
    if(!uplineCheck ) {
        reject("introducer not exists");
        return;
    }
    let   regCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.contactNumber,productid:productID})
    if(regCheck ) {
        reject("user already exists");
        return;
    }
    resolve("OK")
   
    });
};

exports.placement = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   introCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.introducer,productid:productID})
    if(!introCheck ) {
        reject("introducer not exists");
        return;
    }
    let   regCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.contactNumber,productid:productID})
    if(!regCheck ) {
        reject("user not exists");
        return;
    }else{
       if(regCheck.infoData.placementDone){
        reject("user already  exists");
        return;
       }
    }
    let   uplineCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.upline,productid:productID})
    if(!uplineCheck ) {
        reject("upline not exists");
        return;
    }
    let introUsername=hierarchyData.introducer.toLowerCase();
    let iUpline =hierarchyData.upline.toLowerCase();
    let nxUpline = uplineCheck["upline"].toLowerCase()
    let sameFamily = introUsername == iUpline ;
    if(!sameFamily){
        sameFamily = introUsername == nxUpline  ;
    }
    if(!sameFamily){
        sameFamily = await checkUplines(introUsername,nxUpline,productID) ;
    }
    if(!sameFamily){
        console.log(introUsername)
        console.log(iUpline)
        console.log(nxUpline)
        reject("Not from same family");
        return;
    }

    //await checkUplines(hierarchyData.introducer)
    let left =uplineCheck["leftChild"]??""
    let right =uplineCheck["rightChild"]??""
    if(hierarchyData.position=="L" &&  left!=""){
        reject("Left position already occupied "+left);
        return;
    }
    if(hierarchyData.position=="R" && right!="") {
        reject("Right position already occupied "+right);
        return;
    }
    if(hierarchyData.position=="L"){
        uplineCheck.leftChild = hierarchyData.contactNumber
    }else if(hierarchyData.position=="R"){
        uplineCheck.rightChild = hierarchyData.contactNumber
    }
    regCheck.upline = uplineCheck.contactNumber;
    regCheck.infoData.placementDone = true;
    regCheck.position=hierarchyData.position;
    await uplineCheck.save();
    await regCheck.save();
    await this.updatePlacements(hierarchyData.contactNumber,iUpline,productID,hierarchyData.position)
    resolve("OK")
   
    });
};

exports.list = (perPage, page , query ) => {
        var _query={};
        let sortBy='_id'
        let sortDirection=-1
        
    if(query.updateBy){
        let updateBy_= queryBuilder_string(query,'updateBy');
        _query={..._query,...updateBy_}
    }


        if(query.updateAt){
            let updateAt_= queryBuilder_date(query,'updateAt');
            _query={..._query,...updateAt_}
        }
        if(query.updateAt_array){
            let updateAt_a= queryBuilder_range_array(query,'updateAt',"date");
            _query={..._query,...updateAt_a}
        }

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
    
    

    if(query.createBy){
        let createBy_= queryBuilder_string(query,'createBy');
        _query={..._query,...createBy_}
    }


        if(query.createAt){
            let createAt_= queryBuilder_date(query,'createAt');
            _query={..._query,...createAt_}
        }
        if(query.createAt_array){
            let createAt_a= queryBuilder_range_array(query,'createAt',"date");
            _query={..._query,...createAt_a}
        }
    
    

    if(query.walletbalance!=null ){
      if(!isNaN(query.walletbalance)){
        let walletbalance_= queryBuilder_number(query,'walletbalance');
        _query={..._query,...walletbalance_}
     }
    }
    if(query.walletbalance_array){
        let walletbalance_a= queryBuilder_range_array(query,'walletbalance',"number");
        _query={..._query,...walletbalance_a}
    }



    if(query.rewardbalance!=null ){
      if(!isNaN(query.rewardbalance)){
        let rewardbalance_= queryBuilder_number(query,'rewardbalance');
        _query={..._query,...rewardbalance_}
     }
    }
    if(query.rewardbalance_array){
        let rewardbalance_a= queryBuilder_range_array(query,'rewardbalance',"number");
        _query={..._query,...rewardbalance_a}
    }



    if(query.distributor!=null){
        _query['distributor'] = query.distributor 
    }
            

    if(query.contactNumber){
        let contactNumber_= queryBuilder_string(query,'contactNumber');
        _query={..._query,...contactNumber_}
    }


    if(query.introducer){
        let introducer_= queryBuilder_string(query,'introducer');
        _query={..._query,...introducer_}
    }

    if(query.upline){
        let upline_= queryBuilder_string(query,'upline');
        _query={..._query,...upline_}
    }


    if(query.leftChild){
        let leftChild_= queryBuilder_string(query,'leftChild');
        _query={..._query,...leftChild_}
    }
    if(query.position){
        let position_= queryBuilder_string(query,'position');
        _query={..._query,...position_}
    }
    if(query.rightChild){
        let rightChild_= queryBuilder_string(query,'rightChild');
        _query={..._query,...rightChild_}
    }

    if(query.category){
        let category_= queryBuilder_string(query,'category');
        _query={..._query,...category_}
    }


        if(query.sortBy){
            sortBy = query.sortBy;
        }
        if(query.sortDirection){
            sortDirection = query.sortDirection;
        }
        var sortBoj={[sortBy]:sortDirection};
        console.log(_query)
        return new Promise((resolve, reject) => {

        Hierarchy.find(_query)
            .populate({path:'productid',select:'_id productname'})
            .limit(perPage)
            .sort(sortBoj)
            .skip(perPage * page)
            .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                    Hierarchy.countDocuments(_query).exec().then((total)=>{
                        const promises = { docs: hierarchy , count: total ,perpage:perPage,page:page };
                        resolve(promises);
                    }).catch((err2)=>{
                        reject(err2);
                    })
                }
            })
    });
};
exports.listAll = ( query={} ) => {
    var _query={...query};
    let sortBy='_id'
    let sortDirection=-1
    let max_limit = 300;
    if(query.sortBy){
        sortBy = query.sortBy;
    }
    if(query.sortDirection){
        sortDirection = query.sortDirection;
    }
    var sortBoj={[sortBy]:sortDirection};
    return new Promise((resolve, reject) => {
    Hierarchy.find(_query)
        .limit(max_limit) 
        .sort(sortBoj)
        .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                resolve(hierarchy);
                }
            })
    });
};
exports.listSuggestions = (query ) => {
    var { search, ...queryWithoutSearch } = query
    var _query=queryWithoutSearch
    if(search){
        _query['$or'] =[ 
            {"contactNumber": {$regex: search, $options: "i"}},
				{"introducer": {$regex: search, $options: "i"}}
        ]
    }
    return new Promise((resolve, reject) => {
        Hierarchy.find(_query)
            .exec(function (err, hierarchy) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hierarchy);
                }
            })
    });
};
exports.patchHierarchy = (id, hierarchyData,extraField={}) => {
    
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:id}
    return new Promise((resolve, reject) => {
        
        Hierarchy.findOne(queries, function (err, hierarchy) {
            if (err) reject(err);
            for (let i in hierarchyData) {
                hierarchy[i] = hierarchyData[i];
            }
            hierarchy.save(function (err, updatedHierarchy) {
                if (err) return reject(err);
                resolve(updatedHierarchy);
            });
        });
    })

};

exports.removeById = (hierarchyId,extraField={}) => {
    var extraQuery =queryFormatter(extraField);
    var queries = {...extraQuery,_id:hierarchyId}
    return new Promise((resolve, reject) => {
        Hierarchy.findOneAndDelete(queries, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};



exports.isIntroduction = (Seller,Buyer,ProductId,req,isDistributor=0) => {
    const now = funcs.getNowUTC();
        return new Promise((resolve, reject) => {
        this.getUserWinBalance(Buyer,ProductId).then(wallet=>{
            console.log("AAAAA")
        if(wallet == null){
            let data = {} ;
        var NewBalance = 0 ;
        data['minfo']  = jwt.sign(NewBalance, jwtSecret ); 
        data['rinfo']  = jwt.sign(NewBalance, jwtSecret + "_r"); 
        data['walletbalance'] = NewBalance ;
        data['rewardbalance'] = NewBalance ;
        data['updateTime'] = now ;
        data['insertTime'] = now ;
        data['contactNumber'] = Buyer ;
        data['productid'] = ProductId ;
        data['introducer'] = Seller ;
        data['distributor'] = isDistributor ;
        data['createAt']=funcs.getTime()
        data['createBy']=req.jwt.email

        this.createHierarchy(data).then(save=>{
            //console.log(save);
            resolve(save);
        }).catch(err=>{
            reject(err);
        }) ;
        }else{
            resolve(true);
        }
      }).catch(err2=>{
        reject(err2);
      });  
     });
  };

  exports.getUserWinBalance = (userId, productId ) => {
    const uId = mongoose.Types.ObjectId(productId);
    const _query={productid:uId,contactNumber:userId};
    console.log("STEP 1111");
    console.log(_query);
      return new Promise((resolve, reject) => {
        Hierarchy.findOne(_query)
              .select('walletbalance rewardbalance minfo rinfo tcode distributor _id')
              .exec(function (err, wallet) {
                  if (err) {
                      reject(err);
                  } else {
                    //console.log("VVVVV")
                     // console.log(wallet);
                    if(wallet!=null){

                    
                    var result = {
                        id : wallet._id,
                        Wallet: wallet.walletbalance ,
                        Reward: wallet.rewardbalance,
                        Encry: wallet.minfo,
                        TCode: wallet.tcode,
                        Distributor: wallet.distributor
                    }
                    resolve(result);
                  }else{
                    resolve(null);
                  }
                  }
              })
      });
  };

  exports.addWallets = (Seller,Buyer,ProductId,req,isDistributor=0) =>{
    return new Promise((resolve, reject) =>{

    this.isIntroduction(Seller,Buyer,ProductId,req,isDistributor).then(done=>{
       // UserModel.updateSyncTime([Seller,Buyer],"hierarchy").then(done2=>{
            resolve(done);
       // });
    }).catch(err2=>{
        reject(err2);
    });
 });
};

async function placeUserRecursively(introducer,productId,parentUsername, newUser,checkFirst="") {
    let product_id= mongoose.Types.ObjectId( productId);
    
    try {
      // Find the parent user by username
      const query={ contactNumber: parentUsername,productid:product_id }
      const introquery={ contactNumber: introducer,productid:product_id }
      const parentUser = await Hierarchy.findOne(query);
  
      if (!parentUser) {    
        console.log(query);       
        console.log('Parent user not found');
        return;
      }
      let lastPositionPlacement=parentUser.lastPositionPlacement??"L";
      if(checkFirst==""){
        checkFirst=lastPositionPlacement=="L"?"R":"L";
      }
    let positionPriority=['leftChild','rightChild']
    if(checkFirst=="R"){
        positionPriority=['rightChild','leftChild'];
    }

      const query2={ contactNumber: newUser.contactNumber,productid:product_id }
      const User = await Hierarchy.findOne(query2);
  
      if (User) {    
        console.log(query2);       
        console.log('Username Already available');
        return;
      }
  
      // Try to place the user in the left position
      if (!parentUser[positionPriority[0]]) {
        let position = positionPriority[0]=='leftChild'?"L":"R"
        parentUser.updateBy = newUser.createBy;
        parentUser.updateAt = newUser.createAt;
        parentUser[positionPriority[0]] = newUser.contactNumber;
        parentUser.lastPositionPlacement=position;
        newUser.introducer = introducer;
        newUser.position = position;
        newUser.upline = parentUser.contactNumber;
        const intoUser = await Hierarchy.findOne(introquery);
        intoUser.lastPositionPlacement=position;
        await intoUser.save();
       // console.log(newUser)
        //console.log(parentUser)
        await newUser.save();
        await parentUser.save();
        console.log(`User placed on the ${position} of ${parentUser.contactNumber}`);
        return;
      } else if (!parentUser[positionPriority[1]]) {
        let position = positionPriority[1]=='leftChild'?"L":"R"
        parentUser[positionPriority[1]]  = newUser.contactNumber;
        parentUser.updateBy = newUser.createBy;
        parentUser.updateAt = newUser.createAt;
        parentUser.lastPositionPlacement=position;
        newUser.introducer = introducer;
        newUser.position = position;
        newUser.upline = parentUser.contactNumber;
        const intoUser = await Hierarchy.findOne(introquery);
        intoUser.lastPositionPlacement=position;
        await intoUser.save();
        await newUser.save();
        await parentUser.save();
        console.log(`User placed on the ${position} of ${parentUser.contactNumber}`);
        return;
      } 
      
      // If both left and right positions are occupied, recursively try to place the user under the left child
else {
     let netxPosition = checkFirst=='L'?"R":"L"
     let netxPositionFiled = checkFirst=='L'?"rightChild":"leftChild"
        await placeUserRecursively(introducer,productId,parentUser[netxPositionFiled], newUser,netxPosition);
  
      }
  
    } catch (error) {
      console.error('Error placing user recursively:', error);
    }
  }
  
  // Function to add a new user to the MLM system
  exports.addNewUser=async(data) =>{
    const {createBy,createAt,username, productid, parentUsername}=data;
    try {
      // Create the new user object
      const newUser = new Hierarchy({
        createBy : createBy,
        createAt : createAt,
        walletbalance : 0,
        rewardbalance : 0,
        distributor : false,
        contactNumber : username,
        productid : productid,
        introducer : parentUsername,
      });
  
      
      await placeUserRecursively(parentUsername,productid,parentUsername, newUser);
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  }
  

  exports.getUsersIntroducedBy=async(introducerName,productId, currentLevel = 1, maxLevel = 10, users = [])=> {
    if (currentLevel > maxLevel) return users;
    let productid =  mongoose.Types.ObjectId(productId);
    if(users.length==0){
        users.push({
            "id": "",
            "level": 0,
            "username": introducerName,
            "parentId": ""
          })
    }
    try {
        // Find users introduced by the current introducer

        const introducedUsers = await Hierarchy.find({ introducer: introducerName,productid:productid });

        // Add the introduced users to the list
       

        // Recursively fetch users introduced by each user in this level
        for (let user of introducedUsers) {
            users.push({id:user._id,level:currentLevel,username:user.contactNumber,parentId:introducerName});
            await this.getUsersIntroducedBy(user.contactNumber,productId, currentLevel + 1, maxLevel, users);
        }

        return users;
    } catch (error) {
        console.error('Error fetching introduced users:', error);
        return [];
    }

}


exports.getBinaryData=async(userId,productId, currentLevel = 1, maxLevel = 10, binaryUsers = [])=> {
    if (currentLevel > maxLevel || !userId) return binaryUsers;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find the current user by userId
        const currentUser = await Hierarchy.findOne({contactNumber:userId,productid:productid});

        if (!currentUser) {
            console.log(`User not found at level ${currentLevel}`);
            return binaryUsers;
        }

        // Add the current user to the list
        binaryUsers.push(currentUser);

        console.log(`Fetched user at level ${currentLevel} - ${currentUser._id}`);

        // Recursively fetch left and right children
        if (currentUser.leftChild) {
            await getBinaryData(currentUser.leftChild,productId, currentLevel + 1, maxLevel, binaryUsers);
        }
        if (currentUser.rightChild) {
            await getBinaryData(currentUser.rightChild,productId, currentLevel + 1, maxLevel, binaryUsers);
        }

        return binaryUsers;
    } catch (error) {
        console.error('Error fetching binary data:', error);
        return [];
    }
}

exports.buildHierarchy=async(userId,productId, currentLevel = 1, maxLevel = 3)=> {
    if (currentLevel > maxLevel || !userId) return null;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find the current user by userId

        const currentUser = await Hierarchy.findOne({contactNumber:userId,productid:productid});

        if (!currentUser) {
            console.log(`User not found at level ${currentLevel}`);
            return null;
        }

        // Construct the hierarchical node with id, name, and title (adjust fields as needed)
        const node = {
            id: currentUser._id.toString(),
            name: currentUser.contactNumber || 'Unknown', // Use a field for the name, adjust as needed
            leftTotal: currentUser.infoData.leftTotal || '0', 
            rightTotal: currentUser.infoData.rightTotal || '0',
            leftCurrent: currentUser.infoData.leftCurrent || '0', 
            rightCurrent: currentUser.infoData.rightCurrent || '0', // Use a field for the name, adjust as needed
            //title: currentUser.name || 'Unknown Title', // Use the position field for the title
           left:[],
           right:[]
        };

        // Recursively fetch children from leftChild and rightChild
        if (currentUser.leftChild) {
            const leftChildNode = await this.buildHierarchy(currentUser.leftChild,productId, currentLevel + 1, maxLevel);
            if (leftChildNode) {
                node.left.push(leftChildNode);
            }
        }

        if (currentUser.rightChild) {
            const rightChildNode = await this.buildHierarchy(currentUser.rightChild,productId, currentLevel + 1, maxLevel);
            if (rightChildNode) {
                node.right.push(rightChildNode);
            }
        }

        // Return the node with its children
        return node;
    } catch (error) {
        console.error('Error building hierarchy:', error);
        return null;
    }
}


exports.getUsersIntroducedBy2=async(introducerName,productId, currentLevel = 0, maxLevel = 10)=> {
    
    if (currentLevel > maxLevel) return null;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find users introduced by the current introducer
        const introducedUsers = await Hierarchy.find({ introducer: introducerName,productid:productid });

        const node = {
            name: introducerName || 'Unknown', // Use a field for the name, adjust as needed
            //title: currentUser.name || 'Unknown Title', // Use the position field for the title
           children:[],
           level:currentLevel
        };
       

        // Recursively fetch users introduced by each user in this level
        for (let user of introducedUsers) {
            const children = await this.getUsersIntroducedBy2(user.contactNumber,productId, currentLevel + 1, maxLevel);
            if (children) {
                node.children.push(children);
            }
        }

        return node;
    } catch (error) {
        console.error('Error fetching introduced users:', error);
        return [];
    }
}

exports.getUsersIntroducedBy3=async(introducerName,productId, currentLevel = 0, maxLevel = 10)=> {
    
    if (currentLevel > maxLevel) return null;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find users introduced by the current introducer
        const introducedUsers = await Hierarchy.find({ introducer: introducerName,productid:productid });
        /*
    key: '0',
    label: 'Documents',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
        */
        const node = {
            key:"k-"+introducerName,
            icon: 'pi pi-fw pi-inbox',
            data: currentLevel==0?"":" lvl "+currentLevel,
            label: introducerName || 'Unknown', // Use a field for the name, adjust as needed
            //title: currentUser.name || 'Unknown Title', // Use the position field for the title
           children:[],
        };
       

        // Recursively fetch users introduced by each user in this level
        for (let user of introducedUsers) {
            const children = await this.getUsersIntroducedBy3(user.contactNumber,productId, currentLevel + 1, maxLevel);
            if (children) {
                node.children.push(children);
            }
        }

        return node;
    } catch (error) {
        console.error('Error fetching introduced users:', error);
        return [];
    }
}

exports.buildHierarchy2=async(userId,productId, currentLevel = 1, maxLevel = 3)=> {
    if (currentLevel > maxLevel || !userId) return null;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find the current user by userId

        const currentUser = await Hierarchy.findOne({contactNumber:userId,productid:productid});

        if (!currentUser) {
            console.log(`User not found at level ${currentLevel}`);
            return null;
        }

        // Construct the hierarchical node with id, name, and title (adjust fields as needed)
        const node = {
            id: currentUser._id.toString(),
            name: currentUser.contactNumber || 'Unknown', // Use a field for the name, adjust as needed
            leftTotal: currentUser.infoData?.leftTotal || '0', 
            position:currentUser.position || 'L', 
            rightTotal: currentUser.infoData?.rightTotal || '0',
            leftCurrent: currentUser.infoData?.leftCurrent || '0', 
            rightCurrent: currentUser.infoData?.rightCurrent || '0', // Use a field for the name, adjust as needed
            //title: currentUser.name || 'Unknown Title', // Use the position field for the title
           children:[],
    
        };
        let newLevel=currentLevel + 1
        // Recursively fetch children from leftChild and rightChild
        if (currentUser.leftChild) {
            const leftChildNode = await this.buildHierarchy2(currentUser.leftChild,productId, newLevel, maxLevel);
            if (leftChildNode) {
                node.children.push(leftChildNode);
            }
        }

        if (currentUser.rightChild) {
            const rightChildNode = await this.buildHierarchy2(currentUser.rightChild,productId, newLevel, maxLevel);
            if (rightChildNode) {
                if(node.children.length==0){
                    node.children.push({})  
                }
                node.children.push(rightChildNode);
            }
        }
        if(node.children.length==1){
            node.children.push({})  
        }

        // Return the node with its children
        return node;
    } catch (error) {
        console.error('Error building hierarchy:', error);
        return null;
    }
}
exports.buildHierarchyCount=async(userId,productId,left=0,right=0, currentLevel = 1, maxLevel = 3)=> {
    if (currentLevel > maxLevel || !userId) return null;
    let productid =  mongoose.Types.ObjectId(productId);
    try {
        // Find the current user by userId

        const currentUser = await Hierarchy.findOne({contactNumber:userId,productid:productid});

        if (!currentUser) {
            console.log(`User not found at level ${currentLevel}`);
            return null;
        }

        // Construct the hierarchical node with id, name, and title (adjust fields as needed)
       
        let newLevel=currentLevel + 1
        // Recursively fetch children from leftChild and rightChild
        if (currentUser.leftChild) {
            left=left+1;
            const leftChildNode = await this.buildHierarchyCount(currentUser.leftChild,productId,left,right,newLevel);
            
        }

        if (currentUser.rightChild) {
            right=right+1;
           
            const rightChildNode = await this.buildHierarchyCount(currentUser.rightChild,productId, left,right,newLevel);
            
        }

        

        // Return the node with its children
        return node;
    } catch (error) {
        console.error('Error building hierarchy:', error);
        return null;
    }
}
const countChildren = async (username,productId) => {
  let count = 0;
 // let productid =  mongoose.Types.ObjectId(productId);

 const query={contactNumber:{ $regex: new RegExp('^' + username + '$', 'i') },productid:productId};
 //console.log(query)
  const user = await Hierarchy.findOne(query);
  if (!user) {
    return count;
  }

 
  if (user.leftChild) {
    count += 1; // Count the left child
    count += await countChildren(user.leftChild,productId); // Recursively count left child's downline
  }

  // Count users in the right subtree
  if (user.rightChild) {
    count += 1; // Count the right child
    count += await countChildren(user.rightChild,productId); // Recursively count right child's downline
  }

  return count;
 
};

exports.countLeftAndRightDownline = async (username,productid) => {
    const query={contactNumber:username,productid:productid};
    //console.log(query)
    const user =  await Hierarchy.findOne(query);
    if (!user) {
      console.log(`User ${username} not found`);
      return;
    }
  
    // Get the count of downline for left and right side
    const leftCount = await countChildren(user.leftChild,productid);
    const rightCount = await countChildren(user.rightChild,productid);
  
    console.log(`User ${username} has ${leftCount} users on the left and ${rightCount} users on the right.`);
    return {left:leftCount,right:rightCount}
  };
async function checkUplines(root,upline,productId) {
   
    
    try {
    
      const introquery={ contactNumber: upline,productid:productId }
      const parentUser = await Hierarchy.findOne(introquery);
  
      if (!parentUser || parentUser["upline"]==="") {    
        console.log(introquery);   
        console.log(parentUser);        
        console.log('Parent user not found');
        return false;
      }else{
        if(parentUser["upline"].toLowerCase()==root.toLowerCase()){
            return true;
        }else{
            return await checkUplines(root,parentUser["upline"],productId)
        }
      }
    } catch (error) {
        console.error('Error adding new user:', error);
        return false;
      }
      
  }
  
  // Function to add a new user to the MLM system
  exports.addNewUser=async(data) =>{
    const {createBy,createAt,username, productid, parentUsername}=data;
    try {
      // Create the new user object
      const newUser = new Hierarchy({
        createBy : createBy,
        createAt : createAt,
        walletbalance : 0,
        rewardbalance : 0,
        distributor : false,
        contactNumber : username,
        productid : productid,
        introducer : parentUsername,
      });
  
      
      await placeUserRecursively(parentUsername,productid,parentUsername, newUser);
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  }


  exports.rewardUplines=async(root,upline,productId,amount,rewards=[],limit=10) =>{
   
    
    try {
    console.log(root)
      const introquery={ contactNumber: upline,productid:productId }
      console.log(introquery)
      const parentUser = await Hierarchy.findOne(introquery);
       
      if (!parentUser || parentUser["contactNumber"]==="") {    
        console.log(introquery);   
        console.log(parentUser);        
        console.log('Parent user not found');
        return rewards;
      }else{
        const time = funcs.getTime();
        
        if(rewards.length==0){
            let sponsorReward=amount==2?50:15;
            const reward1={
            
                createBy : 'ALIF-PAY',
                createAt : time,
                level :0 ,
                amount : sponsorReward,
                status : 0,
                productid : productId,
                contactNumber :  parentUser["contactNumber"],
                ref : "Sponsor",
                sourceContactNumber : root,
                particular : "Sponsor reward",
                type : "0"
        
             };
        rewards.push(reward1);
        }
        let level =rewards.length;
        const reward={
            
                createBy : 'ALIF-PAY',
                createAt : time,
                level :level ,
                amount : amount,
                status : 0,
                productid : productId,
                contactNumber :  parentUser["contactNumber"],
                ref : "Level",
                sourceContactNumber : root,
                particular : "Level reward:"+level,
                type : "0"
        
        };
        rewards.push(reward);
        if(rewards.length<=limit){
            const rewards_= await this.rewardUplines(root,parentUser["introducer"],productId,amount,rewards,limit)
            return rewards_
        }else{
            return rewards
        }

      }
    } catch (error) {
       // console.error('Error adding new user:', error);
        return rewards;
      }
      
  }
  function checkInteger(value) {
    // Check if value is a valid integer using Number.isInteger()
    if (Number.isInteger(value)) {
      return value;
    }
    // If not an integer, return 0
    return 0;
  }
  
  exports.updatePlacements=async(root,upline,productId,position="L") =>{
   
    
    try {
        let upline_="leftChild";
        let all="leftTotal";
        let current="leftCurrent";
  
       if(position=="R"){
           upline_="rightChild";
           all="rightTotal";
           current="rightCurrent";
       }

      //const introquery={ [upline_]: upline,productid:productId }
      const introquery={ 'contactNumber': upline,productid:productId }
      console.log(introquery)
      const parentUser = await Hierarchy.findOne(introquery);
      
      if (!parentUser) {    
        
        return;
      }else{
        
        const allTime=checkInteger(parentUser.infoData[all])+1;
        const currentCount = checkInteger(parentUser.infoData[current])+1;
        //console.log(parentUser.infoData[all]+"  "+allTime)
        //console.log(parentUser.infoData[current]+" "+currentCount)
        let info =parentUser["infoData"].toObject();;
        //console.log(info)
        let infoData = {...info,[all]:allTime,[current]:currentCount}
        parentUser.infoData = infoData;
       // console.log("XXXX")
       // console.log(infoData)
        //console.log("XXXX")
        parentUser.save();
         await this.updatePlacements(root,parentUser["upline"],productId,parentUser["position"]);
      
        

      }
    } catch (error) {
        console.error('Error adding new user:', error);
        return null;
      }
      
  }

  exports.createHierarchyAlifPay = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   uplineCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.introducer,productid:productID})
    if(!uplineCheck ) {
        reject("introducer not exists");
        return;
    }
    let   regCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.contactNumber,productid:productID})
    if(regCheck ) {
        reject("user already exists");
        return;
    }
    let infoData={
        price:260,
        category:"FP",
        placementRequired:true,
        placementDone:false,
        directReferral:0
    }
    if(hierarchyData.price==50){
        infoData={
            price:50,
            category:"FC",
            placementRequired:false,
            placementDone:false,
            directReferral:0
        }
    }
    hierarchyData["infoData"] =infoData;
    const hierarchy = new Hierarchy(hierarchyData);
    hierarchy.save(async function (err, saved) {
        if (err) {
            return reject(err);
        }
        let rewards =[];

        /** */
        let info = uplineCheck["infoData"]
        let directReferral=info["directReferral"]??0;
        //let infoData = {...info,"directReferral": directReferral+1}
        //console.log(infoData)
        uplineCheck.infoData.directReferral = directReferral+1;
      
        uplineCheck.save();


        /**/
        if(hierarchyData.price==260){
            //"afia","phang2320","66e665de966efc2edaa97cf0","2",[],10
             rewards =await exports.rewardUplines(hierarchyData.contactNumber,hierarchyData.introducer,hierarchyData.productid,2,[],10);
        }else{
             rewards =await exports.rewardUplines(hierarchyData.contactNumber,hierarchyData.introducer,hierarchyData.productid,1,[],5);
        }
        console.log(rewards);
        if(rewards.length>0){
            await RewardModel.InsertMany(rewards)
        }
        
        resolve(saved)
    });
    });
};


exports.list2 = (perPage, page , query ) => {

    var _query={};
    let sortBy='_id'
    let sortDirection=-1
    
if(query.updateBy){
    let updateBy_= queryBuilder_string(query,'updateBy');
    _query={..._query,...updateBy_}
}


    if(query.updateAt){
        let updateAt_= queryBuilder_date(query,'updateAt');
        _query={..._query,...updateAt_}
    }
    if(query.updateAt_array){
        let updateAt_a= queryBuilder_range_array(query,'updateAt',"date");
        _query={..._query,...updateAt_a}
    }

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



if(query.createBy){
    let createBy_= queryBuilder_string(query,'createBy');
    _query={..._query,...createBy_}
}


    if(query.createAt){
        let createAt_= queryBuilder_date(query,'createAt');
        _query={..._query,...createAt_}
    }
    if(query.createAt_array){
        let createAt_a= queryBuilder_range_array(query,'createAt',"date");
        _query={..._query,...createAt_a}
    }



if(query.walletbalance!=null ){
  if(!isNaN(query.walletbalance)){
    let walletbalance_= queryBuilder_number(query,'walletbalance');
    _query={..._query,...walletbalance_}
 }
}
if(query.walletbalance_array){
    let walletbalance_a= queryBuilder_range_array(query,'walletbalance',"number");
    _query={..._query,...walletbalance_a}
}



if(query.rewardbalance!=null ){
  if(!isNaN(query.rewardbalance)){
    let rewardbalance_= queryBuilder_number(query,'rewardbalance');
    _query={..._query,...rewardbalance_}
 }
}
if(query.rewardbalance_array){
    let rewardbalance_a= queryBuilder_range_array(query,'rewardbalance',"number");
    _query={..._query,...rewardbalance_a}
}



if(query.distributor!=null){
    _query['distributor'] = query.distributor 
}
        

if(query.contactNumber){
    let contactNumber_= queryBuilder_string(query,'contactNumber');
    _query={..._query,...contactNumber_}
}


if(query.introducer){
    let introducer_= queryBuilder_string(query,'introducer');
    _query={..._query,...introducer_}
}

if(query.upline){
    let upline_= queryBuilder_string(query,'upline');
    _query={..._query,...upline_}
}


if(query.leftChild){
    let leftChild_= queryBuilder_string(query,'leftChild');
    _query={..._query,...leftChild_}
}
if(query.position){
    let position_= queryBuilder_string(query,'position');
    _query={..._query,...position_}
}
if(query.rightChild){
    let rightChild_= queryBuilder_string(query,'rightChild');
    _query={..._query,...rightChild_}
}

if(query.category){
    let category_= queryBuilder_string(query,'category');
    _query={..._query,...category_}
}


    if(query.sortBy){
        sortBy = query.sortBy;
    }
    if(query.sortDirection){
        sortDirection = query.sortDirection;
    }
    var sortBoj={[sortBy]:sortDirection};
    console.log(_query)
    return new Promise((resolve, reject) => {

    Hierarchy.find(_query)
        .populate({path:'productid',select:'_id productname'})
        .limit(perPage)
        .sort(sortBoj)
        .skip(perPage * page)
        .exec(function (err, hierarchy) {
            if (err) {
                reject(err);
            } else {
               // Hierarchy.countDocuments(_query).exec().then((total)=>{
                   // const promises = { docs: hierarchy , count: total ,perpage:perPage,page:page };
                    resolve(hierarchy);
               // }).catch((err2)=>{
                   // reject(err2);
               // })
            }
        })
});
};




exports.processRewardsAndUpdateWallet = async(contactNumber,productid) =>{
   
    const Reward = mongoose.model('Reward'); // Reward collection
    const Hierarchy = mongoose.model('Hierarchy');
    const session = await mongoose.startSession();

  try {
    session.startTransaction();
    var product_id = mongoose.Types.ObjectId(productid)
    // Step 1: Aggregate the sum of all rewards where status is false
    const matched={contactNumber:contactNumber,productid:product_id, status: false };
    const rewardAggregation = await Reward.aggregate([
      { $match: matched },
      { $group: { _id: null, totalPoints: { $sum: '$amount' } } }
    ]).session(session);

    if (rewardAggregation.length === 0) {
      console.log("No rewards to process.");
      return;
    }

    const totalRewardPoints = rewardAggregation[0].totalPoints;

    // Step 2: Update the Reward Wallet (Hierarchy) collection with the summation
    const result = await Hierarchy.updateOne(
        {contactNumber:contactNumber,productid:product_id}, // Replace with the actual ID
      { $inc: { rewardbalance: totalRewardPoints } } // Increment by the sum of points
    ).session(session);

    if (result.nModified === 0) {
      throw new Error('Failed to update the reward wallet.');
    }

    // Step 3: Update the status of rewards to true for the ones considered in summation
    const updateResult = await Reward.updateMany(
        matched,
      { $set: { status: true } }
    ).session(session);

    if (updateResult.modifiedCount === 0) {
     console.log('No rewards were updated.');
    }

    // Step 4: Commit the transaction if everything is successful
    await session.commitTransaction();
    console.log('Reward points successfully added to the wallet and status updated.');

  } catch (error) {
    // If anything goes wrong, abort the transaction
    await session.abortTransaction();
    console.error('Transaction failed, changes reverted.', error);
  } finally {
    session.endSession();
  }
}




exports.checkHierarchyAlifPay = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   uplineCheck =await Hierarchy.findOne({"introducer":hierarchyData.introducer,productid:productID})
    console.log({"introducer":hierarchyData.introducer,productid:productID})
    if(!uplineCheck ) {
        reject("introducer not exists");
        return;
    }
    
    
  
        let rewards =[];
       
             rewards =await exports.rewardUplines(hierarchyData.contactNumber,hierarchyData.introducer,hierarchyData.productid,2,[],10);
       
        console.log(rewards);
        
        //await RewardModel.InsertMany(rewards)
        //resolve(saved)
    });
   
};



exports.placement3 = (hierarchyData) => {
    return new Promise(async(resolve, reject) => {
        reject("introducer not exists");
        return;
    const productID= mongoose.Types.ObjectId( hierarchyData.productid)
    let   introCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.introducer,productid:productID})
    if(!introCheck ) {
        console.log(hierarchyData.introducer)
        reject("introducer not exists");
        return;
    }
    let   regCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.contactNumber,productid:productID})
    if(!regCheck ) {
        reject("user not exists");
        return;
    }else{
       //if(regCheck.infoData.placementDone){
       // reject("user already  exists");
       // return;
       //}
    }
    let   uplineCheck =await Hierarchy.findOne({"contactNumber":hierarchyData.upline,productid:productID})
    if(!uplineCheck ) {
        reject("upline not exists");
        return;
    }
    let introUsername=hierarchyData.introducer.toLowerCase();
    let iUpline =hierarchyData.upline.toLowerCase();
    let nxUpline = uplineCheck["upline"].toLowerCase()
    let sameFamily = introUsername == iUpline ;
    if(!sameFamily){
        sameFamily = introUsername == nxUpline  ;
    }
    if(!sameFamily){
        sameFamily = await checkUplines(introUsername,nxUpline,productID) ;
    }
    if(!sameFamily){
        console.log(introUsername)
        console.log(iUpline)
        console.log(nxUpline)
        reject("Not from same family");
        return;
    }

    
    await this.updatePlacements(hierarchyData.contactNumber,iUpline,productID,hierarchyData.position)
    resolve("OK")
   
    });
};


exports.updatePlacements_=async(root,upline,productId,position="L") =>{
   
    
    try {
        let upline_="leftChild";
        let all="leftTotal";
        let current="leftCurrent";
  
       if(position=="R"){
           upline_="rightChild";
           all="rightTotal";
           current="rightCurrent";
       }

      //const introquery={ [upline_]: upline,productid:productId }
      const introquery={ 'contactNumber': upline,productid:productId }
      console.log(introquery)
      const parentUser = await Hierarchy.findOne(introquery);
      
      if (!parentUser) {    
        
        return;
      }else{
        
        const allTime=checkInteger(parentUser.infoData[all])+1;
        const currentCount = checkInteger(parentUser.infoData[current])+1;
        //console.log(parentUser.infoData[all]+"  "+allTime)
        //console.log(parentUser.infoData[current]+" "+currentCount)
        let info =parentUser["infoData"].toObject();;
        console.log(info)
        let infoData = {...info,[all]:allTime,[current]:currentCount}
        parentUser.infoData = infoData;

       // console.log("XXXX")
        console.log(infoData)
        console.log("======="+parentUser["position"]+"=========")
       //parentUser.save();
         await this.updatePlacements_(root,parentUser["upline"],productId,parentUser["position"]);
      
        

      }
    } catch (error) {
        console.error('Error adding new user:', error);
        return null;
      }
      
  }
