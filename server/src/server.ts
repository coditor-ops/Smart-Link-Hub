import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
import authRoutes from './routes/authRoutes';
import hubRoutes from './routes/hubRoutes';
import linkRoutes from './routes/linkRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/links', linkRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('Smart Link Hub API is running. Check /health for status.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
