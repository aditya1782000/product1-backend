import express from 'express';
import registration from './registration/registration.routes';

const router = express.Router();

router.use('/', [
    registration
]);

export default router;
