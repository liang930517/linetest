require('dotenv').config()
const rp = require('request-promise')
const linebot = require('linebot')
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已開啟')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    rp('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
      .then(htmlString => {
        let json = JSON.parse(htmlString)
        json = json.filter(j => {
          if (j.name === usermsg) return true
          else return false
        })
        if (json.length > 0) event.reply(json[0].intro)
        else event.reply('沒有資料')
      })
      .catch(() => {
        event.reply('發生錯誤')
      })
  }
})
