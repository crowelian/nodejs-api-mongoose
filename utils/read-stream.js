const fs = require("fs");

async function readStream() {
  return new Promise((resolve, reject) => {
    try {
      const rs = fs.createReadStream("./flatfiles/db.txt");
      let data = "";
      rs.on("data", (chunk) => {
        data += chunk.toString();
      });

      rs.on("end", () => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = readStream;
