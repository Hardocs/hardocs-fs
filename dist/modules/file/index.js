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
const gray_matter_1 = __importDefault(require("gray-matter"));
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cwd_1 = __importDefault(require("../cwd"));
const folder_1 = __importDefault(require("../folder"));
const constants_1 = require("./../../utils/constants");
const showdown_1 = __importDefault(require("showdown"));
const jsdom_1 = __importDefault(require("jsdom"));
const image_1 = __importDefault(require("../image"));
const converter = new showdown_1.default.Converter();
const dom = new jsdom_1.default.JSDOM();
const openFile = ({ path: filePath, force = false, context }) => {
    try {
        if (!filePath) {
            filePath = cwd_1.default.get();
        }
        const readFile = fs_extra_1.default.readFileSync(filePath);
        const { data, content } = gray_matter_1.default(readFile);
        const parsedContent = image_1.default.handleImagePaths(content, context);
        const c = converter.makeHtml(parsedContent);
        return {
            title: data.title,
            description: data.description,
            content: c,
            fileName: getFileName({ path: filePath }),
            path: force ? filePath : `${cwd_1.default.get()}/${filePath}`
        };
    }
    catch (er) {
        throw new Error(er.message);
    }
};
const writeToFile = (input) => {
    const { path, title, description, content, fileName } = input;
    if (!input) {
        throw new Error('Input all fields');
    }
    const yml = `---
title: ${title}
description: ${description}
---
`;
    const mdContent = converter.makeMarkdown(content, dom.window.document);
    const markdown = `${yml}
${mdContent}
  `;
    fs_extra_1.default.writeFileSync(path + fileName, markdown, { encoding: 'utf8' });
    const result = {
        path,
        title,
        description,
        content,
        fileName
    };
    return result;
};
const allMarkdownFilesPath = (filePath) => {
    if (!filePath) {
        filePath = cwd_1.default.get();
    }
    const allMarkdowns = glob_1.default.sync(`${filePath}/**/*.*(md|mdx)`);
    return allMarkdowns;
};
const getEntryFilePath = ({ path: projectPath, context, force }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!folder_1.default.isHardocsProject({ path: projectPath, context })) {
        throw new Error('Not a valid hardocs project');
    }
    const docsDir = yield folder_1.default.getDocsFolder({
        path: projectPath,
        context,
        force
    });
    const entryFileName = (yield getHardocsJsonFile({ path: projectPath, context, force })).hardocsJson.entryFile;
    const entryFile = `${docsDir}/${entryFileName}`;
    return entryFile;
});
const getHardocsJsonFile = ({ path, context, force = false }) => __awaiter(void 0, void 0, void 0, function* () {
    let currentDir = cwd_1.default.get();
    if (force) {
        if (path) {
            currentDir = path;
        }
    }
    const hardocsDir = constants_1.getHardocsDir(currentDir);
    if (!folder_1.default.isHardocsProject({ path: currentDir, context }) || !hardocsDir) {
        throw new Error('Not a valid hardocs project');
    }
    const hardocsFile = yield fs_extra_1.default.readFile(`${hardocsDir}/hardocs.json`, {
        encoding: 'utf8'
    });
    const hardocsJson = yield JSON.parse(hardocsFile);
    return { hardocsJson, currentDir };
});
const createMarkdownTemplate = (entryPath, filename, path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fs_extra_1.default.readFile(entryPath, 'utf8');
        const newFile = yield fs_extra_1.default.writeFile(`${path}/${filename}`, data, {
            flag: 'w+'
        });
        return newFile;
    }
    catch (er) {
        throw new Error('there was a problem: ' + er);
    }
});
const openEntryFile = ({ path, context, force }) => __awaiter(void 0, void 0, void 0, function* () {
    const entryFilePath = yield getEntryFilePath({ path, context, force });
    const metadata = openFile({ path: entryFilePath, force: false, context });
    return metadata;
});
const extractAllFileData = ({ path, context }) => __awaiter(void 0, void 0, void 0, function* () {
    const allMarkdownFilesPathPath = allMarkdownFilesPath(path);
    try {
        return allMarkdownFilesPathPath.map((f) => {
            const d = openFile({ path: f, force: false, context });
            const data = Object.assign({}, d);
            return data;
        });
    }
    catch (er) {
        throw new Error('Error occurred :(');
    }
});
const getFileName = ({ path }) => {
    const fullPath = path.split(/\//gis);
    const lastIndex = fullPath[fullPath.length - 1];
    return lastIndex.toString().includes(`.md`) && lastIndex;
};
const exists = (path) => {
    return fs_extra_1.default.existsSync(path);
};
const deleteFile = ({ filePath }) => {
    if (folder_1.default.isDirectory({ path: filePath })) {
        throw new Error('File path must point to a valid file and not a directory');
    }
    if (!exists(filePath)) {
        throw new Error('File does not exist');
    }
    fs_extra_1.default.stat(filePath, (err, stat) => {
        if (err) {
            console.log(err);
        }
        if (stat.isDirectory()) {
            console.log(`${filePath} is a Directory`);
            return false;
        }
        fs_extra_1.default.unlink(filePath, (err) => {
            if (err) {
                throw new Error(err.message);
            }
            console.log(`${filePath} deleted successfully`);
            return true;
        });
        return true;
    });
    return true;
};
exports.default = {
    openFile,
    allMarkdownFilesPath,
    getEntryFilePath,
    getHardocsJsonFile,
    createMarkdownTemplate,
    openEntryFile,
    extractAllFileData,
    getFileName,
    writeToFile,
    delete: deleteFile,
    exists
};
//# sourceMappingURL=index.js.map