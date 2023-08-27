const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT reward', () => {
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
it("POST '/reward/'", async () => {
    const res = await request(app)
    .post('/reward')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "level":"1",
"amount":"1.35",
"status":"false",
"productid":"mollit",
"redeemProductId":"irure",
"contactNumber":"601735350849",
"ref":"utclf",
"sourceContactNumber":"601769189802",
"particular":"magna",
"type":"doclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/reward/'", async () => {
    const res = await request(app)
    .post('/reward')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "level":"1",
"amount":"1.35",
"status":"false",
"productid":"eiusmod",
"redeemProductId":"magna",
"contactNumber":"601766758131",
"ref":"adipisicing",
"sourceContactNumber":"601783915387",
"particular":"Lorem",
"type":"nonclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/reward/'", async () => {
    const res = await request(app)
    .get('/reward?level=1&amount=1.35&status=false&productid=mollit&redeemProductId=irure&contactNumber=6017353508&ref=utclf&sourceContactNumber=6017691898&particular=magna&type=doclf')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/reward/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/reward/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/reward/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/reward/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "level":"1",
"amount":"1.35",
"status":"false",
"productid":"magna",
"redeemProductId":"consequat",
"contactNumber":"601726161067",
"ref":"nostrud",
"sourceContactNumber":"601786094380",
"particular":"aliqua",
"type":"enim"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/reward/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/reward/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
