const Routes = require('../model/routes-model.js');


class Route{
    constructor(){
        this.loopInterval = null;
    }

    async startLoop(target_list){
        this.loopInterval = setInterval(Routes.moveTruck,3000,target_list);
    }

    endLoop(){
        clearInterval(this.loopInterval);
    }
}


var new_request;
const getScenario = async (req, res, next) => {

    const scenario = req.query.id

    if(new_request){
        new_request.endLoop();
    }

    new_request=new Route();

    const bins = await Routes.loadScenario(scenario)

    new_request.startLoop(bins); 
    next()
    
}



module.exports =  { 
    getScenario, 
}