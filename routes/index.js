import express from 'express';
import AppController from '../controllers/AppController';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.end('Hello you');
});

indexRouter.get('/status', AppController.getStatus);
indexRouter.get('/stats', AppController.getStats);
export default indexRouter;
