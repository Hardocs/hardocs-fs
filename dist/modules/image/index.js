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
const cwd_1 = __importDefault(require("../cwd"));
const file_1 = __importDefault(require("../file"));
const mime_types_1 = __importDefault(require("mime-types"));
const glob_1 = __importDefault(require("glob"));
const handleImagePaths = (markdown, context) => {
    const regex = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/gi;
    const regex2 = /(?<alt>!\[[^\]]*\])\((?<filename>.*?)\)/i;
    const startsWith = (str, val) => {
        if (str[0] === val || str.charAt(0) === val)
            return true;
        return false;
    };
    const result = markdown.replace(regex, (v) => {
        const imgObject = v.match(regex2);
        let newUrl = '';
        const host = context.url;
        if (!imgObject ||
            !imgObject.groups ||
            imgObject.length < 1 ||
            typeof imgObject === 'undefined') {
            return v;
        }
        if (imgObject.groups.filename.startsWith(`http://`) ||
            imgObject.groups.filename.startsWith(`www.`) ||
            imgObject.groups.filename.startsWith(`https://`)) {
            newUrl = imgObject.groups.filename;
        }
        else {
            if (startsWith(imgObject.groups.filename, '/')) {
                newUrl = [host, ...imgObject.groups.filename].join('');
            }
            else {
                newUrl = [`${host}/`, ...imgObject.groups.filename].join('');
            }
        }
        const alt = imgObject.groups.alt;
        return `${alt}(${newUrl})`;
    });
    return result;
};
const getImages = (path) => {
    if (path) {
        cwd_1.default.set(path);
    }
    path || (path = cwd_1.default.get());
    const allFiles = glob_1.default.sync(`${path}/**/*`);
    const images = allFiles
        .filter((file) => {
        if (!path)
            return;
        const f = mime_types_1.default.lookup(file).toString().startsWith('image');
        return f;
    })
        .map((file) => {
        if (!path)
            return file;
        return file.split(path)[1];
    });
    return images;
};
const getImagesInHardocsProject = ({ path, context }) => __awaiter(void 0, void 0, void 0, function* () {
    cwd_1.default.set(path);
    const hardocsJson = yield file_1.default.getHardocsJsonFile({ path, context });
    if (hardocsJson) {
        const assetsDir = hardocsJson.hardocsJson.assets;
        if (assetsDir) {
            return getImages(`${path}/${assetsDir}`);
        }
        else {
            return getImages(path);
        }
    }
    else {
        throw new Error(`${path} is Not a valid hardocs project`);
    }
});
exports.default = { getImages, handleImagePaths, getImagesInHardocsProject };
//# sourceMappingURL=index.js.map