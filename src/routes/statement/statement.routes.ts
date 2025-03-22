import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import { addStatementsControllers } from './statement.controllers';
const router = express.Router();

router.post(
    '/admin/statements/add',
    uploader.uploadFile('csv'),
    isAdmin('Statements', 'A'),
    addStatementsControllers,
);

export default router;
