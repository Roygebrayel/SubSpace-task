import express from 'express';
import routess from './routes.js';


const app = express();
const PORT = process.env.PORT || 3000;


app.use('/api',routess);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
