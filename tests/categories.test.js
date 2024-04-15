const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT categories', () => {
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
it("POST '/categories/'", async () => {
    const res = await request(app)
    .post('/categories')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"rank":"8",
"category":"veniam"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/categories/'", async () => {
    const res = await request(app)
    .post('/categories')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"rank":"5",
"category":"nonclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/categories/'", async () => {
    const res = await request(app)
    .get('/categories?active=false&rank=8&category=veniam')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/categories/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/categories/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/categories/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/categories/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"rank":"9",
"category":"velit"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/categories/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/categories/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
