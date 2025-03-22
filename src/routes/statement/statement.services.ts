import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { storeStatements } from '../../utils/csvParse';
import { Request } from 'express';
import fs from 'fs';

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

export const addStatements = async (
    req: Request,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        if (!req.file) {
            return {
                statusCode: 400,
                success: false,
                message: 'No file uploaded',
            };
        }

        const filePath = req.file.path;

        await storeStatements(filePath, organisation);

        return {
            statusCode: 200,
            success: true,
            message: 'Statements added successfully',
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
    } finally {
        if (req?.file?.path) {
            deleteTempFile(req?.file?.path);
        }
    }
};
