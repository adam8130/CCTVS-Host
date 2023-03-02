const fs = require('fs')


function routerCity (requestUrl, res) {
    // const readStream = fs.createReadStream('./db.json', (err) => console.log(err))
    const data = JSON.parse(fs.readFileSync('./db.json'))

    res.writeHead(200, {
        'access-control-allow-origin': '*',
        'content-type': 'application/json'
    })
    res.end(JSON.stringify(data))
    // rs.pipe(res)
}

module.exports = routerCity