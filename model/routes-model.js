const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);
const {spawn} = require('child_process');

let conn;
let db;
let collection_trucks;
let collection_bins;
let collection_values;
var bins_list;
var load_array=[];
var temp_array=[];
var hum_array=[];
var idx=0;

async function loadScenario(scenario){

    conn = await client.connect();
    db = conn.db("waste_managment");

    collection_trucks = db.collection('trucks');
    //data_trucks = await collection_trucks.find({}).toArray();

    collection_bins = db.collection('bins');
    //data_bins = await collection_bins.find({}).toArray();

    collection_values = db.collection("predict_values");


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

    await collection_trucks.deleteMany({});
    await collection_trucks.insertMany(scenario_truck_data);
    

    const scenario_bins = scenario.collection("bins")
    const scenario_bins_data = await scenario_bins.find({}).toArray();
    
    await collection_bins.deleteMany({});
    await collection_bins.insertMany(scenario_bins_data);

    collection_values.deleteMany({});

    var i;
    bins_list=[];
    for (i=0;i<scenario_truck_data[0].route.length;i++){
        const bin_num=scenario_truck_data[0].route[i][2];
        if (bin_num>0){
            bins_list.push(bin_num);
            const bin = await collection_bins.aggregate([
                {$match:{_id:String(bin_num)}},
                {$project:{_id:1,binLoad:1,binMaxLoad:1,temperature:1,humidity:1,alert:1}}
            ]).toArray();
            load_array.push([bin[0].binLoad,bin[0].binLoad,bin[0].binLoad,bin[0].binLoad]);
            temp_array.push([bin[0].temperature,bin[0].temperature,bin[0].temperature,bin[0].temperature]);
            hum_array.push([bin[0].humidity,bin[0].humidity,bin[0].humidity,bin[0].humidity]);
            await collection_values.insertOne({_id:bin_num,load:[],temperature:[],humidity:[]});  
        }
    }

    const python_file = "./nn/empty_txt.py";
    spawn('python',[python_file])



    console.log("initialed");
    idx=0;
    return scenario_truck_data[0].route;
}


var STEP = 200.0/111139.0;
async function moveTruck(target_list){
    const target = target_list[idx];
    console.log("target_list[idx]",target)
    const data_trucks = await collection_trucks.find({}).toArray();

    const pos_x = data_trucks[0].pos_x;
    const pos_y = data_trucks[0].pos_y;
    
    const x_total = target[0]-pos_x;
    const y_total = target[1]-pos_y;


    const dist = Math.sqrt(Math.pow(x_total,2)+Math.pow(y_total,2));

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
                var bin_info = await collection_bins.aggregate([
                    {$match:{_id:String(bins_list[i])}},
                    {$project:{_id:1,binLoad:1,binMaxLoad:1,temperature:1,humidity:1,alert:1}}
                ]).toArray();

                const load = bin_info[0].binLoad;
                const temperature = bin_info[0].temperature;
                const humidity = bin_info[0].humidity; 
                const alert = bin_info[0].alert; 
                const max_load = bin_info[0].binMaxLoad;
                const id = bin_info[0]._id;

                load_array[i].push(load);
                temp_array[i].push(temperature);
                hum_array[i].push(humidity);

                size = load_array[i].length;
                const load_5=[load_array[i][size-5],load_array[i][size-4],load_array[i][size-3],load_array[i][size-2],load_array[i][size-1]];
                const temp_5=[temp_array[i][size-5],temp_array[i][size-4],temp_array[i][size-3],temp_array[i][size-2],temp_array[i][size-1]];
                const hum_5=[hum_array[i][size-5],hum_array[i][size-4],hum_array[i][size-3],hum_array[i][size-2],hum_array[i][size-1]];

                const bins_inc = parseInt(Math.random()*4+5);
                const temp_inc = parseInt(Math.random()*4)-1;
                const hum_inc = parseInt(Math.random()*7)-2;
                
                //To collect data
                //const python_file = "./nn/add_to_txt.py";
                //const input = [load_5,bins_inc,temp_5,temp_inc,hum_5,hum_inc];
                //const python_process = spawn('python',[python_file,input]) 

                //To predict value
                const python_file = "./nn/predict_value.py";
                const input = [load_5,bins_inc,temp_5,temp_inc,hum_5,hum_inc];
                const python_process = spawn('python',[python_file,input]) 

                python_process.stdout.on('data', (data) => {
                    console.log('Output:', data.toString());
                });


                await collection_values.updateOne({'_id':id},{$push:{'load':load,'temperature':temperature,'humidity':humidity}});

                // const bins_inc = parseInt(Math.random()*4+5);
                // const temp_inc = parseInt(Math.random()*4)-1;
                // const hum_inc = parseInt(Math.random()*7)-2;
                

                if (alert==true) continue;
                if (temperature+temp_inc>50 || humidity+hum_inc>70){
                    await collection_bins.updateOne({_id:String(id)},{$set:{'alert':true}});
                }
                if (load+bins_inc<max_load){
                    await collection_bins.updateOne({_id:String(id)},{$inc:{'binLoad':bins_inc,'temperature':temp_inc,'humidity':hum_inc}});
                }
                else{
                    await collection_bins.updateOne({_id:String(id)},{$set:{'binLoad':max_load}},{$inc:{'temperature':temp_inc,'humidity':hum_inc}});
                }

            }
            

            await new Promise(r => setTimeout(r, 3000));
            bin_info = await collection_bins.aggregate([
                {$match:{_id:String(target_list[idx][2])}},
                {$project:{_id:1,binLoad:1}}]).toArray();
            const bin_id = bin_info[0]._id;
            const bin_load = bin_info[0].binLoad;
            await collection_bins.updateOne({_id:bin_id},{$set:{"binLoad":0,"temperature":35,"humidity":30,alert:false}});
            await collection_trucks.updateOne({_id:1},{$inc:{truckLoad:bin_load}});
        }
        else if (target[2]==-1){
            console.log("HQ");
            await collection_trucks.updateOne({_id:1},{$set:{truckLoad:0}});

        }

        idx = (idx+1)%target_list.length;
        
        
    }
}


module.exports =  { loadScenario,  moveTruck}