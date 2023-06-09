const Routes = require('../model/routes-model.js');

const getScenario = async (req, res, next) => {

    const scenario = req.query.id

    const bins = await Routes.loadScenario(scenario)
    await Routes.moveTruck(bins)
    next()
    // res.render("scenario1")
}



module.exports =  { 
    getScenario, 
}