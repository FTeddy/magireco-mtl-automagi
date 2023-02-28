var express = require('express');
var router = express.Router();

// App start page.
router.get('/', function(req, res, next) {
  let chapter = parseInt(req.query.chapter ?? 0)
  let prevChapter = (chapter <= 0) ? chapter : chapter-1
  res.render('chapter', {
    title: 'Magireco',
    chapter: `Current Chapter: ${chapter}`,
  });
});

module.exports = router;
