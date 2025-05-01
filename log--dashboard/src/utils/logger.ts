import { MongoClient } from 'mongodb';
import { LogLevel } from '../Config/enums/LogLevel';
import { getConfig } from '../Config/config';
import { LogEntry } from '../interfaces';
import { LoggerConfig } from '../interfaces';

class Logger {
    private static instance: Logger;
    private static client: MongoClient;
    private bucket: LogEntry[] = [];
    private readonly bucketSize: number;
    private readonly flushInterval: number;
    private readonly dbName: string;
    private readonly collectionName: string;

    private constructor(config: LoggerConfig) {
        this.bucketSize = config.bucketSize;
        this.flushInterval = config.flushInterval;
        this.dbName = config.dbName;
        this.collectionName = config.collectionName;

        if (!Logger.client) {
            Logger.client = new MongoClient(config.mongodbUri, {
                maxPoolSize: 1
            });
            Logger.client.connect()
                .then(() => {
                    console.log('Connected to MongoDB');
                })
                .catch((error) => {
                    console.error('Error connecting to MongoDB:', error);
                });
        }
        this.startFlushTimer();
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            const config = getConfig();
            Logger.instance = new Logger({
                mongodbUri: config.mongodbUri!,
                bucketSize: config.bucketSize,
                flushInterval: config.flushInterval,
                dbName: config.dbName,
                collectionName: config.collectionName,
            });
        }
        return Logger.instance;
    }

    public async log(
        application: string,
        timestamp: string,
        log: { level: LogLevel, file?: string },
        message?: string,
        additionalData: { [key: string]: any } = {}
    ) {
        const logEntry: LogEntry = {
            application,
            timestamp,
            message,
            log,
            ...additionalData
        };

        this.bucket.push(logEntry);
        if (this.bucket.length >= this.bucketSize) {
            await this.flush();
        }
    }

    private async flush() {
        if (this.bucket.length === 0) return;

        const logsToInsert = [...this.bucket];
        this.bucket = [];

        try {
            const db = Logger.client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            await collection.insertMany(logsToInsert);
        } catch (error) {
            console.error('Error inserting logs into MongoDB:', error);
        }
    }

    private startFlushTimer() {
        setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }
}

export { Logger, LogEntry };
