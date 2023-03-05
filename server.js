const http = require('http')
const https = require('https')
const fs = require('fs')
const routerApi = require('./router/routerApi')
const routerCity = require('./router/routerCity')

const connections = new Set()

const server = http.createServer((req, res) => {

    const requestURL = new URL(req.url, 'https://adalia.pp.ua')

    if (requestURL.pathname == '/cities') {
        routerCity(requestURL, res)
    }
    else if (requestURL.pathname == '/api') {
        routerApi(requestURL, res)
    }
    else if (requestURL.pathname === '/close') {
        res.writeHead(200, {
            'access-control-allow-origin': '*',
        })
        res.end(null)
        connections.forEach((connect) => {
            connect.destroy()
        })
    }
    else {
        res.end()
    }
})


server.listen(5000)

server.on('connection', (connect) => {
    connections.add(connect)
    console.log('connection: ', connections.size)
    connect.on('close', () => {
        connections.delete(connect)
    })
})