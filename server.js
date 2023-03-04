const http = require('http')
const url = require('url')
const routerApi = require('./routerApi')
const routerCity = require('./routerCity')


const server = http.createServer((req, res) => {
    const requestURL = new URL(req.url, 'https://adalia.pp.ua')
    console.log(requestURL)

    if (requestURL.pathname == '/cities') {
        routerCity(requestURL, res)
    }

    else {
        routerApi(requestURL, res)
    }
})


server.listen(5000)