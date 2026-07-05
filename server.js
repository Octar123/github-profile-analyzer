import express from 'express';
import { initializeDB } from './config/initDb.js';
import * as dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

const startServer = async () => {
    await initializeDB();

    app.use("/api/v1", profileRoutes);
    app.use("/", (req, res) => {
        res.send("hi");
    })



    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
}

startServer();