import express from 'express';
import registration from './registration/registration.routes';
import auth from './auth/auth.routes';

const router = express.Router();

router.use('/', [registration, auth]);

export default router;
