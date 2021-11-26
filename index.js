const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');
const URL = 'https://www.kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do';
const START = +process.argv[2];
const END = +process.argv[3];

async function main() {
    let words = [],
        promises = [];

    for (let i = START; i <= END; i++) {
        promises.push(getPage(words, i));
    }

    Promise
        .all(promises)
        .then(() => {
            console.log('파싱 완료');
            fs.writeFileSync('result.txt', words.join('\r\n'));
        });
}

async function getPage(words, page) {
    let { body } = await got.post(URL, {
        form: { curPage: page },
        retry: { limit: 10, methods: ['POST'] },
        hooks: {
            beforeRetry: [
                (error, retryCount) => {
                    console.log(`${page}페이지 파싱 실패 ${retryCount}번째 재시도`);
                }
            ]
        }
    });
    let $ = cheerio.load(body);

    $('tbody tr td:first-child').each((i, el) => words.push($(el).text().trim()));
    console.log(`누적: ${words.length}`);
}

main();