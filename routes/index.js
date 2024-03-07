import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.end('Hello you');
});

indexRouter.get('/status', AppController.getStatus);
indexRouter.get('/stats', AppController.getStats);

indexRouter.post('/users', UsersController.postNew);
export default indexRouter;
