require("dotenv").config();
const express = require("express");
const app = express();
const port = 5500;

//db connection
const dbconnection = require("./db/config");

//json middleware to extract json data
app.use(express.json());

//user router middleware file
const userRoutes = require("./routes/userRoute");

//user router middleware
app.use("/api/users", userRoutes);

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
