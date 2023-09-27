const {MongoClient} = require('mongodb')
const url="mongodb+srv://grt2000:grt2000st3@cluster0.4px4edr.mongodb.net/test";
const client=new MongoClient(url);



async function getBins(){
    try {
        const conn = await client.connect();        

        const scen = conn.db("waste_managment");

        const bins = scen.collection("bins")

        const count = await bins.countDocuments({});

        return count

    } catch (error) {
        throw error
    }
}

async function getBinsData(scenario){
    try {
        const conn = await client.connect()

        scenario = conn.db("waste_managment")


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

        // console.log("Collections, waste: ",greenBinstest, greenBins)
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

        const truckCollection = scenario.collection("trucks")
        const truckData = await truckCollection.find({}).toArray();
        const truckRoute = truckData[0].route
        // console.log("truckRoute: ", truckRoute)

        const ids=[]
        for (id of truckRoute){
            if(id[2]>0){
                ids.push(id[2])
            }
        }

        return ids

    } catch (error) {

        throw error
    }
}


async function getRealData(scenario,bin){
    try {
        const conn = await client.connect()

        scenario = conn.db("waste_managment")
        const realValuesData = scenario.collection("real_values")

        const binData = await realValuesData.aggregate([{$match: { _id: parseInt(bin) }},{$project: {_id: 0,load:1,temperature:1,humidity:1}}]).toArray()
        console.log("real Data: ", binData[0])
        const loadT = binData[0].load;
        console.log("real load_test: ", loadT)

        
        return binData[0]

    } catch (error) {

        throw error
    }
}


async function getPredictedData(scenario,bin){
    try {
        const conn = await client.connect()

        scenario = conn.db("waste_managment")
        const predictedValuesData = scenario.collection("predict_values")

        const binData = await predictedValuesData.aggregate([{$match: { _id: parseInt(bin) }},{$project: {_id: 0,load:1,temperature:1,humidity:1}}]).toArray()
        console.log("predicted Data: ", binData[0])
        const loadT = binData[0].load;
        console.log("predicted load_test: ", loadT)

        
        return binData[0]

    } catch (error) {

        throw error
    }
}

async function addDriver(newDriver){
    try {
        console.log("Driver Data: ",newDriver )
        const conn = await client.connect();
        const db = conn.db("waste_managment");

        const collection = db.collection("users");

        const count = await collection.countDocuments({})
        newDriver["_id"] = count+1;;
        await collection.insertOne(newDriver);

    } catch (error) {

        throw error
    }
}

async function findAllDrivers(){
    try{
        const conn = await client.connect();
        const db = conn.db("waste_managment");

        const collection = db.collection("users");
        const result = await collection.find({}).toArray();
        console.log("users: ", result.slice(1));
        return result.slice(1);

    }catch (error) {

        throw error
    }
}
    


module.exports =  { 
                    getBins,
                    getBinsData,
                    getBinsId,
                    getRealData,
                    getPredictedData,
                    addDriver,
                    findAllDrivers
                    }