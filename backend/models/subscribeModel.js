import mongoose from "mongoose";

// Define a schema and model
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: {type: Date, default:Date.now, }
}, {timestamps: true});

const subscribeModel = mongoose.models.subscriber || mongoose.model("Subscriber", subscriberSchema);
export default subscribeModel;
