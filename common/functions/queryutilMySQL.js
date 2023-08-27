const queryFormatter=(querys)=>{
    var cols=[];
    var vals =querys;
    for (const key in querys) {
        let dbColName = key
        if(typeof(querys[key]) === 'object'){
            let valueKey = Object.keys(querys[key])[0];
            vals[key] = querys[key][valueKey]
            if(querys[key].hasOwnProperty('ne')){
                cols.push(`${dbColName}!=:${key}`)
            }else if(querys[key].hasOwnProperty('lt')){
                cols.push(`${dbColName}<:${key}`)
            }else if(querys[key].hasOwnProperty('gt')){
                cols.push(`${dbColName}>:${key}`)
            }else if(querys[key].hasOwnProperty('lte')){
                cols.push(`${dbColName}<=:${key}`)
            }else if(querys[key].hasOwnProperty('gte')){
                cols.push(`${dbColName}>=:${key}`)
            }else if(querys[key].hasOwnProperty('startsWith')){
                cols.push(`${dbColName} LIKE  :${key}  `);
                vals[key] = "'"+querys[key][valueKey]+"%'"
            }else if(querys[key].hasOwnProperty('endsWith')){
                cols.push(`${dbColName} LIKE  :${key}  `);
                vals[key] = "'%"+querys[key][valueKey]+"'"
            }else if(querys[key].hasOwnProperty('contains')){
                cols.push(`${dbColName} LIKE  :${key}  `);
                vals[key] = "'%"+querys[key][valueKey]+"%'"
            }else if(querys[key].hasOwnProperty('notContains')){
                cols.push(`${dbColName} NOT LIKE  :${key}  `);
                vals[key] = "'%"+querys[key][valueKey]+"%'"
            }
        }else if(typeof(querys[key]) === 'string' || typeof(querys[key]) === 'number'){
            cols.push(`${dbColName}=:${key}`)
        }
        
    }
    return {cols,vals}
}

const queryBuilder_string=(query,dbColName,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _col= "";
    let _val= "";
    if(value){
        if(query.hasOwnProperty(mode_name)){
            const mode = query[mode_name];
            if(mode=="startsWith"){
              
                _col = `${dbColName} LIKE ?`
                _val=value+"%"
            }else if(mode=="equals"){
               
               
                _col = `${dbColName} = ? `
                _val=value
            }else if(mode=="notEquals"){
                _col = `${dbColName} != ? `
                _val=value

            }else if(mode=="endsWith"){
              
             
               
                _col = `${dbColName} LIKE ?`
                _val="%"+value;
            }else if(mode=="notContains"){
              
                _col = `${dbColName}  NOT LIKE  ?`
                _val="%"+value+"%"
            }else if(mode=="contains"){
               
                _col = `${dbColName} LIKE  ?`
                _val="%"+value+"%"
            }
        }else{
            _col = `${dbColName} LIKE  ?`
            _val="%"+value+"%"
        }
       
    }
    return {col:_col,val:_val};
}
const queryBuilder_number=(query,dbColName,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _col= "";
    let _val= "";
    if(value!=null ){
        if(!isNaN(value)){
          if(query.hasOwnProperty(mode_name)){
              const mode = query[mode_name];
              if(mode=="equals"){
                _col = `${dbColName} = ?`
              }else if(mode=="notEquals"){
                _col = `${dbColName} != ?`
              }else if(mode=="lt"){
                _col = `${dbColName} < ?`
              }else if(mode=="lte"){
                _col = `${dbColName} <= ?`
              }else if(mode=="gte"){
                _col = `${dbColName} >= ?`
              }else if(mode=="gt"){
                _col = `${dbColName} > ?`
              }
          }else{
            _col = `${dbColName} = ?`
          }
          _val= value
       }
      }
      return {col:_col,val:_val};
}
const queryBuilder_date=(query,dbColName,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    
    let _col= "";
      if(value){
        if(query.hasOwnProperty(mode_name)){
            const mode = query[mode_name];
           if(mode=="dateIs"){
            _col = `DATE(${dbColName}) = ?`
              
                _col = ` DATE(${dbColName}) != ?`
            }else if(mode=="dateBefore"){
              
                _col = `DATE(${dbColName})  < ?`
            }else if(mode=="dateAfter"){
              
                _col = `DATE(${dbColName}) > ?`
            }
        }else{
            _col = `DATE(${dbColName})  = ?`
        }
        return {col:_col,val:value};
    }
    
}
module.exports = {
    queryFormatter,
    queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date
};