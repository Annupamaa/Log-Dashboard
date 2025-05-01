import dotenv from 'dotenv';
import { DatabaseType } from './enums/DatabaseType';
import { Config as ConfigInterface } from '../interfaces';
import { Errors } from '../utils/errors';

dotenv.config();

export const getConfig = (): ConfigInterface => {
    const databaseType = parseInt(process.env.DATABASE_TYPE as string, 10) as DatabaseType;
    if (databaseType !== DatabaseType.MONGODB){
        throw new Error(Errors.INVALID_DATABASE_TYPE);
    }

    const mongodbUri = process.env.MONGODB_URI;
    if (databaseType === DatabaseType.MONGODB && !mongodbUri) {
        throw new Error(Errors.MONGODB_URI_UNDEFINED);
    }

    const dbName = process.env.DB_NAME;
    const collectionName = process.env.COLLECTION_NAME;
    if (!dbName || !collectionName) {
        throw new Error(Errors.DB_NAME_COLLECTION_NAME_UNDEFINED);
    }

    const bucketSize = parseInt(process.env.BUCKET_SIZE as string, 10);
    const flushInterval = parseInt(process.env.FLUSH_INTERVAL as string, 10);

    return {
        databaseType,
        mongodbUri,
        dbName,
        collectionName,
        bucketSize,
        flushInterval,
    };
};
