const fs = require("fs/promises");

function writeStream(data) {
  if (data === null || data === undefined) {
    console.log("writeStream: no data was given!");
    return;
  }
  // recursive: true create parent directories if does not exist...
  fs.mkdir("./flatfiles", { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    const file = fs.createWriteStream("./flatfiles/db.txt");

    file.write(data);
  });
}

module.exports = writeStream;
