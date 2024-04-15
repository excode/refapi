const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT transaction', () => {
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
it("POST '/transaction/'", async () => {
    const res = await request(app)
    .post('/transaction')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"quantity":"1.35",
"rtype":"1",
"productid":"nisi",
"contactNumber":"601741839781",
"particular":"reprehenderit"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/transaction/'", async () => {
    const res = await request(app)
    .post('/transaction')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"quantity":"1.35",
"rtype":"1",
"productid":"nostrud",
"contactNumber":"601738379064",
"particular":"inclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/transaction/'", async () => {
    const res = await request(app)
    .get('/transaction?amount=1.35&quantity=1.35&rtype=1&productid=nisi&contactNumber=6017418397&particular=reprehende')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/transaction/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/transaction/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/transaction/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/transaction/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "amount":"1.35",
"quantity":"1.35",
"rtype":"1",
"productid":"labore",
"contactNumber":"601778041862",
"particular":"dolore"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/transaction/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/transaction/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
