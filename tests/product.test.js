const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT product', () => {
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
it("POST '/product/'", async () => {
    const res = await request(app)
    .post('/product')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "serviceType":"1",
"level":"1",
"price":"1.35",
"qty":"1",
"rewardCondition":"1.35",
"active":"false",
"config":"ullamco",
"mypaId":"inclf",
"productname":"laborum",
"categoryid":"ipsum",
"subCatid":"pariatur",
"country":"nulla",
"description":"Duis ea ad consectetur.",
"currency":"aliquip",
"unitName":"aute",
"website":"https://mypaaa.com",
"facebook":"https://mypaaa.com",
"youtube":"https://ucode.ai",
"levelConfig":"consectetur",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/product/'", async () => {
    const res = await request(app)
    .post('/product')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "serviceType":"1",
"level":"1",
"price":"1.35",
"qty":"1",
"rewardCondition":"1.35",
"active":"false",
"config":"dolor",
"mypaId":"quis",
"productname":"irure",
"categoryid":"Lorem",
"subCatid":"inclf",
"country":"estclf",
"description":"Laborum in irure tempor duis sint.",
"currency":"nulla",
"unitName":"consectetur",
"website":"https://excode.net",
"facebook":"https://ucode.ai",
"youtube":"https://excode.net",
"levelConfig":"nonclf",
"photo":""
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/product/'", async () => {
    const res = await request(app)
    .get('/product?serviceType=1&level=1&price=1.35&qty=1&rewardCondition=1.35&active=false&config=ullamco&mypaId=inclf&productname=laborum&categoryid=ipsum&subCatid=pariatur&country=nulla&description=Duis ea ad&currency=aliquip&unitName=aute&website=https://my&facebook=https://my&youtube=https://uc&levelConfig=consectetu&photo=')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/product/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/product/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/product/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/product/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "serviceType":"1",
"level":"1",
"price":"1.35",
"qty":"1",
"rewardCondition":"1.35",
"active":"false",
"config":"sint",
"mypaId":"consectetur",
"productname":"inclf",
"categoryid":"inclf",
"subCatid":"excepteur",
"country":"estclf",
"description":"Commodo incididunt anim quis exercitation.",
"currency":"estclf",
"unitName":"cillum",
"website":"https://mypaaa.com",
"facebook":"https://ucode.ai",
"youtube":"https://ucode.ai",
"levelConfig":"exclf",
"photo":""
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/product/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/product/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
