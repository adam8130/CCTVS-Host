const http = require('http')
const https = require('https')


const getTaichung = (targetURL, res) => {
    
    const srcReg = /<img.*?src="(.*?)"/g
    const protocol = targetURL.split('://')[0] === 'http' ? http : https

    const request = protocol.get(targetURL, (response) => {
        let data = ''
        response.on('data', (chunk) => {
            data += chunk
        })
        response.on('end', () => {
            const sourceURL = srcReg.exec(data)[1].replace('amp;', '')
            const protocol = sourceURL.split('://')[0] === 'http' ? http : https
            console.log(sourceURL)
            protocol.get(sourceURL, (response2) => {
                if (response2.statusCode === 200) {
                    console.log(response2.headers['content-type'])
                    res.writeHead(200, {
                        'access-control-allow-origin': '*',
                        'content-type': response2.headers['content-type']
                    })
                    response2.pipe(res)
                }
                else {
                    res.end()
                }
            })
        })
    })
    request.on('err', (err) => {
        console.log(err)
        res.end()
    })
}

module.exports = getTaichung