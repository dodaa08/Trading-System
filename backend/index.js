import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import db from './db.js'; // Ensure db.js is correctly set up with models
const { OrderBook, User} = db;

dotenv.config();
const PORT = 3000;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const flipBalance = async (fromUserId, toUserId, quantity, price) => {
    try {
        console.log("Looking for fromUserId:", fromUserId);
        console.log("Looking for toUserId:", toUserId);

        // Find users with correct userId type (as String)
        const fromUser = await User.findOne({ userId: String(fromUserId) });
        const toUser = await User.findOne({ userId: String(toUserId) });

        // Check if users are found
        if (!fromUser || !toUser) {
            throw new Error("User(s) not found");
        }

        // Calculate transaction value
        const transactionValue = quantity * price;

        // Ensure `fromUser` has enough balance
        if (fromUser.balance < transactionValue) {
            throw new Error("Insufficient funds for transaction");
        }

        // Update balances
        fromUser.balance -= transactionValue; // Deduct funds from seller
        fromUser.BTC += quantity; // Add BTC to seller
        toUser.balance += transactionValue;   // Add funds to buyer
        toUser.BTC -= quantity; // Deduct BTC from buyer

        // Persist updated balances
        await fromUser.save();
        await toUser.save();

        console.log(
            `Transaction successful: ${quantity} at ${price}. Updated balances for Users ${fromUserId} and ${toUserId}.`
        );
    } catch (error) {
        console.error("Error flipping balances:", error.message);
        throw error;
    }
};


const fillOrders = async (side, price, quantity, userId) => {
    let remainingQTY = quantity;

    try {
        console.log('User ID (Buyer/Seller):', userId); // Log userId to ensure it's being passed correctly
        
        const orderBook = await OrderBook.findOne();
        if (!orderBook) throw new Error("Order book not found");

        const { asks, bids } = orderBook;

        if (side === "bid") {
            for (let i = asks.length - 1; i >= 0; i--) {
                if (asks[i].price > price) break;

                if (!asks[i].userId) {
                    console.error('Missing userId for ask order:', asks[i]);
                    continue; // Skip this order if userId is missing
                }

                console.log(`Attempting to fill order: ${remainingQTY} at price ${asks[i].price} for seller ${asks[i].userId}`);
                if (asks[i].quantity > remainingQTY) {
                    asks[i].quantity -= remainingQTY;
                    await flipBalance(asks[i].userId, userId, remainingQTY, asks[i].price);  // Seller is asks[i].userId
                    remainingQTY = 0;
                    break;
                } else {
                    remainingQTY -= asks[i].quantity;
                    await flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
                    asks.splice(i, 1);
                }
            }
        } else {
            for (let i = bids.length - 1; i >= 0; i--) {
                if (bids[i].price < price) break;

                if (!bids[i].userId) {
                    console.error('Missing userId for bid order:', bids[i]);
                    continue; // Skip this order if userId is missing
                }

                console.log(`Attempting to fill order: ${remainingQTY} at price ${bids[i].price} for buyer ${bids[i].userId}`);
                if (bids[i].quantity > remainingQTY) {
                    bids[i].quantity -= remainingQTY;
                    await flipBalance(userId, bids[i].userId, remainingQTY, bids[i].price); // Buyer is userId
                    remainingQTY = 0;
                    break;
                } else {
                    remainingQTY -= bids[i].quantity;
                    console.log('Filling order for user:', userId);
                    await flipBalance(userId, bids[i].userId, bids[i].quantity, bids[i].price);
                    bids.splice(i, 1);
                }
            }
        }

        await orderBook.save();
        return remainingQTY;
    } catch (error) {
        console.error("Error filling orders:", error.message);
        return remainingQTY; // Return even if there is an error
    }
};




const createUser = async (req, res) => {
    const { userId, name } = req.body;
    const balance = 0; // initial balance
    const BTC = 0;
    try {
        const user = new User({ userId, name, balance, BTC});
        await user.save();
        res.status(200).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create user");
    }
};


const getBalance = async (req, res) => {
    const {userId} = req.body;
    try{
        const user = await User.findOne({userId});
        if (!user) return res.status(404).send("User not found");
        res.status(200).json({BTC : user.BTC, balance : user.balance});
    }
    catch(Error){
        console.error(Error);
        res.status(500).send("Failed to fetch balance");
    }
};



const placeOrder = async (req, res) => {
    const { userId, side, price, quantity } = req.body;

    try {
        let orderBook = await OrderBook.findOne();
        if (!orderBook) {
            orderBook = new OrderBook({ bids: [], asks: [] });
            await orderBook.save();
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).send("User not found");

        // Check if the user has enough BTC for the order (if it's an ask)
        if (side === "ask" && user.BTC < quantity) {
            return res.status(400).send("Insufficient BTC balance to place ask order");
        }

        const remainingQTY = await fillOrders(side, price, quantity, userId);

        if (remainingQTY === 0) {
            return res.status(200).send(`Order Filled: ${quantity}`);
        }

        // If there is remaining quantity, add the order to the book
        if (side === "bid") {
            orderBook.bids.push({ price, quantity, userId });
        } else if (side === "ask") {
            orderBook.asks.push({ price, quantity, userId });
        }

        // Save the updated order book
        await orderBook.save();

        // Save the updated user balance
        await user.save();

        res.status(200).send("Order placed successfully");
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).send("Failed to place order");
    }
};

const getOrderBook = async (req, res) => {
    try {
        const orderBook = await OrderBook.findOne();
        if (!orderBook) return res.status(404).send("Order book not found");

        res.status(200).send(orderBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch order book");
    }
};

const getQuote = async (req, res) => {
    const { side, price } = req.body;
    try {
        const orderBook = await OrderBook.findOne();

        if (side == 'bid') {
            const match = orderBook.asks.find(order => order.price <= price);
            return res.status(200).send(match ? match : "No matching ask");
        } else if (side == 'ask') {
            const match = orderBook.bids.find(order => order.price >= price);
            return res.status(200).send(match ? match : "No matching bid");
        }

        res.status(400).send("Invalid side");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch quote");
    }
};

// Route Endpoints
app.get('/balance', getBalance);
app.post('/order', placeOrder);
app.get('/depth', getOrderBook);
app.get('/quote', getQuote);
app.post('/createUser', createUser);

// Database Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
};
connect();

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
