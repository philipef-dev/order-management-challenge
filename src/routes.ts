import { Router } from 'express'
import * as AuthController from './controllers/AuthController.js'
import * as OrderController from './controllers/OrderController.js'
import { authMiddleware } from './middlewares/auth.js'

const routes = Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

routes.use(authMiddleware);

routes.post('/orders', OrderController.createOrder);
routes.get('/orders', OrderController.listOrders);

routes.patch('/orders/:id/advance', OrderController.advanceOrder);

export default routes;
