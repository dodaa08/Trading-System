import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
));


const Tiker = "BTCUSDT"; // Tiker name

const bids = [];
const asks = [];
const users = [{
    id : 1,
    balance : {
        "BTC" : 10,
        "USDT" : 1000
    }    
},
{
    id : 2,
    balance : {
        "BTC" : 10,
        "USDT" : 1000
    }
}
];


const flipBalance = (userId1, userId2, quantity, price )=>{
     const user1 = users.find(user => user.id == userId1);
        const user2 = users.find(user => user.id === userId2);
        if(!user1 || !user2){
            return;
        }

        user1.balance[Tiker] -= quantity;
        user2.balance[Tiker] += quantity ;
        user1.balance["USDT"] += quantity * price;
        user2.balance["USDT"] -= quantity * price;
}

const fillOrders = (side, price, quantity, userId)=>{
    let remainingQTY = quantity;
    if (remainingQTY === 0) {
        return res.status(200).send(`Order Filled: ${quantity}`);
    }
    if(side == "bid"){
        for(let i = asks.length-1 ; i>=0; i++){
            if(asks[i].price>price){
                break;
            }
            if(asks[i].quantity > remainingQTY){
                asks[i].quantity -= remainingQTY;
                flipBalance(asks[i].userId, userId, remainingQTY, asks[i].price);
                break;
            }
            else{
                remainingQTY -= asks[i].quantity;
                flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
                asks.pop();
            }
        }
    }
    else{
        for(let i = bids.length-1 ; i>=0; i++){
            if(bids[i].price<price){
                break;
            }
            if(bids[i].quantity > remainingQTY){
                bids[i].quantity -= remainingQTY;
                flipBalance(bids[i].userId, userId, remainingQTY, price);
                break;
            }
            else{
                remainingQTY -= bids[i].quantity;
                flipBalance(bids[i].userId, userId, bids[i].quantity, price);
                bids.pop();

        }
    }
}

return remainingQTY;
}
const orders = (req, res) => {
    const { quantity, price, side, userId } = req.body;
    console.log(userId, quantity, price, side);
    const remainingQTY = fillOrders(side, price, quantity, userId);
    if(remainingQTY == 0){
       return  res.status(200).send("Order Filled", quantity);
    }

    if(side == "bid"){
        bids.push({userId, quantity : remainingQTY, price});
        res.status(200).send("Order Placed");
    }
    else{
        asks.push({userId, quantity : remainingQTY, price});
        res.status(200).send("Order Placed");
    }
};

const findDepth =(req, res)=>{
    const depth = {};

    for(let i =0; i<bids.length; i++){
        const bid = bids[i];
        if(!depth[bid.price]){
            depth[bid.price] = 0;
        }
        depth[bid.price] += bid.quantity;
    }

    const asks = [];
    for(let i =0; i<asks.length; i++){
        const ask = asks[i];
        if(!asks[ask.price]){
            asks[ask.price] = 0;
        }
        asks[ask.price] += ask.quantity;
    }

    res.status(200).send({bids: depth, asks});

}



const getBalance = (req, res) => {
    const { userId } = req.params;  // Correctly capture userId from the URL parameter
    const user = users.find(user => user.id == userId);
    
    if (!user) {
        return res.status(404).send("User not found");
    }

    res.status(200).send(user.balance);
};



const getQuote = (req, res)=>{
    const {quantity, side} = req.body;
    if (side === "bid") {
        const Ask = asks[0];
        if (!Ask) {
            return res.json({ Message: "Ask not found" });
        }
        res.json({ Ask: Ask.price, total: Ask.price * quantity });  // Corrected to use total
    } else {
        const bestBid = bids[0];
        if (!bestBid) {
            return res.json({ Message: "Bid not found" });
        }
        res.json({ Bestbid: bestBid.price, total: bestBid.price * quantity });  // Corrected to use total
    }
    
}


// Place a Limit order -
app.post("/orders", orders);
app.get("/depth", findDepth);
app.get("/balance/:userId", getBalance);
app.get("/quote", getQuote);



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})