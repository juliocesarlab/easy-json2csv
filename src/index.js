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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CSV = void 0;
var fs_1 = require("fs");
var CSV = /** @class */ (function () {
    function CSV(columnDelimiter, lineBreak, encoding) {
        if (columnDelimiter === void 0) { columnDelimiter = ";"; }
        if (lineBreak === void 0) { lineBreak = "\n"; }
        if (encoding === void 0) { encoding = "latin1"; }
        this.lineBreak = lineBreak;
        this.columnDelimiter = columnDelimiter;
        this.value = "";
        this.encoding = encoding;
        this.body = [];
        this.header = [];
    }
    CSV.prototype.setEncoding = function (encoding) {
        if (!encoding)
            throw new Error("You must provide a encoding when calling this method");
        this.encoding = encoding;
        return this;
    };
    CSV.prototype.setHeader = function (header) {
        if (!header)
            throw new Error("You must provide a header object first");
        this.header = header;
        this.value = this.header
            .map(function (c) { return c.columnName; })
            .join(this.columnDelimiter)
            .concat(this.lineBreak);
        return this;
    };
    CSV.prototype.setBody = function (body) {
        var _this = this;
        if (!this.header)
            throw new Error("You must set a header before calling this method");
        body.forEach(function (line) {
            var _a;
            for (var i = 0; i < _this.header.length; i++) {
                var columnValue = line[(_a = _this.header[i]) === null || _a === void 0 ? void 0 : _a.refersTo];
                if (!columnValue) {
                    _this.value += "  ".concat(_this.columnDelimiter);
                    continue;
                }
                _this.value += "".concat(_this.normalizeColumnValue(columnValue), " ").concat(_this.columnDelimiter);
            }
            _this.value += _this.lineBreak;
        });
        return this;
    };
    CSV.prototype.normalizeColumnValue = function (columnValue) {
        return columnValue
            .toString()
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/(",")/g, " ")
            .replace(/(".")/g, "");
    };
    CSV.prototype.write = function (folderPath, fileName) {
        if (folderPath === void 0) { folderPath = "./"; }
        if (fileName === void 0) { fileName = "file.csv"; }
        return __awaiter(this, void 0, void 0, function () {
            var folderExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.promises
                            .opendir(folderPath)
                            .then(function () { return true; })["catch"](function () { return false; })];
                    case 1:
                        folderExists = _a.sent();
                        if (!!folderExists) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs_1.promises.mkdir(folderPath, { recursive: true })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, fs_1.promises.writeFile("".concat(folderPath).concat(fileName), this.value, this.encoding)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return CSV;
}());
exports.CSV = CSV;
