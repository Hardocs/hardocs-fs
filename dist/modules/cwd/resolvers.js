"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const _1 = __importDefault(require("."));
exports.resolver = {
    Query: {
        cwd: () => _1.default.get()
    }
};
//# sourceMappingURL=resolvers.js.map