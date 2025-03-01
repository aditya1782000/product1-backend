import { Request, Response } from 'express';
import {
    clockInClockedOut,
    listClockInClockOutTimes,
    listSubAdminAttendanceSheet,
} from './attendance.services';

export const clockInClockOutControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { location } = req.body;

    const oResponse = await clockInClockedOut(userId, location, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listClockInClockOutTimesControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { month, year } = req.query;

    const oResponse = await listClockInClockOutTimes(
        userId,
        Number(month),
        Number(year),
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listSubAdminAttendanceSheetControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listSubAdminAttendanceSheet(
        userId,
        req,
        offSet,
        limit,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};
