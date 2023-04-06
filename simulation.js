const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

//Connections are global
var conn,db;
var collection_trucks,data_trucks;
var collection_bins,data_bins


function create_route(n){


}
//data.updateOne({_id:'1'},{$inc:{truckLoad:1}})
var dx,dy,r;
var flag;
var counter=0;
var counter_loop=0;
var target;
async function updateTruck(num){
    //Connection to db
    conn = await client.connect();
    db = conn.db("waste_managment");
    collection_trucks = db.collection('trucks');
    data_trucks = await collection_trucks.find({}).toArray();

    //Show bins and truck in senario <num>
    initialize_map(num);

    //Coordinates that the truck will stop (1=trash bin, 0=corner)
    const target_list = [[38.246658,21.736345,1],[38.247182, 21.736914,0]];

    //Initialize truck position
    let change = await collection_trucks.updateOne({_id:1},{$set:{'pos_x':data_trucks[0].start_x,'pos_y':data_trucks[0].start_y}})

    //Select first stop
    target=target_list[0];
    console.log(target);
    //const data = await collection.find({$expr:{$gt:["truckLoad", "truckMaxLoad"]}}).toArray();
    const pos_x=data_trucks[0].pos_x;
    const pos_y=data_trucks[0].pos_y;

    var x_total=abs(target[0]-pos_x);
    var y_total=abs(target[1]-pos_y);
    var dist = (x_total+y_total)*111139;
    
    console.log(x_total,y_total,dist);

    //Separate distance by n
    //const n=4;
    //dx = (target[0]-pos_x)/n;
    //dy = (target[1]-pos_y)/n;

    //console.log(Math.pow(target[0]-pos_x,1)*111139);
    //console.log(Math.pow(target[1]-pos_y,1)*111139);
    //console.log(Math.pow(Math.pow(target[0]-pos_x,2)+Math.pow(target[1]-pos_y,2),0.5)*111139);
    
    flag=0;
    counter_loop=0;
    let loop = setInterval(function(){
        if (flag==0){
            target=target_list[counter_loop];
            counter=0;
            move_truck();
            flag=1;
        }
        else if (flag==2){
            flag=0;
            counter_loop++;
            if (counter_loop==target_list.length){
                clearInterval(loop);
            }
            if (target[2]==1){
                flag=4;
            } 
        }
        else if (flag==4){
            //είναι κάδος
            console.log("trash");
            flag=0;
        }
    },3000);
    }

async function move_truck(){
    console.log("move_truck");
    if (counter==1){
        flag=2;
        return
    }
    else{
        var pos_x=data_trucks[0].pos_x;
        var pos_y=data_trucks[0].pos_y;

        dx = (target[0]-pos_x)*111139;
        dy = (target[1]-pos_y)*111139;
        r= Math.pow(Math.pow(dx,2)+Math.pow(dy,2),0.5);
        if(r<60){
            console.log("reach");
            let result = await collection_trucks.updateOne({_id:1},{$set:{'pos_x':target[0],'pos_y':target[1]}});
            counter=1;
            move_truck();
        }
        else{
            var x = ((dx*50)/r)/111139;
            var y = ((dy*50)/r)/111139;
            console.log(x);
            console.log(y);
            let result = await collection_trucks.updateOne({_id:1},{$inc:{'pos_x':x,'pos_y':y}});
            setTimeout(move_truck,3000);
        }
       
        
    }
}

async function initialize_map(scenario){
    var init_bins;
    if (scenario==1){
        const init_db = conn.db("scenario_1");
        const init_bins = init_db.collection('bins');
    }

    collection_bins = db.collection('bins');
    data_bins= await collection_bins.find({}).toArray();

    let x= await collection_bins.find({_id:"1"}).toArray();
    //let r = await bins.updateOne({_id:"1"},{$set:{"pos_x":x[0].location.coordinates[0],"pos_y":x[0].location.coordinates[1]}},{$unset:{"location.coordinates":""}});
    for (let i=0;i<data_bins.lenght;i++){
        let result = await init_bins.insert({_id:data_bins[i]._id,
                                                type:data_bins[i].type,
                                                location:data_bins[i].location,
                                                binMaxLoad:data_bins[i].binMaxLoad,
                                                binLoad:data_bins[i].binLoad});
    }
    console.log("initialed");
    return;
}

module.exports = updateTruck;