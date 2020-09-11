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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const from_schema_1 = require("@gql2ts/from-schema");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const generateSchema_1 = __importDefault(require("../utils/generateSchema"));
const options = {
    ignoredTypes: ['BadGraphType']
};
const typescriptTypes = from_schema_1.generateNamespace('HDS', generateSchema_1.default(), options);
try {
    fs.writeFileSync(path.join(__dirname, '../typings/schema.d.ts'), typescriptTypes);
}
catch (err) {
    console.log(err);
    process.exit(1);
}
//# sourceMappingURL=createTypes.js.map