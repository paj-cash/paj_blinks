import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};
if (!uri) throw new Error(`please add mongodb uri to env.local`);

// Declare a cached MongoClient promise for reuse
let client;
let clientPromise: Promise<MongoClient>;

// Check if we're in development

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise; // Now TypeScript recognizes this

export default clientPromise;
