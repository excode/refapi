const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT hierarchy', () => {
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
it("POST '/hierarchy/'", async () => {
    const res = await request(app)
    .post('/hierarchy')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "distributor":"false",
"contactNumber":"601732552235",
"productid":"eaclf",
"introducer":"601725198095"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/hierarchy/'", async () => {
    const res = await request(app)
    .post('/hierarchy')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "distributor":"false",
"contactNumber":"601753239886",
"productid":"minim",
"introducer":"601762135912"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/hierarchy/'", async () => {
    const res = await request(app)
    .get('/hierarchy?distributor=false&contactNumber=6017325522&productid=eaclf&introducer=6017251980')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/hierarchy/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/hierarchy/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/hierarchy/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/hierarchy/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "distributor":"false",
"contactNumber":"601772021538",
"productid":"aliqua",
"introducer":"601745518293"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/hierarchy/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/hierarchy/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
