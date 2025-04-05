import express from 'express';
import { addDeliveryAddressValidators } from './deliveryAddress.validators';
import { isCustomer } from '../../middleware/isCustomer';
import {
    addDeliveryAddressControllers,
    listDeliveryAddressControllers,
} from './deliveryAddress.controllers';

const router = express.Router();

router.post(
    '/custome/delivery/address/add',
    addDeliveryAddressValidators,
    isCustomer(),
    addDeliveryAddressControllers,
);

router.get(
    '/custome/delivery/address/list',
    isCustomer(),
    listDeliveryAddressControllers,
);

export default router;
