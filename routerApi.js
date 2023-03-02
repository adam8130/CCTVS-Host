const http = require('http')
const https = require('https')


function routerApi (url, res) {

    const cityName = url.query.cityName
    let targetUrl = url.search.substring(url.search.indexOf('&url=')).replace('&url=', '')
    console.log(targetUrl)
    
    switch (cityName) {
        case 'NewTaipei' :
            getNewTaipei(targetUrl, res)
            return
        case 'Taichung' :
            getTaichung(targetUrl, res)
            return
        default:
            proxyRequest(cityName, targetUrl, res)
            return
    }

}

const proxyRequest = (cityName, targetUrl, res) => {

    const edgeCase = ['Keelung', 'Taoyuan']
    targetUrl = edgeCase.includes(cityName)? targetUrl + '/' : targetUrl
    protocol = targetUrl.split('://')[0] === 'http' ? http : https
    
    const request = protocol.get(targetUrl, (response) => {
        console.log(response.headers['content-type'])
        res.writeHead(200, {
            'access-control-allow-origin': '*',
            'content-type': response.headers['content-type']
        })
        response.on('data', (chunk) => {
            res.write(chunk)
        })
        response.on('error', (err) => {
            console.log(err)
        })
    })

    request.on('timeout', () => {
        console.log('abort')
        request.abort()
    })
    request.on('error', (err) => {
        console.log(err)
        request.end()
    })
}

const getNewTaipei = (targetUrl, res) => {

    const device = targetUrl.split('/').pop()
    const queryDevice = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryCCTVURL/' + device
    
    https.get(queryDevice, (response) => {
        let data = ''
        response.on('data', (chunk) => {
            data += chunk
        })

        response.on('end', () => {
            const jsonData = JSON.parse(data)
            if (jsonData.data?.url) {
                console.log(jsonData.status)
                const url = jsonData.data.url
    
                https.get(url, (response) => {
                    console.log(response.headers['content-type'])
                    res.writeHead(200, {
                        'access-control-allow-origin': '*',
                        'content-type': response.headers['content-type']
                    })
                    response.on('data', (chunk) => {
                        res.write(chunk)
                    })
                })
            } else {
                res.end()
            }

        })
    })

}

const getNewTaipei2 = async (targetUrl, res) => {

    try {
      const device = targetUrl.split('/').pop();
      const queryDevice = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryCCTVURL/' + device;
  
      const response1 = await new Promise((resolve, reject) => {
        https.get(queryDevice, (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(new Error(`statusCode=${response.statusCode}`));
          }
          const data = [];
          response.on('data', (chunk) => data.push(chunk));
          response.on('end', () => resolve(Buffer.concat(data)));
        });
      });
  
      const jsonData = JSON.parse(response1.toString());
      const url = jsonData.data.url;
  
      const response2 = await new Promise((resolve, reject) => {
        https.get(url, (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(new Error(`statusCode=${response.statusCode}`));
          }
          const headers = {
            'access-control-allow-origin': '*',
            'content-type': response.headers['content-type']
          };
          res.writeHead(200, headers);
          response.on('data', (chunk) => res.write(chunk));
          response.on('end', () => resolve());
        });
      });
  
      res.end();
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end();
    }
  };

const getTaichung = (targetUrl, res) => {
    console.log(targetUrl)
    data = ''
    const srcReg = /<img.*?src="(.*?)"/g
    protocol = targetUrl.split('://')[0] === 'http' ? http : https

    protocol.get(targetUrl, (response) => {
        
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
}

module.exports = routerApi