const https = require('https')


const getYilanCounty = (requestURL, res) => {

    const did = requestURL.searchParams.get('did')
    const options = {
        host: 'ilcpb.ivs.hinet.net',
        path: `/public/ajaxGetStream?did=${did}&page=ilcpb`,
        port: 443,
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
    }
    https.get(options, (response) => {
        console.log(response.headers['content-type'])
        response.on('data', (chunk) => {
            const responseData = JSON.parse(chunk)
            if (responseData.data[0].camurl) {
                const targetURL = responseData.data[0].camurl
                res.writeHeader(200, {
                    'access-control-allow-origin': '*',
                })
                res.end(targetURL)
            }  
        })
    })
}

module.exports = getYilanCounty