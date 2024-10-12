import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { myKafka } from '../../utils/kafka';
import Order from '../../models/orders';

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
                const orderData = JSON.parse(`${message.value}` || '');

                if (
                    orderData.organization.toString() ===
                    organisation.toString()
                ) {
                    const newOrder = new Order(orderData);
                    await newOrder.save();
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
