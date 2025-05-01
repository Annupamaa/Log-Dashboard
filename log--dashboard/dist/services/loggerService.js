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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMessage = void 0;
const logger_1 = require("../utils/logger");
const DatabaseType_1 = require("../enums/DatabaseType");
const Config_1 = require("../Config/Config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = (0, Config_1.getConfig)();
if (config.databaseType === DatabaseType_1.DatabaseType.MONGODB && !config.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}
const logger = config.databaseType === DatabaseType_1.DatabaseType.MONGODB ? logger_1.Logger.getInstance(config.mongodbUri) : undefined;
const logMessage = (application, timestamp, message, log, additionalData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (config.databaseType === DatabaseType_1.DatabaseType.MONGODB) {
            if (logger) {
                yield logger.log(application, timestamp, log, message, additionalData);
            }
            else {
                throw new Error('Logger instance is not initialized');
            }
        }
    }
    catch (error) {
        console.error('Error logging message:', error);
        throw new Error('Error logging message');
    }
});
exports.logMessage = logMessage;
