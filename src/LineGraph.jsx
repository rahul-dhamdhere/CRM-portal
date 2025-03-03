// Create a new LineGraph.jsx component
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Import the Filler plugin
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin
);

const LineGraph = () => {
  // Sample data (replace with real data)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Clients',
        data: [100, 150, 300, 500, 700, 800, 900, 1200, 1500, 1800, 2100, 2500],
        borderColor: 'white', // YouTube red
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Add transparency to the background color
        tension: 0.4, // Makes the line curved
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Clients',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => `${context[0].label} Update`,
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
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
        grid: {
          color: 'rgba(0,0,0)'
        },
        title: {
          display: true,
          text: 'Clients'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutCubic'
    }
  };

  return <Line data={data} options={options} />;
};

export default LineGraph;