import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import routes from './src/routes/appRoutes';

const app = express();
const { port: PORT, mongoDB_uri: MONGODB_URI, serverUrl } = config;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.log('There was a db connection error', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

routes(app);

app.get('/', (req, res) => {
  res.render('index', {
    content: `Node.js and express server is running on ${serverUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
