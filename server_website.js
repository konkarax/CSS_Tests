const express = require('express');
const path = require('path');
const cors= require('cors');
const route = require('./simulation');
//import process from 'node:process';

const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

const app = express();

app.use(cors());



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


app.get('/', (res,resp)=>{
    const publicPath = path.join(__dirname,"public");
    app.use(express.static(publicPath));
    resp.sendFile(publicPath+"/index.html");  
});

var new_request,old_request;
app.get('/map', async (req, res) => {
    const publicPath = path.join(__dirname,"public");
    app.use(express.static(publicPath));

    if(new_request){
        new_request.endLoop();
    }

    new_request=new route(1);
    await new_request.initialize();

    res.sendFile(publicPath+"/index.html");
    
    new_request.startLoop();  
});


app.listen(5000);

/*
process.on('exit', () => {
    require('child_process').spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit'
    });
  });
  process.exit();*/