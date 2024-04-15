const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT productblog', () => {
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
it("POST '/productblog/'", async () => {
    const res = await request(app)
    .post('/productblog')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"title":"amet",
"details":"Velit culpa ea veniam do elit.",
"productid":"magna",
"categoryid":"fugiat",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/productblog/'", async () => {
    const res = await request(app)
    .post('/productblog')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"title":"exercitation",
"details":"Amet adipisicing cillum esse cupidatat aliqua incididunt officia dolor.",
"productid":"consectetur",
"categoryid":"cillum",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/productblog/'", async () => {
    const res = await request(app)
    .get('/productblog?active=false&title=amet&details=Velit culp&productid=magna&categoryid=fugiat&photo=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/productblog/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/productblog/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/productblog/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/productblog/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"title":"elit",
"details":"Est dolor ad excepteur magna et et elit.",
"productid":"nonclf",
"categoryid":"voluptate",
"photo":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/productblog/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/productblog/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
