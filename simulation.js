const { loadScenario, moveTruck } = require('./model/routes-model');

var idx=0;

class Route{
    constructor(num){
        this.num=num;
        this.loopInterval = null;
        this.target_list = null;
        idx=0;
    }

    async initialize(){
        this.target_list = await loadScenario(this.num);
    }

    async startLoop(){
        this.loopInterval = setInterval(moveTruck,3000,this.target_list);
    }

    endLoop(){
        clearInterval(this.loopInterval);
    }
}



module.exports = Route;