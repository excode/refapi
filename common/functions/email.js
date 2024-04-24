var postmark = require("postmark");
const config = require('../../common/config/env.config.js');

exports.sendEmail =async (to,subject,contents,attachments=[])=>{
    var client = new postmark.Client(config.postmark);
   
   // console.log(contents);
    
    client.sendEmailWithTemplate({
        "From": "no-reply@ucode.ai", 
        "To": to, 
        "TemplateAlias": subject,
        "TemplateModel": contents
    });

}
