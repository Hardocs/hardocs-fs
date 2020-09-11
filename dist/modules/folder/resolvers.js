"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const _1 = __importDefault(require("."));
const cwd_1 = __importDefault(require("../cwd"));
exports.resolver = {
    Query: {
        folderExists: (_root, { path }) => _1.default.isDirectory({ path }),
        folderCurrent: () => _1.default.getCurrent()
    },
    Mutation: {
        folderOpen: (_root, { path }) => _1.default.open({ path }),
        folderOpenParent: () => _1.default.openParent({ path: cwd_1.default.get() }),
        folderCreate: (_root, { name: path }) => _1.default.createFolder({ path })
    },
    Folder: {
        children: (folder) => _1.default.list({ path: folder.path })
    }
};
//# sourceMappingURL=resolvers.js.map