const cluster = require("cluster");
const os = require("os");
const http = require("http");
const cpuCount = os.cpus().length;
const port = process.env.PORT;
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const bigFileUplaod = (req, res)=>{
    const returnObj = {error: null};
    try {
        if(!req){
            throw new Error("Req is required");
        }
        // if(!fileName) throw new Error("filename is required");
        const filename = `${Date.now()}_${req.headers["x-filename"]}`;
        const filePath = path.join(__dirname,'fileData', `${filename}`)
        const writeStream = fs.createWriteStream(filePath);
        req.pipe(writeStream);
        writeStream.on("finish", ()=>{
            console.log("file upload")
            res.send({message: "file uplaoded", filename });
        });
        writeStream.on("error", (err) => {
            console.log("errrorroor: ",err);
            return res.send(err.message);
        });
    } catch (error) {
        console.log(error);
        returnObj.error = error.message;
    }
    return returnObj;
}

const bigFileDownload = (req, res, filename)=>{
    const returnObj = {error: null};
    try {
        if(!req){
            throw new Error("Req is required");
        }
        // if(!fileName) throw new Error("filename is required");
        const filePath = path.join(__dirname,'fileData', `${filename}`)
        const stat = fs.statSync(filePath);
        const readStream = fs.createReadStream(filePath);
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-type", "application/octet-stream");
        readStream.pipe(res);
        readStream.on("finish", ()=>{
            console.log("file upload")
            res.send({message: "file Downloaded", filename });
        });
        readStream.on("error", (err) => {
            console.log("errrorroor: ",err);
            return res.send(err.message);
        });
    } catch (error) {
        console.log(error);
        returnObj.error = error.message;
    }
    return returnObj;
}
const startExpressApp = ()=>{
    console.log("express server")
    const express = require("express");
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: "*",
        methods: ["GET","POST"]
    }));
    app.get("/", (req, res) => {
        res.send(`Ok ######### ------- ${process.pid}`);
    });
    app.post("/upload-file", (req, res)=>{
        console.log("file uploading=============", req.body)
        const {fileName = `test_${Date.now()}`} = req.body;
        console.log("file name:", fileName);
        return bigFileUplaod(req, res, fileName)
    })
    app.get("/download-file/:filename", (req, res)=>{
        console.log("file uploading=============", req.query, req.params)
        const {filename = null} = {...req.query, ...req.params};
        console.log("file name:", filename);
        return bigFileDownload(req, res, filename)
    })
    app.listen(port, ()=>{
        console.log("listening at ", port, process.pid);
    })
}

if(cluster.isMaster){
    try {
        for(let i = 2; cpuCount > i; i++){
            cluster.fork();
            cluster.on("listening", (address)=>{
                console.log("worker is listening on: " , address.id);
            })
            console.log(`process ${i+1} is running with pId: ${process.pid}`)
            cluster.on('exit', (w, code, sig)=>{
                console.log(`Worker ${w.process.pid} died, restarting...`);
            });
        }    
    } catch (error) {
      console.log(error);  
    }   
} else {
    try {
        startExpressApp()    
    } catch (error) {
        console.error(error);   
    }
}

