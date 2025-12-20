const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
// app.use(express.urlencoded());
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded())

// parse application/json
// app.use(bodyParser.json())
const getRequestInfo = (req) => {
    return portInfo = {
        // Client information
        client: {
            ip: req.ip,
            port: req.socket.remotePort,
            family: req.socket.remoteFamily
        },

        // Server information
        server: {
            port: req.socket.localPort,
            address: req.socket.localAddress
        },

        // URL information
        url: {
            host: req.get('host'),
            protocol: req.protocol,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl,
            path: req.path
        },

        // Headers related to ports and proxies
        headers: {
            host: req.headers.host,
            xForwardedHost: req.headers['x-forwarded-host'],
            xForwardedPort: req.headers['x-forwarded-port'],
            xForwardedProto: req.headers['x-forwarded-proto']
        },

        // Connection information
        connection: {
            encrypted: req.secure,
            method: req.method,
            httpVersion: req.httpVersion
        }
    };
}

app.post("/post-data", (req, res) => {
    console.log("@@@@@@@@@@@@@@dfd@@@", req.body);
    const info = getRequestInfo(req);
    console.log("headers+++++++++++cvfc", req.headers)
    res.json({ message: "data saved", data: req.body });
});

app.get("/get-data", (req, res) => {
    // console.log("@@@@@@@@@@@@@@", req.body);
    const info = getRequestInfo(req);

    console.log("headers++++++++++cdcd  d fcdscds+aaa", info)
    res.json({ message: "data saved", info });
});


app.listen(port, () => {
    console.log("server is running on port", port);
});