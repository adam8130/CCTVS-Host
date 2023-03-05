const http = require('http')
const https = require('https')
const getNewTaipei = require('../utils/getNewTaipei')
const getTaichung = require('../utils/getTaichung')


function routerApi (requestURL, res) {

    const cityName = requestURL.searchParams.get('cityName')
    const targetURL = requestURL.searchParams.get('url')
    console.log(targetURL)

    switch (cityName) {
        case 'NewTaipei' :
            getNewTaipei(targetURL, res)
            return
        case 'Taichung' :
            getTaichung(targetURL, res)
            return
        default:
            proxyRequest(requestURL, cityName, targetURL, res)
            return
    }
}

const proxyRequest = (requestURL, cityName, targetURL, res) => {

    const edgeCase1 = ['Keelung', 'Taoyuan']
    const edgeCase2 = ['ChanghuaCounty', 'Chiayi']
    const protocol = targetURL.split('://')[0] === 'http' ? http : https
    
    if (edgeCase1.includes(cityName)) {
        targetURL =  targetURL + '/'
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
        response.pipe(res)
        response.on('error', (err) => {
            console.log(err)
        })
    })
    request.on('error', (err) => {
        console.log(err)
        request.end()
    })
}


module.exports = routerApi