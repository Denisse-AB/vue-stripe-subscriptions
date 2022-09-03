"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/webhook') {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use((0, cors_1.default)());
// redirect to route folder
const stripe = require('./routes/stripe');
app.use('/stripe', stripe);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
