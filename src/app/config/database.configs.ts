import mongoose from "mongoose";
import { MESSAGES } from "./constants.configs";
mongoose.set("strictQuery", true);

export default function connectToMongo() {
  mongoose
    .connect(process.env.MONGO_URI!, {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 50000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    })
    .then(() => {
      console.log(MESSAGES.DATABASE.CONNECTED);
    })
    .catch((err) => {
      console.log(MESSAGES.DATABASE.ERROR, err);
    });
}
