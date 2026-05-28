import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import path from 'path';

// Load routes
import authRoutes from './routes/authRoutes';
import hubRoutes from './routes/hubRoutes';
import linkRoutes from './routes/linkRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('Smart Link Hub API is running. Check /health for status.');
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);

            // Internal Keep-Alive: Pings the server every 8 minutes to prevent sleep on free tiers
            const SELF_URL = process.env.SELF_URL;
            if (SELF_URL) {
                console.log(`[System] Keep-alive initialized for ${SELF_URL}`);
                setInterval(() => {
                    const protocol = SELF_URL.startsWith('https') ? require('https') : require('http');
                    protocol.get(`${SELF_URL}/health`, (res: any) => {
                        const timestamp = new Date().toISOString();
                        console.log(`[${timestamp}] Keep-alive heartbeat: ${res.statusCode}`);
                    }).on('error', (err: any) => {
                        console.error(`[Keep-alive] Heartbeat failed: ${err.message}`);
                    });
                }, 8 * 60 * 1000); // 8 minute interval
            } else {
                console.warn('\n================================================================');
                console.warn('[System] WARNING: SELF_URL environment variable is not defined!');
                console.warn('[System] To prevent the backend from sleeping on free hosting (like Render),');
                console.warn('[System] you MUST set SELF_URL to your deployed backend URL in your hosting provider\'s environment variables.');
                console.warn('================================================================\n');
            }
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
