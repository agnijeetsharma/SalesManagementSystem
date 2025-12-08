import express from 'express';
const router = express.Router();
import { getSales } from '../controllers/salesController.js';
import validate from '../middlewares/validate.js';
import salesQuerySchema from '../validators/salesQuery.js';


router.get('/', validate(salesQuerySchema, 'query'), getSales);

export { router as salesRoutes };
