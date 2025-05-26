// Chart options for dashboard charts

// Line and Bar chart options
export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2, 4],
        color: '#e5e7eb'
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
};

// Doughnut chart options
export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    }
  }
};
