var express = require('express');
var router = express.Router();


const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const path = require('path');

const defaultOptions = {
    timeout: 1500, //ms

    // possible values, those are case sensitive: [A4, A3, Legal, Letter, Tabloid]
    // https://github.com/electron/electron/blob/v0.35.2/docs/api/web-contents.md#webcontentsprinttopdfoptions-callback
    pageSize: 'A3',
    marginsType: 0,

    /**
     * Electron uses `landscape: false` option for orientation but we use a string value because it's more intuitive
     *
     * Available values for "orientation": 'portrait' or 'landscape'. Those values are case insensitive
     */
    landscape: false,

    outputFolder: "./public",
    outputFileName: randomString(5) + '.pdf',

    // this SHOULD BE WITHOUT 'file://' prefix otherwise cannot find the file
    inputDataFile: path.join('.', 'inputDataFile.js'),
    inputEncoding: 'utf8',
    headers: {}
};

const targetUrl = "http://localhost:8080";
const options = defaultOptions;

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

router.get('/', function(req, res, next) {
  nightmare
      .goto(targetUrl, options.headers)
      .wait(options.timeout)
      .pdf(path.join(options.outputFolder, "ccd.pdf"), {
          pageSize: options.pageSize,
          marginsType: options.marginsType,
          printBackground: true,
          printSelectionOnly: false,
          landscape: options.landscape
      })
      //.end()
      .then(function () {
          console.log(options.outputFileName, 'pdf generation successful')
          res.render('index', { pdfUrl: options.outputFileName });
      })
      .catch(function (error) {
          console.error(options.outputFileName, 'failed:', error);
      });
});

module.exports = router;
