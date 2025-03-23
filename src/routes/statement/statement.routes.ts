import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addStatementsControllers,
    listStatementsControllers,
} from './statement.controllers';
import { listStatementsValidators } from './statement.validators';
const router = express.Router();

router.post(
    '/admin/statements/add',
    uploader.uploadFile('csv'),
    isAdmin('Statements', 'A'),
    addStatementsControllers,
);

router.post(
    '/admin/statements/list',
    listStatementsValidators,
    isAdmin('Statements', 'V'),
    listStatementsControllers,
);

export default router;
