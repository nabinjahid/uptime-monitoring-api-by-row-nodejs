const {StringDecoder} = require('string_decoder')
const url = require('url')
const routes = require('../routes')
const {notFoundHandler} = require("../handlers/routeHandler/notFoundHandler")


const hanlder = {}

hanlder.handleReqRes = (req, res) =>{
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase()
  const queryStringObject = parsedUrl.query
  const headersObject = req.headers

  const reqProperties = {
    parsedUrl, path, trimedPath, method, queryStringObject, headersObject
  }

  const decoder = new StringDecoder("utf-8")
  let realData = "";


  const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler;
  

  req.on("data", (buffer)=>{
    realData += decoder.write(buffer)
  })
  req.on('end', ()=>{
    realData += decoder.end()
    reqProperties.body = realData
    
    chosenHandler(reqProperties, (statusCode, payload)=>{
    statusCode = typeof statusCode === 'number' ? statusCode : 500;
    payload = typeof payload === 'object' ? payload : {}

    const payloadString = JSON.stringify(payload)

    // final response
    res.writeHead(statusCode)
    res.end(payloadString)
  })
  })

  
}

module.exports = hanlder