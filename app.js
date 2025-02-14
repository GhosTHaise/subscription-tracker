import express from 'express';
import { PORT } from "./config/env.js";
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();
const __version__ = "v1"

app.use(`/api/${__version__}/auth`, authRouter);
app.use(`/api/${__version__}/user`, userRouter);
app.use(`/api/${__version__}/subscription`, subscriptionRouter);

app.get('/', (req,res) => {
    res.send('Welcome to the Subscription Tracker API!');
})

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
})