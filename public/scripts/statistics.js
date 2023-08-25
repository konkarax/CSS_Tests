
document.addEventListener('DOMContentLoaded', async function() {
    const binsLoadInput = document.getElementById('binsLoadData');
    const binsLoad = JSON.parse(binsLoadInput.value);
    
    console.log("data: ", binsLoad)
    const chartCanvas = document.getElementById('myChart');

    // const scenario2Radio = document.getElementById('scenario2');
    // const scenario3Radio = document.getElementById('scenario3');

    const scenarioForm = document.getElementById('scenarioForm');
    
    scenarioForm.addEventListener('submit', async function(event) {
        // event.preventDefault(); 
        
        const selectedScenario = document.querySelector('input[name="scenarioId"]:checked');
        
        if (selectedScenario) {
            const scenarioId = selectedScenario.value;            
            
            scenarioForm.action = `/admin/statistics?scenarioId=${scenarioId}`;
            
            console.log("id, href: ",scenarioId, scenarioForm.href)
        
            scenarioForm.submit();
            
        }
    });
    
    const data = {
        labels: ['green', 'orange', 'red'],
        datasets: [{
            label: 'Bins Load',
            data: binsLoad,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ctx = chartCanvas.getContext('2d');
    // const chart = 
    new Chart(ctx, {
        type: 'bar',
        data: data,
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
