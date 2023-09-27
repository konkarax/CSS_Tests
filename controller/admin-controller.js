const Admin = require('../model/admin-model.js'); 


const checkIfAuthenticatedAdmin = async(req, res, next) => { //dinoume access ston admin gia tis selides tou
    if(req.session.username == 'admin'){
        next()
    }
    else{
        res.render("error", {message: "Wrong Credentials, access denied!"})
    }
}


const totalBins = async(req,res,next)=>{
    try{
        const binsNum = await Admin.getBins()
        console.log("controller-bins:", binsNum)
        console.log("controller-id:", req.query.scenarioId)

        if (req.query.scenarioId){
            console.log("Scenario statistics was selected")
            req.query.bins = binsNum
            next()
        }
        else{
            console.log("Access to admin page")
            res.render("admin",{bins:binsNum})
        }

    }catch(error){
        throw error
        }
}

const getStatistics = async (req, res, next) => {
    try {
        
        const binsNum = req.query.bins
        const scenarioId = req.query.scenarioId
        console.log("scenario Id in getStatistics: ", scenarioId)
        
        const binsData = await Admin.getBinsData(scenarioId)

        const loadData = binsData.loads
        const humidityData = binsData.humidity
        const tempData = binsData.temperature

        const binsIds = await Admin.getBinsId(scenarioId)

        if (req.query.binId){
            console.log("Scenario predictions was selected")
            req.query.bins = binsNum
            req.query.loadData = loadData
            req.query.humidityData = humidityData
            req.query.tempData = tempData
            req.query.binsIds = binsIds
            next()
        }
        else{
            console.log("Statistics only")
            res.render("admin",{bins:binsNum, binsLoad:JSON.stringify(loadData), binsHumidity:JSON.stringify(humidityData),binsTemp:JSON.stringify(tempData), binsIds:binsIds,scenarioID:scenarioId}) 
        }


    } catch (error) {
        throw error
    }
};

const getPredictions = async (req, res, next) => {
    try {
        
        const binsNum = req.query.bins
        const loadData = req.query.loadData
        const humidityData = req.query.humidityData
        const tempData = req.query.tempData
        const binsIds = req.query.binsIds

        const scenarioId = req.query.scenarioId
        const binId = req.query.binId

        const realData = await Admin.getRealData(scenarioId,binId)
        const predictedData = await Admin.getPredictedData(scenarioId,binId)

        res.render("admin",{bins:binsNum, binsLoad:JSON.stringify(loadData), binsHumidity:JSON.stringify(humidityData),binsTemp:JSON.stringify(tempData), 
                            binsIds:binsIds,scenarioID:scenarioId,binID:binId,realDataLoad:realData.load, realDataHum:realData.humidity, realDataTemp:realData.temperature,
                            predDataLoad:predictedData.load, predDataHum:predictedData.humidity, predDataTemp:predictedData.temperature}) 

    } catch (error) {
        next(error)
    }
};




const showDrivers = async (req, res, next) => {
    const users = await Admin.findAllDrivers() //synarthsh srto moedel pou episterefei olous tous users apo th bash
    // const sanitized_users = users.map( entry => entry.dataValues)
    req.users = users
    next()
}

const adminAddDriver = async (req, res, next) => {
    try{
        console.log(req.body)

        await Admin.addDriver({
            // "userID": req.body["userID"],
            "username": req.body["username"],
            "password": req.body["password"],
            "email":req.body["email"],
            "phone": req.body["phone"],
            "scenario": req.body["scenarioId"],
        })
        // res.render("home")
        res.locals.message = 'User Added!'
        // req.message = 'User Added!'
        next()
    } catch(error){
            res.locals.message = 'Failed to add User'
        // req.message = 'Failed to add User!'
    }
}


module.exports = {
    checkIfAuthenticatedAdmin,
    adminAddDriver,
    showDrivers,
    totalBins,
    getStatistics,
    getPredictions,
    
  };