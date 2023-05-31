const express = require('express');
const Route = require('./simulation');
const path = require('path');
// import * as UserController from './controller/user-controller.mjs'
// import * as AdminController from './controller/admin-controller.mjs'

const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

const router = express.Router()


router.get('/get_bins',async (res,resp)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('bins');
    data = await data.find().toArray();
    resp.send(data);
})

router.get('/get_trucks',async (res,resp)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('trucks');
    data = await data.find().toArray();
    resp.send(data);
})


router.get('/', (res,resp)=>{
    const publicPath = path.join(__dirname,"public");
    router.use(express.static(publicPath));
    resp.sendFile(publicPath+"/index.html");  
});

var new_request;
router.get('/map', async (req, res) => {
    const publicPath = path.join(__dirname,"public");
    router.use(express.static(publicPath));

    if(new_request){
        new_request.endLoop();
    }
    new_request=new Route(req.query.id);
    await new_request.initialize();

    res.sendFile(publicPath+"/index.html");
    
    new_request.startLoop();  
});




module.exports = router;