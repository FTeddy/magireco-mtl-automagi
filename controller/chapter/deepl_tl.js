const clipboard = require('clipboardy')

/**
* Copy lines of texts, wait for Deepl in chrome page finishes translating,
* and retrieve results from clipboard. Will retry once if copying/retrieving fails.
*/
async function translate(text) {
  return new Promise(async function(resolve,reject) {
    try {
      clipboard.writeSync(text)
      await wait(5000)
      let results = clipboard.readSync()
      if (results === text) {
        await wait(2000)
        results = clipboard.readSync()
      }
      resolve(results)
    } catch (e) {
      // console.log(e);
      await wait(2000)
      try {
        clipboard.writeSync(text)
        await wait(5000)
        let results = clipboard.readSync()
        resolve(results)
      } catch (e2) {
        // console.log(e);
        throw e2
      }
    }
  })
}

/**
* Temporary database for default replacement to help translating
* difficult names and phrases.
*/
function replaceName(text) {
  const names = [
    {jp:'、', en:','},
    {jp:'・', en:' '},
    {jp:'＜', en:''},
    {jp:'＞', en:''},
    {jp:'｜',en:''},
    {jp:'水樹 塁', en:'Mizuki Rui'},
    {jp:'遊狩 ミユリ', en:'Yukari Miyuri'},
    {jp:'ミユリ', en:'Miyuri'},
    {jp:'神楽 燦', en:'Kagura San'},
    {jp:'燦', en:'San'},
    {jp:'藍家 ひめな', en:'Aika Himena'},
    {jp:'ひめな', en:'Himena'},
    {jp:'栗栖 アレクサンドラ', en:'Kurusu Alexandra'},
    {jp:'アレクサンドラ', en:'Alexandra'},
    {jp:'安積 はぐむ', en:'Azumi Hagumu'},
    {jp:'はぐむ', en:'Hagumu'},
    {jp:'宮尾 時雨', en:'Miyabi Shigure'},
    {jp:'時雨', en:'Shigure'},
    {jp:'ラビ', en:'Rabi'},
    {jp:'十七夜', en:'Kanagi'},
    {jp:'美国 織莉子', en:'Oriko'},
    {jp:'月出里', en:'Sudachi'}
  ]
  let inProg = text
  for (var name of names) {
    inProg = inProg.replace(name.jp, name.en)
  }
  return inProg
}


async function wait(ms){
  return new Promise((res,rej) => {
    setTimeout(res, ms)
  })
}

module.exports = {
  translate,
  replaceName,
};
