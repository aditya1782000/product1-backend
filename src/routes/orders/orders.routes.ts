import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import {
    createCustomerOrderController,
    listCompletedOrdersControllers,
    listPendingOrdersControllers,
    receiveCustomerOrdersControllers,
} from './orders.controllers';
import {
    createCustomerOrderValidators,
    listCompletedOrdersValidators,
    listPendingOrdersValidators,
} from './orders.validators';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();

// Admin panel APIs
router.get(
    '/admin/orders/receive',
    isAdmin('orders', 'V'),
    receiveCustomerOrdersControllers,
);

router.get(
    '/admin/orders/pending/list',
    listPendingOrdersValidators,
    isAdmin('orders', 'V'),
    listPendingOrdersControllers,
);

router.get(
    '/admin/orders/completed/list',
    listCompletedOrdersValidators,
    isAdmin('orders', 'V'),
    listCompletedOrdersControllers,
);

// Customer APIs
router.post(
    '/customer/order/create',
    createCustomerOrderValidators,
    isCustomer(),
    createCustomerOrderController,
);

export default router;
