require("dotenv").config();
const express = require("express");
const app = express();
const port = 5500;

//db connection
const dbconnection = require("./db/config");

async function start() {
    try {
        const result = await dbconnection.execute("select 'test' ");
        app.listen(port);
        console.log("database connection established!");
        console.log(`listening on ${port}`);
    } catch (error) {
        console.log(error.message);
    }
}

start();
