const handler = {}

handler.sampleHandler = (reqProperties, callback)=>{
    console.log(reqProperties);

    callback(200, {
        message: "This message is from sample route"
    })
    
}

module.exports = handler;