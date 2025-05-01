"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const mongodb_1 = require("mongodb");
const Config_1 = require("../Config/Config");
const config = (0, Config_1.getConfig)();
class Logger {
    constructor(mongoUri, bucketSize, flushInterval) {
        this.bucket = [];
        this.dbName = 'logsData';
        this.collectionName = 'logs';
        this.bucketSize = bucketSize;
        this.flushInterval = flushInterval;
        if (!Logger.client) {
            Logger.client = new mongodb_1.MongoClient(mongoUri, {
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
    static getInstance(mongoUri) {
        if (!Logger.instance) {
            Logger.instance = new Logger(mongoUri, config.bucketSize, config.flushInterval);
        }
        return Logger.instance;
    }
    log(application_1, timestamp_1, log_1, message_1) {
        return __awaiter(this, arguments, void 0, function* (application, timestamp, log, message, additionalData = {}) {
            const logEntry = Object.assign({ application,
                timestamp,
                message,
                log }, additionalData);
            this.bucket.push(logEntry);
            if (this.bucket.length >= this.bucketSize) {
                yield this.flush();
            }
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bucket.length === 0)
                return;
            const logsToInsert = [...this.bucket];
            this.bucket = [];
            try {
                const db = Logger.client.db(this.dbName);
                const collection = db.collection(this.collectionName);
                yield collection.insertMany(logsToInsert);
            }
            catch (error) {
                console.error('Error inserting logs into MongoDB:', error);
            }
        });
    }
    startFlushTimer() {
        setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }
}
exports.Logger = Logger;
