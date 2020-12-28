"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var Analyze = /** @class */ (function () {
    function Analyze() {
    }
    Analyze.getInstance = function () {
        if (!Analyze.instance) {
            Analyze.instance = new Analyze();
        }
        return Analyze.instance;
    };
    Analyze.prototype.getIndexInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var item = $('.listgame');
        var productionInfo = [];
        item.map(function (index, element) {
            var title = $(element).find('.gamename').text();
            var url = $(element).find('.cover').prop('href');
            productionInfo.push({
                title: title,
                url: url
            });
        });
        var result = {
            time: (new Date()).getTime(),
            data: productionInfo
        };
        return result;
    };
    Analyze.prototype.generateJsonContent = function (prodectionResult, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[prodectionResult.time] = prodectionResult.data;
        return fileContent;
    };
    Analyze.prototype.analyze = function (html, filePath) {
        var result = this.getIndexInfo(html);
        var content = this.generateJsonContent(result, filePath);
        return JSON.stringify(content);
    };
    return Analyze;
}());
exports.default = Analyze;
