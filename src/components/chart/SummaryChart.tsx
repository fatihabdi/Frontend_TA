import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['Nilai Tugas', 'Ulangan Harian', 'Nilai Sumatif'],
  datasets: [
    {
      label: ['81-100'],
      data: [95, 88, 100], // Data contoh
      backgroundColor: ['#122158'],
      hoverBackgroundColor: ['#122158']
    },
    {
      label: ['65-75'],
      data: [95, 88, 100], // Data contoh
      backgroundColor: ['#0D47A1'],
      hoverBackgroundColor: ['#0D47A1']
    },
    {
      label: ['Kurang dari 65'],
      data: [95, 88, 100], // Data contoh
      backgroundColor: ['#7D9BD7'],
      hoverBackgroundColor: ['#7D9BD7']
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

const SummaryChart = () => {
  return (
    <div className="relative w-full h-60">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SummaryChart;
