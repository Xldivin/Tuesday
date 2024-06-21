import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import { getPrices } from '@/lib/apiUtils';
import { groupTransactionsByMonth } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [prices, setPrices] = useState<any>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (token) {
          const data = await getPrices(token);
          setPrices(data);
        } else {
          setError('Access token is missing');
        }
      } catch (error) {
        setError('Failed to fetch stocks');
      }
    };

    fetchData();
  }, []);
  const transactionsByMonth = groupTransactionsByMonth(prices);

  // Populate datasets based on pricesByDayOfWeek
  const dataset1Data = [];
  const dataset2Data = [];

  for (let month in transactionsByMonth) {
    const pricesOfMonth = transactionsByMonth[month];
    if (pricesOfMonth.length === 0) {
      dataset1Data.push(0);
      dataset2Data.push(0);
    } else {
      dataset1Data.push(pricesOfMonth[0] || 0);
      dataset2Data.push(pricesOfMonth[1] || 0);
    }
  }
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul'
    ],
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 0, 0, 100, 100, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
          '#FF0000', "#FF0000", '#1546C4', '#FF0000', '#FF0000'
        ],
        borderColor: [
          '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000',
          '#FF0000', '#1546C4', '#FF0000', '#FF0000', '#FF0000'
        ],
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 6,
      },
      {
        label: 'Dataset 2',
        data: [0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A',
          '#12B76A', '#1E3A8A', '#12B76A', '#12B76A', '#12B76A'
        ],
        borderColor: [
          '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A', '#12B76A',
          '#12B76A', '#1E3A8A', '#12B76A', '#12B76A', '#12B76A'
        ],
        borderWidth: 0,
        borderRadius: 5,
        barThickness: 6,
      }
    ],
  };

  const options = {
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: 1000,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        stacked: false,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="-mt-[4rem] -ml-[0.5rem]" style={{ height: '300px', width: "99%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
