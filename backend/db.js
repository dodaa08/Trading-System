import {mongoose, Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    name: { type: String},
    balance: { type: Number },
    BTC : { type: Number },
});

const OrderBookModel = new Schema({
    bids: [
        {
            price: Number,
            quantity: Number,
        },
    ],
    asks: [
        {
            price: Number,
            quantity: Number,
        },
    ],
});






const OrderBook = mongoose.model('OrderBook', OrderBookModel);
const User = mongoose.model('User', UserSchema);


export default {  OrderBook, User};


