import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import db from './db.js'; 
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



const Auth = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).send("User ID is required");

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).send("User not found");

    next();
};



const updateOrderBook = async (side, price, quantity) => {
    try {
        const orderBook = await OrderBook.findOne();
        if (!orderBook) throw new Error("Order book not found");

        if (side === "ask") {
            // Remove the fulfilled ask
            await OrderBook.updateOne(
                {},
                { $pull: { asks: { price, quantity } } }
            );
        } else if (side === "bid") {
            // Remove the fulfilled bid
            await OrderBook.updateOne(
                {},
                { $pull: { bids: { price, quantity } } }
            );
        }
    } catch (error) {
        console.error("Error updating order book:", error.message);
        throw error;
    }
};

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

        if (fromUser === toUser) {
            throw new Error("User cannot trade with itself");
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

        // Fetch the OrderBook
        const orderbook = await OrderBook.findOne();
        if (!orderbook) throw new Error("Order book not found");
        const { asks, bids } = orderbook;

        if (asks.length === 0 || bids.length === 0) {
            return;
        }

        // Call updateOrderBook to remove the fulfilled ask/bid from the order book
       
            // Check if it's a bid or ask side to update accordingly
            const side = "ask"; // Add logic to determine side (ask/bid)
            await updateOrderBook(side, 0, 0);
        

        console.log(
            `Transaction successful: ${quantity} at ${price}. Updated balances for Users ${fromUserId} and ${toUserId}.`
        );
        console.log(`Removed fulfilled order from order book.`);
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
    const balance = 100000; // initial balance
    const BTC = 1;    

    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).send("User already exists");

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
        // 1️⃣ Validate Input
        if (!userId) return res.status(400).json({ message: "User ID is required" });
        if (!quantity || quantity <= 0 || isNaN(quantity)) return res.status(400).json({ message: "Invalid quantity. It must be a positive number." });
        if (!price || price <= 0 || isNaN(price)) return res.status(400).json({ message: "Invalid price. It must be a positive number." });
        if (!["bid", "ask"].includes(side)) return res.status(400).json({ message: "Invalid side. Must be 'bid' or 'ask'." });

        // 2️⃣ Check if OrderBook exists
        let orderBook = await OrderBook.findOne();
        if (!orderBook) {
            orderBook = new OrderBook({ bids: [], asks: [] });
            await orderBook.save();
        }

        // 3️⃣ Check if user exists
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ message: "User not found" });




        // 4️⃣ Check if user has enough balance for an ask (sell) order
        if (side === 'ask' && user.BTC < quantity) {
            return res.status(400).json({ message: "Insufficient BTC balance to place an ask order" });
        }

        // 5️⃣ Attempt to fill existing orders
        let remainingQTY;
        try {
            remainingQTY = await fillOrders(side, price, quantity, userId);
        } catch (error) {
            console.error("Error filling order:", error.message);
            return res.status(500).json({ message: "Failed to fill the order", error: error.message });
        }

        // 6️⃣ If fully filled, respond successfully
        if (remainingQTY === 0) {
            return res.status(200).json({ message: `Order fully filled`, quantity });
        }

        // 7️⃣ If remaining quantity, add to OrderBook
        if (side === "bid") {
            await OrderBook.findOneAndUpdate({}, { $push: { bids: { price, quantity: remainingQTY, userId } } });
            user.fiatBalance -= price * quantity;
        } else if (side === "ask") {
            await OrderBook.findOneAndUpdate({}, { $push: { asks: { price, quantity: remainingQTY, userId } } });
            user.balance -= quantity;
        }

        // 8️⃣ Save User Balance
        await user.save();

        res.status(200).json({ message: "Order placed successfully", order: { side, price, quantity: remainingQTY } });
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

const getDepth = async (req, res) => {
    const depth = {};

    const orderBook = await OrderBook.findOne();
const { bids, asks } = orderBook; // Ensure OrderBook has bids/asks structure
    console.log("Bids:", bids);
    console.log("Asks:", asks);

    try {
        // Accumulate bids
        for (let i = 0; i < bids.length; i++) {
            console.log("Processing bid:", bids[i]);
            depth[bids[i].price] = (depth[bids[i].price] || 0) + bids[i].quantity;
        }
        // Accumulate asks
        for (let i = 0; i < asks.length; i++) {
            console.log("Processing ask:", asks[i]);
            depth[asks[i].price] = (depth[asks[i].price] || 0) + asks[i].quantity;
        }

        console.log("Depth:", depth);
        res.status(200).json({ depth });
    } catch (error) {
        console.error("Error processing depth:", error);
        res.status(500).send("Failed to fetch depth");
    }
};



const getQuote = async (req, res) => {
    let AskPrice = 0;
    let BidPrice = 0;
    const orderBook = await OrderBook.findOne();
const { asks, bids } = orderBook;
     // Ensure OrderBook is correctly fetched from DB or provided

     if(asks.length == 0 || bids.length == 0){
        return res.status(400).send("Error: Invalid order book format (asks or bids missing).");
     }
    // Check if asks and bids are defined and are arrays
    if (!Array.isArray(asks) || !Array.isArray(bids)) {
        return res.status(400).send("Error: Invalid order book format (asks or bids missing).");
    }

    let result = 0;

    try {
        // Sort the bids in descending order and asks in ascending order
        const sortedAsks = asks.sort((a, b) => a.price - b.price);  // Sort asks in ascending order
        const sortedBids = bids.sort((a, b) => b.price - a.price);  // Sort bids in descending order

        // Get the lowest ask price (first item in sorted asks array)
        if (sortedAsks.length > 0) {
            AskPrice = sortedAsks[0].price;
        }

        // Get the highest bid price (first item in sorted bids array)
        if (sortedBids.length > 0) {
            BidPrice = sortedBids[0].price;
        }

        // If both prices are available, calculate the percentage difference
        if (AskPrice && BidPrice) {
            result = ((AskPrice - BidPrice) / BidPrice) * 100;
            res.status(200).send(result.toFixed(2) + "%");
        } else {
            res.status(400).send("Error: No valid ask or bid prices found.");
        }
    } catch (error) {
        console.error("Error calculating quote:", error);
        res.status(500).send("Internal server error.");
    }
};

const getBids = async (req, res) => {
    try {
        // Query the OrderBook collection and project only the bids field
        const orderBook = await OrderBook.findOne({}, { bids: 1 });
        console.log(orderBook.bids);
        res.status(200).json({ bids: orderBook.bids });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getAsks = async (req, res) => {   
    try{
        const orderBook = await OrderBook.findOne({}, {asks: 1});
        console.log(orderBook.asks);
        res.status(200).json({asks: orderBook.asks});
    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");  
    }
}

const getVolume = async (req, res) => {
    try {
        const orderBook = await OrderBook.findOne();
        if (!orderBook) return res.status(404).send("Order book not found");

        const { bids, asks } = orderBook;

        // Calculate total volume (sum of quantities)
        const bidVolume = bids.reduce((acc, bid) => acc + bid.price *bid.quantity , 0);
        const askVolume = asks.reduce((acc, ask) => acc + ask.price * ask.quantity, 0);

        const totalVolume = bidVolume + askVolume;

        res.status(200).json({ totalVolume});
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch volume");
    }
};


const deleteOrderBook = async (req, res)=>{
    try{
        await OrderBook.deleteMany();
        res.status(200).send("Order Book deleted successfully");
    }
    catch(Error){
        console.error(Error);
    }
}


// Route Endpoints
app.post('/balance', Auth, getBalance);
app.post('/order', Auth, placeOrder);
app.get('/depth', getDepth);
app.get('/quote', getQuote);
app.post('/createUser', createUser);
app.get("/bids", getBids);
app.get("/asks", getAsks);
app.get("/volume", getVolume);
app.delete("/deleteO", deleteOrderBook);
app.get("/", (req, res) => res.send("Welcome to SellMeUp!"));

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL  || "mongodb+srv://dodakartik26:LzEnLaLX8mejXN2q@cluster0.t5zhc.mongodb.net/SellMeUp");
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
};
connect();


app.listen( process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
