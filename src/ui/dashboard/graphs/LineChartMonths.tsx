import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import Cookies from 'js-cookie';
import { getPrices } from '@/lib/apiUtils';
import { groupTransactionsByMonth } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const LineChart = ({ datas}:any) => {
    const safeDatas = Array.isArray(datas) ? datas : [];
    const dataset1Data = safeDatas.map((entry: { totalPrice: any; }) => entry.totalPrice);
    const dataset2Data = safeDatas.map((entry: { totalChange: any; }) => entry.totalChange);
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
        <div className="w-[97%] max-w-4xl" style={{ height: '200px', marginTop: '2rem',paddingLeft:"1rem" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
