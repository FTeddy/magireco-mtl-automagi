function splitSourceToChapters(text) {
  console.log('splitting...');
  let lines = text.split(/\r\n|\r|\n|\n\r/)
  let chapters = []
  let _temp_chapter = []

  for (var line of lines) {
    if (line !== '') {
      // _temp_chapter = _temp_chapter + line + '\r\n'
      _temp_chapter.push(line)
    } else {
      if (_temp_chapter.length !== 0) {
        chapters.push(_temp_chapter)
      }
      _temp_chapter = []
    }
  }

  if (_temp_chapter.length !== 0) {
    chapters.push(_temp_chapter)
    _temp_chapter = []
  }

  return chapters
}

module.exports = splitSourceToChapters;
