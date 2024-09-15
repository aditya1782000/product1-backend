import express from 'express';
import {
    userChangePasswordController,
    userLoginController,
    userLogoutController,
    userPasswordReserPostController,
    userPasswordResetController,
    userPasswordResetGetController,
} from './auth.controllers';
import {
    userChangePasswordValidator,
    userLoginValidator,
    userPasswordResetGetValidator,
    userPasswordResetPostValidator,
    userPasswordResetValidator,
} from './auth.validators';
import { validateOnlyAdmin } from '../../middleware/isOnlyAdmin';

const router = express.Router();

router.post('/admin/user/login', userLoginValidator, userLoginController);

router.post(
    '/admin/password/reset',
    userPasswordResetValidator,
    userPasswordResetController,
);

router.get(
    '/admin/password/:token/reset',
    userPasswordResetGetValidator,
    userPasswordResetGetController,
);

router.post(
    '/admin/password/:token/reset',
    userPasswordResetPostValidator,
    userPasswordReserPostController,
);

router.post('/admin/user/logout', validateOnlyAdmin(), userLogoutController);

router.post(
    '/admin/user/password/change',
    userChangePasswordValidator,
    validateOnlyAdmin(),
    userChangePasswordController,
);

export default router;
