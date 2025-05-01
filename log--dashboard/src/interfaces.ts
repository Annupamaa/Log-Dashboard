import { LogLevel } from "./Config/enums/LogLevel";  
import { DatabaseType } from "./Config/enums/DatabaseType";

export interface LogEntry {
    application: string;
    timestamp: string;
    message?: string;
    log: {
        level: LogLevel;
        file?: string;
    };
    [key: string]: any;
}

export interface Config {
    databaseType: DatabaseType;
    mongodbUri?: string;
    dbName: string;
    collectionName: string;
    bucketSize: number;
    flushInterval: number;
}

export interface LoggerConfig {
    mongodbUri: string;
    bucketSize: number;
    flushInterval: number;
    dbName: string;
    collectionName: string;
}
