// dependencies
const crypto = require("crypto")
const environments = require("./environments")

// moduel scafolding
const utilities = {}

// hash string
utilities.hash = (str)=>{
    if(typeof str === 'string' && str.length >0){
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash
    }  
    return false
}

// parse Json string to object 
utilities.parseJson = (jsonString)=>{
    let output = {}
    try {
        output = JSON.parse(jsonString)
        return output               
    } catch (error) {   
            output = {}
    }
    return output
}



module.exports = utilities