const fs = require('fs')


function routerCity (requestURL, res) {
    
    const data = JSON.parse(fs.readFileSync('./db.json'))
    res.writeHead(200, {
        'access-control-allow-origin': '*',
        'content-type': 'application/json'
    })
    res.end(JSON.stringify(data))

}

module.exports = routerCity