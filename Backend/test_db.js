import mongoose from "mongoose";

async function test() {
  try {
    console.log("Trying local MongoDB...");
    await mongoose.connect("mongodb://127.0.0.1:27017/artisan_test", { serverSelectionTimeoutMS: 2000 });
    console.log("SUCCESS: connected to local MongoDB!");
    await mongoose.disconnect();
  } catch (err) {
    console.log("FAILED: connect to local MongoDB:", err.message);
  }
  process.exit(0);
}

test();
