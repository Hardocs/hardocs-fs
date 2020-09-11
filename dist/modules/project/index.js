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
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const cwd_1 = __importDefault(require("../cwd"));
const folder_1 = __importDefault(require("../folder"));
const constants_1 = require("./../../utils/constants");
const file_1 = __importDefault(require("../file"));
const templateDir = path.join(__dirname, '../../../template/template');
const markdownFile = path.join(__dirname, '../../../template/docsTemplate/index.md');
const docsTemplateDir = path.join(__dirname, '../../../template/docsTemplate');
const openProject = ({ path: fullPath, context, force = false }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullPath) {
        fullPath = cwd_1.default.get();
    }
    cwd_1.default.set(fullPath);
    const hardocsJson = yield file_1.default.getHardocsJsonFile({
        path: fullPath,
        context,
        force
    });
    const docsDir = hardocsJson.hardocsJson.docsDir;
    if (!docsDir || docsDir.trim() === '') {
        ('No documentations provided');
        return;
    }
    const entryFilePath = `${docsDir}/${hardocsJson.hardocsJson.entryFile}`;
    const allFileData = yield file_1.default.extractAllFileData({ path: docsDir, context });
    const entry = yield file_1.default.openEntryFile({
        path: entryFilePath,
        context
    });
    const allDocsData = allFileData
        .map((f) => {
        if (f.fileName === file_1.default.getFileName({ path: entryFilePath })) {
            f.content = entry.content;
        }
        return f;
    })
        .sort((a) => (a.fileName === entry.fileName ? -1 : 1));
    const response = Object.assign(Object.assign({}, hardocsJson.hardocsJson), { path: fullPath, allDocsData });
    return response;
});
const create = ({ input, context }) => __awaiter(void 0, void 0, void 0, function* () {
    if (input) {
        const projectPath = input.path || cwd_1.default.get();
        const dest = path.join(projectPath, input.name);
        yield cwd_1.default.set(dest);
        if (!folder_1.default.isDirectory({ path: dest })) {
            try {
                yield fs.mkdir(dest);
                yield cwd_1.default.set(dest);
            }
            catch (er) {
                throw new Error(er.message);
            }
        }
        try {
            const result = Object.assign(Object.assign({ id: Math.round(Math.abs(Math.random() * new Date().getTime())) }, input), { updatedAt: new Date().toISOString() });
            const hardocsDir = constants_1.getHardocsDir(dest);
            yield fs.ensureDir(hardocsDir);
            const hardocsJson = `${hardocsDir}/hardocs.json`;
            const docsDir = `${dest}/${result.docsDir}`;
            if (folder_1.default.isDirectory({ path: templateDir })) {
                yield fs.copy(templateDir, dest);
                yield fs.copy(docsTemplateDir, docsDir);
                yield fs.ensureDir(docsDir);
                yield file_1.default.createMarkdownTemplate(markdownFile, result.entryFile, docsDir);
            }
            const stream = fs.createWriteStream(hardocsJson, {
                encoding: 'utf8',
                flags: 'w+'
            });
            stream.write(JSON.stringify(result, null, 2), (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
            const response = openProject({ context, path: cwd_1.default.get() });
            return response;
        }
        catch (er) {
            throw new Error(er);
        }
    }
    return false;
});
const createFromExisting = ({ input, context }) => __awaiter(void 0, void 0, void 0, function* () {
    if (input) {
        const projectPath = input.path || cwd_1.default.get();
        const dest = projectPath;
        if (!folder_1.default.isDirectory({ path: dest })) {
            throw new Error(`${dest} is Not a valid path`);
        }
        yield cwd_1.default.set(dest);
        try {
            const result = Object.assign(Object.assign({ id: Math.round(Math.abs(Math.random() * new Date().getTime())) }, input), { updatedAt: new Date().toISOString() });
            const hardocsDir = constants_1.getHardocsDir(dest);
            yield fs.ensureDir(hardocsDir);
            const hardocsJson = `${hardocsDir}/hardocs.json`;
            const docsDir = `${dest}/${result.docsDir}`;
            if (folder_1.default.isDirectory({ path: templateDir })) {
                yield fs.ensureDir(docsDir);
                yield file_1.default.createMarkdownTemplate(markdownFile, result.entryFile, docsDir);
            }
            const stream = fs.createWriteStream(hardocsJson, {
                encoding: 'utf8',
                flags: 'w+'
            });
            stream.write(JSON.stringify(result, null, 2), (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
            const response = openProject({ context, path: dest });
            return response;
        }
        catch (er) {
            throw new Error(er);
        }
    }
    return false;
});
exports.default = {
    create,
    open: openProject,
    createFromExisting
};
//# sourceMappingURL=index.js.map