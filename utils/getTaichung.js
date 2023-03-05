const http = require('http')
const https = require('https')


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

module.exports = getTaichung