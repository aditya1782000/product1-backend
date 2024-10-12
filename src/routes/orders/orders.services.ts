import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { myKafka } from '../../utils/kafka';
import Order from '../../models/orders';
import { Request } from 'express';
import dataTable from '../../utils/dataTable';
import User from '../../models/user';

interface OrderItems {
    product: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: string;
    unitPrice: number;
    totalPrice: number;
}

export const createCustomerOrder = async (
    customer: mongoose.Types.ObjectId,
    orderItems: OrderItems[],
    totalAmount: number,
    status: string,
    type: string = 'customer',
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const order = {
            customer,
            orderItems,
            totalAmount,
            status,
            type,
            organization: organisation,
        };

        const producer = myKafka.producer();
        await producer.connect();

        await producer.send({
            topic: process.env.TOPIC_ONE || '',
            messages: [
                {
                    value: JSON.stringify(order),
                    key: order.organization.toString(),
                },
            ],
        });

        await producer.disconnect();

        return {
            statusCode: 200,
            success: true,
            message: 'Order created successfully',
            data: order,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const recieveCustomerOrders = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const consumer = myKafka.consumer({
            groupId: `${process.env.GROUP_ID || 'order'}-${organisation}`,
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });
        await consumer.connect();

        await consumer.subscribe({
            topic: process.env.TOPIC_ONE || '',
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const orderData = JSON.parse(`${message.value}` || '');

                    if (
                        orderData.organization.toString() ===
                        organisation.toString()
                    ) {
                        const newOrder = new Order(orderData);
                        await newOrder.save();
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Orders received successfully',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const listPendingOrders = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerSearchFields = ['firstName', 'lastName'];

        const customerNumberFields = ['phoneNumber'];

        const orderSearchFields = ['status'];

        const orderNumberFields = ['totalAmount'];

        const oCustomerData = dataTable.initDataTable(
            req.body,
            customerSearchFields,
            'srNo',
            customerNumberFields,
        );

        const oOrderData = dataTable.initDataTable(
            req.body,
            orderSearchFields,
            'srNo',
            orderNumberFields,
        );

        const orderQuery = {
            ...oOrderData.oSearchData,
            status: 'inApproval',
            organization: { $in: [organisation] },
            customer: {
                $in: await User.find(oCustomerData.oSearchData).select('_id'),
            },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt status')
            .collation({ locale: 'en', strength: 1 })
            .sort(oOrderData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No pending orders found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Pending orders retrieved successfully',
            data: orders,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const listCompletedOrders = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerSearchFields = ['firstName', 'lastName'];

        const customerNumberFields = ['phoneNumber'];

        const orderSearchFields = ['status'];

        const orderNumberFields = ['totalAmount'];

        const oCustomerData = dataTable.initDataTable(
            req.body,
            customerSearchFields,
            'srNo',
            customerNumberFields,
        );

        const oOrderData = dataTable.initDataTable(
            req.body,
            orderSearchFields,
            'srNo',
            orderNumberFields,
        );

        const orderQuery = {
            ...oOrderData.oSearchData,
            status: { $in : ['approved', 'rejected', 'delivered']},
            organization: { $in: [organisation] },
            customer: {
                $in: await User.find(oCustomerData.oSearchData).select('_id'),
            },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt status')
            .collation({ locale: 'en', strength: 1 })
            .sort(oOrderData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No completed orders found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Completed orders retrieved successfully',
            data: orders,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};
