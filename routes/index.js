import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.end('Hello you');
});

indexRouter.get('/status', AppController.getStatus);
indexRouter.get('/stats', AppController.getStats);

indexRouter.post('/users', UsersController.postNew);
// indexRouter.post('/users/me', AuthController.getMe);

indexRouter.get('/connect', AuthController.getConnect);
// indexRouter.post('/disconnect', AuthController.getDisconnect);

export default indexRouter;
