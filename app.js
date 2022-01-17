const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const cors = require('cors');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
require('dotenv').config()
const { moveMessagePortToContext } = require('worker_threads');
app.use(cors());

const PORT = process.env.PORT || 3000;

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

// hbs.registerHelper('dateformat',function(value,format){
//     return moveMessagePortToContext({value}.format(format));
// })
async function renderPDF(stud) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const content = await compile('index', { name: stud });
        await page.addStyleTag({ path: './dist/output.css' })
        await page.setContent(content);
        await page.emulateMediaType('screen')
        await page.pdf({
            path: 'temp.pdf',
            format: 'A4',
            printBackground: true
        });


        await browser.close();

    }
    catch (e) {
        console.log(e);
    }
};
app.get('/', async (req, res) => {
    await renderPDF(req.query.name);
    // const data = await fs.readFile('./temp.pdf');
    // res.send(data);
    var file = fs.createReadStream('./temp.pdf');
    var stat = fs.statSync('./temp.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.query.name}'s resume.pdf`);
    file.pipe(res);

})


app.listen(PORT, () => {

    console.log(`Listening at port ${PORT}`);

})