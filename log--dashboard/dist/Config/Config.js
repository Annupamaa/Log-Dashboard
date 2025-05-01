"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const DatabaseType_1 = require("../enums/DatabaseType");
dotenv_1.default.config();
const getConfig = () => {
    const databaseType = parseInt(process.env.DATABASE_TYPE, 10);
    if (databaseType !== DatabaseType_1.DatabaseType.MONGODB) {
        throw new Error('Invalid DATABASE_TYPE');
    }
    const mongodbUri = process.env.MONGODB_URI;
    if (databaseType === DatabaseType_1.DatabaseType.MONGODB && !mongodbUri) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    const dbName = process.env.DB_NAME;
    const collectionName = process.env.COLLECTION_NAME;
    if (!dbName || !collectionName) {
        throw new Error('DB_NAME and COLLECTION_NAME must be defined in the environment variables');
    }
    const bucketSize = parseInt(process.env.BUCKET_SIZE, 10);
    const flushInterval = parseInt(process.env.FLUSH_INTERVAL, 10);
    if (isNaN(bucketSize) || isNaN(flushInterval)) {
        throw new Error('BUCKET_SIZE and FLUSH_INTERVAL must be valid numbers');
    }
    return {
        databaseType,
        mongodbUri,
        dbName,
        collectionName,
        bucketSize,
        flushInterval,
    };
};
exports.getConfig = getConfig;
