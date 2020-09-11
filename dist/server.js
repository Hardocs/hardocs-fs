"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.server = void 0;
require('dotenv').config();
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const mime_types_1 = __importDefault(require("mime-types"));
const redis_1 = __importDefault(require("./redis"));
const generateSchema_1 = __importDefault(require("./utils/generateSchema"));
const cwd_1 = __importDefault(require("./modules/cwd"));
const constants_1 = require("./utils/constants");
const RedisStore = express_rate_limit_1.default({
    store: new rate_limit_redis_1.default({
        client: redis_1.default
    }),
    windowMs: 15 * 60 * 100,
    max: 100,
    message: 'Too many accounts created from this IP, please try again after an hour'
});
exports.server = () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = generateSchema_1.default();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({
            redis: redis_1.default,
            req,
            res,
            url: req.protocol + '://' + req.get('host')
        }),
        introspection: true
    });
    const app = express_1.default();
    const corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200
    };
    server.applyMiddleware({ app, cors: corsOptions });
    app.use(RedisStore);
    app.use('/images', express_1.default.static('images'));
    app.use(express_1.default.static(cwd_1.default.get()));
    app.get('*', (req, res) => {
        const file = path.join(cwd_1.default.get(), req.path.replace(/\/$/, '/index.html'));
        if (file.indexOf(cwd_1.default.get() + path.sep) !== 0) {
            return res.status(403).end('Forbidden');
        }
        const type = mime_types_1.default.types[path.extname(file).slice(1)] || 'text/plain';
        const s = fs.createReadStream(file);
        s.on('open', () => {
            res.set('Content-Type', type);
            s.pipe(res);
        });
        s.on('error', () => {
            res.set('Content-Type', 'text/plain');
            res.status(404).end('Not Found');
        });
    });
    const port = process.env.PORT || 4001;
    return app.listen({
        port
    }, () => console.log(`server is running on http://localhost:${port}${server.graphqlPath}`));
});
if (constants_1.__PROD__) {
    console.log = () => { };
}
//# sourceMappingURL=server.js.map