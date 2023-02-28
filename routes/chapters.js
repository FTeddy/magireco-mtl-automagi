require('dotenv').config()
var express = require('express');
var router = express.Router();

const fs = require('fs')
const path = require('path')
const ChapterControl = require('../controller/chapter/chapterControl.js')

const sourcefile = fs.readFileSync(path.join(__dirname, `../src/${process.env.SRC_FILE}`), {encoding: 'UTF8'})

const chapter = new ChapterControl(sourcefile)

router.get('/', chapter.initialize.bind(chapter));

router.post('/update', chapter.update.bind(chapter));

module.exports = router;
