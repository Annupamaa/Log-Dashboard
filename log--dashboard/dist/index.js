"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/logs', logRoutes_1.default);
const PORT = process.env.PORT || 3070;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
