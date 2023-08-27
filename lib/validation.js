exports.formValidation = (objArray,insertorUpdate="INSERT") => {
    

    return async(req, res, next) => {
        let errors=[];
            for (let index = 0; index < objArray.length; index++) {
            
           
            let element = objArray[index];
            let ctrl = element.ctrl;
            let format = element.format==""?"text":element.format;
            let msg= element.message?element.message:null;
            let min= element.min?element.min:0;
            let max= element.min?element.max:0;
            let required = element.required;
            let value= req.body[ctrl]?req.body[ctrl]:'';
            
            if(format=="email"){
               
                if(value==""){ 

                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required'); 
                        } 
                    }
                }else{
                    if(!isEmailValid(value)){
                        errors.push(msg?msg:ctrl+' format  is not valid'); 
                    }
                }

            }
            if(format=="phone"){
                var pattern=/^\+?(?:[\d]*)$/
                //THIS IS A SIMPLE ONE
                // BUT you can customize for any localize format
                
                
                if(value=="" ){ 
                    if(required && insertorUpdate=="INSERT") {  // SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required');  
                    }
                }else{
                    if(!value.match(pattern)){
                        errors.push(msg?msg:ctrl+' format  is not valid'); 
                    }
                }

            }
            if(format=="text"){
                if(value==""){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                            errors.push(msg?msg:ctrl+' is required'); 
                        }
                    } 
                }else{
                    if(min>0 && value.length<min){
                        errors.push(msg?msg:ctrl+' must be at least '+min+" chars"); 
                    }else if(max>0 && value.length>max){
                        errors.push(msg?msg:ctrl+' must not exceed '+max+" chars"); 
                    }
                }

            }
            if(format=="password"){
                // YOU CAN IMPLEMENT PASSWORD STRENGTH IF REQUIRED
                if(value==""){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                            errors.push(msg?msg:ctrl+' is required'); 
                        }
                    } 
                }else{
                    if(min>0 && value.length<min){
                        errors.push(msg?msg:ctrl+' must be at least '+min+" chars"); 
                    }else if(max>0 && value.length>max){
                        errors.push(msg?msg:ctrl+' must not exceed '+max+" chars"); 
                    }
                }

            }
            if(format=="number" || format=="int"){
               


                if(value==""){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                            errors.push(msg?msg:ctrl+' is required'); 
                        }
                    }
                }else{
                    if(isNaN(value)){
                        errors.push(msg?msg:ctrl+' must be valid number only'); 
                    }

                    value =Number(value) // IMPORTANT TO CAST 
                    if(min>0 && value<generateSameDigitNumber(min)){
                        errors.push(msg?msg:ctrl+' cannot less than '+min+""); 
                    }else if(max>0 && value>generateSameDigitNumber(max)){
                        errors.push(msg?msg:ctrl+' must not exceed '+max+""); 
                    }
                }

            }
            if(format=="date" ||format=="time" ||format=="month"||format=="year"){
                if(value==""){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required'); 
                     } 
                    }
                }else{
                    var date = new Date(value);
                   
                    if(date=="Invalid Date" || !date){
                        errors.push(msg?msg:ctrl+' invalid date:'+value); 
                    }
                }

            }
            if(format=="array"){
                if(value==undefined){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required'); 
                     } 
                    }
                }else{
                    // CAN check  ARRAY FORMAT or JSON format 
                }
            }
            if(format=="boolean"){
                if(value==''){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required'); 
                     } 
                    }
                }
            }
            if(format=="url"){
                if(value==""){   
                    if(required) {  
                        if(insertorUpdate=="INSERT"){// SKIP FOR UPDATE 
                        errors.push(msg?msg:ctrl+' is required'); 
                        } 
                    }
                }else{
                    if(isValidURL(value)){
                        errors.push(msg?msg:ctrl+' invalid date:'+value); 
                    }
                }

            }
           
         
        }

         if (errors.length==0) {
             
              next();
         } else {
             console.log(errors);
              res.status(400).send({errors:errors.join(",")});
         }
    
    };
};

function generateSameDigitNumber(n, digit=9) {
    const repeatedDigit = digit.toString().repeat(n);
    return parseInt(repeatedDigit);
  }
  function isValidURL(url) {
    // Regular expression pattern for URL validation
    const urlPattern = /^(?:https?|ftp):\/\/(?:(?:[\w-]+\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/i;
    return urlPattern.test(url);
  }

function isEmailValid(email) {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}