import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowller'

interface Production {
    title: string;
    url: string;
}

interface ProdectionResult {
    time: number,
    data: Production[]
}

interface Content {
    [propName: number]: Production[];
}

export default class Analyze implements Analyzer {
    private static instance: Analyze;

    static getInstance() {
        if (!Analyze.instance) {
            Analyze.instance = new Analyze();
        }
        return Analyze.instance;
    }

    private getIndexInfo(html: string) {
        const $ = cheerio.load(html);
        const item = $('.listgame');
        const productionInfo: Production[] = [];
        item.map((index, element) => {
            const title = $(element).find('.gamename').text();
            const url = $(element).find('.cover').prop('href');
            productionInfo.push({
                title,
                url
            })
        })
        const result = {
            time: (new Date()).getTime(),
            data: productionInfo
        };
        return result;
    }

    private generateJsonContent(prodectionResult: ProdectionResult, filePath: string) {
        let fileContent: Content = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[prodectionResult.time] = prodectionResult.data;
        return fileContent;
    }

    public analyze(html: string, filePath: string) {
        const result = this.getIndexInfo(html);
        const content = this.generateJsonContent(result, filePath);
        return JSON.stringify(content);
    }

    private constructor() { }
}