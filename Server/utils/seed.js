import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor } from '../models/Vendor.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB...");

    await Vendor.deleteMany({});
    console.log("Cleared old vendors");

    const vendors = [
      {
        name: "Tech Corp (Your Main Test)",
        email: "mdidris10215@gmail.com", 
        category: "Electronics"
      },
      {
        name: "Budget Laptops Inc",
        email: "asifa180303@gmail.com", 
        category: "Electronics"
      },
      {
        name: "Fast Delivery Co",
        email: "abdulmuqit.341@gmail.com", 
        category: "Logistics"
      }
    ];

    await Vendor.insertMany(vendors);
    console.log(`Successfully added ${vendors.length} vendors!`);
    
    process.exit();
    
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

seed();