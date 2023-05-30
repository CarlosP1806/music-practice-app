import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './config/connection';
import routes from './routes';
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
