const express = require('express');
const path = require('path');
const fs = require ('fs');
const cors= require('cors');
const updateTruck = require('./simulation');

const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

const app = express();

app.get('/get_bins',async (res,resp)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('bins');
    data = await data.find().toArray();
    resp.send(data);
})

app.get('/get_trucks',async (res,resp)=>{
    let result= await client.connect();
    let db = result.db("waste_managment");
    let data =  db.collection('trucks');
    data = await data.find().toArray();
    resp.send(data);
})

//app.use(cors())



app.get('/', async (res,resp)=>{
    const publicPath = path.join(__dirname,"public");
    app.use(express.static(publicPath));
    resp.sendFile(publicPath+"/index.html");  
});

app.get('/map', async (res,resp)=>{
    const publicPath = path.join(__dirname,"public");
    app.use(express.static(publicPath));
    resp.sendFile(publicPath+"/index.html");    
    updateTruck(1);
});



app.listen(5000);
