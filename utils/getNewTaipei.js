const https = require('https')


const getSourceURL = (queryDeviceURL, res) => (
  new Promise((resolve, reject) => {
    const request = https.get(queryDeviceURL, (response) => {
      let data = ''
      response.on('data', (chunk) => data += chunk)
      response.on('err', (err) => reject(err))
      response.on('end', () => {
        const responseData = JSON.parse(data)
        if (responseData.data?.url) {
          resolve(responseData.data.url.replace('/flv', ''))
        }
        else {
          res.end(null)
          reject(new Error('url not found'))
        }
      })
    })
    request.on('err', (err) => {
      console.log(err)
      request.end()
    })
  })
)

const getSourceVideo = (sourceURL, res) => {
  const request = https.get(sourceURL, (response) => {
    console.log('proxy response', response.headers['content-type'])
    res.writeHead(200, {
      'access-control-allow-origin': '*',
      'content-type': response.headers['content-type']
    })
    response.pipe(res)
  })
  request.on('err', (err) => {
    console.log(err)
    res.end()
  })
  return request
}


async function getNewTaipei (targetURL, res) {
  let proxyRequest = null
  const cctvDevice = targetURL.split('/').pop()
  const queryDeviceURL = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryCCTVURL/' + cctvDevice
  try {
    const sourceURL = await getSourceURL(queryDeviceURL, res)
    proxyRequest = getSourceVideo(sourceURL, res)
  } catch (err) {
    console.log(err)
  }
  return proxyRequest
}

// const convertVideo = (sourceURL, res) => {
//   const ffmpeg = spawn('ffmpeg', [
//     '-i', 'pipe:0', 
//     '-c:v', 'copy',
//     '-c:a', 'copy',
//     '-f', 'mp4',
//     'pipe:1' 
//   ])

//   https.get(sourceURL, (response) => {
//     res.writeHead(200, {
//       'access-control-allow-origin': '*',
//       'Content-Type': 'video/mp4',
//       'Connection': 'keep-alive'
//     })
//     response.on('error', (err) => {
//       console.log(err)
//       ffmpeg.kill('SIGINT');
//     });
//     response.pipe(ffmpeg.stdin).pipe(ffmpeg.stdout).pipe(res)
//   })
// }


module.exports = getNewTaipei