import mongoose from "mongoose";

// Define a schema and model
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const subscribeModel = mongoose.model("Subscriber", subscriberSchema);
export default subscribeModel
