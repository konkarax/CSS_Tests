const {MongoClient} = require('mongodb');
const { loadScenario, moveTruck } = require('./model/routes-model');
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

//Connections are global
var conn,db;
var collection_trucks,data_trucks;
var collection_bins,data_bins;

var bins_list=[];

var idx=0;

class Route{
    constructor(num){
        this.num=num;
        this.loopInterval = null;
        this.target_list = null;
        idx=0;
    }

    async initialize(){
        this.target_list = await loadScenario(this.num);
    }

    async startLoop(){
        this.loopInterval = setInterval(moveTruck,3000,this.target_list);
    }

    endLoop(){
        clearInterval(this.loopInterval);
    }
}





module.exports = Route;