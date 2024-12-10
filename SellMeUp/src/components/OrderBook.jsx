import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the necessary components
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend);
function OrderBook() {
  // Placeholder data
  const orderBookData = {
    bids: [
      { price: 94970, quantity: 2.5, total: 40.6 },
      { price: 94960, quantity: 13.1, total: 38.1 },
      // More bids...
    ],
    asks: [
      { price: 97034.5, quantity: 0.1, total: 0.1 },
      { price: 97035.4, quantity: 0.7, total: 0.7 },
      // More asks...
    ]
  };

  const largeTrades = [
    { price: 96879.8, volume: '32.65K' },
    { price: 96840.1, volume: '119.11K' },
    { price: 96865.1, volume: '134.93K' },
    // More trades...
  ];

  const [orderDepthData, setOrderDepthData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Bids',
        data: [],
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Asks',
        data: [],
        borderColor: 'red',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    // Generate order depth chart data
    const bidPrices = orderBookData.bids.map(bid => bid.price);
    const askPrices = orderBookData.asks.map(ask => ask.price);
    const bidQuantities = orderBookData.bids.map(bid => bid.quantity);
    const askQuantities = orderBookData.asks.map(ask => ask.quantity);

    setOrderDepthData({
      labels: [...bidPrices, ...askPrices],
      datasets: [
        {
          label: 'Bids',
          data: bidQuantities,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Asks',
          data: askQuantities,
          borderColor: 'red',
          fill: false,
        },
      ],
    });
  }, [orderBookData]);

  return (
    <div className="flex bg-gray-900 text-white p-4">
      <div className="flex-1 space-y-4">
        {/* Order Book Table */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">OrderBook (Futures)</h2>
          <div className="flex">
            <div className="w-1/2">
              <h3 className="text-lg mb-2">Bids</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBookData.bids.map((bid, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{bid.price}</td>
                      <td className="border px-4 py-2">{bid.quantity}</td>
                      <td className="border px-4 py-2">{bid.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-1/2">
              <h3 className="text-lg mb-2">Asks</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBookData.asks.map((ask, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{ask.price}</td>
                      <td className="border px-4 py-2">{ask.quantity}</td>
                      <td className="border px-4 py-2">{ask.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Depth Chart */}
        <div className="mt-8">
          <Line
            data={orderDepthData}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: 'linear',
                  position: 'bottom',
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Large Trades */}
      <div className="w-1/4 ml-8 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Large Trades</h3>
        <ul>
          {largeTrades.map((trade, index) => (
            <li key={index} className="flex justify-between py-2 border-b border-gray-700">
              <span>{trade.price}</span>
              <span>{trade.volume}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderBook;
