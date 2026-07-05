import express from 'express';
import { initializeDB } from './config/initDb.js';
import * as dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

const startServer = async () => {
    await initializeDB();

    app.use("/api/v1", profileRoutes);
    
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
}

startServer();