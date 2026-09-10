import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDatabase from './src/config/db.js';

// Connect to database
connectDatabase();

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
