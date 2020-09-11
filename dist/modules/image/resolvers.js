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
exports.resolver = {
    Query: {
        getImages: (_root, { path }) => _1.default.getImages(path),
        getImagesInHardocsProject: (_root, { path }, context) => __awaiter(void 0, void 0, void 0, function* () { return _1.default.getImagesInHardocsProject({ path, context }); })
    }
};
//# sourceMappingURL=resolvers.js.map