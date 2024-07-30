const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
        required: true
    },
    details: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fat: Number,
        fiber: Number,
    },
    eatenDate: {
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
    quantity: {
        type: Number,
        min: 1
    }
}, { timestamps: true });

const trackModel = mongoose.model("tracks", trackingSchema);

module.exports = trackModel;
