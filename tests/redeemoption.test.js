const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT redeemoption', () => {
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
it("POST '/redeemoption/'", async () => {
    const res = await request(app)
    .post('/redeemoption')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"commodo",
"name":"doclf",
"rate":"1.35",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/redeemoption/'", async () => {
    const res = await request(app)
    .post('/redeemoption')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"nostrud",
"name":"eaclf",
"rate":"1.35",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/redeemoption/'", async () => {
    const res = await request(app)
    .get('/redeemoption?productid=commodo&name=doclf&rate=1.35&active=false&photo=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/redeemoption/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/redeemoption/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/redeemoption/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/redeemoption/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "productid":"exercitation",
"name":"dolore",
"rate":"1.35",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/redeemoption/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/redeemoption/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
