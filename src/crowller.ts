import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import Analyze from './analyze';

export interface Analyzer {
    analyze: (html: string, filPath: string) => string;
}

class Crowller {
    private filePath = path.resolve(__dirname, '../data/production.json');
    private async getRawHtml() {
        const result = await superagent.get(url);
        return result.text;
    }
    private async initSpiderProcess() {
        const html = await this.getRawHtml();
        const fileContent = this.analyzer.analyze(html, this.filePath)
        this.writeFile(fileContent)
    }

    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content);
    }

    constructor(private url: string, private analyzer: Analyzer) {
        this.initSpiderProcess();
    }
    
}

const url = 'http://www.66rpg.com';

const analyzer = Analyze.getInstance();
const crowller = new Crowller(url, analyzer);
