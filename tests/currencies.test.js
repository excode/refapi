const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT currencies', () => {
let newID="";
var auth = {accessToken:""};

it("Login", async () => {
const login = await request(app)
    .post('/auth')
    .send({
        email: userInfo.email,
        password: userInfo.password
    });
    if(login.statusCode==201){
        auth = login.body;
        console.log(auth.accessToken);
    }
    expect(login.statusCode).toEqual(201)
})      
it("POST '/currencies/'", async () => {
    const res = await request(app)
    .post('/currencies')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "minTransaction":"1.35",
"transactionFee":"1.35",
"maxTransaction":"1.35",
"decimal":"9",
"name":"aute",
"isocode":"eiu",
"cSign":"idclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/currencies/'", async () => {
    const res = await request(app)
    .post('/currencies')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "minTransaction":"1.35",
"transactionFee":"1.35",
"maxTransaction":"1.35",
"decimal":"10",
"name":"aliquip",
"isocode":"ven",
"cSign":"culpa"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/currencies/'", async () => {
    const res = await request(app)
    .get('/currencies?minTransaction=1.35&transactionFee=1.35&maxTransaction=1.35&decimal=9&name=aute&isocode=eiusmod&cSign=idclf')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/currencies/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/currencies/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/currencies/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/currencies/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "minTransaction":"1.35",
"transactionFee":"1.35",
"maxTransaction":"1.35",
"decimal":"8",
"name":"nostrud",
"isocode":"idc",
"cSign":"dolor"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/currencies/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/currencies/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
