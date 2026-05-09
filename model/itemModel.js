import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    boardingAddress:{
        type: String,
        required:true
    },
    contact: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        default: "Available"
    }
});

export default mongoose.model("items", itemSchema);