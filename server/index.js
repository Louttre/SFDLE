import express from 'express';
import sotenv from 'dotenv';

const app  = express();

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:3000');
});