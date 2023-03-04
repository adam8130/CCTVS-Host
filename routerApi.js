const http = require('http')
const https = require('https')


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
            'content-type': response.headers['content-type']
        })
        response.on('data', (chunk) => {
            res.write(chunk)
        })
        response.on('error', (err) => {
            console.log(err)
        })
    })
    request.on('error', (err) => {
        console.log(err)
        request.end()
    })
}

const getNewTaipei = (targetURL, res) => {

    const cctvDevice = targetURL.split('/').pop()
    const queryDevice = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryCCTVURL/' + cctvDevice
    
    const request = https.get(queryDevice, (response) => {
        let data = ''
        response.on('data', (chunk) => {
            data += chunk
        })
        response.on('end', () => {
            const jsonData = JSON.parse(data)
            if (jsonData.data?.url) {
                console.log(jsonData.status)
                const url = jsonData.data.url

                https.get(url, (response) => {
                    console.log(response.headers['content-type'])
                    res.writeHead(200, {
                        'access-control-allow-origin': '*',
                        'content-type': response.headers['content-type']
                    })
                    response.on('data', (chunk) => {
                        res.write(chunk)
                    })
                })
            } else { res.end() }
        })
    })
    request.on('err', (err) => {
        console.log(err)
        res.end()
    })
}


const getTaichung = (targetURL, res) => {
    
    const srcReg = /<img.*?src="(.*?)"/g
    const protocol = targetURL.split('://')[0] === 'http' ? http : https

    const request = protocol.get(targetURL, (response) => {
        let data = ''    
        console.log(response.headers['content-type'])
        res.writeHead(200, {
            'access-control-allow-origin': '*',
            'content-type': response.headers['content-type']
        })
        response.on('data', (chunk) => {
            data += chunk
        })
        response.on('end', () => {
            const src = srcReg.exec(data)[1]
            res.end(src.replace('amp;', ''))
        })
    })
    request.on('err', (err) => {
        console.log(err)
        res.end()
    })
}

module.exports = routerApi