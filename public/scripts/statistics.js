document.addEventListener('DOMContentLoaded', function() {
  const binsLoadInput = document.getElementById('binsLoadData');
  const binsLoad = JSON.parse(binsLoadInput.value); 
  
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
  
  const ctx = document.getElementById('myChart').getContext('2d');
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
