import express from 'express';
import logRoutes from './routes/logRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/logs', logRoutes);

const PORT = process.env.PORT || 3070;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
