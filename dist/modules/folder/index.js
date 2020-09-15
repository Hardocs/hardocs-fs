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
const winattr = __importStar(require("winattr"));
const cwd_1 = __importDefault(require("../cwd"));
const constants_1 = require("./../../utils/constants");
const file_1 = __importDefault(require("../file"));
const isPlatformWindows = process.platform.indexOf('win') === 0 || process.platform.includes('win');
const hiddenPrefix = '.';
const isDirectory = ({ path: file }) => {
    file = file.replace(/\\/g, path.sep);
    try {
        return fs.existsSync(file) && fs.statSync(file).isDirectory();
    }
    catch (err) {
        console.log(err.message);
    }
    return false;
};
const generateFolder = ({ path: file }) => {
    return {
        name: path.basename(file),
        path: file
    };
};
const getCurrent = () => {
    const baseDir = cwd_1.default.get();
    return generateFolder({ path: baseDir });
};
const open = ({ path: file }) => __awaiter(void 0, void 0, void 0, function* () {
    yield cwd_1.default.set(file);
    return generateFolder({ path: cwd_1.default.get() });
});
const openParent = ({ path: file }) => {
    const newPath = path.dirname(file);
    cwd_1.default.set(newPath);
    return generateFolder({ path: cwd_1.default.get() });
};
const createFolder = ({ path: name }) => {
    if (isDirectory({ path: name })) {
        console.log(`Folder already exist.`);
        return false;
    }
    const folder = path.join(cwd_1.default.get(), name);
    fs.ensureDirSync(folder);
    return generateFolder({ path: folder });
};
const list = ({ path: base }) => __awaiter(void 0, void 0, void 0, function* () {
    let dir = base;
    if (isPlatformWindows) {
        if (base.match(/^([A-Z]{1}:)$/)) {
            dir = path.join(base, '\\');
        }
    }
    const files = fs.readdirSync(dir, 'utf8');
    return files
        .map((file) => {
        const folderPath = path.join(base, file);
        return {
            path: folderPath,
            name: file,
            hidden: isHidden({ path: folderPath })
        };
    })
        .filter((file) => isDirectory({ path: file.path }));
});
const isHidden = ({ path: file }) => {
    try {
        const prefixed = path.basename(file).charAt(0) === hiddenPrefix;
        const result = {
            unix: prefixed,
            windows: false
        };
        if (isPlatformWindows) {
            const windowsFile = file.replace(/\\/g, '\\\\');
            result.windows = winattr.getSync(windowsFile).hidden;
        }
        return ((!isPlatformWindows && result.unix) ||
            (isPlatformWindows && result.windows));
    }
    catch (er) {
        if (process.env.HARDOCS_DEV_MODE) {
            console.log('File: ' + file);
            return console.log(er);
        }
    }
};
const readPackage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { path: file = '', force = false } = options;
    if (!force) {
    }
    const hardocsDir = constants_1.getHardocsDir(file);
    const hardocsPkg = path.join(hardocsDir, 'hardocs.json');
    if (isDirectory({ path: hardocsDir })) {
        if (fs.existsSync(hardocsPkg)) {
            const pkg = fs.readJsonSync(hardocsPkg);
            return pkg;
        }
        else {
            console.log('Not a hardocs directory');
            return false;
        }
    }
});
const isHardocsProject = ({ path, context }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pkg = yield readPackage({ path, context });
        return !!pkg;
    }
    catch (er) {
        if (process.env.HARDOCS_DEV_MODE) {
            console.log(`${er} This is not a HARDOCS projects`);
        }
        return false;
    }
});
const getDocsFolder = ({ path, context, force }) => __awaiter(void 0, void 0, void 0, function* () {
    let fromBaseDir = cwd_1.default.get();
    if (force) {
        if (path) {
            fromBaseDir = path;
        }
    }
    if (!isHardocsProject({ path: fromBaseDir, context })) {
        throw new Error('Not a hardocs project');
    }
    const hardocsJson = (yield file_1.default.getHardocsJsonFile({ path: fromBaseDir, context, force })).hardocsJson;
    const { docsDir } = hardocsJson;
    return `${fromBaseDir}/${docsDir}`;
});
const deleteFolder = ({ path }) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.remove(path);
    return true;
});
exports.default = {
    isDirectory,
    generateFolder,
    getCurrent,
    open,
    openParent,
    createFolder,
    list,
    isHidden,
    getDocsFolder,
    readPackage,
    isHardocsProject,
    deleteFolder
};
//# sourceMappingURL=index.js.map