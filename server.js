const http = require('http')
const https = require('https')
const fs = require('fs')
const apiRouter = require('./router/apiRouter')
const citiesCCTVSRouter = require('./router/citiesCCTVSRouter')

const connections = new Map()

const server = http.createServer((req, res) => {
  const requestURL = new URL(req.url, 'https://adalia.pp.ua')
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log('clientIP', clientIP)

  if (requestURL.pathname === '/cities') {
    citiesCCTVSRouter(requestURL, res)
  }
  else if (requestURL.pathname === '/api') {
    apiRouter(requestURL, connections, clientIP, res)
  }
  else if (requestURL.pathname === '/close') {
    console.log('close')
    connections.has(clientIP) && connections.get(clientIP).destroy()
    connections.delete(clientIP)
    res.writeHead(200, { 'access-control-allow-origin': '*' })
    res.end(null)
  }
  else {
    res.end()
  }
})

server.listen(5000)