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
async function renderPDF(stud) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const content = await compile('index', {
            name: "Abhilash",
            addr1: "At:Ambalikemane,Po:Targod",
            addr2: "Karnataka",
            addr3: "India",
            website: "wwww.hegdeabhilash19.com",
            email: "hegdeabhilash19@gmail",
            social: "abhi16180/",
            profile: "dafasdaslkdajsdklajlkajsddlasj dlaskjflkasflasjflkasjflajflasjflkaskjlwjerljasdlj dksladjaslkk dlsajd lksajdflkskaj",
            skills: [
                { skill: "C++" },
                { skill: "Dart" },
                { skill: "Js" },
                { skill: "C" },
            ],
            education_list1: [
                { edu_detail: "PUC" },
                { edu_detail: "MYSORE COLLEGE" },
                { edu_detail: "2020-12-10" },
            ],
            education_list2: [
                { edu_detail: "PUC" },
                { edu_detail: "MYSORE COLLEGE" },
                { edu_detail: "2020-12-10" },
            ],
            work_list1: [
                { work_detail: "JS dev" },
                { work_detail: "Golden Company" },
                { work_detail: "2020-12-10" },
            ],
            work_list2: [
                { work_detail: "Flutter dev" },
                { work_detail: "Another good company" },
                { work_detail: "2020-12-10" },
            ],
        });
        await page.addStyleTag({ path: './dist/output.css' })
        await page.setContent(content);
        await page.emulateMediaType('screen')
        await page.pdf({
            path: 'temp.pdf',
            // format: 'A4',
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