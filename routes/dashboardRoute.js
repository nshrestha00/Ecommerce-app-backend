// routes/dashboardRoute.js
import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// Dashboard stats route
dashboardRouter.get('/stats', getDashboardStats);

export default dashboardRouter;
