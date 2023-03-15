const getNewTaipei = require('../utils/getNewTaipei')
const getTaichung = require('../utils/getTaichung')
const proxyRequest = require('../utils/proxyRequest')



function apiRouter (requestURL, res) {

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
        case 'YilanCounty' :
            getYilanCounty(requestURL, res)
            return            
        default:
            proxyRequest(requestURL, cityName, targetURL, res)
            return
    }
}

module.exports = apiRouter