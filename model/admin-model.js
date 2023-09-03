const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);

// conn = await client.connect();
// db = conn.db("waste_managment");


async function getBins(){
    try {
        const conn = await client.connect();        

        const scen1 = conn.db("scenario_1");
        const scen2 = conn.db("scenario_2");
        const scen3 = conn.db("scenario_3");

        const bins1 = scen1.collection("bins")
        const bins2 = scen2.collection("bins")
        const bins3 = scen3.collection("bins")

        const count1 = await bins1.countDocuments({});
        const count2 = await bins2.countDocuments({});
        const count3 = await bins3.countDocuments({});

        return count1 + count2 + count3

    } catch (error) {
        throw error
    }
}

async function getBinsData(scenario){
    try {
        const conn = await client.connect()

        if (scenario=='1'){
            scenario = conn.db("scenario_1")
        }
        else if (scenario=='2'){
            scenario = conn.db("scenario_2")
        }
        else if(scenario=='3'){
            scenario = conn.db("scenario_3")
        }

        const bins = scenario.collection("bins")
        
        const greenBins = await bins.countDocuments({"binLoad": { $lte: 40 }})        
        const orangeBins = await bins.countDocuments({"binLoad": { $gt: 40, $lte: 80 }})
        const redBins = await bins.countDocuments({"binLoad": { $gt: 80 }})

        const GlevelsHum = await bins.countDocuments({"humidity": { $lte: 50 }})     
        const OlevelsHum = await bins.countDocuments({"humidity": { $gt: 50, $lte: 65 }})
        const RlevelsHum = await bins.countDocuments({"humidity": { $gt: 65 }})

        const GlevelsTemp = await bins.countDocuments({"temperature": { $lte: 40 }})       
        const OlevelsTemp = await bins.countDocuments({"temperature": { $gt: 40, $lte: 45 }})
        const RlevelsTemp = await bins.countDocuments({"temperature": { $gt: 45 }})

        const data = {
            loads: [greenBins, orangeBins, redBins],
            humidity: [GlevelsHum, OlevelsHum, RlevelsHum],
            temperature: [GlevelsTemp, OlevelsTemp, RlevelsTemp]
        }

        return data

    } catch (error) {

        throw error
    }
}

async function getBinsId(scenario){
    try {
        const conn = await client.connect()

        if (scenario=='1'){
            scenario = conn.db("scenario_1")
        }
        else if (scenario=='2'){
            scenario = conn.db("scenario_2")
        }
        else if(scenario=='3'){
            scenario = conn.db("scenario_3")
        }

        const bins = scenario.collection("bins")
        const binsArray = await bins.aggregate([{$project: {_id: 1}}]).toArray()
        const ids = binsArray.map(bin => parseInt(bin._id))               
        
        return ids

    } catch (error) {

        throw error
    }
}


async function getRealData(scenario,bin){
    try {
        const conn = await client.connect()

        if (scenario=='1'){
            scenario = conn.db("scenario_1")
        }
        else if (scenario=='2'){
            scenario = conn.db("scenario_2")
        }
        else if(scenario=='3'){
            scenario = conn.db("scenario_3")
        }

        const bins = scenario.collection("bins")
        const load = await bins.aggregate([{$match: { _id: bin }},{$project: {_id: 0,load: "$binLoad"}}]).toArray()
        const humidity = await bins.aggregate([{$match: { _id: bin }},{$project: {_id: 0,humidity: "$humidity"}}]).toArray()
        const temp = await await bins.aggregate([{$match: { _id: bin }},{$project: {_id: 0,temperature: "$temperature"}}]).toArray()
        
        const data = [load[0].load,humidity[0].humidity,temp[0].temperature]
        console.log("model-data: ", data)
        console.log("load: ", load)
        
        return data

    } catch (error) {

        throw error
    }
}



// async function getBinsLoad(scenario){
//     try {
//         const conn = await client.connect();

//         // const scenario = conn.db("scenario_1");
//         if (scenario=='1'){
//             scenario = conn.db("scenario_1");
//         }
//         else if (scenario=='2'){
//             scenario = conn.db("scenario_2");
//         }
//         else if(scenario=='3'){
//             scenario = conn.db("scenario_3");
//         }

//         const bins = scenario.collection("bins")
        

//         const allBins = await bins.find({}).toArray();

//         // const count2 = await allBins.countDocuments({});
//         // console.log(`COUNT2: ${count2}`);
//         const length = allBins.length
//         console.log("model-allBins.length: ",length)

//         const redBins_data = await bins.find({"binLoad": { $gt: 35, $lt: 60 }}).toArray();
        
//         const greenBins = await bins.countDocuments({"binLoad": { $lte: 35 }});        
//         const orangeBins = await bins.countDocuments({"binLoad": { $gt: 35, $lte: 60 }});
//         const redBins = await bins.countDocuments({"binLoad": { $gt: 60 }});

//         // console.log("allBins",allBins)
//         const binsLoad = [greenBins, orangeBins ,redBins]
//         // console.log("reds",redBins_data)

//         console.log('model: bins',binsLoad)
        
//         return binsLoad

//     } catch (error) {

//         throw error
//     }
// }


    


module.exports =  { 
                    getBins,
                    getBinsData,
                    getBinsId,
                    getRealData
                    }