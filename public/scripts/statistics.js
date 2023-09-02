
document.addEventListener('DOMContentLoaded', async function() {

    const binsLoadInput = document.getElementById('binsLoadData');
    const binsLoad = JSON.parse(binsLoadInput.value);    
    const binsHumidityInput = document.getElementById('binsHumidityData');
    const binsHumidity = JSON.parse(binsHumidityInput.value);
    const binsTempInput = document.getElementById('binsTempData');
    const binsTemp = JSON.parse(binsTempInput.value);

    const chartCanvas1 = document.getElementById('myChart1');
    const chartCanvas2 = document.getElementById('myChart2');
    const chartCanvas3 = document.getElementById('myChart3');

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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

});
