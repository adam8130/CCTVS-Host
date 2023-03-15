const fs = require('fs')


function cityRouter (requestURL, res) {

    const cityName = requestURL.searchParams.get('cityName')
    const yilanData = JSON.parse(fs.readFileSync('./db/yilanDB.json'))
    const citiesData = JSON.parse(fs.readFileSync('./db/citiesDB.json'))    

    const result = citiesData.CCTVs.filter((item) => item.city === cityName)

    res.writeHead(200, {
        'access-control-allow-origin': '*',
        'content-type': 'application/json'
    })

    if (cityName === 'YilanCounty') {
        res.end(JSON.stringify([ ...yilanData.CCTVs, ...result ]))
        
    }    
    else {
        res.end(JSON.stringify(result))
    }
    
}

module.exports = cityRouter