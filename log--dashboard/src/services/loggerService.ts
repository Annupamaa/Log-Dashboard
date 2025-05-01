import { LogLevel } from '../Config/enums/LogLevel';
import { Logger } from '../utils/logger';
import { DatabaseType } from '../Config/enums/DatabaseType';
import { getConfig } from '../Config/config'; 
import { Errors } from '../utils/errors';

const config = getConfig();

if (config.databaseType === DatabaseType.MONGODB && !config.mongodbUri) {
    throw new Error(Errors.MONGODB_URI_UNDEFINED);
}

const logger = config.databaseType === DatabaseType.MONGODB ? Logger.getInstance() : undefined;

export const logMessage = async (
    application: string,
    timestamp: string,
    message: string,
    log: { level: LogLevel, file?: string },
    additionalData: { [key: string]: any }
) => {
    try {
        if (config.databaseType === DatabaseType.MONGODB) {
            if(logger){
                await logger.log(application, timestamp, log, message, additionalData);
            }else{
                throw new Error(Errors.LOGGER_NOT_INITIALIZED);
            }
        }
    } catch (error) {
        console.error(Errors.ERROR_LOGGING_MESSAGE, error);
        throw new Error(Errors.ERROR_LOGGING_MESSAGE);
    }
};
