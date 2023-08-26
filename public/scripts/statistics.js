
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
        labels: ['green', 'orange', 'red'],
        datasets: [{
            label: 'Bins Load Levels',
            data: binsLoad,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ctx1 = chartCanvas1.getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: loadData,
        options: {
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
        labels: ['green', 'orange', 'red'],
        datasets: [{
            label: 'Bins Humidity Levels',
            data: binsHumidity,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ctx2 = chartCanvas2.getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: humidityData,
        options: {
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
        labels: ['green', 'orange', 'red'],
        datasets: [{
            label: 'Bins Temperature Levels',
            data: binsTemp,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ctx3 = chartCanvas3.getContext('2d');
    new Chart(ctx3, {
        type: 'bar',
        data: tempData,
        options: {
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
