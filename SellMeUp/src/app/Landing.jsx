import React, { useState, useEffect } from "react";
import axios from "axios";

const Landing = () => {
  const [balance, setBalance] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: {}, asks: {} });
  const [formData, setFormData] = useState({
    userId: 1,
    side: "bid", // bid or ask
    price: "",
    quantity: "",
  });
  const [quote, setQuote] = useState(null);

  const backendUrl = "http://10.12.80.135:3000"; // Replace with your backend URL

  // Fetch balance
  const fetchBalance = async (userId) => {
    try {
      const response = await axios.get(`${backendUrl}/balance/${userId}`);
      setBalance(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch order book
  const fetchOrderBook = async () => {
    try {
      const response = await axios.get(`${backendUrl}/depth`);
      setOrderBook(response.data);
    } catch (error) {
      console.error("Error fetching order book:", error);
    }
  };

  // Handle order form submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/orders`, formData);
      alert("Order placed successfully!");
      setFormData({ ...formData, price: "", quantity: "" }); // Reset the form
      fetchOrderBook(); // Update the order book
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Get quote
  const fetchQuote = async () => {
    try {
      const response = await axios.post(`${backendUrl}/quote`, {
        side: formData.side,
        quantity: formData.quantity,
      });
      setQuote(response.data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    fetchBalance(1); // Fetch initial balance for user ID 1
    fetchOrderBook(); // Fetch initial order book
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Trading System</h1>

        {/* Balance Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Balance</h2>
          {balance ? (
            <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <div>BTC: {balance.BTC}</div>
              <div>USDT: {balance.USDT}</div>
            </div>
          ) : (
            <p className="text-gray-400">Loading balance...</p>
          )}
        </section>

        {/* Order Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Place Order</h2>
          <form
            onSubmit={handleOrderSubmit}
            className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
          >
            <div>
              <label className="block mb-2 text-gray-400">User ID</label>
              <input
                type="number"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-400">Side</label>
              <select
                value={formData.side}
                onChange={(e) =>
                  setFormData({ ...formData, side: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="bid">Buy</option>
                <option value="ask">Sell</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-gray-400">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-400">Quantity</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-semibold"
            >
              Submit Order
            </button>
          </form>
        </section>

        {/* Quote Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Quote</h2>
          <button
            onClick={fetchQuote}
            className="bg-green-600 hover:bg-green-700 p-2 rounded text-white font-semibold"
          >
            Get Quote
          </button>
          {quote && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <p>Price: {quote.Bestbid || quote.Ask}</p>
              <p>Total: {quote.total}</p>
            </div>
          )}
        </section>

        {/* Order Book */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Order Book</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Bids</h3>
              <ul className="space-y-2">
                {Object.entries(orderBook.bids).map(([price, quantity]) => (
                  <li key={price}>
                    <span className="font-semibold">{price}</span> - {quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Asks</h3>
              <ul className="space-y-2">
                {Object.entries(orderBook.asks).map(([price, quantity]) => (
                  <li key={price}>
                    <span className="font-semibold">{price}</span> - {quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
