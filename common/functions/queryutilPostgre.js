const queryFormatter=(querys)=>{
    var cols=[];
    var vals =querys;
    for (const key in querys) {
        let dbColName = key.toLowerCase()
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
                cols.push(`${dbColName} LIKE  :${key} || '%' `);
            }else if(querys[key].hasOwnProperty('endsWith')){
                cols.push(`${dbColName} LIKE '%' || :${key}  `);
            }else if(querys[key].hasOwnProperty('contains')){
                cols.push(`${dbColName} LIKE '%' || :${key} || '%' `);
            }else if(querys[key].hasOwnProperty('notContains')){
                cols.push(`${dbColName} NOT LIKE '%' || :${key} || '%' `);
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
    
    if(value){
        if(query.hasOwnProperty(mode_name)){
            const mode = query[mode_name];
            if(mode=="startsWith"){
              
                _col = `${dbColName} LIKE :${name}|| '%'`

            }else if(mode=="equals"){
               
                cols.push("${dbColName} =  :${name}  ");
                _col = `${dbColName} = :${name} `
 
            }else if(mode=="notEquals"){
                _col = `${dbColName} != :${name} `

            }else if(mode=="endsWith"){
              
                cols.push("${dbColName} LIKe '%' || :${name}  ");
               
                _col = `${dbColName} LIKE  '%' || :${name}`
            }else if(mode=="notContains"){
              
                _col = `${dbColName}  NOT LIKE  '%' || :${name} || '%'`
            }else if(mode=="contains"){
               
                _col = `${dbColName} LIKE  '%' || :${name}|| '%'`
            }
        }else{
            _col = `${dbColName} LIKE  '%' || :${name}|| '%'`
        }
       
    }
    return _col;
}
const queryBuilder_number=(query,dbColName,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    let _col= "";
    if(value!=null ){
        if(!isNaN(value)){
          if(query.hasOwnProperty(mode_name)){
              const mode = query[mode_name];
              if(mode=="equals"){
                _col = `${dbColName} = :${name}`
              }else if(mode=="notEquals"){
                _col = `${dbColName} != :${name}`
              }else if(mode=="lt"){
                _col = `${dbColName} < :${name}`
              }else if(mode=="lte"){
                _col = `${dbColName} <= :${name}`
              }else if(mode=="gte"){
                _col = `${dbColName} >= :${name}`
              }else if(mode=="gt"){
                _col = `${dbColName} > :${name}`
              }
          }else{
            _col = `${dbColName} = :${name}`
          }
         
       }
      }
    return _col;
}
const queryBuilder_date=(query,dbColName,name)=>{
    let value= query[name];
    let mode_name = name+"_mode";
    
    let _col= "";
      if(value){
        if(query.hasOwnProperty(mode_name)){
            const mode = query[mode_name];
           if(mode=="dateIs"){
            _col = `${dbColName}::date = :${name}`
            }else if(mode=="dateIsNot"){
              
                _col = `${dbColName}::date != :${name}`
            }else if(mode=="dateBefore"){
              
                _col = `${dbColName}::date < :${name}`
            }else if(mode=="dateAfter"){
              
                _col = `${dbColName}::date > :${name}`
            }
        }else{
            _col = `${dbColName}::date = :${name}`
        }
       
    }
    return _col;
}

module.exports = {
    queryFormatter,
    queryBuilder_string,
    queryBuilder_number,
    queryBuilder_date
}




