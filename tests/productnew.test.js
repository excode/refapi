const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT productnew', () => {
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
it("POST '/productnew/'", async () => {
    const res = await request(app)
    .post('/productnew')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"productid":"Lorem",
"title":"occaecat",
"details":"Ipsum sunt commodo officia magna ut tempor qui cillum dolor sunt incididunt.",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/productnew/'", async () => {
    const res = await request(app)
    .post('/productnew')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"productid":"officia",
"title":"sunt",
"details":"Labore aliquip voluptate dolor sit aute deserunt dolor aliqua esse ad.",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/productnew/'", async () => {
    const res = await request(app)
    .get('/productnew?active=false&productid=Lorem&title=occaecat&details=Ipsum sunt&photo=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/productnew/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/productnew/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/productnew/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/productnew/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "active":"false",
"productid":"velit",
"title":"incididunt",
"details":"Irure ut laborum est cillum excepteur.",
"photo":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/productnew/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/productnew/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
