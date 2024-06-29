"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const middleware_1 = require("aws-serverless-express/middleware");
const aws_serverless_express_1 = require("aws-serverless-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./modules/sls/app.module");
const binaryMimeTypes = [];
let cachedServer;
async function bootstrapServer() {
    if (!cachedServer) {
        const expressApp = express_1.default();
        const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.use(middleware_1.eventContext());
        await nestApp.init();
        cachedServer = aws_serverless_express_1.createServer(expressApp, undefined, binaryMimeTypes);
    }
    return cachedServer;
}
exports.handler = async (event, context) => {
    cachedServer = await bootstrapServer();
    return aws_serverless_express_1.proxy(cachedServer, event, context, 'PROMISE').promise;
};
//# sourceMappingURL=serverless.js.map