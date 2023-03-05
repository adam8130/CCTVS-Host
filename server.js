const http = require('http')
const https = require('https')
const url = require('url')
const routerApi = require('./router/routerApi')
const routerCity = require('./router/routerCity')


const server = http.createServer((req, res) => {
    const requestURL = new URL(req.url, 'https://adalia.pp.ua')

    if (requestURL.pathname == '/cities') {
        routerCity(requestURL, res)
    }
    else if (requestURL.pathname == '/api') {
        routerApi(requestURL, res)
    }
    else {
        res.end()
    }
})


server.listen(5000)