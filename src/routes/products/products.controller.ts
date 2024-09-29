import { Request, Response } from 'express';
import { addProduct } from './products.services';

export const addProductsController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { productName, description, howToUse, unitType } = req.body;


    // This need to change when connecting to the React(This is for post man only)
    let price;
    if (typeof req.body.price === 'string') {
        try {
            price = JSON.parse(req.body.price);
        } catch (error: unknown) {
            return res.status(400).send({
                success: false,
                message: error,
            });
        }
    } else {
        price = req.body.price;
    }

    const oResponse = await addProduct(
        req,
        productName,
        description,
        howToUse,
        unitType,
        price,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};
