const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

//Connections are global
var conn,db;
var collection_trucks,data_trucks;
var collection_bins,data_bins;

var bins_list=[];
var bins_inc=[];

var idx=0;

class Route{
    constructor(num){
        this.num=num;
        this.loopInterval = null;
        this.target_list = null;
        idx=0;
    }

    async initialize(){
        this.target_list = await initialize_map(this.num);
    }

    async startLoop(){
        this.loopInterval = setInterval(move_truck,3000,this.target_list);
    }

    endLoop(){
        clearInterval(this.loopInterval);
    }
}



var STEP = 200.0/111139.0;
async function move_truck(target_list){
    
    const target = target_list[idx];
    data_trucks = await collection_trucks.find({}).toArray();

    const pos_x = data_trucks[0].pos_x;
    const pos_y = data_trucks[0].pos_y;

    const x_total = target[0]-pos_x;
    const y_total = target[1]-pos_y;

    const dist = Math.sqrt(Math.pow(x_total,2)+Math.pow(y_total,2));
    console.log(dist)
    if (dist==0) return;

    if (dist>STEP+0.0001){
        const dx = x_total*STEP/dist;
        const dy = y_total*STEP/dist;
        await collection_trucks.updateOne({_id:1},{$inc:{'pos_x':dx,'pos_y':dy}});

    }
    else{
        console.log("reached");
        await collection_trucks.updateOne({_id:1},{$set:{'pos_x':target[0],'pos_y':target[1]}});

        if (target[2]>0){
            var i;
            for (i=0;i<bins_list.length;i++){
                const bin_info = await collection_bins.aggregate([
                    {$project:{_id:1,binLoad:1,binMaxLoad:1}}
                ]).toArray();

                if (bin_info[0].binLoad+bins_inc[i]<bin_info[0].binMaxLoad){
                    await collection_bins.updateOne({_id:String(bins_list[i])},{$inc:{'binLoad':bins_inc[i]}});
                }                
            }
            

            await new Promise(r => setTimeout(r, 3000));
            const bin_info = await collection_bins.aggregate([
                {$match:{_id:String(target_list[idx][2])}},
                {$project:{_id:1,binLoad:1}}]).toArray();
            const bin_id = bin_info[0]._id;
            const bin_load = bin_info[0].binLoad;
            await collection_bins.updateOne({_id:bin_id},{$set:{binLoad:0}});
            await collection_trucks.updateOne({_id:1},{$inc:{truckLoad:bin_load}});
        }
        else if (target[2]==-1){
            console.log("HQ");
            await collection_trucks.updateOne({_id:1},{$set:{truckLoad:0}});

        }

        idx = (idx+1)%target_list.length;
        
        
    }
}


async function initialize_map(scenario){
    conn = await client.connect();
    db = conn.db("waste_managment");

    collection_trucks = db.collection('trucks');
    data_trucks = await collection_trucks.find({}).toArray();

    collection_bins = db.collection('bins');
    data_bins = await collection_bins.find({}).toArray();

    if (scenario=='1'){
        scenario = conn.db("scenario_1");
    }
    else if (scenario=='2'){
        scenario = conn.db("scenario_2");
    }
    else if(scenario=='3'){
        scenario = conn.db("scenario_3");
    }

    const scenario_truck = scenario.collection("trucks")
    const scenario_truck_data = await scenario_truck.find({}).toArray();

    collection_trucks.deleteMany({});
    await collection_trucks.insertMany(scenario_truck_data);
    //await collection_trucks.updateOne({_id:1},{$set:{'pos_x':scenario_truck_data[0].start_x,'pos_y':scenario_truck_data[0].start_y}})

    const scenario_bins = scenario.collection("bins")
    const scenario_bins_data = await scenario_bins.find({}).toArray();
    
    collection_bins.deleteMany({});
    await collection_bins.insertMany(scenario_bins_data);

    var i;
    for (i=0;i<scenario_truck_data[0].route.length;i++){
        const bin_num=scenario_truck_data[0].route[i][2];
        if (bin_num>0){
            bins_list.push(bin_num);    
        }
    }

    for (i=0;i<bins_list.length;i++){
        const bin_info = await scenario_bins.aggregate([
            {$match:{_id:String(bins_list[i])}},
            {$project:{_id:1,binLoad:1,binMaxLoad:1}}]).toArray();
        bins_inc.push(bin_info[0].binLoad/bins_list.length);
    }

    console.log(bins_inc);
    console.log(bins_list);

    console.log("initialed");
    return scenario_truck_data[0].route;
}

module.exports = Route;