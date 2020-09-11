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
exports.resolver = void 0;
const _1 = __importDefault(require("."));
const folder_1 = __importDefault(require("../folder"));
exports.resolver = {
    Mutation: {
        createProject: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () { return yield _1.default.create({ context, input }); }),
        createProjectFromExisting: (_, { input }, context) => __awaiter(void 0, void 0, void 0, function* () { return yield _1.default.createFromExisting({ context, input }); }),
        openProject: (_root, { path }, context) => {
            if (!path) {
                throw new Error('Path must not be empty');
            }
            return _1.default.open({ path, context });
        }
    },
    Query: {
        isHardocsProject: (_root, { path }, context) => __awaiter(void 0, void 0, void 0, function* () { return folder_1.default.isHardocsProject({ path, context }); })
    }
};
//# sourceMappingURL=resolvers.js.map