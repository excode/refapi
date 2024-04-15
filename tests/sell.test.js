const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT sell', () => {
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
it("POST '/sell/'", async () => {
    const res = await request(app)
    .post('/sell')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"productid":"labore",
"sellerNumber":"601739013308",
"contactNumber":"601787028344"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/sell/'", async () => {
    const res = await request(app)
    .post('/sell')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"productid":"adipisicing",
"sellerNumber":"601713651011",
"contactNumber":"601769756673"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/sell/'", async () => {
    const res = await request(app)
    .get('/sell?quantity=1.35&unitprice=1.35&total=1.35&productid=labore&sellerNumber=6017390133&contactNumber=6017870283')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/sell/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/sell/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/sell/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/sell/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "quantity":"1.35",
"unitprice":"1.35",
"total":"1.35",
"productid":"nulla",
"sellerNumber":"601725961141",
"contactNumber":"601767651188"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/sell/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/sell/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
