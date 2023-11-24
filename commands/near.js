import axios from 'axios'
import nearTemplate from '../templates/near.js'
import { distance } from '../utils/distance.js'

export default async (event) => {
  try {
    const { data } = await axios.get('https://cloud.culture.tw/frontsite/opendata/emapOpenDataJsonAction.do?method=exportEmapJsonNearBy&lat=25.051345&lon=121.549569&range=10')

    const replies = data
      .map(value => {
        // .map 解析資料
        value.distance = distance(event.message.latitude, event.message.longitude, value.latitude, value.longitude, 'K')
        // event.message 當前位置資料 ， 存在 distance 中
        return value
      }).filter(value => {
        return value.distance <= 3
        // 過濾距離小於等於3的數據
      }).sort((a, b) => {
        // 對數據按照距離進行排序，a 小於 b，這導致 a 在排序後的結果中排在 b 之前。
        return a.distance - b.distance
      }).slice(0, 5).map(value => {
        // 最多五筆資料
        const template = nearTemplate()
        template.hero.url = value.representImage?.replace('http://', 'https://') || 'https://github.com/wdaweb.png'
        template.body.contents[0].text = value.name
        template.body.contents[0].text = value.name
        return template
      })

    const result = await event.reply(replies.length === 0
      ? '附近找不到餒'
      : {
        type: 'flex',
        altText: '查詢結果',
        contents: {
          type: 'carousel',
          contents: replies
        }
      })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
