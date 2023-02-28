console.log('chapter script started');

// Start persistent connection to backend
const ev_url = new EventSource('http://localhost:3000/chapters')
var chapterBaseUrl = `http://localhost:3000/chapters/update`
var prevChapter = 0
var nextChapter = 1
var clientId = null
var chapterSelect = []

// Initialize webview on page open.
ev_url.onopen = (e) => {
    console.log('e ===>', e)
    document.getElementById('state').innerHTML = 'Connected'

    document.getElementById('prev').addEventListener('click', fetchPrev)
    document.getElementById('next').addEventListener('click', fetchNext)
}

// on stream message from backend.
ev_url.onmessage = (val) => {
    // Parse payload from backend.
    let payload = JSON.parse(val.data)

    // handle view update to index. Usually on opening page.
    if (payload.chaptersLength) {
      // add buttons for chapter indexs
      for (var indexChapter = 0; indexChapter < payload.chaptersLength; indexChapter++) {
        document.getElementById('index').innerHTML += `<button id="ch-${indexChapter}">${indexChapter}</button>`
      }

      // add button event listeners, hook to backend request with fetchChapter
      for (var indexChapter = 0; indexChapter < payload.chaptersLength; indexChapter++) {
        let button = document.getElementById(`ch-${indexChapter}`)
        button.addEventListener('click', fetchChapter)
        button.chapter=indexChapter
      }
    }

    // Insert text to the left collumn view (for raw text reference.)
    if (payload.left) {
      document.getElementById('left').innerHTML += `<p>${payload.left}</p>`
    }
    // Insert text to the right column view (for translated texts.)
    if (payload.right) {
      document.getElementById('right').innerHTML += `<p>${payload.right}</p>`
    }
    // Update server connection timer. Indicates that connection is still maintained.
    if (payload.timer) {
      document.getElementById('timer').innerHTML = `<p>${payload.timer}</p>`
    }

    // Sets session id for current page.
    if (payload.clientId) {
      clientId = payload.clientId
    }

    // Update curent page variables.
    if (payload.prev) {
      // document.getElementById('prev').href = payload.prev
      prevChapter = payload.prev
      console.log('prevChapter', prevChapter);
    }
    if (payload.next) {
      // document.getElementById('next').href = payload.next
      nextChapter = payload.next
      console.log('nextChapter', nextChapter);
    }
    if (payload.chapter) {
      document.getElementById('chapter').innerHTML = payload.chapter
    }

    // Clears both right and left column for resetting page.
    if (payload.emptyLeft) {
      document.getElementById('left').innerHTML = ``
    }
    if (payload.emptyRight) {
      document.getElementById('right').innerHTML = ``
    }
}

// Backend request for navigating chapters
async function fetchPrev(){
    const payload = {
      chapter: prevChapter,
      client_id: clientId,
    }
    const response = await fetch(chapterBaseUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return response.json()
}
async function fetchNext(){
    const payload = {
      chapter: nextChapter,
      client_id: clientId,
    }
    const response = await fetch(chapterBaseUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return response.json()
}
async function fetchChapter(event){
    const payload = {
      chapter: event.currentTarget.chapter,
      client_id: clientId,
    }
    console.log('fetching chapter',payload);
    const response = await fetch(chapterBaseUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return response.json()
}
