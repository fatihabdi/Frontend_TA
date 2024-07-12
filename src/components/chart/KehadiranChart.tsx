import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: ['Hadir'],
      data: [95, 88, 100, 40, 80, 68], // Data contoh
      backgroundColor: ['#122158'],
      hoverBackgroundColor: ['#122158']
    },
    {
      label: ['Sakit & Izin'],
      data: [95, 88, 100, 40, 80, 68], // Data contoh
      backgroundColor: ['#253D7B'],
      hoverBackgroundColor: ['#253D7B']
    },
    {
      label: ['Alfa'],
      data: [95, 88, 100, 40, 80, 68], // Data contoh
      backgroundColor: ['#EAECF0'],
      hoverBackgroundColor: ['#EAECF0']
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
};

const KehadiranChart = () => {
  return (
    <div className="relative w-full h-60">
      <Bar data={data} options={options} />
    </div>
  );
};

export default KehadiranChart;
