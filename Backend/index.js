require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = 5500;
const cors = require("cors");
app.use(cors());

//db connection
const dbconnection = require("./db/config");

//json middleware to extract json data
app.use(express.json());

//authentication middleware
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

//user router middleware file
const userRoutes = require("./routes/userRoute");

//user router middleware
app.use("/api/users", userRoutes);

//image middleware
app.use("/images", express.static(path.join(__dirname, "images")));

//image router middleware file
const imageRoute = require("./routes/imageRoute");

//image router middleware
app.use("/api/images", authenticationMiddleware, imageRoute);

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
