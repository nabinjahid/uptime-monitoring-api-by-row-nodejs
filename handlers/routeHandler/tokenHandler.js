/*
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author:  Jahidul Islma
 * Date: 09/09/2025
 *
 */

// dependencies
const data = require("../../lib/data");
const { hash, createRandomStr } = require("../../helpers/utilities");

// module scafolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.includes(requestProperties.method)) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

// create token
handler._token.post = (req, callback) => {
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone.trim()
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;

  if (phone && password) {
    // check the user if valid
    data.read("users", phone, (err1, userData) => {
      if (!err1 && userData) {
        // check the password if valid
        const hasedPassword = hash(password);
        if (hasedPassword === userData.password) {
          // create the token info
          const tokenId = createRandomStr(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const token = {
            tokenId,
            expires,
            phone,
          };

          // store the token to the db
          data.create("tokens", tokenId, token, (err2) => {
            if (!err2) {
              callback(200, token);
            } else {
              callback(500, {
                error: "Could not create the token",
              });
            }
          });
        } else {
          callback(400, {
            error: "Password did not match",
          });
        }
      } else {
        callback(404, {
          error: "User not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Missing required fields (phone or password)",
    });
  }
};
// get the token
handler._token.get = (req, callback) => {
  const tokenId =
    typeof req.queryStringObject.tokenId === "string" &&
    req.queryStringObject.tokenId.trim().length === 20
      ? req.queryStringObject.tokenId
      : false;

  if (tokenId) {
    // check the token if valid
    data.read("tokens", tokenId, (err, tokenData) => {
      if ((!err, tokenData)) {
        callback(200, tokenData);
      } else {
        callback(404, {
          error: "could not open file",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};
// update token
handler._token.put = (req, callback) => {
  const tokenId =
    typeof req.body.tokenId === "string" &&
    req.body.tokenId.trim().length === 20
      ? req.body.tokenId
      : false;
  const extend =
    typeof req.body.extend === "boolean" && req.body.extend === true
      ? req.body.extend
      : false;

  if (tokenId && extend) {
    data.read("tokens", tokenId, (err1, tokenData) => {
      if (!err1 && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;
          //  store the updated tokne info
          data.update("tokens", tokenId, tokenData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "Token updated succesfully",
              });
            } else {
              callback(500, {
                error: "Token updated faied",
              });
            }
          });
        } else {
          callback(403, {
            error: "Your token is expired",
          });
        }
      } else {
        callback(404, {
          error: "Token data was not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problme in your request",
    });
  }
};
// delete token
handler._token.delete = (req, callback) => {
  const tokenId =
    typeof req.queryStringObject.tokenId === "string" &&
    req.queryStringObject.tokenId.trim().length === 20
      ? req.queryStringObject.tokenId.trim()
      : false;


    if (tokenId) {
      data.read('tokens', tokenId, (err1, tokenData)=>{
        if (!err1 && tokenData) {
          data.delete("tokens", tokenId, (err2)=>{
            if (!err2) {
                callback(200, {
                  message: 'Token deleted succesfully'
                })
            }else{
              callback(500, {
                error : "Could not delete token"
              })
            }
          })
        }else{
          callback(404, {
            error : "Token was not found"
          })
        }
      })
    } else{
      callback(400, {
        error: 'There was a problme in your request'
      })
    } 
};


// verify token
handler._token.verifyToken = (tokenId, phone, callback)=>{
  data.read('tokens', tokenId, (err, tokenData)=>{
    if (!err && tokenData) {
      // check the phone if matched and expires is valid
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true)
      }else{
        callback(false)
      }
    }else{
      callback(false)
    }
  })
}

module.exports = handler;
