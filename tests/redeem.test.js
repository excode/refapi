const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT redeem', () => {
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
it("POST '/redeem/'", async () => {
    const res = await request(app)
    .post('/redeem')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"exercitation",
"redeemproductid":"labore",
"quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"sellerNumber":"601736691988"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/redeem/'", async () => {
    const res = await request(app)
    .post('/redeem')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"cillum",
"redeemproductid":"pariatur",
"quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"sellerNumber":"601743449678"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/redeem/'", async () => {
    const res = await request(app)
    .get('/redeem?productid=exercitati&redeemproductid=labore&quantity=1.35&unitprice=1.35&total=1.35&sellerNumber=6017366919')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/redeem/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/redeem/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/redeem/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/redeem/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"consequat",
"redeemproductid":"quiclf",
"quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"sellerNumber":"601770097993"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/redeem/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/redeem/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
