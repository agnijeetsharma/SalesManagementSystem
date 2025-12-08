import dotenv from 'dotenv';
import connectdb from './db/index.js';
import { app } from './app.js';
dotenv.config({ path: './.env' }); 
connectdb()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server started at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); 
  });

