const path = require("path");
const fs = require("fs");

const getVideoMeta = async ({ fileName }) => {
    const returnObj = {};
    try {
        const filepPath = path.join(__dirname, "nodeApp", "fileData", fileName);
        if (!fs.existsSync(filepPath)) throw new Error("file not exists");
        const stat = fs.statSync(filepPath);
        const fileSize = stat.size;
        returnObj.fileSize = fileSize;
    } catch (error) {
        console.error("Error: ", error);
        returnObj.error = error.message;
    }
    return returnObj;
}

const streamVideo = async ({ filename, res, range }) => {
    try {
        const filePath = path.join(__dirname, "fileData", filename);
        if (!fs.existsSync(filePath)) throw new Error("file not exists");
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace("bytes=", "").split("-")[0]);
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        fileStream.pipe(res);
    } catch (error) {
        console.log("Error: ", error);
    }
}

module.exports = {
    getVideoMeta,
    streamVideo
}
