import 'dotenv/config'
import linebot from 'linebot'
import frontEnd from './commands/frontEnd.js'
import be from './commands/be.js'
import anime from './commands/anime.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

// https://crontab.guru/once-a-day
scheduleJob('0 0 * * *', () => {
  usdtwd.update()
})
usdtwd.update()

const bot = linebot({
  channelId: process.env.CHANNL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', event => {
  if (process.env.DEBUG === 'true') {
    console.log(event)
  }
  if (event.message.type === 'text') {
    if (event.message.text === '前端') {
      frontEnd(event)
    } else if (event.message.text === '後端') {
      be(event)
    } else if (event.message.text.startsWith('動畫')) {
      // 動畫14882
      anime(event)
    } else if (event.message.text === '匯率') {
      console.log(usdtwd.exrate)
      event.reply(usdtwd.exrate.toString())
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
