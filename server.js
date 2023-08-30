const http = require('http')
const https = require('https')
const fs = require('fs')
const apiRouter = require('./router/apiRouter')
const citiesCCTVSRouter = require('./router/citiesCCTVSRouter')

const connections = new Set()

const server = http.createServer((req, res) => {

    const requestURL = new URL(req.url, 'https://adalia.pp.ua')

    if (requestURL.pathname == '/cities') {
        citiesCCTVSRouter(requestURL, res)
    }
    else if (requestURL.pathname == '/api') {
        apiRouter(requestURL, res)
    }
    else if (requestURL.pathname === '/close') {
        console.log('close')
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