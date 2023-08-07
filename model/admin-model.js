const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

// conn = await client.connect();
// db = conn.db("waste_managment");


async function getInfo(){
    try {
        const conn = await client.connect();
        const db = conn.db("waste_managment");
        // collection_bins = db.collection('bins');
        //data_bins = await collection_bins.find({}).toArray();

        const collection_bins = db.collection('bins');
        // const data_bins = await collection_bins.find({}).toArray();
        // console.log('model: bins',data_bins)
        const count = await collection_bins.countDocuments({});
        console.log(`Total count: ${count}`);
        
        return count

    } catch (error) {

        throw error
    }
}

//
async function getBinsLoad(){
    try {
        const conn = await client.connect();
        const db = conn.db("waste_managment");
        // collection_bins = db.collection('bins');
        //data_bins = await collection_bins.find({}).toArray();

        const scenario = conn.db("scenario_1");
        // if (scenario=='1'){
        //     scenario = conn.db("scenario_1");
        // }
        // else if (scenario=='2'){
        //     scenario = conn.db("scenario_2");
        // }
        // else if(scenario=='3'){
        //     scenario = conn.db("scenario_3");
        // }

        const bins = scenario.collection("bins")
        

        const allBins = await bins.find({}).toArray();

        // const count2 = await allBins.countDocuments({});
        // console.log(`COUNT2: ${count2}`);
        const length = allBins.length
        console.log("LENGTH: ",length)

        const redBins_data = await bins.find({"binLoad": { $gt: 35, $lt: 60 }}).toArray();
        
        const greenBins = await bins.countDocuments({"binLoad": { $lte: 35 }});        
        const orangeBins = await bins.countDocuments({"binLoad": { $gt: 35, $lte: 60 }});
        const redBins = await bins.countDocuments({"binLoad": { $gt: 60 }});

        console.log("allBins",allBins)
        const binsLoad = [greenBins, orangeBins ,redBins]
        console.log("reds",redBins_data)
        
        
        console.log('model: bins',binsLoad)
        
        return binsLoad

    } catch (error) {

        throw error
    }
}


    


module.exports =  { getBinsLoad,
                    getInfo}