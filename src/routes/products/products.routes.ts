import express from 'express';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import { addProductsController } from './products.controller';
import { addProductValidators } from './products.validators';
const router = express.Router();

//Admin panel Apis
router.post(
    '/admin/products/add',
    uploader.uploadFile('image'),
    addProductValidators,
    isAdmin('products', 'A'),
    addProductsController,
);

export default router;
