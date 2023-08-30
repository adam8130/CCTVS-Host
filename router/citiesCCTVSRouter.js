const fs = require('fs')


function citiesCCTVSRouter(requestURL, res) {

  const cityName = requestURL.searchParams.get('cityName')
  const CCTVSData = JSON.parse(fs.readFileSync(`./database/${cityName}.json`))

  res.writeHead(200, {
    'access-control-allow-origin': '*',
    'content-type': 'application/json'
  })

  res.end(JSON.stringify(CCTVSData))
}

module.exports = citiesCCTVSRouter