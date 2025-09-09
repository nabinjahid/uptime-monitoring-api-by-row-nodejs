// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");

// module scafolding
const handler = {};

handler.userHandler = (reqProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler._users[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};
// get request
handler._users.post = (req, callback) => {
  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 1
      ? req.body.firstName
      : false;
  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 1
      ? req.body.lastName
      : false;
  const phone =
    typeof req.body.phone === "string" && /^\d{11}$/.test(req.body.phone.trim())
      ? req.body.phone.trim()
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;
  const tosAgreement =
    typeof req.body.tosAgreement === "boolean" && req.body.tosAgreement
      ? req.body.tosAgreement
      : false;

  if (firstName && lastName && phone && tosAgreement && password) {
    // make sure file doesn't already exist
    data.read("users", phone, (err1) => {
      if (err1) {
        const usersInfo = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        // store the data to the db
        data.create("users", phone, usersInfo, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created successfully!",
            });
          } else {
            callback(500, {
              error: "Could not create user!",
            });
          }
        });
      } else {
        callback(400, {
          error: "User already exists!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};
// post request
// @TODO: Authentication
handler._users.get = (req, callback) => {
  // check the phone number if valid
  const phone =
    typeof req.queryStringObject.phone === "string" &&
    req.queryStringObject.phone.trim().length === 11
      ? req.queryStringObject.phone.trim()
      : false;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err, userData) => {
      if (!err && userData && Object.keys(userData).length > 0) {
        delete userData.password;
        callback(200, userData);
      } else {
        callback(400, {
          message: "User data not found",
        });
      }
    });
  } else {
    callback(404, {
      message: "Invalid phone number provided",
    });
  }
};
// put request
// @TODO: Authentication
handler._users.put = (req, callback) => {
  // check the phone number if valid
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone.trim()
      : false;

  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 0
      ? req.body.firstName
      : false;
  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 0
      ? req.body.lastName
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // loopkup the user
      data.read("users", phone, (err1, userData) => {
        if (!err1 && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }
          // store to database
          data.update("users", phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User updated successfully",
              });
            } else {
              callback(400, {
                error: "Could not update user",
              });
            }
          });
        } else {
          callback(400, {
            error: "User not found",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number. please try again",
    });
  }
};
// delete request
// @TODO: Authentication
handler._users.delete = (req, callback) => {
  // check if the pnone number if valid
  const phone =
    typeof req.queryStringObject.phone === "string" &&
    req.queryStringObject.phone.trim().length === 11
      ? req.queryStringObject.phone.trim()
      : false;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err1, userData) => {
      if (!err1 && userData) {
        data.delete("users", phone, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User deleted successfully",
            });
          } else {
            callback(500, { message: "Could not delete the user" });
          }
        });
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, {
      message: "Invalid phone number",
    });
  }
};

module.exports = handler;
