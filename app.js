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
    const filePath = path.join(process.cwd(), 'views', `${templateName}.html`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

// hbs.registerHelper('dateformat',function(value,format){
//     return moveMessagePortToContext({value}.format(format));
// })
async function renderPDF() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('index', {});
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
    // await renderPDF();
    // const data = await fs.readFile('./temp.pdf');
    // res.send(data);
    res.send('working');
})


app.listen(PORT, () => {

    console.log(`Listening at port ${PORT}`);

})