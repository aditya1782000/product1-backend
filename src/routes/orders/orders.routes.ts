import express from 'express';
import { isCustomer } from '../../middleware/isCustomer';
import {
    createCustomerOrderController,
    editOrderControllers,
    listCompletedOrdersControllers,
    listCustomerCompletedOrdersControllers,
    listCustomerPendingOrdersControllers,
    listPendingOrdersControllers,
    receiveCustomerOrdersControllers,
    viewAdminOrderControllers,
    viewCustomerOrderControllers,
} from './orders.controllers';
import {
    createCustomerOrderValidators,
    editOrderValidators,
    listCompletedOrdersValidators,
    listPendingOrdersValidators,
    viewAdminOrderValidators,
    viewCustomerOrderValidators,
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

router.get(
    '/admin/order/:id/view',
    viewAdminOrderValidators,
    isAdmin('orders', 'V'),
    viewAdminOrderControllers,
);

router.patch(
    '/admin/order/:id/edit',
    editOrderValidators,
    isAdmin('orders', 'E'),
    editOrderControllers,
);

// Customer APIs
router.post(
    '/customer/order/create',
    createCustomerOrderValidators,
    isCustomer(),
    createCustomerOrderController,
);

router.get(
    '/customer/orders/pending/list',
    isCustomer(),
    listCustomerPendingOrdersControllers,
);

router.get(
    '/customer/orders/completed/list',
    viewCustomerOrderValidators,
    isCustomer(),
    listCustomerCompletedOrdersControllers,
);

router.get('/customer/order/view', isCustomer(), viewCustomerOrderControllers);

export default router;
