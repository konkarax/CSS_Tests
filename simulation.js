const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

//Connections are global
var conn,db;
var collection_trucks,data_trucks;
var collection_bins,data_bins;

var idx=0;

class route{
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

//data.updateOne({_id:'1'},{$inc:{truckLoad:1}})



var STEP = 100.0/111139.0;
async function move_truck(target_list){
    
    const target = target_list[idx];
    data_trucks = await collection_trucks.find({}).toArray();

    const pos_x = data_trucks[0].pos_x;
    const pos_y = data_trucks[0].pos_y;

    const x_total = target[0]-pos_x;
    const y_total = target[1]-pos_y;

    const dist = Math.sqrt(Math.pow(x_total,2)+Math.pow(y_total,2));

    if (dist>STEP){
        const dx = x_total*STEP/dist;
        const dy = y_total*STEP/dist;
        await collection_trucks.updateOne({_id:1},{$inc:{'pos_x':dx,'pos_y':dy}});
        //setTimeout(move_truck,3000,target_list,idx);
    }
    else{
        console.log("reached");
        await collection_trucks.updateOne({_id:1},{$set:{'pos_x':target[0],'pos_y':target[1]}});

        if (target[2]!=0){
            setTimeout(update_bin,3000,target_list,idx);
        }
        idx = (idx+1)%target_list.length;
        
    }
}

async function update_bin(target_list,idx){
    await collection_bins.updateOne({_id:String(target_list[idx][2])},{$set:{binLoad:0}});
}


async function initialize_map(scenario){
    conn = await client.connect();
    db = conn.db("waste_managment");

    collection_trucks = db.collection('trucks');
    data_trucks = await collection_trucks.find({}).toArray();

    collection_bins = db.collection('bins');
    data_bins = await collection_bins.find({}).toArray();


    var scenario
    if (scenario==1){
        scenario = conn.db("scenario_1");
    }
    else if (scenario==2){
        scenario = conn.db("scenario_2");
    }

    const scenario_truck = scenario.collection("trucks")
    const scenario_truck_data = await scenario_truck.find({}).toArray();

    await collection_trucks.updateOne({_id:1},{$set:{'pos_x':scenario_truck_data[0].start_x,'pos_y':scenario_truck_data[0].start_y}})

    const scenario_bins = scenario.collection("bins")
    const scenario_bins_data = await scenario_bins.find({}).toArray();
    
    collection_bins.deleteMany({});
    var i;
    for (i=0;i<scenario_bins_data.length;i++){
        await collection_bins.insertOne({
            _id:scenario_bins_data[i]._id,
            type:scenario_bins_data[i].type,
            location:scenario_bins_data[i].location,
            binMaxLoad:scenario_bins_data[i].binMaxLoad,
            binLoad:scenario_bins_data[i].binLoad});
    }

    console.log("initialed");
    return scenario_truck_data[0].route;
}

module.exports = route;