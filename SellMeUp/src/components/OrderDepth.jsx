import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const calculateCumulativeQuantity = (orders) => {
    return orders.map((order, index) => ({
        ...order,
        cumulativeQuantity: orders
            .slice(0, index + 1)
            .reduce((sum, o) => sum + o.cumulativeQuantity, 0),
    }));
};

const OrderDepth = ({ data }) => {
    const { bids = [], asks = [] } = data || {};

    // Preprocess data using useMemo for performance
    const { bidPrices, askPrices } = useMemo(() => {
        const bidsWithCumQty = calculateCumulativeQuantity(
            bids.map((bid) => ({ price: bid.price, cumulativeQuantity: bid.quantity }))
        );
        const asksWithCumQty = calculateCumulativeQuantity(
            asks.map((ask) => ({ price: ask.price, cumulativeQuantity: ask.quantity }))
        );

        return {
            bidPrices: bidsWithCumQty,
            askPrices: asksWithCumQty,
        };
    }, [bids, asks]);

    // Chart data and configuration
    const chartData = {
        labels: [...bidPrices.map((b) => b.price), ...askPrices.map((a) => a.price)],
        datasets: [
            {
                label: 'Bids',
                data: bidPrices.map((b) => b.cumulativeQuantity),
                borderColor: 'rgba(0, 255, 0, 0.6)', // Green
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                fill: true,
            },
            {
                label: 'Asks',
                data: askPrices.map((a) => a.cumulativeQuantity),
                borderColor: 'rgba(255, 0, 0, 0.6)', // Red
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Order Depth Chart', // Your title text
                font: {
                    size: 20, // Adjust this value to make the title bigger
                    weight: 'bold', // Optionally make the title bold
                },
                padding: {
                    top: 20,
                    bottom: 10, // Add padding if needed
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Price',
                    font: {
                        size: 14, // Adjust font size for X-axis label if needed
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Cumulative Quantity',
                    font: {
                        size: 14, // Adjust font size for Y-axis label if needed
                    },
                },
            },
        },
    };
    

    // Render the chart
    return (
        <div className=''>
            {bidPrices.length === 0 && askPrices.length === 0 ? (
                <div className="text-center text-gray-500">No data available</div>
            ) : (
                <Line data={chartData} options={chartOptions} className='h-96'/>
            )}
        </div>
    );
};

export default OrderDepth;
