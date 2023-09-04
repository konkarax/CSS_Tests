
document.addEventListener('DOMContentLoaded', async function() {

    const binsLoadInput = document.getElementById('binsLoadData');
    const binsLoad = JSON.parse(binsLoadInput.value);    
    const binsHumidityInput = document.getElementById('binsHumidityData');
    const binsHumidity = JSON.parse(binsHumidityInput.value);
    const binsTempInput = document.getElementById('binsTempData');
    const binsTemp = JSON.parse(binsTempInput.value);

    const realDataLoadInput = document.getElementById('realDataLoad');      
    const realDataHumInput = document.getElementById('realDataHum');   
    const realDataTempInput = document.getElementById('realDataTemp');   

    const predDataLoadInput = document.getElementById('predDataLoad');      
    const predDataHumInput = document.getElementById('predDataHum');   
    const predDataTempInput = document.getElementById('predDataTemp');  

    initializeCharts(binsLoad,binsHumidity,binsTemp)
    initializeCharts2(realDataLoadInput,realDataHumInput, realDataTempInput, predDataLoadInput, predDataHumInput, predDataTempInput)    
    

    // const scenario2Radio = document.getElementById('scenario2');
    // const scenario3Radio = document.getElementById('scenario3');

    const scenarioForm = document.getElementById('scenarioForm');    
    scenarioForm.addEventListener('submit', async function(event) {
        // event.preventDefault(); 
        
        const selectedScenario = document.querySelector('input[name="scenarioId"]:checked');
        
        if (selectedScenario) {

            const scenarioId = selectedScenario.value;           
            scenarioForm.action = `/admin/statistics?scenarioId=${scenarioId}`;            
            // console.log("id, href: ",scenarioId, scenarioForm.href)        
            scenarioForm.submit();
            
        }
    });

    function initializeCharts(binsLoad,binsHumidity,binsTemp){
        const chartCanvas1 = document.getElementById('myChart1');
        const chartCanvas2 = document.getElementById('myChart2');
        const chartCanvas3 = document.getElementById('myChart3');

        const loadData = {
            labels: ['<40', '40-80', '>80'],
            datasets: [{
                data: binsLoad,
                backgroundColor: ['rgba(0, 204, 0, 0.6)','rgba(255, 165, 0, 0.6)','rgba(255, 0, 0, 0.6)'],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }],
        };
    
        const ctx1 = chartCanvas1.getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: loadData,
            options: {
                legend:{display:false},
                responsive: true,
                maintainAspectRatio: false,
                animation:{duration:0}
            }
        });
    
        const humidityData = {
            labels: ['<50', '50-65', '>65'],
            datasets: [{
                data: binsHumidity,
                backgroundColor: ['rgba(0, 204, 0, 0.6)','rgba(255, 165, 0, 0.6)','rgba(255, 0, 0, 0.6)'],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };
    
        const ctx2 = chartCanvas2.getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: humidityData,
            options: {
                legend:{display:false},
                responsive: true,
                maintainAspectRatio: false,
                animation:{duration:0}
            }
        });
        
        const tempData = {
            labels: ['<40', '40-45', '>45'],
            datasets: [{
                data: binsTemp,
                backgroundColor: ['rgba(0, 204, 0, 0.6)','rgba(255, 165, 0, 0.6)','rgba(255, 0, 0, 0.6)'],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };
    
        const ctx3 = chartCanvas3.getContext('2d');
        new Chart(ctx3, {
            type: 'bar',
            data: tempData,
            options: {
                legend:{display:false},
                responsive: true,
                maintainAspectRatio: false,
                animation:{duration:0}
            }
        });
    
    }
    
    function initializeCharts2(realLoadInput, realHumInput,realTempInput,predLoadInput,predHumInput,predTempInput){  
        const realLoad = realLoadInput.value.split(",");   
        const realHum = realHumInput.value.split(",");   
        const realTemp = realTempInput.value.split(",");   

        const predictedLoad = predLoadInput.value.split(",");   
        const predictedHum = predHumInput.value.split(",");   
        const predictedTemp = predTempInput.value.split(",");   

        
        console.log("load hum temp: ", realLoad, realHum, realTemp)
        console.log("load hum temp: ", predictedLoad, predictedHum, predictedTemp)

        const chartCanvas4 = document.getElementById('myChart4');
        const chartCanvas5 = document.getElementById('myChart5');
        const chartCanvas6 = document.getElementById('myChart6');
        const ctx4 = chartCanvas4.getContext('2d');

        const time = []
        for (i=0;  i<realLoad.length+1 ; i++){
            time.push(i)
        }

        new Chart(ctx4, {
            type: "line",
            data: {
                labels: time, 
                datasets: [{
                    data: realLoad,
                    borderColor: "red",
                    fill: false
                },{
                    data: predictedLoad,
                    borderColor: "green",
                    fill: false
                }]
                },
                options: {
                legend: {display: false},
                animation:{duration:0}
            }
        });

        const ctx5 = chartCanvas5.getContext('2d');
        new Chart(ctx5, {
            type: "line",
            data: {
                labels: time,
                datasets: [{
                    data: realHum,
                    borderColor: "red",
                    fill: false
                },{
                    data: predictedHum,
                    borderColor: "green",
                    fill: false
                }]
                },
                options: {
                legend: {display: false},
                animation:{duration:0}
            }
        });

        const ctx6 = chartCanvas6.getContext('2d');
        new Chart(ctx6, {
            type: "line",
            data: {
                labels: time,
                datasets: [{
                    data: realTemp,
                    borderColor: "red",
                    fill: false
                },{
                    data: predictedTemp,
                    borderColor: "green",
                    fill: false
                }]
                },
                options: {
                legend: {display: false},
                animation:{duration:0}
            }
        });
    }
    



});
