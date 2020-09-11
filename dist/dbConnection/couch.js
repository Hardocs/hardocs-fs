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
const nano_1 = __importDefault(require("nano"));
exports.default = (() => __awaiter(void 0, void 0, void 0, function* () {
    const dbName = 'hello';
    const nano = nano_1.default(process.env.DB_HOST_AUTH);
    const dbList = yield nano.db.list();
    try {
        if (!dbList.includes(dbName)) {
            yield nano.db.create(dbName);
            const db = nano.use(dbName);
            console.log('database created successfully');
            return db;
        }
        else {
            const db = nano.use(dbName);
            console.log('connected to database successfully');
            return db;
        }
    }
    catch (err) {
        throw new Error(err);
    }
}))();
//# sourceMappingURL=couch.js.map