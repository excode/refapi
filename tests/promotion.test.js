const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT promotion', () => {
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
it("POST '/promotion/'", async () => {
    const res = await request(app)
    .post('/promotion')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "title":"aute",
"discount":"3.64",
"productid":"mollit",
"validFrom":"2023-05-07",
"validTill":"2023-05-07",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/promotion/'", async () => {
    const res = await request(app)
    .post('/promotion')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "title":"adipisicing",
"discount":"3.06",
"productid":"idclf",
"validFrom":"2023-05-07",
"validTill":"2023-05-07",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/promotion/'", async () => {
    const res = await request(app)
    .get('/promotion?title=aute&discount=3.64&productid=mollit&validFrom=2023-05-07&validTill=2023-05-07&active=false&photo=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/promotion/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/promotion/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/promotion/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/promotion/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "title":"Lorem",
"discount":"9.86",
"productid":"cupidatat",
"validFrom":"2023-05-07",
"validTill":"2023-05-07",
"active":"false",
"photo":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/promotion/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/promotion/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
