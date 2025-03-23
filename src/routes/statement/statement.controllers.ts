import { Request, Response } from 'express';
import { addStatements, listStatements } from './statement.services';

export const addStatementsControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await addStatements(req, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listStatementsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { organizationName } = req.body;
    const from = new Date(req.body.from);
    const to = new Date(req.body.to);

    const oResponse = await listStatements(
        organizationName,
        organization,
        from,
        to,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};
