import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import API route modules
import sessionRoutes from './routes/session';
// import tasksRoutes from './routes/tasks'; // if you have task routes

// Initialize express app
const app = express();

// Configure middleware
// Allow credentials so secure cookies (__session) can be used when desired
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Mount modular API routes under /api
app.use('/api', sessionRoutes);
// app.use('/api/tasks', tasksRoutes);

export default app;
