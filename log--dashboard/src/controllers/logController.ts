import { Request, Response } from 'express';
import { logMessage } from '../services/loggerService';
import { Errors } from '../utils/errors';

export const createLog = async (req: Request, res: Response) => {
    const { application, timestamp, message, log, ...additionalData } = req.body;

    if (!application || !timestamp || !log.level) {
        console.log("errrrorrrr")
        return res.status(400).json({ error: Errors.MISSING_FIELD });
    }

    try {
        await logMessage(application, timestamp, message, log, additionalData);
        res.status(201).json({ message: 'Log created' });
    } catch (error) {
        console.error(Errors.ERROR_CREATING_LOG, error);
        res.status(500).json({ error: Errors.ERROR_CREATING_LOG });
    }
};
