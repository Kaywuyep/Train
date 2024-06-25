//const express = require("express");
//const http = require("http");
const app = require("./app");


PORT = process.env.PORT || 3000;
url = `http://127.0.0.1:${PORT}`;

//const server = http.createServer(app);

app.listen(PORT, () => {
    console.log(`server runing on ${url}`);
});