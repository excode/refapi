const queryFormatter=(querys)=>{

    var _query={};
    for (const key in querys) {

        if(typeof(querys[key]) === 'object'){
            let valueKey = Object.keys(querys[key])[0];
            let value = querys[key][valueKey]
            if(querys[key].hasOwnProperty('ne')){
                _query[key] = { $ne: value } ;
            }else if(querys[key].hasOwnProperty('lt')){
                _query[key] = { $lt: value } ;
            }else if(querys[key].hasOwnProperty('gt')){
                _query[key] = { $gt: value } ;
            }else if(querys[key].hasOwnProperty('lte')){
                _query[key] = { $lte: value } ;
            }else if(querys[key].hasOwnProperty('gte')){
                _query[key] = { $gte: value } ;
            }else if(querys[key].hasOwnProperty('startsWith')){
                _query[key] = new RegExp('^'+value,'i');
            }else if(querys[key].hasOwnProperty('endsWith')){
                _query[key] = new RegExp(value+'$','i');
            }else if(querys[key].hasOwnProperty('contains')){
                _query[key] = new RegExp(value,'i');
            }else if(querys[key].hasOwnProperty('notContains')){
                _query[key] = {$not: new RegExp(value,'i')} ;
            }
        }else if(typeof(querys[key]) === 'string' || typeof(querys[key]) === 'number'){
            _query[key] =  querys[key] ;
        }
        
    }
    return _query
}

const queryBuilder_string=(query,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _query = {};
    if(query.hasOwnProperty(mode_name)){
        const mode = query[mode_name];
        if(mode=="startsWith"){
            _query[name] = new RegExp('^'+value,'i');
        }else if(mode=="equals"){
            _query[name] =value;
        }else if(mode=="notEquals"){
            _query[name]  = { $ne: value } ;
        }else if(mode=="endsWith"){
            _query[name] = new RegExp(value+'$','i');
        }else if(mode=="notContains"){
            _query[name] = {$not: new RegExp(value,'i')} ;
        }else if(mode=="contains"){
            _query[name]  = new RegExp(value,'i');
        }
    }else{
        _query[name]  = new RegExp(value,'i');
    }
    return _query;
}
const queryBuilder_number=(query,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _query = {};
    
    if(value!=null ){
        if(!isNaN(value)){
          if(query.hasOwnProperty(mode_name)){
              const mode = query[mode_name];
              if(mode=="equals"){
                _query[name] =  value;
              }else if(mode=="notEquals"){
                _query[name] ={ $ne:value} ;
              }else if(mode=="lt"){
                _query[name] ={ $lt:value} ;
              }else if(mode=="lte"){
                _query[name] ={ $lte:value} ;
              }else if(mode=="gte"){
                _query[name] ={ $gte:value} ;
              }else if(mode=="gt"){
                _query[name] ={ $gt:value} ;
              }
          }else{
            _query[name] =  value ;
          }
       }
      }
    return _query;
}
const queryBuilder_date=(query,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _query = {};
      if(value){
        if(query.hasOwnProperty(mode_name)){
            const mode = query[mode_name];
           if(mode=="dateIs"){
            _query[name] = value;
            }else if(mode=="dateIsNot"){
                _query[name] = { $ne: value} ;
            }else if(mode=="dateBefore"){
                _query[name] = { $lt:value}
            }else if(mode=="dateAfter"){
                _query[name]= { $gt:value}
            }
        }else{
            _query[name]= value;
        }

    }
    return _query;
}
const queryBuilder_array=(query,name)=>{
    let value= query[name];
    let _query = {};
    if(value){
        if(Array.isArray(value)){
            _query[name] = { $in: value} 
        }else{
            _query[name]= { $in: [value] } 
        }
    }
    return _query;
}
const queryBuilder_range_array=(query,name,type)=>{
    let array_qry=name+"_array";
    let value= query[array_qry];
    let _query = {};
    if(value){
        if(Array.isArray(value)){
           if(type=="date" && value.length==2 ){
            _query[name] = { $gte: new Date(value[0]),$lte: new Date(value[1])} 
           }else{
            _query[name] ={ $in: value} 
           }
        }
    }
    return _query;
}
module.exports = {
    queryFormatter,
    queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date,
    queryBuilder_array,
    queryBuilder_range_array
}




