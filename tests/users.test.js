const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT users', () => {
let newID="";
var auth = {accessToken:""};

it("POST '/users/reg'", async () => {
    const res = await request(app)
    .post('/users/reg')
    .send({
        "name":"uCode Test",
        "email":"test@ucode.ai",
        "password":"123456"
    })
    expect(res.statusCode).toEqual(200)
    
})


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
it("POST '/users/'", async () => {
    const res = await request(app)
    .post('/users')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "lastname":"euclf",
"usertype":"1",
"firstname":"nulla",
"password":"ucode1234",
"contactNumber":"601767180200",
"email":"culpa@ucode.ai5"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/users/'", async () => {
    const res = await request(app)
    .post('/users')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "lastname":"nulla",
"usertype":"1",
"firstname":"sitclf",
"password":"ucode1234",
"contactNumber":"601722487456",
"email":"sint@ucode.ai3"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/users/'", async () => {
    const res = await request(app)
    .get('/users?lastname=euclf&usertype=1&firstname=nulla&contactNumber=6017671802&email=culpa@ucod')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "lastname":"sint",
"usertype":"1",
"firstname":"commodo",
"password":"ucode1234",
"contactNumber":"601762789141",
"email":"duis@ucode.ai9"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
