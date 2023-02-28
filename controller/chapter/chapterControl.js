let deepl = require('./deepl_tl.js')
let splitSourceToChapters = require('../parser/splitChapter.js')
// Temporary container for express Response object by client id
let session = {}

class ChapterControl {
  constructor(sourcefile) {
    this.chapters = splitSourceToChapters(sourcefile)
    console.log('chapters length: ', this.chapters.length);
  }

  // Initialize page, and set client id for connecting to webview
  async initialize(req, res, next) {
    try {
      // console.log(this);
      // let chapters = this.chapters
      res.writeHead(200, {
        'Content-type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })

      let client_id = +new Date()
      session[client_id] = { res }

      let chapter = parseInt(req.query.chapter ?? 0)
      let raw_chapter = ''
      let tl_chapter = ''

      let buttonPayload = {
        clientId: client_id,
        chaptersLength: this.chapters.length,
        prev: (chapter <= 0) ? chapter : chapter - 1,
        next: chapter + 1,
      }
      res.write(`data: ${JSON.stringify(buttonPayload)} \n\n`)

      req.on('close', (e)=>{
        console.log('connection closed');
      })

      // set timer count to indicate how long the connection lasts to webview
      let itr = 0
      setInterval(() => {
        let payload = {
          timer: itr,
        }
        res.write(`data: ${JSON.stringify(payload)} \n\n`)
        itr += 1
      }, 1000)
    } catch (e) {
      console.log(e);
    }
  }

  // Update webview with new chapter, and translate text.
  async update(req, res, next) {
    try {
      // let chapters = this.chapters
      let chapter = parseInt(req.body.chapter ?? 0)
      let client_id = req.body.client_id

      if (session[client_id]) {
        let response = session[client_id].res

        let raw_chapter = ''
        let tl_chapter = ''

        let buttonPayload = {
          emptyLeft: true,
          emptyRight: true,
          prev: (chapter <= 0) ? chapter : chapter - 1,
          next: chapter + 1,
          chapter: `Current Chapter: ${chapter}`,
        }
        response.write(`data: ${JSON.stringify(buttonPayload)} \n\n`)

        // Translate text row by row and stream response to webview.
        for (var row of this.chapters[chapter]) {
          row = deepl.replaceName(row)
          let tl_row = await deepl.translate(row)
          tl_chapter = tl_row + '\r\n'
          raw_chapter = row + '\r\n'

          let textPayload = {
            left:raw_chapter,
            right:tl_chapter,
          }
          response.write(`data: ${JSON.stringify(textPayload)} \n\n`)
        }
      }
      res.status(200).json({
        message: 'Success'
      })
    } catch (e) {
      console.log(e);
    }
  }


}


module.exports = ChapterControl;
