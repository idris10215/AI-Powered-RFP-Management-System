import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rfpRoutes from './routes/rfp.routes.js';
import vendorRoutes from './routes/vendor.routes.js';

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT ;


app.use("/api/rfp", rfpRoutes);
app.use("/api/vendors", vendorRoutes);


const startServer = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB connected`);

        app.listen(port, () => {
            console.log(`Server running in port ${port}`);
        })

    } catch (err) {
        console.log(err);
    }
}
startServer();