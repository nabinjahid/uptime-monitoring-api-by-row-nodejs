const http = require("http")

const {handleReqRes} = require("./helpers/handleReqRes")

const app ={}

app.config = {
    port : 8000
}

// create server
app.createServer = () =>{
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, ()=>{
        console.log(`server is listening to port ${app.config.port}`);
        
    })
}

app.handleReqRes = handleReqRes

// start server 
app.createServer()