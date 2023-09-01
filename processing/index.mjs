import fs from 'fs';

const apiToken = ''

const availableCities = [
  { name: '台北', city: 'Taipei' },
  { name: '新北', city: 'NewTaipei' },
  { name: '基隆', city: 'Keelung' },
  { name: '桃園', city: 'Taoyuan' },
  { name: '苗栗', city: 'MiaoliCounty' },
  { name: '竹北', city: 'HsinchuCounty' },
  { name: '新竹', city: 'Hsinchu' },
  { name: '台中', city: 'Taichung' },
  { name: '南投', city: 'NantouCounty' },
  { name: '彰化', city: 'ChanghuaCounty' },
  { name: '雲林', city: 'YunlinCounty' },
  { name: '嘉義', city: 'Chiayi' },
  { name: '宜蘭', city: 'YilanCounty' },
  { name: '花蓮', city: 'HualienCounty' },
  { name: '台南', city: 'Tainan' },
  { name: '高雄', city: 'Kaohsiung' },
  { name: '台東', city: 'TaitungCounty' },
  { name: '屏東', city: 'PingtungCounty' },
]


// Get CCTV data from https://tdx.transportdata.tw/
for (let i = 0; i < availableCities.length; i++) {
  const response = await fetch(
    `https://tdx.transportdata.tw/api/basic/v2/Road/Traffic/CCTV/City/${availableCities[i].city}?%24top=1000&%24format=JSON`, {
      headers: { "authorization": `Bearer ${apiToken}` }
    }
  )
  const data = await response.json()
  fs.writeFileSync(`./database/${availableCities[i].city}.json`, JSON.stringify(data, null, 2))
}



// Combine 2 sources of data
const citiesData = JSON.parse(fs.readFileSync('./db/citiesDB.json'))


citiesData.CCTVs.forEach(item => {
  const city = item.City.trim()
  const cityData = JSON.parse(fs.readFileSync(`./database2/${city}.json`))
  cityData.CCTVs.push(item)
  fs.writeFileSync(`./database2/${city}.json`, JSON.stringify(cityData, null, 2))
})