const getNewTaipei = require('../utils/getNewTaipei')
const getTaichung = require('../utils/getTaichung')
const proxyRequest = require('../utils/proxyRequest')



function apiRouter(requestURL, connections, clientIP, res) {
  let proxyConnection = null;
  const cityName = requestURL.searchParams.get('cityName')
  const targetURL = requestURL.searchParams.get('url')

  if (connections.has(clientIP)) {
    connections.get(clientIP).destroy();
  }
  
  connections.set(clientIP, res);
  console.log('connections', connections.size);

  if (connections.size > 5) {
    const [clientIP, res] = connections.entries().next().value;
    res.destroy();
    connections.delete(clientIP);
  }

  res.on('close', () => {
    console.log('client closed connection');
    proxyConnection && proxyConnection.destroy();
  })

  switch (cityName) {
    case 'NewTaipei':
      getNewTaipei(targetURL, res).then(connection => proxyConnection = connection)
      return
    case 'Taichung':
      getTaichung(targetURL, res)
      return
    default:
      proxyConnection = proxyRequest(requestURL, cityName, targetURL, res)
      return
  }
}

module.exports = apiRouter