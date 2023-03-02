const http = require('http')
const url = require('url')
const routerApi = require('./routerApi')
const routerCity = require('./routerCity')


const server = http.createServer((req, res) => {
    const requestUrl = url.parse(req.url, true)


    if (requestUrl.pathname.split('/')[1] == 'city') {
        routerCity(requestUrl, res)
    }

    else {
        routerApi(requestUrl, res)
    }
})


server.listen(5000)