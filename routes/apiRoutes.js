var express = require("express"),
    router = express.Router();

var url = require('url');
var fs = require('fs');
var http = require('http');
var phantom = require('phantom');

router.post("/printPdf", function(req, res) {
    console.log("Going to print pdf");

    var pdfData = req.body.message;
    console.log(pdfData);
    var htmlStrings = [];
    var htmlstring = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Print tab</title>
            <style>
            </style>
        </head>
        <body>`+ pdfData +`</body>
        </html>`;

    htmlStrings.push(encodeURIComponent(htmlstring));

    for (var i=0; i<htmlStrings.length; i++)
        htmlStrings[i] = decodeURIComponent(htmlStrings[i]);

    var printCount = 0;
    var errors = '';

    var dir = 'printjobs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    var jobCount = 0;
    convertPDF(jobCount);

    function convertPDF(jobCount) {
        var uuid = "Folder1";
        console.log("Printing job: " + uuid);
        var htmlFile = dir + '/printslip_'+ uuid +'.html';
        var pdfFile = dir + '/printslip_'+ uuid +'.pdf';

        // Write htmlString to an HTML file
        fs.writeFile(htmlFile, htmlStrings[jobCount], function(err) {
        if(err) return console.log("Unable to write file: " + err);
        });

        // Use Phantom to convert HTML to PDF
        var _ph, _page, _outObj;
        phantom.create().then(ph => {
        _ph = ph;
        return _ph.createPage();
        }).then(page => {
        _page = page;
        return _page.open(htmlFile);
        }).then(status => {
        return _page.property('content')
        }).then(content => {
        // _page.paperSize = { width: pageWidth, height: pageHeight, margin: '0' };
        // _page.property('viewportSize', { width: pageWidth, height: pageHeight });
        _page.property('paperSize', { width: 595, height: 842 });
        _page.render(pdfFile).then();    //creates 'pdf'

        _page.close();
        _ph.exit();

        }).catch(e => console.log(e));

    }

    res.end(JSON.stringify({name: "Printed PDF"}));
});

module.exports = router;