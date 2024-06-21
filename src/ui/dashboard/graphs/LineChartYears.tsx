import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const LineChartYears = ({ datas}:any) => {
  const safeDatas = Array.isArray(datas) ? datas : [];
  const dataset1Data = safeDatas.map((entry: { totalPrice: any; }) => entry.totalPrice);
  const dataset2Data = safeDatas.map((entry: { totalChange: any; }) => entry.totalChange);
  const data = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Curved Line Data',
        data: dataset1Data,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#04BFDA',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Intersecting Line Data',
        data: dataset2Data,
        fill: false,
        backgroundColor: 'rgba(220, 38, 38, 0.2)',
        borderColor: '#D8D8D8',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  let maxValue = -Infinity;
  let maxLabel = '';

  data.datasets.forEach(dataset => {
    dataset.data.forEach((value:any, index:any) => {
      if (value > maxValue) {
        maxValue = value;
        maxLabel = data.labels[index];
      }
    });
  });

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
      },
      y: {
        display: true,
        beginAtZero: false,
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line' as const,
            xMin: maxLabel,
            xMax: maxLabel,
            borderColor: '#FFA84A',
            borderWidth: 2,
            label: {
              content: `Max: ${maxValue}`,
              enabled: true,
              position: 'end' as const,
              yAdjust: -10, // Adjust the position of the label if needed
            },
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-[99%] max-w-4xl" style={{ height: '200px', marginTop: '2rem', paddingLeft:"1rem" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartYears;
