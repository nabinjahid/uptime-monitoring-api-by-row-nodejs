/*
 * Title: Data Library
 * Description: Data Library functions for CRUD
 * Author: Md Jahidul Islam
 * Date: 09/09/2025
 *
 */

// dependencies
const fs = require("fs");
// const {promises : fsPro} = require("fs")
const path = require("path");

// module scafolding
const lib = {};

// basedir
lib.basedir = path.join(__dirname, "/../.data/");

// create
lib.create = (dir, file, data, callback) => {
  const filePath = path.join(lib.basedir, dir, `${file}.json`);

  // make sure that directory exists
  fs.mkdir(path.join(lib.basedir, dir), { recursive: true }, (err) => {
    if (err) {
      return callback("Error creating directory");
    }
  });

  // open file for writing (wx = fail if exists)
  fs.open(filePath, "wx", (err1, fileDescriptor) => {
    if (!err1 && fileDescriptor) {
      // stringify data
      const stringData = JSON.stringify(data);
      // write data to the file
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          // close the file
          fs.close(fileDescriptor, (err2) => {
            if (!err2) {
              callback(null); // success
            } else {
              callback("error closing the file", { error: err2 });
            }
          });
        } else {
          callback("error writing the new file", { error: err2 });
        }
      });
    } else {
      callback("file may already exists", { error: err1 });
    }
  });
};
//create fs promise version
// lib.create = async (dir, file, data)=>{
//     const filePath = path.join(lib.basedir, dir, `${file}.json`)

//     try {
//         // ensure directory exists
//         await fsPro.mkdir(path.join(lib.basedir, dir), {recursive: true})

//         // write to the file
//         await fsPro.writeFile(filePath, JSON.stringify(data), {flag:"wx"})

//         return null

//     } catch (err) {
//         return err.message
//     }

// }

// Read data from the file
lib.read = (dir, file, callback) => {
  const filePath = path.join(lib.basedir, dir, `${file}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return callback(err, null);

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseErr) {
      return callback(parseErr, null);
    }

    callback(null, parsedData);
  });
};
// Read file in promise/async-awit pattern
// lib.read = async (dir, file) => {
//     const filePath = path.join(lib.basedir, dir, `${file}.json`);

//     try {
//         const data = await fsPro.readFile(filePath, "utf8");
//         return JSON.parse(data);
//     } catch (err) {
//         return err
//     }
// };

// update data from the file
lib.update = (dir, file, data, callback) => {
  const filePath = path.join(lib.basedir, dir, `${file}.json`);

  // open file to wirte
  fs.open(filePath, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // conver the data to string
      const stringData = JSON.stringify(data);

      // clear the file
      fs.ftruncate(fileDescriptor, (err1) => {
        if (!err1) {
          // writhe to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
              // close the file 
              fs.close(fileDescriptor, (err3)=>{
                if (!err3) {
                    callback(null)
                }else{
                    callback("error to close the file", {error : err3})
                }
              })
            } else {
              callback("error to write file", { error: err2 });
            }
          });
        } else {
          callback("file truncate error", { error: err1 });
        }
      });
    } else {
      callback("file may not exists", { error: err });
    }
  });
};

// promise async/await version
// lib.update = async (dir, file, data) => {
//     const filePath = path.join(lib.basedir, dir, `${file}.json`);
//     try {
//         // Check if file exists
//         await fsPro.access(filePath);
//         await fsPro.writeFile(filePath, JSON.stringify(data));
//         return null;
//     } catch (err) {
//         return err;
//     }
// };



// deleting the file
lib.delete = (dir, file, callback)=>{
    // unlink the file
    const filePath = path.join(lib.basedir, dir, `${file}.json`)
    fs.unlink(filePath, (err)=>{
        if (!err) {
            callback(null)
        }else{
            callback("Error occure to deleting the file", {error: err})
        }
    })
}
// promise async/await version of delete
// lib.delete = async (dir, file) => {
//   const filePath = path.join(lib.basedir, dir, `${file}.json`);

//   try {
//     await fsPro.unlink(filePath);   // delete the file
//     return null;                    // success → return null (like callback(null))
//   } catch (err) {
//     return { error: "Error occurred while deleting the file", details: err };
//   }
// };

module.exports = lib;
