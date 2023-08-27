const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT distributor', () => {
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
it("POST '/distributor/'", async () => {
    const res = await request(app)
    .post('/distributor')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "blogTitle":"commodo",
"category":"aliqua",
"currency":"idclf",
"telephone":"601764010901",
"email":"voluptate@ucode.ai",
"state":"etclf",
"active":"false",
"productid":"consectetur",
"contactNumber":"601787318606",
"name":"officia",
"address":"Labore quis ex sit quis aliquip id et sunt culpa officia laborum quis duis.",
"city":"esse",
"zipcode":"nonclf",
"country":"sitclf",
"productname":"amet",
"serviceType":"1.35"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/distributor/'", async () => {
    const res = await request(app)
    .post('/distributor')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "blogTitle":"reprehenderit",
"category":"adipisicing",
"currency":"aliqua",
"telephone":"601721288153",
"email":"nulla@ucode.ai",
"state":"magna",
"active":"false",
"productid":"utclf",
"contactNumber":"601743345509",
"name":"consectetur",
"address":"Exercitation fugiat deserunt sunt aliqua.",
"city":"elit",
"zipcode":"exercitati",
"country":"duis",
"productname":"sitclf",
"serviceType":"1.35"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/distributor/'", async () => {
    const res = await request(app)
    .get('/distributor?blogTitle=commodo&category=aliqua&currency=idclf&telephone=6017640109&email=voluptate@&state=etclf&active=false&productid=consectetu&contactNumber=6017873186&name=officia&address=Labore qui&city=esse&zipcode=nonclf&country=sitclf&productname=amet&serviceType=1.35')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/distributor/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/distributor/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/distributor/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/distributor/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "blogTitle":"sitclf",
"category":"veniam",
"currency":"ullamco",
"telephone":"601730726385",
"email":"est@ucode.ai",
"state":"mollit",
"active":"false",
"productid":"exercitation",
"contactNumber":"601763691291",
"name":"quiclf",
"address":"Mollit nulla mollit commodo culpa deserunt.",
"city":"consectetur",
"zipcode":"laborum",
"country":"deserunt",
"productname":"exercitation",
"serviceType":"1.35"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/distributor/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/distributor/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
