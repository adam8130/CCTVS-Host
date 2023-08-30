const http = require('http')
const https = require('https')


const proxyRequest = (requestURL, cityName, targetURL, res) => {

  const edgeCase1 = ['Keelung', 'Taoyuan']
  const edgeCase2 = ['ChanghuaCounty', 'Chiayi']
  const protocol = targetURL.split('://')[0] === 'http' ? http : https

  if (edgeCase1.includes(cityName)) {
    targetURL = targetURL + '/'
  }
  if (edgeCase2.includes(cityName)) {
    targetURL = requestURL.href.split('url=')[1]
    console.log(targetURL)
  }

  const request = protocol.get(targetURL, (response) => {
    console.log(response.headers['content-type'])
    res.writeHead(200, {
      'access-control-allow-origin': '*',
      'content-type': response.headers['content-type'],
    })
    response.on('error', (err) => {
      console.log(err)
    })
    response.pipe(res)
  })
  request.on('error', (err) => {
    console.log(err)
    request.end()
  })
}

module.exports = proxyRequest