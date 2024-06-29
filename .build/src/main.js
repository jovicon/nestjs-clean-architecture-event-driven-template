"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_serverless_express_1 = require("aws-serverless-express");
const middleware_1 = require("aws-serverless-express/middleware");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/sls/app.module");
const binaryMimeTypes = [];
let cachedServer;
process.on('unhandledRejection', (reason) => {
    console.error(reason);
});
process.on('uncaughtException', (reason) => {
    console.error(reason);
});
async function bootstrapServer() {
    if (!cachedServer) {
        try {
            console.log('Bootstrapping server');
            const expressApp = require('express')();
            const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, expressApp);
            nestApp.use(middleware_1.eventContext());
            await nestApp.init();
            cachedServer = aws_serverless_express_1.createServer(expressApp, undefined, binaryMimeTypes);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    return Promise.resolve(cachedServer);
}
exports.handler = async (event, context) => {
    cachedServer = await bootstrapServer();
    return aws_serverless_express_1.proxy(cachedServer, event, context, 'PROMISE').promise;
};
//# sourceMappingURL=main.js.map